import { useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  PaymentsOutlined,
  PeopleOutline,
  ToggleOffOutlined,
  ToggleOnOutlined,
} from "@mui/icons-material";
import { openModal } from "../store/secretariesSlice";
import { useSecretariesQuery } from "../service/secretariesService";
import { formatSalary } from "../components/secretaryFormatters";

// دالة معالجة النصوص للبحث الدقيق والمستقر
const normalizeSearchText = (value = "") =>
  value
    .toString()
    .toLowerCase()
    .replace(/[\s\p{P}\p{S}]+/gu, "")
    .replace(/\u0640/g, "")
    .trim();

export const useSecretariesPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  
  // جلب نص البحث من ريدكس وحالة البيانات من الخدمة
  const { searchQuery } = useSelector((state) => state.ui);
  const { data, isLoading, isError } = useSecretariesQuery();

  const items = useMemo(() => data?.items ?? [], [data?.items]);
  const apiStats = useMemo(() => data?.stats ?? {}, [data?.stats]);

  const normalizedQuery = useMemo(
    () => normalizeSearchText(searchQuery),
    [searchQuery],
  );

  // تصفية السكرتاريا بناءً على حقول متعددة وعلاقة منطقية مرنة
  const visibleItems = useMemo(() => {
    if (!normalizedQuery) return items;

    return items.filter((item) => {
      const searchableText = normalizeSearchText(
        [
          item.name,
          item.phone,
          item.email,
          item.salary,
          item.isActive ? "مفعّل" : "معطّل",
        ].join(" "),
      );

      return searchableText.includes(normalizedQuery);
    });
  }, [items, normalizedQuery]);

  // بناء كروت الإحصائيات الأربعة
  const stats = useMemo(() => {
    const totalSalary =
      apiStats.total_salaries ??
      items.reduce((sum, item) => sum + (Number(item.salary) || 0), 0);
    const activeCount =
      apiStats.active_count ?? items.filter((item) => item.isActive).length;
    const inactiveCount = apiStats.inactive_count ?? items.length - activeCount;
    const totalCount = apiStats.total_count ?? items.length;

    return [
      {
        id: 1,
        label: "إجمالي السكرتاريا",
        value: totalCount,
        note: "عدد السجلات المسجلة",
        icon: <PeopleOutline />,
      },
      {
        id: 2,
        label: "المفعّلة",
        value: activeCount,
        note: "السجلات النشطة حاليًا",
        icon: <ToggleOnOutlined />,
      },
      {
        id: 3,
        label: "المعطّلة",
        value: inactiveCount,
        note: "السجلات غير النشطة",
        icon: <ToggleOffOutlined />,
      },
      {
        id: 4,
        label: "إجمالي الرواتب",
        value: formatSalary(totalSalary),
        note: "مجموع الرواتب الشهرية",
        icon: <PaymentsOutlined />,
      },
    ];
  }, [apiStats, items]);

  // تأثير نقل المستخدم لعنصر محدد مع تمييزه بظل مؤقت
  useEffect(() => {
    if (!isLoading && location.state?.scrollTo) {
      const scrollId = location.state.scrollTo;
      const element = document.querySelector(`[data-scroll-id="${scrollId}"]`);
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

  const isInitialLoading = isLoading && items.length === 0;

  const handleOpenAddModal = () => {
    dispatch(openModal());
  };

  return {
    items,
    visibleItems,
    stats,
    isInitialLoading,
    isError,
    normalizedQuery,
    handleOpenAddModal,
  };
};