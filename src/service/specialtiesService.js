// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import apiClient from "../config/apiClient";

// export const SPECIALTIES_QUERY_KEY = ["specialties"];
// const DEFAULT_STALE_TIME = 60 * 1000;

// const inferSpecialtyIcon = (name = "") => {
//   const normalizedName = name.toLowerCase();

//   if (normalizedName.includes("قلب")) return "MonitorHeart";
//   if (normalizedName.includes("أسنان") || normalizedName.includes("سن"))
//     return "DentalServices";
//   if (normalizedName.includes("أطفال") || normalizedName.includes("طفل"))
//     return "ChildCare";
//   if (normalizedName.includes("عيون") || normalizedName.includes("نظر"))
//     return "Visibility";
//   if (normalizedName.includes("نفس") || normalizedName.includes("عص"))
//     return "Psychology";
//   if (
//     normalizedName.includes("أذن") ||
//     normalizedName.includes("أنف") ||
//     normalizedName.includes("حنجرة")
//   )
//     return "Healing";
//   if (normalizedName.includes("عظام")) return "Accessibility";
//   if (
//     normalizedName.includes("نساء") ||
//     normalizedName.includes("ولادة") ||
//     normalizedName.includes("حمل")
//   )
//     return "ChildCare";
//   if (
//     normalizedName.includes("أشعة") ||
//     normalizedName.includes("تصوير") ||
//     normalizedName.includes("رنين")
//   )
//     return "Science";
//   if (
//     normalizedName.includes("مختبر") ||
//     normalizedName.includes("تحاليل") ||
//     normalizedName.includes("تحليل")
//   )
//     return "Vaccines";

//   return "MedicalServices";
// };

// const normalizeSpecialty = (item = {}) => {
//   const name =
//     item?.name ??
//     item?.specialization_name ??
//     item?.specialty_name ??
//     item?.title ??
//     "";
//   const price = item?.checkpaid ?? item?.price ?? item?.checkPaid ?? 0;
//   const followUpPrice =
//     item?.reviewpaid ?? item?.followUpPrice ?? item?.reviewPaid ?? 0;
//   const amount =
//     item?.amount ??
//     item?.total_amount ??
//     item?.totalAmount ??
//     0;
//   const appointmentsCount =
//     item?.appointments_count ??
//     item?.appointmentsCount ??
//     item?.appointments ??
//     0;
//   const uuid =
//     item?.uuid ??
//     item?.specialization_uuid ??
//     item?.specialty_uuid ??
//     null;
//   const legacyId =
//     item?.specialization_id ??
//     item?.specialty_id ??
//     (typeof item?.id === "number" ? item.id : null);
//   const id = uuid ?? item?.id ?? legacyId ?? item?._id ?? null;

//   return {
//     id,
//     uuid,
//     legacyId,
//     name,
//     price: Number(price) || 0,
//     followUpPrice: Number(followUpPrice) || 0,
//     amount: Number(amount) || 0,
//     appointmentsCount: Number(appointmentsCount) || 0,
//     icon: item?.icon ?? inferSpecialtyIcon(name),
//   };
// };

// const normalizeSpecialtiesList = (payload) => {
//   if (Array.isArray(payload)) return payload.map(normalizeSpecialty);
//   if (Array.isArray(payload?.data)) return payload.data.map(normalizeSpecialty);
//   if (Array.isArray(payload?.items))
//     return payload.items.map(normalizeSpecialty);
//   if (Array.isArray(payload?.results))
//     return payload.results.map(normalizeSpecialty);
//   return [];
// };

// const getSpecialtyKey = (item) => {
//   const key = item?.uuid ?? item?.id ?? item?.legacyId ?? item?._id ?? null;
//   return key != null ? String(key) : null;
// };

// const mergeSpecialtiesOrder = (previous = [], incoming = []) => {
//   const previousWithOrder = previous.map((item, index) => ({
//     ...item,
//     clientOrder: item?.clientOrder ?? index,
//   }));
//   const orderMap = new Map(
//     previousWithOrder
//       .map((item) => [getSpecialtyKey(item), item?.clientOrder])
//       .filter(([key]) => key != null),
//   );
//   const incomingKeys = new Set(
//     incoming.map((item) => getSpecialtyKey(item)).filter(Boolean),
//   );
//   let maxOrder = previousWithOrder.reduce(
//     (maxValue, item) =>
//       Math.max(maxValue, Number(item?.clientOrder ?? maxValue)),
//     -1,
//   );

//   const mergedIncoming = incoming.map((item) => {
//     const key = getSpecialtyKey(item);
//     const existingOrder = key ? orderMap.get(key) : undefined;
//     const clientOrder =
//       typeof existingOrder === "number" ? existingOrder : ++maxOrder;
//     return {
//       ...item,
//       clientOrder,
//       isOptimistic: false,
//     };
//   });

//   const optimisticLeftovers = previousWithOrder.filter(
//     (item) => item?.isOptimistic && !incomingKeys.has(getSpecialtyKey(item)),
//   );

//   return [...mergedIncoming, ...optimisticLeftovers].sort(
//     (a, b) => (a?.clientOrder ?? 0) - (b?.clientOrder ?? 0),
//   );
// };

// const applyPayloadToSpecialty = (specialty, payload) => {
//   const name = payload?.name ?? specialty.name;
//   const price =
//     payload?.checkpaid ?? payload?.price ?? specialty.price ?? 0;
//   const followUpPrice =
//     payload?.reviewpaid ?? payload?.followUpPrice ?? specialty.followUpPrice ?? 0;

//   return {
//     ...specialty,
//     name,
//     price: Number(price) || 0,
//     followUpPrice: Number(followUpPrice) || 0,
//     amount: Number(specialty?.amount) || 0,
//     appointmentsCount: Number(specialty?.appointmentsCount) || 0,
//     icon: inferSpecialtyIcon(name),
//   };
// };

// const mergeSpecialtyWithResponse = (specialty, payload, response, fallbackId) => {
//   const optimistic = applyPayloadToSpecialty(specialty, payload);

//   if (!response || typeof response !== "object") {
//     return optimistic;
//   }

//   const responseId =
//     response?.uuid ??
//     response?.id ??
//     response?.specialization_uuid ??
//     response?.specialty_uuid ??
//     response?.specialization_id ??
//     response?.specialty_id ??
//     fallbackId ??
//     optimistic.id;

//   const name = response?.name ?? optimistic.name;
//   const price = response?.checkpaid ?? response?.price ?? optimistic.price ?? 0;
//   const followUpPrice =
//     response?.reviewpaid ??
//     response?.followUpPrice ??
//     optimistic.followUpPrice ??
//     0;
//   const amount =
//     response?.amount ??
//     response?.total_amount ??
//     response?.totalAmount ??
//     optimistic.amount ??
//     0;
//   const appointmentsCount =
//     response?.appointments_count ??
//     response?.appointmentsCount ??
//     response?.appointments ??
//     optimistic.appointmentsCount ??
//     0;
//   const uuid =
//     response?.uuid ??
//     response?.specialization_uuid ??
//     response?.specialty_uuid ??
//     optimistic.uuid ??
//     null;
//   const legacyId =
//     response?.specialization_id ??
//     response?.specialty_id ??
//     optimistic.legacyId ??
//     (typeof response?.id === "number" ? response.id : null);

//   return {
//     ...optimistic,
//     id: responseId ?? optimistic.id,
//     uuid,
//     legacyId,
//     name,
//     price: Number(price) || 0,
//     followUpPrice: Number(followUpPrice) || 0,
//     amount: Number(amount) || 0,
//     appointmentsCount: Number(appointmentsCount) || 0,
//     icon: inferSpecialtyIcon(name),
//   };
// };

// const normalizeSingleResponse = (payload) => {
//   if (Array.isArray(payload)) return payload[0] ?? null;
//   return payload ?? null;
// };

// export const fetchSpecialties = async () => {
//   const response = await apiClient.get("/admin/specializations");
//   return normalizeSpecialtiesList(response.data);
// };

// export const useSpecialtiesQuery = (options = {}) => {
//   const queryClient = useQueryClient();
//   const { select: userSelect, ...rest } = options;

//   return useQuery({
//     queryKey: SPECIALTIES_QUERY_KEY,
//     queryFn: fetchSpecialties,
//     select: (data) => {
//       const previous =
//         queryClient.getQueryData(SPECIALTIES_QUERY_KEY) ?? [];
//       const merged = mergeSpecialtiesOrder(previous, data);
//       return userSelect ? userSelect(merged) : merged;
//     },
//     staleTime: DEFAULT_STALE_TIME,
//     ...rest,
//   });
// };

// export const createSpecialty = async (payload) => {
//   const response = await apiClient.post("/admin/specializations", payload);
//   return normalizeSingleResponse(response.data);
// };

// export const updateSpecialty = async ({ uuid, payload }) => {
//   const response = await apiClient.put(`/admin/specializations/${uuid}`, payload);
//   return normalizeSingleResponse(response.data);
// };

// export const deleteSpecialty = async (uuid) => {
//   const response = await apiClient.delete(`/admin/specializations/${uuid}`);
//   return response.data;
// };

// export const useCreateSpecialtyMutation = (options = {}) => {
//   const queryClient = useQueryClient();
//   const { onMutate, onSuccess, onError, onSettled, ...rest } = options;

//   return useMutation({
//     mutationFn: createSpecialty,
//     ...rest,
//     onMutate: async (variables) => {
//       await queryClient.cancelQueries({ queryKey: SPECIALTIES_QUERY_KEY });
//       const previous = queryClient.getQueryData(SPECIALTIES_QUERY_KEY) || [];
      
//       // 1. حساب أعلى ترتيب موجود حالياً في القائمة
//       const maxOrder = previous.reduce(
//         (maxValue, item) =>
//           Math.max(maxValue, Number(item?.clientOrder ?? maxValue)),
//         -1,
//       );
      
//       const tempId = `temp-${Date.now()}`;
//       const optimisticItem = normalizeSpecialty({
//         id: tempId,
//         name: variables?.name,
//         checkpaid: variables?.checkpaid,
//         reviewpaid: variables?.reviewpaid,
//       });
      
//       // 2. إعطاؤه الترتيب الأعلى ليكون الأخير برمجياً
//       optimisticItem.clientOrder = maxOrder + 1;
//       optimisticItem.isOptimistic = true;

//       // 3. التعديل الجوهري: دفعه صراحةً في نهاية المصفوفة السابقة ليرسمه الـ React فوراً في الأسفل
//       queryClient.setQueryData(SPECIALTIES_QUERY_KEY, [
//         ...previous,
//         optimisticItem,
//       ]);

//       const userContext = await onMutate?.(variables);
//       return { previous, tempId, ...userContext };
//     },
    
//     onSuccess: (data, variables, context) => {
//       const normalizedData = data && typeof data === "object" ? data : {};
      
//       queryClient.setQueryData(SPECIALTIES_QUERY_KEY, (old = []) =>
//         old.map((item) =>
//           String(item.id) === String(context?.tempId)
//             ? {
//                 ...normalizeSpecialty({
//                   ...normalizedData,
//                   id: normalizedData?.uuid ?? normalizedData?.id ?? context?.tempId,
//                 }),
//                 clientOrder: item.clientOrder, // الحفاظ على مكانه الأخير الذي حددناه في الـ onMutate
//                 isOptimistic: false,
//               }
//             : item,
//         ),
//       );

//       onSuccess?.(data, variables, context);
//     },
//     onError: (error, variables, context) => {
//       if (context?.previous) {
//         queryClient.setQueryData(SPECIALTIES_QUERY_KEY, context.previous);
//       }
//       onError?.(error, variables, context);
//     },
//     onSettled: (data, error, variables, context) => {
//       queryClient.invalidateQueries({ queryKey: SPECIALTIES_QUERY_KEY });
//       onSettled?.(data, error, variables, context);
//     },
//   });
// };

// export const useUpdateSpecialtyMutation = (options = {}) => {
//   const queryClient = useQueryClient();
//   const { onMutate, onSuccess, onError, onSettled, ...rest } = options;

//   return useMutation({
//     mutationFn: updateSpecialty,
//     ...rest,
//     onMutate: async (variables) => {
//       await queryClient.cancelQueries({ queryKey: SPECIALTIES_QUERY_KEY });
//       const previous = queryClient.getQueryData(SPECIALTIES_QUERY_KEY) || [];
//       const { id, payload } = variables || {};

//       if (id) {
//         queryClient.setQueryData(SPECIALTIES_QUERY_KEY, (old = []) =>
//           old.map((item) =>
//             String(item.id) === String(id)
//               ? {
//                   ...applyPayloadToSpecialty(item, payload),
//                   clientOrder: item?.clientOrder,
//                 }
//               : item,
//           ),
//         );
//       }

//       const userContext = await onMutate?.(variables);
//       return { previous, ...userContext };
//     },
//     onSuccess: (data, variables, context) => {
//       const responseData = data && typeof data === "object" ? data : null;
//       const targetId = variables?.id ? String(variables.id) : null;

//       if (targetId) {
//         queryClient.setQueryData(SPECIALTIES_QUERY_KEY, (old = []) =>
//           old.map((item) =>
//             String(item.id) === targetId
//               ? mergeSpecialtyWithResponse(
//                   item,
//                   variables?.payload,
//                   responseData,
//                   variables?.id,
//                 )
//               : item,
//           ),
//         );
//       }

//       onSuccess?.(data, variables, context);
//     },
//     onError: (error, variables, context) => {
//       if (context?.previous) {
//         queryClient.setQueryData(SPECIALTIES_QUERY_KEY, context.previous);
//       }
//       onError?.(error, variables, context);
//     },
//     onSettled: (data, error, variables, context) => {
//       queryClient.invalidateQueries({ queryKey: SPECIALTIES_QUERY_KEY });
//       onSettled?.(data, error, variables, context);
//     },
//   });
// };

// export const useDeleteSpecialtyMutation = (options = {}) => {
//   const queryClient = useQueryClient();
//   const { onMutate, onSuccess, onError, onSettled, ...rest } = options;

//   return useMutation({
//     mutationFn: deleteSpecialty,
//     ...rest,
//     onMutate: async (id) => {
//       await queryClient.cancelQueries({ queryKey: SPECIALTIES_QUERY_KEY });
//       const previous = queryClient.getQueryData(SPECIALTIES_QUERY_KEY) || [];

//       queryClient.setQueryData(SPECIALTIES_QUERY_KEY, (old = []) =>
//         old.filter((item) => String(item.id) !== String(id)),
//       );

//       const userContext = await onMutate?.(id);
//       return { previous, ...userContext };
//     },
//     onSuccess: (data, variables, context) => {
//       onSuccess?.(data, variables, context);
//     },
//     onError: (error, variables, context) => {
//       if (context?.previous) {
//         queryClient.setQueryData(SPECIALTIES_QUERY_KEY, context.previous);
//       }
//       onError?.(error, variables, context);
//     },
//     onSettled: (data, error, variables, context) => {
//       queryClient.invalidateQueries({ queryKey: SPECIALTIES_QUERY_KEY });
//       onSettled?.(data, error, variables, context);
//     },
//   });
// };

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

// دالة تطهير الحقول ومطابقتها مع متغيرات السيرفر المتنوعة (Snake & Camel Case)
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
  if (Array.isArray(payload?.items))
    return payload.items.map(normalizeSpecialty);
  if (Array.isArray(payload?.results))
    return payload.results.map(normalizeSpecialty);
  return [];
};

const normalizeSingleResponse = (payload) => {
  if (Array.isArray(payload)) return payload[0] ?? null;
  return payload ?? null;
};

// دالة مساعدة لتطبيق التحديث المتفائل على حقول عنصر التعديل
const applyPayloadToSpecialty = (specialty, payload) => {
  const name = payload?.name ?? specialty.name;
  const price =
    payload?.checkpaid ?? payload?.price ?? specialty.price ?? 0;
  const followUpPrice =
    payload?.reviewpaid ?? payload?.followUpPrice ?? specialty.followUpPrice ?? 0;

  return {
    ...specialty,
    name,
    price: Number(price) || 0,
    followUpPrice: Number(followUpPrice) || 0,
    amount: Number(specialty?.amount) || 0,
    appointmentsCount: Number(specialty?.appointmentsCount) || 0,
    icon: inferSpecialtyIcon(name),
  };
};

// ==========================================
// API Requests & React Query Hooks
// ==========================================

export const fetchSpecialties = async () => {
  const response = await apiClient.get("/admin/specializations");
  return normalizeSpecialtiesList(response.data);
};

export const useSpecialtiesQuery = (options = {}) => {
  const { select: userSelect, ...rest } = options;

  return useQuery({
    queryKey: SPECIALTIES_QUERY_KEY,
    queryFn: fetchSpecialties,
    // الاعتماد المباشر والصارم على ترتيب المصفوفة القادمة من السيرفر
    select: (data) => (userSelect ? userSelect(data) : data),
    staleTime: DEFAULT_STALE_TIME,
    ...rest,
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

// خطاف الإضافة المتفائلة - يضع العنصر الجديد مباشرةً في آخر المصفوفة المتاحة
export const useCreateSpecialtyMutation = (options = {}) => {
  const queryClient = useQueryClient();
  const { onMutate, onSuccess, onError, onSettled, ...rest } = options;

  return useMutation({
    mutationFn: createSpecialty,
    ...rest,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: SPECIALTIES_QUERY_KEY });
      const previous = queryClient.getQueryData(SPECIALTIES_QUERY_KEY) || [];
      
      const tempId = `temp-${Date.now()}`;
      const optimisticItem = normalizeSpecialty({
        id: tempId,
        name: variables?.name,
        checkpaid: variables?.checkpaid,
        reviewpaid: variables?.reviewpaid,
      });
      optimisticItem.isOptimistic = true;

      // تحديث الكاش الفوري: إلحاق العنصر الجديد بالكامل صراحةً في نهاية المصفوفة السابقة
      queryClient.setQueryData(SPECIALTIES_QUERY_KEY, [...previous, optimisticItem]);

      const userContext = await onMutate?.(variables);
      return { previous, tempId, ...userContext };
    },
    onSuccess: (data, variables, context) => {
      const normalizedData = data && typeof data === "object" ? data : {};
      
      queryClient.setQueryData(SPECIALTIES_QUERY_KEY, (old = []) =>
        old.map((item) =>
          String(item.id) === String(context?.tempId)
            ? {
                ...normalizeSpecialty({
                  ...normalizedData,
                  id: normalizedData?.uuid ?? normalizedData?.id ?? context?.tempId,
                }),
                isOptimistic: false,
              }
            : item
        )
      );

      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(SPECIALTIES_QUERY_KEY, context.previous);
      }
      onError?.(error, variables, context);
    },
    onSettled: (data, error, variables, context) => {
      // إجبار الكاش على إعادة المزامنة الكلية المحدثة من قاعدة البيانات
      queryClient.invalidateQueries({ queryKey: SPECIALTIES_QUERY_KEY });
      onSettled?.(data, error, variables, context);
    },
  });
};

export const useUpdateSpecialtyMutation = (options = {}) => {
  const queryClient = useQueryClient();
  const { onMutate, onSuccess, onError, onSettled, ...rest } = options;

  return useMutation({
    mutationFn: updateSpecialty,
    ...rest,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: SPECIALTIES_QUERY_KEY });
      const previous = queryClient.getQueryData(SPECIALTIES_QUERY_KEY) || [];
      const { id, payload } = variables || {};

      if (id) {
        queryClient.setQueryData(SPECIALTIES_QUERY_KEY, (old = []) =>
          old.map((item) =>
            String(item.id) === String(id)
              ? applyPayloadToSpecialty(item, payload)
              : item
          ),
        );
      }

      const userContext = await onMutate?.(variables);
      return { previous, ...userContext };
    },
    onSuccess: (data, variables, context) => {
      const responseData = data && typeof data === "object" ? data : null;
      const targetId = variables?.id ? String(variables.id) : null;

      if (targetId) {
        queryClient.setQueryData(SPECIALTIES_QUERY_KEY, (old = []) =>
          old.map((item) =>
            String(item.id) === targetId
              ? normalizeSpecialty(responseData ?? item)
              : item
          ),
        );
      }

      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(SPECIALTIES_QUERY_KEY, context.previous);
      }
      onError?.(error, variables, context);
    },
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries({ queryKey: SPECIALTIES_QUERY_KEY });
      onSettled?.(data, error, variables, context);
    },
  });
};

export const useDeleteSpecialtyMutation = (options = {}) => {
  const queryClient = useQueryClient();
  const { onMutate, onSuccess, onError, onSettled, ...rest } = options;

  return useMutation({
    mutationFn: deleteSpecialty,
    ...rest,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: SPECIALTIES_QUERY_KEY });
      const previous = queryClient.getQueryData(SPECIALTIES_QUERY_KEY) || [];

      queryClient.setQueryData(SPECIALTIES_QUERY_KEY, (old = []) =>
        old.filter((item) => String(item.id) !== String(id)),
      );

      const userContext = await onMutate?.(id);
      return { previous, ...userContext };
    },
    onSuccess: (data, variables, context) => {
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(SPECIALTIES_QUERY_KEY, context.previous);
      }
      onError?.(error, variables, context);
    },
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries({ queryKey: SPECIALTIES_QUERY_KEY });
      onSettled?.(data, error, variables, context);
    },
  });
};
