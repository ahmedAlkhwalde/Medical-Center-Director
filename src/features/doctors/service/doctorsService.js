import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import apiClient from "../../../config/apiClient";
import { showSnackbar } from "../../../features/uiSlice"; // تأكد من صحة المسار حسب مشروعك

export const DOCTORS_QUERY_KEY = ["admin", "doctors"];

/**
 * 1. جلب قائمة الأطباء
 */
export const useDoctorsQuery = (specializationId) => {
  return useQuery({
    queryKey: specializationId ? [...DOCTORS_QUERY_KEY, specializationId] : DOCTORS_QUERY_KEY,
    queryFn: async () => {
      const params = {};
      if (specializationId) {
        params.specialization_id = specializationId;
      }
      const response = await apiClient.get("/admin/doctors", { params });
      return response.data;
    },
  });
};

/**
 * 2. إضافة طبيب جديد
 */
export const useCreateDoctorMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (payload) => {
      const response = await apiClient.post("/admin/doctors", payload);
      
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: DOCTORS_QUERY_KEY });
      
      // عرض الرسالة القادمة من السيرفر أو الرسالة الافتراضية
      const successMessage = "تم إضافة الطبيب بنجاح!";
      dispatch(showSnackbar({ message: successMessage, variant: "success" }));
    },
    onError: (error) => {
      const errorMessage = error.response.data.message || "تعذر إضافة الطبيب.";
      dispatch(showSnackbar({ message: errorMessage, variant: "error" }));
    },
  });
};

/**
 * 3. تعديل طبيب موجود (PUT)
 */
export const useUpdateDoctorMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async ({ uuid, payload }) => {
      const response = await apiClient.put(`/admin/doctors/${uuid}`, payload, {
        headers: { "Content-Type": "application/json", "Accept": "application/json" }
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: DOCTORS_QUERY_KEY });

      // عرض الرسالة القادمة من السيرفر أو الرسالة الافتراضية
      const successMessage =  "تم تحديث البيانات بنجاح!";
      dispatch(showSnackbar({ message: successMessage, variant: "success" }));
    },
    onError: (error) => {
      const errorMessage = error.response.data.message || "حدث خطأ أثناء التحديث.";
      dispatch(showSnackbar({ message: errorMessage, variant: "error" }));
    },
  });
};

/**
 * 4. تغيير حالة تفعيل حساب الطبيب (PATCH)
 */
export const useUpdateDoctorStatusMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async ({ uuid, active }) => {
      const response = await apiClient.patch(`/admin/doctors/${uuid}/status`, { active }, {
        headers: { "Content-Type": "application/json", "Accept": "application/json" }
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: DOCTORS_QUERY_KEY });

      // إذا أرجع السيرفر رسالة نعتمدها، وإلا نصيغ رسالة بناءً على حالة الـ active المرسلة
      const fallbackMsg = variables.active === 1 
        ? "تم تفعيل حساب الطبيب بنجاح" 
        : "تم تعطيل حساب الطبيب بنجاح";
        
      const successMessage = fallbackMsg;
      dispatch(showSnackbar({ message: successMessage, variant: "success" }));
    },
    onError: (error) => {
      // const serverMessage = error?.response?.data?.message;
      const errorMessage = "حدث خطأ أثناء محاولة تعديل حالة الطبيب، يرجى المحاولة لاحقاً";
      dispatch(showSnackbar({ message: errorMessage, variant: "error" }));
    },
  });
};

/**
 * 5. إحصائيات الطبيب
 */
export const useDoctorStatisticsQuery = (uuid, params = {}) => {
  return useQuery({
    queryKey: ['doctorStatistics', uuid, params],
    queryFn: async () => {
      const response = await apiClient.get(`/admin/statistics/doctor/${uuid}`, { params });
      return response.data;
    },
    enabled: !!uuid,
  });
};