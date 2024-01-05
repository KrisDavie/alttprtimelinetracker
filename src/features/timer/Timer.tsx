import React, { useEffect } from "react"
import { selectStatus, start, stop, selectStart } from "./timerSlice"
import { useAppSelector, useAppDispatch } from "../../app/hooks"
import { Button } from "@/components/ui/button"
import Timeline from "../timeline/Timeline"
import { connect, poll, selectCurDiff } from "../usb2snes/usb2snesSlice"
import { addEvent } from "../timeline/timelineSlice"
import { getEvents } from "../../utils/getEvents"
import NewWindow from "react-new-window"
import LadderButton from "../ladderApi/LadderButton"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"

export function Timer() {
  const [duration, setDuration] = React.useState(0)
  const startTime = useAppSelector(selectStart)
  const status = useAppSelector(selectStatus)
  const offset = useAppSelector((state) => state.timer.offset)
  const [timelineDurationToShow, setTimelineDurationToShow] = React.useState(0)
  const [popupOpen, setPopupOpen] = React.useState(false)
  const [showTFP, setShowTFP] = React.useState(true)
  const connectedDevice = useAppSelector(
    (state) => state.usb2snes.connectedDevice,
  )
  const sramDiff = useAppSelector(selectCurDiff)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (status === "running") {
      const interval = setInterval(() => {
        setDuration(Date.now() - startTime - offset)
      }, 10)
      return () => clearInterval(interval)
    }
  }, [status, startTime, offset])

  useEffect(() => {
    // While we aren't in-game (timer not running), poll faster to catch the start asap
    if (connectedDevice) {
      const interval = setInterval(
        () => {
          dispatch(poll())
        },
        status === "running" ? 1000 : 100,
      )
      return () => clearInterval(interval)
    }
  }, [connectedDevice, status])

  useEffect(() => {
    if (connectedDevice && sramDiff) {
      // Loop over sramDiff keys
      const events = getEvents(sramDiff)
      events.forEach((ename) => {
        dispatch(
          addEvent({
            timestamp: Date.now() - startTime - offset,
            event: ename,
          }),
        )
      })
    }
  }, [sramDiff])

  const handleClick = (event: React.MouseEvent) => {
    if (status !== "running") {
      dispatch(start({ startTS: Date.now() }))
    } else {
      dispatch(stop())
    }
  }

  const handleConnect = (event: React.MouseEvent) => {
    dispatch(connect())
  }

  const formatTime = (time: number) => {
    const date = new Date(Math.abs(time))

    const hours = date.getUTCHours()
    const minutes = date.getUTCMinutes()
    const seconds = date.getUTCSeconds()
    const milliseconds = date.getUTCMilliseconds()
    return `${time < 0 ? "-" : ""}${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}:${milliseconds
      .toString()
      .slice(0, 2)
      .padStart(2, "0")}`
  }

  const popup = (event: React.MouseEvent) => {
    setPopupOpen(true)
  }

  return (
    <>
      <div className="flex flex-row">
        <Button className="mx-1" onClick={handleConnect}>
          Connect Autotracking
        </Button>
        <Button className="mx-1" onClick={handleClick}>
          Start/Stop
        </Button>
        <LadderButton />
        <Button className="mx-1" onClick={popup}>
          Timeline Popup
        </Button>
      </div>
      <div className="my-2 mx-2">
        timer:{" "}
        {status === "running" ? formatTime(duration) : formatTime(-1000 * 15)}
      </div>
      <div className="my-2 mx-2">
        Minutes to display (0 = All events): {timelineDurationToShow}
      </div>
      <Slider
        defaultValue={[0]}
        min={0}
        max={120}
        step={5}
        value={[timelineDurationToShow]}
        onValueChange={(value) => setTimelineDurationToShow(value[0])}
        className="w-1/4 my-3 mx-2"
      />
      <div className="my-5 mx-2 flex items-center space-x-2">
        <Checkbox
          id="showTFP"
          checked={showTFP}
          onCheckedChange={() => {
            setShowTFP(!showTFP)
          }}
        />
        <label
          htmlFor="showTFP"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Show Triforce Pieces On Timeline
        </label>
      </div>
      {popupOpen && (
        <NewWindow
          title="ALTTPR Timeline Popup"
          onUnload={() => setPopupOpen(false)}
          features={{ width: 2560, height: 150 }}
          center="screen"
        >
          <div className="w-screen h-screen bg-current">
            <Timeline
              duration={duration}
              maxDuration={timelineDurationToShow}
              displayTFP={showTFP}
            />
          </div>
        </NewWindow>
      )}
    </>
  )
}

export default Timer
