import { motion as Motion } from "framer-motion";
import {
  EditOutlined,
  MailOutline,
  PaymentsOutlined,
  PersonOutline,
  PhoneOutlined,
  ToggleOffOutlined, // أيقونة التعطيل
  ToggleOnOutlined,  // 💡 إضافة أيقونة التفعيل
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import {
  openModal,
  confirmDelete,
} from "../../../features/secretaries/secretariesSlice";
import { formatSalary } from "../secretaryFormatters";

const SecretaryCard = ({ data, index }) => {
  const dispatch = useDispatch();

  return (
    <Motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 22,
        delay: index * 0.05,
      }}
      whileHover={{ y: -5 }}
      className="group relative rounded-2xl border theme-border theme-surface p-4 shadow-md shadow-black/5 transition-all duration-700 ease-out hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/15 hover:theme-shadow-accent sm:p-5 md:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl theme-accent-soft theme-text-accent">
          <PersonOutline fontSize="large" />
        </div>

        <div className="flex gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
          <button
            type="button"
            onClick={() => dispatch(openModal(data))}
            disabled={data.isOptimistic}
            className="rounded-lg p-2 theme-text-accent theme-hover-accent"
          >
            <EditOutlined className="cursor-pointer" fontSize="small" />
          </button>
          
          {/* 💡 تعديل الزر ليصبح تفاعلياً في الحالتين (تفعيل / تعطيل) */}
          <button
            type="button"
            onClick={() =>
              dispatch(
                confirmDelete({
                  id: data.id,
                  uuid: data.uuid, // تمرير الـ uuid أيضاً للاحتياط
                  name: data.name,
                  email: data.email,
                  number: data.phone,
                  salary: data.salary,
                  isActive: data.isActive,
                  isOptimistic: data.isOptimistic,
                }),
              )
            }
            // 💡 تم حذف || !data.isActive ليبقى الزر شغالاً عندما يكون معطلاً
            disabled={data.isOptimistic} 
            className={`rounded-lg p-2 transition-colors ${
              data.isActive
                ? "theme-text-danger theme-hover-danger"      // لون أحمر/برتقالي عند الرغبة في التعطيل
                : "text-emerald-500 hover:bg-emerald-500/10"   // لون أخضر أنيق عند الرغبة في التفعيل
            }`}
            aria-label={data.isActive ? "إلغاء تفعيل الحساب" : "تفعيل الحساب"}
            title={data.isActive ? "إلغاء تفعيل الحساب" : "تفعيل الحساب"}
          >
            {/* 💡 تغيير الأيقونة بشكل ديناميكي حسب حالة الحساب الحالية */}
            {data.isActive ? (
              <ToggleOffOutlined className="cursor-pointer" fontSize="small" />
            ) : (
              <ToggleOnOutlined className="cursor-pointer" fontSize="small" />
            )}
          </button>
        </div>
      </div>

      <h3 className="mt-5 text-lg font-bold theme-text-accent sm:text-xl">
        {data.name}
      </h3>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full theme-accent-soft px-3 py-1 text-xs font-bold theme-text-accent">
          سكرتير
        </span>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            data.isActive 
              ? "theme-bg theme-text-muted" 
              : "bg-red-500/10 text-red-500 border border-red-500/20"
          }`}
        >
          {data.isActive ? "مفعّل" : "معطّل"}
        </span>
      </div>
      
      <div className="mt-4 space-y-3">
        <InfoRow
          icon={<PhoneOutlined fontSize="small" />}
          label="الرقم"
          value={data.phone}
        />
        <InfoRow
          icon={<MailOutline fontSize="small" />}
          label="البريد"
          value={data.email}
        />
      </div>

      <div className="mt-4 rounded-xl theme-accent-soft p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 theme-text-accent">
            <PaymentsOutlined fontSize="small" />
            <span className="text-sm font-bold">الراتب الشهري</span>
          </div>
          <span className="text-base font-bold theme-text-accent">
            {formatSalary(data.salary)}
          </span>
        </div>
      </div>
    </Motion.div>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center justify-between gap-3 rounded-xl theme-bg p-3">
    <div className="flex items-center gap-2 theme-text-muted">
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
    <span className="break-all text-left text-sm font-semibold theme-text">
      {value}
    </span>
  </div>
);

export default SecretaryCard;