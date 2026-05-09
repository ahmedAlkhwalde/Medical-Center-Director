import { useEffect, useMemo, useState } from "react";
import { motion as Motion } from "framer-motion";
import {
  AccessTime,
  CalendarMonth,
  FilterAlt,
  MedicalServices,
  Search,
  SearchOff,
} from "@mui/icons-material";

const weekDays = [
  { key: "saturday", label: "السبت" },
  { key: "sunday", label: "الأحد" },
  { key: "monday", label: "الإثنين" },
  { key: "tuesday", label: "الثلاثاء" },
  { key: "wednesday", label: "الأربعاء" },
  { key: "thursday", label: "الخميس" },
  { key: "friday", label: "الجمعة" },
];

const weeklyScheduleData = [
  {
    id: 1,
    doctor: {
      name: "د. أحمد علي",
      specialization: "العينية",
      clinic: "العيادة العينية",
    },
    weeklySchedule: {
      saturday: { start: "09:00", end: "13:00", label: "صباحي" },
      monday: { start: "14:00", end: "18:00", label: "مسائي" },
      wednesday: { start: "10:00", end: "14:00", label: "عمليات" },
      thursday: { start: "16:00", end: "20:00", label: "متابعة" },
    },
    statusNote:
      "يستقبل الحالات المحولة بعد الظهر ويغطي مراجعات العمليات يوم الأربعاء.",
  },
  {
    id: 2,
    doctor: {
      name: "د. منى سعيد",
      specialization: "الجلدية",
      clinic: "عيادة الجلدية",
    },
    weeklySchedule: {
      sunday: { start: "08:30", end: "12:30", label: "مراجعات" },
      tuesday: { start: "13:00", end: "17:00", label: "إجراءات" },
      friday: { start: "10:00", end: "14:00", label: "عيادة مفتوحة" },
    },
    statusNote:
      "دوام مرن موزع على ثلاثة أيام مع نافذة إضافية للحالات السريعة يوم الجمعة.",
  },
  {
    id: 3,
    doctor: {
      name: "د. سامر يوسف",
      specialization: "الأطفال",
      clinic: "عيادة الأطفال",
    },
    weeklySchedule: {
      saturday: { start: "14:00", end: "19:00", label: "مسائي" },
      monday: { start: "09:00", end: "13:00", label: "صباحي" },
      wednesday: { start: "09:00", end: "13:00", label: "صباحي" },
      thursday: { start: "09:00", end: "12:00", label: "متابعة" },
    },
    statusNote:
      "يوازن بين دوامات صباحية ومسائية لتغطية أكبر عدد من الزيارات العائلية.",
  },
  {
    id: 4,
    doctor: {
      name: "د. رنا الخطيب",
      specialization: "القلبية",
      clinic: "عيادة القلب",
    },
    weeklySchedule: {
      sunday: { start: "15:00", end: "20:00", label: "مسائي" },
      tuesday: { start: "09:00", end: "13:00", label: "فحص" },
      thursday: { start: "14:00", end: "18:00", label: "مراجعات" },
    },
    statusNote:
      "دوام مركز على الأيام ذات الضغط الأعلى مع جلسات متابعة بعد الظهر.",
  },
];

const normalizeSearchText = (value = "") =>
  value
    .toString()
    .toLowerCase()
    .replace(/[\s\p{P}\p{S}]+/gu, "")
    .replace(/\u0640/g, "")
    .trim();

const formatScheduleValue = (value) => {
  if (!value) {
    return "-";
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Intl.DateTimeFormat("ar-SA", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(`${value}T00:00:00`));
  }

  if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(value)) {
    const [hours = "00", minutes = "00"] = value.split(":");
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  }

  return value;
};

const getShiftCount = (weeklySchedule = {}) =>
  Object.values(weeklySchedule).filter(Boolean).length;

const ShiftCell = ({ shift }) => {
  if (!shift) {
    return (
      <div className="flex min-h-24 items-center justify-center rounded-2xl border border-dashed theme-border theme-surface-90 px-3 py-4 text-xs font-semibold theme-text-muted">
        راحة
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-blue-500/15 theme-accent-soft px-3 py-3 shadow-sm dark:border-blue-400/20">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="rounded-full theme-surface px-2.5 py-1 text-[11px] font-semibold theme-text-accent">
          {shift.label}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wide theme-text-accent">
          دوام
        </span>
      </div>

      <div className="space-y-1 text-xs font-medium theme-text">
        <p className="rounded-xl theme-surface px-2.5 py-1.5">
          من {formatScheduleValue(shift.start)}
        </p>
        <p className="rounded-xl theme-surface px-2.5 py-1.5">
          إلى {formatScheduleValue(shift.end)}
        </p>
      </div>
    </div>
  );
};

const DoctorSummaryCard = ({ item }) => (
  <div className="rounded-3xl border theme-border theme-surface p-4 shadow-sm">
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl theme-accent text-sm font-black text-white shadow-lg">
        {item.doctor.name
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0])
          .join("")}
      </div>

      <div className="min-w-0">
        <p className="truncate text-base font-bold theme-text">
          {item.doctor.name}
        </p>
        <p className="text-xs font-medium theme-text-muted">
          {item.doctor.specialization}
        </p>
      </div>
    </div>

    <div className="mt-4 flex flex-wrap gap-2">
      <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
        {item.doctor.clinic}
      </span>
      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
        {getShiftCount(item.weeklySchedule)} فترات
      </span>
    </div>

    <p className="mt-4 text-xs leading-6 theme-text-muted">{item.statusNote}</p>
  </div>
);

const SchedulePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(max-width: 767.98px)");
    const handleChange = (event) => setIsMobile(event.matches);

    setIsMobile(mediaQuery.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  const specialtyOptions = useMemo(
    () =>
      Array.from(
        new Set(weeklyScheduleData.map((item) => item.doctor.specialization)),
      ),
    [],
  );

  const filteredSchedule = useMemo(() => {
    const normalizedQuery = normalizeSearchText(searchQuery);

    return weeklyScheduleData.filter((item) => {
      const matchesSpecialty =
        !selectedSpecialty || item.doctor.specialization === selectedSpecialty;

      const searchableText = normalizeSearchText(
        [item.doctor.name, item.doctor.specialization, item.doctor.clinic].join(
          " ",
        ),
      );

      const matchesSearch =
        !normalizedQuery || searchableText.includes(normalizedQuery);

      return matchesSpecialty && matchesSearch;
    });
  }, [searchQuery, selectedSpecialty]);

  const stats = useMemo(() => {
    const totalShiftSlots = weeklyScheduleData.reduce(
      (sum, item) => sum + getShiftCount(item.weeklySchedule),
      0,
    );

    const coveredDays = new Set();

    weeklyScheduleData.forEach((item) => {
      Object.keys(item.weeklySchedule).forEach((dayKey) =>
        coveredDays.add(dayKey),
      );
    });

    return [
      {
        id: 1,
        label: "إجمالي الأطباء",
        value: weeklyScheduleData.length,
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
  }, [specialtyOptions.length]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedSpecialty("");
  };

  const hasActiveFilters = Boolean(searchQuery || selectedSpecialty);

  return (
    <div className="space-y-6">
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

      <Motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="rounded-4xl p-px theme-gradient-border shadow-2xl"
      >
        <div className="rounded-4xl theme-surface-90 p-5 md:p-6">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-xl font-bold theme-text">فلترة الجدول</h2>
              <p className="text-sm theme-text-muted">
                الفلترة تعمل محلياً على نفس بيانات البرنامج الأسبوعي.
              </p>
            </div>

            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border theme-border theme-surface px-4 py-2 text-sm font-medium theme-text transition-colors theme-hover-surface"
            >
              <FilterAlt fontSize="small" />
              إظهار الكل
            </button>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(260px,0.8fr)]">
            <label className="relative block">
              <span className="mb-2 block text-sm font-semibold theme-text">
                البحث باسم الطبيب أو العيادة
              </span>
              <div className="relative rounded-3xl border theme-border theme-surface-95">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="اكتب اسم الطبيب أو العيادة هنا..."
                  className="w-full rounded-3xl border-0 bg-transparent py-3 pr-12 pl-4 text-sm theme-text outline-none transition-all placeholder:text-(--color-grey)"
                />
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 theme-text-muted"
                  fontSize="small"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold theme-text">
                فلتر الاختصاص
              </span>
              <div className="relative rounded-3xl border theme-border theme-surface-95">
                <select
                  value={selectedSpecialty}
                  onChange={(event) => setSelectedSpecialty(event.target.value)}
                  className="w-full appearance-none rounded-3xl border-0 bg-transparent py-3 pr-4 pl-12 text-sm theme-text outline-none"
                >
                  <option value="">كل الاختصاصات</option>
                  {specialtyOptions.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
                <FilterAlt
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 theme-text-muted"
                  fontSize="small"
                />
              </div>
            </label>
          </div>
        </div>
      </Motion.section>

      <Motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="overflow-hidden rounded-4xl border theme-border theme-surface-90 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b theme-border px-5 py-4 md:px-6">
          <div>
            <h2 className="text-lg font-bold theme-text">
              جدول الأطباء ({filteredSchedule.length})
            </h2>
            <p className="text-sm theme-text-muted">
              كل صف يمثل طبيباً، والأعمدة تمثل أيام الأسبوع مع ساعات الدوام.
            </p>
          </div>
          {hasActiveFilters && (
            <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
              توجد فلاتر مفعلة
            </span>
          )}
        </div>

        {filteredSchedule.length > 0 ? (
          isMobile ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredSchedule.map((item) => (
                <Motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden rounded-3xl border theme-border theme-surface-90 shadow-lg"
                >
                  <div className="border-b theme-border px-4 py-4">
                    <DoctorSummaryCard item={item} />
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3">
                    {weekDays.map((day) => (
                      <div key={day.key} className="space-y-2">
                        <div className="text-xs font-bold theme-text-muted">
                          {day.label}
                        </div>
                        <ShiftCell shift={item.weeklySchedule[day.key]} />
                      </div>
                    ))}
                  </div>
                </Motion.article>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-310 w-full border-collapse text-right">
                <thead>
                  <tr className="theme-surface-90 text-xs uppercase tracking-wide theme-text-muted">
                    <th className="sticky right-0 z-20 border-b border-r theme-border px-5 py-4 font-semibold theme-surface-90">
                      الطبيب
                    </th>
                    {weekDays.map((day) => (
                      <th
                        key={day.key}
                        className="border-b theme-border px-4 py-4 font-semibold"
                      >
                        {day.label}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredSchedule.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t theme-border align-top transition-colors theme-hover-surface"
                    >
                      <td className="sticky right-0 z-10 border-r theme-border px-5 py-5 theme-surface-90">
                        <DoctorSummaryCard item={item} />
                      </td>

                      {weekDays.map((day) => (
                        <td key={day.key} className="px-3 py-5 align-top">
                          <ShiftCell shift={item.weeklySchedule[day.key]} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="flex min-h-90 flex-col items-center justify-center px-6 py-14 text-center">
            <Motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-5"
            >
              <SearchOff
                sx={{
                  fontSize: 120,
                  color: "var(--color-text-muted)",
                  opacity: 0.28,
                }}
              />
            </Motion.div>
            <h3 className="text-2xl font-bold theme-text">
              لا توجد نتائج مطابقة
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-7 theme-text-muted">
              جرّب تغيير اسم الطبيب أو العيادة أو الاختصاص، أو أعد ضبط الفلاتر
              لعرض البرنامج الأسبوعي من جديد.
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-transform hover:scale-[1.02]"
              >
                <Search className="text-white" fontSize="small" />
                إعادة عرض البرنامج الكامل
              </button>
            )}
          </div>
        )}
      </Motion.section>
    </div>
  );
};

export default SchedulePage;
