import { PredictionResult, PredictionScenario } from "@/types";

// 시나리오별 기본 수익률
export const SCENARIO_BASE_RETURNS = {
  optimistic: 0.25, // 25% 연간 수익률
  realistic: 0.12, // 12% 연간 수익률
  pessimistic: -0.05, // -5% 연간 수익률
} as const;

// 시나리오별 변동성 승수
export const VOLATILITY_MULTIPLIERS = {
  optimistic: 0.8, // 변동성 20% 감소
  realistic: 1.0, // 기본 변동성
  pessimistic: 1.3, // 변동성 30% 증가
} as const;

// 시나리오별 확률
export const SCENARIO_PROBABILITIES = {
  optimistic: 25,
  realistic: 60,
  pessimistic: 15,
} as const;

/**
 * 예측 시나리오 데이터를 생성합니다
 * @param type 시나리오 타입
 * @param baseReturn 기본 수익률
 * @param initialInvestment 초기 투자금
 * @returns 예측 시나리오 데이터
 */
export const generatePredictionScenario = (
  type: "optimistic" | "realistic" | "pessimistic",
  baseReturn: number,
  initialInvestment: number
): PredictionScenario => {
  const data = [];
  const forecastDays = 365;
  let value = initialInvestment;

  for (let i = 0; i <= forecastDays; i += 7) {
    const currentDate = new Date(Date.now() + i * 24 * 60 * 60 * 1000);

    // 시나리오별 변동성 조정
    const volatilityMultiplier = VOLATILITY_MULTIPLIERS[type];
    const volatility = 0.12 * volatilityMultiplier;
    const trend = baseReturn / 365;

    // 기하 브라운 운동을 이용한 가격 변동 시뮬레이션
    const noise = ((Math.random() - 0.5) * volatility) / Math.sqrt(365);
    const dailyReturn = trend + noise;
    value *= 1 + dailyReturn;

    // 시간이 지날수록 불확실성 증가
    const uncertainty = Math.abs(baseReturn) * 0.15 * (i / forecastDays);

    data.push({
      date: currentDate.toISOString().split("T")[0],
      value: Math.round(value),
      upperBound: Math.round(value * (1 + uncertainty)),
      lowerBound: Math.round(value * (1 - uncertainty)),
    });
  }

  // 시나리오별 최대 낙폭 계산
  const maxDrawdownMap = {
    pessimistic: -28.5,
    realistic: -15.7,
    optimistic: -8.2,
  };

  return {
    expectedReturn: baseReturn * 100,
    expectedVolatility: 15.2,
    maxDrawdown: maxDrawdownMap[type],
    probability: SCENARIO_PROBABILITIES[type],
    forecastData: data,
  };
};

/**
 * AI 신뢰도를 계산합니다
 * @param selectedETFsCount 선택된 ETF 수
 * @param portfolioComplexity 포트폴리오 복잡성
 * @returns 신뢰도 (0-100)
 */
export const calculateConfidence = (
  selectedETFsCount: number,
  portfolioComplexity: number = 1
): number => {
  // 기본 신뢰도
  let confidence = 75;

  // ETF 다각화에 따른 신뢰도 조정
  if (selectedETFsCount >= 5) {
    confidence += 10; // 높은 다각화
  } else if (selectedETFsCount >= 3) {
    confidence += 5; // 중간 다각화
  } else if (selectedETFsCount === 1) {
    confidence -= 15; // 집중 투자 리스크
  }

  // 포트폴리오 복잡성에 따른 조정
  confidence -= portfolioComplexity * 2;

  // 시장 변동성 고려 (가정값)
  const marketVolatility = Math.random() * 10; // 0-10
  confidence -= marketVolatility;

  return Math.max(45, Math.min(95, Math.round(confidence)));
};

/**
 * 주요 영향 요인을 생성합니다
 * @returns 영향 요인 배열
 */
export const generateKeyFactors = (): string[] => {
  const allFactors = [
    "경제 성장률 둔화 예상",
    "인플레이션 안정화 신호",
    "중앙은행 금리 정책 변화",
    "지정학적 리스크 완화",
    "기업 실적 개선 기대",
    "원자재 가격 변동",
    "달러 강세/약세 전환",
    "신흥국 경제 불안정",
    "기술주 밸류에이션 조정",
    "ESG 투자 트렌드 확산",
  ];

  // 랜덤하게 5개 선택
  const shuffled = allFactors.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 5);
};

/**
 * AI 추천사항을 생성합니다
 * @param selectedETFsCount 선택된 ETF 수
 * @returns 추천사항 배열
 */
export const generateRecommendations = (
  selectedETFsCount: number
): string[] => {
  const baseRecommendations = [
    "포트폴리오 다각화를 통한 리스크 분산 권장",
    "단기 변동성에 대비한 현금 비중 유지",
    "섹터별 로테이션 전략 검토",
  ];

  const additionalRecommendations = [];

  if (selectedETFsCount < 3) {
    additionalRecommendations.push("ETF 종목 수 확대를 통한 리스크 분산 필요");
  }

  if (selectedETFsCount >= 5) {
    additionalRecommendations.push("성장주 비중 확대 고려");
    additionalRecommendations.push("국제 분산투자 비중 검토");
  } else {
    additionalRecommendations.push("헬스케어 및 기술주 비중 조정 고려");
  }

  return [...baseRecommendations, ...additionalRecommendations];
};

/**
 * 트렌드 분석을 생성합니다
 * @returns 시간별 트렌드 분석
 */
export const generateTrendAnalysis = () => {
  // 실제로는 거시경제 데이터를 분석하지만, 현재는 시뮬레이션
  return {
    shortTerm: "neutral" as const, // 단기는 보통 중립적
    mediumTerm: "bullish" as const, // 중기는 긍정적
    longTerm: "bullish" as const, // 장기는 긍정적
  };
};

/**
 * 완전한 AI 예측 결과를 생성합니다
 * @param strategyId 전략 ID
 * @param selectedETFsCount 선택된 ETF 수
 * @param initialInvestment 초기 투자금
 * @returns 완전한 예측 결과
 */
export const generateAIPrediction = (
  strategyId: string,
  selectedETFsCount: number,
  initialInvestment: number
): PredictionResult => {
  return {
    strategyId: `${strategyId}-prediction`,
    predictionDate: new Date().toISOString().split("T")[0],
    forecastPeriod: {
      start: new Date().toISOString().split("T")[0],
      end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    },
    confidence: calculateConfidence(selectedETFsCount),
    keyFactors: generateKeyFactors(),
    recommendations: generateRecommendations(selectedETFsCount),
    trendAnalysis: generateTrendAnalysis(),
    scenarios: {
      optimistic: generatePredictionScenario(
        "optimistic",
        SCENARIO_BASE_RETURNS.optimistic,
        initialInvestment
      ),
      realistic: generatePredictionScenario(
        "realistic",
        SCENARIO_BASE_RETURNS.realistic,
        initialInvestment
      ),
      pessimistic: generatePredictionScenario(
        "pessimistic",
        SCENARIO_BASE_RETURNS.pessimistic,
        initialInvestment
      ),
    },
  };
};
