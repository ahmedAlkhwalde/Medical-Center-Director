import { useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import {
  ArrowBack,
  CalendarMonth,
  AccountBalanceWallet,
  WarningAmber,
  TrendingUp,
  TrendingDown,
  Payments,
  People,
} from '@mui/icons-material';
import { useDoctorStatisticsQuery } from '../../service/doctorsService';
import StatCard from '../dashboard/components/StatCard';
import GlassCard from '../dashboard/components/GlassCard';
import RevenueAreaChart from '../dashboard/components/RevenueAreaChart';
import TrendPill from '../dashboard/components/TrendPill';
import { formatNumber } from '../../features/dashboard/dashboardSlice';

const COLORS = [
  '#0ea5e9', '#f97316', '#8b5cf6', '#10b981', '#ec4899',
  '#f59e0b', '#06b6d4', '#ef4444', '#14b8a6', '#6366f1',
];

const allPeriodLabels = {
  all: 'الكل',
  last_month: 'آخر شهر',
  last_year: 'آخر سنة',
  custom_month: 'شهر معين',
  custom_year: 'سنة معينة',
};

const formatDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const DoctorDetailSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-28 rounded-3xl border theme-border theme-surface p-4">
          <div className="h-4 w-2/3 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="mt-3 h-6 w-1/2 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="mt-2 h-3 w-3/4 rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <div className="rounded-3xl border theme-border theme-surface p-5 xl:col-span-7">
        <div className="h-6 w-1/3 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="mt-4 h-48 rounded-2xl bg-slate-200 dark:bg-slate-700" />
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl border theme-border theme-surface p-3">
              <div className="h-4 w-1/2 rounded-full bg-slate-200 dark:bg-slate-700" />
              <div className="mt-2 h-6 w-3/4 rounded-full bg-slate-200 dark:bg-slate-700" />
            </div>
          ))}
        </div>
      </div>
      <div className="xl:col-span-5 space-y-4">
        <div className="rounded-3xl border theme-border theme-surface p-5">
          <div className="h-6 w-1/2 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-16 rounded-2xl border theme-border theme-surface p-3">
                <div className="flex justify-between">
                  <div className="h-4 w-1/3 rounded-full bg-slate-200 dark:bg-slate-700" />
                  <div className="h-4 w-1/4 rounded-full bg-slate-200 dark:bg-slate-700" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border theme-border theme-surface p-5">
          <div className="h-6 w-1/2 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 rounded-2xl border theme-border theme-surface p-2">
                <div className="h-4 w-3/4 rounded-full bg-slate-200 dark:bg-slate-700" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    <div className="rounded-3xl border theme-border theme-surface p-5">
      <div className="h-6 w-1/3 rounded-full bg-slate-200 dark:bg-slate-700" />
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-3">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="h-4 w-full rounded-full bg-slate-200 dark:bg-slate-700" />
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);

const DoctorDetailPage = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [period, setPeriod] = useState('all');
  const [filterValue, setFilterValue] = useState('');

  const passedDoctorName = location.state?.doctorName;

  const queryParams = useMemo(() => {
    if (period === 'all') return {};

    const params = {};
    const today = new Date();

    if (period === 'last_month') {
      const past30Days = new Date();
      past30Days.setDate(today.getDate() - 30);
      params.end_date = formatDateString(today);
      params.start_date = formatDateString(past30Days);
    } else if (period === 'last_year') {
      const past365Days = new Date();
      past365Days.setDate(today.getDate() - 365);
      params.end_date = formatDateString(today);
      params.start_date = formatDateString(past365Days);
    } else if (period === 'custom_month') {
      params.chart_type = 'month';
      if (filterValue && filterValue.includes('-')) {
        const [year, month] = filterValue.split('-');
        params.year = parseInt(year, 10);
        params.month = parseInt(month, 10);
      } else {
        params.year = today.getFullYear();
        params.month = today.getMonth() + 1;
      }
    } else if (period === 'custom_year') {
      if (filterValue && /^\d{4}$/.test(filterValue)) {
        params.chart_type = 'year';
        params.year = parseInt(filterValue, 10);
      }
    }

    return params;
  }, [period, filterValue]);

  const { data: apiData, isLoading, error } = useDoctorStatisticsQuery(doctorId, queryParams);

  const transformed = useMemo(() => {
    if (!apiData?.data) return null;

    const {
      doctor_info,
      summary,
      booking_details,
      demographics,
      appointment_analysis,
      charts,
    } = apiData.data;

    const kpis = [
      {
        id: 1,
        title: 'المرضى',
        value: String(summary.patients_count?.current || 0),
        trend: `${summary.patients_count?.change_percent || 0}%`,
        trendUp: (summary.patients_count?.change_percent || 0) >= 0,
        icon: 'People',
        note: 'عدد المرضى',
      },
      {
        id: 2,
        title: 'الإيرادات',
        value: `${summary.revenue?.current || 0} ر.س`,
        trend: `${summary.revenue?.change_percent || 0}%`,
        trendUp: (summary.revenue?.change_percent || 0) >= 0,
        icon: 'Payments',
        note: 'إجمالي الإيرادات',
      },
      {
        id: 3,
        title: 'صافي الربح',
        value: `${summary.net_profit?.current || 0} ر.س`,
        trend: `${summary.net_profit?.change_percent || 0}%`,
        trendUp: (summary.net_profit?.change_percent || 0) >= 0,
        icon: 'AccountBalanceWallet',
        note: 'صافي الربح',
      },
      {
        id: 4,
        title: 'عدم الحضور',
        value: appointment_analysis.no_show_rate.value,
        trend: `${appointment_analysis.no_show_rate.change || 0}%`,
        trendUp: false,
        icon: 'WarningAmber',
        note: 'نسبة التغيب',
      },
    ];

    const revenueArray = charts?.map(c => c.revenue) || [];
    const patientsArray = charts?.map(c => c.patients) || [];
    let labelsArray = charts?.map(c => c.label) || [];

    // تحويل التسميات إلى أرقام أيام للفترات الشهرية
    if (
      period === 'last_month' ||
      period === 'custom_month' ||
      period === 'month'
    ) {
      labelsArray = labelsArray.map((_, idx) => String(idx + 1));
    }

    const totalRevenue = revenueArray.reduce((a, b) => a + b, 0);
    const totalPatients = patientsArray.reduce((a, b) => a + b, 0);

    const ageGroups = [
      { label: '0-18', value: demographics.age_groups.kids_0_18, color: COLORS[2] },
      { label: '19-60', value: demographics.age_groups.adults_19_60, color: COLORS[3] },
      { label: '60+', value: demographics.age_groups.seniors_above_60, color: COLORS[4] },
    ];

    const genderData = [
      { label: 'ذكور', value: demographics.gender.male_percentage, color: COLORS[5] },
      { label: 'إناث', value: demographics.gender.female_percentage, color: COLORS[1] },
    ];

    const visitTypes = [
      { label: 'جدد', value: appointment_analysis.visit_types.new_visit_percent, color: COLORS[6] },
      { label: 'مراجعات', value: appointment_analysis.visit_types.follow_up_percent, color: COLORS[0] },
    ];

    return {
      doctorName: doctor_info.name,
      kpis,
      revenue: revenueArray,
      patients: patientsArray,
      labels: labelsArray,   // ← أضفنا التسميات
      totalRevenue,
      totalPatients,
      netProfit: summary.net_profit?.current || 0,
      revenueGrowth: summary.revenue?.change_percent || 0,
      booking: {
        app: booking_details.app_bookings,
        secretary: booking_details.secretary_bookings,
        doctor: booking_details.doctor_bookings,
        total: booking_details.total,
      },
      ageGroups,
      genderData,
      visitTypes,
      noShowRate: appointment_analysis.no_show_rate.value,
    };
  }, [apiData, period]); // ← أضفنا period هنا ليعاد حساب التسميات

  const handlePeriodChange = (key) => {
    setPeriod(key);
    setFilterValue('');
  };

  const displayDoctorName = passedDoctorName || (apiData?.data?.doctor_info?.name) || 'الطبيب';

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
            <div className="grid gap-2 sm:grid-cols-3">
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
            </div>
          </div>

          {/* أدوات التحكم */}
          <div className="grid gap-3 rounded-3xl border theme-border theme-surface p-3 shadow-sm">
            <div className="flex flex-wrap gap-2">
              {Object.entries(allPeriodLabels).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handlePeriodChange(key)}
                  className={`rounded-2xl px-3 py-2 text-sm font-semibold transition-all ${
                    period === key
                      ? 'theme-accent text-white shadow-lg shadow-teal-500/20'
                      : 'theme-surface theme-text-muted theme-hover-surface'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {(period === 'custom_month' || period === 'custom_year') && (
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm border-t theme-border pt-2">
                <label className="text-sm theme-text-muted">تحديد الفترة يدوياً:</label>
                {period === 'custom_month' && (
                  <input
                    type="month"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    className="rounded-lg border theme-border theme-surface px-2 py-1 text-sm"
                  />
                )}
                {period === 'custom_year' && (
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
                {period === 'custom_year' && filterValue.length > 0 && filterValue.length < 4 && (
                  <span className="text-xs text-amber-500 font-semibold">أدخل 4 أرقام</span>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 mt-auto pt-2">
              <div className="rounded-2xl border theme-border theme-surface px-3 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] theme-text-muted">الفلتر النشط</p>
                <p className="text-sm font-black theme-text">{allPeriodLabels[period]}</p>
              </div>
              <div className="rounded-2xl border theme-border theme-surface px-3 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] theme-text-muted">آلية المعالجة</p>
                <p className="text-sm font-black theme-text">
                  {period === 'all' ? 'بدون باراميترات' : period === 'last_month' || period === 'last_year' ? 'تلقائي (Server-side)' : 'تصفية مخصصة'}
                </p>
              </div>
            </div>
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
          {/* Quick Stats */}
          <Motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-8"
          >
            {transformed.kpis.map((item) => (
              <StatCard key={item.id} item={item} />
            ))}
            <StatCard item={{
              id: 101, title: 'إجمالي الإيرادات', value: formatNumber(transformed.totalRevenue), trend: '+', trendUp: true, icon: Payments, note: 'إجمالي الفترة',
            }} />
            <StatCard item={{
              id: 102, title: 'إجمالي المرضى', value: formatNumber(transformed.totalPatients), trend: '+', trendUp: true, icon: People, note: 'عدد المرضى',
            }} />
            <StatCard item={{
              id: 103, title: 'صافي التدفق', value: `${formatNumber(transformed.netProfit)} ر.س`, trend: `${transformed.revenueGrowth}%`, trendUp: transformed.revenueGrowth >= 0, icon: AccountBalanceWallet, note: 'بعد الخصم',
            }} />
            <StatCard item={{
              id: 104, title: 'معدل عدم الحضور', value: transformed.noShowRate, trend: 'تحسن', trendUp: false, icon: WarningAmber, note: 'نسبة التغيب',
            }} />
          </Motion.section>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <GlassCard
              title="تحليل الإيرادات والمرضى"
              subtitle="رسم بياني للإيرادات وعدد المرضى"
              className="xl:col-span-7"
            >
              <RevenueAreaChart
                revenue={transformed.revenue}
                patients={transformed.patients}
                labels={transformed.labels}   // ← تمرير التسميات
              />
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <div className="rounded-2xl border theme-border theme-surface px-3 py-2.5">
                  <p className="text-xs font-semibold theme-text-muted">صافي الربح</p>
                  <p className="mt-1 text-xl font-black theme-text">
                    {formatNumber(transformed.netProfit)} ر.س
                  </p>
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

          <GlassCard
            title="تركيبة المرضى"
            subtitle="العمر، الجنس، ونوع الزيارة"
            className="xl:col-span-8"
          >
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-3xl border theme-border theme-surface p-3">
                <p className="mb-3 text-sm font-bold theme-text">العمر</p>
                {transformed.ageGroups.map((item) => (
                  <div key={item.label} className="space-y-1.5 mb-3">
                    <div className="flex justify-between text-sm">
                      <span>{item.label}</span>
                      <span>{item.value}%</span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${item.value}%`, background: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-3xl border theme-border theme-surface p-3">
                <p className="mb-3 text-sm font-bold theme-text">النوع</p>
                {transformed.genderData.map((item) => (
                  <div key={item.label} className="space-y-1.5 mb-3">
                    <div className="flex justify-between text-sm">
                      <span>{item.label}</span>
                      <span>{item.value}%</span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${item.value}%`, background: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-3xl border theme-border theme-surface p-3">
                <p className="mb-3 text-sm font-bold theme-text">نوع الزيارة</p>
                {transformed.visitTypes.map((item) => (
                  <div key={item.label} className="space-y-1.5 mb-3">
                    <div className="flex justify-between text-sm">
                      <span>{item.label}</span>
                      <span>{item.value}%</span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${item.value}%`, background: item.color }} />
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