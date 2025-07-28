"use client";

import { useState } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";
import {
  CATEGORIES,
  RISKS,
  getCategoryLabel,
  getRiskLabel,
} from "@/utils/recommendUtils";

interface RecommendFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  selectedRisk: string;
  sortBy: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onRiskChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onReset: () => void;
}

export default function RecommendFilters({
  searchTerm,
  selectedCategory,
  selectedRisk,
  sortBy,
  onSearchChange,
  onCategoryChange,
  onRiskChange,
  onSortChange,
  onReset,
}: RecommendFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* 검색 */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="ETF 이름 또는 심볼 검색..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
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
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {CATEGORIES.map((category) => (
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
            onChange={(e) => onRiskChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {RISKS.map((risk) => (
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
            onChange={(e) => onSortChange(e.target.value)}
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
            onClick={onReset}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            초기화
          </button>
        </div>
      </div>
    </div>
  );
}
