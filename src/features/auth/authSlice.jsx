// import { createSlice } from "@reduxjs/toolkit";

// const STORAGE_KEY = "manegar_auth";

// const readStoredAuth = () => {
//   const readFromStorage = (storage) => {
//     const raw = storage.getItem(STORAGE_KEY);
//     if (!raw) return null;
//     const parsed = JSON.parse(raw);
//     if (!parsed?.token) return null;
//     return parsed;
//   };

//   try {
//     return readFromStorage(localStorage) || readFromStorage(sessionStorage);
//   } catch {
//     return null;
//   }
// };

// const writeStoredAuth = (data, rememberMe) => {
//   try {
//     const target = rememberMe ? localStorage : sessionStorage;
//     const other = rememberMe ? sessionStorage : localStorage;
//     target.setItem(STORAGE_KEY, JSON.stringify(data));
//     other.removeItem(STORAGE_KEY);
//   } catch {
//     // Ignore storage errors
//   }
// };

// const clearStoredAuth = () => {
//   try {
//     localStorage.removeItem(STORAGE_KEY);
//     sessionStorage.removeItem(STORAGE_KEY);
//   } catch {
//     // Ignore storage errors
//   }
// };

// const storedAuth = readStoredAuth();

// const initialState = {
//   rememberMe: storedAuth?.rememberMe ?? true,
//   lastUsedEmail: storedAuth?.lastUsedEmail ?? "",
//   token: storedAuth?.token ?? null,
//   user: storedAuth?.user ?? null,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     // تبديل خاصية تذكرني
//     toggleRememberMe: (state) => {
//       state.rememberMe = !state.rememberMe;
//     },
//     setCredentials: (state, action) => {
//       const { token, user, rememberMe, lastUsedEmail } = action.payload;

//       if (typeof rememberMe === "boolean") {
//         state.rememberMe = rememberMe;
//       }

//       if (lastUsedEmail) {
//         state.lastUsedEmail = lastUsedEmail;
//       }

//       state.token = token;
//       state.user = user ?? null;

//       writeStoredAuth(
//         {
//           token: state.token,
//           user: state.user,
//           rememberMe: state.rememberMe,
//           lastUsedEmail: state.lastUsedEmail,
//         },
//         state.rememberMe,
//       );
//     },
//     // تسجيل الخروج
//     logout: (state) => {
//       state.token = null;
//       state.user = null;
//       clearStoredAuth();
//     },
//   },
// });

// export const { toggleRememberMe, setCredentials, logout } = authSlice.actions;
// export default authSlice.reducer;
import { createSlice,current } from "@reduxjs/toolkit";

const STORAGE_KEY = "manegar_auth";

const readStoredAuth = () => {
  const readFromStorage = (storage) => {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.token) return null;
    return parsed;
  };

  try {
    return readFromStorage(localStorage) || readFromStorage(sessionStorage);
  } catch {
    return null;
  }
};

const writeStoredAuth = (data, rememberMe) => {
  try {
    const target = rememberMe ? localStorage : sessionStorage;
    const other = rememberMe ? sessionStorage : localStorage;
    target.setItem(STORAGE_KEY, JSON.stringify(data));
    other.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
};

const clearStoredAuth = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
};

const storedAuth = readStoredAuth();

const initialState = {
  rememberMe: storedAuth?.rememberMe ?? true,
  lastUsedEmail: storedAuth?.lastUsedEmail ?? "",
  token: storedAuth?.token ?? null,
  user: storedAuth?.user ?? null,
  name: storedAuth?.name ?? storedAuth?.user?.name ?? "",
  image: storedAuth?.image ?? storedAuth?.user?.image ?? null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // تبديل خاصية تذكرني
    toggleRememberMe: (state) => {
      state.rememberMe = !state.rememberMe;
    },
    setCredentials: (state, action) => {
      const { token, user, rememberMe, lastUsedEmail } = action.payload;

      if (typeof rememberMe === "boolean") {
        state.rememberMe = rememberMe;
      }

      if (lastUsedEmail) {
        state.lastUsedEmail = lastUsedEmail;
      }

      state.token = token;
      state.user = user ?? null;

      state.name = action.payload.name || user?.name || "";
      state.image = action.payload.image || user?.image || null;

      writeStoredAuth(
        {
          token: state.token,
          user: state.user,
          name: state.name,
          image: state.image,
          rememberMe: state.rememberMe,
          lastUsedEmail: state.lastUsedEmail,
        },
        state.rememberMe,
      );
      
    },

    updateProfileData: (state, action) => {
      const { name, image } = action.payload;

      if (name !== undefined) {
        state.name = name;
        if (state.user) state.user.name = name;
      }

      if (image !== undefined) {
        state.image = image;
        if (state.user) state.user.image = image;
      }

      //  الحل السحري: استخراج نسخة صافية من كائن المستخدم المحدث وليس الـ Proxy
      const plainUser = state.user ? current(state.user) : null;

      // الآن نرسل البيانات الصافية للتخزين بأمان
      writeStoredAuth(
        {
          token: state.token,
          user: plainUser, // 💡 مررنا الكائن الصافي هنا
          name: state.name,
          image: state.image,
          rememberMe: state.rememberMe,
          lastUsedEmail: state.lastUsedEmail,
        },
        state.rememberMe,
      );

      // 💡 للطباعة في الكونسول ورؤية البيانات الحقيقية فوراً بدون تعقيدات الـ Proxy:
      console.log("Credentials updated successfully:", {
        name: state.name,
        image: state.image,
        user: plainUser,
      });
    },

    // تسجيل الخروج وتنظيف الـ State بالكامل
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.name = "";
      state.image = null;
      clearStoredAuth();
    },
  },
});

// تصدير التابع الجديد هنا
export const { toggleRememberMe, setCredentials, updateProfileData, logout } =
  authSlice.actions;
export default authSlice.reducer;
