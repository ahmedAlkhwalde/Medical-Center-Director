import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../config/apiClient";
import { store } from "../../../app/store";
import { showSnackbar } from "../../uiSlice";

export const SECRETARIES_QUERY_KEY = ["secretaries"];
const DEFAULT_STALE_TIME = 60 * 1000;
const SECRETARIES_PATH = "/admin/secretaries";

// --- تنظيف وتوحيد البيانات القادمة من السيرفر ليفهمها الفرونت إند ---
const normalizeSecretary = (item = {}) => {
  const uuid = item?.uuid ?? item?.id ?? null;
  const id = uuid; 
  const name = item?.name ?? "";
  const email = item?.email ?? "";
  const phone = item?.number ?? item?.phone ?? ""; 
  const salary = Number(item?.salary ?? 0) || 0;
  
  const activeValue = item?.active;
  const isActive = activeValue === 1 || activeValue === true;

  return { id, uuid, name, email, phone, salary, isActive };
};

const normalizeSecretariesResponse = (payload) => {
  if (!payload) return { items: [], stats: {} };
  const listRaw = payload?.data ?? (Array.isArray(payload) ? payload : []);
  const items = Array.isArray(listRaw) ? listRaw.map(normalizeSecretary) : [];

  const statsSource = payload?.stats ?? {};
  const stats = {
    total_count: Number(statsSource?.total_count ?? items.length),
    active_count: Number(statsSource?.active_count ?? items.filter((i) => i.isActive).length),
    inactive_count: Number(statsSource?.inactive_count ?? items.filter((i) => !i.isActive).length),
    total_salaries: Number(statsSource?.total_salaries ?? items.reduce((sum, i) => sum + i.salary, 0)),
  };

  return { items, stats };
};

// ==========================================
// 1. دالات الاتصال بالسيرفر (API Calls)
// ==========================================

export const fetchSecretaries = async () => {
  const response = await apiClient.get(SECRETARIES_PATH);
  return normalizeSecretariesResponse(response.data ?? response);
};

export const createSecretary = async (payload) => {
  // تنظيف رقم الهاتف من الفراغات والرموز قبل الإرسال
  const cleanedPayload = {
    ...payload,
    number: payload.number ? String(payload.number).replace(/[^0-9]/g, '') : ''
  };
  const response = await apiClient.post(SECRETARIES_PATH, cleanedPayload);
  return response.data ?? response;
};

export const updateSecretary = async ({ uuid, payload }) => {
  const cleanedPayload = { ...payload };
  // تنظيف الرقم فقط في حال وجوده ضمن التحديثات الجزئية
  if (cleanedPayload.number) {
    cleanedPayload.number = String(cleanedPayload.number).replace(/[^0-9]/g, '');
  }
  const response = await apiClient.put(`${SECRETARIES_PATH}/${uuid}`, cleanedPayload);
  return response.data ?? response;
};

// الـ API الجديد والموحد لتحديث حالة السكرتير (تفعيل / تعطيل)
export const updateSecretaryStatus = async ({ uuid, active }) => {
  const response = await apiClient.patch(`${SECRETARIES_PATH}/${uuid}/status`, { active });
  return response.data ?? response;
};


// ==========================================
// 2. الهوكات الخاصة بـ React Query Hooks
// ==========================================

// هوك جلب البيانات
export const useSecretariesQuery = (options = {}) => {
  return useQuery({
    queryKey: SECRETARIES_QUERY_KEY,
    queryFn: fetchSecretaries,
    staleTime: DEFAULT_STALE_TIME,
    ...options,
  });
};

// هوك إضافة سكرتير جديد
export const useCreateSecretaryMutation = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSecretary,
    ...options,
    onSuccess: (data, variables, context) => {
      store.dispatch(
        showSnackbar({ message: "تمت إضافة السكرتير بنجاح", variant: "success" })
      );
      options.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      store.dispatch(
        showSnackbar({ message: error.response.data.message || "تعذر إضافة السكرتاريا حاليا, جرب لاحقاً", variant: "error" })
      );
      options.onError?.(error, variables, context);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SECRETARIES_QUERY_KEY });
    }
  });
};

// هوك تعديل بيانات سكرتير (يدعم التعديل الجزئي والـ Dirty Fields)
export const useUpdateSecretaryMutation = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSecretary,
    ...options,
    onSuccess: (data, variables, context) => {
      store.dispatch(
        showSnackbar({ message: "تم تحديث بيانات السكرتير بنجاح", variant: "success" })
      );
      options.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      store.dispatch(
        showSnackbar({ message: error.response.data.message || "البيانات المحدثة غير صالحة أو البريد الإلكتروني مستخدم مسبقاً", variant: "error" })
      );
      options.onError?.(error, variables, context);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SECRETARIES_QUERY_KEY });
    }
  });
};

// هوك تحديث الحالة الموحد والجديد (يغطي التفعيل والتعطيل بطلب PATCH واحد)
export const useUpdateSecretaryStatusMutation = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSecretaryStatus,
    ...options,
    onSuccess: (data, variables, context) => {
      const isActivating = variables.active === 1;
      store.dispatch(
        showSnackbar({ 
          message: isActivating ? "تم تفعيل الحساب بنجاح" : "تم إلغاء تفعيل الحساب بنجاح", 
          variant: "success" 
        })
      );
      options.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      const isActivating = variables.active === 1;
      store.dispatch(
        showSnackbar({ 
          message: isActivating ? "تعذر تفعيل الحساب حالياً" : "تعذر إلغاء تفعيل الحساب حالياً", 
          variant: "error" 
        })
      );
      options.onError?.(error, variables, context);
    },
    onSettled: () => {
      // إعادة جلب البيانات فوراً بعد استقرار الطلب لمزامنة الجدول
      queryClient.invalidateQueries({ queryKey: SECRETARIES_QUERY_KEY });
    }
  });
};