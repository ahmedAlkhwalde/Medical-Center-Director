// import { useMemo } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { motion as Motion } from "framer-motion";
// import {
//   Add,
//   AttachMoneyOutlined,
//   CategoryOutlined,
//   PaymentsOutlined,
//   TrendingDownOutlined,
//   LocalFireDepartment,
//   RemoveCircleOutline,
//   TrendingUpOutlined,
// } from "@mui/icons-material";
// import SpecialtyCard from "./components/SpecialtyCard";
// import AddSpecialtyModal from "./components/AddSpecialtyModal";
// import DeleteConfirmDialog from "./components/DeleteConfirmDialog";
// import { openModal } from "../../features/specialties/specialtiesSlice";
// import { useSpecialtiesQuery } from "../../service/specialtiesService";

// const formatCurrency = (value = 0) =>
//   `${new Intl.NumberFormat("ar-SY", { maximumFractionDigits: 0 }).format(
//     Number(value) || 0,
//   )} ل.س`;

// const SpecialtiesPage = () => {
//   const { searchQuery } = useSelector((state) => state.ui);
//   const dispatch = useDispatch();
//   const { data: items = [], isLoading, isError } = useSpecialtiesQuery();
//   const isInitialLoading = isLoading && items.length === 0;
//   const normalizedQuery = searchQuery.trim().toLowerCase();
  
//   const visibleItems = normalizedQuery
//     ? items.filter((item) => item.name.toLowerCase().includes(normalizedQuery))
//     : items;

//   const stats = useMemo(() => {
//     const totals = items.reduce(
//       (accumulator, item) => {
//         const price = Number(item.price) || 0;
//         const followUpPrice = Number(item.followUpPrice) || 0;
//         const appointmentsCount = Number(item.appointmentsCount) || 0;

//         accumulator.price += price;
//         accumulator.followUpPrice += followUpPrice;
//         accumulator.highest = Math.max(accumulator.highest, price);
//         accumulator.lowest = Math.min(accumulator.lowest, price);
//         if (appointmentsCount >= accumulator.mostAppointments) {
//           accumulator.mostAppointments = appointmentsCount;
//           accumulator.mostRequested = item.name;
//         }
//         if (appointmentsCount <= accumulator.leastAppointments) {
//           accumulator.leastAppointments = appointmentsCount;
//           accumulator.leastRequested = item.name;
//         }
//         return accumulator;
//       },
//       {
//         price: 0,
//         followUpPrice: 0,
//         highest: 0,
//         lowest: Number.POSITIVE_INFINITY,
//         mostAppointments: -1,
//         leastAppointments: Number.POSITIVE_INFINITY,
//         mostRequested: "",
//         leastRequested: "",
//       },
//     );

//     const averagePrice = items.length ? Math.round(totals.price / items.length) : 0;
//     const averageFollowUpPrice = items.length ? Math.round(totals.followUpPrice / items.length) : 0;
//     const minPrice = items.length ? totals.lowest : 0;
//     const mostRequested = items.length ? totals.mostRequested : "غير متوفر";
//     const leastRequested = items.length ? totals.leastRequested : "غير متوفر";

//     return [
//       {
//         id: 1,
//         label: "إجمالي الاختصاصات",
//         value: items.length,
//         note: "جميع الأقسام المسجلة",
//         icon: <CategoryOutlined />,
//       },
//       {
//         id: 2,
//         label: "متوسط سعر الكشفية",
//         value: formatCurrency(averagePrice),
//         note: "المعدل العام للكشفية",
//         icon: <AttachMoneyOutlined />,
//       },
//       {
//         id: 3,
//         label: "متوسط سعر المراجعة",
//         value: formatCurrency(averageFollowUpPrice),
//         note: "المعدل العام للمراجعة",
//         icon: <PaymentsOutlined />,
//       },
//       {
//         id: 4,
//         label: "أعلى سعر كشفية",
//         value: formatCurrency(totals.highest),
//         note: "أكبر قيمة مسجلة",
//         icon: <TrendingUpOutlined />,
//       },
//       {
//         id: 5,
//         label: "أقل سعر كشفية",
//         value: formatCurrency(minPrice),
//         note: "أدنى قيمة مسجلة",
//         icon: <TrendingDownOutlined />,
//       },
//       {
//         id: 6,
//         label: "الأكثر طلباً",
//         value: mostRequested || "غير متوفر",
//         note: "حسب عدد المواعيد",
//         icon: <LocalFireDepartment />,
//       },
//       {
//         id: 7,
//         label: "الأقل طلباً",
//         value: leastRequested || "غير متوفر",
//         note: "حسب عدد المواعيد",
//         icon: <RemoveCircleOutline />,
//       },
//       {
//         id: 8,
//         label: "إجمالي الاختصاصات",
//         value: items.length,
//         note: "جميع الأقسام المسجلة",
//         icon: <CategoryOutlined />,
//       },
//     ];
//   }, [items]);

//   const statsToRender = useMemo(() => {
//     const targetCount = 8;
//     const filled = [...stats];

//     for (let i = filled.length; i < targetCount; i += 1) {
//       filled.push({
//         id: `placeholder-${i}`,
//         label: "إحصائية إضافية",
//         value: "—",
//         note: "غير متوفر",
//         icon: <CategoryOutlined />,
//         isPlaceholder: true,
//       });
//     }

//     return filled;
//   }, [stats]);

//   return (
//     <section className="w-full min-w-0 space-y-6">
//       {/* البانل العلوي وعنوان الصفحة */}
//       <div className="overflow-hidden rounded-3xl border theme-border theme-surface-90 theme-gradient-panel p-4 shadow-sm sm:p-5 md:p-6">
//         <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
//           <div className="space-y-1 text-right">
//             <h1 className="text-2xl font-bold theme-text-accent sm:text-3xl lg:text-4xl">
//               إدارة الاختصاصات الطبية
//             </h1>
//             <p className="max-w-2xl text-sm theme-text-muted sm:text-base">
//               التحكم الكامل في الأقسام الطبية والرسوم التشخيصية المرتبطة بها.
//             </p>
//           </div>

//           {/* الإبقاء على حركتي تمرير ونقر الفأرة لزر الإضافة فقط كـ Micro-interaction */}
//           <Motion.button
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             transition={{ duration: 0.2 }}
//             onClick={() => dispatch(openModal())}
//             className="flex cursor-pointer w-full items-center justify-center gap-2 rounded-xl theme-accent px-5 py-3 font-bold text-sm theme-text-on-accent shadow-lg transition-all theme-shadow-accent sm:w-auto sm:px-6"
//           >
//             <Add fontSize="small" />
//             إضافة اختصاص جديد
//           </Motion.button>
//         </div>
//       </div>

//       {/* لوحة الإحصائيات - تم إزالة وسوم الـ Motion وتحويلها لـ div عادي */}
//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
//         {statsToRender.map((stat) => (
//           <div
//             key={stat.id}
//             className={`rounded-2xl border theme-border theme-surface p-4 shadow-sm sm:p-5 ${stat.isPlaceholder ? "opacity-70" : ""}`}
//           >
//             <div className="flex items-start justify-between gap-3">
//               <div className="space-y-1 text-right">
//                 <p className="text-xs font-bold uppercase tracking-wide theme-text-muted">
//                   {stat.label}
//                 </p>
//                 <h3 className="text-2xl font-bold theme-text-accent">
//                   {stat.value}
//                 </h3>
//                 <p className="text-sm theme-text-muted">{stat.note}</p>
//               </div>
//               <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl theme-accent-soft theme-text-accent">
//                 {stat.icon}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* شبكة عرض الكروت الطبية - تم تحويلها لـ div عادي وإزالة الـ AnimatePresence تماماً */}
//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-6">
//         {isInitialLoading ? (
//           Array.from({ length: 6 }).map((_, index) => (
//             <div
//               key={`skeleton-${index}`}
//               className="rounded-2xl border theme-border theme-surface p-4 shadow-sm sm:p-5 animate-pulse"
//             >
//               <div className="flex items-start justify-between gap-3">
//                 <div className="space-y-2 text-right">
//                   <div className="h-3 w-24 rounded-full bg-slate-200/80 dark:bg-slate-700/60" />
//                   <div className="h-6 w-32 rounded-full bg-slate-200/70 dark:bg-slate-700/50" />
//                   <div className="h-3 w-20 rounded-full bg-slate-200/60 dark:bg-slate-700/40" />
//                 </div>
//                 <div className="h-12 w-12 rounded-xl bg-slate-200/70 dark:bg-slate-700/50" />
//               </div>
//               <div className="mt-4 space-y-3">
//                 <div className="h-10 rounded-xl bg-slate-200/60 dark:bg-slate-700/40" />
//                 <div className="h-10 rounded-xl bg-slate-200/50 dark:bg-slate-700/30" />
//               </div>
//             </div>
//           ))
//         ) : isError ? (
//           <div className="col-span-full rounded-3xl border theme-border theme-surface p-6 text-center shadow-sm sm:p-8">
//             <p className="text-base font-bold theme-text-accent sm:text-lg">
//               حدث خطأ أثناء تحميل الاختصاصات
//             </p>
//             <p className="mt-2 text-sm theme-text-muted">
//               حاول مرة أخرى بعد قليل.
//             </p>
//           </div>
//         ) : visibleItems.length > 0 ? (
//           visibleItems.map((item) => (
//             <SpecialtyCard key={item.id} data={item} />
//           ))
//         ) : (
//           <div className="col-span-full rounded-3xl border theme-border theme-surface p-6 text-center shadow-sm sm:p-8">
//             <p className="text-base font-bold theme-text-accent sm:text-lg">
//               لا توجد اختصاصات مطابقة للبحث الحالي
//             </p>
//             <p className="mt-2 text-sm theme-text-muted">
//               جرّب كلمة بحث مختلفة أو امسح النص للعودة إلى كل النتائج.
//             </p>
//           </div>
//         )}
//       </div>

//       <AddSpecialtyModal />
//       <DeleteConfirmDialog />
//     </section>
//   );
// };

// export default SpecialtiesPage;
import { useMemo,useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  Add,
  AttachMoneyOutlined,
  CategoryOutlined,
  PaymentsOutlined,
  TrendingDownOutlined,
  LocalFireDepartment,
  RemoveCircleOutline,
  TrendingUpOutlined,
} from "@mui/icons-material";
import SpecialtyCard from "./components/SpecialtyCard";
import AddSpecialtyModal from "./components/AddSpecialtyModal";
import DeleteConfirmDialog from "./components/DeleteConfirmDialog";
import { openModal } from "../../features/specialties/specialtiesSlice";
import { useSpecialtiesQuery } from "../../service/specialtiesService";

const formatCurrency = (value = 0) =>
  `${new Intl.NumberFormat("ar-SY", { maximumFractionDigits: 0 }).format(
    Number(value) || 0,
  )} ل.س`;

const SpecialtiesPage = () => {
  const location = useLocation();
  const { searchQuery } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const { data: items = [], isLoading, isError } = useSpecialtiesQuery();
  const isInitialLoading = isLoading && items.length === 0;
  const normalizedQuery = searchQuery.trim().toLowerCase();
  
  const visibleItems = normalizedQuery
    ? items.filter((item) => item.name.toLowerCase().includes(normalizedQuery))
    : items;

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
      },
    );

    

    const averagePrice = items.length ? Math.round(totals.price / items.length) : 0;
    const averageFollowUpPrice = items.length ? Math.round(totals.followUpPrice / items.length) : 0;
    const minPrice = items.length ? totals.lowest : 0;
    const mostRequested = items.length ? totals.mostRequested : "غير متوفر";
    const leastRequested = items.length ? totals.leastRequested : "غير متوفر";

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
      {
        id: 5,
        label: "أقل سعر كشفية",
        value: formatCurrency(minPrice),
        note: "أدنى قيمة مسجلة",
        icon: <TrendingDownOutlined />,
      },
      {
        id: 6,
        label: "الأكثر طلباً",
        value: mostRequested || "غير متوفر",
        note: "حسب عدد المواعيد",
        icon: <LocalFireDepartment />,
      },
      {
        id: 7,
        label: "الأقل طلباً",
        value: leastRequested || "غير متوفر",
        note: "حسب عدد المواعيد",
        icon: <RemoveCircleOutline />,
      },
    ];
  }, [items]);

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


  useEffect(() => {
    if (!isLoading && location.state?.scrollTo) {
      const scrollId = location.state.scrollTo;
      const element = document.querySelector(`[data-scroll-id="${scrollId}"]`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.style.boxShadow = "0 0 20px 10px rgba(20, 184, 166, 0.6)";
        element.style.borderRadius = "1rem"; // ← أضف هذا السطر
        element.style.transition =
          "box-shadow 0.3s ease, border-radius 0.3s ease";
        setTimeout(() => {
          element.style.boxShadow = "";
          element.style.borderRadius = ""; // إعادة التعيين
        }, 2000);
      }
    }
  }, [isLoading, location.state?.scrollTo]);

  return (
    <section className="w-full min-w-0 space-y-6">
      {/* لوحة التحكم العلوية والعنوان */}
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

          {/* التفاعل الدقيق والسلس عند تمرير الماوس وضغطه */}
          <Motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={() => dispatch(openModal())}
            className="flex cursor-pointer w-full items-center justify-center gap-2 rounded-xl theme-accent px-5 py-3 font-bold text-sm theme-text-on-accent shadow-lg transition-all theme-shadow-accent sm:w-auto sm:px-6"
          >
            <Add fontSize="small" />
            إضافة اختصاص جديد
          </Motion.button>
        </div>
      </div>

      {/* لوحة الإحصائيات مع حركة ظهور متلاشية وتصاعدية خفيفة */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsToRender.map((stat, index) => (
          <Motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.03, ease: "easeOut" }}
            className={`rounded-2xl border theme-border theme-surface p-4 shadow-sm sm:p-5 transition-all ${stat.isPlaceholder ? "opacity-70" : ""}`}
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
      </div>

      {/* شبكة عرض كروت الاختصاصات مع دعم الـ AnimatePresence لحركات الفلترة السلسة */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-6">
        <AnimatePresence mode="popLayout">
          {isInitialLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="rounded-2xl border theme-border theme-surface p-4 shadow-sm sm:p-5 animate-pulse"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2 text-right">
                    <div className="h-3 w-24 rounded-full bg-slate-200/80 dark:bg-slate-700/60" />
                    <div className="h-6 w-32 rounded-full bg-slate-200/70 dark:bg-slate-700/50" />
                    <div className="h-3 w-20 rounded-full bg-slate-200/60 dark:bg-slate-700/40" />
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-slate-200/70 dark:bg-slate-700/50" />
                </div>
                <div className="mt-4 space-y-3">
                  <div className="h-10 rounded-xl bg-slate-200/60 dark:bg-slate-700/40" />
                  <div className="h-10 rounded-xl bg-slate-200/50 dark:bg-slate-700/30" />
                </div>
              </div>
            ))
          ) : isError ? (
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full rounded-3xl border theme-border theme-surface p-6 text-center shadow-sm sm:p-8"
            >
              <p className="text-base font-bold theme-text-accent sm:text-lg">
                حدث خطأ أثناء تحميل الاختصاصات
              </p>
              <p className="mt-2 text-sm theme-text-muted">
                حاول مرة أخرى بعد قليل.
              </p>
            </Motion.div>
          ) : visibleItems.length > 0 ? (
            visibleItems.map((item, index) => (
              <Motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
              >
                <div key={item.uuid} data-scroll-id={`specialization-${item.uuid}`}>
                  <SpecialtyCard data={item} index={index} />
                </div>
              </Motion.div>
            ))
          ) : (
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full rounded-3xl border theme-border theme-surface p-6 text-center shadow-sm sm:p-8"
            >
              <p className="text-base font-bold theme-text-accent sm:text-lg">
                لا توجد اختصاصات مطابقة للبحث الحالي
              </p>
              <p className="mt-2 text-sm theme-text-muted">
                جرّب كلمة بحث مختلفة أو امسح النص للعودة إلى كل النتائج.
              </p>
            </Motion.div>
          )}
        </AnimatePresence>
      </div>

      <AddSpecialtyModal />
      <DeleteConfirmDialog />
    </section>
  );
};

export default SpecialtiesPage;