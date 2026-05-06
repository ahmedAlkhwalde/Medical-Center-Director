import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import LoginPage from "./Login/LoginPage";
import SpecialtiesPage from "./specialties/SpecialtiesPage";

const Dashboard = () => <div className="text-xl">محتوى لوحة القيادة</div>;
const Reports = () => <div className="text-xl">محتوى التقارير المالية</div>;

export default function MainPage() {
  return (
    <div>
      <Layout>
        <Routes>
          {/* <Route index element={<Dashboard />} /> */}
          <Route path="schedule" element={<Dashboard />} />
          <Route path="specialties" element={<SpecialtiesPage />} />
          <Route path="doctors" element={<Reports />} />
          <Route path="secretaries" element={<Reports />} />
          <Route path="patients-records" element={<Reports />} />
        </Routes>
      </Layout>
    </div>
  );
}
