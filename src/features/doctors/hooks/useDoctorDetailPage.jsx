import { useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDoctorStatisticsQuery } from "../service/doctorsService"; // تأكد من مسار الـ service الصحيح لديك

const COLORS = [
  "#0ea5e9", "#f97316", "#8b5cf6", "#10b981", "#ec4899",
  "#f59e0b", "#06b6d4", "#ef4444", "#14b8a6", "#6366f1",
];

const formatDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const useDoctorDetailPage = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [period, setPeriod] = useState("all");
  const [filterValue, setFilterValue] = useState("");

  const passedDoctorName = location.state?.doctorName;

  // حساب الـ query parameters بناءً على الفلتر المحدد
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
      if (filterValue && /^\d{4}$/.test(filterValue)) {
        params.chart_type = "year";
        params.year = parseInt(filterValue, 10);
      }
    }

    return params;
  }, [period, filterValue]);

  // استدعاء البيانات من السيرفر
  const { data: apiData, isLoading, error } = useDoctorStatisticsQuery(doctorId, queryParams);

  // معالجة وهيكلة البيانات المستقبلة
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
        title: "المرضى",
        value: String(summary.patients_count?.current || 0),
        trend: `${summary.patients_count?.change_percent || 0}%`,
        trendUp: (summary.patients_count?.change_percent || 0) >= 0,
        icon: "People",
        note: "عدد المرضى",
      },
      {
        id: 2,
        title: "الإيرادات",
        value: `${summary.revenue?.current || 0} ر.س`,
        trend: `${summary.revenue?.change_percent || 0}%`,
        trendUp: (summary.revenue?.change_percent || 0) >= 0,
        icon: "Payments",
        note: "إجمالي الإيرادات",
      },
      {
        id: 3,
        title: "صافي الربح",
        value: `${summary.net_profit?.current || 0} ر.س`,
        trend: `${summary.net_profit?.change_percent || 0}%`,
        trendUp: (summary.net_profit?.change_percent || 0) >= 0,
        icon: "AccountBalanceWallet",
        note: "صافي الربح",
      },
      {
        id: 4,
        title: "عدم الحضور",
        value: appointment_analysis.no_show_rate.value,
        trend: `${appointment_analysis.no_show_rate.change || 0}%`,
        trendUp: false,
        icon: "WarningAmber",
        note: "نسبة التغيب",
      },
    ];

    const revenueArray = charts?.map((c) => c.revenue) || [];
    const patientsArray = charts?.map((c) => c.patients) || [];
    let labelsArray = charts?.map((c) => c.label) || [];

    if (period === "last_month" || period === "custom_month" || period === "month") {
      labelsArray = labelsArray.map((_, idx) => String(idx + 1));
    }

    const totalRevenue = revenueArray.reduce((a, b) => a + b, 0);
    const totalPatients = patientsArray.reduce((a, b) => a + b, 0);

    const ageGroups = [
      { label: "0-18", value: demographics.age_groups.kids_0_18, color: COLORS[2] },
      { label: "19-60", value: demographics.age_groups.adults_19_60, color: COLORS[3] },
      { label: "60+", value: demographics.age_groups.seniors_above_60, color: COLORS[4] },
    ];

    const genderData = [
      { label: "ذكور", value: demographics.gender.male_percentage, color: COLORS[5] },
      { label: "إناث", value: demographics.gender.female_percentage, color: COLORS[1] },
    ];

    const visitTypes = [
      { label: "جدد", value: appointment_analysis.visit_types.new_visit_percent, color: COLORS[6] },
      { label: "مراجعات", value: appointment_analysis.visit_types.follow_up_percent, color: COLORS[0] },
    ];

    return {
      doctorName: doctor_info.name,
      kpis,
      revenue: revenueArray,
      patients: patientsArray,
      labels: labelsArray,
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
  }, [apiData, period]);

  const handlePeriodChange = (key) => {
    setPeriod(key);
    setFilterValue("");
  };

  const displayDoctorName = passedDoctorName || apiData?.data?.doctor_info?.name || "الطبيب";

  return {
    period,
    filterValue,
    setFilterValue,
    isLoading,
    error,
    transformed,
    displayDoctorName,
    handlePeriodChange,
    navigate,
  };
};