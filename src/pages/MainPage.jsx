import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import SpecialtiesPage from "./specialties/SpecialtiesPage";
import DoctorsPage from "./doctors/DoctorsPage";
import ClinicsPage from "./clinics/ClinicsPage";
import SecretariesPage from "./secretary/SecretariesPage";
import PatientsRecordsPage from "./patients/PatientsRecordsPage";
import SchedulePage from "./schedule/SchedulePage";

export default function MainPage() {
  return (
    <div>
      <Layout>
        <Routes>
          <Route index element={<SchedulePage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="specialties" element={<SpecialtiesPage />} />
          <Route path="doctors" element={<DoctorsPage />} />
          <Route path="clinics" element={<ClinicsPage />} />
          <Route path="secretary" element={<SecretariesPage />} />
          <Route path="patients-records" element={<PatientsRecordsPage />} />
        </Routes>
      </Layout>
    </div>
  );
}
