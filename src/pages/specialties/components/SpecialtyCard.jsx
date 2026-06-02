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
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      whileHover={{ y: -5 }}
      className="group relative rounded-2xl border theme-border theme-surface p-4 shadow-md shadow-black/5 transition-all duration-700 ease-out hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/15 hover:theme-shadow-accent sm:p-5 md:p-6"
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
            onClick={() =>
              dispatch(confirmDelete(data.uuid))
            }
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
        <PriceItem label="إجمالي المبلغ" price={data.amount} isMuted />
        <CountItem label="عدد المواعيد" count={data.appointmentsCount} />
      </div>
    </Motion.div>
  );
};

const formatCurrency = (value = 0) =>
  `${new Intl.NumberFormat("ar-SY", { maximumFractionDigits: 0 }).format(
    Number(value) || 0,
  )} ل.س`;

const formatNumber = (value = 0) =>
  new Intl.NumberFormat("ar-SY", { maximumFractionDigits: 0 }).format(
    Number(value) || 0,
  );

const PriceItem = ({ label, price, isMuted }) => (
  <div
    className={`flex justify-between p-3 rounded-xl ${isMuted ? "theme-bg" : "theme-accent-soft"}`}
  >
    <span className="text-sm theme-text-muted">{label}</span>
    <span
      className={`font-bold ${isMuted ? "theme-text" : "theme-text-accent"}`}
    >
      {formatCurrency(price)}
    </span>
  </div>
);

const CountItem = ({ label, count }) => (
  <div className="flex justify-between rounded-xl p-3 theme-bg">
    <span className="text-sm theme-text-muted">{label}</span>
    <span className="font-bold theme-text">{formatNumber(count)}</span>
  </div>
);

export default SpecialtyCard;
