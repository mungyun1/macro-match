import { MacroIndicator, ETF } from "@/types";
import {
  fetchStockData,
  getMockData,
  type StockData,
} from "@/utils/apiServices";

export async function getMacroData() {
  try {
    // 실제 API 데이터와 모의 데이터를 혼합하여 사용
    const mockData = getMockData();

    // 실제 API에서 가져올 수 있는 데이터들
    let stockData: StockData | null = null;

    try {
      // 주식 데이터 (S&P 500 ETF)
      stockData = await fetchStockData("SPY");
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

    return {
      indicators: coreIndicators,
      featuredETFs: mockETFs,
    };
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "데이터를 불러오는데 실패했습니다."
    );
  }
}
