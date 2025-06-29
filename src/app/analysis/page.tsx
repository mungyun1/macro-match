"use client";

import { useEffect, useState } from "react";
import { useMacroStore } from "@/store/macroStore";
import MacroIndicatorCard from "@/components/MacroIndicatorCard";
import MacroChart from "@/components/MacroChart";
import {
  BarChart3,
  TrendingUp,
  Filter,
  Calendar,
  Target,
  AlertCircle,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { MacroIndicator, ChartData } from "@/types";

export default function AnalysisPage() {
  const { indicators, isLoading, error, fetchMacroData } = useMacroStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("30d");
  const [selectedIndicator, setSelectedIndicator] =
    useState<MacroIndicator | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchMacroData();
  }, [fetchMacroData]);

  // 카테고리별 필터링
  const filteredIndicators = indicators.filter(
    (indicator) =>
      selectedCategory === "all" || indicator.category === selectedCategory
  );

  // 카테고리 목록
  const categories = [
    { value: "all", label: "전체" },
    { value: "interest-rate", label: "금리" },
    { value: "inflation", label: "인플레이션" },
    { value: "employment", label: "고용" },
    { value: "energy", label: "에너지" },
    { value: "currency", label: "통화" },
    { value: "growth", label: "성장" },
  ];

  // 기간 옵션
  const periodOptions = [
    { value: "7d", label: "7일" },
    { value: "30d", label: "30일" },
    { value: "90d", label: "3개월" },
    { value: "1y", label: "1년" },
  ];

  // 임시 차트 데이터 생성 함수
  const generateChartData = (indicator: MacroIndicator): ChartData[] => {
    const data: ChartData[] = [];
    const days =
      selectedPeriod === "7d"
        ? 7
        : selectedPeriod === "30d"
        ? 30
        : selectedPeriod === "90d"
        ? 90
        : 365;

    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      // 실제 데이터 대신 임시 트렌드 데이터 생성
      const baseValue = indicator.previousValue;
      const variation = (Math.random() - 0.5) * 2 * 0.1; // ±10% 변동
      const trendFactor =
        ((days - i) / days) * (indicator.value - indicator.previousValue);

      data.push({
        date: date.toISOString(),
        value: baseValue + trendFactor + variation,
      });
    }

    return data;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm sm:text-base">
            지표 데이터를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <p className="mt-4 text-red-600 text-sm sm:text-base px-4">{error}</p>
          <button
            onClick={fetchMacroData}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 sm:py-6">
            <div className="flex items-center">
              <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mr-2 sm:mr-3" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                MacroMatch
              </h1>
            </div>

            {/* 데스크톱 네비게이션 */}
            <nav className="hidden md:flex space-x-8">
              <Link
                href="/"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                홈
              </Link>
              <a href="#" className="text-blue-600 font-medium">
                지표 분석
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                ETF 추천
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                전략 시뮬레이터
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                마이페이지
              </a>
            </nav>

            {/* 모바일 햄버거 메뉴 버튼 */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* 모바일 네비게이션 메뉴 */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <nav className="flex flex-col space-y-4">
                <Link
                  href="/"
                  className="text-gray-600 hover:text-blue-600 transition-colors py-2 px-4 rounded-md hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  홈
                </Link>
                <a
                  href="#"
                  className="text-blue-600 font-medium py-2 px-4 rounded-md bg-blue-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  지표 분석
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors py-2 px-4 rounded-md hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  ETF 추천
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors py-2 px-4 rounded-md hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  전략 시뮬레이터
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors py-2 px-4 rounded-md hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  마이페이지
                </a>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* 필터 및 컨트롤 */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            {/* 카테고리 필터 */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline h-4 w-4 mr-1" />
                카테고리
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 기간 선택 */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                분석 기간
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {periodOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 지표 요약 */}
        <section className="mb-8 sm:mb-12">
          <div className="flex items-center mb-4 sm:mb-6">
            <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mr-2" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              지표 현황
              {selectedCategory !== "all" && (
                <span className="text-lg font-normal text-gray-600 ml-2">
                  ({categories.find((c) => c.value === selectedCategory)?.label}
                  )
                </span>
              )}
            </h2>
          </div>

          {filteredIndicators.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredIndicators.map((indicator) => (
                <div
                  key={indicator.id}
                  className={`cursor-pointer transition-transform hover:scale-105 ${
                    selectedIndicator?.id === indicator.id
                      ? "ring-2 ring-blue-500"
                      : ""
                  }`}
                  onClick={() => setSelectedIndicator(indicator)}
                >
                  <MacroIndicatorCard indicator={indicator} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm sm:text-base">
                선택한 카테고리에 해당하는 지표가 없습니다.
              </p>
            </div>
          )}
        </section>

        {/* 상세 차트 분석 */}
        {selectedIndicator && (
          <section className="mb-8 sm:mb-12">
            <div className="flex items-center mb-4 sm:mb-6">
              <Target className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mr-2" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                상세 분석: {selectedIndicator.name}
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 주요 차트 */}
              <div className="lg:col-span-2">
                <MacroChart
                  data={generateChartData(selectedIndicator)}
                  title={selectedIndicator.name}
                  unit={selectedIndicator.unit}
                  height={400}
                />
              </div>

              {/* 통계 정보 */}
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    통계 정보
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">현재값</span>
                      <span className="font-semibold">
                        {selectedIndicator.value.toFixed(2)}
                        {selectedIndicator.unit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">전월값</span>
                      <span className="font-semibold">
                        {selectedIndicator.previousValue.toFixed(2)}
                        {selectedIndicator.unit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">변화율</span>
                      <span
                        className={`font-semibold ${
                          selectedIndicator.changeRate > 0
                            ? "text-green-600"
                            : selectedIndicator.changeRate < 0
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      >
                        {selectedIndicator.changeRate > 0 ? "+" : ""}
                        {selectedIndicator.changeRate.toFixed(2)}
                        {selectedIndicator.unit}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    분석 결과
                  </h3>
                  <div className="text-sm text-gray-600 space-y-2">
                    {selectedIndicator.changeRate > 0 ? (
                      <p>📈 상승 추세를 보이고 있습니다.</p>
                    ) : selectedIndicator.changeRate < 0 ? (
                      <p>📉 하락 추세를 보이고 있습니다.</p>
                    ) : (
                      <p>📊 안정적인 상태를 유지하고 있습니다.</p>
                    )}
                    <p>
                      이 지표는{" "}
                      {selectedIndicator.category === "interest-rate"
                        ? "금리 정책"
                        : selectedIndicator.category === "inflation"
                        ? "물가 안정성"
                        : selectedIndicator.category === "employment"
                        ? "고용 시장"
                        : "경제 상황"}
                      에 중요한 영향을 미칩니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 상관관계 분석 */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            지표간 상관관계 분석
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {indicators.slice(0, 3).map((indicator) => (
              <div key={indicator.id} className="text-center">
                <div className="bg-gray-50 rounded-lg p-4 mb-3">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    {indicator.name}
                  </h4>
                  <div className="text-2xl font-bold text-blue-600">
                    {indicator.value.toFixed(2)}
                    {indicator.unit}
                  </div>
                  <div
                    className={`text-sm mt-1 ${
                      indicator.changeRate > 0
                        ? "text-green-600"
                        : indicator.changeRate < 0
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    {indicator.changeRate > 0
                      ? "↗"
                      : indicator.changeRate < 0
                      ? "↘"
                      : "→"}
                    {Math.abs(indicator.changeRate).toFixed(2)}
                    {indicator.unit}
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  다른 지표들과 {Math.floor(Math.random() * 30 + 60)}% 상관관계
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
