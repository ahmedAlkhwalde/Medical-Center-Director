import { motion as Motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { closeDeleteDialog } from "../../../features/doctors/doctorsSlice";
import { useUpdateDoctorStatusMutation } from "../../../service/doctorsService";
import { showSnackbar } from "../../../features/uiSlice"; 

const DoctorStatusConfirmDialog = () => {
  const { isDeleteDialogOpen, doctorToDelete } = useSelector(
    (state) => state.doctors,
  );
  const dispatch = useDispatch();

  const statusMutation = useUpdateDoctorStatusMutation();

  const isPending = statusMutation.isPending;
  const targetUuid = doctorToDelete?.uuid || doctorToDelete?.id;
  
  // قراءة حالة التفعيل الحية للطبيب
  const isActive = Boolean(doctorToDelete?.isActive || doctorToDelete?.active);
  const selectedItemName = doctorToDelete?.name;

  const handleToggleActive = () => {
    if (!targetUuid || isPending) return;

    // إرسال طلب عكس الحالة الحالية للسيرفر
    statusMutation.mutate(
      {
        uuid: targetUuid,
        active: isActive ? 0 : 1
      },
      {
        // 💡 خطوة 2: التعامل مع حالة النجاح وإرسال رسالة مخصصة وديناميكية
        onSuccess: () => {
          // إغلاق نافذة التأكيد فور نجاح العملية
          dispatch(closeDeleteDialog());

          // تحديد نص الرسالة بناءً على العملية (إذا كان نشطاً وتم كبسه، يعني تم تعطيله والعكس)
          const successMessage = isActive 
            ? `تم تعطيل حساب الطبيب (${selectedItemName || "المحدد"}) بنجاح` 
            : `تم تفعيل حساب الطبيب (${selectedItemName || "المحدد"}) بنجاح`;

          dispatch(
            showSnackbar({ message: successMessage, variant: "success" })
          );
        },
        // 💡 خطوة 3: التعامل مع حالة الفشل وإظهار التنبيه الأحمر بالخطأ
        onError: (error) => {
          // جلب رسالة الخطأ القادمة من رد السيرفر إن وجدت، أو وضع رسالة افتراضية
          const serverMessage = error?.response?.data?.message;
          const errorMessage = serverMessage || "حدث خطأ أثناء محاولة تعديل حالة الطبيب، يرجى المحاولة لاحقاً";

          dispatch(
            showSnackbar({ message: errorMessage, variant: "error" })
          );
        }
      }
    );
  };

  return (
    <AnimatePresence>
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto">
          {/* الخلفية الموضببة الهادئة */}
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isPending && dispatch(closeDeleteDialog())}
            className="fixed inset-0 theme-overlay backdrop-blur-md"
          />

          {/* جسد الـ Dialog */}
          <Motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="theme-surface relative z-10 w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl border theme-border sm:p-8"
          >
            <div className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full text-4xl border ${
              isActive 
                ? "bg-amber-500/10 text-amber-500 border-amber-500/20" 
                : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
            }`}>
              {isActive ? "⚠️" : "🔒"}
            </div>

            <h3 className="text-2xl font-black tracking-tight theme-text">
              {isActive ? "تعطيل الحساب؟" : "تفعيل الحساب؟"}
            </h3>
            
            <p className="mt-3 text-sm leading-relaxed theme-text-muted px-2">
              أنت على وشك تغيير حالة حساب الطبيب{" "}
              <span className="font-bold theme-text-accent block text-base mt-1">
                {selectedItemName || "هذا الطبيب"}
              </span>
              سيؤدي هذا إلى {isActive ? "حظر دخوله المؤقت للنظام" : "السماح له بالوصول للوحة التحكم"}.
            </p>

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
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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
                onClick={() => dispatch(closeDeleteDialog())}
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

export default DoctorStatusConfirmDialog;