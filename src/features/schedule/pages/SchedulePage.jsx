import React from "react";
import { useSchedule } from "../hooks/useSchedule";
import ScheduleHeader from "../components/ScheduleHeader";
import ScheduleFilters from "../components/ScheduleFilters";
import ScheduleList from "../components/ScheduleList";
import SchedulesLoading from "../components/SchedulesLoading";

const SchedulePage = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedSpecialtyId,
    setSelectedSpecialtyId,
    isMobile,
    specialties,
    schedules,
    isSchedulesLoading,
    isError,
    filteredSchedule,
    handleResetFilters,
    hasActiveFilters,
  } = useSchedule();

  return (
    <div className="space-y-6">
      {/* الهيدر والفلاتر تظهر دائماً ولا تتأثر بالـ Loading الخاص بالجدول */}
      <ScheduleHeader schedules={schedules} specialtyOptions={specialties} />

      <ScheduleFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedSpecialty={selectedSpecialtyId}
        onSpecialtyChange={setSelectedSpecialtyId}
        onResetFilters={handleResetFilters}
        specialties={specialties}
      />

      {/* حصر حالة الـ Loading والـ Error في منطقة الجدول فقط */}
      {isSchedulesLoading ? (
        <SchedulesLoading />
      ) : isError ? (
        <div className="p-8 text-center text-red-500 rounded-4xl border border-red-500/20 bg-red-500/5 font-medium">
          حدث خطأ أثناء جلب جدول المواعيد. يرجى محاولة تحديث الصفحة.
        </div>
      ) : (
        <ScheduleList
          filteredSchedule={filteredSchedule}
          isMobile={isMobile}
          hasActiveFilters={hasActiveFilters}
        />
      )}
    </div>
  );
};

export default SchedulePage;