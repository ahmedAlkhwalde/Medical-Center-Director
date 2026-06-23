import { motion as Motion } from "framer-motion";
import {
  EditOutlined,
  DeleteOutline,
  LocalHospitalOutlined,
  LocationOnOutlined,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import {
  confirmDelete,
  openModal,
} from "../../../features/clinics/store/clinicsSlice";

const ClinicCard = ({ data }) => {
  const dispatch = useDispatch();

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
      <div className="absolute inset-x-0 top-0 h-1" />

      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl theme-accent-soft theme-text-accent shadow-sm">
            <LocalHospitalOutlined fontSize="small" />
          </div>

          <div className="min-w-0 text-right">
            <span className="mb-1 inline-flex rounded-full theme-accent-soft px-3 py-1 text-[11px] font-bold theme-text-accent">
              عيادة
            </span>
            <h3 className="truncate text-lg font-bold theme-text-accent sm:text-xl">
              {data.clinicName}
            </h3>
          </div>
        </div>

        <div className="flex gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
          <button
            type="button"
            onClick={() => dispatch(openModal(data))}
            disabled={data.isOptimistic}
            className="cursor-pointer rounded-lg p-2 theme-text-accent theme-hover-accent"
            aria-label="تعديل العيادة"
            title="تعديل العيادة"
          >
            <EditOutlined fontSize="small" />
          </button>
          <button
            type="button"
            onClick={() =>
              dispatch(
                confirmDelete({
                  id: data.uuid ?? data.id ?? data.legacyId,
                  isOptimistic: data.isOptimistic,
                  clinicName: data.clinicName,
                }),
              )
            }
            disabled={data.isOptimistic}
            className="cursor-pointer rounded-lg p-2 theme-text-danger theme-hover-danger"
            aria-label="حذف العيادة"
            title="حذف العيادة"
          >
            <DeleteOutline fontSize="small" />
          </button>
        </div>
      </div>

      <div className="rounded-2xl theme-bg p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl theme-accent-soft theme-text-accent">
            <LocationOnOutlined fontSize="small" />
          </div>
          <div className="min-w-0 text-right">
            <p className="mb-1 text-xs font-bold uppercase tracking-wide theme-text-muted">
              عنوان العيادة
            </p>
            <p className="text-sm leading-6 theme-text">{data.address}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <InfoPill label="عدد الأطباء" value={data.doctorsCount} />
        <InfoPill label="عدد المواعيد" value={data.appointmentsCount} />
      </div>
    </Motion.div>
  );
};

const formatNumber = (value = 0) =>
  new Intl.NumberFormat("ar-SY", { maximumFractionDigits: 0 }).format(
    Number(value) || 0,
  );

const InfoPill = ({ label, value }) => (
  <div className="rounded-xl theme-bg px-3 py-2 text-right">
    <p className="text-[11px] font-bold theme-text-muted">{label}</p>
    <p className="text-sm font-bold theme-text">{formatNumber(value)}</p>
  </div>
);

export default ClinicCard;
