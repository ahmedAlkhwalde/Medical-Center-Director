import { motion as Motion, AnimatePresence } from "framer-motion";
import { useDeleteConfirmDialog } from "../hooks/useDeleteConfirmDialog"; // اضبط مسار الهوك حسب مشروعك

const DeleteConfirmDialog = () => {
  const {
    isDeleteDialogOpen,
    isActive,
    selectedItemName,
    isPending,
    handleToggleActive,
    handleClose,
  } = useDeleteConfirmDialog();

  return (
    <AnimatePresence>
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto">
          {/* الخلفية الموضببة الهادئة */}
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isPending && handleClose()}
            className="fixed inset-0 theme-overlay backdrop-blur-md"
          />

          {/* جسد الـ Dialog الفاخر */}
          <Motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="theme-surface relative z-10 w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl border theme-border sm:p-8"
          >
            {/* الأيقونة تتحدد بناءً على حالة العنصر المفتوح حالياً */}
            <div
              className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full text-4xl border ${
                isActive
                  ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                  : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
              }`}
            >
              {isActive ? "⚠️" : "🔒"}
            </div>

            {/* نصوص ذكية تتغير حسب حالة الحساب الحالية */}
            <h3 className="text-2xl font-black tracking-tight theme-text">
              {isActive ? "تعطيل الحساب؟" : "تفعيل الحساب؟"}
            </h3>

            <p className="mt-3 text-sm leading-relaxed theme-text-muted px-2">
              أنت على وشك تغيير حالة حساب السكرتير{" "}
              <span className="font-bold theme-text-accent block text-base mt-1">
                {selectedItemName || "هذا السجل"}
              </span>
              سيؤدي هذا إلى{" "}
              {isActive ? "حظر دخوله المؤقت للنظام" : "السماح له بالوصول للوحة التحكم"}
              .
            </p>

            {/* أزرار التحكم الفورية */}
            <div className="mt-8 flex gap-3">
              <button
                type="button"
                disabled={isPending}
                onClick={handleToggleActive}
                className={`flex-[2] flex items-center justify-center gap-2 cursor-pointer rounded-xl py-3.5 font-bold shadow-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-60 ${
                  isActive
                    ? "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
                }`}
              >
                {isPending ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
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
                ) : isActive ? (
                  "تأكيد التعطيل"
                ) : (
                  "تأكيد التفعيل"
                )}
              </button>

              <button
                type="button"
                disabled={isPending}
                onClick={handleClose}
                className="flex-1 cursor-pointer rounded-xl py-3.5 font-bold border theme-border theme-bg theme-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-200 disabled:opacity-40"
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

export default DeleteConfirmDialog;