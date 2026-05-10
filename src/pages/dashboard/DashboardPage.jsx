import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion as Motion } from "framer-motion";
import { CalendarMonth, CheckCircle, AccountBalanceWallet, CreditCard, AccessTime } from "@mui/icons-material";
import {
  setPeriod,
  setFilterMode,
  setFilterValue,
  periodLabels,
  getPeriodData,
  formatNumber,
} from "../../features/dashboard/dashboardSlice";
import StatCard from "./components/StatCard";
import GlassCard from "./components/GlassCard";
import RevenueAreaChart from "./components/RevenueAreaChart";
import TrendPill from "./components/TrendPill";
import Heatmap from "./components/Heatmap";
import MiniBarList from "./components/MiniBarList";
import CompactMetric from "./components/CompactMetric";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { period, filterMode, filterValue } = useSelector((state) => state.dashboard);
  const rawData = getPeriodData(period);

  // apply optional deterministic variation when a specific date/month/year selected
  const filteredData = useMemo(() => {
    if (filterMode === "none" || !filterValue) return rawData;
    try {
      const key = String(filterValue);
      const seed = Array.from(key).reduce((s, c) => s + c.charCodeAt(0), 0);
      const factor = 1 + ((seed % 13) - 6) / 100; // -6% .. +6%

      const clone = {
        ...rawData,
        kpis: rawData.kpis.map((k) => ({ ...k })),
        revenue: rawData.revenue.map((v) => Math.round(v * factor)),
        expenses: rawData.expenses.map((v) => Math.round(v * factor)),
        departments: rawData.departments.map((d) => ({
          ...d,
          value: Math.max(2, Math.min(90, Math.round(d.value * factor))),
        })),
      };
      return clone;
    } catch (e) {
      return rawData;
    }
  }, [rawData, filterMode, filterValue]);

  const data = filteredData;

  const totalRevenue = useMemo(
    () => data.revenue.reduce((sum, value) => sum + value, 0),
    [data.revenue],
  );
  const totalExpenses = useMemo(
    () => data.expenses.reduce((sum, value) => sum + value, 0),
    [data.expenses],
  );
  const netCashFlow = totalRevenue - totalExpenses;
  const revenueGrowth =
    period === "day"
      ? 12
      : period === "week"
        ? 9
        : period === "month"
          ? 14
          : 18;

  const quickStats = [
    ...data.kpis,
    {
      id: 101,
      title: "صافي التدفق",
      value: `${formatNumber(netCashFlow)} ر.س`,
      trend: `${revenueGrowth}%`,
      trendUp: true,
      icon: "AccountBalanceWallet",
      note: "بعد الخصم",
    },
    {
      id: 102,
      title: "إجمالي الإيرادات",
      value: formatNumber(totalRevenue),
      trend: "+",
      trendUp: true,
      icon: "Payments",
      note: "إجمالي الفترة",
    },
    {
      id: 103,
      title: "إجمالي المصاريف",
      value: formatNumber(totalExpenses),
      trend: "-",
      trendUp: false,
      icon: "CreditCard",
      note: "تشغيل المركز",
    },
    {
      id: 104,
      title: "متوسط الانتظار",
      value: `${data.waitTime} د`,
      trend: "زمن",
      trendUp: false,
      icon: "AccessTime",
      note: "من الاستقبال",
    },
  ];

  return (
    <div className="space-y-4">
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
              <div className="inline-flex items-center gap-2 rounded-full border theme-border theme-surface px-3 py-1 text-[11px] font-semibold theme-text-muted">
                <CalendarMonth fontSize="small" />
                لوحة الإحصائيات العامة
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-black leading-tight theme-text md:text-4xl">
                  لوحة كثيفة ومباشرة تركز على الأرقام لا الزخرفة
                </h1>
                <p className="max-w-2xl text-sm leading-6 theme-text-muted md:text-[15px]">
                  تم تقليل الفراغات، تجميع KPI في شبكة متقاربة، وإبراز التحليل
                  المالي والتشغيلي داخل بطاقات صغيرة واضحة.
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-3">
                <CompactMetric label="النمط" value="Grid كثيف" tone="teal" />
                <CompactMetric
                  label="التركيز"
                  value="أرقام تشغيلية"
                  tone="orange"
                />
                <CompactMetric
                  label="الحالة"
                  value="جاهز للقراءة"
                  tone="rose"
                />
              </div>
            </div>

            <div className="grid gap-3 rounded-3xl border theme-border theme-surface p-3 shadow-sm">
              <div className="flex flex-wrap gap-2">
                {Object.entries(periodLabels).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => dispatch(setPeriod(key))}
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

              <div className="mt-3 flex items-center gap-2 text-sm">
                <label className="text-sm theme-text-muted">
                  تصفية بالوقت:
                </label>
                <select
                  value={filterMode}
                  onChange={(e) => dispatch(setFilterMode(e.target.value))}
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
                    onChange={(e) => dispatch(setFilterValue(e.target.value))}
                    className="rounded-lg border theme-border theme-surface px-2 py-1 text-sm"
                  />
                ) : filterMode === "month" ? (
                  <input
                    type="month"
                    value={filterValue}
                    onChange={(e) => dispatch(setFilterValue(e.target.value))}
                    className="rounded-lg border theme-border theme-surface px-2 py-1 text-sm"
                  />
                ) : filterMode === "year" ? (
                  <input
                    type="number"
                    min={2000}
                    max={2100}
                    placeholder="مثال: 2025"
                    value={filterValue}
                    onChange={(e) => dispatch(setFilterValue(e.target.value))}
                    className="w-28 rounded-lg border theme-border theme-surface px-2 py-1 text-sm"
                  />
                ) : null}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <CompactMetric
                  label="التدفق"
                  value={`${formatNumber(netCashFlow)} ر.س`}
                  tone="teal"
                />
                <CompactMetric
                  label="الانتظار"
                  value={`${data.waitTime} د`}
                  tone="orange"
                />
                <CompactMetric
                  label="الأقسام"
                  value={`${data.departments.length}`}
                  tone="rose"
                />
                <CompactMetric label="الطاقة" value="88%" tone="teal" />
              </div>
            </div>
          </div>

          <div className="grid gap-2 rounded-3xl border theme-border theme-surface p-3 shadow-sm">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-2xl border theme-border theme-surface px-3 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] theme-text-muted">
                  المدير
                </p>
                <p className="mt-1 text-base font-black theme-text">
                  د. سارة الأحمد
                </p>
                <p className="text-xs theme-text-muted">
                  لوحة المراقبة الحالية
                </p>
              </div>
              <div className="rounded-2xl border theme-border theme-surface px-3 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] theme-text-muted">
                  السرعة
                </p>
                <p className="mt-1 text-base font-black theme-text">
                  {data.waitTime} دقيقة
                </p>
                <p className="text-xs theme-text-muted">متوسط استقبال المرضى</p>
              </div>
            </div>
            <div className="rounded-2xl border theme-border theme-surface px-3 py-2">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span className="theme-text">سعة العيادات</span>
                <span className="theme-text-muted">86%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-700/70">
                <div className="h-full w-[86%] rounded-full bg-linear-to-r from-teal-500 to-cyan-400" />
              </div>
            </div>
            <div className="rounded-2xl border theme-border theme-surface px-3 py-2">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span className="theme-text">الزيارات الفعالة</span>
                <span className="theme-text-muted">
                  {formatNumber(data.kpis[1].value.replace(/[^\d]/g, ""))}
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-700/70">
                <div className="h-full w-[72%] rounded-full bg-linear-to-r from-orange-500 to-amber-400" />
              </div>
            </div>
          </div>
        </div>
      </Motion.section>

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

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <GlassCard
          title="تحليل الدخل والمصاريف"
          subtitle="المقارنة الأساسية في مساحة بصرية واحدة ومضغوطة"
          className="xl:col-span-7"
        >
          <RevenueAreaChart revenue={data.revenue} expenses={data.expenses} />
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <div className="rounded-2xl border theme-border theme-surface px-3 py-2.5">
              <p className="text-xs font-semibold theme-text-muted">
                صافي التدفق
              </p>
              <p className="mt-1 text-xl font-black theme-text">
                {formatNumber(netCashFlow)} ر.س
              </p>
              <div className="mt-2">
                <TrendPill value={`${revenueGrowth}%`} up />
              </div>
            </div>
            <div className="rounded-2xl border theme-border theme-surface px-3 py-2.5">
              <p className="text-xs font-semibold theme-text-muted">
                إجمالي الإيرادات
              </p>
              <p className="mt-1 text-xl font-black theme-text">
                {formatNumber(totalRevenue)}
              </p>
              <p className="mt-2 text-xs theme-text-muted">
                خلال الفترة المحددة
              </p>
            </div>
            <div className="rounded-2xl border theme-border theme-surface px-3 py-2.5">
              <p className="text-xs font-semibold theme-text-muted">
                إجمالي المصاريف
              </p>
              <p className="mt-1 text-xl font-black theme-text">
                {formatNumber(totalExpenses)}
              </p>
              <p className="mt-2 text-xs theme-text-muted">
                رواتب وإيجارات ولوازم
              </p>
            </div>
          </div>
        </GlassCard>

        <div className="grid gap-4 xl:col-span-5">
          <GlassCard
            title="إيقاع التشغيل"
            subtitle="مؤشرات سريعة في مساحة ضيقة"
          >
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-2xl border theme-border theme-surface px-3 py-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold theme-text">
                    متوسط الانتظار
                  </div>
                  <div className="text-lg font-black theme-text">
                    {data.waitTime} د
                  </div>
                </div>
                <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle fontSize="small" />
                  أقل بـ {Math.abs(data.waitDelta)} دقائق
                </div>
              </div>

              <div className="rounded-2xl border theme-border theme-surface px-3 py-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold theme-text">
                    نسبة الإشغال
                  </div>
                  <div className="text-lg font-black theme-text">86%</div>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-700/70">
                  <div className="h-full w-[86%] rounded-full bg-linear-to-r from-teal-500 to-cyan-400" />
                </div>
              </div>

              <div className="rounded-2xl border theme-border theme-surface px-3 py-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold theme-text">
                    الطاقة اليومية
                  </div>
                  <div className="text-lg font-black theme-text">
                    {data.kpis[1].value}
                  </div>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-700/70">
                  <div className="h-full w-[72%] rounded-full bg-linear-to-r from-orange-500 to-amber-400" />
                </div>
              </div>

              <div className="rounded-2xl border theme-border theme-surface px-3 py-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold theme-text">
                    الفرز الأولي
                  </div>
                  <div className="text-lg font-black theme-text">31%</div>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-700/70">
                  <div className="h-full w-[31%] rounded-full bg-linear-to-r from-rose-500 to-fuchsia-400" />
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard
            title="توزيع الأقسام"
            subtitle="زاوية عرض سريعة داخل نفس الشبكة"
          >
            <div className="space-y-3">
              <div
                className="mx-auto flex h-48 w-48 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(${data.departments
                    .map((item, index) => {
                      const start = data.departments
                        .slice(0, index)
                        .reduce((sum, current) => sum + current.value, 0);
                      const end = start + item.value;
                      return `${item.color} ${start}% ${end}%`;
                    })
                    .join(", ")})`,
                }}
              >
                <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full border border-white/50 bg-white/90 text-center shadow-xl backdrop-blur-sm dark:border-white/10 dark:bg-slate-950/90">
                  <p className="text-2xl font-black theme-text">100%</p>
                  <p className="text-xs theme-text-muted">حصة الأقسام</p>
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {data.departments.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-2xl border theme-border theme-surface px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-3.5 w-3.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium theme-text">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-sm font-bold theme-text">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <GlassCard
          title="أوقات الذروة"
          subtitle="Heatmap مضغوط يوضح كثافة الزحام"
          className="xl:col-span-7"
        >
          <Heatmap matrix={data.busyHours} />
        </GlassCard>

        <GlassCard
          title="كفاءة الأطباء"
          subtitle="مرضى مقابل وقت المعاينة"
          className="xl:col-span-5"
        >
          <MiniBarList items={data.efficiency} />
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <GlassCard
          title="تركيبة المرضى"
          subtitle="العمر، الجنس، ونوع الزيارة في لوحة واحدة"
          className="xl:col-span-8"
        >
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-3xl border theme-border theme-surface p-3">
              <p className="mb-3 text-sm font-bold theme-text">العمر</p>
              <div className="space-y-3">
                {data.demographics.ageGroups.map((item) => (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="theme-text">{item.label}</span>
                      <span className="theme-text-muted">{item.value}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-700/70">
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

            <div className="rounded-3xl border theme-border theme-surface p-3">
              <p className="mb-3 text-sm font-bold theme-text">النوع</p>
              <div className="space-y-3">
                {data.demographics.gender.map((item) => (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="theme-text">{item.label}</span>
                      <span className="theme-text-muted">{item.value}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-700/70">
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

            <div className="rounded-3xl border theme-border theme-surface p-3">
              <p className="mb-3 text-sm font-bold theme-text">نوع الزيارة</p>
              <div className="space-y-3">
                {data.demographics.patientType.map((item) => (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="theme-text">{item.label}</span>
                      <span className="theme-text-muted">{item.value}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-700/70">
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
          </div>
        </GlassCard>

        <GlassCard
          title="نبضة سريعة"
          subtitle="مؤشرات مفيدة خلال لحظة"
          className="xl:col-span-4"
        >
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-2xl border theme-border theme-surface px-3 py-3">
              <p className="text-xs font-semibold theme-text-muted">الصافـي</p>
              <p className="mt-1 text-xl font-black theme-text">
                {formatNumber(netCashFlow)} ر.س
              </p>
            </div>
            <div className="rounded-2xl border theme-border theme-surface px-3 py-3">
              <p className="text-xs font-semibold theme-text-muted">
                إجمالي الإيرادات
              </p>
              <p className="mt-1 text-xl font-black theme-text">
                {formatNumber(totalRevenue)}
              </p>
            </div>
            <div className="rounded-2xl border theme-border theme-surface px-3 py-3">
              <p className="text-xs font-semibold theme-text-muted">
                إجمالي المصاريف
              </p>
              <p className="mt-1 text-xl font-black theme-text">
                {formatNumber(totalExpenses)}
              </p>
            </div>
            <div className="rounded-2xl border theme-border theme-surface px-3 py-3">
              <p className="text-xs font-semibold theme-text-muted">
                مدة الانتظار
              </p>
              <p className="mt-1 text-xl font-black theme-text">
                {data.waitTime} دقيقة
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default DashboardPage;
