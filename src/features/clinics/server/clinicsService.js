import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import apiClient from "../../../config/apiClient";
import { showSnackbar } from "../../uiSlice"; // تأكد من صحة المسار بالنسبة لملف الخدمة

export const CLINICS_QUERY_KEY = ["clinics"];
const DEFAULT_STALE_TIME = 60 * 1000;

const normalizeClinic = (item = {}) => {
  const clinicName = item?.name ?? item?.clinicName ?? item?.clinic_name ?? item?.title ?? "";
  const address = item?.address ?? item?.clinic_address ?? item?.location ?? "";
  const doctorsCount = item?.doctors_count ?? item?.doctorsCount ?? item?.doctors ?? 0;
  const appointmentsCount = item?.appointments_count ?? item?.appointmentsCount ?? item?.appointments ?? 0;
  
  const uuid = item?.uuid ?? item?.clinic_uuid ?? null;
  const legacyId = item?.clinic_id ?? (typeof item?.id === "number" ? item.id : null);
  const id = uuid ?? item?.id ?? legacyId ?? null;

  return {
    id,
    uuid,
    legacyId,
    clinicName,
    address,
    doctorsCount: Number(doctorsCount) || 0,
    appointmentsCount: Number(appointmentsCount) || 0,
  };
};

const normalizeClinicsResponse = (payload) => {
  const data = payload?.data ?? payload;
  const itemsRaw = Array.isArray(data) ? data : (data?.list ?? data?.items ?? data?.clinics ?? []);
  
  const items = itemsRaw.map(normalizeClinic);

  const statsSource = payload?.stats ?? payload?.statistics ?? {};
  const stats = {
    total_clinics_count: statsSource?.total_clinics_count ?? items.length,
    most_busy_clinic: statsSource?.most_busy_clinic ?? "",
    least_busy_clinic: statsSource?.least_busy_clinic ?? "",
    avg_doctors_per_clinic: statsSource?.avg_doctors_per_clinic ?? null,
  };

  return { items, stats };
};

// ==========================================
// طلبات الـ API
// ==========================================

export const fetchClinics = async () => {
  const response = await apiClient.get("/admin/clinics");
  return normalizeClinicsResponse(response.data);
};

export const useClinicsQuery = (options = {}) => {
  const { select: userSelect, ...rest } = options;

  return useQuery({
    queryKey: CLINICS_QUERY_KEY,
    queryFn: fetchClinics,
    select: (data) => (userSelect ? userSelect(data) : data),
    staleTime: DEFAULT_STALE_TIME,
    ...rest,
  });
};

export const createClinic = async (payload) => {
  const response = await apiClient.post("/admin/clinics", payload);
  return response.data;
};

export const updateClinic = async ({ uuid, payload }) => {
  const response = await apiClient.put(`/admin/clinics/${uuid}`, payload);
  return response.data;
};

export const deleteClinic = async (uuid) => {
  const response = await apiClient.delete(`/admin/clinics/${uuid}`);
  return response.data;
};

// ==========================================
// خطافات الـ Mutations (تضم معالجة الـ Snackbar)
// ==========================================

export const useCreateClinicMutation = (options = {}) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { onSuccess, onError, onSettled, ...rest } = options;

  return useMutation({
    mutationFn: createClinic,
    ...rest,
    onSuccess: (data, variables, context) => {
      dispatch(
        showSnackbar({
          message: "تمت إضافة العيادة بنجاح",
          variant: "success",
        }),
      );
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      dispatch(
        showSnackbar({
          message: "تعذر إضافة العيادة حالياً",
          variant: "error",
        }),
      );
      onError?.(error, variables, context);
    },
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries({ queryKey: CLINICS_QUERY_KEY });
      onSettled?.(data, error, variables, context);
    },
  });
};

export const useUpdateClinicMutation = (options = {}) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { onSuccess, onError, onSettled, ...rest } = options;

  return useMutation({
    mutationFn: updateClinic,
    ...rest,
    onSuccess: (data, variables, context) => {
      dispatch(
        showSnackbar({
          message: "تم تحديث العيادة بنجاح",
          variant: "success",
        }),
      );
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      dispatch(
        showSnackbar({
          message: "تعذر تحديث العيادة حالياً",
          variant: "error",
        }),
      );
      onError?.(error, variables, context);
    },
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries({ queryKey: CLINICS_QUERY_KEY });
      onSettled?.(data, error, variables, context);
    },
  });
};

export const useDeleteClinicMutation = (options = {}) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { onSuccess, onError, onSettled, ...rest } = options;

  return useMutation({
    mutationFn: deleteClinic,
    ...rest,
    onSuccess: (data, variables, context) => {
      dispatch(
        showSnackbar({
          message: "تم حذف العيادة بنجاح",
          variant: "success",
        }),
      );
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      dispatch(
        showSnackbar({
          message: "تعذر حذف العيادة حالياً، يرجى المحاولة مرة أخرى",
          variant: "error",
        }),
      );
      onError?.(error, variables, context);
    },
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries({ queryKey: CLINICS_QUERY_KEY });
      onSettled?.(data, error, variables, context);
    },
  });
};