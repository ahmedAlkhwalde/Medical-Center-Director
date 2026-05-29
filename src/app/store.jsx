import dashboardReducer from "../features/dashboard/dashboardSlice";
import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "../features/uiSlice";
import authReducer from "../features/auth/authSlice";
import specialtiesReducer from "../features/specialties/specialtiesSlice";
import doctorsReducer from "../features/doctors/doctorsSlice";
import clinicsReducer from "../features/clinics/clinicsSlice";
import mapReducer from "../features/map/mapSlice";
import secretariesReducer from "../features/secretaries/secretariesSlice";
import patientsReducer from "../features/patients/patientsSlice";
import scheduleReducer from "../features/schedule/scheduleSlice";
import chatReducer from "../features/chat/chatSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    specialties: specialtiesReducer,
    doctors: doctorsReducer,
    clinics: clinicsReducer,
    map: mapReducer,
    dashboard: dashboardReducer,
    secretaries: secretariesReducer,
    patients: patientsReducer,
    schedule: scheduleReducer,
    chat: chatReducer,
  },
});
