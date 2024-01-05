import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import {
  selectSyncLocation,
  setSyncLocation,
  start,
  stop,
} from "../timer/timerSlice"
import { Dispatch } from "@reduxjs/toolkit"

const baseUrl = "https://racetime.gg/alttpr/"

const triggerTimer = (data: any, serverTime: string, dispatch: Dispatch) => {
  const serverTimeTS = Date.parse(serverTime)
  const localTimeTS = Date.now()
  const offset = localTimeTS - serverTimeTS

  const payload = {
    startTS: Date.parse(data.race.started_at),
    offset,
  }
  dispatch(start(payload))
  dispatch(setSyncLocation("racetime"))
}

export const racetimeApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl, mode: "cors" }),
  reducerPath: "racetimeApi",
  endpoints: (builder) => ({
    getAllRaces: builder.query({
      query: () => `races/data`,
    }),
    getRaceData: builder.query({
      query: (id) => `${id}/data`,
      transformResponse: async (apiResponse: any, meta, args) => {
        return {
          apiResponse,
          serverTime: meta?.response?.headers.get("X-Date-Exact"),
        }
      },
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        // Once we have the response, work out the difference between the server time and the local time, add to timer state offset
        const data = (await queryFulfilled).data

        const rtgg_ws = new WebSocket(
          `wss://racetime.gg/${data.apiResponse.websocket_url}`,
        )
        rtgg_ws.onopen = () => {
          rtgg_ws.onmessage = (event) => {
            const wsData = JSON.parse(event.data)
            if (wsData.type === "race.data") {
              if (wsData.race.ended_at) {
                dispatch(stop())
                rtgg_ws.close()
              } else if (wsData.race.started_at) {
                triggerTimer(
                  wsData,
                  data.serverTime ?? Date.now().toString(),
                  dispatch,
                )
              }
            }
          }
        }
      },
    }),
  }),
})

export const { useGetAllRacesQuery, useGetRaceDataQuery } = racetimeApi
