import { Button } from "@/components/ui/button"
import { useGetCurrentRaceTimeQuery } from "./apiSlice"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { setSyncLocation, start } from "../timer/timerSlice"

function LadderButton() {
  const startTime = useAppSelector((state) => state.timer.startTS)

  const { data, isLoading, error, refetch } = useGetCurrentRaceTimeQuery(
    {},
    {
      pollingInterval: 60 * 1000,
      skip: startTime !== 0,
    },
  )
  const dispatch = useAppDispatch()

  const handleClick = (event: React.MouseEvent) => {
    if (data === "0:00:00") {
      // TODO: Add error handling
      return
    } else {
      // Convert HH:MM:SS to ms
      console.log(data, error)
      const toStart = data.slice(0, 1) === "-" ? true : false
      const [hours, minutes, seconds] = data.split(":")
      const ms =
        (parseInt(hours) * 60 * 60 +
          parseInt(minutes) * 60 +
          parseInt(seconds)) *
        1000

      const payload = {
        startTS: toStart ? Date.now() + ms : Date.now() - ms,
        offset: 0,
      }
      dispatch(start(payload))
      dispatch(setSyncLocation("ladder"))
    }
  }

  return (
    <>
      <Button disabled={isLoading || data === "0:00:00"} onClick={handleClick}>
        {data === "0:00:00" ? "No Ladder Race" : "Sync With Ladder"}
      </Button>
    </>
  )
}

export default LadderButton
