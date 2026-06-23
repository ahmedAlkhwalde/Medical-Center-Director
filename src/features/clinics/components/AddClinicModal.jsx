import { useSelector } from "react-redux";
import { Close } from "@mui/icons-material";
import { useClinicForm } from "../hooks/useClinicForm"; // تأكد من صحة مسار الهوك لديك

const AddClinicModal = () => {
  const { isModalOpen, editingItem } = useSelector((state) => state.clinics);

  if (!isModalOpen) return null;

  return (
    <ModalContent
      key={editingItem ? editingItem.id : "new"}
      editingItem={editingItem}
    />
  );
};

const ModalContent = ({ editingItem }) => {
  const {
    formData,
    errors,
    isSubmitting,
    handleSubmit,
    handleFieldChange,
    handleClose,
  } = useClinicForm(editingItem);

  return (
    <div className="fixed inset-0 z-10000 flex items-center justify-center p-3 sm:p-4">
      {/* الخلفية المظلمة */}
      <div
        onClick={() => !isSubmitting && handleClose()}
        className="absolute inset-0 theme-overlay backdrop-blur-sm"
      />

      {/* نافذة المحتوى الفورية */}
      <div className="theme-surface relative z-10 w-full max-w-xl rounded-3xl p-5 shadow-2xl sm:p-8">
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
            onClick={handleClose}
            disabled={isSubmitting}
            className="rounded-xl p-2 theme-hover-surface theme-text-muted transition-colors disabled:opacity-50"
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
            disabled={isSubmitting}
            onChange={(event) => handleFieldChange("clinicName", event.target.value)}
          />

          <TextareaField
            label="العنوان"
            value={formData.address}
            error={errors.address}
            placeholder="مثال: دمشق - المزة - شارع الفيلات"
            disabled={isSubmitting}
            onChange={(event) => handleFieldChange("address", event.target.value)}
          />

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            {/* زر الحفظ والتحديث مع الـ Spinner */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 cursor-pointer rounded-xl theme-accent px-5 py-3 font-bold theme-text-on-accent shadow-lg theme-shadow-accent transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-current"
                    xmlns="http://www.w3.org/2000/svg"
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
                  <span>جاري المعالجة...</span>
                </>
              ) : editingItem ? (
                "تحديث البيانات"
              ) : (
                "حفظ العيادة"
              )}
            </button>

            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 cursor-pointer rounded-xl theme-bg px-5 py-3 font-bold theme-text disabled:opacity-50 disabled:cursor-not-allowed"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
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