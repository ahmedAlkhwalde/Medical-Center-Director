import { useDispatch, useSelector } from "react-redux";
import { closeDeleteDialog } from "../../../features/specialties/store/specialtiesSlice";
import { showSnackbar } from "../../../features/uiSlice";
import { useDeleteSpecialtyMutation } from "../service/specialtiesService";

export const useDeleteSpecialty = () => {
  const dispatch = useDispatch();
  const { isDeleteSheetOpen, itemToDelete } = useSelector(
    (state) => state.specialties
  );

  // طفرة حذف الاختصاص عبر RTK Query
  const deleteSpecialtyMutation = useDeleteSpecialtyMutation({
    onSuccess: () => {
      // إغلاق النافذة وإظهار رسالة النجاح فقط عند اكتمال العملية بنجاح من السيرفر
      dispatch(closeDeleteDialog());
      dispatch(
        showSnackbar({
          message: "تم حذف الاختصاص بنجاح",
          variant: "success",
        })
      );
    },
    onError: () => {
      // تبقى النافذة مفتوحة في حال الفشل مع إظهار رسالة الخطأ
      dispatch(
        showSnackbar({
          message: "تعذر حذف الاختصاص حالياً",
          variant: "error",
        })
      );
    },
  });

  // معالجة الضغط على زر الحذف
  const handleDelete = () => {
    if (!itemToDelete || deleteSpecialtyMutation.isPending) return;
    deleteSpecialtyMutation.mutate(itemToDelete);
  };

  // دالة موحدة للإغلاق تمنع الخروج العشوائي أثناء التحميل
  const handleClose = () => {
    if (!deleteSpecialtyMutation.isPending) {
      dispatch(closeDeleteDialog());
    }
  };

  return {
    isDeleteSheetOpen,
    isPending: deleteSpecialtyMutation.isPending,
    handleDelete,
    handleClose,
  };
};