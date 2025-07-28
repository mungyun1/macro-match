import { MacroIndicator, ETF } from "@/types";

// 거시경제 지표별 ETF 상관관계 정의
interface ETFCorrelation {
  etfId: string;
  correlation: number; // -1 ~ 1 (음의 상관관계 ~ 양의 상관관계)
  impact: "high" | "medium" | "low"; // 영향도
  reasoning: string; // 추천 이유
}

// 지표별 ETF 상관관계 매핑
const INDICATOR_ETF_CORRELATIONS: Record<string, ETFCorrelation[]> = {
  // 금리 관련 지표
  "interest-rate": [
    {
      etfId: "TLT",
      correlation: -0.8,
      impact: "high",
      reasoning: "금리 상승시 장기채권 가격 하락으로 TLT 투자 위험 증가",
    },
    {
      etfId: "BND",
      correlation: -0.6,
      impact: "medium",
      reasoning: "금리 상승시 채권 ETF 가격 하락",
    },
    {
      etfId: "AGG",
      correlation: -0.6,
      impact: "medium",
      reasoning: "금리 상승시 채권 ETF 가격 하락",
    },
    {
      etfId: "SPY",
      correlation: -0.3,
      impact: "medium",
      reasoning: "금리 상승시 주식시장 조정 가능성",
    },
    {
      etfId: "QQQ",
      correlation: -0.4,
      impact: "high",
      reasoning: "금리 상승시 성장주 밸류에이션 부담",
    },
    {
      etfId: "VTI",
      correlation: -0.3,
      impact: "medium",
      reasoning: "금리 상승시 전체 주식시장 조정 가능성",
    },
    {
      etfId: "IVV",
      correlation: -0.3,
      impact: "medium",
      reasoning: "금리 상승시 주식시장 조정 가능성",
    },
  ],
  inflation: [
    {
      etfId: "GLD",
      correlation: 0.7,
      impact: "high",
      reasoning: "인플레이션 헤지 수단으로 금 투자 유리",
    },
    {
      etfId: "SLV",
      correlation: 0.6,
      impact: "medium",
      reasoning: "인플레이션시 실물자산 가치 상승",
    },
    {
      etfId: "VNQ",
      correlation: 0.5,
      impact: "medium",
      reasoning: "인플레이션시 부동산 가치 상승",
    },
    {
      etfId: "XLE",
      correlation: 0.4,
      impact: "medium",
      reasoning: "인플레이션시 에너지 가격 상승",
    },
    {
      etfId: "TLT",
      correlation: -0.6,
      impact: "high",
      reasoning: "인플레이션 상승시 실질 수익률 하락",
    },
    {
      etfId: "BND",
      correlation: -0.5,
      impact: "medium",
      reasoning: "인플레이션 상승시 채권 실질 수익률 하락",
    },
  ],
  employment: [
    {
      etfId: "SPY",
      correlation: -0.6,
      impact: "high",
      reasoning: "고용 개선시 소비 증가로 주식시장 상승",
    },
    {
      etfId: "QQQ",
      correlation: -0.5,
      impact: "medium",
      reasoning: "고용 개선시 기술주 성장 기대",
    },
    {
      etfId: "VTI",
      correlation: -0.4,
      impact: "medium",
      reasoning: "고용 개선시 전체 시장 상승",
    },
    {
      etfId: "IWM",
      correlation: -0.3,
      impact: "medium",
      reasoning: "고용 개선시 소형주 성장 기대",
    },
    {
      etfId: "IVV",
      correlation: -0.6,
      impact: "high",
      reasoning: "고용 개선시 S&P 500 상승",
    },
    {
      etfId: "VB",
      correlation: -0.3,
      impact: "medium",
      reasoning: "고용 개선시 소형주 성장 기대",
    },
  ],
  growth: [
    {
      etfId: "SPY",
      correlation: 0.8,
      impact: "high",
      reasoning: "경제성장시 기업 수익 증가로 주식시장 상승",
    },
    {
      etfId: "QQQ",
      correlation: 0.7,
      impact: "high",
      reasoning: "경제성장시 기술주 성장 가속화",
    },
    {
      etfId: "IWM",
      correlation: 0.6,
      impact: "medium",
      reasoning: "경제성장시 소형주 성장 기대",
    },
    {
      etfId: "VEA",
      correlation: 0.5,
      impact: "medium",
      reasoning: "경제성장시 선진국 주식 상승",
    },
    {
      etfId: "VTI",
      correlation: 0.8,
      impact: "high",
      reasoning: "경제성장시 전체 주식시장 상승",
    },
    {
      etfId: "IVV",
      correlation: 0.8,
      impact: "high",
      reasoning: "경제성장시 S&P 500 상승",
    },
    {
      etfId: "VUG",
      correlation: 0.7,
      impact: "high",
      reasoning: "경제성장시 성장주 상승",
    },
  ],
  energy: [
    {
      etfId: "XLE",
      correlation: 0.9,
      impact: "high",
      reasoning: "원유 가격 상승시 에너지 기업 수익 증가",
    },
    {
      etfId: "USO",
      correlation: 0.8,
      impact: "high",
      reasoning: "원유 가격 직접 추적",
    },
    {
      etfId: "XLI",
      correlation: 0.3,
      impact: "low",
      reasoning: "에너지 비용 상승으로 산업재 부담",
    },
  ],
  currency: [
    {
      etfId: "SPY",
      correlation: 0.4,
      impact: "medium",
      reasoning: "달러 강세시 미국 자산 선호",
    },
    {
      etfId: "UUP",
      correlation: 0.8,
      impact: "high",
      reasoning: "달러 강세 직접 수익",
    },
    {
      etfId: "VEA",
      correlation: -0.3,
      impact: "low",
      reasoning: "달러 강세시 해외 자산 부담",
    },
    {
      etfId: "VTI",
      correlation: 0.4,
      impact: "medium",
      reasoning: "달러 강세시 미국 자산 선호",
    },
    {
      etfId: "IVV",
      correlation: 0.4,
      impact: "medium",
      reasoning: "달러 강세시 미국 자산 선호",
    },
  ],
  market: [
    {
      etfId: "SPY",
      correlation: 0.99,
      impact: "high",
      reasoning: "S&P 500 지수 직접 추적",
    },
    {
      etfId: "IVV",
      correlation: 0.99,
      impact: "high",
      reasoning: "S&P 500 지수 직접 추적 (저비용)",
    },
    {
      etfId: "VTI",
      correlation: 0.95,
      impact: "high",
      reasoning: "전체 주식시장 추적",
    },
  ],
};

function analyzeIndicatorTrend(
  indicator: MacroIndicator
): "bullish" | "bearish" | "neutral" {
  const changeRate = indicator.changeRate;
  if (changeRate > 0.5) return "bullish";
  if (changeRate < -0.5) return "bearish";
  return "neutral";
}

function calculateETFScore(
  etfId: string,
  indicators: MacroIndicator[]
): {
  score: number;
  reasons: string[];
  riskLevel: "low" | "medium" | "high";
} {
  let totalScore = 0;
  const reasons: string[] = [];
  let positiveFactors = 0;
  let negativeFactors = 0;

  // 각 지표별로 ETF 점수 계산
  indicators.forEach((indicator) => {
    const correlations = INDICATOR_ETF_CORRELATIONS[indicator.category];
    if (!correlations) return;

    // ETF ID 대신 symbol로 매칭 (etfId가 symbol과 동일한 경우가 많음)
    const etfCorrelation = correlations.find((c) => c.etfId === etfId);
    if (!etfCorrelation) return;

    const trend = analyzeIndicatorTrend(indicator);
    let factorScore = 0;

    // 상관관계와 트렌드에 따른 점수 계산
    if (etfCorrelation.correlation > 0) {
      // 양의 상관관계
      if (trend === "bullish") {
        factorScore = etfCorrelation.correlation * 10;
        positiveFactors++;
        reasons.push(
          `✅ ${indicator.name} 상승으로 ${etfCorrelation.reasoning}`
        );
      } else if (trend === "bearish") {
        factorScore = -etfCorrelation.correlation * 10;
        negativeFactors++;
        reasons.push(
          `❌ ${indicator.name} 하락으로 ${etfCorrelation.reasoning}`
        );
      }
    } else {
      // 음의 상관관계
      if (trend === "bullish") {
        factorScore = -etfCorrelation.correlation * 10;
        positiveFactors++;
        reasons.push(
          `✅ ${indicator.name} 상승으로 ${etfCorrelation.reasoning}`
        );
      } else if (trend === "bearish") {
        factorScore = etfCorrelation.correlation * 10;
        negativeFactors++;
        reasons.push(
          `❌ ${indicator.name} 하락으로 ${etfCorrelation.reasoning}`
        );
      }
    }

    // 영향도에 따른 가중치 적용
    const impactWeight =
      etfCorrelation.impact === "high"
        ? 1.5
        : etfCorrelation.impact === "medium"
        ? 1.0
        : 0.5;
    totalScore += factorScore * impactWeight;
  });

  // 위험도 계산
  let riskLevel: "low" | "medium" | "high" = "medium";
  if (positiveFactors > negativeFactors * 2) riskLevel = "low";
  else if (negativeFactors > positiveFactors * 2) riskLevel = "high";

  return {
    score: Math.round(totalScore * 10) / 10,
    reasons,
    riskLevel,
  };
}

export function generateETFRecommendation(
  etf: ETF,
  indicators: MacroIndicator[]
): {
  recommendation: "buy" | "hold" | "sell";
  score: number;
  reasons: string[];
  riskLevel: "low" | "medium" | "high";
  summary: string;
  marketOutlook: string;
} {
  const { score, reasons, riskLevel } = calculateETFScore(
    etf.symbol,
    indicators
  );
  let recommendation: "buy" | "hold" | "sell";
  if (score > 5) recommendation = "buy";
  else if (score < -5) recommendation = "sell";
  else recommendation = "hold";
  const bullishIndicators = indicators.filter(
    (i) => analyzeIndicatorTrend(i) === "bullish"
  ).length;
  const bearishIndicators = indicators.filter(
    (i) => analyzeIndicatorTrend(i) === "bearish"
  ).length;
  let marketOutlook = "중립적";
  if (bullishIndicators > bearishIndicators * 1.5) marketOutlook = "긍정적";
  else if (bearishIndicators > bullishIndicators * 1.5)
    marketOutlook = "부정적";
  let summary = "";
  if (recommendation === "buy") {
    summary = `현재 거시경제 지표가 ${etf.name}에 유리한 방향으로 움직이고 있습니다.`;
  } else if (recommendation === "sell") {
    summary = `현재 거시경제 지표가 ${etf.name}에 불리한 방향으로 움직이고 있습니다.`;
  } else {
    summary = `현재 거시경제 지표가 ${etf.name}에 중립적인 영향을 미치고 있습니다.`;
  }
  return {
    recommendation,
    score,
    reasons,
    riskLevel,
    summary,
    marketOutlook,
  };
}

export function analyzeETFInDetail(
  etf: ETF,
  indicators: MacroIndicator[]
): {
  technicalAnalysis: string;
  fundamentalAnalysis: string;
  riskFactors: string[];
  opportunities: string[];
} {
  const recommendation = generateETFRecommendation(etf, indicators);
  let technicalAnalysis = "";
  if (etf.changeRate && etf.changeRate > 0) {
    technicalAnalysis = `${etf.name}은(는) 현재 상승 추세를 보이고 있으며, 거시경제 지표도 이를 뒷받침하고 있습니다.`;
  } else if (etf.changeRate && etf.changeRate < 0) {
    technicalAnalysis = `${etf.name}은(는) 현재 하락 추세를 보이고 있으나, 거시경제 지표 개선으로 반등 가능성이 있습니다.`;
  } else {
    technicalAnalysis = `${etf.name}은(는) 현재 안정적인 움직임을 보이고 있습니다.`;
  }
  let fundamentalAnalysis = "";
  if (recommendation.score > 3) {
    fundamentalAnalysis = `거시경제 환경이 ${etf.name}의 성장에 유리한 조건을 제공하고 있습니다.`;
  } else if (recommendation.score < -3) {
    fundamentalAnalysis = `현재 거시경제 환경이 ${etf.name}의 성장에 불리한 영향을 미치고 있습니다.`;
  } else {
    fundamentalAnalysis = `거시경제 환경이 ${etf.name}에 중립적인 영향을 미치고 있습니다.`;
  }
  const riskFactors = recommendation.reasons
    .filter((reason) => reason.includes("❌"))
    .map((reason) => reason.replace("❌ ", ""));
  const opportunities = recommendation.reasons
    .filter((reason) => reason.includes("✅"))
    .map((reason) => reason.replace("✅ ", ""));
  return {
    technicalAnalysis,
    fundamentalAnalysis,
    riskFactors,
    opportunities,
  };
}
