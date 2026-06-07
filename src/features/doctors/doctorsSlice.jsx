import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isModalOpen: false,
  editingDoctor: null,
  isDeleteDialogOpen: false,
  doctorToDelete: null,
};

const doctorsSlice = createSlice({
  name: "doctors",
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.editingDoctor = action.payload || null;
      state.isModalOpen = true;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.editingDoctor = null;
    },
    confirmDelete: (state, action) => {
      state.doctorToDelete = action.payload;
      state.isDeleteDialogOpen = true;
    },
    closeDeleteDialog: (state) => {
      state.isDeleteDialogOpen = false;
      state.doctorToDelete = null;
    },
  },
});

export const {
  openModal,
  closeModal,
  confirmDelete,
  closeDeleteDialog,
} = doctorsSlice.actions;

export default doctorsSlice.reducer;