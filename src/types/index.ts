// 거시경제 지표 타입
export interface MacroIndicator {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  changeRate: number;
  updatedAt: string;
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
