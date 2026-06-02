// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import apiClient from "../config/apiClient";

// export const CLINICS_QUERY_KEY = ["clinics"];
// const DEFAULT_STALE_TIME = 60 * 1000;

// const normalizeClinic = (item = {}) => {
//   const clinicName =
//     item?.clinicName ??
//     item?.clinic_name ??
//     item?.name ??
//     item?.title ??
//     "";
//   const address =
//     item?.address ??
//     item?.clinic_address ??
//     item?.location ??
//     "";
//   const doctorsCount =
//     item?.doctors_count ??
//     item?.doctorsCount ??
//     item?.doctors ??
//     0;
//   const appointmentsCount =
//     item?.appointments_count ??
//     item?.appointmentsCount ??
//     item?.appointments ??
//     0;
//   const uuid = item?.uuid ?? item?.clinic_uuid ?? null;
//   const legacyId =
//     item?.clinic_id ?? (typeof item?.id === "number" ? item.id : null);
//   const id = uuid ?? item?.id ?? legacyId ?? item?._id ?? null;

//   return {
//     id,
//     uuid,
//     legacyId,
//     clinicName,
//     address,
//     doctorsCount: Number(doctorsCount) || 0,
//     appointmentsCount: Number(appointmentsCount) || 0,
//   };
// };

// const normalizeClinicsResponse = (payload) => {
//   const data = payload?.data ?? payload;
//   const itemsRaw =
//     data?.list ??
//     data?.items ??
//     data?.clinics ??
//     data?.results ??
//     data;
//   const items = Array.isArray(itemsRaw) ? itemsRaw.map(normalizeClinic) : [];

//   const statsSource = data?.stats ?? data ?? {};
//   const stats = {
//     total_clinics_count:
//       statsSource?.total_clinics_count ?? items.length,
//     most_busy_clinic:
//       statsSource?.most_busy_clinic ?? "",
//     avg_doctors_per_clinic:
//       statsSource?.avg_doctors_per_clinic ?? null,
//   };

//   return { items, stats };
// };

// const normalizeSingleResponse = (payload) => {
//   if (Array.isArray(payload)) return payload[0] ?? null;
//   return payload ?? null;
// };

// const getClinicKey = (item) => {
//   const key = item?.uuid ?? item?.id ?? item?.legacyId ?? item?._id ?? null;
//   return key != null ? String(key) : null;
// };

// const mergeClinicsOrder = (previous = [], incoming = []) => {
//   const previousWithOrder = previous.map((item, index) => ({
//     ...item,
//     clientOrder: item?.clientOrder ?? index,
//   }));
//   const orderMap = new Map(
//     previousWithOrder
//       .map((item) => [getClinicKey(item), item?.clientOrder])
//       .filter(([key]) => key != null),
//   );
//   const incomingKeys = new Set(
//     incoming.map((item) => getClinicKey(item)).filter(Boolean),
//   );
//   let maxOrder = previousWithOrder.reduce(
//     (maxValue, item) =>
//       Math.max(maxValue, Number(item?.clientOrder ?? maxValue)),
//     -1,
//   );

//   const mergedIncoming = incoming.map((item) => {
//     const key = getClinicKey(item);
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
//     (item) => item?.isOptimistic && !incomingKeys.has(getClinicKey(item)),
//   );

//   return [...mergedIncoming, ...optimisticLeftovers].sort(
//     (a, b) => (a?.clientOrder ?? 0) - (b?.clientOrder ?? 0),
//   );
// };

// const mergeClinicsResponse = (previousData, incomingData) => {
//   const previousItems = previousData?.items ?? [];
//   const incomingItems = incomingData?.items ?? [];
//   const mergedItems = mergeClinicsOrder(previousItems, incomingItems);
//   const stats = incomingData?.stats ?? previousData?.stats ?? {};

//   return { items: mergedItems, stats };
// };

// const applyPayloadToClinic = (clinic, payload) => {
//   const clinicName = payload?.clinicName ?? payload?.name ?? clinic.clinicName;
//   const address = payload?.address ?? clinic.address;

//   return {
//     ...clinic,
//     clinicName,
//     address,
//   };
// };

// const mergeClinicWithResponse = (clinic, payload, response, fallbackId) => {
//   const optimistic = applyPayloadToClinic(clinic, payload);

//   if (!response || typeof response !== "object") {
//     return optimistic;
//   }

//   const responseId =
//     response?.uuid ??
//     response?.id ??
//     response?.clinic_uuid ??
//     response?.clinic_id ??
//     fallbackId ??
//     optimistic.id;

//   const clinicName =
//     response?.clinicName ??
//     response?.clinic_name ??
//     response?.name ??
//     optimistic.clinicName;
//   const address = response?.address ?? response?.clinic_address ?? optimistic.address;
//   const doctorsCount =
//     response?.doctors_count ??
//     response?.doctorsCount ??
//     response?.doctors ??
//     optimistic.doctorsCount ??
//     0;
//   const appointmentsCount =
//     response?.appointments_count ??
//     response?.appointmentsCount ??
//     response?.appointments ??
//     optimistic.appointmentsCount ??
//     0;
//   const uuid = response?.uuid ?? response?.clinic_uuid ?? optimistic.uuid ?? null;
//   const legacyId =
//     response?.clinic_id ??
//     optimistic.legacyId ??
//     (typeof response?.id === "number" ? response.id : null);

//   return {
//     ...optimistic,
//     id: responseId ?? optimistic.id,
//     uuid,
//     legacyId,
//     clinicName,
//     address,
//     doctorsCount: Number(doctorsCount) || 0,
//     appointmentsCount: Number(appointmentsCount) || 0,
//   };
// };

// export const fetchClinics = async () => {
//   const response = await apiClient.get("/admin/clinics");
//   return normalizeClinicsResponse(response.data);
// };

// export const useClinicsQuery = (options = {}) => {
//   const queryClient = useQueryClient();
//   const { select: userSelect, ...rest } = options;

//   return useQuery({
//     queryKey: CLINICS_QUERY_KEY,
//     queryFn: fetchClinics,
//     select: (data) => {
//       const previous = queryClient.getQueryData(CLINICS_QUERY_KEY) ?? {
//         items: [],
//         stats: {},
//       };
//       const merged = mergeClinicsResponse(previous, data);
//       return userSelect ? userSelect(merged) : merged;
//     },
//     staleTime: DEFAULT_STALE_TIME,
//     ...rest,
//   });
// };

// export const createClinic = async (payload) => {
//   const response = await apiClient.post("/admin/clinics", payload);
//   return normalizeSingleResponse(response.data);
// };

// export const updateClinic = async ({ id, payload }) => {
//   const response = await apiClient.put(`/admin/clinics/${id}`, payload);
//   return normalizeSingleResponse(response.data);
// };

// export const deleteClinic = async (id) => {
//   const response = await apiClient.delete(`/admin/clinics/${id}`);
//   return response.data;
// };

// export const useCreateClinicMutation = (options = {}) => {
//   const queryClient = useQueryClient();
//   const { onMutate, onSuccess, onError, onSettled, ...rest } = options;

//   return useMutation({
//     mutationFn: createClinic,
//     ...rest,
//     onMutate: async (variables) => {
//       await queryClient.cancelQueries({ queryKey: CLINICS_QUERY_KEY });
//       const previous = queryClient.getQueryData(CLINICS_QUERY_KEY) ?? {
//         items: [],
//         stats: {},
//       };
//       const maxOrder = previous.items.reduce(
//         (maxValue, item) =>
//           Math.max(maxValue, Number(item?.clientOrder ?? maxValue)),
//         -1,
//       );
//       const tempId = `temp-${Date.now()}`;
//       const optimisticItem = normalizeClinic({
//         id: tempId,
//         clinicName: variables?.clinicName ?? variables?.name ?? "",
//         address: variables?.address ?? "",
//         doctors_count: variables?.doctors_count,
//         appointments_count: variables?.appointments_count,
//       });
//       optimisticItem.clientOrder = maxOrder + 1;
//       optimisticItem.isOptimistic = true;

//       queryClient.setQueryData(CLINICS_QUERY_KEY, {
//         ...previous,
//         items: [...previous.items, optimisticItem],
//       });

//       const userContext = await onMutate?.(variables);
//       return { previous, tempId, ...userContext };
//     },
//     onSuccess: (data, variables, context) => {
//       const normalizedData = data && typeof data === "object" ? data : {};
//       const hasRealId = Boolean(
//         normalizedData?.uuid ??
//           normalizedData?.clinic_uuid ??
//           normalizedData?.id ??
//           normalizedData?.clinic_id,
//       );
//       const savedItem = normalizeClinic({
//         ...normalizedData,
//         id:
//           normalizedData?.uuid ??
//           normalizedData?.id ??
//           normalizedData?.clinic_uuid ??
//           normalizedData?.clinic_id ??
//           context?.tempId,
//         clinicName:
//           normalizedData?.clinicName ??
//           normalizedData?.clinic_name ??
//           normalizedData?.name ??
//           variables?.clinicName ??
//           variables?.name,
//         address: normalizedData?.address ?? variables?.address,
//       });

//       queryClient.setQueryData(CLINICS_QUERY_KEY, (old) => {
//         const snapshot = old ?? { items: [], stats: {} };
//         return {
//           ...snapshot,
//           items: snapshot.items.map((item) =>
//             item.id === context?.tempId
//               ? {
//                   ...savedItem,
//                   clientOrder: item?.clientOrder ?? savedItem.clientOrder,
//                   isOptimistic: !hasRealId,
//                 }
//               : item,
//           ),
//         };
//       });

//       onSuccess?.(data, variables, context);
//     },
//     onError: (error, variables, context) => {
//       if (context?.previous) {
//         queryClient.setQueryData(CLINICS_QUERY_KEY, context.previous);
//       }
//       onError?.(error, variables, context);
//     },
//     onSettled: (data, error, variables, context) => {
//       queryClient.invalidateQueries({ queryKey: CLINICS_QUERY_KEY });
//       onSettled?.(data, error, variables, context);
//     },
//   });
// };

// export const useUpdateClinicMutation = (options = {}) => {
//   const queryClient = useQueryClient();
//   const { onMutate, onSuccess, onError, onSettled, ...rest } = options;

//   return useMutation({
//     mutationFn: updateClinic,
//     ...rest,
//     onMutate: async (variables) => {
//       await queryClient.cancelQueries({ queryKey: CLINICS_QUERY_KEY });
//       const previous = queryClient.getQueryData(CLINICS_QUERY_KEY) ?? {
//         items: [],
//         stats: {},
//       };
//       const { id, payload } = variables || {};

//       if (id) {
//         queryClient.setQueryData(CLINICS_QUERY_KEY, (old) => {
//           const snapshot = old ?? { items: [], stats: {} };
//           return {
//             ...snapshot,
//             items: snapshot.items.map((item) =>
//               String(item.id) === String(id)
//                 ? {
//                     ...applyPayloadToClinic(item, payload),
//                     clientOrder: item?.clientOrder,
//                   }
//                 : item,
//             ),
//           };
//         });
//       }

//       const userContext = await onMutate?.(variables);
//       return { previous, ...userContext };
//     },
//     onSuccess: (data, variables, context) => {
//       const responseData = data && typeof data === "object" ? data : null;
//       const targetId = variables?.id ? String(variables.id) : null;

//       if (targetId) {
//         queryClient.setQueryData(CLINICS_QUERY_KEY, (old) => {
//           const snapshot = old ?? { items: [], stats: {} };
//           return {
//             ...snapshot,
//             items: snapshot.items.map((item) =>
//               String(item.id) === targetId
//                 ? mergeClinicWithResponse(
//                     item,
//                     variables?.payload,
//                     responseData,
//                     variables?.id,
//                   )
//                 : item,
//             ),
//           };
//         });
//       }

//       onSuccess?.(data, variables, context);
//     },
//     onError: (error, variables, context) => {
//       if (context?.previous) {
//         queryClient.setQueryData(CLINICS_QUERY_KEY, context.previous);
//       }
//       onError?.(error, variables, context);
//     },
//     onSettled: (data, error, variables, context) => {
//       queryClient.invalidateQueries({ queryKey: CLINICS_QUERY_KEY });
//       onSettled?.(data, error, variables, context);
//     },
//   });
// };

// export const useDeleteClinicMutation = (options = {}) => {
//   const queryClient = useQueryClient();
//   const { onMutate, onSuccess, onError, onSettled, ...rest } = options;

//   return useMutation({
//     mutationFn: deleteClinic,
//     ...rest,
//     onMutate: async (id) => {
//       await queryClient.cancelQueries({ queryKey: CLINICS_QUERY_KEY });
//       const previous = queryClient.getQueryData(CLINICS_QUERY_KEY) ?? {
//         items: [],
//         stats: {},
//       };

//       queryClient.setQueryData(CLINICS_QUERY_KEY, {
//         ...previous,
//         items: previous.items.filter((item) => String(item.id) !== String(id)),
//       });

//       const userContext = await onMutate?.(id);
//       return { previous, ...userContext };
//     },
//     onSuccess: (data, variables, context) => {
//       onSuccess?.(data, variables, context);
//     },
//     onError: (error, variables, context) => {
//       if (context?.previous) {
//         queryClient.setQueryData(CLINICS_QUERY_KEY, context.previous);
//       }
//       onError?.(error, variables, context);
//     },
//     onSettled: (data, error, variables, context) => {
//       queryClient.invalidateQueries({ queryKey: CLINICS_QUERY_KEY });
//       onSettled?.(data, error, variables, context);
//     },
//   });
// };
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../config/apiClient";

export const CLINICS_QUERY_KEY = ["clinics"];
const DEFAULT_STALE_TIME = 60 * 1000;

// 1. دالة التطهير المتوافقة مع بنية السيرفر لديك
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

// 2. معالجة استجابة الجلب من السيرفر مباشرة دون تلاعب بالترتيب
const normalizeClinicsResponse = (payload) => {
  const data = payload?.data ?? payload;
  const itemsRaw = Array.isArray(data) ? data : (data?.list ?? data?.items ?? data?.clinics ?? []);
  
  // نأخذ مصفوفة السيرفر كما هي تماماً ونطهر حقولها فقط
  const items = itemsRaw.map(normalizeClinic);

  const statsSource = payload?.stats ?? payload?.statistics ?? {};
  const stats = {
    total_clinics_count: statsSource?.total_clinics_count ?? items.length,
    most_busy_clinic: statsSource?.most_busy_clinic ?? "",
    avg_doctors_per_clinic: statsSource?.avg_doctors_per_clinic ?? null,
  };

  return { items, stats };
};

const applyPayloadToClinic = (clinic, payload) => {
  return {
    ...clinic,
    clinicName: payload?.clinicName ?? payload?.name ?? clinic.clinicName,
    address: payload?.address ?? clinic.address,
  };
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
// الخطافات (Mutations) الملتزمة كلياً بترتيب السيرفر
// ==========================================

export const useCreateClinicMutation = (options = {}) => {
  const queryClient = useQueryClient();
  const { onMutate, onSuccess, onError, onSettled, ...rest } = options;

  return useMutation({
    mutationFn: createClinic,
    ...rest,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: CLINICS_QUERY_KEY });
      const previous = queryClient.getQueryData(CLINICS_QUERY_KEY) ?? { items: [], stats: {} };
      
      const tempId = `temp-${Date.now()}`;
      const optimisticItem = normalizeClinic({
        name: variables?.clinicName ?? variables?.name ?? "",
        address: variables?.address ?? "",
      });
      optimisticItem.id = tempId;
      optimisticItem.isOptimistic = true;

      // 💡 التعديل الجوهري: دفع الكرت المؤقت في نهاية المصفوفة المحلية مباشرة لتطابق السيرفر
      queryClient.setQueryData(CLINICS_QUERY_KEY, {
        ...previous,
        items: [...(previous.items || []), optimisticItem],
      });

      const userContext = await onMutate?.(variables);
      return { previous, tempId, ...userContext };
    },
    onSuccess: (data, variables, context) => {
      const responseData = data?.data ?? data ?? {};
      
      queryClient.setQueryData(CLINICS_QUERY_KEY, (old) => {
        if (!old) return old;
        return {
          ...old,
          items: (old.items || []).map((item) =>
            String(item.id) === String(context?.tempId)
              ? {
                  ...item,
                  ...normalizeClinic({
                    name: variables?.clinicName ?? variables?.name,
                    address: variables?.address,
                    ...responseData,
                    id: responseData?.uuid ?? responseData?.id ?? context?.tempId,
                  }),
                  isOptimistic: false, // يستقر في مكانه الأخير كعنصر حقيقي
                }
              : item
          ),
        };
      });

      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(CLINICS_QUERY_KEY, context.previous);
      }
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
  const { onMutate, onSuccess, onError, onSettled, ...rest } = options;

  return useMutation({
    mutationFn: updateClinic,
    ...rest,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: CLINICS_QUERY_KEY });
      const previous = queryClient.getQueryData(CLINICS_QUERY_KEY) ?? { items: [], stats: {} };
      const { id, payload } = variables || {};

      if (id) {
        queryClient.setQueryData(CLINICS_QUERY_KEY, {
          ...previous,
          items: (previous.items || []).map((item) =>
            String(item.id) === String(id) || String(item.uuid) === String(id)
              ? applyPayloadToClinic(item, payload)
              : item
          ),
        });
      }

      const userContext = await onMutate?.(variables);
      return { previous, ...userContext };
    },
    onSuccess: (data, variables, context) => {
      const responseData = data?.data ?? data ?? {};
      const targetId = variables?.id ? String(variables.id) : null;

      if (targetId) {
        queryClient.setQueryData(CLINICS_QUERY_KEY, (old) => {
          if (!old) return old;
          return {
            ...old,
            items: (old.items || []).map((item) =>
              String(item.id) === targetId || String(item.uuid) === targetId
                ? {
                    ...item,
                    ...applyPayloadToClinic(item, variables?.payload),
                    ...normalizeClinic(responseData),
                    id: item.id, 
                  }
                : item
            ),
          };
        });
      }

      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(CLINICS_QUERY_KEY, context.previous);
      }
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
  const { onMutate, onSuccess, onError, onSettled, ...rest } = options;

  return useMutation({
    mutationFn: deleteClinic,
    ...rest,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: CLINICS_QUERY_KEY });
      const previous = queryClient.getQueryData(CLINICS_QUERY_KEY) ?? { items: [], stats: {} };

      queryClient.setQueryData(CLINICS_QUERY_KEY, {
        ...previous,
        items: (previous.items || []).filter((item) => String(item.id) !== String(id)),
      });

      const userContext = await onMutate?.(id);
      return { previous, ...userContext };
    },
    onSuccess: (data, variables, context) => {
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(CLINICS_QUERY_KEY, context.previous);
      }
      onError?.(error, variables, context);
    },
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries({ queryKey: CLINICS_QUERY_KEY });
      onSettled?.(data, error, variables, context);
    },
  });
};