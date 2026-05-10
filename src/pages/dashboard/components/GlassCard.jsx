const GlassCard = ({ title, subtitle, children, className = "" }) => (
  <div
    className={`overflow-hidden rounded-3xl border theme-border theme-surface-90 shadow-xl ${className}`}
  >
    <div className="border-b theme-border px-4 py-3 md:px-5">
      <h3 className="text-base font-bold theme-text md:text-lg">{title}</h3>
      {subtitle ? (
        <p className="mt-1 text-sm theme-text-muted">{subtitle}</p>
      ) : null}
    </div>
    <div className="p-4 md:p-5">{children}</div>
  </div>
);

export default GlassCard;
