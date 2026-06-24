import { usePatientHistoryQuery } from "../service/patientsService";
import { useMemo } from "react";

const formatDoctorName = (name = "") => {
  const trimmedName = name.trim();
  return trimmedName.startsWith("د.") ? trimmedName : `د. ${trimmedName}`;
};

const formatBookingSource = (source = "") => {
  const src = source.toLowerCase();
  if (src === "doctor") return "حجز من قبل الطبيب";
  if (src === "secretary") return "حجز من السكرتارية";
  if (src === "patient") return "حجز عبر المريض";
  return "حجز داخلي";
};

export const usePatientRecordDetail = (patient) => {
  const { data: historyResponse, isLoading } = usePatientHistoryQuery(patient?.uuid);

  const patientInfo = useMemo(
    () => historyResponse?.data?.patient_info || patient,
    [historyResponse, patient]
  );

  const visits = useMemo(() => {
    const rawVisits = historyResponse?.data?.visits || [];
    return rawVisits.map((visit) => ({
      ...visit,
      formattedDoctorName: formatDoctorName(visit.doctor?.name),
      formattedVisitDate: new Date(visit.visit_date).toLocaleDateString("ar-SA", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      formattedBookingSource: formatBookingSource(visit.booking_source),
      formattedSpecialization: visit.doctor?.specialization || "غير محدد",
      formattedClinic: visit.doctor?.clinic || "غير محدد",
    }));
  }, [historyResponse]);

  return {
    patientInfo,
    visits,
    isLoading,
  };
};