import { formatNumber } from "../../../features/dashboard/dashboardSlice";

const MiniBarList = ({ items }) => (
  <div className="space-y-3">
    {items.map((item) => (
      <div
        key={item.name}
        className="space-y-2 rounded-2xl border theme-border theme-surface px-3 py-2.5"
      >
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="font-semibold theme-text">{item.name}</span>
          <span className="theme-text-muted">
            {formatNumber(item.patients)} مريض / {item.minutes} د
          </span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-700/70">
          <div
            className="h-full rounded-full bg-linear-to-r from-teal-500 to-cyan-400"
            style={{ width: `${Math.min(100, (item.patients / 30) * 100)}%` }}
          />
        </div>
      </div>
    ))}
  </div>
);

export default MiniBarList;
