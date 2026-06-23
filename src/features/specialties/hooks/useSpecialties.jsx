import { useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  CategoryOutlined,
  AttachMoneyOutlined,
  PaymentsOutlined,
  TrendingUpOutlined,
  TrendingDownOutlined,
  LocalFireDepartment,
  RemoveCircleOutline,
} from "@mui/icons-material";
import { openModal } from "../store/specialtiesSlice";
import { useSpecialtiesQuery } from "../service/specialtiesService";

// دالة تنسيق العملة المحلية
const formatCurrency = (value = 0) =>
  `${new Intl.NumberFormat("ar-SY", { maximumFractionDigits: 0 }).format(
    Number(value) || 0
  )} ل.س`;

export const useSpecialties = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { searchQuery } = useSelector((state) => state.ui);
  
  // جلب البيانات من السيرفر
  const { data: items = [], isLoading, isError } = useSpecialtiesQuery();
  
  const isInitialLoading = isLoading && items.length === 0;
  const normalizedQuery = searchQuery.trim().toLowerCase();

  // تصفية الاختصاصات بناءً على البحث
  const visibleItems = useMemo(() => {
    return normalizedQuery
      ? items.filter((item) => item.name.toLowerCase().includes(normalizedQuery))
      : items;
  }, [items, normalizedQuery]);

  // حساب الإحصائيات التحليلية للاختصاصات
  const stats = useMemo(() => {
    const totals = items.reduce(
      (accumulator, item) => {
        const price = Number(item.price) || 0;
        const followUpPrice = Number(item.followUpPrice) || 0;
        const appointmentsCount = Number(item.appointmentsCount) || 0;

        accumulator.price += price;
        accumulator.followUpPrice += followUpPrice;
        accumulator.highest = Math.max(accumulator.highest, price);
        accumulator.lowest = Math.min(accumulator.lowest, price);
        
        if (appointmentsCount >= accumulator.mostAppointments) {
          accumulator.mostAppointments = appointmentsCount;
          accumulator.mostRequested = item.name;
        }
        if (appointmentsCount <= accumulator.leastAppointments) {
          accumulator.leastAppointments = appointmentsCount;
          accumulator.leastRequested = item.name;
        }
        return accumulator;
      },
      {
        price: 0,
        followUpPrice: 0,
        highest: 0,
        lowest: Number.POSITIVE_INFINITY,
        mostAppointments: -1,
        leastAppointments: Number.POSITIVE_INFINITY,
        mostRequested: "",
        leastRequested: "",
      }
    );

    const averagePrice = items.length ? Math.round(totals.price / items.length) : 0;
    const averageFollowUpPrice = items.length ? Math.round(totals.followUpPrice / items.length) : 0;
    const minPrice = items.length ? totals.lowest : 0;
    const mostRequested = items.length ? totals.mostRequested : "غير متوفر";
    const leastRequested = items.length ? totals.leastRequested : "غير متوفر";

    return [
      { id: 1, label: "إجمالي الاختصاصات", value: items.length, note: "جميع الأقسام المسجلة", icon: <CategoryOutlined /> },
      { id: 2, label: "متوسط سعر الكشفية", value: formatCurrency(averagePrice), note: "المعدل العام للكشفية", icon: <AttachMoneyOutlined /> },
      { id: 3, label: "متوسط سعر المراجعة", value: formatCurrency(averageFollowUpPrice), note: "المعدل العام للمراجعة", icon: <PaymentsOutlined /> },
      { id: 4, label: "أعلى سعر كشفية", value: formatCurrency(totals.highest), note: "أكبر قيمة مسجلة", icon: <TrendingUpOutlined /> },
      { id: 5, label: "أقل سعر كشفية", value: formatCurrency(minPrice), note: "أدنى قيمة مسجلة", icon: <TrendingDownOutlined /> },
      { id: 6, label: "الأكثر طلباً", value: mostRequested || "غير متوفر", note: "حسب عدد المواعيد", icon: <LocalFireDepartment /> },
      { id: 7, label: "الأقل طلباً", value: leastRequested || "غير متوفر", note: "حسب عدد المواعيد", icon: <RemoveCircleOutline /> },
      { id: 8, label: "إجمالي الاختصاصات", value: items.length, note: "جميع الأقسام المسجلة", icon: <CategoryOutlined /> },
    ];
  }, [items]);

  // ملء الإحصائيات الفارغة للحفاظ على قوام التصميم المكون من 8 خانات
  const statsToRender = useMemo(() => {
    const targetCount = 8;
    const filled = [...stats];

    for (let i = filled.length; i < targetCount; i += 1) {
      filled.push({
        id: `placeholder-${i}`,
        label: "إحصائية إضافية",
        value: "—",
        note: "غير متوفر",
        icon: <CategoryOutlined />,
        isPlaceholder: true,
      });
    }
    return filled;
  }, [stats]);

  // تأثير التمرير السلس (Smooth Scroll) وتمييز العنصر المستهدف عند الانتقال
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

  const handleOpenModal = () => dispatch(openModal());

  return {
    visibleItems,
    statsToRender,
    isInitialLoading,
    isError,
    handleOpenModal,
  };
};