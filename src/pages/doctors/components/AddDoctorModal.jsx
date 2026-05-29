import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Close } from "@mui/icons-material";
import {
  closeModal,
  saveDoctor,
  CLINIC_OPTIONS,
} from "../../../features/doctors/doctorsSlice";
import { useSpecialtiesQuery } from "../../../service/specialtiesService";

const getTodayISODate = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60000).toISOString().slice(0, 10);
};

const isPastDate = (value) => value < getTodayISODate();

const createInitialFormData = (editingDoctor) => ({
  name: editingDoctor?.name || "",
  phone: editingDoctor?.phone || "",
  email: editingDoctor?.email || "",
  contractEndDate: editingDoctor?.contractEndDate || "",
  profitRate: editingDoctor?.profitRate ?? "",
  clinicId: editingDoctor?.clinicId ? String(editingDoctor.clinicId) : "",
  specialtyId: editingDoctor?.specialtyId
    ? String(editingDoctor.specialtyId)
    : "",
});

const AddDoctorModal = () => {
  const { isModalOpen, editingDoctor } = useSelector((state) => state.doctors);
  const dispatch = useDispatch();
  const { data: specialties = [] } = useSpecialtiesQuery();

  return (
    <AnimatePresence>
      {isModalOpen && (
        <ModalContent
          key={editingDoctor ? editingDoctor.id : "new"}
          editingDoctor={editingDoctor}
          specialties={specialties}
          onClose={() => dispatch(closeModal())}
          onSave={(formData) => dispatch(saveDoctor(formData))}
        />
      )}
    </AnimatePresence>
  );
};

const ModalContent = ({ editingDoctor, specialties, onClose, onSave }) => {
  const [formData, setFormData] = useState(() =>
    createInitialFormData(editingDoctor),
  );
  const [errors, setErrors] = useState({});

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

    if (!formData.contractEndDate) {
      newErrors.contractEndDate = "تاريخ انتهاء العقد مطلوب";
    } else if (isPastDate(formData.contractEndDate)) {
      newErrors.contractEndDate = "يجب أن يكون التاريخ اليوم أو في المستقبل";
    }

    const profitRate = Number(formData.profitRate);
    if (formData.profitRate === "") {
      newErrors.profitRate = "نسبة الربح مطلوبة";
    } else if (Number.isNaN(profitRate) || profitRate < 0 || profitRate > 100) {
      newErrors.profitRate = "نسبة الربح يجب أن تكون بين 0 و 100";
    }

    if (!formData.clinicId) {
      newErrors.clinicId = "رقم العيادة مطلوب";
    } else if (
      !CLINIC_OPTIONS.some(
        (clinic) => String(clinic.id) === String(formData.clinicId),
      )
    ) {
      newErrors.clinicId = "رقم العيادة يجب أن يكون ضمن القائمة";
    }

    if (!formData.specialtyId) {
      newErrors.specialtyId = "الاختصاص مطلوب";
    } else {
      const hasMatch = specialties.some((specialty) =>
        [specialty?.id, specialty?.legacyId, specialty?.uuid].some(
          (value) =>
            value != null && String(value) === String(formData.specialtyId),
        ),
      );
      if (!hasMatch) {
        newErrors.specialtyId = "الاختصاص يجب أن يكون ضمن القائمة";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-4">
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
              أدخل الاسم والاتصال والعقد والربط مع العيادة والاختصاص من القوائم.
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
              placeholder="doctor@shifa.com"
              onChange={(event) =>
                setFormData({ ...formData, email: event.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <SelectField
              label="رقم العيادة"
              value={formData.clinicId}
              error={errors.clinicId}
              onChange={(event) =>
                setFormData({ ...formData, clinicId: event.target.value })
              }
            >
              <option value="">اختر رقم العيادة</option>
              {CLINIC_OPTIONS.map((clinic) => (
                <option key={clinic.id} value={clinic.id}>
                  {clinic.label}
                </option>
              ))}
            </SelectField>

            <SelectField
              label="الاختصاص"
              value={formData.specialtyId}
              error={errors.specialtyId}
              onChange={(event) =>
                setFormData({ ...formData, specialtyId: event.target.value })
              }
            >
              <option value="">اختر الاختصاص</option>
              {specialties.map((specialty) => {
                const optionValue =
                  specialty.legacyId ?? specialty.id ?? specialty.uuid;
                return (
                  <option key={optionValue} value={optionValue}>
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
              value={formData.contractEndDate}
              error={errors.contractEndDate}
              min={getTodayISODate()}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  contractEndDate: event.target.value,
                })
              }
            />

            <InputField
              label="نسبة الربح (%)"
              type="number"
              inputMode="decimal"
              min="0"
              max="100"
              step="1"
              value={formData.profitRate}
              error={errors.profitRate}
              placeholder="0 - 100"
              onChange={(event) =>
                setFormData({ ...formData, profitRate: event.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
              type="submit"
              className="flex-1 cursor-pointer rounded-xl theme-accent px-5 py-3 font-bold theme-text-on-accent shadow-lg theme-shadow-accent"
            >
              {editingDoctor ? "تحديث البيانات" : "حفظ الطبيب"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 cursor-pointer rounded-xl theme-bg px-5 py-3 font-bold theme-text"
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
