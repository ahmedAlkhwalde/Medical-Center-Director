import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import SpecialtiesPage from "../features/specialties/pages/SpecialtiesPage";
import DoctorsPage from "../features/doctors/pages/DoctorsPage";
import DoctorDetailPage from "../features/doctors/pages/DoctorDetailPage";
import ClinicsPage from "../features/clinics/pages/ClinicsPage";
import MapPage from "./map/MapPage";
import SecretariesPage from "../features/secretaries/pages/SecretariesPage";
import PatientsRecordsPage from "../features/patients/pages/PatientsRecordsPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import SchedulePage from "../features/schedule/pages/SchedulePage";
import ProfilePage from "../features/profile/pages/ProfilePage";
import ChatList from "../pages/conversation/ChatList";
import Conversation from "../pages/conversation/Conversation";
import NotificationPage from "../pages/notification/NotificationPage";

export default function MainPage() {
  return (
    <div>
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
    </div>
  );
}
