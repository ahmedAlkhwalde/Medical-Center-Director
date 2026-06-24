import { motion as Motion, AnimatePresence } from "framer-motion";
import { Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../store/secretariesSlice";
import { useSecretaryForm } from "../hooks/useSecretaryForm"; // تأكد من صحة مسار الهوك لديك

const AddSecretaryModal = () => {
  const { isModalOpen, editingItem } = useSelector((state) => state.secretaries);
  const dispatch = useDispatch();

  return (
    <AnimatePresence>
      {isModalOpen && (
        <ModalContent
          key={editingItem ? editingItem.uuid : "new"}
          editingItem={editingItem}
          onClose={() => dispatch(closeModal())}
        />
      )}
    </AnimatePresence>
  );
};

const ModalContent = ({ editingItem, onClose }) => {
  const {
    formData,
    errors,
    isSubmitting,
    handleSubmit,
    handleFieldChange,
  } = useSecretaryForm(editingItem, onClose);

  return (
    <div className="fixed inset-0 z-10000 flex items-center justify-center p-3 sm:p-4">
      {/* الخلفية المعتمة */}
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => !isSubmitting && onClose()}
        className="absolute inset-0 theme-overlay backdrop-blur-sm"
      />
      
      {/* نافذة المودال */}
      <Motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 w-full max-w-xl rounded-3xl p-5 shadow-2xl theme-surface sm:p-8"
      >
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onClose}
          className="absolute left-4 top-4 rounded-full p-2 theme-text-muted theme-hover-surface disabled:opacity-50"
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
            disabled={isSubmitting}
            onChange={(e) => handleFieldChange("name", e.target.value)}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField
              label="رقم الهاتف"
              type="tel"
              value={formData.phone}
              error={errors.phone}
              placeholder="مثال: 0933-111-222"
              disabled={isSubmitting}
              onChange={(e) => handleFieldChange("phone", e.target.value)}
            />
            <InputField
              label="البريد الإلكتروني"
              type="email"
              value={formData.email}
              error={errors.email}
              placeholder="مثال: name@example.com"
              disabled={isSubmitting}
              onChange={(e) => handleFieldChange("email", e.target.value)}
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
            disabled={isSubmitting}
            onChange={(e) => handleFieldChange("salary", e.target.value)}
          />

          {/* أزرار التحكم والإرسال */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex flex-1 items-center justify-center gap-2 cursor-pointer rounded-xl py-3 font-bold shadow-lg theme-accent theme-shadow-accent theme-text-on-accent disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 theme-text-on-accent" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>جاري الحفظ...</span>
                </>
              ) : editingItem ? (
                "تحديث البيانات"
              ) : (
                "حفظ السكرتير"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 cursor-pointer rounded-xl py-3 font-bold theme-bg theme-text disabled:opacity-50"
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