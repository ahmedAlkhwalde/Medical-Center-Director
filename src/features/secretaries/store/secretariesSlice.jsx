import { createSlice } from "@reduxjs/toolkit";

const normalizeSalary = (value) => {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue)) {
    return 0;
  }

  return Math.max(0, Math.round(parsedValue));
};

const initialState = {
  items: [
    {
      id: 1,
      name: "سارة محمود",
      phone: "0933-111-222",
      email: "sara.mahmoud@shifa.com",
      salary: 8500000,
      isActive: true,
    },
    {
      id: 2,
      name: "ليلى أحمد",
      phone: "0944-333-444",
      email: "laila.ahmad@shifa.com",
      salary: 9200000,
      isActive: true,
    },
    {
      id: 3,
      name: "ريم حسن",
      phone: "0955-777-888",
      email: "reem.hassan@shifa.com",
      salary: 7800000,
      isActive: false,
    },
  ],
  nextId: 4,
  isModalOpen: false,
  editingItem: null,
  isDeleteDialogOpen: false,
  itemToDelete: null,
};

const secretariesSlice = createSlice({
  name: "secretaries",
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
    saveSecretary: (state, action) => {
      const payload = {
        name: action.payload.name.trim(),
        phone: action.payload.phone.trim(),
        email: action.payload.email.trim(),
        salary: normalizeSalary(action.payload.salary),
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
            isActive:
              typeof state.items[index].isActive === "boolean"
                ? state.items[index].isActive
                : true,
          };
        }
      } else {
        state.items.push({
          ...payload,
          id: state.nextId,
          isActive: true,
        });
        state.nextId += 1;
      }

      state.isModalOpen = false;
      state.editingItem = null;
    },
    toggleSecretaryStatus: (state, action) => {
      const secretary = state.items.find((item) => item.id === action.payload);

      if (secretary) {
        secretary.isActive = !secretary.isActive;
      }
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
  saveSecretary,
  toggleSecretaryStatus,
  confirmDelete,
  executeDelete,
  closeDeleteDialog,
} = secretariesSlice.actions;

export default secretariesSlice.reducer;
