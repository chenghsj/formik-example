import { configureStore } from "@reduxjs/toolkit";
import dataReducer from './reduxSlice/infoSlice'

export const store = configureStore({
  reducer: {
    data: dataReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;