import { createSlice } from "@reduxjs/toolkit";

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

const initialState = {
  items: [
    {
      id: 1,
      name: "قسم أمراض القلب",
      price: 450,
      followUpPrice: 200,
      icon: "MonitorHeart",
    },
    {
      id: 2,
      name: "طب وجراحة الأسنان",
      price: 300,
      followUpPrice: 150,
      icon: "MedicalServices",
    },
  ],
  isModalOpen: false,
  isDeleteSheetOpen: false,
  editingItem: null,
  itemToDelete: null,
};

const specialtiesSlice = createSlice({
  name: "specialties",
  initialState,
  reducers: {
    // 1. فتح المودال (للإضافة أو التعديل)
    openModal: (state, action) => {
      state.editingItem = action.payload || null;
      state.isModalOpen = true;
    },
    // 2. إغلاق المودال
    closeModal: (state) => {
      state.isModalOpen = false;
      state.editingItem = null;
    },
    // 3. التبديل (للتوافق مع ملف AddSpecialtyModal القديم)
    toggleModal: (state) => {
      state.isModalOpen = !state.isModalOpen;
      if (!state.isModalOpen) state.editingItem = null;
    },
    // 4. الإضافة (للتوافق مع ملف AddSpecialtyModal القديم)
    addSpecialty: (state, action) => {
      const nextId = action.payload?.id ?? Date.now();
      state.items.push({
        ...action.payload,
        icon: action.payload.icon || inferSpecialtyIcon(action.payload.name),
        id: nextId,
      });
      state.isModalOpen = false;
    },
    // 5. الحفظ الذكي (تعديل أو إضافة)
    saveSpecialty: (state, action) => {
      const icon =
        action.payload.icon || inferSpecialtyIcon(action.payload.name);

      if (state.editingItem) {
        const index = state.items.findIndex(
          (i) => i.id === state.editingItem.id,
        );
        if (index !== -1)
          state.items[index] = {
            ...action.payload,
            icon,
            id: state.editingItem.id,
          };
      } else {
        const nextId = action.payload?.id ?? Date.now();
        state.items.push({ ...action.payload, icon, id: nextId });
      }
      state.isModalOpen = false;
      state.editingItem = null;
    },
    updateSpecialtyById: (state, action) => {
      const { id, changes } = action.payload;
      const index = state.items.findIndex((item) => item.id === id);
      if (index === -1) return;

      const icon =
        changes.icon ||
        inferSpecialtyIcon(changes.name || state.items[index].name);

      state.items[index] = {
        ...state.items[index],
        ...changes,
        icon,
      };
    },
    removeSpecialtyById: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    // 6. الحذف
    confirmDelete: (state, action) => {
      state.itemToDelete = action.payload;
      state.isDeleteSheetOpen = true;
    },
    executeDelete: (state) => {
      state.items = state.items.filter((i) => i.id !== state.itemToDelete);
      state.isDeleteSheetOpen = false;
      state.itemToDelete = null;
    },
    closeDeleteDialog: (state) => {
      state.isDeleteSheetOpen = false;
    },
  },
});

// القائمة الكاملة للتصدير - تأكد من وجود openModal هنا
export const {
  openModal,
  closeModal,
  toggleModal,
  addSpecialty,
  saveSpecialty,
  updateSpecialtyById,
  removeSpecialtyById,
  confirmDelete,
  executeDelete,
  closeDeleteDialog,
} = specialtiesSlice.actions;

export default specialtiesSlice.reducer;
