import { TrendingUp, TrendingDown } from "@mui/icons-material";

const TrendPill = ({ value, up }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
      up
        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
    }`}
  >
    {up ? (
      <TrendingUp fontSize="inherit" />
    ) : (
      <TrendingDown fontSize="inherit" />
    )}
    {value}
  </span>
);

export default TrendPill;
