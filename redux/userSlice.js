import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  uid: null,
  email: null,
  name: "",
  city: "",
  education: "",
  preferredRole: "",
  experience: "",
  skills: [],
  about: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserProfile: (state, action) => {
      return { ...state, ...action.payload };
    },
    clearUserProfile: () => initialState,
  },
});

export const { setUserProfile, clearUserProfile } = userSlice.actions;
export default userSlice.reducer;
