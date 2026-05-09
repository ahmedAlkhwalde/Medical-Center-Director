import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Search, SearchOff } from "@mui/icons-material";
import {
  clearSearchResults,
  clearSelectedPatient,
  searchPatients,
} from "../../features/patients/patientsSlice";
import PatientCard from "./components/PatientCard";
import PatientRecordDetail from "./components/PatientRecordDetail";

const PatientsRecordsPage = () => {
  const dispatch = useDispatch();
  const { searchResults, selectedPatient } = useSelector(
    (state) => state.patients,
  );
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    dispatch(clearSelectedPatient());
    dispatch(clearSearchResults());

    return () => {
      dispatch(clearSelectedPatient());
      dispatch(clearSearchResults());
    };
  }, [dispatch]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setLocalSearchQuery(query);

    if (query.trim()) {
      dispatch(searchPatients(query));
      setShowSearchResults(true);
    } else {
      dispatch(clearSearchResults());
      setShowSearchResults(false);
    }
  };

  const handlePatientSelect = () => {
    setShowSearchResults(false);
  };

  const handleBackToSearch = () => {
    setShowSearchResults(true);
  };

  const handleResetSearch = () => {
    setLocalSearchQuery("");
    setShowSearchResults(false);
    dispatch(clearSearchResults());
    dispatch(clearSelectedPatient());
  };

  // إذا تم تحديد مريض، أظهر تفاصيله
  if (selectedPatient) {
    return (
      <PatientRecordDetail
        patient={selectedPatient}
        onBack={handleBackToSearch}
      />
    );
  }

  return (
    <div className="w-full min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* صفحة البحث الفارغة */}
        {!showSearchResults && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-125 py-12"
          >
            <Motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-6"
            >
              <SearchOff
                sx={{
                  fontSize: 120,
                  color: "var(--color-text-muted)",
                  opacity: 0.3,
                }}
              />
            </Motion.div>

            <h2 className="text-2xl font-bold theme-text mb-2">
              ابدأ بالبحث عن المريض
            </h2>
            <p className="theme-text-muted text-center mb-8">
              استخدم شريط البحث أعلاه للبحث عن سجل المريض باسمه أو رقم الهاتف
            </p>

            <div className="w-full max-w-md rounded-3xl p-1 theme-gradient-border shadow-lg">
              <div className="relative rounded-3xl theme-surface-90">
                <input
                  type="text"
                  value={localSearchQuery}
                  onChange={handleSearchChange}
                  placeholder="ابحث باسم المريض أو رقم الهاتف..."
                  className="w-full rounded-3xl border-0 bg-transparent py-3 pr-12 pl-4 text-sm theme-text outline-none transition-all placeholder:text-(--color-grey)"
                  autoFocus
                />
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 theme-text-muted pointer-events-none"
                  fontSize="small"
                />
              </div>
            </div>
          </Motion.div>
        )}

        {/* نتائج البحث */}
        {showSearchResults && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* شريط البحث في الصفحة */}
            <div className="sticky top-0 z-10 py-4 mb-6 -mx-3 px-3 backdrop-blur-md theme-surface-90">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={handleResetSearch}
                    className="px-4 py-2 rounded-xl theme-surface-80 theme-text hover:theme-surface-95 transition-colors text-sm"
                  >
                    ← عودة
                  </button>
                  <span className="flex-1 theme-text-muted text-sm">
                    {searchResults.length} نتيجة
                  </span>
                </div>

                <div className="w-full rounded-3xl p-1 theme-gradient-border shadow-lg">
                  <div className="relative rounded-3xl theme-surface-90">
                    <input
                      type="text"
                      value={localSearchQuery}
                      onChange={handleSearchChange}
                      placeholder="ابحث باسم المريض أو رقم الهاتف..."
                      className="w-full rounded-3xl border-0 bg-transparent py-3 pr-12 pl-4 text-sm theme-text outline-none transition-all placeholder:text-(--color-grey)"
                      autoFocus
                    />
                    <Search
                      className="absolute left-4 top-1/2 -translate-y-1/2 theme-text-muted pointer-events-none"
                      fontSize="small"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* قائمة المرضى المطابقين */}
            {searchResults.length > 0 ? (
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {searchResults.map((patient) => (
                    <PatientCard
                      key={patient.id}
                      patient={patient}
                      onClick={handlePatientSelect}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <Motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <SearchOff
                  sx={{
                    fontSize: 80,
                    color: "var(--color-text-muted)",
                    opacity: 0.2,
                    marginBottom: 2,
                  }}
                />
                <p className="theme-text-muted">لم يتم العثور على نتائج</p>
              </Motion.div>
            )}
          </Motion.div>
        )}
      </div>
    </div>
  );
};

export default PatientsRecordsPage;
