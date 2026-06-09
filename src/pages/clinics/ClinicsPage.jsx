import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  Add,
  BusinessOutlined,
  TrendingDownOutlined,
  LocalFireDepartment,
  PeopleOutline,
} from "@mui/icons-material";
import ClinicCard from "./components/ClinicCard";
import AddClinicModal from "./components/AddClinicModal";
import DeleteClinicDialog from "./components/DeleteClinicDialog";
import { openModal } from "../../features/clinics/clinicsSlice";
import { useClinicsQuery } from "../../service/clinicsService";

const normalizeSearchText = (value = "") =>
  value
    .toString()
    .toLowerCase()
    .replace(/[\s\p{P}\p{S}]+/gu, "")
    .replace(/\u0640/g, "")
    .trim();

const ClinicsPage = () => {
  const dispatch = useDispatch();
  const { searchQuery } = useSelector((state) => state.ui);
  const { data, isLoading, isError } = useClinicsQuery();
  const items = data?.items ?? [];
  const apiStats = data?.stats ?? {};
  console.log(apiStats);

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
        [item.clinicName, item.address].join(" "),
      );

      return searchableText.includes(normalizedQuery);
    });
  }, [items, normalizedQuery]);

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

  const isInitialLoading = isLoading && items.length === 0;

  return (
    <section className="w-full min-w-0 space-y-6">
      <div className="overflow-hidden rounded-3xl border theme-border theme-surface-90 theme-gradient-panel p-4 shadow-sm sm:p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1 text-right">
            <h1 className="text-2xl font-bold theme-text-accent sm:text-3xl lg:text-4xl">
              إدارة العيادات
            </h1>
            <p className="max-w-2xl text-sm theme-text-muted sm:text-base">
              إدارة بيانات العيادات وعناوينها مع عرض بطاقات واضح ومتجاوب.
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
            إضافة عيادة جديدة
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
          {isInitialLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`clinic-skeleton-${index}`}
                className="rounded-2xl border theme-border theme-surface p-4 shadow-sm sm:p-5 animate-pulse"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2 text-right">
                    <div className="h-3 w-24 rounded-full bg-slate-200/80 dark:bg-slate-700/60" />
                    <div className="h-6 w-36 rounded-full bg-slate-200/70 dark:bg-slate-700/50" />
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-slate-200/70 dark:bg-slate-700/50" />
                </div>
                <div className="mt-4 space-y-3">
                  <div className="h-16 rounded-xl bg-slate-200/60 dark:bg-slate-700/40" />
                  <div className="h-10 rounded-xl bg-slate-200/50 dark:bg-slate-700/30" />
                </div>
              </div>
            ))
          ) : isError ? (
            <div className="col-span-full rounded-3xl border theme-border theme-surface p-6 text-center shadow-sm sm:p-8">
              <p className="text-base font-bold theme-text-accent sm:text-lg">
                حدث خطأ أثناء تحميل العيادات
              </p>
              <p className="mt-2 text-sm theme-text-muted">
                حاول مرة أخرى بعد قليل.
              </p>
            </div>
          ) : visibleItems.length > 0 ? (
            visibleItems.map((item, index) => (
              <ClinicCard key={item.id} data={item} index={index} />
            ))
          ) : (
            <div className="col-span-full rounded-3xl border theme-border theme-surface p-6 text-center shadow-sm sm:p-8">
              <p className="text-base font-bold theme-text-accent sm:text-lg">
                لا توجد عيادات مطابقة للبحث الحالي
              </p>
              <p className="mt-2 text-sm theme-text-muted">
                جرّب كلمة بحث مختلفة أو امسح النص للعودة إلى كل النتائج.
              </p>
            </div>
          )}
        </AnimatePresence>
      </Motion.div>

      <AddClinicModal />
      <DeleteClinicDialog />
    </section>
  );
};

export default ClinicsPage;
