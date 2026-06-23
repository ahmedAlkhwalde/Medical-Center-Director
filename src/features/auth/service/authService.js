import { useMutation } from "@tanstack/react-query";
import apiClient from "../../../config/apiClient";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../uiSlice";
import { useNavigate } from "react-router-dom";

// --- دالات الـ API الأساسية ---
export const loginUser = async (payload) => {
  const response = await apiClient.post("/admin/login", payload);
  const data = response.data;
  if (Array.isArray(data)) {
    return data[0] ?? null;
  }
  return data;
};

export const logoutUser = async (token) => {
  const response = await apiClient.post(
    "/admin/logout",
    null,
    token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : undefined,
  );
  return response.data;
};

const forgotPasswordService = async (email) => {
  const response = await apiClient.post("/admin/password/forgot", { email });
  return response.data;
};

const verifyOtpService = async ({ contact, code }) => {
  const response = await apiClient.post("/admin/password/verify-otp", { contact, code });
  return response.data;
};

const resetPasswordService = async ({ contact, password, password_confirmation }) => {
  const response = await apiClient.post("/admin/password/reset", {
    contact,
    password,
    password_confirmation,
  });
  return response.data;
};

// --- الـ Mutations المخصصة ---

/**
 * 1. هوك تسجيل الدخول
 */
export const useLoginMutation = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (!data?.token) {
        dispatch(
          showSnackbar({
            message: "تعذر تسجيل الدخول. الرجاء المحاولة لاحقاً.",
            variant: "error",
          })
        );
        return;
      }

      // عرض الرسالة القادمة من السيرفر أو الرسالة الافتراضية للنجاح
      dispatch(
        showSnackbar({
          message: "تم تسجيل الدخول بنجاح",
          variant: "success",
        })
      );
    },
    onError: (err) => {
      const errorMessage = err?.response?.data?.message || "تعذر تسجيل الدخول. تحقق من البيانات.";
      dispatch(
        showSnackbar({
          message: errorMessage,
          variant: "error",
        })
      );
    },
  });
};

/**
 * 2. هوك تسجيل الخروج
 */
export const useLogoutMutation = (options = {}) =>
  useMutation({
    mutationFn: logoutUser,
    ...options,
  });

/**
 * 3. هوك نسيان كلمة المرور
 */
export const useForgotPasswordMutation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: forgotPasswordService,
    onSuccess: (data, email) => {
      sessionStorage.setItem("reset_identifier", email);
      
      dispatch(
        showSnackbar({
          message: "تم إرسال رمز التحقق بنجاح",
          variant: "success",
        })
      );      
      navigate("/reset-password/verify");
    },
    onError: (err) => {
      const errorMessage = "حدث خطأ ما، يرجى المحاولة لاحقاً";
      dispatch(
        showSnackbar({
          message: errorMessage,
          variant: "error",
        })
      );
    },
  });
};

/**
 * 4. هوك التحقق من رمز الـ OTP
 */
export const useVerifyOtpMutation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: verifyOtpService,
    onSuccess: (data) => {
      dispatch(
        showSnackbar({
          message: "تم التحقق من الرمز بنجاح",
          variant: "success",
        })
      );
      navigate("/reset-password/new-password");
    },
    onError: (err) => {
      const errorMessage = "الرمز المدخل غير صحيح";
      dispatch(
        showSnackbar({
          message: errorMessage,
          variant: "error",
        })
      );
    },
  });
};

/**
 * 5. هوك تعيين كلمة المرور الجديدة
 */
export const useResetPasswordMutation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: resetPasswordService,
    onSuccess: (data) => {
      sessionStorage.removeItem("reset_identifier");
      sessionStorage.removeItem("reset_code");

      dispatch(
        showSnackbar({
          message: "تم إعادة تعيين كلمة المرور بنجاح.",
          variant: "success",
        })
      );

      navigate("/", { state: { passwordResetSuccess: true } });
    },
    onError: (err) => {
      const errorMessage = "حدث خطأ أثناء حفظ كلمة المرور الجديدة";
      dispatch(
        showSnackbar({
          message: errorMessage,
          variant: "error",
        })
      );
    },
  });
};