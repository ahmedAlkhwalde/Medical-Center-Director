import { motion as Motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  closeDeleteDialog,
  executeDelete,
} from "../../../features/secretaries/secretariesSlice";

const DeleteConfirmDialog = () => {
  const { isDeleteDialogOpen, itemToDelete, items } = useSelector(
    (state) => state.secretaries,
  );
  const dispatch = useDispatch();

  const selectedItem = items.find((item) => item.id === itemToDelete);

  return (
    <AnimatePresence>
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-4">
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
            className="relative z-10 w-full max-w-md rounded-3xl p-5 shadow-2xl theme-surface sm:p-8"
          >
            <h3 className="text-2xl font-bold theme-text-accent">
              حذف سجل السكرتير
            </h3>
            <p className="mt-3 text-sm leading-7 theme-text-muted">
              هل أنت متأكد من حذف سجل{" "}
              <span className="font-bold theme-text-accent">
                {selectedItem?.name || "هذا السجل"}
              </span>
              ؟ لا يمكن التراجع عن هذه العملية.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => dispatch(executeDelete())}
                className="flex-1 cursor-pointer rounded-xl py-3 font-bold theme-text-on-accent theme-accent theme-shadow-accent"
              >
                حذف
              </button>
              <button
                type="button"
                onClick={() => dispatch(closeDeleteDialog())}
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
