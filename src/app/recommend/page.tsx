"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ETFCard from "@/components/recommend/ETFCard";
import ETFCardSkeleton from "@/components/recommend/ETFCardSkeleton";
import RecommendHeader from "@/components/recommend/RecommendHeader";
import MarketAnalysisCard from "@/components/recommend/MarketAnalysisCard";
import RecommendFilters from "@/components/recommend/RecommendFilters";
import RecommendStats from "@/components/recommend/RecommendStats";
import Pagination from "@/components/recommend/Pagination";
import EmptyResults from "@/components/recommend/EmptyResults";
import { useETFData } from "@/hooks/useETFData";
import { useRecommendFilters } from "@/hooks/useRecommendFilters";

export default function RecommendPage() {
  const router = useRouter();
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

  // 에러 발생 시 404 페이지로 리다이렉트
  useEffect(() => {
    if (error && !loading) {
      router.push("/404");
    }
  }, [error, loading, router]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <RecommendHeader />

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
