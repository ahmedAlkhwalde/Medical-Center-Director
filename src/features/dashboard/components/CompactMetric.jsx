const CompactMetric = ({ label, value, tone = "teal" }) => {
  const toneClass =
    tone === "orange"
      ? "from-orange-500/15 to-orange-500/5 text-orange-600 dark:text-orange-400"
      : tone === "rose"
        ? "from-rose-500/15 to-rose-500/5 text-rose-600 dark:text-rose-400"
        : "from-teal-500/15 to-teal-500/5 text-teal-600 dark:text-teal-400";

  return (
    <div
      className={`rounded-2xl border theme-border bg-linear-to-br ${toneClass} px-3 py-2`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] theme-text-muted">
        {label}
      </p>
      <p className="mt-1 text-base font-black theme-text">{value}</p>
    </div>
  );
};

export default CompactMetric;
