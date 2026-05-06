import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    isCollapsed: false,
    isMobileOpen: false,
    darkMode: false, // الحالة الجديدة
    searchQuery: "",
  },
  reducers: {
    toggleCollapse: (state) => {
      state.isCollapsed = !state.isCollapsed;
    },
    toggleMobileMenu: (state) => {
      state.isMobileOpen = !state.isMobileOpen;
    },
    closeMobileMenu: (state) => {
      state.isMobileOpen = false;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearSearchQuery: (state) => {
      state.searchQuery = "";
    },
  },
});

export const {
  toggleCollapse,
  toggleMobileMenu,
  closeMobileMenu,
  toggleDarkMode,
  setSearchQuery,
  clearSearchQuery,
} = uiSlice.actions;
export default uiSlice.reducer;
