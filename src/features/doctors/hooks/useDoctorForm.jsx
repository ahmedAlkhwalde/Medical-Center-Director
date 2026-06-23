import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { closeModal } from "../../../features/doctors/store/doctorsSlice";
import {
  useCreateDoctorMutation,
  useUpdateDoctorMutation,
} from "../service/doctorsService";

// --- الدوال المساعدة ---
const getTodayISODate = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60000).toISOString().slice(0, 10);
};

const isPastDate = (value) => value < getTodayISODate();

const extractIdFromObject = (obj) => {
  if (!obj) return undefined;
  return (
    obj?.legacyId ??
    obj?.id ??
    obj?.uuid ??
    obj?.Clinic_uuid ??
    obj?.Specialization_uuid
  );
};

const getDoctorEntityId = (doctor, entityType) => {
  if (!doctor) return undefined;
  if (entityType === "clinic") {
    return (
      extractIdFromObject(doctor.clinic) ?? doctor.clinic_id ?? doctor.clinicId
    );
  }
  if (entityType === "specialization") {
    return (
      extractIdFromObject(doctor.specialization) ??
      doctor.specialization_id ??
      doctor.specializationId ??
      doctor.specialtyId ??
      extractIdFromObject(doctor.specialty)
    );
  }
  return undefined;
};

const createInitialFormData = (editingDoctor) => {
  const clinicId = getDoctorEntityId(editingDoctor, "clinic") ?? "";
  const specializationId = getDoctorEntityId(editingDoctor, "specialization") ?? "";

  return {
    name: editingDoctor?.name || "",
    phone: editingDoctor?.phone || editingDoctor?.number || "",
    email: editingDoctor?.email || "",
    endcontract:
      editingDoctor?.details?.contract_expiry ||
      editingDoctor?.endcontract ||
      "",
    ratio: editingDoctor?.details?.ratio
      ? parseFloat(editingDoctor.details.ratio)
      : (editingDoctor?.ratio ?? ""),
    clinic_id: clinicId !== "" ? String(clinicId) : "",
    specialization_id: specializationId !== "" ? String(specializationId) : "",
  };
};

// --- الـ Hook الرئيسي ---
export const useDoctorForm = ({ editingDoctor, clinics, specialties, isLoadingData, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(() => createInitialFormData(editingDoctor));
  const [errors, setErrors] = useState({});

  const createDoctorMutation = useCreateDoctorMutation();
  const updateDoctorMutation = useUpdateDoctorMutation();

  const isPending = createDoctorMutation.isPending || updateDoctorMutation.isPending;
  const isDisabled = isPending || isLoadingData;

  useEffect(() => {
    if (editingDoctor && clinics.length > 0 && specialties.length > 0) {
      const doctorClinicId = getDoctorEntityId(editingDoctor, "clinic");
      if (doctorClinicId) {
        const matchedClinic = clinics.find((clinic) => {
          const idsToCheck = [
            clinic.legacyId,
            clinic.id,
            clinic.uuid,
            clinic.Clinic_uuid,
          ].filter((val) => val != null);
          return idsToCheck.some((id) => String(id) === String(doctorClinicId));
        });
        if (matchedClinic) {
          const optionValue = extractIdFromObject(matchedClinic);
          if (optionValue) {
            setFormData((prev) => ({ ...prev, clinic_id: String(optionValue) }));
          }
        }
      }

      const doctorSpecId = getDoctorEntityId(editingDoctor, "specialization");
      if (doctorSpecId) {
        const matchedSpecialty = specialties.find((spec) => {
          const idsToCheck = [
            spec.legacyId,
            spec.id,
            spec.uuid,
            spec.Specialization_uuid,
          ].filter((val) => val != null);
          return idsToCheck.some((id) => String(id) === String(doctorSpecId));
        });
        if (matchedSpecialty) {
          const optionValue = extractIdFromObject(matchedSpecialty);
          if (optionValue) {
            setFormData((prev) => ({ ...prev, specialization_id: String(optionValue) }));
          }
        }
      }
    }
  }, [clinics, specialties, editingDoctor]);

  const validate = () => {
    const newErrors = {};
    const name = formData.name.trim();
    const phone = formData.phone.trim();
    const email = formData.email.trim();

    if (!name) newErrors.name = "اسم الطبيب مطلوب";
    if (!phone) newErrors.phone = "رقم الهاتف مطلوب";
    else if (!/^[0-9+\-\s]{7,}$/.test(phone)) {
      newErrors.phone = "رقم الهاتف غير صالح";
    }

    if (!email) newErrors.email = "البريد الإلكتروني مطلوب";
    else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "البريد الإلكتروني غير صالح";
    }

    if (!formData.endcontract) {
      newErrors.endcontract = "تاريخ انتهاء العقد مطلوب";
    } else if (isPastDate(formData.endcontract)) {
      newErrors.endcontract = "يجب أن يكون التاريخ اليوم أو في المستقبل";
    }

    if (formData.ratio === "") {
      newErrors.ratio = "نسبة الربح مطلوبة";
    } else {
      const ratioNum = Number(formData.ratio);
      if (Number.isNaN(ratioNum) || ratioNum < 0 || ratioNum > 100) {
        newErrors.ratio = "نسبة الربح يجب أن تكون بين 0 و 100";
      }
    }

    if (!formData.clinic_id) newErrors.clinic_id = "العيادة مطلوبة";
    if (!formData.specialization_id) newErrors.specialization_id = "الاختصاص مطلوب";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate() || isPending) return;

    if (editingDoctor) {
      const currentValues = {
        name: formData.name.trim(),
        number: formData.phone.trim(),
        email: formData.email.trim(),
        clinic_id: Number(formData.clinic_id),
        specialization_id: Number(formData.specialization_id),
        endcontract: formData.endcontract,
        ratio: Number(formData.ratio),
      };

      const updatePayload = {};

      Object.keys(currentValues).forEach((key) => {
        const originalValue =
          key === "clinic_id"
            ? (editingDoctor.clinic?.legacyId ??
              editingDoctor.clinic?.id ??
              editingDoctor.clinic_id ??
              editingDoctor.clinicId ??
              editingDoctor.clinic?.Clinic_uuid ??
              editingDoctor.clinic?.uuid)
            : key === "specialization_id"
              ? (editingDoctor.specialization?.legacyId ??
                editingDoctor.specialization?.id ??
                editingDoctor.specialization_id ??
                editingDoctor.specializationId ??
                editingDoctor.specialtyId ??
                editingDoctor.specialty?.id ??
                editingDoctor.specialization?.uuid)
              : key === "number"
                ? editingDoctor.phone || editingDoctor.number
                : (editingDoctor[key] ?? editingDoctor.details?.[key]);

        if (String(currentValues[key]) !== String(originalValue ?? "")) {
          updatePayload[key] = currentValues[key];
        }
      });

      if (Object.keys(updatePayload).length > 0) {
        updateDoctorMutation.mutate(
          { uuid: editingDoctor.uuid, payload: updatePayload },
          {
            onSuccess: () => {
              // الـ Snackbar يظهر تلقائياً من الـ service الآن
              setTimeout(() => dispatch(closeModal()), 100);
            },
          },
        );
      } else {
        // هذه الرسالة بقيت هنا لأنها لا تعتمد على طلب سيرفر (Front-end validation)
        import("../../../features/uiSlice").then(({ showSnackbar: localShowSnackbar }) => {
          dispatch(localShowSnackbar({ message: "لم يتم تغيير أي بيانات.", variant: "info" }));
        });
      }
    } else {
      const payload = {
        name: formData.name.trim(),
        number: formData.phone.trim(),
        email: formData.email.trim(),
        clinic_id: Number(formData.clinic_id),
        specialization_id: Number(formData.specialization_id),
        endcontract: formData.endcontract,
        ratio: Number(formData.ratio),
      };

      createDoctorMutation.mutate(payload, {
        onSuccess: () => {
          setTimeout(() => dispatch(closeModal()), 100);
        },
      });
    }
  };

  return {
    formData,
    setFormData,
    errors,
    handleSubmit,
    isPending,
    isDisabled,
    extractIdFromObject
  };
};