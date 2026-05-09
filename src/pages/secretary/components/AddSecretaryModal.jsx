import { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  closeModal,
  saveSecretary,
} from "../../../features/secretaries/secretariesSlice";

const createInitialFormData = (editingItem) => ({
  name: editingItem?.name || "",
  phone: editingItem?.phone || "",
  email: editingItem?.email || "",
  salary: editingItem?.salary ?? "",
});

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AddSecretaryModal = () => {
  const { isModalOpen, editingItem } = useSelector(
    (state) => state.secretaries,
  );
  const dispatch = useDispatch();

  return (
    <AnimatePresence>
      {isModalOpen && (
        <ModalContent
          key={editingItem ? editingItem.id : "new"}
          editingItem={editingItem}
          onClose={() => dispatch(closeModal())}
          onSave={(formData) => dispatch(saveSecretary(formData))}
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
    const nextErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = "اسم السكرتير مطلوب";
    }

    if (!formData.phone.trim()) {
      nextErrors.phone = "الرقم مطلوب";
    }

    if (!emailPattern.test(formData.email.trim())) {
      nextErrors.email = "البريد الإلكتروني غير صالح";
    }

    if (!formData.salary || Number(formData.salary) <= 0) {
      nextErrors.salary = "الراتب يجب أن يكون أكبر من 0";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-4">
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
        className="relative z-10 w-full max-w-xl rounded-3xl p-5 shadow-2xl theme-surface sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute left-4 top-4 rounded-full p-2 theme-text-muted theme-hover-surface"
        >
          <Close fontSize="small" />
        </button>

        <h3 className="mb-6 text-2xl font-bold theme-text">
          {editingItem ? "تعديل بيانات السكرتير" : "إضافة سكرتير جديد"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="اسم السكرتير"
            value={formData.name}
            error={errors.name}
            placeholder="مثال: سارة محمود"
            onChange={(event) =>
              setFormData({ ...formData, name: event.target.value })
            }
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField
              label="رقم الهاتف"
              type="tel"
              value={formData.phone}
              error={errors.phone}
              placeholder="مثال: 0933-111-222"
              onChange={(event) =>
                setFormData({ ...formData, phone: event.target.value })
              }
            />
            <InputField
              label="البريد الإلكتروني"
              type="email"
              value={formData.email}
              error={errors.email}
              placeholder="مثال: name@example.com"
              onChange={(event) =>
                setFormData({ ...formData, email: event.target.value })
              }
            />
          </div>

          <InputField
            label="الراتب الشهري"
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            value={formData.salary}
            error={errors.salary}
            placeholder="مثال: 8500000"
            onChange={(event) =>
              setFormData({ ...formData, salary: event.target.value })
            }
          />

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 cursor-pointer rounded-xl py-3 font-bold shadow-lg theme-accent theme-shadow-accent theme-text-on-accent"
            >
              {editingItem ? "تحديث البيانات" : "حفظ السكرتير"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 cursor-pointer rounded-xl py-3 font-bold theme-bg theme-text"
            >
              إلغاء
            </button>
          </div>
        </form>
      </Motion.div>
    </div>
  );
};

const InputField = ({ label, error, ...props }) => (
  <div className="space-y-1 text-right">
    <label className="pr-1 text-xs font-bold theme-text-muted">{label}</label>
    <input
      {...props}
      className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all theme-bg focus:ring-2 focus:ring-(--color-accent) ${
        error ? "border-red-500" : "theme-border"
      }`}
    />
    {error && <p className="pr-1 text-[10px] text-red-500">{error}</p>}
  </div>
);

export default AddSecretaryModal;
