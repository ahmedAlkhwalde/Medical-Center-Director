import { motion as Motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { closeDeleteDialog } from "../../../features/specialties/specialtiesSlice";
import { showSnackbar } from "../../../features/uiSlice";
import { useDeleteSpecialtyMutation } from "../../../service/specialtiesService";

const DeleteConfirmDialog = () => {
  const { isDeleteSheetOpen, itemToDelete } = useSelector(
    (state) => state.specialties,
  );
  const dispatch = useDispatch();
  const deleteSpecialtyMutation = useDeleteSpecialtyMutation({
    onSuccess: () => {
      dispatch(closeDeleteDialog());
      dispatch(
        showSnackbar({
          message: "تم حذف الاختصاص بنجاح",
          variant: "success",
        }),
      );
    },
    onError: () => {
      dispatch(
        showSnackbar({
          message: "تعذر حذف الاختصاص حاليا",
          variant: "error",
        }),
      );
    },
  });

  const handleDelete = () => {
    if (!itemToDelete || deleteSpecialtyMutation.isPending) return;
    dispatch(closeDeleteDialog());
    deleteSpecialtyMutation.mutate(itemToDelete);
  };

  return (
    <AnimatePresence>
      {isDeleteSheetOpen && (
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
            className="theme-surface p-5 sm:p-8 rounded-3xl max-w-sm w-full relative z-10 text-center shadow-2xl"
          >
            <div className="w-16 h-16 theme-danger-soft theme-text-danger rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              !
            </div>
            <h3 className="text-xl font-bold theme-text mb-2">هل أنت متأكد؟</h3>
            <p className="theme-text-muted mb-6 text-sm">
              لا يمكن التراجع عن عملية الحذف بعد إتمامها.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleteSpecialtyMutation.isPending}
                className="flex-1 theme-danger-soft theme-text-danger font-bold py-3 rounded-xl theme-hover-danger-solid transition-all"
              >
                حذف
              </button>
              <button
                onClick={() => dispatch(closeDeleteDialog())}
                disabled={deleteSpecialtyMutation.isPending}
                className="flex-1 theme-bg theme-text font-bold py-3 rounded-xl"
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
