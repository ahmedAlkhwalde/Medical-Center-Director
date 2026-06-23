import apiClient from '../../../config/apiClient';
import { useQuery } from '@tanstack/react-query';


export const fetchGlobalStatistics = (params = {}) => {
  return apiClient.get('/admin/statistics/global', { params });
};



export const useGlobalStatistics = (params) => {
  return useQuery({
    queryKey: ['globalStatistics', params],
    queryFn: () => fetchGlobalStatistics(params),
    select: (response) => {
      if (response.data?.success) {
        return response.data.data;
      }
      throw new Error(response.data?.message || 'بيانات غير صالحة');
    },
  });
};