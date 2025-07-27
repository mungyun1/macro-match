"use client";

import { AlertCircle } from "lucide-react";
import ETFCard from "@/components/ETFCard";
import ETFCardSkeleton from "@/components/ETFCardSkeleton";
import RecommendHeader from "@/components/RecommendHeader";
import MarketAnalysisCard from "@/components/MarketAnalysisCard";
import RecommendFilters from "@/components/RecommendFilters";
import RecommendStats from "@/components/RecommendStats";
import Pagination from "@/components/Pagination";
import EmptyResults from "@/components/EmptyResults";
import { useETFData } from "@/hooks/useETFData";
import { useRecommendFilters } from "@/hooks/useRecommendFilters";

export default function RecommendPage() {
  const { etfs: allETFs, loading, error, lastUpdated } = useETFData();

  const {
    filters,
    currentETFs,
    sortedETFs,
    totalPages,
    setSearchTerm,
    setSelectedCategory,
    setSelectedRisk,
    setSortBy,
    setCurrentPage,
    resetFilters,
  } = useRecommendFilters({ etfs: allETFs });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <RecommendHeader />

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mt-1 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-red-800 mb-1">
                데이터 로드 실패
              </h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <MarketAnalysisCard />

      {/* 검색 및 필터 */}
      <RecommendFilters
        searchTerm={filters.searchTerm}
        selectedCategory={filters.selectedCategory}
        selectedRisk={filters.selectedRisk}
        sortBy={filters.sortBy}
        onSearchChange={setSearchTerm}
        onCategoryChange={setSelectedCategory}
        onRiskChange={setSelectedRisk}
        onSortChange={setSortBy}
        onReset={resetFilters}
      />

      {/* 결과 통계 */}
      <RecommendStats
        totalCount={sortedETFs.length}
        currentPage={filters.currentPage}
        totalPages={totalPages}
        lastUpdated={lastUpdated || undefined}
      />

      {/* ETF 카드 그리드 */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <ETFCardSkeleton key={index} />
          ))}
        </div>
      ) : currentETFs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentETFs.map((etf) => (
              <ETFCard key={etf.id} etf={etf} />
            ))}
          </div>

          {/* 페이지네이션 */}
          <Pagination
            currentPage={filters.currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        !loading && <EmptyResults onReset={resetFilters} />
      )}
    </div>
  );
}
