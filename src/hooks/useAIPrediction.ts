import { useState } from "react";
import { PredictionResult, ETF } from "@/types";
import { generateAIPrediction } from "@/utils/aiPrediction";

interface SimulationSettings {
  startDate: string;
  endDate: string;
  initialInvestment: number;
  rebalanceFrequency: "monthly" | "quarterly" | "yearly";
  selectedETFs: ETF[];
  allocation: { [key: string]: number };
}

export const useAIPrediction = () => {
  const [predictionResult, setPredictionResult] =
    useState<PredictionResult | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionError, setPredictionError] = useState<string | null>(null);

  /**
   * AI 예측을 실행합니다
   * @param settings 시뮬레이션 설정
   * @param onComplete 완료 시 실행할 콜백 (선택사항)
   */
  const runPrediction = async (
    settings: SimulationSettings,
    onComplete?: () => void
  ) => {
    // 유효성 검사
    if (settings.selectedETFs.length === 0) {
      setPredictionError("최소 1개 이상의 ETF를 선택해주세요.");
      return false;
    }

    const totalAllocation = Object.values(settings.allocation).reduce(
      (sum, val) => sum + val,
      0
    );
    if (Math.abs(totalAllocation - 100) > 0.1) {
      setPredictionError("총 비중이 100%가 되도록 조정해주세요.");
      return false;
    }

    setIsPredicting(true);
    setPredictionError(null);

    try {
      // AI 예측 분석 실행 (실제로는 ML 모델 API 호출)
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const prediction = generateAIPrediction(
        "custom-strategy",
        settings.selectedETFs.length,
        settings.initialInvestment
      );

      setPredictionResult(prediction);
      onComplete?.();
      return true;
    } catch (error) {
      setPredictionError(
        "예측 분석 중 오류가 발생했습니다. 다시 시도해주세요."
      );
      console.error("AI Prediction Error:", error);
      return false;
    } finally {
      setIsPredicting(false);
    }
  };

  /**
   * 예측 결과를 초기화합니다
   */
  const clearPrediction = () => {
    setPredictionResult(null);
    setPredictionError(null);
  };

  /**
   * 새로운 예측을 위해 상태를 리셋합니다
   */
  const resetPrediction = () => {
    setIsPredicting(false);
    setPredictionResult(null);
    setPredictionError(null);
  };

  /**
   * 현재 예측이 유효한지 확인합니다 (ETF 변경 등으로 인한 무효화 체크)
   * @param currentSettings 현재 설정
   * @returns 예측 유효성
   */
  const isPredictionValid = (currentSettings: SimulationSettings): boolean => {
    if (!predictionResult) return false;

    // 기본적인 검증: ETF가 선택되어 있고 예측이 최근 것인지 확인
    const predictionETFCount = currentSettings.selectedETFs.length;
    const predictionDate = new Date(predictionResult.predictionDate);
    const daysSincePrediction =
      (Date.now() - predictionDate.getTime()) / (1000 * 60 * 60 * 24);

    // ETF가 선택되어 있고, 예측이 7일 이내인 경우 유효
    return predictionETFCount > 0 && daysSincePrediction <= 7;
  };

  /**
   * 예측 결과의 요약 정보를 반환합니다
   */
  const getPredictionSummary = () => {
    if (!predictionResult) return null;

    return {
      confidence: predictionResult.confidence,
      expectedReturn: predictionResult.scenarios.realistic.expectedReturn,
      riskLevel: predictionResult.scenarios.realistic.maxDrawdown,
      recommendationCount: predictionResult.recommendations.length,
      keyFactorCount: predictionResult.keyFactors.length,
      overallTrend: predictionResult.trendAnalysis.longTerm,
    };
  };

  return {
    // 상태
    predictionResult,
    isPredicting,
    predictionError,

    // 액션
    runPrediction,
    clearPrediction,
    resetPrediction,

    // 유틸리티
    isPredictionValid,
    getPredictionSummary,

    // 상태 체크
    hasPrediction: !!predictionResult,
    isReady: !isPredicting && !predictionError,
  };
};
