import { motion as Motion } from "framer-motion";
import { CalendarMonth } from "@mui/icons-material";
import { formatNumber } from "../store/dashboardSlice";
import { useDashboard } from "../hooks/useDashboard";

// استيراد المكونات الفرعية
import StatCard from "../components/StatCard";
import GlassCard from "../components/GlassCard";
import RevenueAreaChart from "../components/RevenueAreaChart";
import TrendPill from "../components/TrendPill";
import DashboardSkeleton from "../components/DashboardSkeleton";

const allPeriodLabels = {
  all: "الكل",
  last_month: "آخر شهر",
  last_year: "آخر سنة",
  custom_month: "شهر معين",
  custom_year: "سنة معينة",
};

const DashboardPage = () => {
  const {
    period,
    filterValue,
    isLoading,
    error,
    transformed,
    quickStats,
    handlePeriodChange,
    handleFilterChange,
  } = useDashboard();

  return (
    <div className="space-y-4">
      {/* ───── الهيدر المطور مع فلاتر التحكم التشغيلي ───── */}
      <Motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-3xl border theme-border theme-surface-90 shadow-2xl"
      >
        <div className="absolute inset-0 bg-linear-to-br from-teal-500/15 via-transparent to-orange-500/10" />
        <div className="relative grid gap-4 p-4 md:p-5 xl:grid-cols-[1.3fr_0.9fr] xl:items-stretch">
          <div className="space-y-3 text-right">
            <div className="inline-flex items-center gap-2 rounded-full border theme-border theme-surface px-3 py-1 text-[11px] font-semibold theme-text-muted">
              <CalendarMonth fontSize="small" />
              لوحة إدارة المركز الطبي
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-black leading-tight theme-text md:text-4xl">
                مركز التحكم التشغيلي
              </h1>
              <p className="max-w-2xl text-sm leading-6 theme-text-muted md:text-[15px]">
                متابعة الأداء المالي والطبي في الوقت الحقيقي، مؤشرات أداء رئيسية
                واضحة، وتحليل شامل لعمليات المركز.
              </p>
            </div>
          </div>

          {/* أدوات التحكم والتصفية الزمنية */}
          <div className="grid gap-3 rounded-3xl border theme-border theme-surface p-3 shadow-sm">
            <div className="flex flex-wrap gap-2">
              {Object.entries(allPeriodLabels).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handlePeriodChange(key)}
                  className={`rounded-2xl px-3 py-2 text-sm font-semibold transition-all ${
                    period === key
                      ? "theme-accent text-white shadow-lg shadow-teal-500/20"
                      : "theme-surface theme-text-muted theme-hover-surface"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* حقول التخصيص اليدوي التفاعلية */}
            {(period === "custom_month" || period === "custom_year") && (
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm border-t theme-border pt-2">
                <label className="text-sm theme-text-muted">
                  تحديد الفترة يدوياً:
                </label>
                {period === "custom_month" && (
                  <input
                    type="month"
                    value={filterValue}
                    onChange={(e) => handleFilterChange(e.target.value)}
                    className="rounded-lg border theme-border theme-surface px-2 py-1 text-sm focus:outline-hidden"
                  />
                )}
                {period === "custom_year" && (
                  <input
                    type="number"
                    min={2000}
                    max={2100}
                    placeholder="مثال: 2026"
                    value={filterValue}
                    onChange={(e) => handleFilterChange(e.target.value)}
                    className="w-28 rounded-lg border theme-border theme-surface px-2 py-1 text-sm focus:outline-hidden"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </Motion.section>

      {/* ───── معالجة حالات التحميل والخطأ وعرض البيانات ───── */}
      {isLoading ? (
        <DashboardSkeleton />
      ) : error || !transformed ? (
        <div className="flex h-64 items-center justify-center rounded-3xl border theme-border theme-surface">
          <p className="text-lg theme-text-muted">
            لا توجد بيانات متاحة للفترة المحددة
          </p>
        </div>
      ) : (
        <>
          {/* كروت الـ KPIs العلوية */}
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

          {/* الرسوم البيانية وتحليل الحجوزات */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <GlassCard
              title="تحليل الإيرادات والمرضى"
              subtitle="رسم بياني للإيرادات وعدد المرضى"
              className="xl:col-span-7"
            >
              <RevenueAreaChart
                revenue={transformed.revenue}
                patients={transformed.patients}
                labels={transformed.labels}
              />
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <div className="rounded-2xl border theme-border theme-surface px-3 py-2.5">
                  <p className="text-xs font-semibold theme-text-muted">
                    صافي الربح
                  </p>
                  <p className="mt-1 text-xl font-black theme-text">
                    {formatNumber(transformed.netProfit)} ر.س
                  </p>
                  <TrendPill
                    value={`${transformed.revenueGrowth}%`}
                    up={transformed.revenueGrowth >= 0}
                  />
                </div>
                <div className="rounded-2xl border theme-border theme-surface px-3 py-2.5">
                  <p className="text-xs font-semibold theme-text-muted">
                    إجمالي الإيرادات
                  </p>
                  <p className="mt-1 text-xl font-black theme-text">
                    {formatNumber(transformed.totalRevenue)}
                  </p>
                </div>
                <div className="rounded-2xl border theme-border theme-surface px-3 py-2.5">
                  <p className="text-xs font-semibold theme-text-muted">
                    إجمالي المرضى
                  </p>
                  <p className="mt-1 text-xl font-black theme-text">
                    {formatNumber(transformed.totalPatients)}
                  </p>
                </div>
              </div>
            </GlassCard>

            {/* تفاصيل مصادر الحجوزات وتوزيع التخصصات */}
            <div className="grid gap-4 xl:col-span-5">
              <GlassCard title="تفاصيل الحجوزات" subtitle="حسب المصدر">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border theme-border theme-surface p-3">
                    <span className="text-sm theme-text">التطبيق</span>
                    <p className="text-lg font-black theme-text">
                      {transformed.bookingDetails.app}
                    </p>
                  </div>
                  <div className="rounded-2xl border theme-border theme-surface p-3">
                    <span className="text-sm theme-text">السكرتارية</span>
                    <p className="text-lg font-black theme-text">
                      {transformed.bookingDetails.secretary}
                    </p>
                  </div>
                  <div className="rounded-2xl border theme-border theme-surface p-3">
                    <span className="text-sm theme-text">الطبيب</span>
                    <p className="text-lg font-black theme-text">
                      {transformed.bookingDetails.doctor}
                    </p>
                  </div>
                  <div className="rounded-2xl border theme-border theme-surface p-3">
                    <span className="text-sm theme-text">الكل</span>
                    <p className="text-lg font-black theme-text">
                      {transformed.bookingDetails.total}
                    </p>
                  </div>
                  <div className="col-span-full rounded-2xl border theme-border theme-surface p-3">
                    <p className="text-sm font-semibold theme-text mb-2">
                      المرضى لكل طبيب
                    </p>
                    <div
                      className="space-y-1.5 max-h-32 overflow-y-auto px-2 custom-scrollbar"
                      dir="rtl"
                    >
                      {transformed.bookingDetails.perDoctor.map((doc) => (
                        <div
                          key={doc.doctor_name}
                          className="flex justify-between items-center text-sm py-1 border-b border-dashed theme-border last:border-0"
                        >
                          <span className="theme-text font-medium">
                            {doc.doctor_name}
                          </span>
                          <span className="font-bold px-2 py-0.5 rounded-lg theme-accent-soft theme-text-accent text-xs">
                            {doc.count} حجوزات
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* توزيع حصص التخصصات الطبية */}
              <GlassCard title="توزيع التخصصات" subtitle="حسب البيانات الحية">
                <div className="space-y-3">
                  {/* المخطط الدائري (Donut) */}
                  <div
                    className="mx-auto flex h-48 w-48 items-center justify-center rounded-full"
                    style={{
                      background: `conic-gradient(${transformed.departments
                        .map((item, i) => {
                          const start = transformed.departments
                            .slice(0, i)
                            .reduce((s, c) => s + c.value, 0);
                          return `${item.color} ${start}% ${start + item.value}%`;
                        })
                        .join(", ")})`,
                    }}
                  >
                    <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white/90 shadow-xl backdrop-blur-sm dark:bg-slate-950/90">
                      <p className="text-2xl font-black theme-text">100%</p>
                      <p className="text-xs theme-text-muted">حصة التخصصات</p>
                    </div>
                  </div>

                  {/* وسيلة إيضاح التخصصات مع الألوان */}
                  <div className="grid gap-2 sm:grid-cols-2">
                    {transformed.departments.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center gap-3 rounded-xl border theme-border theme-surface px-3 py-2.5 hover:shadow-md transition-shadow"
                      >
                        {/* دائرة اللون */}
                        <span
                          className="h-4 w-4 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        {/* اسم التخصص والنسبة */}
                        <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                          <span className="text-sm font-medium theme-text truncate">
                            {item.label}
                          </span>
                          <span className="text-sm font-bold theme-text">
                            {item.value}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>

          {/* تركيبة الديموغرافية للمرضى ونبضة المؤشرات السريعة */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <GlassCard
              title="تركيبة المرضى"
              subtitle="العمر، الجنس، ونوع الزيارة"
              className="xl:col-span-8"
            >
              <div className="grid gap-4 lg:grid-cols-3">
                {/* ديموغرافية العمر */}
                <div className="rounded-3xl border theme-border theme-surface p-3">
                  <p className="mb-3 text-sm font-bold theme-text">العمر</p>
                  {transformed.ageGroups.map((item) => (
                    <div key={item.label} className="space-y-1.5 mb-3">
                      <div className="flex justify-between text-sm">
                        <span>{item.label}</span>
                        <span>{item.value}%</span>
                      </div>
                      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${item.value}%`,
                            background: item.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* ديموغرافية الجنس */}
                <div className="rounded-3xl border theme-border theme-surface p-3">
                  <p className="mb-3 text-sm font-bold theme-text">النوع</p>
                  {transformed.genderData.map((item) => (
                    <div key={item.label} className="space-y-1.5 mb-3">
                      <div className="flex justify-between text-sm">
                        <span>{item.label}</span>
                        <span>{item.value}%</span>
                      </div>
                      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${item.value}%`,
                            background: item.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* نوع الزيارة */}
                <div className="rounded-3xl border theme-border theme-surface p-3">
                  <p className="mb-3 text-sm font-bold theme-text">
                    نوع الزيارة
                  </p>
                  {transformed.patientTypeData.map((item) => (
                    <div key={item.label} className="space-y-1.5 mb-3">
                      <div className="flex justify-between text-sm">
                        <span>{item.label}</span>
                        <span>{item.value}%</span>
                      </div>
                      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${item.value}%`,
                            background: item.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* النبضة التشغيلية السريعة */}
            <GlassCard
              title="نبضة سريعة"
              subtitle="مؤشرات مفيدة"
              className="xl:col-span-4"
            >
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <div className="rounded-2xl border theme-border theme-surface px-3 py-3">
                  <p className="text-xs theme-text-muted">صافي الربح</p>
                  <p className="text-xl font-black theme-text">
                    {formatNumber(transformed.netProfit)} ر.س
                  </p>
                </div>
                <div className="rounded-2xl border theme-border theme-surface px-3 py-3">
                  <p className="text-xs theme-text-muted">معدل التغيب</p>
                  <p className="text-xl font-black theme-text">
                    {transformed.noShowRate}
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
