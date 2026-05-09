import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "../features/uiSlice";
import authReducer from "../features/auth/authSlice";
import specialtiesReducer from "../features/specialties/specialtiesSlice";
import doctorsReducer from "../features/doctors/doctorsSlice";
import clinicsReducer from "../features/clinics/clinicsSlice";
import secretariesReducer from "../features/secretaries/secretariesSlice";
import patientsReducer from "../features/patients/patientsSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    specialties: specialtiesReducer,
    doctors: doctorsReducer,
    clinics: clinicsReducer,
    secretaries: secretariesReducer,
    patients: patientsReducer,
  },
});
