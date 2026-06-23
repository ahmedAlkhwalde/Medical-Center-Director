import { useDispatch, useSelector } from "react-redux";
import { closeDeleteDialog } from "../store/doctorsSlice";
import { useUpdateDoctorStatusMutation } from "../service/doctorsService";

export const useDoctorStatus = () => {
  const dispatch = useDispatch();
  
  const { isDeleteDialogOpen, doctorToDelete } = useSelector(
    (state) => state.doctors,
  );

  const statusMutation = useUpdateDoctorStatusMutation();
  const isPending = statusMutation.isPending;

  const targetUuid = doctorToDelete?.uuid || doctorToDelete?.id;
  const isActive = Boolean(doctorToDelete?.isActive || doctorToDelete?.active);
  const selectedItemName = doctorToDelete?.name;

  const handleToggleActive = () => {
    if (!targetUuid || isPending) return;

    statusMutation.mutate(
      {
        uuid: targetUuid,
        active: isActive ? 0 : 1,
      },
      {
        onSuccess: () => {
          // إغلاق النافذة فوراً، والتنبيه يتم التعامل معه في الـ service
          dispatch(closeDeleteDialog());
        },
      },
    );
  };

  const handleClose = () => {
    if (!isPending) {
      dispatch(closeDeleteDialog());
    }
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