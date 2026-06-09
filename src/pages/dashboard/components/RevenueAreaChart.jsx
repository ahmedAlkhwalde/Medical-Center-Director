// import {
//   buildAreaPath,
//   formatNumber,
// } from "../../../features/dashboard/dashboardSlice";

// const RevenueAreaChart = ({ revenue, expenses }) => {
//   const width = 820;
//   const height = 280;
//   const padding = 26;
//   const revenuePath = buildAreaPath(revenue, width, height, padding);
//   const expensePath = buildAreaPath(expenses, width, height, padding);
//   const maxValue = Math.max(...revenue, ...expenses);
//   const stepX = (width - padding * 2) / Math.max(revenue.length - 1, 1);

//   return (
//     <div className="space-y-3">
//       <div className="flex flex-wrap items-center gap-2 text-xs font-semibold theme-text-muted">
//         <span className="inline-flex items-center gap-2 rounded-full bg-teal-500/10 px-3 py-1 text-teal-600 dark:text-teal-400">
//           <span className="h-2.5 w-2.5 rounded-full bg-teal-500" />
//           الدخل
//         </span>
//         <span className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-3 py-1 text-orange-600 dark:text-orange-400">
//           <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
//           المصاريف
//         </span>
//       </div>

//       <div className="overflow-hidden rounded-2xl border theme-border theme-surface p-2">
//         <svg viewBox={`0 0 ${width} ${height}`} className="h-64 w-full">
//           <defs>
//             <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="0%" stopColor="#0AB3BA" stopOpacity="0.38" />
//               <stop offset="100%" stopColor="#0AB3BA" stopOpacity="0.04" />
//             </linearGradient>
//             <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="0%" stopColor="#F28A4C" stopOpacity="0.28" />
//               <stop offset="100%" stopColor="#F28A4C" stopOpacity="0.04" />
//             </linearGradient>
//           </defs>

//           {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
//             const y = padding + ratio * (height - padding * 2);
//             const label = Math.round(maxValue * (1 - ratio));
//             return (
//               <g key={ratio}>
//                 <line
//                   x1={padding}
//                   y1={y}
//                   x2={width - padding}
//                   y2={y}
//                   stroke="currentColor"
//                   className="text-(--color-border)"
//                   strokeDasharray="4 6"
//                 />
//                 <text
//                   x={8}
//                   y={y + 4}
//                   className="fill-current text-[10px] theme-text-muted"
//                 >
//                   {formatNumber(label)}
//                 </text>
//               </g>
//             );
//           })}

//           <path
//             d={`${revenuePath} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`}
//             fill="url(#revenueFill)"
//           />
//           <path
//             d={`${expensePath} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`}
//             fill="url(#expenseFill)"
//           />
//           <path
//             d={revenuePath}
//             fill="none"
//             stroke="#0AB3BA"
//             strokeWidth="4"
//             strokeLinejoin="round"
//             strokeLinecap="round"
//           />
//           <path
//             d={expensePath}
//             fill="none"
//             stroke="#F28A4C"
//             strokeWidth="3.5"
//             strokeLinejoin="round"
//             strokeLinecap="round"
//           />

//           {revenue.map((value, index) => {
//             const x = padding + index * stepX;
//             const y =
//               height - padding - (value / maxValue) * (height - padding * 2);
//             return (
//               <circle key={`r-${index}`} cx={x} cy={y} r="4.5" fill="#0AB3BA" />
//             );
//           })}
//         </svg>
//       </div>
//     </div>
//   );
// };

// export default RevenueAreaChart;
import { useMemo } from 'react';
import { buildAreaPath } from '../../../features/dashboard/dashboardSlice';

const RevenueAreaChart = ({ revenue = [], patients = [] }) => {
  const width = 500;
  const height = 200;
  const padding = 10;

  const revenuePath = useMemo(
    () => buildAreaPath(revenue, width, height, padding),
    [revenue]
  );
  const patientsPath = useMemo(
    () => buildAreaPath(patients, width, height, padding),
    [patients]
  );

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {/* خط الإيرادات */}
        <path d={revenuePath} fill="none" stroke="#0ea5e9" strokeWidth="2" />
        {/* خط المرضى */}
        <path d={patientsPath} fill="none" stroke="#f97316" strokeWidth="2" strokeDasharray="4" />
      </svg>
      <div className="flex justify-center gap-4 mt-2 text-sm">
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