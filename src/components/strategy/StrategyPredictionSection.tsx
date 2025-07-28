import {
  Brain,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertCircle,
  Lightbulb,
} from "lucide-react";
import PortfolioPerformanceChart from "@/components/strategy/PortfolioPerformanceChart";
import { SimulationSettings, PredictionResult } from "@/types";

interface StrategyPredictionSectionProps {
  isPredicting: boolean;
  predictionResult: PredictionResult | null;
  settings: SimulationSettings;
  onGoToSetup: () => void;
}

export default function StrategyPredictionSection({
  isPredicting,
  predictionResult,
  settings,
  onGoToSetup,
}: StrategyPredictionSectionProps) {
  if (isPredicting) {
    return (
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
    );
  }

  if (!predictionResult) {
    return (
      <div className="text-center py-12">
        <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg text-gray-600">AI 예측 결과가 없습니다</p>
        <p className="text-sm text-gray-500">
          전략 설정 탭에서 AI 예측 분석을 실행해주세요.
        </p>
        <button
          onClick={onGoToSetup}
          className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          전략 설정하기
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
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
                  : predictionResult.trendAnalysis.shortTerm === "bearish"
                  ? "text-red-600"
                  : "text-gray-600"
              }`}
            >
              {predictionResult.trendAnalysis.shortTerm === "bullish" ? (
                <TrendingUp className="h-5 w-5 mr-1" />
              ) : predictionResult.trendAnalysis.shortTerm === "bearish" ? (
                <TrendingDown className="h-5 w-5 mr-1" />
              ) : (
                <Activity className="h-5 w-5 mr-1" />
              )}
              <span className="font-semibold capitalize">
                {predictionResult.trendAnalysis.shortTerm === "bullish"
                  ? "상승"
                  : predictionResult.trendAnalysis.shortTerm === "bearish"
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
                  : predictionResult.trendAnalysis.mediumTerm === "bearish"
                  ? "text-red-600"
                  : "text-gray-600"
              }`}
            >
              {predictionResult.trendAnalysis.mediumTerm === "bullish" ? (
                <TrendingUp className="h-5 w-5 mr-1" />
              ) : predictionResult.trendAnalysis.mediumTerm === "bearish" ? (
                <TrendingDown className="h-5 w-5 mr-1" />
              ) : (
                <Activity className="h-5 w-5 mr-1" />
              )}
              <span className="font-semibold capitalize">
                {predictionResult.trendAnalysis.mediumTerm === "bullish"
                  ? "상승"
                  : predictionResult.trendAnalysis.mediumTerm === "bearish"
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
                  : predictionResult.trendAnalysis.longTerm === "bearish"
                  ? "text-red-600"
                  : "text-gray-600"
              }`}
            >
              {predictionResult.trendAnalysis.longTerm === "bullish" ? (
                <TrendingUp className="h-5 w-5 mr-1" />
              ) : predictionResult.trendAnalysis.longTerm === "bearish" ? (
                <TrendingDown className="h-5 w-5 mr-1" />
              ) : (
                <Activity className="h-5 w-5 mr-1" />
              )}
              <span className="font-semibold capitalize">
                {predictionResult.trendAnalysis.longTerm === "bullish"
                  ? "상승"
                  : predictionResult.trendAnalysis.longTerm === "bearish"
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
                {predictionResult.scenarios.optimistic.maxDrawdown.toFixed(1)}%
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
                {predictionResult.scenarios.realistic.expectedReturn.toFixed(1)}
                %
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">최대 낙폭</span>
              <span className="font-bold text-blue-800">
                {predictionResult.scenarios.realistic.maxDrawdown.toFixed(1)}%
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
                {predictionResult.scenarios.pessimistic.maxDrawdown.toFixed(1)}%
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
          {predictionResult.keyFactors.map((factor: string, index: number) => (
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
          <h2 className="text-xl font-semibold text-gray-900">AI 추천사항</h2>
        </div>
        <div className="space-y-3">
          {predictionResult.recommendations.map(
            (recommendation: string, index: number) => (
              <div
                key={index}
                className="flex items-start p-4 bg-yellow-50 rounded-lg border border-yellow-200"
              >
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
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
            (data: {
              date: string;
              value: number;
              upperBound: number;
              lowerBound: number;
            }) => ({
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
          <strong>면책 고지:</strong> 이 예측은 AI 모델에 의한 분석 결과이며,
          실제 투자 성과를 보장하지 않습니다. 투자 결정 시 전문가와 상담하시기
          바랍니다.
        </p>
      </div>
    </div>
  );
}
