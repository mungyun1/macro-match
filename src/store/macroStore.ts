import { create } from "zustand";
import { MacroIndicator, ETF, InvestmentStrategy } from "@/types";
import {
  fetchStockData,
  fetchCurrencyData,
  fetchOilPrice,
  getMockData,
  type StockData,
  type CurrencyData,
} from "@/utils/apiServices";

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
      // 실제 API 데이터와 모의 데이터를 혼합하여 사용
      const mockData = getMockData();

      // 실제 API에서 가져올 수 있는 데이터들
      let stockData: StockData | null = null;
      let currencyData: CurrencyData | null = null;
      let oilPrice: number | null = null;

      try {
        // 주식 데이터 (S&P 500 ETF)
        stockData = await fetchStockData("SPY");

        // 환율 데이터
        currencyData = await fetchCurrencyData("USD");

        // 원유 가격
        oilPrice = await fetchOilPrice();
      } catch (apiError) {
        console.warn("API 호출 실패, 모의 데이터 사용:", apiError);
      }

      // 기본 필수 지표들 (실제 데이터와 모의 데이터 혼합)
      const coreIndicators: MacroIndicator[] = [
        {
          id: "1",
          name: "기준금리",
          value: 3.5,
          previousValue: 3.25,
          changeRate: 0.25,
          updatedAt: new Date().toISOString(),
          unit: "%",
          category: "interest-rate",
          frequency: "irregular",
          description:
            "연방준비제도 이사회(Fed)에서 결정하는 정책금리 (FOMC 회의시마다 발표)",
        },
        {
          id: "4",
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
          id: "7",
          name: "실업률",
          value: 3.8,
          previousValue: 4.1,
          changeRate: -0.3,
          updatedAt: new Date().toISOString(),
          unit: "%",
          category: "employment",
          frequency: "monthly",
          description: "경제활동인구 중 실업자가 차지하는 비율",
        },
        {
          id: "10",
          name: "GDP 성장률(연환산)",
          value: 2.1,
          previousValue: 1.8,
          changeRate: 0.3,
          updatedAt: new Date().toISOString(),
          unit: "%",
          category: "growth",
          frequency: "quarterly",
          description: "국내총생산의 전년 동기 대비 성장률 (분기별 발표)",
        },
        {
          id: "31",
          name: "S&P 500 지수",
          value: stockData?.price || mockData.stocks.SPY.price,
          previousValue:
            (stockData?.price || mockData.stocks.SPY.price) -
            (stockData?.change || mockData.stocks.SPY.change),
          changeRate: stockData?.change || mockData.stocks.SPY.change,
          updatedAt: stockData?.timestamp || mockData.stocks.SPY.timestamp,
          unit: "포인트",
          category: "market",
          frequency: "daily",
          description: "미국 대표 500개 기업의 주가를 반영한 주식시장 지수",
        },
      ];

      // 추가 가능한 모든 지표들 (기본 지표 제외)
      const additionalIndicators: MacroIndicator[] = [
        // 금리 관련 지표 (기준금리는 기본 지표이므로 제외)
        {
          id: "2",
          name: "10년 국채 수익률",
          value: 4.1,
          previousValue: 3.9,
          changeRate: 0.2,
          updatedAt: new Date().toISOString(),
          unit: "%",
          category: "interest-rate",
          frequency: "daily",
          description: "10년 만기 미국 국채의 수익률 (채권시장에서 매일 결정)",
        },
        {
          id: "3",
          name: "2년-10년 금리 스프레드",
          value: 0.8,
          previousValue: 0.6,
          changeRate: 0.2,
          updatedAt: new Date().toISOString(),
          unit: "%",
          category: "interest-rate",
          frequency: "daily",
          description: "단기-장기 금리차이로 경기 선행지표 역할",
        },

        // 인플레이션 지표 (CPI는 기본 지표이므로 제외)
        {
          id: "5",
          name: "핵심 소비자물가지수",
          value: 2.8,
          previousValue: 3.1,
          changeRate: -0.3,
          updatedAt: new Date().toISOString(),
          unit: "%",
          category: "inflation",
          frequency: "monthly",
          description: "식료품과 에너지를 제외한 CPI (변동성이 큰 항목 제외)",
        },
        {
          id: "6",
          name: "생산자물가지수(PPI)",
          value: 2.5,
          previousValue: 2.9,
          changeRate: -0.4,
          updatedAt: new Date().toISOString(),
          unit: "%",
          category: "inflation",
          frequency: "monthly",
          description: "생산자단계의 물가 변동을 측정하는 지표",
        },

        // 고용 지표 (실업률은 기본 지표이므로 제외)
        {
          id: "8",
          name: "비농업 부문 고용 증가",
          value: 225000,
          previousValue: 180000,
          changeRate: 45000,
          updatedAt: new Date().toISOString(),
          unit: "명",
          category: "employment",
          frequency: "monthly",
          description: "농업 외 부문의 월별 고용 변화 (매월 첫째 금요일 발표)",
        },
        {
          id: "9",
          name: "고용참가율",
          value: 62.8,
          previousValue: 62.5,
          changeRate: 0.3,
          updatedAt: new Date().toISOString(),
          unit: "%",
          category: "employment",
          frequency: "monthly",
          description: "15세 이상 인구 중 경제활동인구의 비율",
        },

        // 성장 지표 (GDP는 기본 지표이므로 제외)
        {
          id: "11",
          name: "개인소비지출(PCE)",
          value: 1.9,
          previousValue: 2.2,
          changeRate: -0.3,
          updatedAt: new Date().toISOString(),
          unit: "%",
          category: "growth",
          frequency: "monthly",
          description:
            "개인의 상품 및 서비스 소비 지출 (Fed 선호 인플레이션 지표)",
        },
        {
          id: "12",
          name: "기업투자",
          value: 3.2,
          previousValue: 2.8,
          changeRate: 0.4,
          updatedAt: new Date().toISOString(),
          unit: "%",
          category: "growth",
          frequency: "quarterly",
          description: "기업의 설비투자 및 연구개발 투자 현황",
        },

        // 주택 지표
        {
          id: "13",
          name: "주택가격지수",
          value: 285.4,
          previousValue: 282.1,
          changeRate: 3.3,
          updatedAt: new Date().toISOString(),
          unit: "포인트",
          category: "housing",
        },
        {
          id: "14",
          name: "신규 주택 착공",
          value: 1430000,
          previousValue: 1380000,
          changeRate: 50000,
          updatedAt: new Date().toISOString(),
          unit: "호",
          category: "housing",
        },
        {
          id: "15",
          name: "기존 주택 판매",
          value: 5200000,
          previousValue: 5350000,
          changeRate: -150000,
          updatedAt: new Date().toISOString(),
          unit: "호",
          category: "housing",
        },

        // 제조업 지표
        {
          id: "16",
          name: "제조업 PMI",
          value: 52.3,
          previousValue: 51.8,
          changeRate: 0.5,
          updatedAt: new Date().toISOString(),
          unit: "포인트",
          category: "manufacturing",
          frequency: "monthly",
          description: "제조업 구매관리자지수 (50 이상시 확장, 이하시 수축)",
        },
        {
          id: "17",
          name: "서비스업 PMI",
          value: 55.1,
          previousValue: 54.5,
          changeRate: 0.6,
          updatedAt: new Date().toISOString(),
          unit: "포인트",
          category: "manufacturing",
          frequency: "monthly",
          description: "서비스업 구매관리자지수 (경기 선행지표 역할)",
        },
        {
          id: "18",
          name: "산업생산지수",
          value: 102.8,
          previousValue: 101.9,
          changeRate: 0.9,
          updatedAt: new Date().toISOString(),
          unit: "포인트",
          category: "manufacturing",
        },

        // 무역 지표
        {
          id: "19",
          name: "무역수지",
          value: -68.9,
          previousValue: -73.1,
          changeRate: 4.2,
          updatedAt: new Date().toISOString(),
          unit: "십억 달러",
          category: "trade",
        },
        {
          id: "20",
          name: "수출증가율",
          value: 2.8,
          previousValue: 1.5,
          changeRate: 1.3,
          updatedAt: new Date().toISOString(),
          unit: "%",
          category: "trade",
        },
        {
          id: "21",
          name: "수입증가율",
          value: 1.9,
          previousValue: 2.3,
          changeRate: -0.4,
          updatedAt: new Date().toISOString(),
          unit: "%",
          category: "trade",
        },

        // 시장 심리 지표
        {
          id: "22",
          name: "소비자 신뢰지수",
          value: 108.3,
          previousValue: 105.7,
          changeRate: 2.6,
          updatedAt: new Date().toISOString(),
          unit: "포인트",
          category: "sentiment",
        },
        {
          id: "23",
          name: "소비자 현재상황지수",
          value: 142.5,
          previousValue: 139.8,
          changeRate: 2.7,
          updatedAt: new Date().toISOString(),
          unit: "포인트",
          category: "sentiment",
        },
        {
          id: "24",
          name: "VIX 공포지수",
          value: 18.2,
          previousValue: 21.5,
          changeRate: -3.3,
          updatedAt: new Date().toISOString(),
          unit: "포인트",
          category: "sentiment",
          frequency: "daily",
          description: "주식시장 변동성 지수 (투자자 불안 심리 측정)",
        },

        // 정부 지표
        {
          id: "25",
          name: "정부부채 비율",
          value: 98.2,
          previousValue: 96.8,
          changeRate: 1.4,
          updatedAt: new Date().toISOString(),
          unit: "%",
          category: "government",
          frequency: "quarterly",
          description: "GDP 대비 정부 부채 비율 (재정건전성 지표)",
        },
        {
          id: "26",
          name: "재정수지 비율",
          value: -5.8,
          previousValue: -6.2,
          changeRate: 0.4,
          updatedAt: new Date().toISOString(),
          unit: "%",
          category: "government",
        },

        // 에너지 지표
        {
          id: "27",
          name: "WTI 원유가격",
          value: oilPrice || mockData.oilPrice,
          previousValue: (oilPrice || mockData.oilPrice) - 3.2,
          changeRate: 3.2,
          updatedAt: new Date().toISOString(),
          unit: "달러/배럴",
          category: "energy",
          frequency: "daily",
          description: "서부텍사스원유 선물가격 (글로벌 에너지 가격 기준)",
        },
        {
          id: "28",
          name: "천연가스 가격",
          value: 2.45,
          previousValue: 2.68,
          changeRate: -0.23,
          updatedAt: new Date().toISOString(),
          unit: "달러/MMBtu",
          category: "energy",
          frequency: "daily",
          description: "천연가스 선물가격 (에너지 인플레이션 영향)",
        },

        // 통화 지표
        {
          id: "29",
          name: "달러인덱스(DXY)",
          value: 103.8,
          previousValue: 105.2,
          changeRate: -1.4,
          updatedAt: new Date().toISOString(),
          unit: "포인트",
          category: "currency",
          frequency: "daily",
          description: "주요 6개국 통화 대비 달러의 상대적 가치",
        },
        {
          id: "30",
          name: "원달러 환율",
          value: currencyData?.rates.KRW || mockData.currency.rates.KRW,
          previousValue:
            (currencyData?.rates.KRW || mockData.currency.rates.KRW) - 7,
          changeRate: 7,
          updatedAt: currencyData?.timestamp || mockData.currency.timestamp,
          unit: "원",
          category: "currency",
          frequency: "daily",
          description: "달러 대비 원화 환율 (무역과 투자에 직접 영향)",
        },

        // 시장 지표 (S&P 500은 기본 지표이므로 제외)
        {
          id: "32",
          name: "나스닥 지수",
          value: mockData.stocks.QQQ.price,
          previousValue: mockData.stocks.QQQ.price - mockData.stocks.QQQ.change,
          changeRate: mockData.stocks.QQQ.change,
          updatedAt: mockData.stocks.QQQ.timestamp,
          unit: "포인트",
          category: "market",
          frequency: "daily",
          description: "기술주 중심의 나스닥 종합지수",
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
