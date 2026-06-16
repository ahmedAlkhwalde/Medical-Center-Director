import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../config/apiClient";

export const DOCTORS_QUERY_KEY = ["admin", "doctors"];

/**
 * 1. جلب قائمة الأطباء
 */
export const useDoctorsQuery = (specializationId) => {
  return useQuery({
    queryKey: specializationId ? [...DOCTORS_QUERY_KEY, specializationId] : DOCTORS_QUERY_KEY,
    queryFn: async () => {
      // بناء الـ params وإرسال الـ id فقط إذا كان مختاراً
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
  return useMutation({
    mutationFn: async (payload) => {
      const response = await apiClient.post("/admin/doctors", payload, {
        // headers: { "Content-Type": "application/json", "Accept": "application/json" }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCTORS_QUERY_KEY });
    },
  });
};

/**
 * 3. تعديل طبيب موجود (PUT)
 */
export const useUpdateDoctorMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ uuid, payload }) => {
      const response = await apiClient.put(`/admin/doctors/${uuid}`, payload, {
        headers: { "Content-Type": "application/json", "Accept": "application/json" }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCTORS_QUERY_KEY });
    },
  });
};

/**
 * 4. تغيير حالة تفعيل حساب الطبيب (PATCH)
 */
export const useUpdateDoctorStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ uuid, active }) => {
      const response = await apiClient.patch(`/admin/doctors/${uuid}/status`, { active }, {
        headers: { "Content-Type": "application/json", "Accept": "application/json" }
      });
      return response.data;
    },
    onSuccess: () => {
      // إعادة جلب البيانات تلقائياً ليعكس الجدول الكرت الحالة الجديدة فوراً
      queryClient.invalidateQueries({ queryKey: DOCTORS_QUERY_KEY });
    },
  });
};



export const useDoctorStatisticsQuery = (uuid, params = {}) => {
  return useQuery({
    queryKey: ['doctorStatistics', uuid, params],
    queryFn: async () => {
      const response = await apiClient.get(`/admin/statistics/doctor/${uuid}`, { params });
      return response.data;
    },
    enabled: !!uuid, // لا يستدعي إلا عند وجود uuid
  });
};