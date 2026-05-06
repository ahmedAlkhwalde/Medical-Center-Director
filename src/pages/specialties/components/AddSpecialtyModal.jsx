import { motion as Motion, AnimatePresence } from "framer-motion";
import { Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  closeModal,
  saveSpecialty,
} from "../../../features/specialties/specialtiesSlice";
import { useState } from "react";

const createInitialFormData = (editingItem) => ({
  name: editingItem?.name || "",
  price: editingItem?.price || "",
  followUpPrice: editingItem?.followUpPrice || "",
});

const AddSpecialtyModal = () => {
  const { isModalOpen, editingItem } = useSelector(
    (state) => state.specialties,
  );
  const dispatch = useDispatch();

  return (
    <AnimatePresence>
      {isModalOpen && (
        <ModalContent
          key={editingItem ? editingItem.id : "new"}
          editingItem={editingItem}
          onClose={() => dispatch(closeModal())}
          onSave={(formData) => dispatch(saveSpecialty(formData))}
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

    if (!formData.name.trim()) newErrors.name = "اسم الاختصاص مطلوب";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "السعر يجب أن يكون أكبر من 0";
    if (formData.followUpPrice === "" || formData.followUpPrice < 0) {
      newErrors.followUpPrice = "سعر المراجعة غير صحيح";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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
        className="theme-surface w-full max-w-lg rounded-3xl shadow-2xl p-5 sm:p-8 relative z-10"
      >
        <h3 className="text-2xl font-bold theme-text mb-6">
          {editingItem ? "تعديل الاختصاص" : "إضافة اختصاص جديد"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="اسم الاختصاص"
            value={formData.name}
            error={errors.name}
            placeholder="مثال: طب الأطفال"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="سعر الكشفية"
              type="number"
              value={formData.price}
              error={errors.price}
              placeholder="مثال: 100"
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
            />
            <InputField
              label="سعر المراجعة"
              type="number"
              value={formData.followUpPrice}
              error={errors.followUpPrice}
              placeholder="مثال: 50"
              onChange={(e) =>
                setFormData({ ...formData, followUpPrice: e.target.value })
              }
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="submit"
              className="flex-1 theme-accent cursor-pointer theme-text-on-accent font-bold py-3 rounded-xl shadow-lg theme-shadow-accent"
            >
              {editingItem ? "تحديث البيانات" : "حفظ الاختصاص"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 theme-bg theme-text cursor-pointer font-bold py-3 rounded-xl"
            >
              إلغاء
            </button>
          </div>
        </form>
      </Motion.div>
    </div>
  );
};

// مكون الإدخال المطور مع عرض الأخطاء
const InputField = ({ label, error, ...props }) => (
  <div className="space-y-1 text-right">
    <label className="text-xs font-bold theme-text-muted pr-1">{label}</label>
    <input
      {...props}
      className={`w-full theme-bg border ${error ? "border-red-500" : "theme-border"} rounded-xl py-3 px-4 text-sm focus:ring-2 ring-[var(--color-accent)] outline-none transition-all`}
    />
    {error && <p className="text-[10px] text-red-500 pr-1">{error}</p>}
  </div>
);

export default AddSpecialtyModal;
