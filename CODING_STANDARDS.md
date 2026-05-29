# معايير كتابة الكود - Manegar Dashboard

## 📋 نظرة عامة

هذا الملف يوثق أسلوب الكود والممارسات المستخدمة في مشروع Manegar Dashboard.

---

## 📦 المكتبات الأساسية المستخدمة

### Frontend Framework & Build

- **React** (v19.2.4) - مكتبة بناء الواجهات
- **React DOM** (v19.2.4) - ربط React مع DOM
- **Vite** (v8.0.1) - أداة البناء والتطوير السريع

### الحالة (State Management)

- **Redux Toolkit** (@reduxjs/toolkit v2.11.2) - إدارة الحالة المركزية
  - استخدام Slices بدلاً من الطريقة الكلاسيكية
- **React-Redux** (v9.2.0) - ربط React مع Redux

### التنسيقات والأنماط

- **Tailwind CSS** (v4.2.2) - أداة CSS Utility-First
- **Material-UI (@mui)** (v7.3.9) - مكتبة المكونات والأيقونات
  - @mui/material - المكونات
  - @mui/icons-material - الأيقونات
- **Emotion** - مكتبة CSS-in-JS

### التوجيه (Routing)

- **React Router DOM** (v7.13.2) - التوجيه بين الصفحات

### طلبات البيانات (Data Fetching)

- **Axios** (v1.14.0) - مكتبة HTTP للطلبات
- **React Query / TanStack Query** (v5.100.5) - إدارة البيانات والـcaching
  - @tanstack/react-query-devtools - أدوات التطوير

### الحركات والتأثيرات

- **Framer Motion** (v12.38.0) - مكتبة الحركات والانتقالات
- **Motion** (v12.38.0) - مكتبة الحركات

### خرائط ومواقع جغرافية

- **Leaflet** (v1.9.4) - مكتبة الخرائط
- **React Leaflet** (v5.0.0) - مكونات Leaflet في React

### أدوات أخرى

- **Lucide React** (v1.14.0) - أيقونات SVG محسنة
- **XLSX** (v0.18.5) - معالجة ملفات Excel

---

## 📁 بنية المجلدات

### هيكل المشروع الرئيسي

```
src/
├── app/                    # إعدادات التطبيق الأساسية
│   ├── store.jsx          # متجر Redux
│   └── theme.js           # إعدادات المظهر والألوان
│
├── assets/                 # الملفات الثابتة
│   └── images/            # الصور والرسومات
│
├── features/               # ملفات Redux Slices
│
│
├── hooks/                  # React Hooks المخصصة
│
├── pages/                  # الصفحات الرئيسية
│
├── service/                # خدمات API والمنطق الخارجي
│
├── App.jsx                # المكون الجذر
├── App.css                # أنماط عامة
├── index.css              # أنماط البداية
└── main.jsx               # نقطة الدخول
```

### تنظيم المميزات (Features)

كل ميزة تحتوي على:

- **{FeatureName}Slice.jsx** - تعريف الحالة والـactions والـreducers

### تنظيم الصفحات (Pages)

كل صفحة قد تحتوي على:

- **{PageName}.jsx** - مكون الصفحة الرئيسي
- **components/** - مكونات فرعية خاصة بالصفحة
- **{PageName}Formatters.js** - دوال تنسيق البيانات

---

## 🎨 أسلوب كتابة الكود

### 1. مكونات React (Components)

#### قاعدة العرض الأساسية:

```jsx
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";

const ComponentName = ({ prop1, prop2 }) => {
  const dispatch = useDispatch();
  const stateValue = useSelector((state) => state.feature.value);

  const handleAction = () => {
    dispatch(actionCreator());
  };

  return <motion.div className="...">{/* المحتوى */}</motion.div>;
};

export default ComponentName;
```

#### الممارسات الموصى بها:

- استخدام **Functional Components** مع Hooks
- استخدام **Redux Hooks** (`useSelector`, `useDispatch`)
- استخدام **Framer Motion** للحركات الناعمة
- Tailwind CSS للتنسيق بدلاً من CSS ملفات منفصلة (عندما يكون ممكناً)
- المكونات المشتركة تُحفظ في `components/`
- المكونات الخاصة بصفحة معينة تُحفظ في `pages/{PageName}/components/`

### 2. Redux Slices

#### نمط الـ Slice:

```jsx
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  loading: false,
  error: null,
};

const featureSlice = createSlice({
  name: "featureName",
  initialState,
  reducers: {
    // actions هنا
    setData: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    // async actions من thunks
  },
});

export const { setData } = featureSlice.actions;
export default featureSlice.reducer;
```

#### الممارسات:

- استخدام Redux Toolkit للتعامل مع الحالة
- كل ميزة رئيسية لها slice منفصل
- استخدام `extraReducers` للـ async operations
- أسماء الـ actions واضحة وموصوفة

### 3. التنسيق (Styling)

#### أولويات الاستخدام:

1. **Tailwind CSS** - الخيار الأول (classes في className)
2. **Material-UI Components** - للمكونات المعقدة
3. **Emotion / CSS-in-JS** - للتنسيق الديناميكي

#### مثال التنسيق:

```jsx
<div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
    Label
  </span>
</div>
```

#### الألوان والمتغيرات:

- استخدام متغيرات CSS مخصصة (theme variables)
- دعم الـ Dark Mode عبر class `.dark`
- استخدام Tailwind modifiers مثل `dark:` و `hover:` و `md:` و `lg:`

### 4. الأيقونات

#### مصادر الأيقونات:

1. **Material-UI Icons** (@mui/icons-material)

   ```jsx
   import { Search, Menu, Settings } from "@mui/icons-material";
   ```

2. **Lucide Icons** (lucide-react)
   ```jsx
   import { Icon } from "lucide-react";
   ```

#### الممارسة:

- استخدام أيقونات من مصدر واحد في نفس الصفحة إن أمكن
- Material-UI للواجهات الرسمية والمعقدة
- Lucide للأيقونات البسيطة والخفيفة

### 5. التوجيه (React Router)

#### نمط المسارات:

```jsx
<Routes>
  <Route path="/" element={<LoginPage />} />
  <Route path="/main-page/*" element={<MainPage />} />
  <Route path="/feature/:id" element={<FeaturePage />} />
</Routes>
```

#### الممارسات:

- استخدام relative routing داخل المكونات الفرعية
- Lazy loading للصفحات الكبيرة
- معالجة الصفحات المفقودة (404)

### 6. طلبات البيانات

#### استخدام React Query + Axios:

```jsx
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const { data, isLoading, error } = useQuery({
  queryKey: ["feature", id],
  queryFn: () => axios.get(`/api/feature/${id}`),
});
```

#### الممارسات:

- استخدام React Query لـ caching وـ synchronization
- Axios للطلبات HTTP
- معالجة الأخطاء والحالات الفارغة

---

## 🎯 معايير التسمية

### المتغيرات والدوال

- **camelCase** للمتغيرات والدوال العادية
  ```js
  const userData = {};
  const handleClick = () => {};
  ```

### المكونات والفئات

- **PascalCase** للمكونات React
  ```jsx
  const MyComponent = () => {};
  export default MyComponent;
  ```

### الملفات

- **PascalCase** لملفات المكونات: `Header.jsx`, `LoginPage.jsx`
- **camelCase** لملفات الدوال والـ utilities: `userFormatter.js`, `helpers.js`
- **camelCase** لملفات Slices: `authSlice.jsx`

### Redux Actions

- **فعل واضح + اسم المتغير**: `setUserData`, `toggleMobileMenu`

---

## 🚀 أفضل الممارسات

### الأداء

- ✅ استخدام React Query للـ caching
- ✅ تقسيم الكود (Code Splitting) مع React.lazy
- ✅ تجنب re-renders غير الضرورية
- ✅ استخدام Framer Motion بحذر على الأجهزة الضعيفة

### إدارة الحالة

- ✅ Redux للحالة العامة فقط (authentication, theme, إلخ)
- ✅ useState للحالة المحلية للمكون
- ✅ React Query للبيانات من الـ server

### الكود النظيف

- ✅ دوال صغيرة وقابلة للاختبار
- ✅ تعليقات واضحة للمنطق المعقد
- ✅ معالجة الأخطاء بشكل صحيح
- ✅ تجنب نسخ الكود (DRY)

### إمكانية الوصول (Accessibility)

- ✅ استخدام semantic HTML
- ✅ ARIA labels عند الحاجة
- ✅ اختبار التنقل بلوحة المفاتيح

---

## 🔧 نصائح مهمة

### تطوير Dark Mode

- استخدام متغيرات CSS للألوان
- تطبيق classes `dark:` من Tailwind
- حفظ التفضيل في Redux

### التوافقية (Responsiveness)

- Mobile-first design
- استخدام Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- اختبار على أجهزة مختلفة

### الحركات

- استخدام Framer Motion للحركات المهمة
- تجنب الإفراط في الحركات
- اختبار الأداء على الأجهزة الضعيفة

---

## 📝 قواعس ESLint

تم إعداد ESLint مع:

- React Hooks rules
- React Refresh rules
- TanStack Query rules

**تشغيل التحقق:**

```bash
npm run lint
```

---

## 🏗️ أوامر البناء والتطوير

```bash
# تشغيل خادم التطوير
npm run dev

# بناء للإنتاج
npm run build

# معاينة البناء
npm run preview

# التحقق من الأخطاء
npm run lint
```

---

**آخر تحديث:** مايو 2026
