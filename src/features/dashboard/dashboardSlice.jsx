import { createSlice } from '@reduxjs/toolkit';

export const periodLabels = {
  day: 'اليوم',
  week: 'الأسبوع',
  month: 'الشهر',
  year: 'السنة',
};

// تنسيق الأرقام العربية
export const formatNumber = (value) =>
  new Intl.NumberFormat('ar-SA').format(value);

// دوال مساعدة للرسم البياني
export const buildAreaPath = (values, width, height, padding) => {
  if (!values.length) return '';

  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = maxValue - minValue || 1;
  const stepX = (width - padding * 2) / Math.max(values.length - 1, 1);

  return values
    .map((value, index) => {
      const x = padding + index * stepX;
      const normalized = (value - minValue) / range;
      const y = height - padding - normalized * (height - padding * 2);
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');
};

const initialState = {
  period: 'all',
  filterMode: 'none',
  filterValue: '',
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setPeriod: (state, action) => {
      state.period = action.payload;
    },
    setFilterMode: (state, action) => {
      state.filterMode = action.payload;
      state.filterValue = '';
    },
    setFilterValue: (state, action) => {
      state.filterValue = action.payload;
    },
  },
});

export const { setPeriod, setFilterMode, setFilterValue } = dashboardSlice.actions;
export default dashboardSlice.reducer;