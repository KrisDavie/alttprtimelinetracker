import _SpriteLocs from "../../data/sprite_locs.json"
import { useAppSelector } from "../../app/hooks"
import { selectEvents } from "./timelineSlice"

import "../../index.css"

const SHEET_WIDTH = 20
const SHEET_HEIGHT = 9

function Timeline(props: any) {
  const { duration, maxDuration, displayTFP } = props

  const SpriteLocs: any = _SpriteLocs

  const events = useAppSelector(selectEvents)

  let timelineDuration: number

  if (maxDuration !== 0) {
    timelineDuration = maxDuration * 60 * 1000
  } else {
    timelineDuration = duration
  }

  const eventList = events.map((event, ix) => {
    if (
      event.event === undefined ||
      (event.event === "Triforce Piece" && !displayTFP)
    )
      return null
    // if (
    //   maxDuration > 0 &&
    //   Date.now() - event.timestamp > maxDuration * 60 * 1000
    // )
    //   return null
    const posX = (SHEET_HEIGHT - SpriteLocs[event.event][0]) * 16
    const posY = (SHEET_WIDTH - SpriteLocs[event.event][1]) * 16
    return (
      <div>
        <div
          className="h-[16px] w-[16px] bg-sprite absolute scale-[2] z-10 bottom-8"
          key={`${event.timestamp}-${event.event}`}
          // Tailwind doesn't support dynamic coords, so we use inline styles
          style={{
            backgroundPositionX: `${posY}px`,
            backgroundPositionY: `${posX}px`,
            left: `calc(${
              (event.timestamp / timelineDuration) * 100
            }% - 7.5px)`,
            zIndex: event.timestamp,
          }}
        ></div>
        <div
          key={event.timestamp}
          className="w-0.5 h-8 bg-white absolute bottom-0"
          style={{
            left: `${(event.timestamp / timelineDuration) * 100}%`,
          }}
        ></div>
      </div>
    )
  })

  return (
    <>
      <div className="w-fill h-32 mx-16 relative">
        <div className="w-0.5 h-16 bg-green-500 absolute bottom-0 "></div>
        <div className="w-0.5 h-16 bg-red-500 absolute bottom-0 right-0"></div>
        {eventList}
      </div>
    </>
  )
}

export default Timeline
