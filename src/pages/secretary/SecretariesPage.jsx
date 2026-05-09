import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  Add,
  PaymentsOutlined,
  PeopleOutline,
  ToggleOffOutlined,
  ToggleOnOutlined,
} from "@mui/icons-material";
import SecretaryCard from "./components/SecretaryCard";
import AddSecretaryModal from "./components/AddSecretaryModal";
import { formatSalary } from "./secretaryFormatters";
import { openModal } from "../../features/secretaries/secretariesSlice";

const normalizeSearchText = (value = "") =>
  value
    .toString()
    .toLowerCase()
    .replace(/[\s\p{P}\p{S}]+/gu, "")
    .replace(/\u0640/g, "")
    .trim();

const SecretariesPage = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.secretaries);
  const { searchQuery } = useSelector((state) => state.ui);

  const normalizedQuery = useMemo(
    () => normalizeSearchText(searchQuery),
    [searchQuery],
  );

  const visibleItems = useMemo(() => {
    if (!normalizedQuery) {
      return items;
    }

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

  const stats = useMemo(() => {
    const totalSalary = items.reduce(
      (sum, item) => sum + (Number(item.salary) || 0),
      0,
    );
    const activeCount = items.filter((item) => item.isActive).length;
    const inactiveCount = items.length - activeCount;

    return [
      {
        id: 1,
        label: "إجمالي السكرتاريا",
        value: items.length,
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
  }, [items]);

  return (
    <section className="w-full min-w-0 space-y-6">
      <div className="overflow-hidden rounded-3xl border theme-border theme-surface-90 theme-gradient-panel p-4 shadow-sm sm:p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1 text-right">
            <h1 className="text-2xl font-bold theme-text-accent sm:text-3xl lg:text-4xl">
              إدارة السكرتاريا
            </h1>
            <p className="max-w-2xl text-sm theme-text-muted sm:text-base">
              إضافة السكرتاريا وتعديل بياناتهم مع التفعيل أو الإلغاء ومتابعة
              الإحصائيات الأساسية.
            </p>
          </div>

          <Motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3 }}
            onClick={() => dispatch(openModal())}
            type="button"
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl theme-accent px-5 py-3 text-sm font-bold theme-text-on-accent shadow-lg transition-all theme-shadow-accent sm:w-auto sm:px-6"
          >
            <Add fontSize="small" />
            إضافة سكرتير جديد
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

      {normalizedQuery && (
        <div className="rounded-2xl border theme-border theme-surface px-4 py-3 text-sm font-medium theme-text-muted shadow-sm">
          يتم عرض {visibleItems.length} نتيجة مطابقة من أصل {items.length} سجل.
        </div>
      )}

      {visibleItems.length > 0 ? (
        <Motion.div
          layout
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {visibleItems.map((item, index) => (
              <SecretaryCard key={item.id} data={item} index={index} />
            ))}
          </AnimatePresence>
        </Motion.div>
      ) : (
        <div className="rounded-3xl border theme-border theme-surface p-6 text-center shadow-sm sm:p-8">
          <p className="text-base font-bold theme-text-accent sm:text-lg">
            لا توجد سكرتاريا مطابقة للبحث الحالي
          </p>
          <p className="mt-2 text-sm theme-text-muted">
            جرّب كلمة بحث مختلفة أو امسح النص للعودة إلى كل النتائج.
          </p>
        </div>
      )}

      <AddSecretaryModal />
    </section>
  );
};

export default SecretariesPage;
