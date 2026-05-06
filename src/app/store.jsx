import { configureStore } from '@reduxjs/toolkit';
import uiReducer from '../features/uiSlice';
import authReducer from '../features/auth/authSlice';
import specialtiesReducer from '../features/specialties/specialtiesSlice';
import doctorsReducer from '../features/doctors/doctorsSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    specialties: specialtiesReducer,
    doctors: doctorsReducer, 
  },
});