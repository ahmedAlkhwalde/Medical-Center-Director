// import { useEffect, useMemo, useState } from "react";
// import { useSelector } from "react-redux";
// import { normalizeSearchText } from "./scheduleFormatters";
// import ScheduleHeader from "./components/ScheduleHeader";
// import ScheduleFilters from "./components/ScheduleFilters";
// import ScheduleList from "./components/ScheduleList";

// const SchedulePage = () => {
//   const { schedules } = useSelector((state) => state.schedule);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedSpecialty, setSelectedSpecialty] = useState("");
//   const [isMobile, setIsMobile] = useState(() =>
//     typeof window !== "undefined" ? window.innerWidth < 768 : false,
//   );

//   useEffect(() => {
//     if (typeof window === "undefined") {
//       return undefined;
//     }

//     const mediaQuery = window.matchMedia("(max-width: 767.98px)");
//     const handleChange = (event) => setIsMobile(event.matches);

//     setIsMobile(mediaQuery.matches);

//     if (mediaQuery.addEventListener) {
//       mediaQuery.addEventListener("change", handleChange);
//       return () => mediaQuery.removeEventListener("change", handleChange);
//     }

//     mediaQuery.addListener(handleChange);
//     return () => mediaQuery.removeListener(handleChange);
//   }, []);

//   const specialtyOptions = useMemo(
//     () =>
//       Array.from(new Set(schedules.map((item) => item.doctor.specialization))),
//     [schedules],
//   );

//   const filteredSchedule = useMemo(() => {
//     const normalizedQuery = normalizeSearchText(searchQuery);

//     return schedules.filter((item) => {
//       const matchesSpecialty =
//         !selectedSpecialty || item.doctor.specialization === selectedSpecialty;

//       const searchableText = normalizeSearchText(
//         [item.doctor.name, item.doctor.specialization, item.doctor.clinic].join(
//           " ",
//         ),
//       );

//       const matchesSearch =
//         !normalizedQuery || searchableText.includes(normalizedQuery);

//       return matchesSpecialty && matchesSearch;
//     });
//   }, [searchQuery, selectedSpecialty, schedules]);

//   const handleResetFilters = () => {
//     setSearchQuery("");
//     setSelectedSpecialty("");
//   };

//   const hasActiveFilters = Boolean(searchQuery || selectedSpecialty);

//   return (
//     <div className="space-y-6">
//       <ScheduleHeader
//         schedules={schedules}
//         specialtyOptions={specialtyOptions}
//       />

//       <ScheduleFilters
//         searchQuery={searchQuery}
//         onSearchChange={setSearchQuery}
//         selectedSpecialty={selectedSpecialty}
//         onSpecialtyChange={setSelectedSpecialty}
//         specialtyOptions={specialtyOptions}
//         onResetFilters={handleResetFilters}
//       />

//       <ScheduleList
//         filteredSchedule={filteredSchedule}
//         isMobile={isMobile}
//         hasActiveFilters={hasActiveFilters}
//       />
//     </div>
//   );
// };

// export default SchedulePage;
import { useEffect, useMemo, useState } from "react";
import { useSchedulesQuery } from "../../service/schedulesService"; 
import { useSpecialtiesQuery } from "../../service/specialtiesService"; 
import { normalizeSearchText } from "./scheduleFormatters";
import ScheduleHeader from "./components/ScheduleHeader";
import ScheduleFilters from "./components/ScheduleFilters";
import ScheduleList from "./components/ScheduleList";

const SchedulePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState("");
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );

  // جلب الاختصاصات من الخادم
  const { data: specialties = [] } = useSpecialtiesQuery();

  // استدعاء جداول الدوام بناءً على الاختصاص المختار
  const { data: schedules = [], isLoading: isSchedulesLoading, isError } = useSchedulesQuery(selectedSpecialtyId);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const mediaQuery = window.matchMedia("(max-width: 767.98px)");
    const handleChange = (event) => setIsMobile(event.matches);

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // الفلترة المحلية المتبقية للبحث بالاسم أو العيادة
  const filteredSchedule = useMemo(() => {
    const normalizedQuery = normalizeSearchText(searchQuery);

    return schedules.filter((item) => {
      const searchableText = normalizeSearchText(
        [item.doctor.name, item.doctor.specialization, item.doctor.clinic].join(" "),
      );

      return !normalizedQuery || searchableText.includes(normalizedQuery);
    });
  }, [searchQuery, schedules]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedSpecialtyId("");
  };

  const hasActiveFilters = Boolean(searchQuery || selectedSpecialtyId);

  return (
    <div className="space-y-6">
      {/* الهيدر والفلاتر تظهر دائماً ولا تتأثر بالـ Loading الـخاص بالجدول */}
      <ScheduleHeader 
        schedules={schedules} 
        specialtyOptions={specialties} 
      />

      <ScheduleFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedSpecialty={selectedSpecialtyId}
        onSpecialtyChange={setSelectedSpecialtyId}
        onResetFilters={handleResetFilters}
        specialties={specialties} 
      />

      {/* حصر حالة الـ Loading والـ Error في منطقة الجدول فقط */}
      {isSchedulesLoading ? (
        <div className="space-y-6 animate-pulse">
          {[1, 2, 3].map((index) => (
            <div 
              key={index} 
              className="rounded-4xl border theme-border theme-surface-90 p-5 md:p-6 shadow-md space-y-5 text-right"
              dir="rtl"
            >
              {/* الهيكل العلوي (معلومات الطبيب التخيلية) */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b theme-border pb-4">
                <div className="space-y-2 w-full max-w-[280px]">
                  <div className="h-5 bg-gray-300 dark:bg-zinc-700 rounded-2xl w-5/6"></div>
                  <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded-xl w-3/5"></div>
                </div>
                <div className="h-7 bg-gray-200 dark:bg-zinc-800 rounded-xl w-24 self-start sm:self-center"></div>
              </div>

              {/* هيكل أيام الأسبوع السبعة */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <div 
                    key={day} 
                    className="rounded-3xl border theme-border p-3 text-center bg-gray-50/40 dark:bg-zinc-900/20 space-y-3"
                  >
                    <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded-lg w-1/2 mx-auto"></div>
                    <div className="h-4 bg-gray-300 dark:bg-zinc-700 rounded-xl w-4/5 mx-auto"></div>
                    <div className="h-2.5 bg-gray-200 dark:bg-zinc-800 rounded-md w-1/3 mx-auto"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="p-8 text-center text-red-500 rounded-4xl border border-red-500/20 bg-red-500/5 font-medium">
          حدث خطأ أثناء جلب جدول المواعيد. يرجى محاولة تحديث الصفحة.
        </div>
      ) : (
        <ScheduleList
          filteredSchedule={filteredSchedule}
          isMobile={isMobile}
          hasActiveFilters={hasActiveFilters}
        />
      )}
    </div>
  );
};

export default SchedulePage;