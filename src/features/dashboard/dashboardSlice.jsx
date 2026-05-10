import { createSlice } from "@reduxjs/toolkit";

const periodLabels = {
  day: "اليوم",
  week: "الأسبوع",
  month: "الشهر",
  year: "السنة",
};

const makeDataset = (overrides = {}) => ({
  kpis: [
    {
      id: 1,
      title: "إيرادات الفترة",
      value: "12,500 ر.س",
      trend: "+12%",
      trendUp: true,
      icon: "Payments",
      note: "أعلى من المتوسط",
    },
    {
      id: 2,
      title: "المرضى النشطون",
      value: "48",
      trend: "+5%",
      trendUp: true,
      icon: "Groups",
      note: "زيارة خلال 30 يومًا",
    },
    {
      id: 3,
      title: "إشغال العيادات",
      value: "86%",
      trend: "+4%",
      trendUp: true,
      icon: "LocalHospital",
      note: "تدفق ثابت",
    },
    {
      id: 4,
      title: "عدم الحضور",
      value: "7.4%",
      trend: "-1.2%",
      trendUp: false,
      icon: "WarningAmber",
      note: "تحسن ملحوظ",
    },
  ],
  revenue: [82, 88, 80, 96, 104, 111, 123, 118, 130, 138, 134, 146],
  expenses: [58, 62, 60, 65, 68, 71, 73, 74, 79, 84, 81, 88],
  departments: [
    { label: "قلبية", value: 34, color: "#0AB3BA" },
    { label: "أطفال", value: 26, color: "#F28A4C" },
    { label: "مختبر", value: 18, color: "#2B9EAC" },
    { label: "جلدية", value: 22, color: "#145E67" },
  ],
  insurance: [
    { label: "Cash", value: 38, color: "#0AB3BA" },
    { label: "Insurance", value: 62, color: "#F28A4C" },
  ],
  busyHours: [
    [2, 3, 4, 5, 4, 2, 1],
    [1, 2, 3, 5, 6, 4, 2],
    [1, 1, 2, 4, 6, 5, 2],
    [0, 1, 3, 4, 5, 4, 1],
    [1, 2, 4, 6, 7, 5, 2],
    [0, 1, 2, 3, 4, 3, 1],
  ],
  waitTime: 18,
  waitDelta: -4,
  efficiency: [
    { name: "د. أحمد", patients: 24, minutes: 7 },
    { name: "د. منى", patients: 21, minutes: 8 },
    { name: "د. سامر", patients: 19, minutes: 6 },
    { name: "د. رنا", patients: 17, minutes: 9 },
  ],
  demographics: {
    ageGroups: [
      { label: "0-17", value: 18, color: "#0AB3BA" },
      { label: "18-35", value: 29, color: "#2B9EAC" },
      { label: "36-55", value: 31, color: "#F28A4C" },
      { label: "56+", value: 22, color: "#145E67" },
    ],
    gender: [
      { label: "إناث", value: 54, color: "#0AB3BA" },
      { label: "ذكور", value: 46, color: "#F28A4C" },
    ],
    patientType: [
      { label: "جدد", value: 31, color: "#F28A4C" },
      { label: "مراجعات", value: 69, color: "#0AB3BA" },
    ],
  },
  ...overrides,
});

const dashboardData = {
  day: makeDataset({
    kpis: [
      {
        id: 1,
        title: "إيرادات اليوم",
        value: "12,500 ر.س",
        trend: "+12%",
        trendUp: true,
        icon: "Payments",
        note: "أعلى من متوسط الأسبوع",
      },
      {
        id: 2,
        title: "المرضى النشطون",
        value: "48",
        trend: "+5%",
        trendUp: true,
        icon: "Groups",
        note: "زيارة خلال 30 يومًا",
      },
      {
        id: 3,
        title: "إشغال العيادات",
        value: "86%",
        trend: "+4%",
        trendUp: true,
        icon: "LocalHospital",
        note: "فوق المستوى المستهدف",
      },
      {
        id: 4,
        title: "معدل عدم الحضور",
        value: "7.4%",
        trend: "-1.2%",
        trendUp: false,
        icon: "WarningAmber",
        note: "تحسن عن أمس",
      },
    ],
  }),
  week: makeDataset({
    kpis: [
      {
        id: 1,
        title: "إيرادات الأسبوع",
        value: "83,200 ر.س",
        trend: "+9%",
        trendUp: true,
        icon: "Payments",
        note: "تدفق مستقر",
      },
      {
        id: 2,
        title: "المرضى النشطون",
        value: "216",
        trend: "+11%",
        trendUp: true,
        icon: "Groups",
        note: "تغطية أسبوعية",
      },
      {
        id: 3,
        title: "إشغال العيادات",
        value: "91%",
        trend: "+6%",
        trendUp: true,
        icon: "LocalHospital",
        note: "قرب السعة",
      },
      {
        id: 4,
        title: "معدل عدم الحضور",
        value: "6.1%",
        trend: "-0.8%",
        trendUp: false,
        icon: "WarningAmber",
        note: "أفضل من السابق",
      },
    ],
    revenue: [68, 74, 71, 84, 92, 96, 101, 109, 115, 123, 129, 138],
    expenses: [54, 55, 57, 58, 61, 64, 68, 70, 72, 76, 79, 83],
    waitTime: 22,
    waitDelta: -3,
  }),
  month: makeDataset({
    kpis: [
      {
        id: 1,
        title: "إيرادات الشهر",
        value: "321,500 ر.س",
        trend: "+14%",
        trendUp: true,
        icon: "Payments",
        note: "نمو شهري واضح",
      },
      {
        id: 2,
        title: "المرضى النشطون",
        value: "884",
        trend: "+8%",
        trendUp: true,
        icon: "Groups",
        note: "تجميع المراجعات",
      },
      {
        id: 3,
        title: "إشغال العيادات",
        value: "88%",
        trend: "+5%",
        trendUp: true,
        icon: "LocalHospital",
        note: "توازن جيد",
      },
      {
        id: 4,
        title: "معدل عدم الحضور",
        value: "5.9%",
        trend: "-1.4%",
        trendUp: false,
        icon: "WarningAmber",
        note: "انخفاض جيد",
      },
    ],
    revenue: [122, 128, 123, 134, 145, 153, 161, 168, 175, 182, 190, 198],
    expenses: [92, 94, 96, 98, 101, 104, 108, 110, 114, 117, 121, 125],
    waitTime: 19,
    waitDelta: -5,
  }),
  year: makeDataset({
    kpis: [
      {
        id: 1,
        title: "إيرادات السنة",
        value: "3.8M ر.س",
        trend: "+18%",
        trendUp: true,
        icon: "Payments",
        note: "اتجاه تصاعدي",
      },
      {
        id: 2,
        title: "المرضى النشطون",
        value: "9,420",
        trend: "+13%",
        trendUp: true,
        icon: "Groups",
        note: "قاعدة أكبر",
      },
      {
        id: 3,
        title: "إشغال العيادات",
        value: "92%",
        trend: "+7%",
        trendUp: true,
        icon: "LocalHospital",
        note: "إدارة قوية",
      },
      {
        id: 4,
        title: "معدل عدم الحضور",
        value: "5.1%",
        trend: "-2.0%",
        trendUp: false,
        icon: "WarningAmber",
        note: "تحسن سنوي",
      },
    ],
    revenue: [210, 222, 218, 235, 246, 252, 261, 270, 283, 292, 305, 318],
    expenses: [166, 169, 171, 176, 181, 186, 190, 193, 197, 201, 206, 210],
    waitTime: 16,
    waitDelta: -6,
  }),
};

// Helper functions
export const formatNumber = (value) =>
  new Intl.NumberFormat("ar-SA").format(value);

export const getPeriodData = (period) =>
  dashboardData[period] ?? dashboardData.day;

export const buildAreaPath = (values, width, height, padding) => {
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

const initialState = {
  period: "month",
  filterMode: "none",
  filterValue: "",
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setPeriod: (state, action) => {
      state.period = action.payload;
    },
    setFilterMode: (state, action) => {
      state.filterMode = action.payload;
      state.filterValue = "";
    },
    setFilterValue: (state, action) => {
      state.filterValue = action.payload;
    },
  },
});

export const { setPeriod, setFilterMode, setFilterValue } =
  dashboardSlice.actions;
export default dashboardSlice.reducer;

// Export data and labels
export { periodLabels, dashboardData, makeDataset };
