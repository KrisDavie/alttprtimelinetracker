import { createSlice } from "@reduxjs/toolkit"

export interface TimelineEvent {
  timestamp: number
  event: string
}

export interface TimelineState {
  events: TimelineEvent[]
}

const initialState: TimelineState = {
  events: [],
}

export const timelineSlice = createSlice({
  name: "timeline",
  initialState,
  reducers: {
    addEvent: (state, action) => {
      state.events.push(action.payload)
    },
    clearEvents: (state) => {
      state.events = []
    },
  },
})

export const { addEvent, clearEvents } = timelineSlice.actions

export const selectEvents = (state: { timeline: TimelineState }) =>
  state.timeline.events

export default timelineSlice.reducer
