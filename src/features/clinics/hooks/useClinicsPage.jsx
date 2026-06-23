import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BusinessOutlined,
  TrendingDownOutlined,
  LocalFireDepartment,
  PeopleOutline,
} from "@mui/icons-material";
import { openModal } from "../store/clinicsSlice";
import { useClinicsQuery } from "../server/clinicsService";

// دالة مساعدة لتطهير ومعالجة نصوص البحث
const normalizeSearchText = (value = "") =>
  value
    .toString()
    .toLowerCase()
    .replace(/[\s\p{P}\p{S}]+/gu, "")
    .replace(/\u0640/g, "")
    .trim();

export const useClinicsPage = () => {
  const dispatch = useDispatch();
  
  // جلب نص البحث من Redux
  const { searchQuery } = useSelector((state) => state.ui);
  
  // جلب البيانات من TanStack Query
  const { data, isLoading, isError } = useClinicsQuery();
  const items = data?.items ?? [];
  const apiStats = data?.stats ?? {};

  // معالجة نص البحث لضمان كفاءة المقارنة
  const normalizedQuery = useMemo(
    () => normalizeSearchText(searchQuery),
    [searchQuery],
  );

  // فلترة العيادات بناءً على الاسم أو العنوان
  const visibleItems = useMemo(() => {
    if (!normalizedQuery) return items;

    return items.filter((item) => {
      const searchableText = normalizeSearchText(
        [item.clinicName, item.address].join(" "),
      );
      return searchableText.includes(normalizedQuery);
    });
  }, [items, normalizedQuery]);

  // بناء وحساب الإحصائيات الأربعة للوحة التحكم
  const stats = useMemo(() => {
    const lessBusyClinic = apiStats.least_busy_clinic;
    const totalCount = apiStats.total_clinics_count ?? items.length;
    const mostBusyClinic =
      apiStats.most_busy_clinic ||
      items.reduce(
        (current, item) =>
          (item.appointmentsCount ?? 0) > (current?.appointmentsCount ?? -1)
            ? item
            : current,
        null,
      )?.clinicName ||
      "غير متوفر";
    const averageDoctors =
      apiStats.avg_doctors_per_clinic ??
      (items.length
        ? (
            items.reduce(
              (sum, item) => sum + (Number(item.doctorsCount) || 0),
              0,
            ) / items.length
          ).toFixed(1)
        : 0);

    return [
      {
        id: 1,
        label: "إجمالي العيادات",
        value: totalCount,
        note: "عدد السجلات المسجلة",
        icon: <BusinessOutlined />,
      },
      {
        id: 2,
        label: "الأكثر ازدحاما",
        value: mostBusyClinic || "غير متوفر",
        note: "حسب عدد المواعيد",
        icon: <LocalFireDepartment />,
      },
      {
        id: 3,
        label: "الأقل ازدحاما",
        value: lessBusyClinic || "غير متوفر",
        note: "حسب عدد المواعيد",
        icon: <TrendingDownOutlined />,
      },
      {
        id: 4,
        label: "متوسط الأطباء",
        value: Math.round(averageDoctors),
        note: "أطباء لكل عيادة",
        icon: <PeopleOutline />,
      },
    ];
  }, [apiStats, items]);

  // تحديد حالة التحميل الابتدائي الصرف
  const isInitialLoading = isLoading && items.length === 0;

  const handleOpenAddModal = () => {
    dispatch(openModal());
  };

  return {
    stats,
    visibleItems,
    isInitialLoading,
    isError,
    handleOpenAddModal,
  };
};