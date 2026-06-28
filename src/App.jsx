import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import { applyThemeMode } from "./app/theme";
import AppSnackbar from "./components/AppSnackbar";
import Layout from "./components/Layout";
import { hideSnackbar } from "./features/uiSlice";

import DashboardPage from "./features/dashboard/pages/DashboardPage";
import SchedulePage from "./features/schedule/pages/SchedulePage";
import SpecialtiesPage from "./features/specialties/pages/SpecialtiesPage";
import DoctorsPage from "./features/doctors/pages/DoctorsPage";
import DoctorDetailPage from "./features/doctors/pages/DoctorDetailPage";
import ClinicsPage from "./features/clinics/pages/ClinicsPage";
import MapPage from "./features/map/pages/MapPage";
import SecretariesPage from "./features/secretaries/pages/SecretariesPage";
import PatientsRecordsPage from "./features/patients/pages/PatientsRecordsPage";
import ProfilePage from "./features/profile/pages/ProfilePage";
import ChatList from "./features/chat/pages/ChatList";
import Conversation from "./features/chat/pages/Conversation";
import NotificationPage from "./features/notification/pages/NotificationPage";
import notificationChatService from "./features/notification/service/notificationChatService";
import NotFoundPage from "./components/NotFoundPage";

import LoginPage from "./features/auth/pages/LoginPage";
import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage";
import VerifyResetCodePage from "./features/auth/pages/VerifyResetCodePage";
import NewPasswordPage from "./features/auth/pages/NewPasswordPage";

// ✅ قائمة المسارات الصحيحة داخل main-page
const VALID_MAIN_PATHS = [
  "",
  "dashboard",
  "schedule",
  "specialties",
  "doctors",
  "clinics",
  "map",
  "secretary",
  "patients-records",
  "profile",
  "conversations",
  "notifications",
];

const MainPageRouter = () => {
  const location = useLocation();
  
  const subPath = location.pathname.replace("/main-page", "").replace(/^\//, "");
  
  const isValidPath = 
    VALID_MAIN_PATHS.includes(subPath) ||
    VALID_MAIN_PATHS.some(path => subPath.startsWith(path + "/"));

  if (!isValidPath) {
    return <NotFoundPage />;
  }

  return (
    <Layout>
      <Routes>
        <Route index element={<DashboardPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="schedule" element={<SchedulePage />} />
        <Route path="specialties" element={<SpecialtiesPage />} />
        <Route path="doctors" element={<DoctorsPage />} />
        <Route path="doctors/:doctorId" element={<DoctorDetailPage />} />
        <Route path="clinics" element={<ClinicsPage />} />
        <Route path="map" element={<MapPage />} />
        <Route path="secretary" element={<SecretariesPage />} />
        <Route path="patients-records" element={<PatientsRecordsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="conversations" element={<ChatList />} />
        <Route path="conversations/view/:id" element={<Conversation />} />
        <Route path="notifications" element={<NotificationPage />} />
      </Routes>
    </Layout>
  );
};

function App() {
  const darkMode = useSelector((state) => state.ui.darkMode);
  const token = useSelector((state) => state.auth.token);
  const snackbar = useSelector((state) => state.ui.snackbar);
  const dispatch = useDispatch();
  const isAuthed = Boolean(token);
  const isTokenProcessed = useRef(false);

  useEffect(() => {
    applyThemeMode(darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (token) {
      const timer = setTimeout(() => {
        notificationChatService.initializeFCM(isTokenProcessed);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      const unsubscribe = notificationChatService.listenToForegroundMessages();
      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, [token]);

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            isAuthed ? <Navigate to="/main-page" replace /> : <LoginPage />
          }
        />
        <Route path="/reset-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/verify" element={<VerifyResetCodePage />} />
        <Route path="/reset-password/new-password" element={<NewPasswordPage />} />

        <Route
          path="/main-page/*"
          element={
            isAuthed ? <MainPageRouter /> : <Navigate to="/" replace />
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        variant={snackbar.variant}
        duration={snackbar.duration}
        onClose={() => dispatch(hideSnackbar())}
      />
    </div>
  );
}

export default App;