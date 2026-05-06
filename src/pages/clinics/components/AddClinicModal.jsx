import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Close } from "@mui/icons-material";
import { closeModal, saveClinic } from "../../../features/clinics/clinicsSlice";

const createInitialFormData = (editingItem) => ({
  clinicName: editingItem?.clinicName || "",
  address: editingItem?.address || "",
});

const AddClinicModal = () => {
  const { isModalOpen, editingItem } = useSelector((state) => state.clinics);
  const dispatch = useDispatch();

  return (
    <AnimatePresence>
      {isModalOpen && (
        <ModalContent
          key={editingItem ? editingItem.id : "new"}
          editingItem={editingItem}
          onClose={() => dispatch(closeModal())}
          onSave={(formData) => dispatch(saveClinic(formData))}
        />
      )}
    </AnimatePresence>
  );
};

const ModalContent = ({ editingItem, onClose, onSave }) => {
  const [formData, setFormData] = useState(() =>
    createInitialFormData(editingItem),
  );
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.clinicName.trim()) {
      newErrors.clinicName = "اسم العيادة مطلوب";
    }

    if (!formData.address.trim()) {
      newErrors.address = "العنوان مطلوب";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 theme-overlay backdrop-blur-sm"
      />

      <Motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="theme-surface relative z-10 w-full max-w-xl rounded-3xl p-5 shadow-2xl sm:p-8"
      >
        <div className="mb-6 flex items-start justify-between gap-3">
          <div className="text-right">
            <h3 className="text-2xl font-bold theme-text">
              {editingItem ? "تعديل بيانات العيادة" : "إضافة عيادة جديدة"}
            </h3>
            <p className="mt-1 text-sm theme-text-muted">
              أدخل اسم العيادة والعنوان لعرضها داخل قسم العيادات.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 theme-hover-surface theme-text-muted transition-colors"
            aria-label="إغلاق النافذة"
          >
            <Close fontSize="small" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="اسم العيادة"
            value={formData.clinicName}
            error={errors.clinicName}
            placeholder="مثال: عيادة الشفاء - المزة"
            onChange={(event) =>
              setFormData({ ...formData, clinicName: event.target.value })
            }
          />

          <TextareaField
            label="العنوان"
            value={formData.address}
            error={errors.address}
            placeholder="مثال: دمشق - المزة - شارع الفيلات"
            onChange={(event) =>
              setFormData({ ...formData, address: event.target.value })
            }
          />

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
              type="submit"
              className="flex-1 cursor-pointer rounded-xl theme-accent px-5 py-3 font-bold theme-text-on-accent shadow-lg theme-shadow-accent"
            >
              {editingItem ? "تحديث البيانات" : "حفظ العيادة"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 cursor-pointer rounded-xl theme-bg px-5 py-3 font-bold theme-text"
            >
              إلغاء
            </button>
          </div>
        </form>
      </Motion.div>
    </div>
  );
};

const InputField = ({ label, error, className = "", ...props }) => (
  <div className="space-y-1 text-right">
    <label className="pr-1 text-xs font-bold theme-text-muted">{label}</label>
    <input
      {...props}
      className={`w-full rounded-xl border theme-bg px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-(--color-accent) ${error ? "border-red-500" : "theme-border"} ${className}`}
    />
    {error && <p className="pr-1 text-[10px] text-red-500">{error}</p>}
  </div>
);

const TextareaField = ({ label, error, className = "", ...props }) => (
  <div className="space-y-1 text-right">
    <label className="pr-1 text-xs font-bold theme-text-muted">{label}</label>
    <textarea
      {...props}
      rows={4}
      className={`w-full resize-none rounded-xl border theme-bg px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-(--color-accent) ${error ? "border-red-500" : "theme-border"} ${className}`}
    />
    {error && <p className="pr-1 text-[10px] text-red-500">{error}</p>}
  </div>
);

export default AddClinicModal;
