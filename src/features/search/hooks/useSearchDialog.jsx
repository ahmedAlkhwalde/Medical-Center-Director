import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSearch } from '../service/searchService';

export const useSearchDialog = (query, open, onClose) => {
  const { data, isLoading } = useSearch(query);
  const navigate = useNavigate();
  const currentLocation = useLocation();

  // الاستماع لمفتاح Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
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
    }, 150);
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

    if (currentLocation.pathname === route) {
      scrollToElement(scrollId);
    } else {
      navigate(route, { state: { scrollTo: scrollId } });
    }
  };

  // تجميع النتائج حسب النوع
  const groupedResults = { doctors: [], specializations: [], secretaries: [] };
  if (data) {
    data.doctors?.forEach(d => groupedResults.doctors.push({ id: d.uuid, name: d.name, subtitle: d.specialization }));
    data.specializations?.forEach(s => groupedResults.specializations.push({ id: s.uuid, name: s.name }));
    data.secretaries?.forEach(s => groupedResults.secretaries.push({ id: s.uuid, name: s.name }));
  }

  const totalResults =
    groupedResults.doctors.length + groupedResults.specializations.length + groupedResults.secretaries.length;

  return {
    isLoading,
    groupedResults,
    totalResults,
    handleSelect,
  };
};