// import { useState, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { motion as Motion, AnimatePresence } from "framer-motion";
// import { Close } from "@mui/icons-material";
// import { CircularProgress } from "@mui/material"; // الـ Spinner الخاص بزر الحفظ
// import { closeModal } from "../../../features/doctors/doctorsSlice";
// import { useSpecialtiesQuery } from "../../../service/specialtiesService";
// import { useClinicsQuery } from "../../../service/clinicsService"; 
// import { useCreateDoctorMutation } from "../../../service/doctorsService";
// import { showSnackbar } from "../../../features/uiSlice"; // تأكد من استيراد دالة showSnackbar الخاصة بك من مسارها الصحيح في مشروعك


// // تأكد من استيراد دالة showSnackbar الخاصة بك من مسارها الصحيح في مشروعك
// // import { showSnackbar } from "../../../hooks/useSnackbar"; 

// const getTodayISODate = () => {
//   const now = new Date();
//   const offset = now.getTimezoneOffset();
//   return new Date(now.getTime() - offset * 60000).toISOString().slice(0, 10);
// };

// const isPastDate = (value) => value < getTodayISODate();

// const createInitialFormData = (editingDoctor) => ({
//   name: editingDoctor?.name || "",
//   phone: editingDoctor?.phone || "",
//   email: editingDoctor?.email || "",
//   endcontract: editingDoctor?.details?.contract_expiry || editingDoctor?.endcontract || "",
//   ratio: editingDoctor?.details?.ratio ? parseFloat(editingDoctor.details.ratio) : editingDoctor?.ratio ?? "",
//   clinic_id: editingDoctor?.clinic_id || editingDoctor?.clinic?.legacyId || editingDoctor?.clinic?.id || "",
//   specialization_id: editingDoctor?.specialization_id || editingDoctor?.specialization?.legacyId || editingDoctor?.specialization?.id || "",
// });

// const AddDoctorModal = () => {
//   const { isModalOpen, editingDoctor } = useSelector((state) => state.doctors);
//   const dispatch = useDispatch();
  
//   const { data: specialtiesData, isLoading: isLoadingSpecialties } = useSpecialtiesQuery();
//   const { data: clinicsQueryResult, isLoading: isLoadingClinics } = useClinicsQuery();
  
//   const createDoctorMutation = useCreateDoctorMutation();

//   const specialties = useMemo(() => {
//     if (!specialtiesData) return [];
//     return specialtiesData;
//   }, [specialtiesData]);

//   const clinics = useMemo(() => {
//     if (!clinicsQueryResult || !clinicsQueryResult.items) return [];
//     return clinicsQueryResult.items;
//   }, [clinicsQueryResult]);

//   return (
//     <AnimatePresence>
//       {isModalOpen && (
//         <ModalContent
//           key={editingDoctor ? editingDoctor.uuid : "new"}
//           editingDoctor={editingDoctor}
//           specialties={specialties}
//           clinics={clinics}
//           createDoctorMutation={createDoctorMutation}
//           isLoadingData={isLoadingClinics || isLoadingSpecialties}
//           onClose={() => dispatch(closeModal())}
//         />
//       )}
//     </AnimatePresence>
//   );
// };

// const ModalContent = ({ editingDoctor, specialties = [], clinics = [], createDoctorMutation, isLoadingData, onClose }) => {
//   const [formData, setFormData] = useState(() => createInitialFormData(editingDoctor));
//   const [errors, setErrors] = useState({});
//   const dispatch = useDispatch();

//   const validate = () => {
//     const newErrors = {};
//     const name = formData.name.trim();
//     const phone = formData.phone.trim();
//     const email = formData.email.trim();

//     if (!name) newErrors.name = "اسم الطبيب مطلوب";
//     if (!phone) newErrors.phone = "رقم الهاتف مطلوب";
//     else if (!/^[0-9+\-\s]{7,}$/.test(phone)) {
//       newErrors.phone = "رقم الهاتف غير صالح";
//     }

//     if (!email) newErrors.email = "البريد الإلكتروني مطلوب";
//     else if (!/^\S+@\S+\.\S+$/.test(email)) {
//       newErrors.email = "البريد الإلكتروني غير صالح";
//     }

//     if (!formData.endcontract) {
//       newErrors.endcontract = "تاريخ انتهاء العقد مطلوب";
//     } else if (isPastDate(formData.endcontract)) {
//       newErrors.endcontract = "يجب أن يكون التاريخ اليوم أو في المستقبل";
//     }

//     if (formData.ratio === "") {
//       newErrors.ratio = "نسبة الربح مطلوبة";
//     } else {
//       const ratioNum = Number(formData.ratio);
//       if (Number.isNaN(ratioNum) || ratioNum < 0 || ratioNum > 100) {
//         newErrors.ratio = "نسبة الربح يجب أن تكون بين 0 و 100";
//       }
//     }

//     if (!formData.clinic_id) {
//       newErrors.clinic_id = "العيادة مطلوبة";
//     }

//     if (!formData.specialization_id) {
//       newErrors.specialization_id = "الاختصاص مطلوب";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     if (!validate() || createDoctorMutation.isPending) return;

//     const payload = {
//       name: formData.name.trim(),
//       phone: formData.phone.trim(),
//       email: formData.email.trim(),
//       clinic_id: Number(formData.clinic_id),
//       specialization_id: Number(formData.specialization_id), 
//       endcontract: formData.endcontract, 
//       ratio: Number(formData.ratio),
//     };

//     if (editingDoctor) {
//       // هنا ميوتيشن التعديل لاحقاً
//     } else {
//       createDoctorMutation.mutate(payload, {
//         onSuccess: () => {
//           showSnackbar({
//             message: "تم إضافة الطبيب بنجاح وسحب البيانات!",
//             variant: "success"
//           });
          
//           dispatch(closeModal());
//         },
//         onError: (error) => {
//           // استدعاء الـ Custom Snackbar الخاص بك عند الفشل (دون إغلاق المودال)
//           showSnackbar({
//             message: "تعذر إضافة الطبيب حالياً، يرجى مراجعة الحقول المرفوضة.",
//             variant: "error"
//           });

//           if (error?.response?.data?.errors) {
//             const backendErrors = {};
//             Object.keys(error.response.data.errors).forEach((key) => {
//               backendErrors[key] = error.response.data.errors[key][0];
//             });
//             setErrors(backendErrors);
//           }
//         }
//       });
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-4">
//       <Motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         onClick={onClose}
//         className="absolute inset-0 theme-overlay backdrop-blur-sm"
//       />

//       <Motion.div
//         initial={{ scale: 0.9, opacity: 0, y: 20 }}
//         animate={{ scale: 1, opacity: 1, y: 0 }}
//         exit={{ scale: 0.9, opacity: 0, y: 20 }}
//         className="theme-surface relative z-10 w-full max-w-2xl rounded-3xl p-5 shadow-2xl sm:p-8"
//       >
//         <div className="mb-6 flex items-start justify-between gap-3">
//           <div className="text-right">
//             <h3 className="text-2xl font-bold theme-text">
//               {editingDoctor ? "تعديل بيانات الطبيب" : "إضافة طبيب جديد"}
//             </h3>
//             <p className="mt-1 text-sm theme-text-muted">
//               أدخل البيانات وسيتم ربط المعرفات الخاصة بالعيادة والاختصاص تلقائياً.
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={onClose}
//             className="rounded-xl p-2 theme-hover-surface theme-text-muted transition-colors"
//             aria-label="إغلاق النافذة"
//           >
//             <Close fontSize="small" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           <InputField
//             label="اسم الطبيب"
//             value={formData.name}
//             error={errors.name}
//             disabled={createDoctorMutation.isPending || isLoadingData}
//             placeholder="مثال: د. أحمد علي"
//             onChange={(event) => setFormData({ ...formData, name: event.target.value })}
//           />

//           <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//             <InputField
//               label="رقم الهاتف"
//               value={formData.phone}
//               error={errors.phone}
//               disabled={createDoctorMutation.isPending || isLoadingData}
//               placeholder="09xxxxxxxx"
//               onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
//             />

//             <InputField
//               label="البريد الإلكتروني"
//               type="email"
//               value={formData.email}
//               error={errors.email}
//               disabled={createDoctorMutation.isPending || isLoadingData}
//               placeholder="doctor@shifa.com"
//               onChange={(event) => setFormData({ ...formData, email: event.target.value })}
//             />
//           </div>

//           <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//             <SelectField
//               label="العيادة"
//               value={formData.clinic_id}
//               error={errors.clinic_id}
//               disabled={createDoctorMutation.isPending || isLoadingData}
//               onChange={(event) => setFormData({ ...formData, clinic_id: event.target.value })}
//             >
//               <option value="">اختر العيادة</option>
//               {clinics.map((clinic) => {
//                 const clinicId = clinic?.legacyId ?? clinic?.id;
//                 return (
//                   <option key={clinic.uuid || clinicId} value={String(clinicId)}>
//                     {clinic.clinicName}
//                   </option>
//                 );
//               })}
//             </SelectField>

//             <SelectField
//               label="الاختصاص"
//               value={formData.specialization_id}
//               error={errors.specialization_id}
//               disabled={createDoctorMutation.isPending || isLoadingData}
//               onChange={(event) => setFormData({ ...formData, specialization_id: event.target.value })}
//             >
//               <option value="">اختر الاختصاص</option>
//               {specialties.map((specialty) => {
//                 const specId = specialty?.legacyId ?? specialty?.id;
//                 return (
//                   <option key={specialty.uuid || specId} value={String(specId)}>
//                     {specialty.name}
//                   </option>
//                 );
//               })}
//             </SelectField>
//           </div>

//           <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//             <InputField
//               label="تاريخ انتهاء العقد"
//               type="date"
//               value={formData.endcontract}
//               error={errors.endcontract}
//               disabled={createDoctorMutation.isPending || isLoadingData}
//               min={getTodayISODate()}
//               onChange={(event) => setFormData({ ...formData, endcontract: event.target.value })}
//             />

//             <InputField
//               label="نسبة الربح (%)"
//               type="number"
//               inputMode="decimal"
//               min="0"
//               max="100"
//               step="1"
//               value={formData.ratio}
//               error={errors.ratio}
//               disabled={createDoctorMutation.isPending || isLoadingData}
//               placeholder="0 - 100"
//               onChange={(event) => setFormData({ ...formData, ratio: event.target.value })}
//             />
//           </div>

//           <div className="flex flex-col gap-3 pt-2 sm:flex-row">
//             <button
//               type="submit"
//               disabled={createDoctorMutation.isPending || isLoadingData}
//               className="flex-1 cursor-pointer flex items-center justify-center gap-2 rounded-xl theme-accent px-5 py-3 font-bold theme-text-on-accent shadow-lg disabled:opacity-50"
//             >
//               {createDoctorMutation.isPending ? (
//                 <>
//                   <CircularProgress size={18} color="inherit" />
//                   <span>جاري الحفظ...</span>
//                 </>
//               ) : (
//                 <span>حفظ الطبيب</span>
//               )}
//             </button>
//             <button
//               type="button"
//               onClick={onClose}
//               disabled={createDoctorMutation.isPending || isLoadingData}
//               className="flex-1 cursor-pointer rounded-xl theme-bg px-5 py-3 font-bold theme-text disabled:opacity-50"
//             >
//               إلغاء
//             </button>
//           </div>
//         </form>
//       </Motion.div>
//     </div>
//   );
// };

// const InputField = ({ label, error, className = "", ...props }) => (
//   <div className="space-y-1 text-right">
//     <label className="pr-1 text-xs font-bold theme-text-muted">{label}</label>
//     <input
//       {...props}
//       className={`w-full rounded-xl border theme-bg px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-(--color-accent) ${error ? "border-red-500" : "theme-border"} ${className}`}
//     />
//     {error && <p className="pr-1 text-[10px] text-red-500">{error}</p>}
//   </div>
// );

// const SelectField = ({ label, error, children, ...props }) => (
//   <div className="space-y-1 text-right">
//     <label className="pr-1 text-xs font-bold theme-text-muted">{label}</label>
//     <select
//       {...props}
//       className={`w-full rounded-xl border theme-bg px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-(--color-accent) ${error ? "border-red-500" : "theme-border"}`}
//     >
//       {children}
//     </select>
//     {error && <p className="pr-1 text-[10px] text-red-500">{error}</p>}
//   </div>
// );

// export default AddDoctorModal;
import { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../../features/secretaries/secretariesSlice";
import {
  useCreateSecretaryMutation,
  useUpdateSecretaryMutation,
} from "../../../service/secretariesService";

const createInitialFormData = (editingItem) => ({
  name: editingItem?.name || "",
  phone: editingItem?.phone || "",
  email: editingItem?.email || "",
  salary: editingItem?.salary ?? "",
});

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AddSecretaryModal = () => {
  const { isModalOpen, editingItem } = useSelector((state) => state.secretaries);
  const dispatch = useDispatch();

  return (
    <AnimatePresence>
      {isModalOpen && (
        <ModalContent
          key={editingItem ? editingItem.uuid : "new"}
          editingItem={editingItem}
          onClose={() => dispatch(closeModal())}
        />
      )}
    </AnimatePresence>
  );
};

const ModalContent = ({ editingItem, onClose }) => {
  const [formData, setFormData] = useState(() => createInitialFormData(editingItem));
  const [errors, setErrors] = useState({});

  const createSecretaryMutation = useCreateSecretaryMutation({
    onSuccess: () => onClose(),
  });
  
  const updateSecretaryMutation = useUpdateSecretaryMutation({
    onSuccess: () => onClose(),
  });

  const isSubmitting = createSecretaryMutation.isPending || updateSecretaryMutation.isPending;

  const validate = () => {
    const nextErrors = {};
    if (!formData.name.trim()) nextErrors.name = "اسم السكرتير مطلوب";
    if (!formData.phone.trim()) nextErrors.phone = "الرقم مطلوب";
    if (!emailPattern.test(formData.email.trim())) nextErrors.email = "البريد الإلكتروني غير صالح";
    if (!formData.salary || Number(formData.salary) <= 0) nextErrors.salary = "الراتب يجب أن يكون أكبر من 0";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate() || isSubmitting) return;

    // البيانات الأساسية المنظفة من الفورم
    const currentName = formData.name.trim();
    const currentEmail = formData.email.trim();
    const currentPhone = formData.phone.trim();
    const currentSalary = Number(formData.salary) || 0;

    // حالة التعديل: إرسال المتغيرات فقط (Diff Check)
    if (editingItem) {
      const changedPayload = {};

      if (currentName !== editingItem.name) {
        changedPayload.name = currentName;
      }
      if (currentEmail !== editingItem.email) {
        changedPayload.email = currentEmail;
      }
      // المقارنة مع الحقل القادم الموحد في الفرونت إند (phone)
      if (currentPhone !== editingItem.phone) {
        changedPayload.number = currentPhone; // الباك إند يتوقع اسم number
      }
      if (currentSalary !== editingItem.salary) {
        changedPayload.salary = currentSalary;
      }

      // 💡 إذا لم يقم المستخدم بتعديل أي شيء مطلقاً وضغط حفظ، نغلق المودال مباشرة دون إرهاق السيرفر بطلب فارغ
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

    // حالة الإضافة الجديدة: نرسل الـ body كاملاً وبشكل طبيعي
    const fullPayload = {
      name: currentName,
      email: currentEmail,
      number: currentPhone,
      salary: currentSalary,
    };
    createSecretaryMutation.mutate(fullPayload);
  };

  return (
    <div className="fixed inset-0 z-10000 flex items-center justify-center p-3 sm:p-4">
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => !isSubmitting && onClose()}
        className="absolute inset-0 theme-overlay backdrop-blur-sm"
      />
      <Motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 w-full max-w-xl rounded-3xl p-5 shadow-2xl theme-surface sm:p-8"
      >
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onClose}
          className="absolute left-4 top-4 rounded-full p-2 theme-text-muted theme-hover-surface disabled:opacity-50"
        >
          <Close fontSize="small" />
        </button>

        <h3 className="mb-6 text-2xl font-bold theme-text">
          {editingItem ? "تعديل بيانات السكرتير" : "إضافة سكرتير جديد"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="اسم السكرتير"
            value={formData.name}
            error={errors.name}
            placeholder="مثال: سارة محمود"
            disabled={isSubmitting}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField
              label="رقم الهاتف"
              type="tel"
              value={formData.phone}
              error={errors.phone}
              placeholder="مثال: 0933-111-222"
              disabled={isSubmitting}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <InputField
              label="البريد الإلكتروني"
              type="email"
              value={formData.email}
              error={errors.email}
              placeholder="مثال: name@example.com"
              disabled={isSubmitting}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <InputField
            label="الراتب الشهري"
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            value={formData.salary}
            error={errors.salary}
            placeholder="مثال: 8500000"
            disabled={isSubmitting}
            onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
          />

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex flex-1 items-center justify-center gap-2 cursor-pointer rounded-xl py-3 font-bold shadow-lg theme-accent theme-shadow-accent theme-text-on-accent disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 theme-text-on-accent" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>جاري الحفظ...</span>
                </>
              ) : editingItem ? (
                "تحديث البيانات"
              ) : (
                "حفظ السكرتير"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 cursor-pointer rounded-xl py-3 font-bold theme-bg theme-text disabled:opacity-50"
            >
              إلغاء
            </button>
          </div>
        </form>
      </Motion.div>
    </div>
  );
};

const InputField = ({ label, error, ...props }) => (
  <div className="space-y-1 text-right">
    <label className="pr-1 text-xs font-bold theme-text-muted">{label}</label>
    <input
      {...props}
      className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all theme-bg focus:ring-2 focus:ring-(--color-accent) ${
        error ? "border-red-500" : "theme-border"
      }`}
    />
    {error && <p className="pr-1 text-[10px] text-red-500">{error}</p>}
  </div>
);

export default AddSecretaryModal;