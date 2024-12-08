import { configureStore } from "@reduxjs/toolkit";
import emailSlice from "./emailSlice";

export const store = configureStore({
  reducer: {
    emails: emailSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
