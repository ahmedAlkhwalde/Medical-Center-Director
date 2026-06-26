import { useEffect,useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { applyThemeMode } from "./app/theme";
import AppSnackbar from "./components/AppSnackbar";
import Layout from "./components/Layout";
import { hideSnackbar } from "./features/uiSlice";

// استيراد جميع الصفحات (نفس ما كان في MainPage)
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

// صفحات المصادقة
import LoginPage from "./features/auth/pages/LoginPage";
import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage";
import VerifyResetCodePage from "./features/auth/pages/VerifyResetCodePage";
import NewPasswordPage from "./features/auth/pages/NewPasswordPage";

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
    notificationChatService.initializeFCM(isTokenProcessed);
    const unsubscribe = notificationChatService.listenToForegroundMessages();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <div className="App">
      <Routes>
        {/* المسارات العامة (غير محمية) */}
        <Route
          path="/"
          element={
            isAuthed ? <Navigate to="/main-page" replace /> : <LoginPage />
          }
        />
        <Route path="/reset-password" element={<ForgotPasswordPage />} />
        <Route
          path="/reset-password/verify"
          element={<VerifyResetCodePage />}
        />
        <Route
          path="/reset-password/new-password"
          element={<NewPasswordPage />}
        />

        {/* المسارات المحمية داخل لوحة التحكم */}
        <Route
          path="/main-page/*"
          element={
            isAuthed ? (
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
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>

      {/* Snackbar العام */}
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