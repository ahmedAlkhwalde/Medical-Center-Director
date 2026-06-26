import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../config/apiClient"; // تأكد من المسار الصحيح لديك

// خريطة تحويل الأيام
const DAY_MAPPING = {
  "السبت": "saturday",
  "الأحد": "sunday",
  "الاثنين": "monday",
  "الإثنين": "monday",
  "الثلاثاء": "tuesday",
  "الأربعاء": "wednesday",
  "الخميس": "thursday",
  "الجمعة": "friday",
};

/**
 * دالة مرنة ومؤمنة لتحويل بيانات الجداول القادمة من السيرفر
 */
const transformSchedulesData = (payload) => {
  // التخمين الذكي لمكان المصفوفة (سواء كانت مسطحة أو مغلفة داخل data)
  const apiData = Array.isArray(payload) ? payload : (payload?.data || []);
  
  if (!Array.isArray(apiData)) return [];

  const grouped = {};

  apiData.forEach((item) => {
    const doctorUuid = item.doctor?.Doctor_uuid;
    if (!doctorUuid) return;

    const formatTime = (timeStr) => timeStr ? timeStr.replace(" AM", "").replace(" PM", "") : "";
    const dayKey = DAY_MAPPING[item.day] || "saturday";

    if (!grouped[doctorUuid]) {
      grouped[doctorUuid] = {
        id: doctorUuid,
        doctor: {
          name: item.doctor.name,
          specialization: item.doctor.specialization,
          clinic: item.clinic?.name || "العيادة العامة",
        },
        weeklySchedule: {},
        statusNote: item.status_note || "دوام روتيني",
      };
    }

    grouped[doctorUuid].weeklySchedule[dayKey] = {
      start: formatTime(item.start_time),
      end: formatTime(item.end_time),
      label: item.is_modified ? "معدّل" : "روتيني",
    };
  });

  return Object.values(grouped);
};

export const useSchedulesQuery = (specializationId) => {
  return useQuery({
    queryKey: ["schedules", specializationId],
    queryFn: async () => {
      const params = specializationId ? { specialization_uuid: specializationId } : {};
      const response = await apiClient.get("admin/schedules", { params });

      console.log("Schedules data:", specializationId, response.data);
      return response.data;
    },
    // تمرير البيانات مباشرة والدالة ستتولى استخراج المصفوفة بأمان
    select: (data) => transformSchedulesData(data),
    staleTime: 5 * 60 * 1000, 
  });
};