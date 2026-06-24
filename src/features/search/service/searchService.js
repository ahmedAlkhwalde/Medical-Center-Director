import apiClient from '../../../config/apiClient';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const fetchSearchResults = (query) => {
  return apiClient.get('/admin/search/all', { params: { query } });
};


export const useSearch = (externalQuery) => {
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(externalQuery), 300);
    return () => clearTimeout(timer);
  }, [externalQuery]);

  return useQuery({
    queryKey: ['globalSearch', debouncedQuery],
    queryFn: () => fetchSearchResults(debouncedQuery),
    enabled: debouncedQuery.trim().length >= 1,
    select: (response) => response.data?.data || { doctors: [], specializations: [], patients: [], secretaries: [] },
  });
};


export const useScrollToFromState = () => {
  const location = useLocation();

  useEffect(() => {
    const state = location.state;
    if (state?.scrollTo) {
      const scrollId = state.scrollTo;
      const timer = setTimeout(() => {
        const element = document.querySelector(`[data-scroll-id="${scrollId}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('ring-2', 'ring-teal-500'); // تأثير تمييز مؤقت
          setTimeout(() => {
            element.classList.remove('ring-2', 'ring-teal-500');
          }, 2000);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [location.state]);
};