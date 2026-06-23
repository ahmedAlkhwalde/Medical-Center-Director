import { motion as Motion, AnimatePresence } from "framer-motion";
import { useDeleteClinic } from "../hooks/useDeleteClinic"; // تأكد من ضبط مسار الهوك الصحيح لديك

const DeleteClinicDialog = () => {
  const {
    isDeleteDialogOpen,
    isPending,
    handleDelete,
    handleClose,
  } = useDeleteClinic();

  return (
    <AnimatePresence>
      {isDeleteDialogOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center p-3 sm:p-4"
          style={{ zIndex: 10000 }}
        >
          {/* الخلفية المظلمة */}
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 theme-overlay backdrop-blur-sm"
          />

          {/* نافذة التأكيد */}
          <Motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="theme-surface relative z-10 w-full max-w-sm rounded-3xl p-5 text-center shadow-2xl sm:p-8"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full theme-danger-soft text-3xl theme-text-danger">
              !
            </div>
            <h3 className="mb-2 text-xl font-bold theme-text">هل أنت متأكد؟</h3>
            <p className="mb-6 text-sm theme-text-muted">
              لا يمكن التراجع عن حذف العيادة بعد إتمام العملية.
            </p>
            
            <div className="flex gap-3">
              {/* زر الحذف الفعلي مع مؤشر التحميل */}
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl theme-danger-soft py-3 font-bold theme-text-danger transition-all theme-hover-danger-solid disabled:opacity-70"
              >
                {isPending ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 theme-text-danger"
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
                        document-dir="rtl"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>جاري الحذف...</span>
                  </>
                ) : (
                  "حذف"
                )}
              </button>

              {/* زر الإلغاء */}
              <button
                onClick={handleClose}
                disabled={isPending}
                className="flex-1 rounded-xl cursor-pointer theme-bg py-3 font-bold theme-text disabled:opacity-50"
              >
                إلغاء
              </button>
            </div>
          </Motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DeleteClinicDialog;