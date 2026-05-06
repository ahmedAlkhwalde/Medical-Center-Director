import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [
    {
      id: 1,
      clinicName: "عيادة الشفاء - المزة",
      address: "دمشق - المزة - شارع الفيلات - مقابل الحديقة",
    },
    {
      id: 2,
      clinicName: "عيادة الشفاء - أبو رمانة",
      address: "دمشق - أبو رمانة - قرب ساحة الجلاء",
    },
  ],
  nextId: 3,
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
    saveClinic: (state, action) => {
      const payload = {
        clinicName: action.payload.clinicName.trim(),
        address: action.payload.address.trim(),
      };

      if (state.editingItem) {
        const index = state.items.findIndex(
          (item) => item.id === state.editingItem.id,
        );

        if (index !== -1) {
          state.items[index] = {
            ...state.items[index],
            ...payload,
            id: state.editingItem.id,
          };
        }
      } else {
        state.items.push({
          ...payload,
          id: state.nextId,
        });
        state.nextId += 1;
      }

      state.isModalOpen = false;
      state.editingItem = null;
    },
    confirmDelete: (state, action) => {
      state.itemToDelete = action.payload;
      state.isDeleteDialogOpen = true;
    },
    executeDelete: (state) => {
      state.items = state.items.filter(
        (item) => item.id !== state.itemToDelete,
      );
      state.isDeleteDialogOpen = false;
      state.itemToDelete = null;
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
  saveClinic,
  confirmDelete,
  executeDelete,
  closeDeleteDialog,
} = clinicsSlice.actions;

export default clinicsSlice.reducer;
