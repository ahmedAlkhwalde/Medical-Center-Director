import { useState, useEffect, useMemo } from "react";
import { useSchedulesQuery } from "../service/schedulesService";
import { useSpecialtiesQuery } from "../../specialties/service/specialtiesService";
import { normalizeSearchText } from "../components/scheduleFormatters";

export const useSchedule = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState("");
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );

  // جلب الاختصاصات من الخادم
  const { data: specialties = [] } = useSpecialtiesQuery();

  // استدعاء جداول الدوام بناءً على الاختصاص المختار
  const {
    data: schedules = [],
    isLoading: isSchedulesLoading,
    isError,
  } = useSchedulesQuery(selectedSpecialtyId);

  // مراقبة حجم الشاشة للتجاوب مع الهواتف المحمولة
  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const mediaQuery = window.matchMedia("(max-width: 767.98px)");
    const handleChange = (event) => setIsMobile(event.matches);

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // الفلترة المحلية المتبقية للبحث بالاسم أو العيادة أو الاختصاص
  const filteredSchedule = useMemo(() => {
    const normalizedQuery = normalizeSearchText(searchQuery);

    return schedules.filter((item) => {
      const searchableText = normalizeSearchText(
        [item.doctor.name, item.doctor.specialization, item.doctor.clinic].join(
          " ",
        ),
      );

      return !normalizedQuery || searchableText.includes(normalizedQuery);
    });
  }, [searchQuery, schedules]);

  // إعادة تعيين الفلاتر
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedSpecialtyId("");
  };

  const hasActiveFilters = Boolean(searchQuery || selectedSpecialtyId);

  return {
    searchQuery,
    setSearchQuery,
    selectedSpecialtyId,
    setSelectedSpecialtyId,
    isMobile,
    specialties,
    schedules,
    isSchedulesLoading,
    isError,
    filteredSchedule,
    handleResetFilters,
    hasActiveFilters,
  };
};
