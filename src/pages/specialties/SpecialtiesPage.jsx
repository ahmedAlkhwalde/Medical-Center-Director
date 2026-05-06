import { useSelector, useDispatch } from "react-redux";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Add } from "@mui/icons-material";
import SpecialtyCard from "./components/SpecialtyCard";
import AddSpecialtyModal from "./components/AddSpecialtyModal";
import DeleteConfirmDialog from "./components/DeleteConfirmDialog";
import { openModal } from "../../features/specialties/specialtiesSlice";

const SpecialtiesPage = () => {
  const { items } = useSelector((state) => state.specialties);
  const { searchQuery } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const visibleItems = normalizedQuery
    ? items.filter((item) => item.name.toLowerCase().includes(normalizedQuery))
    : items;

  return (
    <section className="w-full min-w-0 space-y-6">
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
            transition={{duration:0.3}}
            onClick={() => dispatch(openModal())}
            className="flex cursor-pointer w-full items-center justify-center gap-2 rounded-xl theme-accent px-5 py-3 font-bold text-sm theme-text-on-accent shadow-lg transition-all theme-shadow-accent sm:w-auto sm:px-6"
          >
            <Add fontSize="small" />
            إضافة اختصاص جديد
          </Motion.button>
        </div>
      </div>

      <Motion.div
        layout
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-6"
      >
        <AnimatePresence mode="popLayout">
          {visibleItems.length > 0 ? (
            visibleItems.map((item, index) => (
              <SpecialtyCard key={item.id} data={item} index={index} />
            ))
          ) : (
            <div className="col-span-full rounded-3xl border theme-border theme-surface p-6 text-center shadow-sm sm:p-8">
              <p className="text-base font-bold theme-text-accent sm:text-lg">
                لا توجد اختصاصات مطابقة للبحث الحالي
              </p>
              <p className="mt-2 text-sm theme-text-muted">
                جرّب كلمة بحث مختلفة أو امسح النص للعودة إلى كل النتائج.
              </p>
            </div>
          )}
        </AnimatePresence>
      </Motion.div>

      <AddSpecialtyModal />
      <DeleteConfirmDialog />
    </section>
  );
};
export default SpecialtiesPage;
