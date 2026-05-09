import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  Add,
  AttachMoneyOutlined,
  CategoryOutlined,
  PaymentsOutlined,
  TrendingUpOutlined,
} from "@mui/icons-material";
import SpecialtyCard from "./components/SpecialtyCard";
import AddSpecialtyModal from "./components/AddSpecialtyModal";
import DeleteConfirmDialog from "./components/DeleteConfirmDialog";
import { openModal } from "../../features/specialties/specialtiesSlice";

const formatCurrency = (value = 0) =>
  `${new Intl.NumberFormat("ar-SY", { maximumFractionDigits: 0 }).format(
    Number(value) || 0,
  )} ل.س`;

const SpecialtiesPage = () => {
  const { items } = useSelector((state) => state.specialties);
  const { searchQuery } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const visibleItems = normalizedQuery
    ? items.filter((item) => item.name.toLowerCase().includes(normalizedQuery))
    : items;

  const stats = useMemo(() => {
    const totals = items.reduce(
      (accumulator, item) => {
        const price = Number(item.price) || 0;
        const followUpPrice = Number(item.followUpPrice) || 0;

        accumulator.price += price;
        accumulator.followUpPrice += followUpPrice;
        accumulator.highest = Math.max(accumulator.highest, price);
        return accumulator;
      },
      { price: 0, followUpPrice: 0, highest: 0 },
    );

    const averagePrice = items.length
      ? Math.round(totals.price / items.length)
      : 0;
    const averageFollowUpPrice = items.length
      ? Math.round(totals.followUpPrice / items.length)
      : 0;

    return [
      {
        id: 1,
        label: "إجمالي الاختصاصات",
        value: items.length,
        note: "جميع الأقسام المسجلة",
        icon: <CategoryOutlined />,
      },
      {
        id: 2,
        label: "متوسط سعر الكشفية",
        value: formatCurrency(averagePrice),
        note: "المعدل العام للكشفية",
        icon: <AttachMoneyOutlined />,
      },
      {
        id: 3,
        label: "متوسط سعر المراجعة",
        value: formatCurrency(averageFollowUpPrice),
        note: "المعدل العام للمراجعة",
        icon: <PaymentsOutlined />,
      },
      {
        id: 4,
        label: "أعلى سعر كشفية",
        value: formatCurrency(totals.highest),
        note: "أكبر قيمة مسجلة",
        icon: <TrendingUpOutlined />,
      },
    ];
  }, [items]);

  return (
    <section className="w-full min-w-0 space-y-6">
      <div className="overflow-hidden rounded-3xl border theme-border theme-surface-90 theme-gradient-panel p-4 shadow-sm sm:p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1 text-right">
            <h1 className="text-2xl font-bold theme-text-accent sm:text-3xl lg:text-4xl">
              إدارة الاختصاصات الطبية
            </h1>
            <p className="max-w-2xl text-sm theme-text-muted sm:text-base">
              التحكم الكامل في الأقسام الطبية والرسوم التشخيصية المرتبطة بها.
            </p>
          </div>

          <Motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3 }}
            onClick={() => dispatch(openModal())}
            className="flex cursor-pointer w-full items-center justify-center gap-2 rounded-xl theme-accent px-5 py-3 font-bold text-sm theme-text-on-accent shadow-lg transition-all theme-shadow-accent sm:w-auto sm:px-6"
          >
            <Add fontSize="small" />
            إضافة اختصاص جديد
          </Motion.button>
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

      <Motion.div
        layout
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-6"
      >
        <AnimatePresence mode="popLayout">
          {visibleItems.length > 0 ? (
            visibleItems.map((item, index) => (
              <SpecialtyCard key={item.id} data={item} index={index} />
            ))
          ) : (
            <div className="col-span-full rounded-3xl border theme-border theme-surface p-6 text-center shadow-sm sm:p-8">
              <p className="text-base font-bold theme-text-accent sm:text-lg">
                لا توجد اختصاصات مطابقة للبحث الحالي
              </p>
              <p className="mt-2 text-sm theme-text-muted">
                جرّب كلمة بحث مختلفة أو امسح النص للعودة إلى كل النتائج.
              </p>
            </div>
          )}
        </AnimatePresence>
      </Motion.div>

      <AddSpecialtyModal />
      <DeleteConfirmDialog />
    </section>
  );
};
export default SpecialtiesPage;
