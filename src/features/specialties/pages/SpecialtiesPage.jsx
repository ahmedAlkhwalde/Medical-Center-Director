import React from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Add } from "@mui/icons-material";
import SpecialtyCard from "../components/SpecialtyCard";
import AddSpecialtyModal from "../components/AddSpecialtyModal";
import DeleteConfirmDialog from "../components/DeleteConfirmDialog";
import { useSpecialties } from "../hooks/useSpecialties";

const SpecialtiesPage = () => {
  const {
    visibleItems,
    statsToRender,
    isInitialLoading,
    isError,
    handleOpenModal,
  } = useSpecialties();

  return (
    <section className="w-full min-w-0 space-y-6">
      {/* لوحة التحكم العلوية والعنوان */}
      <div className="overflow-hidden rounded-3xl border theme-border theme-surface-90 theme-gradient-panel p-4 shadow-sm sm:p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1 text-right">
            <h1 className="text-2xl font-bold theme-text-accent sm:text-3xl lg:text-4xl">
              إدارة الاختصاصات الطبية
            </h1>
            <p className="max-w-2xl text-sm theme-text-muted sm:text-base">
              التحكم الكامل في الأقسام الطبية والرسوم التشخيصية المرتبطة بها.
            </p>
          </div>

          <Motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={handleOpenModal}
            className="flex cursor-pointer w-full items-center justify-center gap-2 rounded-xl theme-accent px-5 py-3 font-bold text-sm theme-text-on-accent shadow-lg transition-all theme-shadow-accent sm:w-auto sm:px-6"
          >
            <Add fontSize="small" />
            إضافة اختصاص جديد
          </Motion.button>
        </div>
      </div>

      {/* لوحة الإحصائيات */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsToRender.map((stat, index) => (
          <Motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.03, ease: "easeOut" }}
            className={`rounded-2xl border theme-border theme-surface p-4 shadow-sm sm:p-5 transition-all ${
              stat.isPlaceholder ? "opacity-70" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 text-right">
                <p className="text-xs font-bold uppercase tracking-wide theme-text-muted">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-bold theme-text-accent">
                  {stat.value}
                </h3>
                <p className="text-sm theme-text-muted">{stat.note}</p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl theme-accent-soft theme-text-accent">
                {stat.icon}
              </div>
            </div>
          </Motion.div>
        ))}
      </div>

      {/* شبكة عرض كروت الاختصاصات */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-6">
        <AnimatePresence mode="popLayout">
          {isInitialLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="rounded-2xl border theme-border theme-surface p-4 shadow-sm sm:p-5 animate-pulse"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2 text-right">
                    <div className="h-3 w-24 rounded-full bg-slate-200/80 dark:bg-slate-700/60" />
                    <div className="h-6 w-32 rounded-full bg-slate-200/70 dark:bg-slate-700/50" />
                    <div className="h-3 w-20 rounded-full bg-slate-200/60 dark:bg-slate-700/40" />
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-slate-200/70 dark:bg-slate-700/50" />
                </div>
                <div className="mt-4 space-y-3">
                  <div className="h-10 rounded-xl bg-slate-200/60 dark:bg-slate-700/40" />
                  <div className="h-10 rounded-xl bg-slate-200/50 dark:bg-slate-700/30" />
                </div>
              </div>
            ))
          ) : isError ? (
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full rounded-3xl border theme-border theme-surface p-6 text-center shadow-sm sm:p-8"
            >
              <p className="text-base font-bold theme-text-accent sm:text-lg">
                حدث خطأ أثناء تحميل الاختصاصات
              </p>
              <p className="mt-2 text-sm theme-text-muted">
                حاول مرة أخرى بعد قليل.
              </p>
            </Motion.div>
          ) : visibleItems.length > 0 ? (
            visibleItems.map((item, index) => (
              <Motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
              >
                <div data-scroll-id={`specialization-${item.uuid}`}>
                  <SpecialtyCard data={item} index={index} />
                </div>
              </Motion.div>
            ))
          ) : (
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full rounded-3xl border theme-border theme-surface p-6 text-center shadow-sm sm:p-8"
            >
              <p className="text-base font-bold theme-text-accent sm:text-lg">
                لا توجد اختصاصات مطابقة للبحث الحالي
              </p>
              <p className="mt-2 text-sm theme-text-muted">
                جرّب كلمة بحث مختلفة أو امسح النص للعودة إلى كل النتائج.
              </p>
            </Motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* المودالز المنفصلة */}
      <AddSpecialtyModal />
      <DeleteConfirmDialog />
    </section>
  );
};

export default SpecialtiesPage;