import { useMemo } from 'react';
import { buildAreaPath } from '../../../features/dashboard/dashboardSlice';

const RevenueAreaChart = ({ revenue = [], patients = [], labels = [] }) => {
  const width = 820;
  const height = 320;
  const padding = { top: 20, right: 30, bottom: 50, left: 60 };

  const revenuePath = useMemo(
    () => buildAreaPath(revenue, width, height, padding),
    [revenue, width, height, padding]
  );
  const patientsPath = useMemo(
    () => buildAreaPath(patients, width, height, padding),
    [patients, width, height, padding]
  );

  const maxRevenue = Math.max(...revenue, 1);
  const maxPatients = Math.max(...patients, 1);
  const maxValue = Math.max(maxRevenue, maxPatients);

  // دالة تحويل القيمة إلى إحداثي Y
  const yScale = (value) => {
    const chartHeight = height - padding.top - padding.bottom;
    return padding.top + chartHeight * (1 - value / maxValue);
  };

  // إحداثيات X للنقاط والتسميات (إذا وُجدت تسميات)
  const stepX = labels.length > 1
    ? (width - padding.left - padding.right) / (labels.length - 1)
    : 0;
  const pointsX = labels.map((_, idx) => padding.left + idx * stepX);

  // إنشاء مسار للنقاط فقط إذا كانت البيانات موجودة
  const revenuePoints = revenue.map((val, idx) => ({
    x: pointsX[idx] ?? 0,
    y: yScale(val),
  }));
  const patientsPoints = patients.map((val, idx) => ({
    x: pointsX[idx] ?? 0,
    y: yScale(val),
  }));

  return (
    <div className="w-full space-y-3">
      <div className="overflow-hidden rounded-2xl border theme-border theme-surface p-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-72">
          {/* خطوط الشبكة الأفقية */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = yScale(maxValue * (1 - ratio));
            return (
              <g key={ratio}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="currentColor"
                  className="text-(--color-border)"
                  strokeDasharray="4 6"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-current text-[10px] theme-text-muted"
                >
                  {Math.round(maxValue * (1 - ratio))}
                </text>
              </g>
            );
          })}

          {/* خط الإيرادات */}
          <path
            d={revenuePath}
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* نقاط الإيرادات */}
          {revenuePoints.map((pt, idx) => (
            <circle
              key={`r-pt-${idx}`}
              cx={pt.x}
              cy={pt.y}
              r="5"
              fill="#0ea5e9"
              stroke="white"
              strokeWidth="2"
            />
          ))}

          {/* خط المرضى */}
          <path
            d={patientsPath}
            fill="none"
            stroke="#f97316"
            strokeWidth="3"
            strokeDasharray="6 4"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* نقاط المرضى */}
          {patientsPoints.map((pt, idx) => (
            <circle
              key={`p-pt-${idx}`}
              cx={pt.x}
              cy={pt.y}
              r="5"
              fill="#f97316"
              stroke="white"
              strokeWidth="2"
            />
          ))}

          {/* تسميات المحور السفلي */}
          {labels.map((label, idx) => (
            <text
              key={`lbl-${idx}`}
              x={pointsX[idx]}
              y={height - padding.bottom + 20}
              textAnchor="middle"
              className="fill-current text-[11px] theme-text-muted"
            >
              {label}
            </text>
          ))}
        </svg>
      </div>

      {/* وسيلة الإيضاح */}
      <div className="flex justify-center gap-4 text-sm">
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 bg-[#0ea5e9] inline-block" /> الإيرادات
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 bg-[#f97316] inline-block border-dashed" /> المرضى
        </span>
      </div>
    </div>
  );
};

export default RevenueAreaChart;