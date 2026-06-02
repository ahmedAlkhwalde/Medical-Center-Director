import { motion as Motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { closeDeleteDialog } from "../../../features/clinics/clinicsSlice";
import { showSnackbar } from "../../../features/uiSlice";
import { useDeleteClinicMutation } from "../../../service/clinicsService";

const DeleteClinicDialog = () => {
  const { isDeleteDialogOpen, itemToDelete } = useSelector(
    (state) => state.clinics,
  );
  const dispatch = useDispatch();

  const deleteClinicMutation = useDeleteClinicMutation({
    onSuccess: () => {
      // 💡 ننقل إغلاق المودال إلى هنا بعد نجاح العملية تماماً لضمان استقرار حالة البيانات
      dispatch(closeDeleteDialog());
      dispatch(
        showSnackbar({
          message: "تم حذف العيادة بنجاح",
          variant: "success",
        }),
      );
    },
    onError: () => {
      dispatch(
        showSnackbar({
          message: "تعذر حذف العيادة حاليا",
          variant: "error",
        }),
      );
    },
  });

  const handleDelete = () => {
    if (!itemToDelete || deleteClinicMutation.isPending) return;

    if (itemToDelete?.isOptimistic) {
      dispatch(closeDeleteDialog());
      dispatch(
        showSnackbar({
          message: "انتظر اكتمال المزامنة قبل الحذف",
          variant: "info",
        }),
      );
      return;
    }

   
    const uuid = itemToDelete?.uuid ?? itemToDelete?.id;

    if (!uuid || String(uuid).startsWith('temp-')) {
      dispatch(showSnackbar({ message: "معرف العيادة غير صالح", variant: "error" }));
      return;
    }

    // 🚀 نرسل الـ uuid صراحة للـ Mutation
    deleteClinicMutation.mutate(uuid);
    
    dispatch(closeDeleteDialog());
  };

  return (
    <AnimatePresence>
      {isDeleteDialogOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center p-3 sm:p-4"
          style={{ zIndex: 100 }}
        >
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(closeDeleteDialog())}
            className="absolute inset-0 theme-overlay backdrop-blur-sm"
          />

          <Motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
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
              <button
                onClick={handleDelete}
                disabled={deleteClinicMutation.isPending}
                className="flex-1 rounded-xl theme-danger-soft py-3 font-bold theme-text-danger transition-all theme-hover-danger-solid"
              >
                {deleteClinicMutation.isPending ? "جاري الحذف..." : "حذف"}
              </button>
              <button
                onClick={() => dispatch(closeDeleteDialog())}
                disabled={deleteClinicMutation.isPending}
                className="flex-1 rounded-xl theme-bg py-3 font-bold theme-text"
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