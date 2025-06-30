"use client";

import { useState, useEffect } from "react";
import { useMacroStore } from "@/store/macroStore";
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
  Brain,
  Zap,
  Lightbulb,
  TrendingDown,
  Activity,
} from "lucide-react";
import { BacktestResult, ETF, PredictionResult } from "@/types";

import PortfolioPerformanceChart from "@/components/PortfolioPerformanceChart";

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
  const [predictionResult, setPredictionResult] =
    useState<PredictionResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "setup" | "results" | "prediction"
  >("setup");

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

  // AI 예측 실행
  const runPrediction = async () => {
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

    setIsPredicting(true);
    setActiveTab("prediction");

    // AI 예측 분석 실행 (실제로는 ML 모델 API 호출)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const mockPrediction: PredictionResult = {
      strategyId: "custom-strategy-prediction",
      predictionDate: new Date().toISOString().split("T")[0],
      forecastPeriod: {
        start: new Date().toISOString().split("T")[0],
        end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      },
      confidence: 78,
      keyFactors: [
        "경제 성장률 둔화 예상",
        "인플레이션 안정화 신호",
        "중앙은행 금리 정책 변화",
        "지정학적 리스크 완화",
        "기업 실적 개선 기대",
      ],
      recommendations: [
        "포트폴리오 다각화를 통한 리스크 분산 권장",
        "성장주 비중 확대 고려",
        "단기 변동성에 대비한 현금 비중 유지",
        "섹터별 로테이션 전략 검토",
      ],
      trendAnalysis: {
        shortTerm: "neutral",
        mediumTerm: "bullish",
        longTerm: "bullish",
      },
      scenarios: {
        optimistic: generatePredictionScenario("optimistic", 0.25),
        realistic: generatePredictionScenario("realistic", 0.12),
        pessimistic: generatePredictionScenario("pessimistic", -0.05),
      },
    };

    setPredictionResult(mockPrediction);
    setIsPredicting(false);
  };

  // 예측 시나리오 데이터 생성
  const generatePredictionScenario = (type: string, baseReturn: number) => {
    const data = [];
    const forecastDays = 365;
    let value = settings.initialInvestment;

    for (let i = 0; i <= forecastDays; i += 7) {
      const currentDate = new Date(Date.now() + i * 24 * 60 * 60 * 1000);

      // 시나리오별 변동성 조정
      const volatilityMultiplier =
        type === "optimistic" ? 0.8 : type === "pessimistic" ? 1.3 : 1.0;
      const volatility = 0.12 * volatilityMultiplier;
      const trend = baseReturn / 365;

      const noise = ((Math.random() - 0.5) * volatility) / Math.sqrt(365);
      const dailyReturn = trend + noise;
      value *= 1 + dailyReturn;

      const uncertainty = Math.abs(baseReturn) * 0.15 * (i / forecastDays);

      data.push({
        date: currentDate.toISOString().split("T")[0],
        value: Math.round(value),
        upperBound: Math.round(value * (1 + uncertainty)),
        lowerBound: Math.round(value * (1 - uncertainty)),
      });
    }

    return {
      expectedReturn: baseReturn * 100,
      expectedVolatility: 15.2,
      maxDrawdown:
        type === "pessimistic" ? -28.5 : type === "optimistic" ? -8.2 : -15.7,
      probability: type === "realistic" ? 60 : type === "optimistic" ? 25 : 15,
      forecastData: data,
    };
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Calculator className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">전략 시뮬레이터</h1>
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
            <button
              onClick={() => setActiveTab("prediction")}
              className={`py-2 px-4 border-b-2 font-medium text-sm flex items-center ${
                activeTab === "prediction"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Brain className="h-4 w-4 mr-1" />
              AI 예측 분석
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
              <h2 className="text-xl font-semibold text-gray-900">기본 설정</h2>
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
              <h2 className="text-xl font-semibold text-gray-900">ETF 선택</h2>
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

          {/* 실행 버튼들 */}
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={runSimulation}
                disabled={settings.selectedETFs.length === 0}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              >
                <PlayCircle className="h-5 w-5 mr-2" />
                백테스트 실행
              </button>
              <button
                onClick={runPrediction}
                disabled={settings.selectedETFs.length === 0}
                className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              >
                <Zap className="h-5 w-5 mr-2" />
                AI 예측 분석
              </button>
            </div>
            <p className="text-sm text-gray-600">
              백테스트는 과거 데이터 기반 성과를, AI 예측은 미래 전망을
              분석합니다
            </p>
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
              <PortfolioPerformanceChart
                performanceData={simulationResult.performanceData}
                initialInvestment={settings.initialInvestment}
              />

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

      {activeTab === "prediction" && (
        <div className="space-y-8">
          {isPredicting ? (
            <div className="text-center py-12">
              <div className="animate-pulse">
                <Brain className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <div className="flex justify-center items-center space-x-2 mb-4">
                  <Activity className="h-6 w-6 text-purple-600 animate-bounce" />
                  <p className="text-xl font-semibold text-gray-700">
                    AI가 분석 중입니다...
                  </p>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• 과거 데이터 패턴 분석</p>
                  <p>• 거시경제 지표 연관성 검토</p>
                  <p>• 시장 트렌드 예측 모델 실행</p>
                  <p>• 리스크 시나리오 생성</p>
                </div>
              </div>
            </div>
          ) : predictionResult ? (
            <>
              {/* AI 분석 헤더 */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Brain className="h-8 w-8 text-purple-600 mr-3" />
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        AI 예측 분석 결과
                      </h2>
                      <p className="text-gray-600">
                        머신러닝 기반 포트폴리오 미래 전망
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">신뢰도</span>
                      <span className="text-2xl font-bold text-purple-600">
                        {predictionResult.confidence}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      예측일: {predictionResult.predictionDate}
                    </p>
                  </div>
                </div>

                {/* 트렌드 분석 */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      단기 (1-3개월)
                    </p>
                    <div
                      className={`flex items-center justify-center ${
                        predictionResult.trendAnalysis.shortTerm === "bullish"
                          ? "text-green-600"
                          : predictionResult.trendAnalysis.shortTerm ===
                            "bearish"
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {predictionResult.trendAnalysis.shortTerm ===
                      "bullish" ? (
                        <TrendingUp className="h-5 w-5 mr-1" />
                      ) : predictionResult.trendAnalysis.shortTerm ===
                        "bearish" ? (
                        <TrendingDown className="h-5 w-5 mr-1" />
                      ) : (
                        <Activity className="h-5 w-5 mr-1" />
                      )}
                      <span className="font-semibold capitalize">
                        {predictionResult.trendAnalysis.shortTerm === "bullish"
                          ? "상승"
                          : predictionResult.trendAnalysis.shortTerm ===
                            "bearish"
                          ? "하락"
                          : "중립"}
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      중기 (3-12개월)
                    </p>
                    <div
                      className={`flex items-center justify-center ${
                        predictionResult.trendAnalysis.mediumTerm === "bullish"
                          ? "text-green-600"
                          : predictionResult.trendAnalysis.mediumTerm ===
                            "bearish"
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {predictionResult.trendAnalysis.mediumTerm ===
                      "bullish" ? (
                        <TrendingUp className="h-5 w-5 mr-1" />
                      ) : predictionResult.trendAnalysis.mediumTerm ===
                        "bearish" ? (
                        <TrendingDown className="h-5 w-5 mr-1" />
                      ) : (
                        <Activity className="h-5 w-5 mr-1" />
                      )}
                      <span className="font-semibold capitalize">
                        {predictionResult.trendAnalysis.mediumTerm === "bullish"
                          ? "상승"
                          : predictionResult.trendAnalysis.mediumTerm ===
                            "bearish"
                          ? "하락"
                          : "중립"}
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      장기 (1년+)
                    </p>
                    <div
                      className={`flex items-center justify-center ${
                        predictionResult.trendAnalysis.longTerm === "bullish"
                          ? "text-green-600"
                          : predictionResult.trendAnalysis.longTerm ===
                            "bearish"
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {predictionResult.trendAnalysis.longTerm === "bullish" ? (
                        <TrendingUp className="h-5 w-5 mr-1" />
                      ) : predictionResult.trendAnalysis.longTerm ===
                        "bearish" ? (
                        <TrendingDown className="h-5 w-5 mr-1" />
                      ) : (
                        <Activity className="h-5 w-5 mr-1" />
                      )}
                      <span className="font-semibold capitalize">
                        {predictionResult.trendAnalysis.longTerm === "bullish"
                          ? "상승"
                          : predictionResult.trendAnalysis.longTerm ===
                            "bearish"
                          ? "하락"
                          : "중립"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 시나리오별 예측 */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 낙관적 시나리오 */}
                <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                  <div className="flex items-center mb-4">
                    <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
                    <h3 className="text-lg font-semibold text-green-800">
                      낙관적 시나리오
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-green-700">예상 수익률</span>
                      <span className="font-bold text-green-800">
                        +
                        {predictionResult.scenarios.optimistic.expectedReturn.toFixed(
                          1
                        )}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">최대 낙폭</span>
                      <span className="font-bold text-green-800">
                        {predictionResult.scenarios.optimistic.maxDrawdown.toFixed(
                          1
                        )}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">발생 확률</span>
                      <span className="font-bold text-green-800">
                        {predictionResult.scenarios.optimistic.probability}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* 현실적 시나리오 */}
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <div className="flex items-center mb-4">
                    <Activity className="h-6 w-6 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-blue-800">
                      현실적 시나리오
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-blue-700">예상 수익률</span>
                      <span className="font-bold text-blue-800">
                        +
                        {predictionResult.scenarios.realistic.expectedReturn.toFixed(
                          1
                        )}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">최대 낙폭</span>
                      <span className="font-bold text-blue-800">
                        {predictionResult.scenarios.realistic.maxDrawdown.toFixed(
                          1
                        )}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">발생 확률</span>
                      <span className="font-bold text-blue-800">
                        {predictionResult.scenarios.realistic.probability}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* 비관적 시나리오 */}
                <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                  <div className="flex items-center mb-4">
                    <TrendingDown className="h-6 w-6 text-red-600 mr-2" />
                    <h3 className="text-lg font-semibold text-red-800">
                      비관적 시나리오
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-red-700">예상 수익률</span>
                      <span className="font-bold text-red-800">
                        {predictionResult.scenarios.pessimistic.expectedReturn.toFixed(
                          1
                        )}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">최대 낙폭</span>
                      <span className="font-bold text-red-800">
                        {predictionResult.scenarios.pessimistic.maxDrawdown.toFixed(
                          1
                        )}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">발생 확률</span>
                      <span className="font-bold text-red-800">
                        {predictionResult.scenarios.pessimistic.probability}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 주요 영향 요인 */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <AlertCircle className="h-5 w-5 text-orange-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    주요 영향 요인
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {predictionResult.keyFactors.map((factor, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                      <span className="text-gray-700">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI 추천사항 */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <Lightbulb className="h-5 w-5 text-yellow-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    AI 추천사항
                  </h2>
                </div>
                <div className="space-y-3">
                  {predictionResult.recommendations.map(
                    (recommendation, index) => (
                      <div
                        key={index}
                        className="flex items-start p-4 bg-yellow-50 rounded-lg border border-yellow-200"
                      >
                        <CheckCircle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{recommendation}</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* 예측 차트 (현실적 시나리오) */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  예측 차트 (현실적 시나리오)
                </h2>
                <PortfolioPerformanceChart
                  performanceData={predictionResult.scenarios.realistic.forecastData.map(
                    (data) => ({
                      date: data.date,
                      value: data.value,
                    })
                  )}
                  initialInvestment={settings.initialInvestment}
                />
              </div>

              {/* 면책 고지 */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  <strong>면책 고지:</strong> 이 예측은 AI 모델에 의한 분석
                  결과이며, 실제 투자 성과를 보장하지 않습니다. 투자 결정 시
                  전문가와 상담하시기 바랍니다.
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg text-gray-600">AI 예측 결과가 없습니다</p>
              <p className="text-sm text-gray-500">
                전략 설정 탭에서 AI 예측 분석을 실행해주세요.
              </p>
              <button
                onClick={() => setActiveTab("setup")}
                className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                전략 설정하기
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
