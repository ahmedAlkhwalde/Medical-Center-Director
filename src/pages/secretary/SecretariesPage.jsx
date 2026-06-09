import { useMemo,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  Add,
  PaymentsOutlined,
  PeopleOutline,
  ToggleOffOutlined,
  ToggleOnOutlined,
} from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import SecretaryCard from "./components/SecretaryCard";
import AddSecretaryModal from "./components/AddSecretaryModal";
import DeleteConfirmDialog from "./components/DeleteConfirmDialog";
import { formatSalary } from "./secretaryFormatters";
import { openModal } from "../../features/secretaries/secretariesSlice";
import { useSecretariesQuery } from "../../service/secretariesService";

const normalizeSearchText = (value = "") =>
  value
    .toString()
    .toLowerCase()
    .replace(/[\s\p{P}\p{S}]+/gu, "")
    .replace(/\u0640/g, "")
    .trim();

const SecretariesPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { searchQuery } = useSelector((state) => state.ui);
  const { data, isLoading, isError } = useSecretariesQuery();
  const items = useMemo(() => data?.items ?? [], [data?.items]);
  const apiStats = useMemo(() => data?.stats ?? {}, [data?.stats]);

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
  
  useEffect(() => {
    if (!isLoading && location.state?.scrollTo) {
      const scrollId = location.state.scrollTo;
      const element = document.querySelector(`[data-scroll-id="${scrollId}"]`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.style.boxShadow = "0 0 20px 10px rgba(20, 184, 166, 0.6)";
        element.style.borderRadius = "1rem";
        element.style.transition =
          "box-shadow 0.3s ease, border-radius 0.3s ease";
        setTimeout(() => {
          element.style.boxShadow = "";
          element.style.borderRadius = "";
        }, 2000);
      }
    }
  }, [isLoading, location.state?.scrollTo]);

  const isInitialLoading = isLoading && items.length === 0;

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

      {normalizedQuery && !isInitialLoading && !isError && (
        <div className="rounded-2xl border theme-border theme-surface px-4 py-3 text-sm font-medium theme-text-muted shadow-sm">
          يتم عرض {visibleItems.length} نتيجة مطابقة من أصل {items.length} سجل.
        </div>
      )}

      {isInitialLoading ? (
        <Motion.div
          layout
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6"
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`secretary-skeleton-${index}`}
              className="rounded-2xl border theme-border theme-surface p-4 shadow-sm sm:p-5 animate-pulse"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2 text-right">
                  <div className="h-3 w-24 rounded-full bg-slate-200/80 dark:bg-slate-700/60" />
                  <div className="h-6 w-36 rounded-full bg-slate-200/70 dark:bg-slate-700/50" />
                </div>
                <div className="h-12 w-12 rounded-xl bg-slate-200/70 dark:bg-slate-700/50" />
              </div>
              <div className="mt-4 space-y-3">
                <div className="h-10 rounded-xl bg-slate-200/60 dark:bg-slate-700/40" />
                <div className="h-10 rounded-xl bg-slate-200/50 dark:bg-slate-700/30" />
              </div>
            </div>
          ))}
        </Motion.div>
      ) : isError ? (
        <div className="rounded-3xl border theme-border theme-surface p-6 text-center shadow-sm sm:p-8">
          <p className="text-base font-bold theme-text-accent sm:text-lg">
            حدث خطأ أثناء تحميل السكرتاريا
          </p>
          <p className="mt-2 text-sm theme-text-muted">
            حاول مرة أخرى بعد قليل.
          </p>
        </div>
      ) : visibleItems.length > 0 ? (
        <Motion.div
          layout
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {visibleItems.map((item, index) => (
              <div  key={item.uuid} data-scroll-id={`secretary-${item.uuid}`}>
                <SecretaryCard key={item.id} data={item} index={index} />
              </div>
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
      <DeleteConfirmDialog />
    </section>
  );
};

export default SecretariesPage;
