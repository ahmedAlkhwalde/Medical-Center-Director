import { useMemo, useState, Fragment } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion as Motion } from "framer-motion";
import {
  ArrowBack,
  Payments,
  AccessTime,
  Groups,
  TrendingUp,
  TrendingDown,
  LocalHospital,
  Phone,
  Email,
  CalendarMonth,
  BusinessOutlined,
  CheckCircle,
  Favorite,
  LocalFireDepartment,
} from "@mui/icons-material";
import { toggleDoctorStatus } from "../../features/doctors/doctorsSlice";
import { useSpecialtiesQuery } from "../../service/specialtiesService";

const formatNumber = (value) => new Intl.NumberFormat("ar-SA").format(value);

const generateDoctorPeriodData = (doctor, period, filter) => {
  if (!doctor) return { revenue: [], waitTime: 18 };
  const baseMultiplier = doctor.profitRate / 10;

  const configs = {
    day: {
      revenue: [
        1200, 1400, 1300, 1600, 1800, 1900, 2100, 1950, 2200, 2400, 2300, 2500,
      ],
      waitTime: 12,
    },
    week: {
      revenue: [
        8400, 9800, 8900, 11200, 12600, 13500, 14700, 15300, 16100, 16800,
        18000, 19200,
      ],
      waitTime: 15,
    },
    month: {
      revenue: [
        15000, 16200, 14800, 18900, 21500, 22800, 24200, 25600, 27100, 28500,
        30200, 31800,
      ],
      waitTime: 18,
    },
    year: {
      revenue: [
        95000, 102000, 98000, 125000, 142000, 155000, 168000, 175000, 185000,
        195000, 208000, 225000,
      ],
      waitTime: 16,
    },
  };

  const data = configs[period] || configs.month;

  // apply optional deterministic variation based on a filter (date/month/year)
  let dateFactor = 0;
  if (filter) {
    try {
      const key = String(filter);
      const seed = Array.from(key).reduce((s, c) => s + c.charCodeAt(0), 0);
      dateFactor = ((seed % 13) - 6) / 100; // -0.06 .. +0.06
    } catch (e) {
      dateFactor = 0;
    }
  }

  return {
    revenue: data.revenue.map((v) =>
      Math.floor(v * (1 + baseMultiplier * 0.1 + dateFactor)),
    ),
    waitTime: Math.max(
      6,
      Math.floor(
        data.waitTime -
          Math.floor(baseMultiplier * 2) -
          Math.round(dateFactor * 10),
      ),
    ),
  };
};

const buildAreaPath = (values, width, height, padding) => {
  if (!values.length) return "";

  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = maxValue - minValue || 1;
  const stepX = (width - padding * 2) / Math.max(values.length - 1, 1);

  return values
    .map((value, index) => {
      const x = padding + index * stepX;
      const normalized = (value - minValue) / range;
      const y = height - padding - normalized * (height - padding * 2);
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
};

const StatCard = ({ item }) => {
  const Icon = item.icon;

  return (
    <Motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.18 }}
      className="overflow-hidden rounded-2xl border theme-border theme-surface-90 p-3 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 text-right">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] theme-text-muted">
            {item.title}
          </p>
          <p className="text-[1.05rem] font-black leading-none theme-text md:text-xl">
            {item.value}
          </p>
          <p className="text-[11px] leading-5 theme-text-muted">{item.note}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl theme-accent text-white shadow-lg shadow-teal-500/15">
            <Icon fontSize="small" />
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
              item.trendUp
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
            }`}
          >
            {item.trendUp ? (
              <TrendingUp fontSize="inherit" />
            ) : (
              <TrendingDown fontSize="inherit" />
            )}
            {item.trend}
          </span>
        </div>
      </div>
    </Motion.div>
  );
};

const GlassCard = ({ title, subtitle, children, className = "" }) => (
  <div
    className={`overflow-hidden rounded-3xl border theme-border theme-surface-90 shadow-xl ${className}`}
  >
    <div className="border-b theme-border px-4 py-3 md:px-5">
      <h3 className="text-base font-bold theme-text md:text-lg">{title}</h3>
      {subtitle ? (
        <p className="mt-1 text-sm theme-text-muted">{subtitle}</p>
      ) : null}
    </div>
    <div className="p-4 md:p-5">{children}</div>
  </div>
);

const TrendPill = ({ value, up }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
      up
        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
    }`}
  >
    {up ? (
      <TrendingUp fontSize="inherit" />
    ) : (
      <TrendingDown fontSize="inherit" />
    )}
    {value}
  </span>
);

const CompactMetric = ({ label, value, tone = "teal" }) => {
  const toneClass =
    tone === "orange"
      ? "from-orange-500/15 to-orange-500/5 text-orange-600 dark:text-orange-400"
      : tone === "rose"
        ? "from-rose-500/15 to-rose-500/5 text-rose-600 dark:text-rose-400"
        : "from-teal-500/15 to-teal-500/5 text-teal-600 dark:text-teal-400";

  return (
    <div
      className={`rounded-2xl border theme-border bg-linear-to-br ${toneClass} px-3 py-2`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] theme-text-muted">
        {label}
      </p>
      <p className="mt-1 text-base font-black theme-text">{value}</p>
    </div>
  );
};

const RevenueAreaChart = ({ revenue }) => {
  const width = 820;
  const height = 280;
  const padding = 26;

  if (!revenue || revenue.length === 0) {
    return <p className="theme-text-muted">لا توجد بيانات</p>;
  }

  const revenuePath = buildAreaPath(revenue, width, height, padding);
  const maxValue = Math.max(...revenue);
  const stepX = (width - padding * 2) / Math.max(revenue.length - 1, 1);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold theme-text-muted">
        <span className="inline-flex items-center gap-2 rounded-full bg-teal-500/10 px-3 py-1 text-teal-600 dark:text-teal-400">
          <span className="h-2.5 w-2.5 rounded-full bg-teal-500" />
          الإيرادات
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border theme-border theme-surface p-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-64 w-full">
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0AB3BA" stopOpacity="0.38" />
              <stop offset="100%" stopColor="#0AB3BA" stopOpacity="0.04" />
            </linearGradient>
          </defs>

          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = padding + ratio * (height - padding * 2);
            const label = Math.round(maxValue * (1 - ratio));
            return (
              <g key={ratio}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="currentColor"
                  className="text-(--color-border)"
                  strokeDasharray="4 6"
                />
                <text
                  x={8}
                  y={y + 4}
                  className="fill-current text-[10px] theme-text-muted"
                >
                  {formatNumber(label)}
                </text>
              </g>
            );
          })}

          <path
            d={`${revenuePath} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`}
            fill="url(#revenueFill)"
          />
          <path
            d={revenuePath}
            fill="none"
            stroke="#0AB3BA"
            strokeWidth="4"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {revenue.map((value, index) => {
            const x = padding + index * stepX;
            const y =
              height - padding - (value / maxValue) * (height - padding * 2);
            return (
              <circle key={`r-${index}`} cx={x} cy={y} r="4.5" fill="#0AB3BA" />
            );
          })}
        </svg>
      </div>
    </div>
  );
};

const Heatmap = ({ matrix }) => {
  const max = Math.max(...matrix.flat(), 1);
  const days = ["س", "ح", "ن", "ث", "ر", "خ"];
  const hours = ["8", "10", "12", "14", "16", "18", "20"];

  return (
    <div className="grid grid-cols-[auto_repeat(7,minmax(0,1fr))] gap-1.5 text-center text-xs">
      <span />
      {hours.map((hour) => (
        <span key={hour} className="pb-1 font-semibold theme-text-muted">
          {hour}
        </span>
      ))}
      {matrix.map((row, rowIndex) => (
        <Fragment key={days[rowIndex]}>
          <span className="flex items-center justify-end pr-1 font-semibold theme-text-muted">
            {days[rowIndex]}
          </span>
          {row.map((value, colIndex) => {
            const intensity = value / max;
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="h-9 rounded-xl border border-white/30"
                style={{
                  backgroundColor: `rgba(10, 179, 186, ${0.1 + intensity * 0.8})`,
                }}
                title={`كثافة ${value}`}
              />
            );
          })}
        </Fragment>
      ))}
    </div>
  );
};

const MiniBarList = ({ items }) => (
  <div className="space-y-3">
    {items.map((item) => (
      <div
        key={item.name}
        className="space-y-2 rounded-2xl border theme-border theme-surface px-3 py-2.5"
      >
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="font-semibold theme-text">{item.name}</span>
          <span className="theme-text-muted">
            {item.value} {item.unit}
          </span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-700/70">
          <div
            className="h-full rounded-full bg-linear-to-r from-teal-500 to-cyan-400"
            style={{ width: `${Math.min(100, item.value)}%` }}
          />
        </div>
      </div>
    ))}
  </div>
);

const DoctorDetailPage = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [period, setPeriod] = useState("month");
  const [filterMode, setFilterMode] = useState("none"); // none | day | month | year
  const [filterValue, setFilterValue] = useState("");
  const { doctors } = useSelector((state) => state.doctors);
  const { data: specialties = [] } = useSpecialtiesQuery();

  const doctor = useMemo(
    () => doctors.find((d) => String(d.id) === String(doctorId)),
    [doctors, doctorId],
  );

  const specialtyName = useMemo(() => {
    if (!doctor?.specialtyId) return "غير محدد";
    const targetId = String(doctor.specialtyId);
    const match = specialties.find((specialty) =>
      [specialty?.id, specialty?.legacyId, specialty?.uuid].some(
        (value) => value != null && String(value) === targetId,
      ),
    );
    return match?.name || "غير محدد";
  }, [doctor, specialties]);

  const clinicNumber = useMemo(() => {
    const clinicMatch = doctor?.clinicId ? String(doctor.clinicId) : "1";
    return `عيادة رقم ${clinicMatch}`;
  }, [doctor]);

  // محاكاة إحصائيات الطبيب
  const doctorStats = useMemo(() => {
    if (!doctor) return null;

    const baseMultiplier = doctor.profitRate / 10;
    return {
      totalPatients: Math.floor(150 + baseMultiplier * 20),
      averageConsultationTime: Math.floor(15 - baseMultiplier * 1),
      patientsThisMonth: Math.floor(45 + baseMultiplier * 10),
      patientSatisfaction: Math.min(95, 85 + baseMultiplier * 2),
      proceduresCompleted: Math.floor(120 + baseMultiplier * 30),
      revenue: Math.floor(15000 + baseMultiplier * 5000),
    };
  }, [doctor]);

  // البيانات حسب الفترة الزمنية
  const periodData = useMemo(() => {
    const filter = filterMode === "none" ? null : filterValue;
    return generateDoctorPeriodData(doctor, period, filter);
  }, [doctor, period, filterMode, filterValue]);

  // جدول الدوام الأسبوعي
  const weeklySchedule = useMemo(() => {
    if (!doctor) return [];
    const days = [
      "السبت",
      "الأحد",
      "الاثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس",
    ];
    return days.map((day, index) => ({
      day,
      startTime: `${8 + Math.floor(index / 2)}:00`,
      endTime: `${14 + Math.floor(index / 2)}:00`,
      clinic: doctor.clinicId,
    }));
  }, [doctor]);

  // مصفوفة ساعات الذروة
  const busyHoursMatrix = useMemo(
    () => [
      [2, 3, 4, 5, 4, 2, 1],
      [1, 2, 3, 5, 6, 4, 2],
      [1, 1, 2, 4, 6, 5, 2],
      [0, 1, 3, 4, 5, 4, 1],
      [1, 2, 4, 6, 7, 5, 2],
      [0, 1, 2, 3, 4, 3, 1],
    ],
    [],
  );

  // بيانات الأداء
  const performanceData = useMemo(() => {
    if (!doctor) return [];
    const baseMultiplier = doctor.profitRate / 10;
    return [
      {
        name: doctor.name,
        value: Math.min(50, 24 + baseMultiplier * 5),
        unit: "مريض",
      },
      {
        name: "الإجراءات",
        value: Math.min(50, 25 + baseMultiplier * 8),
        unit: "إجراء",
      },
      {
        name: "رضا المريض",
        value: Math.min(50, 30 + baseMultiplier * 3),
        unit: "%",
      },
    ];
  }, [doctor]);

  const totalRevenue = useMemo(
    () => periodData?.revenue.reduce((sum, value) => sum + value, 0) || 0,
    [periodData],
  );

  const quickStats = useMemo(() => {
    if (!doctor || !doctorStats) return [];
    return [
      {
        id: 1,
        title: "إجمالي المرضى",
        value: formatNumber(doctorStats.totalPatients),
        trend: "+8%",
        trendUp: true,
        icon: Groups,
        note: "تراكمي",
      },
      {
        id: 2,
        title: "المرضى هذا الشهر",
        value: formatNumber(doctorStats.patientsThisMonth),
        trend: "+5%",
        trendUp: true,
        icon: CalendarMonth,
        note: "نشاط جيد",
      },
      {
        id: 3,
        title: "متوسط الانتظار",
        value: `${periodData?.waitTime || 18} د`,
        trend: "-2%",
        trendUp: false,
        icon: AccessTime,
        note: "سريع جداً",
      },
      {
        id: 4,
        title: "رضا المريض",
        value: `${doctorStats.patientSatisfaction}%`,
        trend: "+3%",
        trendUp: true,
        icon: Favorite,
        note: "عالي جداً",
      },
      {
        id: 5,
        title: "الإجراءات",
        value: formatNumber(doctorStats.proceduresCompleted),
        trend: "+12%",
        trendUp: true,
        icon: CheckCircle,
        note: "معدل مرتفع",
      },
      {
        id: 6,
        title: "الإيرادات",
        value: `${(doctorStats.revenue / 1000).toFixed(1)}K ر.س`,
        trend: "+14%",
        trendUp: true,
        icon: Payments,
        note: "نمو قوي",
      },
      {
        id: 7,
        title: "معدل الربح",
        value: `${doctor.profitRate}%`,
        trend: doctor.profitRate > 40 ? "عالي" : "متوسط",
        trendUp: doctor.profitRate > 40,
        icon: LocalFireDepartment,
        note: "أداء الطبيب",
      },
      {
        id: 8,
        title: "وقت المعاينة",
        value: `${doctorStats.averageConsultationTime} د`,
        trend: "-1 د",
        trendUp: false,
        icon: AccessTime,
        note: "فعالية",
      },
    ];
  }, [doctor, doctorStats, periodData]);

  if (!doctor) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-semibold theme-text-muted">
          لم يتم العثور على الطبيب
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Profile */}
      <Motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-3xl border theme-border theme-surface-90 shadow-2xl"
      >
        <div className="absolute inset-0 bg-linear-to-br from-teal-500/15 via-transparent to-orange-500/10" />
        <div className="relative grid gap-4 p-4 md:p-5 xl:grid-cols-[1.3fr_0.9fr] xl:items-stretch">
          <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-3 text-right">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 rounded-full border theme-border theme-surface px-3 py-1 text-[11px] font-semibold theme-text-muted transition-all hover:bg-theme-surface"
              >
                <ArrowBack fontSize="small" />
                العودة
              </button>
              <div className="space-y-2">
                <h1 className="text-3xl font-black leading-tight theme-text md:text-4xl">
                  {doctor.name}
                </h1>
                <p className="max-w-2xl text-sm leading-6 theme-text-muted md:text-[15px]">
                  {specialtyName} • {clinicNumber} • معدل الربح{" "}
                  {doctor.profitRate}%
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border theme-border theme-surface px-2.5 py-1 text-xs font-semibold theme-text-muted">
                  <LocalHospital fontSize="small" />
                  {specialtyName}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border theme-border theme-surface px-2.5 py-1 text-xs font-semibold theme-text-muted">
                  <BusinessOutlined fontSize="small" />
                  {clinicNumber}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    doctor.isActive
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${doctor.isActive ? "bg-emerald-600" : "bg-rose-600"}`}
                  />
                  {doctor.isActive ? "مفعّل" : "معطل"}
                </span>
                <button
                  onClick={() => dispatch(toggleDoctorStatus(doctor.id))}
                  className="inline-flex items-center gap-2 rounded-lg border theme-border theme-surface px-3 py-1 text-[11px] font-semibold transition-colors hover:bg-theme-surface"
                >
                  {doctor.isActive ? "تعطيل" : "تفعيل"}
                </button>
              </div>
            </div>

            <div className="grid gap-3 rounded-3xl border theme-border theme-surface p-3 shadow-sm">
              <div className="flex flex-wrap gap-2">
                {["day", "week", "month", "year"].map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setPeriod(key)}
                    className={`rounded-2xl px-3 py-2 text-sm font-semibold transition-all ${
                      period === key
                        ? "theme-accent text-white shadow-lg shadow-teal-500/20"
                        : "theme-surface theme-text-muted theme-hover-surface"
                    }`}
                  >
                    {
                      {
                        day: "اليوم",
                        week: "الأسبوع",
                        month: "الشهر",
                        year: "السنة",
                      }[key]
                    }
                  </button>
                ))}
              </div>

              <div className="mt-3 flex items-center gap-2 text-sm">
                <label className="text-sm theme-text-muted">
                  تصفية بالوقت:
                </label>
                <select
                  value={filterMode}
                  onChange={(e) => {
                    setFilterMode(e.target.value);
                    setFilterValue("");
                  }}
                  className="rounded-lg border theme-border theme-surface px-2 py-1 text-sm"
                >
                  <option value="none">لا شيء</option>
                  <option value="day">يوم معين</option>
                  <option value="month">شهر معين</option>
                  <option value="year">سنة</option>
                </select>

                {filterMode === "day" ? (
                  <input
                    type="date"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    className="rounded-lg border theme-border theme-surface px-2 py-1 text-sm"
                  />
                ) : filterMode === "month" ? (
                  <input
                    type="month"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    className="rounded-lg border theme-border theme-surface px-2 py-1 text-sm"
                  />
                ) : filterMode === "year" ? (
                  <input
                    type="number"
                    min={2000}
                    max={2100}
                    placeholder="مثال: 2025"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    className="w-28 rounded-lg border theme-border theme-surface px-2 py-1 text-sm"
                  />
                ) : null}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <CompactMetric
                  label="التخصص"
                  value={specialtyName.split(" ")[0]}
                  tone="teal"
                />
                <CompactMetric
                  label="الربح"
                  value={`${doctor.profitRate}%`}
                  tone="orange"
                />
                <CompactMetric
                  label="العيادة"
                  value={`${clinicNumber.split(" ")[2]}`}
                  tone="rose"
                />
                <CompactMetric
                  label="الحالة"
                  value={doctor.isActive ? "نشط" : "معطل"}
                  tone="teal"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-2 rounded-3xl border theme-border theme-surface p-3 shadow-sm">
            <div className="rounded-2xl border theme-border theme-surface px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] theme-text-muted">
                الاختصاص
              </p>
              <p className="mt-1 text-base font-black theme-text">
                {specialtyName}
              </p>
              <p className="text-xs theme-text-muted">التخصص الطبي</p>
            </div>
            <a
              href={`tel:${doctor.phone}`}
              className="flex items-center justify-between rounded-lg theme-hover-surface px-3 py-2 text-sm font-semibold theme-text transition-all"
            >
              <Phone fontSize="small" />
              {doctor.phone}
            </a>
            <a
              href={`mailto:${doctor.email}`}
              className="flex items-center justify-between rounded-lg theme-hover-surface px-3 py-2 text-sm font-semibold theme-text transition-all"
            >
              <Email fontSize="small" />
              {doctor.email}
            </a>
            <div className="rounded-2xl border theme-border theme-surface px-3 py-2">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span className="theme-text">الانضمام</span>
                <span className="theme-text-muted">{doctor.joinedAt}</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-700/70">
                <div className="h-full w-[65%] rounded-full bg-linear-to-r from-teal-500 to-cyan-400" />
              </div>
            </div>
          </div>
        </div>
      </Motion.section>

      {/* Quick Stats Grid */}
      <Motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-8"
      >
        {quickStats.map((item) => (
          <StatCard key={item.id} item={item} />
        ))}
      </Motion.section>

      {/* Charts and detailed info grid */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Revenue Chart */}
        <GlassCard
          title="تحليل الإيرادات والأداء"
          subtitle="مقارنة الإيرادات مع متوسط الأداء"
          className="xl:col-span-7"
        >
          <RevenueAreaChart revenue={periodData?.revenue || []} />
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <div className="rounded-2xl border theme-border theme-surface px-3 py-2.5">
              <p className="text-xs font-semibold theme-text-muted">
                إجمالي الإيرادات
              </p>
              <p className="mt-1 text-xl font-black theme-text">
                {formatNumber(totalRevenue)} ر.س
              </p>
              <div className="mt-2">
                <TrendPill value="+14%" up />
              </div>
            </div>
            <div className="rounded-2xl border theme-border theme-surface px-3 py-2.5">
              <p className="text-xs font-semibold theme-text-muted">المرضى</p>
              <p className="mt-1 text-xl font-black theme-text">
                {formatNumber(doctorStats.patientsThisMonth)}
              </p>
              <p className="mt-2 text-xs theme-text-muted">خلال الشهر</p>
            </div>
            <div className="rounded-2xl border theme-border theme-surface px-3 py-2.5">
              <p className="text-xs font-semibold theme-text-muted">الرضا</p>
              <p className="mt-1 text-xl font-black theme-text">
                {doctorStats.patientSatisfaction}%
              </p>
              <p className="mt-2 text-xs theme-text-muted">تقييم المرضى</p>
            </div>
          </div>
        </GlassCard>

        {/* Side Cards */}
        <div className="grid gap-2 xl:col-span-5">
          {/* Busy Hours Heatmap */}
          <GlassCard
            title="أوقات الذروة الأسبوعية"
            subtitle="كثافة المرضى بالساعة"
            className="lg:row-span-2"
          >
            <Heatmap matrix={busyHoursMatrix} />
          </GlassCard>

          {/* Performance */}
          <GlassCard title="ملخص الأداء" subtitle="معلومات سريعة">
            <MiniBarList items={performanceData} />
          </GlassCard>
        </div>
      </div>

      {/* Weekly Schedule */}
      <Motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25 }}
        className="overflow-hidden rounded-3xl border theme-border theme-surface-90 shadow-xl"
      >
        <div className="border-b theme-border px-5 py-4">
          <h3 className="text-lg font-bold theme-text">جدول الدوام الأسبوعي</h3>
          <p className="mt-1 text-sm theme-text-muted">
            أوقات عمل الطبيب خلال الأسبوع
          </p>
        </div>
        <div className="p-5 md:p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b theme-border">
                  <th className="px-4 py-3 text-sm font-semibold theme-text">
                    اليوم
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold theme-text">
                    وقت البداية
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold theme-text">
                    وقت النهاية
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold theme-text">
                    العيادة
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold theme-text">
                    الحالة
                  </th>
                </tr>
              </thead>
              <tbody>
                {weeklySchedule.map((slot, index) => (
                  <tr
                    key={index}
                    className={`border-b theme-border transition-colors ${
                      index % 2 === 0 ? "bg-theme-surface-90/50" : ""
                    } hover:bg-theme-surface-90/70`}
                  >
                    <td className="px-4 py-3 font-semibold theme-text">
                      {slot.day}
                    </td>
                    <td className="px-4 py-3 theme-text">{slot.startTime}</td>
                    <td className="px-4 py-3 theme-text">{slot.endTime}</td>
                    <td className="px-4 py-3 text-sm theme-text-muted">
                      عيادة رقم {slot.clinic}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <span className="h-2 w-2 rounded-full bg-emerald-600" />
                        متاح
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Motion.div>
    </div>
  );
};

export default DoctorDetailPage;
