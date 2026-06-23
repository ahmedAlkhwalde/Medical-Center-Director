import { useMemo, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { openModal, confirmDelete } from "../store/doctorsSlice";
import { useSpecialtiesQuery } from "../../specialties/service/specialtiesService";
import { useDoctorsQuery } from "../service/doctorsService";

// دالة مساعدة لتطهير وتوحيد النصوص للبحث
const normalizeSearchText = (value = "") =>
  value
    .toString()
    .toLowerCase()
    .replace(/[\s\p{P}\p{S}]+/gu, "")
    .replace(/\u0640/g, "")
    .trim();

export const useDoctorsPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState("");

  // طلبات البيانات من السيرفر (RTK Query)
  const { data: apiResponse, isLoading, isError } = useDoctorsQuery(selectedSpecialtyId);
  const { data: specialties = [] } = useSpecialtiesQuery();

  const doctors = apiResponse?.data || [];
  const backendStats = apiResponse?.stats || {};

  const { searchQuery } = useSelector((state) => state.ui);

  const normalizedSearchQuery = useMemo(
    () => normalizeSearchText(searchQuery),
    [searchQuery]
  );

  // 1. فلترة الأطباء محلياً بناءً على البحث النصي فقط (الاختصاص تتم فلترته برمجياً من السيرفر)
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const specialtyName = doctor.specialization?.name || "";
      const clinicLabel = doctor.clinic?.name || "";

      const searchableText = normalizeSearchText(
        [
          doctor.name,
          doctor.phone,
          doctor.email,
          specialtyName,
          clinicLabel,
          doctor.details?.contract_expiry,
          doctor.joined_at,
          doctor.status?.is_active ? "مفعّل" : "معطل",
        ].join(" ")
      );

      return !normalizedSearchQuery || searchableText.includes(normalizedSearchQuery);
    });
  }, [doctors, normalizedSearchQuery]);

  // 2. مراقبة الـ Scroll والانتقال السلس للطبيب المستهدف عند توفره في الـ Navigation State
  useEffect(() => {
    if (!isLoading && location.state?.scrollTo) {
      const scrollId = location.state.scrollTo;
      const element = document.querySelector(`[data-scroll-id="doctor-${scrollId}"]`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.style.boxShadow = "0 0 20px 10px rgba(20, 184, 166, 0.6)";
        element.style.borderRadius = "1rem";
        element.style.transition = "box-shadow 0.3s ease, border-radius 0.3s ease";
        
        const timer = setTimeout(() => {
          element.style.boxShadow = "";
          element.style.borderRadius = "";
        }, 2000);

        return () => clearTimeout(timer);
      }
    }
  }, [isLoading, location.state?.scrollTo]);

  // 3. تجهيز مصفوفة الإحصائيات الذكية بأسماء الأيقونات وبياناتها المحدثة
  const stats = useMemo(() => {
    return [
      {
        id: 1,
        label: "إجمالي الأطباء",
        value: backendStats.total_doctors ?? 0,
        note: `عدد السجلات المسجلة`,
        type: "total",
      },
      {
        id: 2,
        label: "المفعّلون",
        value: backendStats.active_doctors_count ?? 0,
        note: "الأطباء النشطون حاليًا",
        type: "active",
      },
      {
        id: 3,
        label: "الأكثر انشغالاً",
        value: backendStats.most_busy_doctor || "لا يوجد",
        note: "حسب المواعيد والضغط",
        type: "busy",
      },
      {
        id: 4,
        label: "الأعلى دخلاً",
        value: backendStats.top_earner_doctor || "N/A",
        note: `متوسط المواعيد: ${backendStats.avg_appointments_doctor ?? 0}`,
        type: "earner",
      },
    ];
  }, [backendStats]);

  // دالات التحكم والأكشنز المعزولة لتجنب تسريب الـ dispatch للـ UI
  const handleOpenAddModal = () => dispatch(openModal());
  const handleOpenEditModal = (doctor) => dispatch(openModal(doctor));
  const handleToggleStatus = (mappedDoctor) => dispatch(confirmDelete(mappedDoctor));
  const handleViewDetails = (uuid) => navigate(`/main-page/doctors/${uuid}`);

  return {
    specialties,
    filteredDoctors,
    stats,
    isLoading,
    isError,
    selectedSpecialtyId,
    setSelectedSpecialtyId,
    fileInputRef,
    handleOpenAddModal,
    handleOpenEditModal,
    handleToggleStatus,
    handleViewDetails,
  };
};