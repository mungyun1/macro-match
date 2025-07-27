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
      // 새로운 API 엔드포인트에서 데이터 가져오기
      const response = await fetch("/api/macro-data");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: MacroDataResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error || "데이터를 가져오는데 실패했습니다.");
      }

      // API에서 받은 데이터를 기존 구조에 맞게 변환
      const macroData = result.data.map((item: MacroIndicator) => ({
        ...item,
        updatedAt:
          item.lastUpdated || item.updatedAt || new Date().toISOString(),
      }));

      // 기본 지표들 (실시간 데이터 포함)
      const coreIndicators = macroData.filter((indicator: MacroIndicator) =>
        [
          "sp500",
          "usdkrw",
          "wti",
          "fed-funds-rate",
          "cpi",
          "unemployment-rate",
          "gdp-growth",
        ].includes(indicator.id)
      );

      // 추가 가능한 지표들
      const additionalIndicators = macroData.filter(
        (indicator: MacroIndicator) =>
          ![
            "sp500",
            "usdkrw",
            "wti",
            "fed-funds-rate",
            "cpi",
            "unemployment-rate",
            "gdp-growth",
          ].includes(indicator.id)
      );

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
        indicators: coreIndicators,
        availableIndicators: additionalIndicators,
        featuredETFs: mockETFs,
        isLoading: false,
      });
    } catch (error) {
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
