import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  useCreateSpecialtyMutation,
  useUpdateSpecialtyMutation,
} from "../service/specialtiesService";

const createInitialFormData = (editingItem) => ({
  name: editingItem?.name || "",
  price: editingItem?.price || "",
  followUpPrice: editingItem?.followUpPrice || "",
});

export const useSpecialtyForm = (editingItem, onClose) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(() => createInitialFormData(editingItem));
  const [errors, setErrors] = useState({});

  // طفرة إضافة اختصاص جديد
  const createSpecialtyMutation = useCreateSpecialtyMutation({
    onSuccess: () => {
      onClose();
    },
  });

  // طفرة تحديث اختصاص حالي
  const updateSpecialtyMutation = useUpdateSpecialtyMutation({
    onSuccess: () => {
      onClose();
    },
  });

  const isSubmitting = createSpecialtyMutation.isPending || updateSpecialtyMutation.isPending;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "اسم الاختصاص مطلوب";
    if (!formData.price || formData.price <= 0) {
      newErrors.price = "السعر يجب أن يكون أكبر من 0";
    }
    if (formData.followUpPrice === "" || formData.followUpPrice < 0) {
      newErrors.followUpPrice = "سعر المراجعة غير صحيح";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    const payload = {
      name: formData.name.trim(),
      checkpaid: Number(formData.price) || 0,
      reviewpaid: Number(formData.followUpPrice) || 0,
    };

    if (editingItem) {
      const targetId = editingItem.uuid;
      if (!targetId) {
        // فحص محلي لحالة عدم توفر المعرف
        import("../../../features/uiSlice").then(({ showSnackbar }) => {
          dispatch(showSnackbar({ message: "معرّف الاختصاص غير متوفر للتعديل", variant: "error" }));
        });
        return;
      }
      updateSpecialtyMutation.mutate({ uuid: targetId, payload });
      return;
    }

    createSpecialtyMutation.mutate(payload);
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
  };
};