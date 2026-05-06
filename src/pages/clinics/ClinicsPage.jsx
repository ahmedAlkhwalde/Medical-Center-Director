import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Add } from "@mui/icons-material";
import ClinicCard from "./components/ClinicCard";
import AddClinicModal from "./components/AddClinicModal";
import DeleteClinicDialog from "./components/DeleteClinicDialog";
import { openModal } from "../../features/clinics/clinicsSlice";

const normalizeSearchText = (value = "") =>
  value
    .toString()
    .toLowerCase()
    .replace(/[\s\p{P}\p{S}]+/gu, "")
    .replace(/\u0640/g, "")
    .trim();

const ClinicsPage = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.clinics);
  const { searchQuery } = useSelector((state) => state.ui);

  const normalizedQuery = useMemo(
    () => normalizeSearchText(searchQuery),
    [searchQuery],
  );

  const visibleItems = useMemo(() => {
    if (!normalizedQuery) {
      return items;
    }

    return items.filter((item) => {
      const searchableText = normalizeSearchText(
        [item.clinicName, item.address].join(" "),
      );

      return searchableText.includes(normalizedQuery);
    });
  }, [items, normalizedQuery]);

  return (
    <section className="w-full min-w-0 space-y-6">
      <div className="overflow-hidden rounded-3xl border theme-border theme-surface-90 theme-gradient-panel p-4 shadow-sm sm:p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1 text-right">
            <h1 className="text-2xl font-bold theme-text-accent sm:text-3xl lg:text-4xl">
              إدارة العيادات
            </h1>
            <p className="max-w-2xl text-sm theme-text-muted sm:text-base">
              إدارة بيانات العيادات وعناوينها مع عرض بطاقات واضح ومتجاوب.
            </p>
          </div>

          <Motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3 }}
            onClick={() => dispatch(openModal())}
            type="button"
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl theme-accent px-5 py-3 text-sm font-bold theme-text-on-accent shadow-lg transition-all theme-shadow-accent sm:w-auto sm:px-6"
          >
            <Add fontSize="small" />
            إضافة عيادة جديدة
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
              <ClinicCard key={item.id} data={item} index={index} />
            ))
          ) : (
            <div className="col-span-full rounded-3xl border theme-border theme-surface p-6 text-center shadow-sm sm:p-8">
              <p className="text-base font-bold theme-text-accent sm:text-lg">
                لا توجد عيادات مطابقة للبحث الحالي
              </p>
              <p className="mt-2 text-sm theme-text-muted">
                جرّب كلمة بحث مختلفة أو امسح النص للعودة إلى كل النتائج.
              </p>
            </div>
          )}
        </AnimatePresence>
      </Motion.div>

      <AddClinicModal />
      <DeleteClinicDialog />
    </section>
  );
};

export default ClinicsPage;
