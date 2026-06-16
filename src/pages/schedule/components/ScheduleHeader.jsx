import {
  CalendarMonth,
  AccessTime,
  MedicalServices,
} from "@mui/icons-material";
import { motion as Motion } from "framer-motion";
import { useMemo } from "react";

// إضافة قيم افتراضية ومصفوفات فارغة لتجنب الـ undefined أثناء التحميل
const ScheduleHeader = ({ schedules = [], specialtyOptions = [] }) => {
  const stats = useMemo(() => {
    // حساب فترات الدوام بأمان
    const totalShiftSlots = schedules.reduce((sum, item) => {
      const weeklySchedule = item?.weeklySchedule || {};
      const shiftCount = Object.values(weeklySchedule).filter(Boolean).length;
      return sum + shiftCount;
    }, 0);

    // حساب الأيام المغطاة بأمان
    const coveredDays = new Set();
    schedules.forEach((item) => {
      const weeklySchedule = item?.weeklySchedule || {};
      Object.keys(weeklySchedule).forEach((dayKey) =>
        coveredDays.add(dayKey),
      );
    });

    return [
      {
        id: 1,
        label: "إجمالي الأطباء",
        value: schedules.length,
        note: "بطاقات الأطباء المعروضة في الجدول",
        icon: <CalendarMonth />,
      },
      {
        id: 2,
        label: "فترات الدوام",
        value: totalShiftSlots,
        note: "إجمالي الفترات الأسبوعية المسجلة",
        icon: <AccessTime />,
      },
      {
        id: 3,
        label: "أيام مغطاة",
        value: coveredDays.size,
        note: "الأيام التي تحتوي على دوام فعلي",
        icon: <MedicalServices />,
      },
      {
        id: 4,
        label: "الاختصاصات",
        value: specialtyOptions.length,
        note: "الاختصاصات المتوفرة داخل البرنامج",
        icon: <MedicalServices />,
      },
    ];
  }, [schedules, specialtyOptions.length]); // لن تنهار الآن لأن specialtyOptions أصبحت مصفوفة دائماً

  return (
    <Motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-4xl border theme-border theme-surface-90 shadow-2xl"
    >
      <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 via-transparent to-cyan-500/10" />
      <div className="relative p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border theme-border theme-surface px-3 py-1 text-xs font-semibold theme-text-muted">
              <CalendarMonth fontSize="small" />
              البرنامج الأسبوعي للدوام
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-black leading-tight theme-text md:text-4xl">
                جدول الأطباء الأسبوعي
              </h1>
              <p className="max-w-xl text-sm leading-7 theme-text-muted md:text-base">
                الأعمدة تمثل أيام الأسبوع، وكل صف يحتوي بطاقة للطبيب مع دوامه
                اليومي من ساعة البداية إلى ساعة النهاية حسب الأيام المتوفرة.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 sm:gap-4">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="rounded-3xl border theme-border theme-surface px-4 py-4 text-right shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="rounded-2xl bg-linear-to-r from-blue-500/15 to-cyan-500/15 p-2 theme-text">
                    {stat.icon}
                  </span>
                  <span className="text-xs font-medium theme-text-muted">
                    {stat.label}
                  </span>
                </div>
                <p className="text-2xl font-black theme-text">{stat.value}</p>
                <p className="mt-1 text-[11px] leading-5 theme-text-muted">
                  {stat.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Motion.section>
  );
};

export default ScheduleHeader;
