import { useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  Add,
  FilterAlt,
  PeopleOutline,
  ToggleOffOutlined,
  ToggleOnOutlined,
  TrendingUpOutlined,
  UploadFile,
} from "@mui/icons-material";
import DoctorCard from "./components/DoctorCard";
import AddDoctorModal from "./components/AddDoctorModal";
import {
  CLINIC_OPTIONS,
  openModal,
  toggleDoctorStatus,
} from "../../features/doctors/doctorsSlice";

const normalizeSearchText = (value = "") =>
  value
    .toString()
    .toLowerCase()
    .replace(/[\s\p{P}\p{S}]+/gu, "")
    .replace(/\u0640/g, "")
    .trim();

const DoctorsPage = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const { doctors } = useSelector((state) => state.doctors);
  const { items: specialties } = useSelector((state) => state.specialties);
  const { searchQuery } = useSelector((state) => state.ui);
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState("");

  const specialtyMap = useMemo(
    () =>
      new Map(specialties.map((specialty) => [specialty.id, specialty.name])),
    [specialties],
  );

  const normalizedSearchQuery = useMemo(
    () => normalizeSearchText(searchQuery),
    [searchQuery],
  );

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const specialtyName = specialtyMap.get(doctor.specialtyId) || "";
      const clinicLabel =
        CLINIC_OPTIONS.find((clinic) => clinic.id === doctor.clinicId)?.label ||
        `عيادة رقم ${doctor.clinicId}`;

      const searchableText = normalizeSearchText(
        [
          doctor.name,
          doctor.phone,
          doctor.email,
          specialtyName,
          clinicLabel,
          doctor.clinicId,
          doctor.contractEndDate,
          doctor.joinedAt,
          doctor.isActive ? "مفعّل" : "معطل",
        ].join(" "),
      );

      const matchesSearch =
        !normalizedSearchQuery ||
        searchableText.includes(normalizedSearchQuery);
      const matchesSpecialty =
        !selectedSpecialtyId ||
        String(doctor.specialtyId) === String(selectedSpecialtyId);

      return matchesSearch && matchesSpecialty;
    });
  }, [doctors, normalizedSearchQuery, selectedSpecialtyId, specialtyMap]);

  const stats = useMemo(() => {
    const activeDoctors = doctors.filter((doctor) => doctor.isActive).length;
    const inactiveDoctors = doctors.length - activeDoctors;
    const averageProfitRate = doctors.length
      ? Math.round(
          doctors.reduce(
            (sum, doctor) => sum + (Number(doctor.profitRate) || 0),
            0,
          ) / doctors.length,
        )
      : 0;

    return [
      {
        id: 1,
        label: "إجمالي الأطباء",
        value: doctors.length,
        note: "جميع السجلات المسجلة",
        icon: <PeopleOutline />,
      },
      {
        id: 2,
        label: "المفعّلون",
        value: activeDoctors,
        note: "الأطباء النشطون حاليًا",
        icon: <ToggleOnOutlined />,
      },
      {
        id: 3,
        label: "المعطّلون",
        value: inactiveDoctors,
        note: "الأطباء غير النشطين",
        icon: <ToggleOffOutlined />,
      },
      {
        id: 4,
        label: "متوسط الربح",
        value: `${averageProfitRate}%`,
        note: "متوسط نسبة الربح المسجلة",
        icon: <TrendingUpOutlined />,
      },
    ];
  }, [doctors]);

  return (
    <section className="w-full min-w-0 space-y-6">
      <div className="overflow-hidden rounded-3xl border theme-border theme-surface-90 theme-gradient-panel p-4 shadow-sm sm:p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1 text-right">
            <h1 className="text-2xl font-bold theme-text-accent sm:text-3xl lg:text-4xl">
              إدارة الأطباء
            </h1>
            <p className="max-w-2xl text-sm theme-text-muted sm:text-base">
              إدارة معلومات الأطباء والبحث السريع مع فلترة مباشرة حسب الاختصاص.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-start">
            <div className="relative flex w-full sm:w-64">
              <FilterAlt
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 theme-text-muted"
                fontSize="small"
              />
              <select
                value={selectedSpecialtyId}
                onChange={(event) => setSelectedSpecialtyId(event.target.value)}
                className="w-full cursor-pointer appearance-none rounded-xl border theme-border theme-surface py-3 pr-12  text-sm font-bold theme-text shadow-sm outline-none transition-all focus:ring-2 focus:ring-(--color-accent)"
              >
                <option value="">كل الاختصاصات</option>
                {specialties.map((specialty) => (
                  <option key={specialty.id} value={specialty.id}>
                    {specialty.name}
                  </option>
                ))}
              </select>
            </div>

            <Motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
              onClick={() => fileInputRef.current?.click()}
              type="button"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border theme-border theme-surface px-5 py-3 text-sm font-bold theme-text shadow-sm transition-all sm:w-auto sm:px-6"
            >
              <UploadFile fontSize="small" />
              رفع ملف Excel
            </Motion.button>

            <Motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
              onClick={() => dispatch(openModal())}
              type="button"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl theme-accent px-5 py-3 text-sm font-bold theme-text-on-accent shadow-lg transition-all theme-shadow-accent sm:w-auto sm:px-6"
            >
              <Add fontSize="small" />
              إضافة طبيب جديد
            </Motion.button>
          </div>
        </div>
      </div>

      <Motion.div
        layout
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((stat, index) => (
          <Motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-2xl border theme-border theme-surface p-4 shadow-sm sm:p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 text-right">
                <p className="text-xs font-bold uppercase tracking-wide theme-text-muted">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-bold theme-text-accent">
                  {stat.value}
                </h3>
                <p className="text-sm theme-text-muted">{stat.note}</p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl theme-accent-soft theme-text-accent">
                {stat.icon}
              </div>
            </div>
          </Motion.div>
        ))}
      </Motion.div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
      />

      {filteredDoctors.length > 0 ? (
        <Motion.div
          layout
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredDoctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                specialtyName={
                  specialtyMap.get(doctor.specialtyId) || "غير محدد"
                }
                clinicNumber={doctor.clinicId}
                onEdit={() => dispatch(openModal(doctor))}
                onToggleStatus={() => dispatch(toggleDoctorStatus(doctor.id))}
              />
            ))}
          </AnimatePresence>
        </Motion.div>
      ) : (
        <div className="rounded-3xl border theme-border theme-surface p-6 text-center shadow-sm sm:p-8">
          <p className="text-base font-bold theme-text-accent sm:text-lg">
            لا توجد أطباء مطابقون للبحث أو الفلترة الحالية
          </p>
          <p className="mt-2 text-sm theme-text-muted">
            جرّب تغيير الاسم في البحث أو بدّل الاختصاص.
          </p>
        </div>
      )}

      <AddDoctorModal />
    </section>
  );
};

export default DoctorsPage;
