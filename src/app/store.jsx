import dashboardReducer from "../features/dashboard/store/dashboardSlice";
import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "../features/uiSlice";
import authReducer from "../features/auth/store/authSlice";
import specialtiesReducer from "../features/specialties/store/specialtiesSlice";
import doctorsReducer from "../features/doctors/store/doctorsSlice";
import clinicsReducer from "../features/clinics/store/clinicsSlice";
import mapReducer from "../features/map/mapSlice";
import secretariesReducer from "../features/secretaries/secretariesSlice";
import patientsReducer from "../features/patients/patientsSlice";
import scheduleReducer from "../features/schedule/store/scheduleSlice";
import chatReducer from "../features/chat/chatSlice";
import profileReducer from "../features/profile/profileSlice";

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
    profile: profileReducer,
    schedule: scheduleReducer,
    chat: chatReducer,
  },
});
