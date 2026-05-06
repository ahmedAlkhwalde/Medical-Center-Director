import { motion as Motion } from "framer-motion";
import { EditOutlined, DeleteOutline } from "@mui/icons-material";
import * as MuiIcons from "@mui/icons-material";
import { useDispatch } from "react-redux";
import {
  openModal,
  confirmDelete,
} from "../../../features/specialties/specialtiesSlice";

const SpecialtyCard = ({ data }) => {
  const dispatch = useDispatch();
  const IconComponent = MuiIcons[data.icon] || MuiIcons.MedicalServices;

  return (
    <Motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }} // تأثير الظهور المتتابع
      whileHover={{ y: -5 }} // رفع البطاقة قليلاً عند الحوم
      className="theme-surface theme-border border rounded-2xl p-4 sm:p-5 md:p-6 relative group transition-all duration-300 hover:shadow-xl hover:theme-shadow-accent"
    >
      <div className="flex items-start justify-between gap-3 mb-5 sm:mb-6">
        <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl theme-accent-soft theme-text-accent">
          <IconComponent fontSize="large" />
        </div>
        <div className="flex gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
          <button
            onClick={() => dispatch(openModal(data))}
            className="rounded-lg p-2 theme-text-accent theme-hover-accent"
          >
            <EditOutlined className="cursor-pointer" fontSize="small" />
          </button>
          <button
            onClick={() => dispatch(confirmDelete(data.id))}
            className="rounded-lg p-2 theme-text-danger theme-hover-danger"
          >
            <DeleteOutline className="cursor-pointer" fontSize="small" />
          </button>
        </div>
      </div>

      <h3 className="mb-4 text-lg font-bold theme-text-accent sm:text-xl">
        {data.name}
      </h3>

      <div className="space-y-3">
        <PriceItem label="سعر الكشفية" price={data.price} />
        <PriceItem label="سعر المراجعة" price={data.followUpPrice} isMuted />
      </div>
    </Motion.div>
  );
};

const PriceItem = ({ label, price, isMuted }) => (
  <div
    className={`flex justify-between p-3 rounded-xl ${isMuted ? "theme-bg" : "theme-accent-soft"}`}
  >
    <span className="text-sm theme-text-muted">{label}</span>
    <span
      className={`font-bold ${isMuted ? "theme-text" : "theme-text-accent"}`}
    >
      {price} ل.س
    </span>
  </div>
);

export default SpecialtyCard;
