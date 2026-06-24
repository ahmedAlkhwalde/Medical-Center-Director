import { useState } from "react";
import {
  useCreateSecretaryMutation,
  useUpdateSecretaryMutation,
} from "../service/secretariesService";

const createInitialFormData = (editingItem) => ({
  name: editingItem?.name || "",
  phone: editingItem?.phone || "",
  email: editingItem?.email || "",
  salary: editingItem?.salary ?? "",
});

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const useSecretaryForm = (editingItem, onClose) => {
  const [formData, setFormData] = useState(() => createInitialFormData(editingItem));
  const [errors, setErrors] = useState({});

  // طفرة إضافة سكرتير جديد
  const createSecretaryMutation = useCreateSecretaryMutation({
    onSuccess: () => onClose(),
  });
  
  // طفرة تعديل بيانات سكرتير حالي
  const updateSecretaryMutation = useUpdateSecretaryMutation({
    onSuccess: () => onClose(),
  });

  const isSubmitting = createSecretaryMutation.isPending || updateSecretaryMutation.isPending;

  // التحقق من الحقول الإلزامية وصيغة البيانات
  const validate = () => {
    const nextErrors = {};
    if (!formData.name.trim()) nextErrors.name = "اسم السكرتير مطلوب";
    if (!formData.phone.trim()) nextErrors.phone = "الرقم مطلوب";
    if (!emailPattern.test(formData.email.trim())) nextErrors.email = "البريد الإلكتروني غير صالح";
    if (!formData.salary || Number(formData.salary) <= 0) nextErrors.salary = "الراتب يجب أن يكون أكبر من 0";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // معالجة الإرسال والحفظ
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate() || isSubmitting) return;

    const currentName = formData.name.trim();
    const currentEmail = formData.email.trim();
    const currentPhone = formData.phone.trim();
    const currentSalary = Number(formData.salary) || 0;

    // حالة التعديل: إرسال الحقول المتغيرة فقط (Diff Check)
    if (editingItem) {
      const changedPayload = {};

      if (currentName !== editingItem.name) {
        changedPayload.name = currentName;
      }
      if (currentEmail !== editingItem.email) {
        changedPayload.email = currentEmail;
      }
      if (currentPhone !== editingItem.phone) {
        changedPayload.number = currentPhone; // الباك إند يتوقع اسم number
      }
      if (currentSalary !== editingItem.salary) {
        changedPayload.salary = currentSalary;
      }

      // إذا لم يتغير شيء، نغلق المودال مباشرة دون إرهاق السيرفر
      if (Object.keys(changedPayload).length === 0) {
        onClose();
        return;
      }

      updateSecretaryMutation.mutate({
        uuid: editingItem.uuid,
        payload: changedPayload,
      });
      return;
    }

    // حالة الإضافة الجديدة
    const fullPayload = {
      name: currentName,
      email: currentEmail,
      number: currentPhone,
      salary: currentSalary,
    };
    createSecretaryMutation.mutate(fullPayload);
  };

  // دالة مساعدة لتحديث الحقول بشكل مرن
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