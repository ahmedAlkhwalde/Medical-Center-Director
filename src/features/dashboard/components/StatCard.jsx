import React from "react";
import { motion as Motion } from "framer-motion";
import {
  Payments,
  Groups,
  LocalHospital,
  WarningAmber,
  TrendingUp,
  TrendingDown,
  // استيراد الأيقونات الطبية والمالية الجديدة لضمان الدعم الكامل
  MedicalServices,
  SupportAgent,
  PeopleAlt,
  AccountBalanceWallet,
  Paid,
  EventBusy
} from "@mui/icons-material";

// قاموس موسّع كخطة بديلة (Fallback) في حال تم تمرير الأيقونة كاسم نصي (String)
const iconMap = {
  Payments,
  Groups,
  LocalHospital,
  WarningAmber,
  MedicalServices,
  SupportAgent,
  PeopleAlt,
  AccountBalanceWallet,
  Paid,
  EventBusy
};

const StatCard = ({ item }) => {
  
  // دالة تشغيلية ذكية لـ رندرة الأيقونة بمرونة تامة مهما كان نوعها
  const renderIcon = () => {
    if (!item.icon) return <Payments fontSize="small" />;

    // 1. إذا كانت الأيقونة ممررة كـ JSX Element جاهز مثل: <MedicalServices className="..." />
    if (React.isValidElement(item.icon)) {
      return item.icon;
    }

    // 2. إذا كانت ممررة كـ Component Reference (مثل: MedicalServices) أو كنص (String)
    const ChosenIcon = typeof item.icon === "string" ? iconMap[item.icon] : item.icon;
    const IconComponent = ChosenIcon || Payments;

    return <IconComponent fontSize="small" />;
  };

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
          {/* هنا يتم استدعاء الدالة الذكية لطباعة الأيقونة الصحيحة فوراً */}
          <span className="flex h-9 w-9 items-center justify-center rounded-xl theme-accent text-white shadow-lg shadow-teal-500/15">
            {renderIcon()}
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