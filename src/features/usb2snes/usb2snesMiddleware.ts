import {
  AnyAction,
  Dispatch,
  Middleware,
  MiddlewareAPI,
} from "@reduxjs/toolkit"
import { setDeviceList, setConnectedDevice, setCurSRAM } from "./usb2snesSlice"
import { start, stop } from "../timer/timerSlice"

const createUsb2snesMiddleware = (): Middleware => {
  let socket: WebSocket

  return (api: MiddlewareAPI) => (next: Dispatch) => (action: AnyAction) => {
    let originalState = api.getState()
    const wsHost = originalState.usb2snes.wsHost
    const wsPort = originalState.usb2snes.wsPort
    switch (action.type) {
      case "usb2snes/connect":
        // Establish connection to websocket server and connect to the first available device
        socket = new WebSocket(`ws://${wsHost}:${wsPort}`)
        socket.binaryType = "arraybuffer"
        socket.onopen = () => {
          socket.send(
            JSON.stringify({
              Opcode: "DeviceList",
              Space: "SNES",
            }),
          )
          socket.onmessage = (event) => {
            const deviceList = JSON.parse(event.data).Results
            api.dispatch(setDeviceList(deviceList))
            socket.send(
              JSON.stringify({
                Opcode: "Attach",
                Space: "SNES",
                Operands: [deviceList[0]],
              }),
            )
            api.dispatch(setConnectedDevice(deviceList[0]))
          }
        }
        break
      case "usb2snes/connectDevice":
        socket.send(
          JSON.stringify({
            Opcode: "Attach",
            Space: "SNES",
            Operands: [action.payload],
          }),
        )
        break
      case "usb2snes/poll":
        let data: Uint8Array = new Uint8Array()
        socket.send(
          JSON.stringify({
            Opcode: "GetAddress",
            Space: "SNES",
            Operands: ["F50010", "1"],
          }),
        )
        socket.onmessage = (event) => {
          const gamemode = new Uint8Array(event.data)
          if (![0x07, 0x09, 0x0b].includes(gamemode[0])) {
            if (gamemode[0] == 0x19) {
              api.dispatch(stop())
              socket.close()
            } else if (
              gamemode[0] >= 0x05 &&
              gamemode[0] <= 0x0b &&
              originalState.timer.status !== "running" &&
              originalState.timer.sync === "local"
            ) {
              api.dispatch(start({ startTS: Date.now() }))
            }
            return next(action)
          }

          socket.send(
            JSON.stringify({
              Opcode: "GetAddress",
              Space: "SNES",
              Operands: ["F5F000", "500"],
            }),
          )
          socket.onmessage = (event) => {
            data = new Uint8Array([...data, ...new Uint8Array(event.data)])
            if (data.length >= 1280) {
              api.dispatch(setCurSRAM(data))
              data = new Uint8Array()
            }
          }
        }
    }

    return next(action)
  }
}

export default createUsb2snesMiddleware
