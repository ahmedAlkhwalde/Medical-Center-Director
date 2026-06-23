import { useDispatch, useSelector } from "react-redux";
import { closeDeleteDialog } from "../../../features/specialties/store/specialtiesSlice";
import { useDeleteSpecialtyMutation } from "../service/specialtiesService";

export const useDeleteSpecialty = () => {
  const dispatch = useDispatch();
  const { isDeleteSheetOpen, itemToDelete } = useSelector(
    (state) => state.specialties
  );

  // طفرة حذف الاختصاص
  const deleteSpecialtyMutation = useDeleteSpecialtyMutation({
    onSuccess: () => {
      dispatch(closeDeleteDialog());
    },
  });

  const handleDelete = () => {
    if (!itemToDelete || deleteSpecialtyMutation.isPending) return;
    deleteSpecialtyMutation.mutate(itemToDelete);
  };

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