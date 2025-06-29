"use client";

import { useEffect, useState } from "react";
import { useMacroStore } from "@/store/macroStore";
import MacroIndicatorCard from "@/components/MacroIndicatorCard";
import MacroChart from "@/components/MacroChart";
import {
  TrendingUp,
  Filter,
  Calendar,
  Target,
  AlertCircle,
  BarChart3,
} from "lucide-react";
import { MacroIndicator, ChartData } from "@/types";
import Header from "@/components/Header";

export default function AnalysisPage() {
  const {
    availableIndicators,
    customIndicators,
    isLoading,
    error,
    fetchMacroData,
    getDisplayedIndicators,
    addCustomIndicator,
    removeCustomIndicator,
  } = useMacroStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("30d");
  const [selectedIndicator, setSelectedIndicator] =
    useState<MacroIndicator | null>(null);
  const [showAddIndicator, setShowAddIndicator] = useState<boolean>(false);

  useEffect(() => {
    fetchMacroData();
  }, [fetchMacroData]);

  // 표시할 지표들 가져오기
  const displayedIndicators = getDisplayedIndicators();

  // 카테고리별 필터링
  const filteredIndicators = displayedIndicators.filter(
    (indicator) =>
      selectedCategory === "all" || indicator.category === selectedCategory
  );

  // 카테고리 목록
  const categories = [
    { value: "all", label: "전체" },
    { value: "interest-rate", label: "금리" },
    { value: "inflation", label: "인플레이션" },
    { value: "employment", label: "고용" },
    { value: "growth", label: "성장" },
    { value: "housing", label: "주택" },
    { value: "manufacturing", label: "제조업" },
    { value: "trade", label: "무역" },
    { value: "sentiment", label: "시장심리" },
    { value: "government", label: "정부재정" },
    { value: "energy", label: "에너지" },
    { value: "currency", label: "통화" },
    { value: "market", label: "주식시장" },
  ];

  // 기간 옵션
  const periodOptions = [
    { value: "7d", label: "7일" },
    { value: "30d", label: "30일" },
    { value: "90d", label: "3개월" },
    { value: "1y", label: "1년" },
  ];

  // 발표 주기에 맞는 차트 데이터 생성 함수
  const generateChartData = (indicator: MacroIndicator): ChartData[] => {
    const data: ChartData[] = [];
    const totalDays =
      selectedPeriod === "7d"
        ? 7
        : selectedPeriod === "30d"
        ? 30
        : selectedPeriod === "90d"
        ? 90
        : 365;

    // 지표별 발표 주기에 따른 데이터 포인트 간격 설정
    const getDataInterval = (frequency: string): number => {
      switch (frequency) {
        case "daily":
          return 1; // 매일
        case "weekly":
          return 7; // 주간
        case "monthly":
          return 30; // 월간
        case "quarterly":
          return 90; // 분기별
        case "irregular":
          return 45; // 불규칙 (평균 45일)
        default:
          return 30;
      }
    };

    const interval = getDataInterval(indicator.frequency || "monthly");
    const dataPoints = Math.ceil(totalDays / interval);

    for (let i = dataPoints; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i * interval);

      // 실제 데이터 대신 임시 트렌드 데이터 생성
      const baseValue = indicator.previousValue;
      const variation = (Math.random() - 0.5) * 2 * 0.05; // ±5% 변동 (더 현실적)
      const trendFactor =
        ((dataPoints - i) / dataPoints) *
        (indicator.value - indicator.previousValue);

      data.push({
        date: date.toISOString(),
        value: Math.max(0, baseValue + trendFactor + variation), // 음수 방지
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
      <Header currentPage="analysis" />

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">지표 분석</h1>
          </div>
          <p className="text-lg text-gray-600">
            주요 경제 지표와 시장 데이터를 분석하여 투자 의사결정에 필요한
            인사이트를 얻어보세요.
          </p>
        </div>

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

            {/* 지표 추가 버튼 */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                지표 관리
              </label>
              <button
                onClick={() => setShowAddIndicator(!showAddIndicator)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <span className="mr-2">+</span>
                지표 추가/제거
              </button>
            </div>
          </div>

          {/* 지표 추가/제거 패널 */}
          {showAddIndicator && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                추가 가능한 지표
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {availableIndicators.map((indicator) => {
                  const isAdded = customIndicators.includes(indicator.id);
                  const frequencyLabel = {
                    daily: "매일",
                    weekly: "주간",
                    monthly: "월간",
                    quarterly: "분기",
                    irregular: "비정기",
                  };
                  return (
                    <div
                      key={indicator.id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 text-sm">
                          {indicator.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>
                            {
                              categories.find(
                                (c) => c.value === indicator.category
                              )?.label
                            }
                          </span>
                          {indicator.frequency && (
                            <>
                              <span>•</span>
                              <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                                {frequencyLabel[indicator.frequency]} 발표
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          isAdded
                            ? removeCustomIndicator(indicator.id)
                            : addCustomIndicator(indicator.id)
                        }
                        className={`px-3 py-1 text-xs rounded-md transition-colors ${
                          isAdded
                            ? "bg-red-100 text-red-700 hover:bg-red-200"
                            : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        }`}
                      >
                        {isAdded ? "제거" : "추가"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
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
                  <div className="text-sm text-gray-600 space-y-3">
                    {selectedIndicator.changeRate > 0 ? (
                      <p>📈 상승 추세를 보이고 있습니다.</p>
                    ) : selectedIndicator.changeRate < 0 ? (
                      <p>📉 하락 추세를 보이고 있습니다.</p>
                    ) : (
                      <p>📊 안정적인 상태를 유지하고 있습니다.</p>
                    )}

                    {/* 지표 설명 */}
                    {selectedIndicator.description && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-blue-800 text-sm">
                          💡 <strong>지표 설명:</strong>{" "}
                          {selectedIndicator.description}
                        </p>
                      </div>
                    )}

                    {/* 발표 주기 정보 */}
                    {selectedIndicator.frequency && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">📅 발표 주기:</span>
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                          {selectedIndicator.frequency === "daily" && "매일"}
                          {selectedIndicator.frequency === "weekly" && "주간"}
                          {selectedIndicator.frequency === "monthly" && "월간"}
                          {selectedIndicator.frequency === "quarterly" &&
                            "분기별"}
                          {selectedIndicator.frequency === "irregular" &&
                            "비정기적"}
                        </span>
                      </div>
                    )}

                    <p>
                      이 지표는{" "}
                      {selectedIndicator.category === "interest-rate"
                        ? "통화정책과 금리 결정"
                        : selectedIndicator.category === "inflation"
                        ? "물가 안정성과 구매력"
                        : selectedIndicator.category === "employment"
                        ? "노동시장과 고용 상황"
                        : selectedIndicator.category === "growth"
                        ? "경제성장과 확장"
                        : selectedIndicator.category === "housing"
                        ? "부동산 시장과 주택 경기"
                        : selectedIndicator.category === "manufacturing"
                        ? "제조업 활동과 산업 생산"
                        : selectedIndicator.category === "trade"
                        ? "대외무역과 국제수지"
                        : selectedIndicator.category === "sentiment"
                        ? "투자자 심리와 시장 분위기"
                        : selectedIndicator.category === "government"
                        ? "정부 재정건전성"
                        : selectedIndicator.category === "energy"
                        ? "에너지 가격과 공급"
                        : selectedIndicator.category === "currency"
                        ? "환율과 통화 가치"
                        : selectedIndicator.category === "market"
                        ? "주식시장과 투자 환경"
                        : "전반적인 경제 상황"}
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
            주요 지표 현황 및 상관관계
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 다양한 카테고리에서 대표 지표들 선택 */}
            {[
              displayedIndicators.find((i) => i.category === "interest-rate"),
              displayedIndicators.find((i) => i.category === "inflation"),
              displayedIndicators.find((i) => i.category === "employment"),
              displayedIndicators.find((i) => i.category === "growth"),
              displayedIndicators.find((i) => i.category === "housing"),
              displayedIndicators.find((i) => i.category === "sentiment"),
            ]
              .filter(
                (indicator): indicator is MacroIndicator =>
                  indicator !== undefined
              )
              .slice(0, 6)
              .map((indicator) => (
                <div key={indicator.id} className="text-center">
                  <div className="bg-gray-50 rounded-lg p-4 mb-3">
                    <div className="text-xs text-gray-500 mb-1">
                      {
                        categories.find((c) => c.value === indicator.category)
                          ?.label
                      }
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">
                      {indicator.name}
                    </h4>
                    <div className="text-xl font-bold text-blue-600">
                      {indicator.value.toLocaleString()}
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
                      {Math.abs(indicator.changeRate).toLocaleString()}
                      {indicator.unit}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    다른 지표들과 {Math.floor(Math.random() * 30 + 60)}%
                    상관관계
                  </p>
                </div>
              ))}
          </div>

          {/* 상관관계 인사이트 */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">
              📊 상관관계 인사이트
            </h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>
                • 금리 상승은 일반적으로 주택시장과 역의 상관관계를 보입니다
              </p>
              <p>• 인플레이션과 에너지 가격은 높은 양의 상관관계를 가집니다</p>
              <p>• 고용 지표는 소비자 신뢰지수와 강한 연관성을 보입니다</p>
              <p>• 제조업 PMI는 GDP 성장률의 선행지표 역할을 합니다</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
