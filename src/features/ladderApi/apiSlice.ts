import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const baseUrl = "https://alttprladder.com/api/v1/PublicAPI/"

export const ladderApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl, mode: "cors" }),
  reducerPath: "ladderApi",
  endpoints: (builder) => ({
    getCurrentRaceTime: builder.query({
      query: () => ({
        url: `GetCurrentRaceTime`,
        responseHandler: (response) => response.text(),
      }),
    }),
  }),
})

export const { useGetCurrentRaceTimeQuery } = ladderApi
