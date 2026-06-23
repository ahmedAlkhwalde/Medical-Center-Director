import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isModalOpen: false,
  isDeleteDialogOpen: false,
  editingItem: null,
  itemToDelete: null,
};

const clinicsSlice = createSlice({
  name: "clinics",
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.editingItem = action.payload || null;
      state.isModalOpen = true;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.editingItem = null;
    },
    confirmDelete: (state, action) => {
      state.itemToDelete = action.payload;
      state.isDeleteDialogOpen = true;
    },
    closeDeleteDialog: (state) => {
      state.isDeleteDialogOpen = false;
      state.itemToDelete = null;
    },
  },
});

export const {
  openModal,
  closeModal,
  confirmDelete,
  closeDeleteDialog,
} = clinicsSlice.actions;

export default clinicsSlice.reducer;