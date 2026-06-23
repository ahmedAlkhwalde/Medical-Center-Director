// import { useMemo, useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { motion as Motion, AnimatePresence } from "framer-motion";
// import { useLocation } from "react-router-dom";
// import {
//   Add,
//   FilterAlt,
//   GroupOutlined, // إجمالي الأطباء
//   VerifiedOutlined, // الحسابات المفعّلة
//   AccessTimeOutlined, // الأكثر انشغالاً (الوقت والمواعيد)
//   MonetizationOnOutlined, // الأعلى دخلاً
// } from "@mui/icons-material";
// import DoctorCard from "../components/DoctorCard";
// import AddDoctorModal from "../components/AddDoctorModal";
// import DoctorStatusConfirmDialog from "../components/DoctorStatusConfirmDialog";
// import { openModal, confirmDelete } from "../store/doctorsSlice";
// import { useSpecialtiesQuery } from "../../specialties/service/specialtiesService";
// import { useDoctorsQuery } from "../service/doctorsService";

// const normalizeSearchText = (value = "") =>
//   value
//     .toString()
//     .toLowerCase()
//     .replace(/[\s\p{P}\p{S}]+/gu, "")
//     .replace(/\u0640/g, "")
//     .trim();

// const DoctorsPage = () => {
//   const location = useLocation();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const fileInputRef = useRef(null);

//   const [selectedSpecialtyId, setSelectedSpecialtyId] = useState("");
//   console.log(selectedSpecialtyId);
//   // 💡 تمرير المعرّف مباشرة للـ Hook ليقوم بالسيرفر-فلتر
//   const {
//     data: apiResponse,
//     isLoading,
//     isError,
//   } = useDoctorsQuery(selectedSpecialtyId);
//   const { data: specialties = [] } = useSpecialtiesQuery();

//   const doctors = apiResponse?.data || [];
//   const backendStats = apiResponse?.stats || {};

//   const { searchQuery } = useSelector((state) => state.ui);

//   const normalizedSearchQuery = useMemo(
//     () => normalizeSearchText(searchQuery),
//     [searchQuery],
//   );

//   // 💡 تم تبسيط التابع ليقوم فقط بفلترة البحث النصي المحلي، ففلترة الاختصاص أصبحت تأتي جاهزة من السيرفر
//   const filteredDoctors = useMemo(() => {
//     return doctors.filter((doctor) => {
//       const specialtyName = doctor.specialization?.name || "";
//       const clinicLabel = doctor.clinic?.name || "";

//       const searchableText = normalizeSearchText(
//         [
//           doctor.name,
//           doctor.phone,
//           doctor.email,
//           specialtyName,
//           clinicLabel,
//           doctor.details?.contract_expiry,
//           doctor.joined_at,
//           doctor.status?.is_active ? "مفعّل" : "معطل",
//         ].join(" "),
//       );

//       const matchesSearch =
//         !normalizedSearchQuery ||
//         searchableText.includes(normalizedSearchQuery);

//       return matchesSearch;
//     });
//   }, [doctors, normalizedSearchQuery]); // 💡 تم حذف selectedSpecialtyId من هنا لأن السيرفر يتكفل بالباقي

//   useEffect(() => {
//     if (!isLoading && location.state?.scrollTo) {
//       const scrollId = location.state.scrollTo;
//       const element = document.querySelector(`[data-scroll-id="${scrollId}"]`);
//       if (element) {
//         element.scrollIntoView({ behavior: "smooth", block: "center" });
//         element.style.boxShadow = "0 0 20px 10px rgba(20, 184, 166, 0.6)";
//         element.style.borderRadius = "1rem"; // ← أضف هذا السطر
//         element.style.transition =
//           "box-shadow 0.3s ease, border-radius 0.3s ease";
//         setTimeout(() => {
//           element.style.boxShadow = "";
//           element.style.borderRadius = ""; // إعادة التعيين
//         }, 2000);
//       }
//     }
//   }, [isLoading, location.state?.scrollTo]);

//   const stats = useMemo(() => {
//     return [
//       {
//         id: 1,
//         label: "إجمالي الأطباء",
//         value: backendStats.total_doctors ?? 0,
//         note: `عدد السجلات المسجلة`,
//         icon: <GroupOutlined />,
//       },
//       {
//         id: 2,
//         label: "المفعّلون",
//         value: backendStats.active_doctors_count ?? 0,
//         note: "الأطباء النشطون حاليًا",
//         icon: <VerifiedOutlined />,
//       },
//       {
//         id: 3,
//         label: "الأكثر انشغالاً",
//         value: backendStats.most_busy_doctor || "لا يوجد",
//         note: "حسب المواعيد والضغط",
//         icon: <AccessTimeOutlined />,
//       },
//       {
//         id: 4,
//         label: "الأعلى دخلاً",
//         value: backendStats.top_earner_doctor || "N/A",
//         note: `متوسط المواعيد: ${backendStats.avg_appointments_doctor ?? 0}`,
//         icon: <MonetizationOnOutlined />,
//       },
//     ];
//   }, [backendStats]);

//   if (isError) {
//     return (
//       <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-center shadow-sm">
//         <p className="text-lg font-bold text-red-500">
//           حدث خطأ أثناء جلب البيانات من السيرفر
//         </p>
//         <p className="mt-2 text-sm theme-text-muted">
//           يرجى التحقق من اتصال السيرفر والمحاولة لاحقاً.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <section className="w-full min-w-0 space-y-6">
//       {/* الهيدر وفلاتر البحث */}
//       <div className="overflow-hidden rounded-3xl border theme-border theme-surface-90 theme-gradient-panel p-4 shadow-sm sm:p-5 md:p-6">
//         <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
//           <div className="space-y-1 text-right">
//             <h1 className="text-2xl font-bold theme-text-accent sm:text-3xl lg:text-4xl">
//               إدارة الأطباء
//             </h1>
//             <p className="max-w-2xl text-sm theme-text-muted sm:text-base">
//               إدارة معلومات الأطباء والبحث السريع مع فلترة مباشرة حسب الاختصاص.
//             </p>
//           </div>

//           <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-start">
//             <div className="relative flex w-full sm:w-64">
//               <FilterAlt
//                 className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 theme-text-muted"
//                 fontSize="small"
//               />
//               <select
//                 value={selectedSpecialtyId}
//                 onChange={(event) => setSelectedSpecialtyId(event.target.value)}
//                 className="w-full cursor-pointer appearance-none rounded-xl border theme-border theme-surface py-3 pr-12 text-sm font-bold theme-text shadow-sm outline-none transition-all focus:ring-2 focus:ring-(--color-accent)"
//               >
//                 <option value="">كل الاختصاصات</option>
//                 {specialties.map((specialty) => {
//                   // 💡 تأمين جلب الـ ID الرقمي للاختصاص (سواء كان الحقل اسمه id أو specialization_id)
//                   const optionId = specialty.legacyId;

//                   return (
//                     <option key={optionId} value={optionId}>
//                       {specialty.name} {/* 👁️ المستخدم يرى الاسم هنا */}
//                     </option>
//                   );
//                 })}
//               </select>
//             </div>

//             <Motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               transition={{ duration: 0.3 }}
//               onClick={() => dispatch(openModal())}
//               type="button"
//               className="flex cursor-pointer items-center justify-center gap-2 rounded-xl theme-accent px-5 py-3 text-sm font-bold theme-text-on-accent shadow-lg transition-all theme-shadow-accent sm:w-auto sm:px-6"
//             >
//               <Add fontSize="small" />
//               إضافة طبيب جديد
//             </Motion.button>
//           </div>
//         </div>
//       </div>

//       {/* لوحة الإحصائيات */}
//       <Motion.div
//         layout
//         className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
//       >
//         {isLoading
//           ? Array.from({ length: 4 }).map((_, idx) => (
//               <div
//                 key={idx}
//                 className="rounded-2xl border theme-border theme-surface p-4 shadow-sm sm:p-5 animate-pulse space-y-3"
//               >
//                 <div className="h-3 w-1/3 rounded bg-zinc-200 dark:bg-zinc-700" />
//                 <div className="h-6 w-1/2 rounded bg-zinc-200 dark:bg-zinc-700" />
//                 <div className="h-3 w-3/4 rounded bg-zinc-200 dark:bg-zinc-700" />
//               </div>
//             ))
//           : stats.map((stat, index) => (
//               <Motion.div
//                 key={stat.id}
//                 initial={{ opacity: 0, y: 16 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.05 }}
//                 className="rounded-2xl border theme-border theme-surface p-4 shadow-sm sm:p-5"
//               >
//                 <div className="flex items-start justify-between gap-3">
//                   <div className="space-y-1 text-right">
//                     <p className="text-xs font-bold uppercase tracking-wide theme-text-muted">
//                       {stat.label}
//                     </p>
//                     <h3 className="text-2xl font-bold theme-text-accent">
//                       {stat.value}
//                     </h3>
//                     <p className="text-sm theme-text-muted">{stat.note}</p>
//                   </div>
//                   <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl theme-accent-soft theme-text-accent">
//                     {stat.icon}
//                   </div>
//                 </div>
//               </Motion.div>
//             ))}
//       </Motion.div>

//       <input
//         ref={fileInputRef}
//         type="file"
//         accept=".xlsx,.xls,.csv"
//         className="hidden"
//       />

//       {/* عرض الكروت */}
//       {isLoading ? (
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
//           {Array.from({ length: 6 }).map((_, idx) => (
//             <div
//               key={idx}
//               className="rounded-2xl border theme-border theme-surface p-5 shadow-md animate-pulse space-y-4"
//             >
//               <div className="flex items-center gap-3">
//                 <div className="h-12 w-12 rounded-xl bg-zinc-200 dark:bg-zinc-700" />
//                 <div className="flex-1 space-y-2">
//                   <div className="h-4 w-1/2 rounded bg-zinc-200 dark:bg-zinc-700" />
//                   <div className="h-3 w-1/3 rounded bg-zinc-200 dark:bg-zinc-700" />
//                 </div>
//               </div>
//               <div className="h-6 w-1/4 rounded-full bg-zinc-200 dark:bg-zinc-700" />
//               <div className="space-y-2 pt-2">
//                 <div className="h-8 rounded-xl bg-zinc-200 dark:bg-zinc-700" />
//                 <div className="h-8 rounded-xl bg-zinc-200 dark:bg-zinc-700" />
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : filteredDoctors.length > 0 ? (
//         <Motion.div
//           layout
//           className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6"
//         >
//           <AnimatePresence mode="popLayout">
//             {filteredDoctors.map((doctor) => {
//               const mappedDoctor = {
//                 ...doctor,
//                 id: doctor.uuid,
//                 email: doctor.email,
//                 isActive: doctor.status?.is_active,
//                 profitRate: parseInt(doctor.details?.ratio || 0),
//                 contractEndDate: doctor.details?.contract_expiry,
//               };

//               return (
//                 <div key={doctor.uuid} data-scroll-id={`doctor-${doctor.uuid}`}>
//                   <DoctorCard
//                     key={doctor.uuid}
//                     data-scroll-id={`doctor-${doctor.uuid}`}
//                     doctor={mappedDoctor}
//                     specialtyName={doctor.specialization?.name || "غير محدد"}
//                     clinicNumber={doctor.clinic?.name || "غير محدد"}
//                     onEdit={() => dispatch(openModal(doctor))}
//                     onViewDetails={() =>
//                       navigate(`/main-page/doctors/${doctor.uuid}`)
//                     }
//                     onToggleStatus={() => dispatch(confirmDelete(mappedDoctor))}
//                   />
//                 </div>
//               );
//             })}
//           </AnimatePresence>
//         </Motion.div>
//       ) : (
//         <div className="rounded-3xl border theme-border theme-surface p-6 text-center shadow-sm sm:p-8">
//           <p className="text-base font-bold theme-text-accent sm:text-lg">
//             لا يوجد أطباء مطابقون للبحث أو الفلترة الحالية
//           </p>
//           <p className="mt-2 text-sm theme-text-muted">
//             جرّب تغيير الاسم في البحث أو بدّل الاختصاص.
//           </p>
//         </div>
//       )}

//       {/* نوافذ النظام المنبثقة */}
//       <AddDoctorModal />
//       <DoctorStatusConfirmDialog />
//     </section>
//   );
// };

// export default DoctorsPage;


import React from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  Add,
  FilterAlt,
  GroupOutlined,
  VerifiedOutlined,
  AccessTimeOutlined,
  MonetizationOnOutlined,
} from "@mui/icons-material";
import DoctorCard from "../components/DoctorCard";
import AddDoctorModal from "../components/AddDoctorModal";
import DoctorStatusConfirmDialog from "../components/DoctorStatusConfirmDialog";
import { useDoctorsPage } from "../hooks/useDoctorsPage";
// 💡 استيراد مكونات التحميل الجديدة هنا
import { StatsSkeleton, DoctorCardsSkeleton } from "../components/DoctorsSkeleton";

const STAT_ICONS = {
  total: <GroupOutlined />,
  active: <VerifiedOutlined />,
  busy: <AccessTimeOutlined />,
  earner: <MonetizationOnOutlined />,
};

const DoctorsPage = () => {
  const {
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
  } = useDoctorsPage();

  if (isError) {
    return (
      <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-center shadow-sm">
        <p className="text-lg font-bold text-red-500">حدث خطأ أثناء جلب البيانات من السيرفر</p>
        <p className="mt-2 text-sm theme-text-muted">يرجى التحقق من اتصال السيرفر والمحاولة لاحقاً.</p>
      </div>
    );
  }

  return (
    <section className="w-full min-w-0 space-y-6">
      {/* الهيدر وفلاتر البحث */}
      <div className="overflow-hidden rounded-3xl border theme-border theme-surface-90 theme-gradient-panel p-4 shadow-sm sm:p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1 text-right">
            <h1 className="text-2xl font-bold theme-text-accent sm:text-3xl lg:text-4xl">إدارة الأطباء</h1>
            <p className="max-w-2xl text-sm theme-text-muted sm:text-base">
              إدارة معلومات الأطباء والبحث السريع مع فلترة مباشرة حسب الاختصاص.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-start">
            <div className="relative flex w-full sm:w-64">
              <FilterAlt className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 theme-text-muted" fontSize="small" />
              <select
                value={selectedSpecialtyId}
                onChange={(e) => setSelectedSpecialtyId(e.target.value)}
                className="w-full cursor-pointer appearance-none rounded-xl border theme-border theme-surface py-3 pr-12 text-sm font-bold theme-text shadow-sm outline-none transition-all focus:ring-2 focus:ring-(--color-accent)"
              >
                <option value="">كل الاختصاصات</option>
                {specialties.map((specialty) => (
                  <option key={specialty.legacyId} value={specialty.legacyId}>
                    {specialty.name}
                  </option>
                ))}
              </select>
            </div>

            <Motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
              onClick={handleOpenAddModal}
              type="button"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl theme-accent px-5 py-3 text-sm font-bold theme-text-on-accent shadow-lg transition-all theme-shadow-accent sm:w-auto sm:px-6"
            >
              <Add fontSize="small" />
              إضافة طبيب جديد
            </Motion.button>
          </div>
        </div>
      </div>

      {/* لوحة الإحصائيات السريعة */}
      <Motion.div layout>
        {isLoading ? (
          <StatsSkeleton /> // 💡 استخدام مكون تحميل الإحصائيات
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
                    <p className="text-xs font-bold uppercase tracking-wide theme-text-muted">{stat.label}</p>
                    <h3 className="text-2xl font-bold theme-text-accent">{stat.value}</h3>
                    <p className="text-sm theme-text-muted">{stat.note}</p>
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl theme-accent-soft theme-text-accent">
                    {STAT_ICONS[stat.type]}
                  </div>
                </div>
              </Motion.div>
            ))}
          </div>
        )}
      </Motion.div>

      <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" />

      {/* منطقة عرض الكروت والقوائم */}
      {isLoading ? (
        <DoctorCardsSkeleton /> // 💡 استخدام مكون تحميل الكروت
      ) : filteredDoctors.length > 0 ? (
        <Motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredDoctors.map((doctor) => {
              const mappedDoctor = {
                ...doctor,
                id: doctor.uuid,
                isActive: doctor.status?.is_active,
                profitRate: parseInt(doctor.details?.ratio || 0),
                contractEndDate: doctor.details?.contract_expiry,
              };

              return (
                <div key={doctor.uuid} data-scroll-id={`doctor-${doctor.uuid}`}>
                  <DoctorCard
                    doctor={mappedDoctor}
                    specialtyName={doctor.specialization?.name || "غير محدد"}
                    clinicNumber={doctor.clinic?.name || "غير محدد"}
                    onEdit={() => handleOpenEditModal(doctor)}
                    onViewDetails={() => handleViewDetails(doctor.uuid)}
                    onToggleStatus={() => handleToggleStatus(mappedDoctor)}
                  />
                </div>
              );
            })}
          </AnimatePresence>
        </Motion.div>
      ) : (
        <div className="rounded-3xl border theme-border theme-surface p-6 text-center shadow-sm sm:p-8">
          <p className="text-base font-bold theme-text-accent sm:text-lg">
            لا يوجد أطباء مطابقون للبحث أو الفلترة الحالية
          </p>
          <p className="mt-2 text-sm theme-text-muted">جرّب تغيير الاسم في البحث أو بدّل الاختصاص.</p>
        </div>
      )}

      {/* النوافذ المنبثقة المستقلة */}
      <AddDoctorModal />
      <DoctorStatusConfirmDialog />
    </section>
  );
};

export default DoctorsPage;