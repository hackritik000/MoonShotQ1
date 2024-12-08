import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface List {
  id: string;
  subject: string;
  short_description: string;
  from: {
    email: string;
    name: string;
  };
  date: number;
}

export interface ExtendedList extends List {
  isActive: boolean;
  isRead: boolean;
  isFavorites: boolean;
}

export interface EmailDataState {
  list: Array<ExtendedList>;
  read: boolean;
  unread: boolean;
  favorite: boolean;
  lastPage: number;
}

const initialState: EmailDataState = {
  list: [],
  read: false,
  unread: false,
  favorite: false,
  lastPage: 0,
};

export const emailSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    addEntry: (state, action: PayloadAction<List[]>) => {
      action.payload.forEach((item) =>
        state.list.push({
          ...item,
          isActive: false,
          isRead: false,
          isFavorites: false,
        }),
      );
      state.lastPage++;
    },
    isActive: (state, action: PayloadAction<{ id: string }>) => {
      state.list.forEach((item) => (item.isActive = false));
      const find = state.list.find((item) => item.id === action.payload.id);
      if (find) {
        find.isActive = true;
        find.isRead = true;
      }
    },
    isReaded: (state, action: PayloadAction<{ id: string }>) => {
      const find = state.list.find((item) => item.id === action.payload.id);
      if (find) {
        find.isRead = true;
      }
    },
    isFavorites: (
      state,
      action: PayloadAction<{ id: string; isFavorites: boolean }>,
    ) => {
      const find = state.list.find((item) => item.id === action.payload.id);
      if (find) {
        find.isFavorites = action.payload.isFavorites;
      }
    },
    clickRead: (state) => {
      state.read = true;
      state.unread = false;
      state.favorite = false;
    },
    clickUnread: (state) => {
      state.read = false;
      state.unread = true;
      state.favorite = false;
    },
    clickFavorite: (state) => {
      state.read = false;
      state.unread = false;
      state.favorite = true;
    },
  },
});

export const {
  addEntry,
  isReaded,
  isActive,
  isFavorites,
  clickRead,
  clickUnread,
  clickFavorite,
} = emailSlice.actions;
export default emailSlice.reducer;
