import { create } from "zustand";
import { MacroIndicator, ETF, InvestmentStrategy } from "@/types";

// API 응답 타입 정의
interface MacroDataResponse {
  success: boolean;
  data: MacroIndicator[];
  cached: boolean;
  lastUpdated: string;
  error?: string;
}

interface MacroStore {
  // 상태
  indicators: MacroIndicator[];
  availableIndicators: MacroIndicator[]; // 추가 가능한 모든 지표
  customIndicators: string[]; // 사용자가 추가한 지표 ID들
  featuredETFs: ETF[];
  recommendedStrategies: InvestmentStrategy[];
  isLoading: boolean;
  error: string | null;

  // 액션
  setIndicators: (indicators: MacroIndicator[]) => void;
  setAvailableIndicators: (indicators: MacroIndicator[]) => void;
  addCustomIndicator: (indicatorId: string) => void;
  removeCustomIndicator: (indicatorId: string) => void;
  setFeaturedETFs: (etfs: ETF[]) => void;
  setRecommendedStrategies: (strategies: InvestmentStrategy[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchMacroData: () => Promise<void>;
  getIndicatorByCategory: (category: string) => MacroIndicator[];
  getDisplayedIndicators: () => MacroIndicator[];
}

export const useMacroStore = create<MacroStore>((set, get) => ({
  // 초기 상태
  indicators: [],
  availableIndicators: [],
  customIndicators: [],
  featuredETFs: [],
  recommendedStrategies: [],
  isLoading: false,
  error: null,

  // 액션 구현
  setIndicators: (indicators) => set({ indicators }),
  setAvailableIndicators: (indicators) =>
    set({ availableIndicators: indicators }),
  addCustomIndicator: (indicatorId) => {
    const { customIndicators } = get();
    if (!customIndicators.includes(indicatorId)) {
      set({ customIndicators: [...customIndicators, indicatorId] });
    }
  },
  removeCustomIndicator: (indicatorId) => {
    const { customIndicators } = get();
    set({
      customIndicators: customIndicators.filter((id) => id !== indicatorId),
    });
  },
  setFeaturedETFs: (etfs) => set({ featuredETFs: etfs }),
  setRecommendedStrategies: (strategies) =>
    set({ recommendedStrategies: strategies }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  fetchMacroData: async () => {
    set({ isLoading: true, error: null });
    try {
      console.log("거시경제 데이터 로딩 시작...");

      // 새로운 API 엔드포인트에서 데이터 가져오기
      const response = await fetch("/api/macro-data", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: MacroDataResponse = await response.json();
      console.log("API 응답:", result);

      if (!result.success) {
        throw new Error(result.error || "데이터를 가져오는데 실패했습니다.");
      }

      // API에서 받은 데이터를 기존 구조에 맞게 변환
      const macroData = result.data.map((item: MacroIndicator) => ({
        ...item,
        updatedAt:
          item.lastUpdated || item.updatedAt || new Date().toISOString(),
      }));

      console.log("변환된 거시경제 데이터:", macroData);

      // 기본 지표들 (실시간 데이터 포함)
      const coreIndicators = macroData.filter((indicator: MacroIndicator) =>
        [
          "sp500",
          "usdkrw",
          "wti",
          "treasury-yield",
          "dollar-index",
          "unemployment-rate",
        ].includes(indicator.id)
      );

      // 추가 지표들 (정적 데이터)
      const additionalIndicators: MacroIndicator[] = [
        {
          id: "fed-funds-rate",
          name: "연방기금금리",
          value: 5.25,
          previousValue: 5.0,
          changeRate: 0.25,
          updatedAt: new Date().toISOString(),
          unit: "%",
          category: "interest-rate",
          frequency: "irregular",
          description: "연방준비제도 이사회(Fed)에서 결정하는 정책금리",
        },
        {
          id: "cpi",
          name: "소비자물가지수(CPI)",
          value: 3.2,
          previousValue: 3.7,
          changeRate: -0.5,
          updatedAt: new Date().toISOString(),
          unit: "%",
          category: "inflation",
          frequency: "monthly",
          description:
            "소비자가 구매하는 상품과 서비스의 가격 변동을 측정하는 지표",
        },
        {
          id: "gdp-growth",
          name: "GDP 성장률",
          value: 2.1,
          previousValue: 1.8,
          changeRate: 0.3,
          updatedAt: new Date().toISOString(),
          unit: "%",
          category: "growth",
          frequency: "quarterly",
          description: "국내총생산의 전년 동기 대비 성장률",
        },
      ];

      // ETF 데이터 (기존 모의 데이터 유지)
      const mockETFs: ETF[] = [
        {
          id: "1",
          symbol: "SPY",
          name: "SPDR S&P 500 ETF",
          category: "대형주",
          price: 450.23,
          changeRate: 1.2,
          volume: 45000000,
          marketCap: 400000000000,
          expense: 0.09,
          description: "S&P 500 지수를 추적하는 대표적인 ETF",
          risk: "medium",
          correlationFactors: ["interest-rate", "growth"],
        },
        {
          id: "2",
          symbol: "TLT",
          name: "iShares 20+ Year Treasury Bond ETF",
          category: "장기채권",
          price: 89.45,
          changeRate: -0.8,
          volume: 12000000,
          marketCap: 15000000000,
          expense: 0.15,
          description: "20년 이상 미국 국채 ETF",
          risk: "low",
          correlationFactors: ["interest-rate", "inflation"],
        },
      ];

      set({
        indicators: [...coreIndicators, ...additionalIndicators],
        availableIndicators: additionalIndicators,
        featuredETFs: mockETFs,
        isLoading: false,
      });

      console.log("거시경제 데이터 로딩 완료:", [
        ...coreIndicators,
        ...additionalIndicators,
      ]);
    } catch (error) {
      console.error("거시경제 데이터 로딩 실패:", error);
      set({
        error:
          error instanceof Error
            ? error.message
            : "데이터를 불러오는데 실패했습니다.",
        isLoading: false,
      });
    }
  },

  getIndicatorByCategory: (category) => {
    const { indicators } = get();
    return indicators.filter((indicator) => indicator.category === category);
  },

  getDisplayedIndicators: () => {
    const { indicators, availableIndicators, customIndicators } = get();
    // 기본 지표 + 사용자가 추가한 커스텀 지표들
    const customIndicatorsList = availableIndicators.filter((indicator) =>
      customIndicators.includes(indicator.id)
    );
    return [...indicators, ...customIndicatorsList];
  },
}));
