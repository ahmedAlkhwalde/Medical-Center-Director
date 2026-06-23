import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setPeriod,
  setFilterValue,
  formatNumber,
} from "../store/dashboardSlice";
import { 
  MedicalServices, 
  SupportAgent, 
  PeopleAlt, 
  TrendingUp, 
  AccountBalanceWallet, 
  Paid, 
  Groups, 
  EventBusy 
} from "@mui/icons-material";
import { useGlobalStatistics } from "../service/dashboardService";

const COLORS = [
  "#0ea5e9",
  "#f97316",
  "#8b5cf6",
  "#10b981",
  "#ec4899",
  "#f59e0b",
  "#06b6d4",
  "#ef4444",
  "#14b8a6",
  "#6366f1",
];

const formatDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const useDashboard = () => {
  const dispatch = useDispatch();
  const { period, filterValue } = useSelector((state) => state.dashboard);

  // حساب بارامترات الاستعلام بناءً على الفلتر النشط
  const queryParams = useMemo(() => {
    if (period === "all") return {};

    const params = {};
    const today = new Date();

    if (period === "last_month") {
      const past30Days = new Date();
      past30Days.setDate(today.getDate() - 30);
      params.end_date = formatDateString(today);
      params.start_date = formatDateString(past30Days);
    } else if (period === "last_year") {
      const past365Days = new Date();
      past365Days.setDate(today.getDate() - 365);
      params.end_date = formatDateString(today);
      params.start_date = formatDateString(past365Days);
    } else if (period === "custom_month") {
      params.chart_type = "month";
      if (filterValue && filterValue.includes("-")) {
        const [year, month] = filterValue.split("-");
        params.year = parseInt(year, 10);
        params.month = parseInt(month, 10);
      } else {
        params.year = today.getFullYear();
        params.month = today.getMonth() + 1;
      }
    } else if (period === "custom_year") {
      params.chart_type = "year";
      if (filterValue && /^\d{4}$/.test(filterValue)) {
        params.year = parseInt(filterValue, 10);
      } else {
        params.year = today.getFullYear();
      }
    }

    return params;
  }, [period, filterValue]);

  // جلب البيانات من السيرفر
  const { data: apiData, isLoading, error } = useGlobalStatistics(queryParams);

  // تحويل وهيكلة البيانات الحية للمركز الطبي
  const transformed = useMemo(() => {
    if (!apiData) return null;

    const {
      general_counts,
      summary,
      booking_details,
      demographics,
      appointment_analysis,
      charts,
      doctors_analytics,
      specialization_distribution,
    } = apiData;

    const kpis = [
      {
        id: 1,
        title: "الأطباء",
        value: String(general_counts.doctors_count),
        trend: "ثابت",
        trendUp: true,
        icon: <MedicalServices />,
        note: "عدد الأطباء النشطين",
      },
      {
        id: 2,
        title: "السكرتاريا",
        value: String(general_counts.secretaries_count),
        trend: "ثابت",
        trendUp: true,
        icon: <SupportAgent />,
        note: "فريق التنسيق الإداري",
      },
      {
        id: 3,
        title: "المرضى المسجلين",
        value: String(general_counts.registered_patients),
        trend: "ثابت",
        trendUp: true,
        icon: <PeopleAlt />,
        note: "إجمالي قاعدة البيانات",
      },
      {
        id: 4,
        title: "صافي الربح",
        value: `${summary.net_profit?.current || 0} ر.س`,
        trend: `${summary.net_profit?.change_percent || 0}%`,
        trendUp: (summary.net_profit?.change_percent || 0) >= 0,
        icon: <TrendingUp />,
        note: "العائد الصافي للمركز",
      },
      {
        id: 5,
        title: "الإيرادات",
        value: `${summary.revenue?.current || 0} ر.س`,
        trend: `${summary.revenue?.change_percent || 0}%`,
        trendUp: (summary.revenue?.change_percent || 0) >= 0,
        icon: <AccountBalanceWallet />,
        note: "إجمالي التدفقات الواردة",
      },
    ];

    const revenueArray = charts.map((c) => c.revenue);
    const patientsArray = charts.map((c) => c.patients);
    let labelsArray = charts.map((c) => c.label);

    if (
      period === "last_month" ||
      period === "custom_month" ||
      period === "month"
    ) {
      labelsArray = labelsArray.map((_, idx) => String(idx + 1));
    }

    const departments = specialization_distribution.map((spec, i) => ({
      label: spec.name,
      value: spec.percentage,
      color: COLORS[i % COLORS.length],
    }));

    const efficiency = doctors_analytics.map((doc, i) => ({
      label: doc.doctor_name,
      value: doc.appointments_count,
      color: COLORS[i % COLORS.length],
    }));

    const ageGroups = [
      {
        label: "0-18",
        value: demographics.age_groups.kids_0_18,
        color: COLORS[2],
      },
      {
        label: "19-60",
        value: demographics.age_groups.adults_19_60,
        color: COLORS[3],
      },
      {
        label: "60+",
        value: demographics.age_groups.seniors_above_60,
        color: COLORS[4],
      },
    ];

    const genderData = [
      {
        label: "ذكور",
        value: demographics.gender.male_percentage,
        color: COLORS[5],
      },
      {
        label: "إناث",
        value: demographics.gender.female_percentage,
        color: COLORS[1],
      },
    ];

    const patientTypeData = [
      {
        label: "جدد",
        value: appointment_analysis.visit_types.new_visit_percent,
        color: COLORS[6],
      },
      {
        label: "مراجعات",
        value: appointment_analysis.visit_types.follow_up_percent,
        color: COLORS[0],
      },
    ];

    const bookingDetails = {
      app: booking_details.app_bookings,
      secretary: booking_details.secretary_bookings,
      doctor: booking_details.doctor_bookings,
      total: booking_details.total,
      perDoctor: booking_details.patients_per_doctor,
    };

    const noShowRate = appointment_analysis.no_show_rate.value;
    const totalRevenue = revenueArray.reduce((a, b) => a + b, 0);
    const totalPatients = patientsArray.reduce((a, b) => a + b, 0);
    const netProfit = summary.net_profit?.current || 0;
    const revenueGrowth = summary.revenue?.change_percent || 0;

    return {
      kpis,
      revenue: revenueArray,
      patients: patientsArray,
      labels: labelsArray,
      departments,
      efficiency,
      ageGroups,
      genderData,
      patientTypeData,
      bookingDetails,
      noShowRate,
      totalRevenue,
      totalPatients,
      netProfit,
      revenueGrowth,
    };
  }, [apiData, period]);

  // بناء الإحصائيات السريعة للكروت العليا
  const quickStats = useMemo(() => {
    if (!transformed) return [];
    return [
  ...transformed.kpis,
  {
    id: 102,
    title: "إجمالي الإيرادات",
    value: formatNumber(transformed.totalRevenue),
    trend: "+",
    trendUp: true,
    icon: <Paid  />, 
    note: "إجمالي إيرادات الفترة حصرًا",
  },
  {
    id: 103,
    title: "إجمالي المرضى",
    value: formatNumber(transformed.totalPatients),
    trend: "+",
    trendUp: true,
    icon: <Groups />, 
    note: "المراجعين الفعليين للفترة",
  },
  {
    id: 104,
    title: "معدل عدم الحضور",
    value: transformed.noShowRate,
    trend: "تحسن",
    trendUp: false, 
    icon: <EventBusy />, 
    note: "نسبة غياب المرضى عن الموعد",
  },
];
  }, [transformed]);

  const handlePeriodChange = (key) => {
    dispatch(setPeriod(key));
    dispatch(setFilterValue(""));
  };

  const handleFilterChange = (value) => {
    dispatch(setFilterValue(value));
  };

  return {
    period,
    filterValue,
    isLoading,
    error,
    transformed,
    quickStats,
    handlePeriodChange,
    handleFilterChange,
  };
};
