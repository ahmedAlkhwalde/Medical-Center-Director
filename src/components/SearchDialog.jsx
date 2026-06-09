import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Person, LocalHospital, AssignmentInd, SearchOff, HourglassEmpty } from '@mui/icons-material';
import { useSearch } from '../service/searchService';

const SearchResultsDialog = ({ open, onClose, query }) => {
  const { data, isLoading } = useSearch(query);
  const navigate = useNavigate();
  const currentLocation = useLocation(); // للحصول على المسار الحالي

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  // دالة التمرير الموحد مع تأثير التوهج
  const scrollToElement = (scrollId) => {
    setTimeout(() => {
      const element = document.querySelector(`[data-scroll-id="${scrollId}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.style.boxShadow = '0 0 20px 10px rgba(20, 184, 166, 0.6)';
        element.style.borderRadius = '1rem';
        element.style.transition = 'box-shadow 0.3s ease, border-radius 0.3s ease';
        setTimeout(() => {
          element.style.boxShadow = '';
          element.style.borderRadius = '';
        }, 2000);
      }
    }, 150); // تأخير بسيط لضمان إغلاق الحوار
  };

  const handleSelect = (type, id, name) => {
    onClose();
    let scrollId = '', route = '';
    switch (type) {
      case 'doctor':
        scrollId = `doctor-${id}`;
        route = '/main-page/doctors';
        break;
      case 'specialization':
        scrollId = `specialization-${id}`;
        route = '/main-page/specialties';
        break;
      case 'secretary':
        scrollId = `secretary-${id}`;
        route = '/main-page/secretary';
        break;
      default: return;
    }

    // إذا كنا بالفعل في الصفحة المطلوبة، نمرر مباشرة
    if (currentLocation.pathname === route) {
      scrollToElement(scrollId);
    } else {
      // وإلا ننتقل مع إرسال معرف التمرير
      navigate(route, { state: { scrollTo: scrollId } });
    }
  };

  const groupedResults = { doctors: [], specializations: [], secretaries: [] };
  if (data) {
    data.doctors?.forEach(d => groupedResults.doctors.push({ id: d.doctor_uuid, name: d.name, subtitle: d.specialization }));
    data.specializations?.forEach(s => groupedResults.specializations.push({ id: s.uuid, name: s.name }));
    data.secretaries?.forEach(s => groupedResults.secretaries.push({ id: s.uuid, name: s.name }));
  }

  const totalResults = groupedResults.doctors.length + groupedResults.specializations.length + groupedResults.secretaries.length;

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        onMouseDown={(e) => e.preventDefault()}
        className="absolute left-0 right-0 top-full mt-1 w-full rounded-2xl border border-white/20 dark:border-white/10 
                   bg-white dark:bg-slate-900 shadow-2xl ring-1 ring-black/5 overflow-hidden"
        style={{ zIndex: 60 }}
      >
        <div className="max-h-80 overflow-y-auto overscroll-contain p-3">
          {isLoading && (
            <div className="flex items-center justify-center gap-3 py-10 text-sm theme-text-muted">
              <HourglassEmpty className="animate-spin text-teal-500" fontSize="small" />
              <span>جاري البحث...</span>
            </div>
          )}
          {!isLoading && query.trim().length >= 2 && totalResults === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-sm theme-text-muted">
              <SearchOff sx={{ fontSize: 40, color: 'text.secondary' }} />
              <span className="mt-2">لا توجد نتائج</span>
            </div>
          )}
          {!isLoading && totalResults > 0 && (
            <div className="space-y-4">
              {groupedResults.doctors.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 px-2 mb-2 text-xs font-bold uppercase tracking-wider theme-text-muted">
                    <LocalHospital fontSize="inherit" className="text-teal-500" /> الأطباء
                  </div>
                  {groupedResults.doctors.map((item, idx) => (
                    <div key={`dr-${item.id}-${idx}`}
                      onClick={() => handleSelect('doctor', item.id, item.name)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-900/30 cursor-pointer transition-colors group">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-800 text-teal-600 dark:text-teal-300">
                        <LocalHospital fontSize="small" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold theme-text truncate">{item.name}</p>
                        {item.subtitle && <p className="text-xs theme-text-muted truncate">{item.subtitle}</p>}
                      </div>
                      <span className="text-xs text-teal-500 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                        فتح
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {groupedResults.specializations.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 px-2 mb-2 text-xs font-bold uppercase tracking-wider theme-text-muted">
                    <AssignmentInd fontSize="inherit" className="text-orange-500" /> التخصصات
                  </div>
                  {groupedResults.specializations.map((item, idx) => (
                    <div key={`spec-${item.id}-${idx}`}
                      onClick={() => handleSelect('specialization', item.id, item.name)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/30 cursor-pointer transition-colors group">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-800 text-orange-600 dark:text-orange-300">
                        <AssignmentInd fontSize="small" />
                      </div>
                      <p className="text-sm font-semibold theme-text truncate flex-1">{item.name}</p>
                      <span className="text-xs text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                        فتح
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {groupedResults.secretaries.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 px-2 mb-2 text-xs font-bold uppercase tracking-wider theme-text-muted">
                    <Person fontSize="inherit" className="text-indigo-500" /> السكرتارية
                  </div>
                  {groupedResults.secretaries.map((item, idx) => (
                    <div key={`sec-${item.id}-${idx}`}
                      onClick={() => handleSelect('secretary', item.id, item.name)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 cursor-pointer transition-colors group">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300">
                        <Person fontSize="small" />
                      </div>
                      <p className="text-sm font-semibold theme-text truncate flex-1">{item.name}</p>
                      <span className="text-xs text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                        فتح
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchResultsDialog;