import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import { racetimeApi } from "../features/racetimeApi/apiSlice"
import timerSlice from "../features/timer/timerSlice"
import createUsb2snesMiddleware from "../features/usb2snes/usb2snesMiddleware"
import usb2snesSlice from "../features/usb2snes/usb2snesSlice"
import timelineSlice from "../features/timeline/timelineSlice"
import { ladderApi } from "../features/ladderApi/apiSlice"

export const store = configureStore({
  reducer: {
    timer: timerSlice,
    usb2snes: usb2snesSlice,
    timeline: timelineSlice,
    [racetimeApi.reducerPath]: racetimeApi.reducer,
    [ladderApi.reducerPath]: ladderApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      racetimeApi.middleware,
      ladderApi.middleware,
      createUsb2snesMiddleware(),
    ),
})
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
