import { useState } from "react";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../../features/uiSlice";
import {
  useCreateSpecialtyMutation,
  useUpdateSpecialtyMutation,
} from "../service/specialtiesService";

// دالة مساعدة لتجهيز البيانات الابتدائية للنموذج
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
      dispatch(
        showSnackbar({
          message: "تمت إضافة الاختصاص بنجاح",
          variant: "success",
        })
      );
      onClose();
    },
    onError: () => {
      dispatch(
        showSnackbar({
          message: "تعذر إضافة الاختصاص حالياً، تحقق من الحقول",
          variant: "error",
        })
      );
    },
  });

  // طفرة تحديث اختصاص حالي
  const updateSpecialtyMutation = useUpdateSpecialtyMutation({
    onSuccess: () => {
      dispatch(
        showSnackbar({
          message: "تم تحديث الاختصاص بنجاح",
          variant: "success",
        })
      );
      onClose();
    },
    onError: (e) => {
      console.error(e);
      dispatch(
        showSnackbar({
          message: "تعذر تحديث الاختصاص حالياً",
          variant: "error",
        })
      );
    },
  });

  // حساب حالة التحميل الإجمالية للعمليتين
  const isSubmitting = createSpecialtyMutation.isPending || updateSpecialtyMutation.isPending;

  // التحقق من صحة المدخلات قبل الإرسال
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

  // معالجة إرسال النموذج للـ API
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
        dispatch(
          showSnackbar({
            message: "معرّف الاختصاص غير متوفر للتعديل",
            variant: "error",
          })
        );
        return;
      }
      updateSpecialtyMutation.mutate({ uuid: targetId, payload });
      return;
    }

    createSpecialtyMutation.mutate(payload);
  };

  // دالة موحدة لتحديث قيم الحقول تلقائياً وبسهولة
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