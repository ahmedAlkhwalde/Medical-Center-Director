import { createElement } from "react";
import { motion as Motion } from "framer-motion";
import {
  EditOutlined,
  PhoneOutlined,
  MailOutlined,
  EventOutlined,
  PersonOutline,
  ToggleOffOutlined,
  ToggleOnOutlined,
  BusinessOutlined,
} from "@mui/icons-material";

const DoctorCard = ({
  doctor,
  specialtyName,
  clinicNumber,
  onEdit,
  onViewDetails,
  //   onToggleStatus,
}) => {
  const rawProfitRate = Number(doctor.profitRate);
  const profitRate = Number.isFinite(rawProfitRate)
    ? Math.min(100, Math.max(0, rawProfitRate))
    : 0;

  return (
    <Motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      whileHover={{ y: -5 }}
      onClick={() => onViewDetails?.(doctor.id)}
      className="group relative cursor-pointer rounded-2xl border theme-border theme-surface p-4 shadow-md shadow-black/5 transition-all duration-700 ease-out hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/15 hover:theme-shadow-accent sm:p-5 md:p-6"
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl theme-accent-soft theme-text-accent">
            <PersonOutline fontSize="small" />
          </div>
          <div className="min-w-0 text-right">
            <h3 className="truncate text-lg font-bold theme-text-accent sm:text-xl">
              {doctor.name}
            </h3>
            <p className="text-xs theme-text-muted">{doctor.phone}</p>
          </div>
        </div>

        <div className="flex gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails?.(doctor.id);
            }}
            className="cursor-pointer rounded-lg p-2 theme-text-muted theme-hover-accent"
            aria-label="عرض التفاصيل"
            title="عرض الملف الشخصي"
          >
            <PersonOutline fontSize="small" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(e);
            }}
            className="cursor-pointer rounded-lg p-2 theme-text-accent theme-hover-accent"
            aria-label="تعديل الطبيب"
          >
            <EditOutlined fontSize="small" />
          </button>
          {/* <button
            type="button"
            onClick={onToggleStatus}
            className={`cursor-pointer rounded-lg p-2 transition-colors ${doctor.isActive ? "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30" : "bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"}`}
            aria-label={doctor.isActive ? "تعطيل الحساب" : "تفعيل الحساب"}
            title={doctor.isActive ? "تعطيل الحساب" : "تفعيل الحساب"}
          >
            {doctor.isActive ? (
              <ToggleOffOutlined fontSize="small" />
            ) : (
              <ToggleOnOutlined fontSize="small" />
            )}
          </button> */}
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <span className="rounded-full theme-accent-soft px-3 py-1 text-xs font-bold theme-text-accent">
          {specialtyName}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${doctor.isActive ? "theme-bg theme-text-muted" : "theme-danger-soft theme-text-danger"}`}
        >
          {doctor.isActive ? "الحساب مفعّل" : "الحساب معطّل"}
        </span>
      </div>

      <div className="space-y-3 text-sm">
        {/* <InfoRow icon={PhoneOutlined} label="رقم الهاتف" value={doctor.phone} /> */}
        <InfoRow
          icon={MailOutlined}
          label="البريد الإلكتروني"
          value={doctor.email}
          title={doctor.email}
          valueClassName="text-left"
        />
        <InfoRow
          icon={BusinessOutlined}
          label="رقم العيادة"
          value={clinicNumber || "غير محدد"}
        />
        <InfoRow
          icon={EventOutlined}
          label="تاريخ انتهاء العقد"
          value={doctor.contractEndDate || "غير محدد"}
          title={doctor.contractEndDate}
        />
      </div>

      <div className=" space-y-2 mt-3 rounded-xl theme-bg p-2">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="font-bold theme-text-muted">نسبة الربح</span>
          <span className="font-bold text-green-600 dark:text-green-400">
            {profitRate}%
          </span>
        </div>

        <div
          className="h-2 overflow-hidden rounded-full bg-green-100 dark:bg-green-900/30"
          role="progressbar"
          aria-valuenow={profitRate}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`نسبة الربح ${profitRate}%`}
        >
          <div
            className="h-full rounded-full bg-green-500 transition-all duration-500"
            style={{ width: `${profitRate}%` }}
          />
        </div>
      </div>
    </Motion.div>
  );
};

const InfoRow = ({ icon, label, value, title, valueClassName = "" }) => (
  <div className="flex min-w-0 items-center justify-between gap-3 rounded-xl theme-bg px-3 py-2.5">
    <div className="flex min-w-0 items-center gap-2 theme-text-muted">
      {createElement(icon, { fontSize: "small" })}
      <span className="truncate">{label}</span>
    </div>
    <span
      className={`min-w-0 flex-1 truncate font-medium theme-text ${valueClassName || "text-right"}`}
      title={title || value}
      dir={valueClassName ? "ltr" : undefined}
    >
      {value}
    </span>
  </div>
);

export default DoctorCard;
