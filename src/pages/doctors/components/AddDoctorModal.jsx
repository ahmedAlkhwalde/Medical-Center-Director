import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Close } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { closeModal } from "../../../features/doctors/doctorsSlice";
import { useSpecialtiesQuery } from "../../../service/specialtiesService";
import { useClinicsQuery } from "../../../service/clinicsService";
import {
  useCreateDoctorMutation,
  useUpdateDoctorMutation,
} from "../../../service/doctorsService";
import { showSnackbar } from "../../../features/uiSlice";

const getTodayISODate = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60000).toISOString().slice(0, 10);
};

const isPastDate = (value) => value < getTodayISODate();

// دالة مساعدة لاستخراج أي معرّف من كائن (عيادة / اختصاص)
const extractIdFromObject = (obj) => {
  if (!obj) return undefined;
  return obj?.legacyId ?? obj?.id ?? obj?.uuid ?? obj?.Clinic_uuid ?? obj?.Specialization_uuid;
};

// دالة لاستخراج معرف الطبيب الأصلي للعيادة أو الاختصاص
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
  const specializationId =
    getDoctorEntityId(editingDoctor, "specialization") ?? "";

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

const AddDoctorModal = () => {
  const { isModalOpen, editingDoctor } = useSelector((state) => state.doctors);
  const dispatch = useDispatch();

  const { data: specialtiesData, isLoading: isLoadingSpecialties } =
    useSpecialtiesQuery();
  const { data: clinicsQueryResult, isLoading: isLoadingClinics } =
    useClinicsQuery();

  const createDoctorMutation = useCreateDoctorMutation();
  const updateDoctorMutation = useUpdateDoctorMutation();

  const specialties = useMemo(() => {
    if (!specialtiesData) return [];
    return specialtiesData;
  }, [specialtiesData]);

  const clinics = useMemo(() => {
    if (!clinicsQueryResult || !clinicsQueryResult.items) return [];
    return clinicsQueryResult.items;
  }, [clinicsQueryResult]);

  return (
    <AnimatePresence>
      {isModalOpen && (
        <ModalContent
          key={editingDoctor ? editingDoctor.uuid : "new"}
          editingDoctor={editingDoctor}
          specialties={specialties}
          clinics={clinics}
          createDoctorMutation={createDoctorMutation}
          updateDoctorMutation={updateDoctorMutation}
          isLoadingData={isLoadingClinics || isLoadingSpecialties}
          onClose={() => dispatch(closeModal())}
        />
      )}
    </AnimatePresence>
  );
};

const ModalContent = ({
  editingDoctor,
  specialties = [],
  clinics = [],
  createDoctorMutation,
  updateDoctorMutation,
  isLoadingData,
  onClose,
}) => {
  const [formData, setFormData] = useState(() =>
    createInitialFormData(editingDoctor),
  );
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    if (editingDoctor && clinics.length > 0 && specialties.length > 0) {
      // --- معالجة العيادة ---
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
            setFormData((prev) => ({
              ...prev,
              clinic_id: String(optionValue),
            }));
          }
        }
      }

      // --- معالجة الاختصاص ---
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
            setFormData((prev) => ({
              ...prev,
              specialization_id: String(optionValue),
            }));
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

    if (!formData.clinic_id) {
      newErrors.clinic_id = "العيادة مطلوبة";
    }

    if (!formData.specialization_id) {
      newErrors.specialization_id = "الاختصاص مطلوب";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (
      !validate() ||
      createDoctorMutation.isPending ||
      updateDoctorMutation.isPending
    )
      return;

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
              dispatch(
                showSnackbar({
                  message: "تم تحديث البيانات بنجاح!",
                  variant: "success",
                }),
              );
              setTimeout(() => dispatch(closeModal()), 100);
            },
            onError: () => {
              dispatch(
                showSnackbar({
                  message: "حدث خطأ أثناء التحديث.",
                  variant: "error",
                }),
              );
            },
          },
        );
      } else {
        dispatch(
          showSnackbar({ message: "لم يتم تغيير أي بيانات.", variant: "info" }),
        );
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
          dispatch(
            showSnackbar({
              message: "تم إضافة الطبيب بنجاح!",
              variant: "success",
            }),
          );
          setTimeout(() => dispatch(closeModal()), 100);
        },
        onError: (error) => {
          dispatch(
            showSnackbar({ message: "تعذر إضافة الطبيب.", variant: "error" }),
          );
          console.error(error);
        },
      });
    }
  };

  console.log("Full editingDoctor:", editingDoctor);

  return (
    <div className="fixed inset-0 z-10000 flex items-center justify-center p-3 sm:p-4">
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 theme-overlay backdrop-blur-sm"
      />

      <Motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="theme-surface relative z-10 w-full max-w-2xl rounded-3xl p-5 shadow-2xl sm:p-8"
      >
        <div className="mb-6 flex items-start justify-between gap-3">
          <div className="text-right">
            <h3 className="text-2xl font-bold theme-text">
              {editingDoctor ? "تعديل بيانات الطبيب" : "إضافة طبيب جديد"}
            </h3>
            <p className="mt-1 text-sm theme-text-muted">
              أدخل البيانات وسيتم ربط المعرفات الخاصة بالعيادة والاختصاص
              تلقائياً.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 theme-hover-surface theme-text-muted transition-colors"
            aria-label="إغلاق النافذة"
          >
            <Close fontSize="small" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="اسم الطبيب"
            value={formData.name}
            error={errors.name}
            disabled={
              createDoctorMutation.isPending ||
              updateDoctorMutation.isPending ||
              isLoadingData
            }
            placeholder="مثال: د. أحمد علي"
            onChange={(event) =>
              setFormData({ ...formData, name: event.target.value })
            }
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InputField
              label="رقم الهاتف"
              value={formData.phone}
              error={errors.phone}
              disabled={
                createDoctorMutation.isPending ||
                updateDoctorMutation.isPending ||
                isLoadingData
              }
              placeholder="09xxxxxxxx"
              onChange={(event) =>
                setFormData({ ...formData, phone: event.target.value })
              }
            />

            <InputField
              label="البريد الإلكتروني"
              type="email"
              value={formData.email}
              error={errors.email}
              disabled={
                createDoctorMutation.isPending ||
                updateDoctorMutation.isPending ||
                isLoadingData
              }
              placeholder="doctor@shifa.com"
              onChange={(event) =>
                setFormData({ ...formData, email: event.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <SelectField
              label="العيادة"
              value={formData.clinic_id}
              error={errors.clinic_id}
              disabled={
                createDoctorMutation.isPending ||
                updateDoctorMutation.isPending ||
                isLoadingData
              }
              onChange={(event) =>
                setFormData({ ...formData, clinic_id: event.target.value })
              }
            >
              <option value="">اختر العيادة</option>
              {clinics.map((clinic) => {
                const clinicId = extractIdFromObject(clinic);
                return (
                  <option
                    key={clinic.uuid || clinicId || Math.random()}
                    value={clinicId ? String(clinicId) : ""}
                  >
                    {clinic.clinicName || clinic.name}
                  </option>
                );
              })}
            </SelectField>

            <SelectField
              label="الاختصاص"
              value={formData.specialization_id}
              error={errors.specialization_id}
              disabled={
                createDoctorMutation.isPending ||
                updateDoctorMutation.isPending ||
                isLoadingData
              }
              onChange={(event) =>
                setFormData({
                  ...formData,
                  specialization_id: event.target.value,
                })
              }
            >
              <option value="">اختر الاختصاص</option>
              {specialties.map((specialty) => {
                const specId = extractIdFromObject(specialty);
                return (
                  <option
                    key={specialty.uuid || specId || Math.random()}
                    value={specId ? String(specId) : ""}
                  >
                    {specialty.name}
                  </option>
                );
              })}
            </SelectField>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InputField
              label="تاريخ انتهاء العقد"
              type="date"
              value={formData.endcontract}
              error={errors.endcontract}
              disabled={
                createDoctorMutation.isPending ||
                updateDoctorMutation.isPending ||
                isLoadingData
              }
              min={getTodayISODate()}
              onChange={(event) =>
                setFormData({ ...formData, endcontract: event.target.value })
              }
            />

            <InputField
              label="نسبة الربح (%)"
              type="number"
              inputMode="decimal"
              min="0"
              max="100"
              step="1"
              value={formData.ratio}
              error={errors.ratio}
              disabled={
                createDoctorMutation.isPending ||
                updateDoctorMutation.isPending ||
                isLoadingData
              }
              placeholder="0 - 100"
              onChange={(event) =>
                setFormData({ ...formData, ratio: event.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
              type="submit"
              disabled={
                createDoctorMutation.isPending ||
                updateDoctorMutation.isPending ||
                isLoadingData
              }
              className="flex-1 cursor-pointer flex items-center justify-center gap-2 rounded-xl theme-accent px-5 py-3 font-bold theme-text-on-accent shadow-lg disabled:opacity-50"
            >
              {createDoctorMutation.isPending ||
              updateDoctorMutation.isPending ? (
                <>
                  <CircularProgress size={18} color="inherit" />
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <span>{editingDoctor ? "تعديل البيانات" : "حفظ الطبيب"}</span>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={
                createDoctorMutation.isPending ||
                updateDoctorMutation.isPending ||
                isLoadingData
              }
              className="flex-1 cursor-pointer rounded-xl theme-bg px-5 py-3 font-bold theme-text disabled:opacity-50"
            >
              إلغاء
            </button>
          </div>
        </form>
      </Motion.div>
    </div>
  );
};

const InputField = ({ label, error, className = "", ...props }) => (
  <div className="space-y-1 text-right">
    <label className="pr-1 text-xs font-bold theme-text-muted">{label}</label>
    <input
      {...props}
      className={`w-full rounded-xl border theme-bg px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-(--color-accent) ${error ? "border-red-500" : "theme-border"} ${className}`}
    />
    {error && <p className="pr-1 text-[10px] text-red-500">{error}</p>}
  </div>
);

const SelectField = ({ label, error, children, ...props }) => (
  <div className="space-y-1 text-right">
    <label className="pr-1 text-xs font-bold theme-text-muted">{label}</label>
    <select
      {...props}
      className={`w-full rounded-xl border theme-bg px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-(--color-accent) ${error ? "border-red-500" : "theme-border"}`}
    >
      {children}
    </select>
    {error && <p className="pr-1 text-[10px] text-red-500">{error}</p>}
  </div>
);

export default AddDoctorModal;
