import { motion as Motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { closeDeleteDialog } from "../../../features/secretaries/secretariesSlice";
import { showSnackbar } from "../../../features/uiSlice";
import {
  useDeleteSecretaryMutation,
  useActivateSecretaryMutation,
} from "../../../service/secretariesService";

const DeleteConfirmDialog = () => {
  const { isDeleteDialogOpen, itemToDelete } = useSelector(
    (state) => state.secretaries,
  );
  const dispatch = useDispatch();
  const deleteSecretaryMutation = useDeleteSecretaryMutation();
  const activateSecretaryMutation = useActivateSecretaryMutation();

  const selectedItemName = itemToDelete?.name;
  console.debug(
    "DeleteConfirmDialog: itemToDelete",
    itemToDelete,
    "deletePending",
    deleteSecretaryMutation.isPending,
    "activatePending",
    activateSecretaryMutation.isPending,
  );

  const handleToggleActive = () => {
    const isActive = Boolean(itemToDelete?.isActive);
    const mutation = isActive
      ? deleteSecretaryMutation
      : activateSecretaryMutation;

    if (!itemToDelete || mutation.isPending) return;
    if (itemToDelete?.isOptimistic) {
      dispatch(closeDeleteDialog());
      dispatch(
        showSnackbar({
          message: "انتظر اكتمال المزامنة بعد تغيير الحالة",
          variant: "info",
        }),
      );
      return;
    }
    if (!itemToDelete?.id) {
      dispatch(
        showSnackbar({
          message: "معرّف السكرتير غير متوفر",
          variant: "error",
        }),
      );
      return;
    }

    const successMessage = isActive
      ? "تم إلغاء تفعيل الحساب بنجاح"
      : "تم تفعيل الحساب بنجاح";
    const errorMessage = isActive
      ? "تعذر إلغاء تفعيل الحساب حاليا"
      : "تعذر تفعيل الحساب حاليا";

    dispatch(closeDeleteDialog());

    mutation.mutate(Number(itemToDelete.id), {
      onSuccess: () => {
        dispatch(
          showSnackbar({
            message: successMessage,
            variant: "success",
          }),
        );
      },
      onError: () => {
        dispatch(
          showSnackbar({
            message: errorMessage,
            variant: "error",
          }),
        );
      },
    });
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
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="theme-surface relative z-10 w-full max-w-sm rounded-3xl p-5 text-center shadow-2xl sm:p-8"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full theme-danger-soft text-3xl theme-text-danger">
              !
            </div>
            <h3 className="text-xl font-bold theme-text">هل أنت متأكد؟</h3>
            <p className="mt-3 text-sm theme-text-muted">
              سيتم {itemToDelete?.isActive ? "إلغاء تفعيل" : "تفعيل"} حساب{" "}
              <span className="font-bold theme-text-accent">
                {selectedItemName || "هذا السجل"}
              </span>
              .
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleToggleActive}
                disabled={
                  itemToDelete?.isActive
                    ? deleteSecretaryMutation.isPending
                    : activateSecretaryMutation.isPending
                }
                className="flex-1 cursor-pointer rounded-xl py-3 font-bold theme-text-on-accent theme-accent theme-shadow-accent"
              >
                {itemToDelete?.isActive ? "إلغاء التفعيل" : "تفعيل"}
              </button>
              <button
                type="button"
                onClick={() => dispatch(closeDeleteDialog())}
                disabled={
                  itemToDelete?.isActive
                    ? deleteSecretaryMutation.isPending
                    : activateSecretaryMutation.isPending
                }
                className="flex-1 cursor-pointer rounded-xl py-3 font-bold theme-bg theme-text"
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
