import { useDispatch, useSelector } from "react-redux";
import { closeDeleteDialog } from "../store/clinicsSlice";
import { showSnackbar } from "../../uiSlice";
import { useDeleteClinicMutation } from "../server/clinicsService";

export const useDeleteClinic = () => {
  const dispatch = useDispatch();
  
  const { isDeleteDialogOpen, itemToDelete } = useSelector(
    (state) => state.clinics,
  );

  const deleteClinicMutation = useDeleteClinicMutation({
    onSuccess: () => {
      // إغلاق الديالوج فقط، السيرفر يتكفل بالـ Snackbar
      dispatch(closeDeleteDialog());
    },
  });

  const isPending = deleteClinicMutation.isPending;

  const handleClose = () => {
    if (!isPending) {
      dispatch(closeDeleteDialog());
    }
  };

  const handleDelete = () => {
    if (!itemToDelete || isPending) return;

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

    if (!uuid || String(uuid).startsWith("temp-")) {
      dispatch(
        showSnackbar({ message: "معرف العيادة غير صالح", variant: "error" }),
      );
      return;
    }

    deleteClinicMutation.mutate(uuid);
  };

  return {
    isDeleteDialogOpen,
    isPending,
    handleDelete,
    handleClose,
  };
};