import { motion as Motion } from "framer-motion";
import {
  Payments,
  Groups,
  LocalHospital,
  WarningAmber,
  TrendingUp,
  TrendingDown,
} from "@mui/icons-material";

const iconMap = {
  Payments,
  Groups,
  LocalHospital,
  WarningAmber,
};

const StatCard = ({ item }) => {
  const Icon = iconMap[item.icon] || Payments;

  return (
    <Motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.18 }}
      className="overflow-hidden rounded-2xl border theme-border theme-surface-90 p-3 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 text-right">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] theme-text-muted">
            {item.title}
          </p>
          <p className="text-[1.05rem] font-black leading-none theme-text md:text-xl">
            {item.value}
          </p>
          <p className="text-[11px] leading-5 theme-text-muted">{item.note}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl theme-accent text-white shadow-lg shadow-teal-500/15">
            <Icon fontSize="small" />
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
              item.trendUp
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
            }`}
          >
            {item.trendUp ? (
              <TrendingUp fontSize="inherit" />
            ) : (
              <TrendingDown fontSize="inherit" />
            )}
            {item.trend}
          </span>
        </div>
      </div>
    </Motion.div>
  );
};

export default StatCard;
