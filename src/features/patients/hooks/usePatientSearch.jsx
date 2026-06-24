import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearSelectedPatient } from "../store/patientsSlice";
import { usePatientSearchQuery } from "../service/patientsService";

export const usePatientSearch = () => {
  const dispatch = useDispatch();
  const { selectedPatient } = useSelector((state) => state.patients);
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  // استدعاء بيانات البحث من TanStack Query
  const { data: searchResponse, isLoading, isFetching } = usePatientSearchQuery(localSearchQuery);
  const searchResults = searchResponse?.data || [];

  // تنظيف المريض المحدد عند تحميل الصفحة
  useEffect(() => {
    dispatch(clearSelectedPatient());
    return () => {
      dispatch(clearSelectedPatient());
    };
  }, [dispatch]);

  const handleSearchChange = useCallback((e) => {
    const query = e.target.value;
    setLocalSearchQuery(query);
    setShowSearchResults(!!query.trim());
  }, []);

  const handlePatientSelect = useCallback(() => {
    setShowSearchResults(false);
  }, []);

  const handleBackToSearch = useCallback(() => {
    setShowSearchResults(true);
  }, []);

  const handleResetSearch = useCallback(() => {
    setLocalSearchQuery("");
    setShowSearchResults(false);
  }, []);

  return {
    localSearchQuery,
    setLocalSearchQuery,
    showSearchResults,
    setShowSearchResults,
    searchResults,
    isLoading,
    isFetching,
    selectedPatient,
    handleSearchChange,
    handlePatientSelect,
    handleBackToSearch,
    handleResetSearch,
  };
};