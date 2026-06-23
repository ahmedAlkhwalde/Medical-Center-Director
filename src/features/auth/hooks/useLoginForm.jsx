import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleRememberMe, setCredentials } from "../store/authSlice";
import { showSnackbar, hideSnackbar } from "../../uiSlice";
import { useLoginMutation } from "../service/authService";

export const useLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [pendingRedirect, setPendingRedirect] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();

  // مراقبة الجلسة والـ rememberMe من الـ Redux Model
  const { rememberMe, token } = useSelector((state) => state.auth);

  // إدارة الآثار الجانبية للتوجيه عند نجاح التسجيل
  useEffect(() => {
    if (!token) return;
    if (!pendingRedirect) {
      navigate("/main-page");
      return;
    }
    const timer = setTimeout(() => {
      navigate("/main-page");
    }, 700);
    return () => clearTimeout(timer);
  }, [token, pendingRedirect, navigate]);

  // منطق التحقق والـ Validation (Business Logic)
  const validateForm = () => {
    const tempErrors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      tempErrors.email = "يرجى إدخال بريد إلكتروني صحيح";
    }
    if (password.length < 8) {
      tempErrors.password = "يجب أن تكون كلمة المرور 8 محارف على الأقل";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // معالج إرسال البيانات (Form Submission Handler)
  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(hideSnackbar());
    setErrors({});

    if (validateForm()) {
      loginMutation.mutate(
        { email, password },
        {
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

            dispatch(
              setCredentials({
                token: data.token,
                user: data.user ?? null,
                rememberMe,
                lastUsedEmail: email,
              })
            );
            dispatch(
              showSnackbar({
                message: "تم تسجيل الدخول بنجاح",
                variant: "success",
              })
            );
            setPendingRedirect(true);
          },
          onError: () => {
            dispatch(
              showSnackbar({
                message: "تعذر تسجيل الدخول. تحقق من البيانات.",
                variant: "error",
              })
            );
          },
        }
      );
    }
  };

  const handleToggleRememberMe = () => {
    dispatch(toggleRememberMe());
  };

  // تصدير كل ما تحتاجه الـ View لتعمل بذكاء
  return {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    rememberMe,
    isPending: loginMutation.isPending,
    handleLogin,
    handleToggleRememberMe,
  };
};