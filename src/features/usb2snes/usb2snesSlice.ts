import { createSlice } from "@reduxjs/toolkit"

export interface Usb2snesState {
  wsHost: string
  wsPort: number
  deviceList: string[]
  connectedDevice?: string
  curSRAM: { [key: string]: number }
  prevSRAM: { [key: string]: number }
  sramDiff: { [key: string]: number[] }
}

const initialState: Usb2snesState = {
  wsHost: "localhost",
  wsPort: 8080,
  deviceList: [],
  connectedDevice: undefined,
  curSRAM: {},
  prevSRAM: {},
  sramDiff: {},
}

export const usb2snesSlice = createSlice({
  name: "usb2snes",
  initialState,
  reducers: {
    // Middleware looks for these actions and performed ws operations
    connect: (state) => {},
    poll: (state) => {},

    // Actual state changes
    setHost: (state, action) => {
      state.wsHost = action.payload.host
      state.wsPort = action.payload.port
    },
    setDeviceList: (state, action) => {
      state.deviceList = action.payload
    },
    setConnectedDevice: (state, action) => {
      state.connectedDevice = action.payload
    },
    setCurSRAM: (state, action) => {
      state.prevSRAM = { ...state.curSRAM }
      state.curSRAM = action.payload

      if (Object.keys(state.prevSRAM).length === 0) {
        return
      }
      let diff: Usb2snesState["sramDiff"] = {}
      Object.keys(state.curSRAM).map((addr) => {
        if (state.curSRAM[addr] !== state.prevSRAM[addr]) {
          diff[addr] = [state.prevSRAM[addr], state.curSRAM[addr]]
        }
      })
      state.sramDiff = diff
    },

    clearDiff: (state) => {
      state.sramDiff = {}
    },
  },
})

export const selectCurDiff = (state: { usb2snes: Usb2snesState }) =>
  state.usb2snes.sramDiff
export const selectAvailableDevices = (state: { usb2snes: Usb2snesState }) =>
  state.usb2snes.deviceList
export const {
  connect,
  setDeviceList,
  setHost,
  setConnectedDevice,
  poll,
  setCurSRAM,
  clearDiff,
} = usb2snesSlice.actions
export default usb2snesSlice.reducer
