import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../config/apiClient";

export const SPECIALTIES_QUERY_KEY = ["specialties"];
const DEFAULT_STALE_TIME = 60 * 1000;

// دالة التخمين الذكي للأيقونات بناءً على الاسم العربي
const inferSpecialtyIcon = (name = "") => {
  const normalizedName = name.toLowerCase();

  if (normalizedName.includes("قلب")) return "MonitorHeart";
  if (normalizedName.includes("أسنان") || normalizedName.includes("سن"))
    return "DentalServices";
  if (normalizedName.includes("أطفال") || normalizedName.includes("طفل"))
    return "ChildCare";
  if (normalizedName.includes("عيون") || normalizedName.includes("نظر"))
    return "Visibility";
  if (normalizedName.includes("نفس") || normalizedName.includes("عص"))
    return "Psychology";
  if (
    normalizedName.includes("أذن") ||
    normalizedName.includes("أنف") ||
    normalizedName.includes("حنجرة")
  )
    return "Healing";
  if (normalizedName.includes("عظام")) return "Accessibility";
  if (
    normalizedName.includes("نساء") ||
    normalizedName.includes("ولادة") ||
    normalizedName.includes("حمل")
  )
    return "ChildCare";
  if (
    normalizedName.includes("أشعة") ||
    normalizedName.includes("تصوير") ||
    normalizedName.includes("رنين")
  )
    return "Science";
  if (
    normalizedName.includes("مختبر") ||
    normalizedName.includes("تحاليل") ||
    normalizedName.includes("تحليل")
  )
    return "Vaccines";

  return "MedicalServices";
};

// دالة تطهير الحقول ومطابقتها مع متغيرات السيرفر المتنوعة
const normalizeSpecialty = (item = {}) => {
  const name =
    item?.name ??
    item?.specialization_name ??
    item?.specialty_name ??
    item?.title ??
    "";
  const price = item?.checkpaid ?? item?.price ?? item?.checkPaid ?? 0;
  const followUpPrice =
    item?.reviewpaid ?? item?.followUpPrice ?? item?.reviewPaid ?? 0;
  const amount =
    item?.amount ??
    item?.total_amount ??
    item?.totalAmount ??
    0;
  const appointmentsCount =
    item?.appointments_count ??
    item?.appointmentsCount ??
    item?.appointments ??
    0;
  const uuid =
    item?.uuid ??
    item?.specialization_uuid ??
    item?.specialty_uuid ??
    null;
  const legacyId =
    item?.specialization_id ??
    item?.specialty_id ??
    (typeof item?.id === "number" ? item.id : null);
  const id = uuid ?? item?.id ?? legacyId ?? item?._id ?? null;

  return {
    id,
    uuid,
    legacyId,
    name,
    price: Number(price) || 0,
    followUpPrice: Number(followUpPrice) || 0,
    amount: Number(amount) || 0,
    appointmentsCount: Number(appointmentsCount) || 0,
    icon: item?.icon ?? inferSpecialtyIcon(name),
  };
};

// تحويل القوائم والمصفوفات القادمة من السيرفر
const normalizeSpecialtiesList = (payload) => {
  if (Array.isArray(payload)) return payload.map(normalizeSpecialty);
  if (Array.isArray(payload?.data)) return payload.data.map(normalizeSpecialty);
  if (Array.isArray(payload?.items)) return payload.items.map(normalizeSpecialty);
  if (Array.isArray(payload?.results)) return payload.results.map(normalizeSpecialty);
  return [];
};

const normalizeSingleResponse = (payload) => {
  if (Array.isArray(payload)) return payload[0] ?? null;
  return payload ?? null;
};

// ==========================================
// API Requests & React Query Hooks
// ==========================================

export const fetchSpecialties = async () => {
  const response = await apiClient.get("/admin/specializations");
  return normalizeSpecialtiesList(response.data);
};

export const useSpecialtiesQuery = (options = {}) => {
  return useQuery({
    queryKey: SPECIALTIES_QUERY_KEY,
    queryFn: fetchSpecialties,
    select: (data) => data,
    staleTime: DEFAULT_STALE_TIME,
    ...options,
  });
};

export const createSpecialty = async (payload) => {
  const response = await apiClient.post("/admin/specializations", payload);
  return normalizeSingleResponse(response.data);
};

export const updateSpecialty = async ({ uuid, payload }) => {
  const response = await apiClient.put(`/admin/specializations/${uuid}`, payload);
  return normalizeSingleResponse(response.data);
};

export const deleteSpecialty = async (uuid) => {
  const response = await apiClient.delete(`/admin/specializations/${uuid}`);
  return response.data;
};

// 1. خطاف إضافة اختصاص جديد (يعتمد بالكامل على استجابة السيرفر وتحديث الكاش)
export const useCreateSpecialtyMutation = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSpecialty,
    ...options,
    onSuccess: (data, variables, context) => {
      const newSpecialty = normalizeSpecialty(data ?? variables);

      queryClient.setQueryData(SPECIALTIES_QUERY_KEY, (old = []) => {
        return [...old, newSpecialty];
      });

      queryClient.invalidateQueries({ queryKey: SPECIALTIES_QUERY_KEY });
      options.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      options.onError?.(error, variables, context);
    },
  });
};

// 2. خطاف تعديل الاختصاص
export const useUpdateSpecialtyMutation = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSpecialty,
    ...options,
    onSuccess: (data, variables, context) => {
      if (data) {
        const updated = normalizeSpecialty(data);
        queryClient.setQueryData(SPECIALTIES_QUERY_KEY, (old = []) =>
          old.map((item) => (item.uuid === variables.uuid ? updated : item))
        );
      }
      queryClient.invalidateQueries({ queryKey: SPECIALTIES_QUERY_KEY });
      options.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      options.onError?.(error, variables, context);
    },
  });
};

// 3. خطاف حذف الاختصاص
export const useDeleteSpecialtyMutation = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSpecialty,
    ...options,
    onMutate: async (uuid) => {
      await queryClient.cancelQueries({ queryKey: SPECIALTIES_QUERY_KEY });
      const previous = queryClient.getQueryData(SPECIALTIES_QUERY_KEY) || [];

      queryClient.setQueryData(SPECIALTIES_QUERY_KEY, (old = []) =>
        old.filter((item) => item.uuid !== uuid)
      );

      return { previous };
    },
    onError: (error, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(SPECIALTIES_QUERY_KEY, context.previous);
      }
      options.onError?.(error, variables, context);
    },
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries({ queryKey: SPECIALTIES_QUERY_KEY });
      options.onSettled?.(data, error, variables, context);
    },
  });
};