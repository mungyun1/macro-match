// 거시경제 지표 타입
export interface MacroIndicator {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  changeRate: number;
  updatedAt?: string; // 기존 호환성을 위해 optional로 변경
  lastUpdated?: string; // 새로운 필드
  unit: string;
  category:
    | "interest-rate"
    | "inflation"
    | "employment"
    | "energy"
    | "currency"
    | "growth"
    | "housing"
    | "trade"
    | "sentiment"
    | "manufacturing"
    | "government"
    | "market";
  frequency?: "daily" | "weekly" | "monthly" | "quarterly" | "irregular"; // 발표 주기
  description?: string; // 지표 설명
  isRealTime?: boolean; // 실시간 데이터 여부
}

// ETF 타입
export interface ETF {
  id: string;
  symbol: string;
  name: string;
  category: string;
  price: number;
  changeRate: number;
  volume: number;
  marketCap: number;
  expense: number;
  description: string;
  risk: "low" | "medium" | "high";
  correlationFactors: string[];
}

// 투자 전략 타입
export interface InvestmentStrategy {
  id: string;
  name: string;
  description: string;
  recommendedETFs: ETF[];
  macroConditions: {
    indicatorId: string;
    condition: "rising" | "falling" | "stable";
    threshold?: number;
  }[];
  expectedReturn: number;
  riskLevel: "low" | "medium" | "high";
  createdAt: string;
}

// 사용자 포트폴리오 타입
export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  strategies: InvestmentStrategy[];
  totalValue: number;
  performance: {
    return: number;
    period: string;
  }[];
  lastRebalanced: string;
}

// 백테스트 결과 타입
export interface BacktestResult {
  strategyId: string;
  period: {
    start: string;
    end: string;
  };
  totalReturn: number;
  annualizedReturn: number;
  volatility: number;
  maxDrawdown: number;
  sharpeRatio: number;
  performanceData: {
    date: string;
    value: number;
  }[];
}

// 차트 데이터 타입
export interface ChartData {
  date: string;
  value: number;
  [key: string]: string | number;
}

// 사용자 설정 타입
export interface UserSettings {
  userId: string;
  notifications: {
    priceAlerts: boolean;
    portfolioRebalancing: boolean;
    macroIndicatorChanges: boolean;
  };
  riskTolerance: "conservative" | "moderate" | "aggressive";
  investmentGoal: "growth" | "income" | "balanced";
  premiumSubscription: boolean;
}

// AI 예측 결과 타입
export interface PredictionResult {
  strategyId: string;
  predictionDate: string;
  forecastPeriod: {
    start: string;
    end: string;
  };
  scenarios: {
    optimistic: PredictionScenario;
    realistic: PredictionScenario;
    pessimistic: PredictionScenario;
  };
  confidence: number; // 0-100 신뢰도
  keyFactors: string[]; // 주요 영향 요인
  recommendations: string[]; // AI 추천사항
  trendAnalysis: {
    shortTerm: "bullish" | "bearish" | "neutral";
    mediumTerm: "bullish" | "bearish" | "neutral";
    longTerm: "bullish" | "bearish" | "neutral";
  };
}

// 시나리오별 예측 데이터
export interface PredictionScenario {
  expectedReturn: number;
  expectedVolatility: number;
  maxDrawdown: number;
  probability: number; // 시나리오 발생 확률
  forecastData: {
    date: string;
    value: number;
    upperBound: number;
    lowerBound: number;
  }[];
}

// AI 모델 정보
export interface AIModelInfo {
  modelName: string;
  version: string;
  trainedOn: string;
  accuracy: number;
  lastUpdated: string;
  features: string[]; // 사용된 특성들
}
