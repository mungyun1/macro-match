"use client";

import { useState } from "react";
import ETFCard from "@/components/ETFCard";
import { useETFData } from "@/hooks/useETFData";
import {
  Search,
  Filter,
  Info,
  ChevronDown,
  TrendingUp,
  Target,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function RecommendPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRisk, setSelectedRisk] = useState("all");
  const [sortBy, setSortBy] = useState("recommended");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { etfs: allETFs, loading, error, lastUpdated } = useETFData();

  // 페이지당 ETF 개수
  const ITEMS_PER_PAGE = 6;

  // 필터링된 ETF 목록
  const filteredETFs = allETFs.filter((etf) => {
    const matchesSearch =
      etf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      etf.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || etf.category === selectedCategory;
    const matchesRisk = selectedRisk === "all" || etf.risk === selectedRisk;

    return matchesSearch && matchesCategory && matchesRisk;
  });

  // 정렬된 ETF 목록
  const sortedETFs = [...filteredETFs].sort((a, b) => {
    switch (sortBy) {
      case "performance":
        // null 값은 맨 뒤로 정렬
        if (a.changeRate == null && b.changeRate == null) return 0;
        if (a.changeRate == null) return 1;
        if (b.changeRate == null) return -1;
        return b.changeRate - a.changeRate;
      case "volume":
        // null 값은 맨 뒤로 정렬
        if (a.volume == null && b.volume == null) return 0;
        if (a.volume == null) return 1;
        if (b.volume == null) return -1;
        return b.volume - a.volume;
      case "expense":
        // null 값은 맨 뒤로 정렬
        if (a.expense == null && b.expense == null) return 0;
        if (a.expense == null) return 1;
        if (b.expense == null) return -1;
        return a.expense - b.expense;
      default:
        return 0; // 추천순은 기본 순서 유지
    }
  });

  // 페이지네이션 계산
  const totalPages = Math.ceil(sortedETFs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentETFs = sortedETFs.slice(startIndex, endIndex);

  // 필터나 검색이 변경되면 첫 페이지로 이동
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const categories = [
    "all",
    "대형주",
    "기술주",
    "장기채권",
    "원자재",
    "전체주식시장",
    "선진국주식",
    "신흥국주식",
    "채권",
    "부동산",
    "에너지",
  ];
  const risks = ["all", "low", "medium", "high"];

  const getRiskLabel = (risk: string) => {
    const labels = { all: "전체", low: "낮음", medium: "보통", high: "높음" };
    return labels[risk as keyof typeof labels];
  };

  const getCategoryLabel = (category: string) => {
    return category === "all" ? "전체" : category;
  };

  const formatLastUpdated = (date: Date) => {
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 페이지 번호 배열 생성
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // 전체 페이지가 5개 이하면 모두 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 현재 페이지 주변의 페이지들 표시
      let startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      // 끝 페이지 조정
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="mb-4">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">ETF 추천</h1>
          </div>
        </div>
        <p className="text-lg text-gray-600">
          투자 목적과 위험 성향에 맞는 최적의 ETF를 찾아보세요. 검증된 데이터를
          기반으로 맞춤형 ETF 포트폴리오를 추천해드립니다.
        </p>
      </div>

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

      {/* 시장 분석 카드 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-8 border border-blue-100">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              현재 시장 상황 분석
            </h3>
            <p className="text-gray-700 leading-relaxed">
              현재 거시경제 지표를 바탕으로 시장 상황을 분석하여 최적의 ETF를
              추천해드립니다. 금리, 인플레이션, 고용률 등의 지표 변화에 따라
              추천 ETF가 달라질 수 있습니다.
            </p>
          </div>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* 검색 */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="ETF 이름 또는 심볼 검색..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleFilterChange();
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 필터 토글 버튼 (모바일) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="h-4 w-4 mr-2" />
            필터
            <ChevronDown
              className={`h-4 w-4 ml-2 transform transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* 필터 옵션 */}
        <div
          className={`mt-4 grid grid-cols-1 sm:grid-cols-4 gap-4 ${
            showFilters ? "block" : "hidden sm:grid"
          }`}
        >
          {/* 카테고리 필터 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              카테고리
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                handleFilterChange();
              }}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {getCategoryLabel(category)}
                </option>
              ))}
            </select>
          </div>

          {/* 위험도 필터 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              위험도
            </label>
            <select
              value={selectedRisk}
              onChange={(e) => {
                setSelectedRisk(e.target.value);
                handleFilterChange();
              }}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {risks.map((risk) => (
                <option key={risk} value={risk}>
                  {getRiskLabel(risk)}
                </option>
              ))}
            </select>
          </div>

          {/* 정렬 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              정렬
            </label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                handleFilterChange();
              }}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="recommended">추천순</option>
              <option value="performance">수익률순</option>
              <option value="volume">거래량순</option>
              <option value="expense">수수료순</option>
            </select>
          </div>

          {/* 초기화 버튼 */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedRisk("all");
                setSortBy("recommended");
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              초기화
            </button>
          </div>
        </div>
      </div>

      {/* 결과 통계 */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          총{" "}
          <span className="font-semibold text-gray-900">
            {sortedETFs.length}
          </span>
          개의 ETF (페이지 {currentPage} / {totalPages})
        </p>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          {lastUpdated && (
            <span>마지막 업데이트: {formatLastUpdated(lastUpdated)}</span>
          )}
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>실시간 업데이트</span>
          </div>
        </div>
      </div>

      {/* ETF 카드 그리드 */}
      {!loading && currentETFs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentETFs.map((etf) => (
              <ETFCard key={etf.id} etf={etf} />
            ))}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              {/* 이전 페이지 버튼 */}
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                이전
              </button>

              {/* 페이지 번호들 */}
              {getPageNumbers().map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white"
                      : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              {/* 다음 페이지 버튼 */}
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                다음
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          )}
        </>
      ) : (
        !loading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-gray-500 mb-4">
              다른 검색어나 필터 조건을 시도해보세요
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedRisk("all");
                setCurrentPage(1);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              필터 초기화
            </button>
          </div>
        )
      )}
    </div>
  );
}
