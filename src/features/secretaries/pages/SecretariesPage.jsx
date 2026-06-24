import { motion as Motion, AnimatePresence } from "framer-motion";
import { Add } from "@mui/icons-material";
import { useSecretariesPage } from "../hooks/useSecretariesPage"; // اضبط مسار الهوك الصحيح لديك
import SecretaryCard from "../components/SecretaryCard";
import AddSecretaryModal from "../components/AddSecretaryModal";
import DeleteConfirmDialog from "../components/DeleteConfirmDialog";

const SecretariesPage = () => {
  const {
    items,
    visibleItems,
    stats,
    isInitialLoading,
    isError,
    normalizedQuery,
    handleOpenAddModal,
  } = useSecretariesPage();

  return (
    <section className="w-full min-w-0 space-y-6">
      {/* الهيدر العلوي وزر الإضافة */}
      <div className="overflow-hidden rounded-3xl border theme-border theme-surface-90 theme-gradient-panel p-4 shadow-sm sm:p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1 text-right">
            <h1 className="text-2xl font-bold theme-text-accent sm:text-3xl lg:text-4xl">
              إدارة السكرتاريا
            </h1>
            <p className="max-w-2xl text-sm theme-text-muted sm:text-base">
              إضافة السكرتاريا وتعديل بياناتهم مع التفعيل أو الإلغاء ومتابعة الإحصائيات الأساسية.
            </p>
          </div>

          <Motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3 }}
            onClick={handleOpenAddModal}
            type="button"
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl theme-accent px-5 py-3 text-sm font-bold theme-text-on-accent shadow-lg transition-all theme-shadow-accent sm:w-auto sm:px-6"
          >
            <Add fontSize="small" />
            إضافة سكرتير جديد
          </Motion.button>
        </div>
      </div>

      {/* لوحة الإحصائيات */}
      <Motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <Motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-2xl border theme-border theme-surface p-4 shadow-sm sm:p-5"
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
      </Motion.div>

      {/* شريط معلومات البحث النشط */}
      {normalizedQuery && !isInitialLoading && !isError && (
        <div className="rounded-2xl border theme-border theme-surface px-4 py-3 text-sm font-medium theme-text-muted shadow-sm">
          يتم عرض {visibleItems.length} نتيجة مطابقة من أصل {items.length} سجل.
        </div>
      )}

      {/* عرض حالات التحميل، الأخطاء، أو كروت البيانات الفريش */}
      {isInitialLoading ? (
        <Motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`secretary-skeleton-${index}`}
              className="rounded-2xl border theme-border theme-surface p-4 shadow-sm sm:p-5 animate-pulse"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2 text-right">
                  <div className="h-3 w-24 rounded-full bg-slate-200/80 dark:bg-slate-700/60" />
                  <div className="h-6 w-36 rounded-full bg-slate-200/70 dark:bg-slate-700/50" />
                </div>
                <div className="h-12 w-12 rounded-xl bg-slate-200/70 dark:bg-slate-700/50" />
              </div>
              <div className="mt-4 space-y-3">
                <div className="h-10 rounded-xl bg-slate-200/60 dark:bg-slate-700/40" />
                <div className="h-10 rounded-xl bg-slate-200/50 dark:bg-slate-700/30" />
              </div>
            </div>
          ))}
        </Motion.div>
      ) : isError ? (
        <div className="rounded-3xl border theme-border theme-surface p-6 text-center shadow-sm sm:p-8">
          <p className="text-base font-bold theme-text-accent sm:text-lg">
            حدث خطأ أثناء تحميل السكرتاريا
          </p>
          <p className="mt-2 text-sm theme-text-muted">حاول مرة أخرى بعد قليل.</p>
        </div>
      ) : visibleItems.length > 0 ? (
        <Motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
          <AnimatePresence mode="popLayout">
            {visibleItems.map((item, index) => (
              <div key={item.uuid} data-scroll-id={`secretary-${item.uuid}`}>
                <SecretaryCard data={item} index={index} />
              </div>
            ))}
          </AnimatePresence>
        </Motion.div>
      ) : (
        <div className="rounded-3xl border theme-border theme-surface p-6 text-center shadow-sm sm:p-8">
          <p className="text-base font-bold theme-text-accent sm:text-lg">
            لا توجد سكرتاريا مطابقة للبحث الحالي
          </p>
          <p className="mt-2 text-sm theme-text-muted">
            جرّب كلمة بحث مختلفة أو امسح النص للعودة إلى كل النتائج.
          </p>
        </div>
      )}

      {/* المودالات المنبثقة التابعة للصفحة */}
      <AddSecretaryModal />
      <DeleteConfirmDialog />
    </section>
  );
};

export default SecretariesPage;