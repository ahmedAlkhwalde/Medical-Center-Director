import { useDispatch, useSelector } from "react-redux";
import { closeDeleteDialog } from "../store/secretariesSlice";
import { useUpdateSecretaryStatusMutation } from "../service/secretariesService";

export const useDeleteConfirmDialog = () => {
  const dispatch = useDispatch();
  
  // جلب بيانات الحوار والسجل المطلوب تعديله من الريدكس
  const { isDeleteDialogOpen, itemToDelete } = useSelector(
    (state) => state.secretaries,
  );

  // استدعاء طفرة تحديث الحالة مع إغلاق الحوار عند النجاح
  const statusMutation = useUpdateSecretaryStatusMutation({
    onSuccess: () => {
      dispatch(closeDeleteDialog());
    },
  });

  const isPending = statusMutation.isPending;
  const targetUuid = itemToDelete?.uuid || itemToDelete?.id;
  
  // قراءة وتحويل البيانات الحالية للسجل
  const isActive = Boolean(itemToDelete?.isActive);
  const selectedItemName = itemToDelete?.name;

  // تنفيذ عملية التبديل وإرسالها للسيرفر
  const handleToggleActive = () => {
    if (!targetUuid || isPending) return;

    statusMutation.mutate({
      uuid: targetUuid,
      active: isActive ? 0 : 1,
    });
  };

  // دالة إغلاق الحوار المفاجئ
  const handleClose = () => {
    dispatch(closeDeleteDialog());
  };

  return {
    isDeleteDialogOpen,
    isActive,
    selectedItemName,
    isPending,
    handleToggleActive,
    handleClose,
  };
};