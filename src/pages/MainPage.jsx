import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import SpecialtiesPage from "./specialties/SpecialtiesPage";
import DoctorsPage from "./doctors/DoctorsPage";
import DoctorDetailPage from "./doctors/DoctorDetailPage";
import ClinicsPage from "./clinics/ClinicsPage";
import MapPage from "./map/MapPage";
import SecretariesPage from "./secretary/SecretariesPage";
import PatientsRecordsPage from "./patients/PatientsRecordsPage";
import DashboardPage from "./dashboard/DashboardPage";
import SchedulePage from "./schedule/SchedulePage";
import ChatPage from "./chat/ChatPage";
import ProfilePage from "./profile/ProfilePage";

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
          <Route path="chat" element={<ChatPage />} />
          <Route path="chat/:chatId" element={<ChatPage />} />
        </Routes>
      </Layout>
    </div>
  );
}
