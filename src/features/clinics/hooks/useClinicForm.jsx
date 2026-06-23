import { useState } from "react";
import { useDispatch } from "react-redux";
import { closeModal } from "../../../features/clinics/store/clinicsSlice";
import { showSnackbar } from "../../../features/uiSlice";
import {
  useCreateClinicMutation,
  useUpdateClinicMutation,
} from "../server/clinicsService";

const createInitialFormData = (editingItem) => ({
  clinicName: editingItem?.clinicName || "",
  address: editingItem?.address || "",
});

export const useClinicForm = (editingItem) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(() => createInitialFormData(editingItem));
  const [errors, setErrors] = useState({});

  const handleClose = () => {
    dispatch(closeModal());
  };

  const createClinicMutation = useCreateClinicMutation({
    onSuccess: () => {
      handleClose();
    },
  });

  const updateClinicMutation = useUpdateClinicMutation({
    onSuccess: () => {
      handleClose();
    },
  });

  const isSubmitting = createClinicMutation.isPending || updateClinicMutation.isPending;

  const validate = () => {
    const newErrors = {};

    if (!formData.clinicName.trim()) {
      newErrors.clinicName = "اسم العيادة مطلوب";
    }

    if (!formData.address.trim()) {
      newErrors.address = "العنوان مطلوب";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate() || isSubmitting) return;

    const payload = {
      clinicName: formData.clinicName.trim(),
      name: formData.clinicName.trim(),
      clinic_name: formData.clinicName.trim(),
      address: formData.address.trim(),
    };

    if (editingItem) {
      const targetId = editingItem.uuid;
      if (!targetId) {
        dispatch(
          showSnackbar({
            message: "معرّف العيادة غير متوفر للتعديل",
            variant: "error",
          }),
        );
        return;
      }
      updateClinicMutation.mutate({ uuid: targetId, payload });
      return;
    }

    createClinicMutation.mutate(payload);
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    errors,
    isSubmitting,
    handleSubmit,
    handleFieldChange,
    handleClose,
  };
};