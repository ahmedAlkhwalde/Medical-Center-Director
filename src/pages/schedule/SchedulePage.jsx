import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { normalizeSearchText } from "./scheduleFormatters";
import ScheduleHeader from "./components/ScheduleHeader";
import ScheduleFilters from "./components/ScheduleFilters";
import ScheduleList from "./components/ScheduleList";

const SchedulePage = () => {
  const { schedules } = useSelector((state) => state.schedule);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(max-width: 767.98px)");
    const handleChange = (event) => setIsMobile(event.matches);

    setIsMobile(mediaQuery.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  const specialtyOptions = useMemo(
    () =>
      Array.from(new Set(schedules.map((item) => item.doctor.specialization))),
    [schedules],
  );

  const filteredSchedule = useMemo(() => {
    const normalizedQuery = normalizeSearchText(searchQuery);

    return schedules.filter((item) => {
      const matchesSpecialty =
        !selectedSpecialty || item.doctor.specialization === selectedSpecialty;

      const searchableText = normalizeSearchText(
        [item.doctor.name, item.doctor.specialization, item.doctor.clinic].join(
          " ",
        ),
      );

      const matchesSearch =
        !normalizedQuery || searchableText.includes(normalizedQuery);

      return matchesSpecialty && matchesSearch;
    });
  }, [searchQuery, selectedSpecialty, schedules]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedSpecialty("");
  };

  const hasActiveFilters = Boolean(searchQuery || selectedSpecialty);

  return (
    <div className="space-y-6">
      <ScheduleHeader
        schedules={schedules}
        specialtyOptions={specialtyOptions}
      />

      <ScheduleFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedSpecialty={selectedSpecialty}
        onSpecialtyChange={setSelectedSpecialty}
        specialtyOptions={specialtyOptions}
        onResetFilters={handleResetFilters}
      />

      <ScheduleList
        filteredSchedule={filteredSchedule}
        isMobile={isMobile}
        hasActiveFilters={hasActiveFilters}
      />
    </div>
  );
};

export default SchedulePage;
