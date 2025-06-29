import { create } from "zustand";
import { MacroIndicator, ETF, InvestmentStrategy } from "@/types";

interface MacroStore {
  // 상태
  indicators: MacroIndicator[];
  featuredETFs: ETF[];
  recommendedStrategies: InvestmentStrategy[];
  isLoading: boolean;
  error: string | null;

  // 액션
  setIndicators: (indicators: MacroIndicator[]) => void;
  setFeaturedETFs: (etfs: ETF[]) => void;
  setRecommendedStrategies: (strategies: InvestmentStrategy[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchMacroData: () => Promise<void>;
  getIndicatorByCategory: (category: string) => MacroIndicator[];
}

export const useMacroStore = create<MacroStore>((set, get) => ({
  // 초기 상태
  indicators: [],
  featuredETFs: [],
  recommendedStrategies: [],
  isLoading: false,
  error: null,

  // 액션 구현
  setIndicators: (indicators) => set({ indicators }),
  setFeaturedETFs: (etfs) => set({ featuredETFs: etfs }),
  setRecommendedStrategies: (strategies) =>
    set({ recommendedStrategies: strategies }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  fetchMacroData: async () => {
    set({ isLoading: true, error: null });
    try {
      // TODO: 실제 API 호출로 대체
      // 임시 목업 데이터
      const mockIndicators: MacroIndicator[] = [
        {
          id: "1",
          name: "기준금리",
          value: 3.5,
          previousValue: 3.25,
          changeRate: 0.25,
          updatedAt: new Date().toISOString(),
          unit: "%",
          category: "interest-rate",
        },
        {
          id: "2",
          name: "소비자물가지수(CPI)",
          value: 3.2,
          previousValue: 3.7,
          changeRate: -0.5,
          updatedAt: new Date().toISOString(),
          unit: "%",
          category: "inflation",
        },
        {
          id: "3",
          name: "실업률",
          value: 3.8,
          previousValue: 4.1,
          changeRate: -0.3,
          updatedAt: new Date().toISOString(),
          unit: "%",
          category: "employment",
        },
      ];

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
        indicators: mockIndicators,
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
}));
