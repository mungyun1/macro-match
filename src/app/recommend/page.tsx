"use client";

import { useState } from "react";
import ETFCard from "@/components/ETFCard";
import Header from "@/components/Header";
import { ETF } from "@/types";
import {
  Search,
  Filter,
  Info,
  ChevronDown,
  TrendingUp,
  Target,
} from "lucide-react";

export default function RecommendPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRisk, setSelectedRisk] = useState("all");
  const [sortBy, setSortBy] = useState("recommended");
  const [showFilters, setShowFilters] = useState(false);

  // ETF 데이터
  const [allETFs] = useState<ETF[]>([
    {
      id: "1",
      symbol: "SPY",
      name: "SPDR S&P 500 ETF",
      category: "대형주",
      price: 450.23,
      changeRate: 1.2,
      volume: 45000000,
      marketCap: 400000000000,
      expense: 0.09,
      description:
        "S&P 500 지수를 추적하는 대표적인 ETF로, 미국 대형주 500개에 분산투자할 수 있습니다.",
      risk: "medium",
      correlationFactors: ["금리", "성장률"],
    },
    {
      id: "2",
      symbol: "TLT",
      name: "iShares 20+ Year Treasury Bond ETF",
      category: "장기채권",
      price: 89.45,
      changeRate: -0.8,
      volume: 12000000,
      marketCap: 15000000000,
      expense: 0.15,
      description:
        "20년 이상 미국 국채에 투자하는 ETF로, 금리 하락시 수익률이 높습니다.",
      risk: "low",
      correlationFactors: ["금리", "인플레이션"],
    },
    {
      id: "3",
      symbol: "QQQ",
      name: "Invesco QQQ Trust",
      category: "기술주",
      price: 380.15,
      changeRate: 2.3,
      volume: 35000000,
      marketCap: 180000000000,
      expense: 0.2,
      description:
        "나스닥 100 지수를 추적하는 ETF로, 기술주 중심의 성장주에 투자합니다.",
      risk: "high",
      correlationFactors: ["성장률", "기술혁신"],
    },
    {
      id: "4",
      symbol: "GLD",
      name: "SPDR Gold Shares",
      category: "원자재",
      price: 185.67,
      changeRate: 0.5,
      volume: 8000000,
      marketCap: 55000000000,
      expense: 0.4,
      description:
        "금 현물 가격을 추적하는 ETF로, 인플레이션 헤지 수단으로 활용됩니다.",
      risk: "medium",
      correlationFactors: ["인플레이션", "달러"],
    },
  ]);

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

  const categories = ["all", "대형주", "기술주", "장기채권", "원자재"];
  const risks = ["all", "low", "medium", "high"];

  const getRiskLabel = (risk: string) => {
    const labels = { all: "전체", low: "낮음", medium: "보통", high: "높음" };
    return labels[risk as keyof typeof labels];
  };

  const getCategoryLabel = (category: string) => {
    return category === "all" ? "전체" : category;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 공통 헤더 */}
      <Header currentPage="etf" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Target className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">ETF 추천</h1>
          </div>
          <p className="text-lg text-gray-600">
            투자 목적과 위험 성향에 맞는 최적의 ETF를 찾아보세요. 검증된
            데이터를 기반으로 맞춤형 ETF 포트폴리오를 추천해드립니다.
          </p>
        </div>
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
                onChange={(e) => setSearchTerm(e.target.value)}
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
                onChange={(e) => setSelectedCategory(e.target.value)}
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
                onChange={(e) => setSelectedRisk(e.target.value)}
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
                onChange={(e) => setSortBy(e.target.value)}
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
              {filteredETFs.length}
            </span>
            개의 ETF
          </p>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <TrendingUp className="h-4 w-4" />
            <span>실시간 업데이트</span>
          </div>
        </div>

        {/* ETF 카드 그리드 */}
        {filteredETFs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredETFs.map((etf) => (
              <ETFCard key={etf.id} etf={etf} />
            ))}
          </div>
        ) : (
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
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              필터 초기화
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
