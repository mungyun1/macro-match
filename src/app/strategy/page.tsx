"use client";

import { useState, useEffect } from "react";
import { useMacroStore } from "@/store/macroStore";
import Header from "@/components/Header";
import {
  Calculator,
  TrendingUp,
  Settings,
  PlayCircle,
  BarChart3,
  DollarSign,
  Target,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { BacktestResult, ETF } from "@/types";

interface SimulationSettings {
  startDate: string;
  endDate: string;
  initialInvestment: number;
  rebalanceFrequency: "monthly" | "quarterly" | "yearly";
  selectedETFs: ETF[];
  allocation: { [key: string]: number };
}

const defaultSettings: SimulationSettings = {
  startDate: "2020-01-01",
  endDate: "2024-01-01",
  initialInvestment: 10000,
  rebalanceFrequency: "quarterly",
  selectedETFs: [],
  allocation: {},
};

export default function StrategySimulatorPage() {
  const { featuredETFs, fetchMacroData, isLoading } = useMacroStore();
  const [settings, setSettings] = useState<SimulationSettings>(defaultSettings);
  const [simulationResult, setSimulationResult] =
    useState<BacktestResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeTab, setActiveTab] = useState<"setup" | "results">("setup");

  useEffect(() => {
    fetchMacroData();
  }, [fetchMacroData]);

  // ETF 선택/해제
  const toggleETFSelection = (etf: ETF) => {
    const isSelected = settings.selectedETFs.some(
      (selected) => selected.id === etf.id
    );

    if (isSelected) {
      const newSelectedETFs = settings.selectedETFs.filter(
        (selected) => selected.id !== etf.id
      );
      const newAllocation = { ...settings.allocation };
      delete newAllocation[etf.id];

      setSettings({
        ...settings,
        selectedETFs: newSelectedETFs,
        allocation: newAllocation,
      });
    } else {
      const newSelectedETFs = [...settings.selectedETFs, etf];
      const equalWeight = Math.round(100 / newSelectedETFs.length);
      const newAllocation = { ...settings.allocation };

      // 기존 비중 재조정
      newSelectedETFs.forEach((selectedETF) => {
        newAllocation[selectedETF.id] = equalWeight;
      });

      setSettings({
        ...settings,
        selectedETFs: newSelectedETFs,
        allocation: newAllocation,
      });
    }
  };

  // 비중 조정
  const updateAllocation = (etfId: string, percentage: number) => {
    setSettings({
      ...settings,
      allocation: {
        ...settings.allocation,
        [etfId]: percentage,
      },
    });
  };

  // 시뮬레이션 실행
  const runSimulation = async () => {
    if (settings.selectedETFs.length === 0) {
      alert("최소 1개 이상의 ETF를 선택해주세요.");
      return;
    }

    const totalAllocation = Object.values(settings.allocation).reduce(
      (sum, val) => sum + val,
      0
    );
    if (Math.abs(totalAllocation - 100) > 0.1) {
      alert("총 비중이 100%가 되도록 조정해주세요.");
      return;
    }

    setIsSimulating(true);
    setActiveTab("results");

    // 모의 백테스트 결과 생성 (실제로는 API 호출)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockResult: BacktestResult = {
      strategyId: "custom-strategy",
      period: {
        start: settings.startDate,
        end: settings.endDate,
      },
      totalReturn: 45.6,
      annualizedReturn: 12.3,
      volatility: 18.7,
      maxDrawdown: -15.2,
      sharpeRatio: 0.85,
      performanceData: generateMockPerformanceData(
        settings.startDate,
        settings.endDate
      ),
    };

    setSimulationResult(mockResult);
    setIsSimulating(false);
  };

  // 모의 성과 데이터 생성
  const generateMockPerformanceData = (startDate: string, endDate: string) => {
    const data = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let value = settings.initialInvestment;

    for (let i = 0; i <= diffDays; i += 30) {
      const currentDate = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
      const volatility = 0.15;
      const dailyReturn = ((Math.random() - 0.5) * volatility) / Math.sqrt(252);
      value *= 1 + dailyReturn;

      data.push({
        date: currentDate.toISOString().split("T")[0],
        value: Math.round(value),
      });
    }

    return data;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="strategy" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Calculator className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">
              전략 시뮬레이터
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            다양한 ETF 조합으로 투자 전략을 백테스트하고 성과를
            시뮬레이션해보세요.
          </p>
        </div>

        {/* 탭 네비게이션 */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab("setup")}
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === "setup"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                전략 설정
              </button>
              <button
                onClick={() => setActiveTab("results")}
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === "results"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                시뮬레이션 결과
              </button>
            </nav>
          </div>
        </div>

        {activeTab === "setup" && (
          <div className="space-y-8">
            {/* 기본 설정 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <Settings className="h-5 w-5 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">
                  기본 설정
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    시작일
                  </label>
                  <input
                    type="date"
                    value={settings.startDate}
                    onChange={(e) =>
                      setSettings({ ...settings, startDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    종료일
                  </label>
                  <input
                    type="date"
                    value={settings.endDate}
                    onChange={(e) =>
                      setSettings({ ...settings, endDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    초기 투자금 ($)
                  </label>
                  <input
                    type="number"
                    value={settings.initialInvestment}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        initialInvestment: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    리밸런싱 주기
                  </label>
                  <select
                    value={settings.rebalanceFrequency}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        rebalanceFrequency: e.target.value as
                          | "monthly"
                          | "quarterly"
                          | "yearly",
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="monthly">월간</option>
                    <option value="quarterly">분기별</option>
                    <option value="yearly">연간</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ETF 선택 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <Target className="h-5 w-5 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">
                  ETF 선택
                </h2>
              </div>

              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">
                    ETF 데이터를 불러오는 중...
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {featuredETFs.map((etf) => {
                    const isSelected = settings.selectedETFs.some(
                      (selected) => selected.id === etf.id
                    );
                    return (
                      <div
                        key={etf.id}
                        onClick={() => toggleETFSelection(etf)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          isSelected
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {etf.symbol}
                          </h3>
                          {isSelected && (
                            <CheckCircle className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{etf.name}</p>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">
                            가격: ${etf.price}
                          </span>
                          <span
                            className={`font-medium ${
                              etf.changeRate >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {etf.changeRate >= 0 ? "+" : ""}
                            {etf.changeRate}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 비중 조정 */}
            {settings.selectedETFs.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    포트폴리오 비중
                  </h2>
                </div>

                <div className="space-y-4">
                  {settings.selectedETFs.map((etf) => (
                    <div
                      key={etf.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <span className="font-medium text-gray-900 mr-2">
                            {etf.symbol}
                          </span>
                          <span className="text-sm text-gray-600">
                            {etf.name}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={settings.allocation[etf.id] || 0}
                          onChange={(e) =>
                            updateAllocation(etf.id, Number(e.target.value))
                          }
                          className="w-32"
                        />
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={settings.allocation[etf.id] || 0}
                          onChange={(e) =>
                            updateAllocation(etf.id, Number(e.target.value))
                          }
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                        />
                        <span className="text-sm text-gray-600">%</span>
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">총 비중</span>
                      <span
                        className={`font-semibold ${
                          Math.abs(
                            Object.values(settings.allocation).reduce(
                              (sum, val) => sum + val,
                              0
                            ) - 100
                          ) < 0.1
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {Object.values(settings.allocation)
                          .reduce((sum, val) => sum + val, 0)
                          .toFixed(1)}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 시뮬레이션 실행 버튼 */}
            <div className="text-center">
              <button
                onClick={runSimulation}
                disabled={settings.selectedETFs.length === 0}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center mx-auto transition-colors"
              >
                <PlayCircle className="h-5 w-5 mr-2" />
                시뮬레이션 실행
              </button>
            </div>
          </div>
        )}

        {activeTab === "results" && (
          <div className="space-y-8">
            {isSimulating ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-lg text-gray-600">
                  시뮬레이션 실행 중...
                </p>
                <p className="text-sm text-gray-500">
                  과거 데이터를 분석하여 성과를 계산하고 있습니다.
                </p>
              </div>
            ) : simulationResult ? (
              <>
                {/* 성과 요약 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center mb-2">
                      <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-gray-600">
                        총 수익률
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      +{simulationResult.totalReturn.toFixed(1)}%
                    </p>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center mb-2">
                      <DollarSign className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-gray-600">
                        연환산 수익률
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">
                      {simulationResult.annualizedReturn.toFixed(1)}%
                    </p>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center mb-2">
                      <AlertCircle className="h-5 w-5 text-orange-600 mr-2" />
                      <span className="text-sm font-medium text-gray-600">
                        최대 낙폭
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-red-600">
                      {simulationResult.maxDrawdown.toFixed(1)}%
                    </p>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center mb-2">
                      <BarChart3 className="h-5 w-5 text-purple-600 mr-2" />
                      <span className="text-sm font-medium text-gray-600">
                        샤프 비율
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">
                      {simulationResult.sharpeRatio.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* 성과 차트 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    포트폴리오 성과
                  </h2>
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">
                        성과 차트가 여기에 표시됩니다
                      </p>
                      <p className="text-sm text-gray-500">
                        실제 구현에서는 Chart.js나 Recharts 등을 사용
                      </p>
                    </div>
                  </div>
                </div>

                {/* 전략 세부 정보 */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    전략 세부 정보
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">
                        선택된 ETF
                      </h3>
                      <div className="space-y-2">
                        {settings.selectedETFs.map((etf) => (
                          <div
                            key={etf.id}
                            className="flex justify-between items-center"
                          >
                            <span className="text-gray-700">{etf.symbol}</span>
                            <span className="font-medium text-blue-600">
                              {settings.allocation[etf.id]}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">
                        백테스트 설정
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">기간:</span>
                          <span className="text-gray-900">
                            {simulationResult.period.start} ~{" "}
                            {simulationResult.period.end}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">초기 투자금:</span>
                          <span className="text-gray-900">
                            ${settings.initialInvestment.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">리밸런싱:</span>
                          <span className="text-gray-900">
                            {settings.rebalanceFrequency === "monthly"
                              ? "월간"
                              : settings.rebalanceFrequency === "quarterly"
                              ? "분기별"
                              : "연간"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-gray-600">
                  시뮬레이션 결과가 없습니다
                </p>
                <p className="text-sm text-gray-500">
                  전략 설정 탭에서 시뮬레이션을 실행해주세요.
                </p>
                <button
                  onClick={() => setActiveTab("setup")}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  전략 설정하기
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
