import { formatScheduleValue } from "../scheduleFormatters";

const ShiftCell = ({ shift }) => {
  if (!shift) {
    return (
      <div className="flex min-h-24 items-center justify-center rounded-2xl border border-dashed theme-border theme-surface-90 px-3 py-4 text-xs font-semibold theme-text-muted">
        راحة
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-blue-500/15 theme-accent-soft px-3 py-3 shadow-sm dark:border-blue-400/20">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="rounded-full theme-surface px-2.5 py-1 text-[11px] font-semibold theme-text-accent">
          {shift.label}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wide theme-text-accent">
          دوام
        </span>
      </div>

      <div className="space-y-1 text-xs font-medium theme-text">
        <p className="rounded-xl theme-surface px-2.5 py-1.5">
          من {formatScheduleValue(shift.start)}
        </p>
        <p className="rounded-xl theme-surface px-2.5 py-1.5">
          إلى {formatScheduleValue(shift.end)}
        </p>
      </div>
    </div>
  );
};

export default ShiftCell;
