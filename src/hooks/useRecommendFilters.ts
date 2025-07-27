import { useState, useCallback } from "react";
import { ETF } from "@/types";
import { filterETFs, sortETFs, ITEMS_PER_PAGE } from "@/utils/recommendUtils";

interface UseRecommendFiltersProps {
  etfs: ETF[];
}

interface FilterState {
  searchTerm: string;
  selectedCategory: string;
  selectedRisk: string;
  sortBy: string;
  currentPage: number;
}

export const useRecommendFilters = ({ etfs }: UseRecommendFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    selectedCategory: "all",
    selectedRisk: "all",
    sortBy: "recommended",
    currentPage: 1,
  });

  // 필터링된 ETF 목록
  const filteredETFs = filterETFs(
    etfs,
    filters.searchTerm,
    filters.selectedCategory,
    filters.selectedRisk
  );

  // 정렬된 ETF 목록
  const sortedETFs = sortETFs(filteredETFs, filters.sortBy);

  // 페이지네이션 계산
  const totalPages = Math.ceil(sortedETFs.length / ITEMS_PER_PAGE);
  const startIndex = (filters.currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentETFs = sortedETFs.slice(startIndex, endIndex);

  // 검색어 변경
  const setSearchTerm = useCallback((searchTerm: string) => {
    setFilters((prev) => ({ ...prev, searchTerm, currentPage: 1 }));
  }, []);

  // 카테고리 변경
  const setSelectedCategory = useCallback((selectedCategory: string) => {
    setFilters((prev) => ({ ...prev, selectedCategory, currentPage: 1 }));
  }, []);

  // 위험도 변경
  const setSelectedRisk = useCallback((selectedRisk: string) => {
    setFilters((prev) => ({ ...prev, selectedRisk, currentPage: 1 }));
  }, []);

  // 정렬 변경
  const setSortBy = useCallback((sortBy: string) => {
    setFilters((prev) => ({ ...prev, sortBy, currentPage: 1 }));
  }, []);

  // 페이지 변경
  const setCurrentPage = useCallback((currentPage: number) => {
    setFilters((prev) => ({ ...prev, currentPage }));
  }, []);

  // 필터 초기화
  const resetFilters = useCallback(() => {
    setFilters({
      searchTerm: "",
      selectedCategory: "all",
      selectedRisk: "all",
      sortBy: "recommended",
      currentPage: 1,
    });
  }, []);

  return {
    filters,
    filteredETFs,
    sortedETFs,
    currentETFs,
    totalPages,
    setSearchTerm,
    setSelectedCategory,
    setSelectedRisk,
    setSortBy,
    setCurrentPage,
    resetFilters,
  };
};
