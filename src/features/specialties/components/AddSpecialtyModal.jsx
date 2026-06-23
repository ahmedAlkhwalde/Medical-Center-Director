import React from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../../features/specialties/store/specialtiesSlice";
import { useSpecialtyForm } from "../hooks/useSpecialtyForm";

const AddSpecialtyModal = () => {
  const { isModalOpen, editingItem } = useSelector((state) => state.specialties);
  const dispatch = useDispatch();

  return (
    <AnimatePresence>
      {isModalOpen && (
        <ModalContent
          key={editingItem ? editingItem.id : "new"}
          editingItem={editingItem}
          onClose={() => dispatch(closeModal())}
        />
      )}
    </AnimatePresence>
  );
};

/* 🌟 مكوّن محتوى المودال بعد استخراج المنطق البرمجي منه */
const ModalContent = ({ editingItem, onClose }) => {
  const {
    formData,
    errors,
    isSubmitting,
    handleSubmit,
    handleFieldChange,
  } = useSpecialtyForm(editingItem, onClose);

  return (
    <div className="fixed inset-0 z-10000 flex items-center justify-center p-3 sm:p-4">
      {/* الخلفية المعتمة */}
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={!isSubmitting ? onClose : undefined}
        className="absolute inset-0 theme-overlay backdrop-blur-sm"
      />
      
      {/* جسم المودال المنبثق */}
      <Motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="theme-surface w-full max-w-lg rounded-3xl shadow-2xl p-5 sm:p-8 relative z-10"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute left-4 top-4 rounded-full p-2 theme-text-muted theme-hover-surface disabled:opacity-50"
        >
          <Close fontSize="small" />
        </button>

        <h3 className="text-2xl font-bold theme-text mb-6">
          {editingItem ? "تعديل الاختصاص" : "إضافة اختصاص جديد"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="اسم الاختصاص"
            value={formData.name}
            error={errors.name}
            placeholder="مثال: طب الأطفال"
            disabled={isSubmitting}
            onChange={(e) => handleFieldChange("name", e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="سعر الكشفية"
              type="number"
              value={formData.price}
              error={errors.price}
              placeholder="مثال: 100"
              disabled={isSubmitting}
              onChange={(e) => handleFieldChange("price", e.target.value)}
            />
            
            <InputField
              label="سعر المراجعة"
              type="number"
              value={formData.followUpPrice}
              error={errors.followUpPrice}
              placeholder="مثال: 50"
              disabled={isSubmitting}
              onChange={(e) => handleFieldChange("followUpPrice", e.target.value)}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 theme-accent cursor-pointer theme-text-on-accent font-bold py-3 rounded-xl shadow-lg theme-shadow-accent flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="h-5 w-5 animate-spin text-current"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>جاري الحفظ...</span>
                </>
              ) : editingItem ? (
                "تحديث البيانات"
              ) : (
                "حفظ الاختصاص"
              )}
            </button>
            
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 theme-bg theme-text cursor-pointer font-bold py-3 rounded-xl disabled:opacity-50"
            >
              إلغاء
            </button>
          </div>
        </form>
      </Motion.div>
    </div>
  );
};

/* ⚙️ مكون الحقل التداخلي البسيط */
const InputField = ({ label, error, ...props }) => (
  <div className="space-y-1 text-right">
    <label className="text-xs font-bold theme-text-muted pr-1">{label}</label>
    <input
      {...props}
      className={`w-full theme-bg border ${
        error ? "border-red-500" : "theme-border"
      } rounded-xl py-3 px-4 text-sm focus:ring-2 ring-(--color-accent) outline-none transition-all`}
    />
    {error && <p className="text-[10px] text-red-500 pr-1">{error}</p>}
  </div>
);

export default AddSpecialtyModal;