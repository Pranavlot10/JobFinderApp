import { createSlice } from "@reduxjs/toolkit";
import { Appearance } from "react-native";

const systemTheme = Appearance.getColorScheme() || "light";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    mode: systemTheme, // 'light' or 'dark'
  },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setTheme: (state, action) => {
      state.mode = action.payload; // explicitly set light/dark
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
