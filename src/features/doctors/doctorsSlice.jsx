import { createSlice } from "@reduxjs/toolkit";

const getTodayISODate = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60000).toISOString().slice(0, 10);
};

const normalizeProfitRate = (value) => {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue)) {
    return 0;
  }

  return Math.min(100, Math.max(0, parsedValue));
};

export const CLINIC_OPTIONS = [
  { id: 1, label: "عيادة رقم 1" },
  { id: 2, label: "عيادة رقم 2" },
  { id: 3, label: "عيادة رقم 3" },
  { id: 4, label: "عيادة رقم 4" },
  { id: 5, label: "عيادة رقم 5" },
  { id: 6, label: "عيادة رقم 6" },
];

const initialState = {
  doctors: [
    {
      id: 1,
      name: "د. أحمد علي",
      phone: "0932-123-456",
      email: "ahmad.ali@shifa.com",
      contractEndDate: "2027-06-30",
      clinicId: 2,
      specialtyId: 1,
      profitRate: 35,
      joinedAt: "2024-08-01",
      isActive: true,
    },
    {
      id: 2,
      name: "د. منى سعيد",
      phone: "0944-555-999",
      email: "muna.s@shifa.com",
      contractEndDate: "2026-12-31",
      clinicId: 1,
      specialtyId: 2,
      profitRate: 60,
      joinedAt: "2025-02-15",
      isActive: false,
    },
  ],
  nextId: 3,
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
    saveDoctor: (state, action) => {
      const payload = action.payload;
      const doctorData = {
        name: payload.name.trim(),
        phone: payload.phone.trim(),
        email: payload.email.trim(),
        contractEndDate: payload.contractEndDate,
        clinicId: Number(payload.clinicId),
        specialtyId: Number(payload.specialtyId),
        profitRate: normalizeProfitRate(payload.profitRate),
      };

      if (state.editingDoctor) {
        const index = state.doctors.findIndex(
          (doctor) => doctor.id === state.editingDoctor.id,
        );

        if (index !== -1) {
          state.doctors[index] = {
            ...state.doctors[index],
            ...doctorData,
            id: state.editingDoctor.id,
            joinedAt:
              state.doctors[index].joinedAt ||
              state.editingDoctor.joinedAt ||
              getTodayISODate(),
            isActive:
              typeof state.doctors[index].isActive === "boolean"
                ? state.doctors[index].isActive
                : true,
          };
        }
      } else {
        state.doctors.push({
          ...doctorData,
          joinedAt: getTodayISODate(),
          isActive: true,
          id: state.nextId,
        });
        state.nextId += 1;
      }

      state.isModalOpen = false;
      state.editingDoctor = null;
    },
    importDoctors: (state, action) => {
      action.payload.forEach((doctor) => {
        state.doctors.push({
          ...doctor,
          joinedAt: doctor.joinedAt || getTodayISODate(),
          isActive:
            typeof doctor.isActive === "boolean" ? doctor.isActive : true,
          profitRate: normalizeProfitRate(doctor.profitRate),
          id: state.nextId,
        });
        state.nextId += 1;
      });
    },
    toggleDoctorStatus: (state, action) => {
      const doctor = state.doctors.find((item) => item.id === action.payload);
      if (doctor) {
        doctor.isActive = !doctor.isActive;
      }
    },
    confirmDelete: (state, action) => {
      state.doctorToDelete = action.payload;
      state.isDeleteDialogOpen = true;
    },
    executeDelete: (state) => {
      state.doctors = state.doctors.filter(
        (doctor) => doctor.id !== state.doctorToDelete,
      );
      state.isDeleteDialogOpen = false;
      state.doctorToDelete = null;
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
  saveDoctor,
  importDoctors,
  toggleDoctorStatus,
  confirmDelete,
  executeDelete,
  closeDeleteDialog,
} = doctorsSlice.actions;

export default doctorsSlice.reducer;
