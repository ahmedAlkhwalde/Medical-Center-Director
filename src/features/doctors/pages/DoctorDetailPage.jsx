import React from "react";
import { motion as Motion } from "framer-motion";
import {
  ArrowBack,
  WarningAmber,
  AccountBalanceWallet,
  Payments,
  People,
} from "@mui/icons-material";

// استيراد المكونات والـ Hook الجديد
import { useDoctorDetailPage } from "../hooks/useDoctorDetailPage";
import DoctorDetailSkeleton from "../components/DoctorDetailSkeleton";

import StatCard from "../../dashboard/components/StatCard";
import GlassCard from "../../dashboard/components/GlassCard";
import RevenueAreaChart from "../../dashboard/components/RevenueAreaChart";
import TrendPill from "../../dashboard/components/TrendPill";
import { formatNumber } from "../../dashboard/store/dashboardSlice";

const allPeriodLabels = {
  all: "الكل",
  last_month: "آخر شهر",
  last_year: "آخر سنة",
  custom_month: "شهر معين",
  custom_year: "سنة معينة",
};

const DoctorDetailPage = () => {
  const {
    period,
    filterValue,
    setFilterValue,
    isLoading,
    error,
    transformed,
    displayDoctorName,
    handlePeriodChange,
    navigate,
  } = useDoctorDetailPage();

  return (
    <div className="space-y-4">
      {/* ───── هيدر ثابت ───── */}
      <Motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-3xl border theme-border theme-surface-90 shadow-2xl"
      >
        <div className="absolute inset-0 bg-linear-to-br from-teal-500/15 via-transparent to-orange-500/10" />
        <div className="relative grid gap-4 p-4 md:p-5 xl:grid-cols-[1.3fr_0.9fr] xl:items-stretch">
          <div className="space-y-3 text-right">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-full border theme-border theme-surface px-3 py-1 text-[11px] font-semibold theme-text-muted hover:bg-theme-surface"
            >
              <ArrowBack fontSize="small" />
              العودة
            </button>
            <div className="space-y-2">
              <h1 className="text-3xl font-black leading-tight theme-text md:text-4xl">
                {displayDoctorName}
              </h1>
              <p className="max-w-2xl text-sm leading-6 theme-text-muted md:text-[15px]">
                إحصائيات الطبيب والعمليات المرتبطة
              </p>
            </div>
            {/* <div className="grid gap-2 sm:grid-cols-3">
              <div className="rounded-2xl border theme-border theme-surface px-3 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] theme-text-muted">النمط</p>
                <p className="text-sm font-black theme-text">شبكة كثيفة</p>
              </div>
              <div className="rounded-2xl border theme-border theme-surface px-3 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] theme-text-muted">التركيز</p>
                <p className="text-sm font-black theme-text">تشغيلي ومالي</p>
              </div>
              <div className="rounded-2xl border theme-border theme-surface px-3 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] theme-text-muted">الحالة</p>
                <p className="text-sm font-black theme-text">متصل بالخادم</p>
              </div>
            </div> */}
          </div>

          {/* أدوات التحكم بالفلترة */}
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

            {(period === "custom_month" || period === "custom_year") && (
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm border-t theme-border pt-2">
                <label className="text-sm theme-text-muted">تحديد الفترة يدوياً:</label>
                {period === "custom_month" && (
                  <input
                    type="month"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    className="rounded-lg border theme-border theme-surface px-2 py-1 text-sm"
                  />
                )}
                {period === "custom_year" && (
                  <input
                    type="number"
                    min={2000}
                    max={2100}
                    placeholder="مثال: 2026"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    className="w-28 rounded-lg border theme-border theme-surface px-2 py-1 text-sm"
                  />
                )}
                {period === "custom_year" && filterValue.length > 0 && filterValue.length < 4 && (
                  <span className="text-xs text-amber-500 font-semibold">أدخل 4 أرقام</span>
                )}
              </div>
            )}

            {/* <div className="grid grid-cols-2 gap-2 mt-auto pt-2">
              <div className="rounded-2xl border theme-border theme-surface px-3 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] theme-text-muted">الفلتر النشط</p>
                <p className="text-sm font-black theme-text">{allPeriodLabels[period]}</p>
              </div>
              <div className="rounded-2xl border theme-border theme-surface px-3 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] theme-text-muted">آلية المعالجة</p>
                <p className="text-sm font-black theme-text">
                  {period === "all"
                    ? "بدون باراميترات"
                    : period === "last_month" || period === "last_year"
                    ? "تلقائي (Server-side)"
                    : "تصفية مخصصة"}
                </p>
              </div>
            </div> */}
          </div>
        </div>
      </Motion.section>

      {/* ───── المحتوى الديناميكي ───── */}
      {isLoading ? (
        <DoctorDetailSkeleton />
      ) : error || !transformed ? (
        <div className="flex h-64 items-center justify-center rounded-3xl border theme-border theme-surface">
          <p className="text-lg theme-text-muted">لا توجد بيانات متاحة للفترة المحددة</p>
        </div>
      ) : (
        <>
          {/* كروت الإحصائيات (KPIs) */}
          <Motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-8"
          >
            {transformed.kpis.map((item) => (
              <StatCard key={item.id} item={item} />
            ))}
            <StatCard
              item={{
                id: 101,
                title: "إجمالي الإيرادات",
                value: formatNumber(transformed.totalRevenue),
                trend: "+",
                trendUp: true,
                icon: Payments,
                note: "إجمالي الفترة",
              }}
            />
            <StatCard
              item={{
                id: 102,
                title: "إجمالي المرضى",
                value: formatNumber(transformed.totalPatients),
                trend: "+",
                trendUp: true,
                icon: People,
                note: "عدد المرضى",
              }}
            />
            <StatCard
              item={{
                id: 103,
                title: "صافي التدفق",
                value: `${formatNumber(transformed.netProfit)} ر.س`,
                trend: `${transformed.revenueGrowth}%`,
                trendUp: transformed.revenueGrowth >= 0,
                icon: AccountBalanceWallet,
                note: "بعد الخصم",
              }}
            />
            <StatCard
              item={{
                id: 104,
                title: "معدل عدم الحضور",
                value: transformed.noShowRate,
                trend: "تحسن",
                trendUp: false,
                icon: WarningAmber,
                note: "نسبة التغيب",
              }}
            />
          </Motion.section>

          {/* الرسوم البيانية وتفاصيل الحجوزات */}
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
                  <p className="text-xs font-semibold theme-text-muted">صافي الربح</p>
                  <p className="mt-1 text-xl font-black theme-text">{formatNumber(transformed.netProfit)} ر.س</p>
                  <TrendPill value={`${transformed.revenueGrowth}%`} up={transformed.revenueGrowth >= 0} />
                </div>
                <div className="rounded-2xl border theme-border theme-surface px-3 py-2.5">
                  <p className="text-xs font-semibold theme-text-muted">إجمالي الإيرادات</p>
                  <p className="mt-1 text-xl font-black theme-text">{formatNumber(transformed.totalRevenue)}</p>
                  <p className="mt-2 text-xs theme-text-muted">خلال الفترة</p>
                </div>
                <div className="rounded-2xl border theme-border theme-surface px-3 py-2.5">
                  <p className="text-xs font-semibold theme-text-muted">إجمالي المرضى</p>
                  <p className="mt-1 text-xl font-black theme-text">{formatNumber(transformed.totalPatients)}</p>
                  <p className="mt-2 text-xs theme-text-muted">مرضى الفترة</p>
                </div>
              </div>
            </GlassCard>

            <div className="grid gap-4 xl:col-span-5">
              <GlassCard title="تفاصيل الحجوزات" subtitle="حسب المصدر">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border theme-border theme-surface px-3 py-3">
                    <span className="text-sm theme-text">التطبيق</span>
                    <p className="text-lg font-black theme-text">{transformed.booking.app}</p>
                  </div>
                  <div className="rounded-2xl border theme-border theme-surface px-3 py-3">
                    <span className="text-sm theme-text">السكرتارية</span>
                    <p className="text-lg font-black theme-text">{transformed.booking.secretary}</p>
                  </div>
                  <div className="rounded-2xl border theme-border theme-surface px-3 py-3">
                    <span className="text-sm theme-text">الطبيب</span>
                    <p className="text-lg font-black theme-text">{transformed.booking.doctor}</p>
                  </div>
                  <div className="rounded-2xl border theme-border theme-surface px-3 py-3">
                    <span className="text-sm theme-text">العدد الكلي</span>
                    <p className="text-lg font-black theme-text">{transformed.booking.total}</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard title="نبضة سريعة" subtitle="مؤشرات مفيدة">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  <div className="rounded-2xl border theme-border theme-surface px-3 py-3">
                    <p className="text-xs theme-text-muted">صافي الربح</p>
                    <p className="text-xl font-black theme-text">{formatNumber(transformed.netProfit)} ر.س</p>
                  </div>
                  <div className="rounded-2xl border theme-border theme-surface px-3 py-3">
                    <p className="text-xs theme-text-muted">الإيرادات</p>
                    <p className="text-xl font-black theme-text">{formatNumber(transformed.totalRevenue)}</p>
                  </div>
                  <div className="rounded-2xl border theme-border theme-surface px-3 py-3">
                    <p className="text-xs theme-text-muted">المرضى</p>
                    <p className="text-xl font-black theme-text">{formatNumber(transformed.totalPatients)}</p>
                  </div>
                  <div className="rounded-2xl border theme-border theme-surface px-3 py-3">
                    <p className="text-xs theme-text-muted">معدل التغيب</p>
                    <p className="text-xl font-black theme-text">{transformed.noShowRate}</p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>

          {/* تركيبة المرضى والشرائح الديموغرافية */}
          <GlassCard title="تركيبة المرضى" subtitle="العمر، الجنس، ونوع الزيارة" className="xl:col-span-8">
            <div className="grid gap-4 lg:grid-cols-3">
              {/* شريحة العمر */}
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
                        style={{ width: `${item.value}%`, background: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* شريحة النوع */}
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
                        style={{ width: `${item.value}%`, background: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* شريحة نوع الزيارة */}
              <div className="rounded-3xl border theme-border theme-surface p-3">
                <p className="mb-3 text-sm font-bold theme-text">نوع الزيارة</p>
                {transformed.visitTypes.map((item) => (
                  <div key={item.label} className="space-y-1.5 mb-3">
                    <div className="flex justify-between text-sm">
                      <span>{item.label}</span>
                      <span>{item.value}%</span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${item.value}%`, background: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </>
      )}
    </div>
  );
};

export default DoctorDetailPage;