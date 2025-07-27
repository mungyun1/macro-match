// ETF 실제 데이터 서비스
import { ETF } from "@/types";

// 내부 API 라우트 (CORS 문제 해결)
const ETF_API_BASE_URL = "/api/etf-data";

// ETF 데이터 인터페이스
export interface ETFMarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  timestamp: string;
}

// 내부 API를 통해 ETF 데이터 가져오기
export async function fetchETFData(
  symbol: string
): Promise<ETFMarketData | null> {
  try {
    const response = await fetch(
      `${ETF_API_BASE_URL}?symbol=${symbol}&source=yahoo`
    );

    if (!response.ok) {
      throw new Error(`ETF 데이터를 가져오는데 실패했습니다: ${symbol}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    console.error(`ETF 데이터 가져오기 실패 (${symbol}):`, error);
    return null;
  }
}

// Alpha Vantage에서 ETF 데이터 가져오기 (백업)
export async function fetchETFDataFromAlphaVantage(
  symbol: string
): Promise<ETFMarketData | null> {
  try {
    const response = await fetch(
      `${ETF_API_BASE_URL}?symbol=${symbol}&source=alpha`
    );

    if (!response.ok) {
      throw new Error(`ETF 데이터를 가져오는데 실패했습니다: ${symbol}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    console.error(`Alpha Vantage ETF 데이터 가져오기 실패 (${symbol}):`, error);
    return null;
  }
}

// 여러 ETF 데이터를 한번에 가져오기 (병렬 처리)
export async function fetchMultipleETFData(
  symbols: string[]
): Promise<Record<string, ETFMarketData>> {
  try {
    const response = await fetch(ETF_API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ symbols }),
    });

    if (!response.ok) {
      throw new Error("ETF 데이터를 가져오는데 실패했습니다.");
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    console.error("ETF 데이터 가져오기 실패:", error);
    return {};
  }
}

// ETF 기본 정보 (정적 데이터)
const ETF_BASE_INFO: Record<string, Partial<ETF>> = {
  SPY: {
    name: "SPDR S&P 500 ETF Trust",
    category: "대형주",
    expense: 0.0945,
    description:
      "S&P 500 지수를 추적하는 대표적인 ETF로, 미국 대형주 500개에 분산투자할 수 있습니다.",
    risk: "medium",
    correlationFactors: ["금리", "성장률"],
  },
  QQQ: {
    name: "Invesco QQQ Trust",
    category: "기술주",
    expense: 0.2,
    description:
      "나스닥 100 지수를 추적하는 ETF로, 기술주 중심의 성장주에 투자합니다.",
    risk: "high",
    correlationFactors: ["성장률", "기술혁신"],
  },
  TLT: {
    name: "iShares 20+ Year Treasury Bond ETF",
    category: "장기채권",
    expense: 0.15,
    description:
      "20년 이상 미국 국채에 투자하는 ETF로, 금리 하락시 수익률이 높습니다.",
    risk: "low",
    correlationFactors: ["금리", "인플레이션"],
  },
  GLD: {
    name: "SPDR Gold Shares",
    category: "원자재",
    expense: 0.4,
    description:
      "금 현물 가격을 추적하는 ETF로, 인플레이션 헤지 수단으로 활용됩니다.",
    risk: "medium",
    correlationFactors: ["인플레이션", "달러"],
  },
  VTI: {
    name: "Vanguard Total Stock Market ETF",
    category: "전체주식시장",
    expense: 0.03,
    description:
      "미국 전체 주식시장을 추적하는 ETF로, 대형주부터 소형주까지 포괄적으로 투자합니다.",
    risk: "medium",
    correlationFactors: ["성장률", "경기순환"],
  },
  VEA: {
    name: "Vanguard FTSE Developed Markets ETF",
    category: "선진국주식",
    expense: 0.05,
    description:
      "선진국 주식시장에 투자하는 ETF로, 미국 외 선진국 기업들에 분산투자합니다.",
    risk: "medium",
    correlationFactors: ["글로벌경기", "환율"],
  },
  VWO: {
    name: "Vanguard FTSE Emerging Markets ETF",
    category: "신흥국주식",
    expense: 0.08,
    description:
      "신흥국 주식시장에 투자하는 ETF로, 높은 성장 잠재력을 가진 시장에 투자합니다.",
    risk: "high",
    correlationFactors: ["신흥국성장", "원자재가격"],
  },
  BND: {
    name: "Vanguard Total Bond Market ETF",
    category: "채권",
    expense: 0.035,
    description:
      "미국 전체 채권시장을 추적하는 ETF로, 안정적인 수익을 추구합니다.",
    risk: "low",
    correlationFactors: ["금리", "인플레이션"],
  },
  VNQ: {
    name: "Vanguard Real Estate ETF",
    category: "부동산",
    expense: 0.12,
    description:
      "부동산 투자신탁(REIT)에 투자하는 ETF로, 부동산 시장의 성과를 추적합니다.",
    risk: "medium",
    correlationFactors: ["부동산시장", "금리"],
  },
  XLE: {
    name: "Energy Select Sector SPDR Fund",
    category: "에너지",
    expense: 0.13,
    description:
      "에너지 섹터에 투자하는 ETF로, 원유 가격과 밀접한 관련이 있습니다.",
    risk: "high",
    correlationFactors: ["원유가격", "에너지수요"],
  },
};

// 완전한 ETF 객체 생성
export function createCompleteETF(
  symbol: string,
  marketData: ETFMarketData
): ETF {
  const baseInfo = ETF_BASE_INFO[symbol];

  if (!baseInfo) {
    // 기본 정보가 없는 경우 기본값 사용
    return {
      id: symbol,
      symbol,
      name: symbol,
      category: "기타",
      price: marketData.price || null,
      changeRate: marketData.changePercent || null,
      volume: marketData.volume || null,
      marketCap: marketData.marketCap || null,
      expense: 0.5,
      description: `${symbol} ETF`,
      risk: "medium",
      correlationFactors: ["시장전반"],
    };
  }

  return {
    id: symbol,
    symbol,
    name: baseInfo.name!,
    category: baseInfo.category!,
    price: marketData.price || null,
    changeRate: marketData.changePercent || null,
    volume: marketData.volume || null,
    marketCap: marketData.marketCap || null,
    expense: baseInfo.expense!,
    description: baseInfo.description!,
    risk: baseInfo.risk!,
    correlationFactors: baseInfo.correlationFactors!,
  };
}

// 추천 ETF 목록 가져오기
export async function fetchRecommendedETFs(): Promise<ETF[]> {
  const symbols = Object.keys(ETF_BASE_INFO);
  const marketData = await fetchMultipleETFData(symbols);

  const etfs: ETF[] = [];

  for (const symbol of symbols) {
    const data = marketData[symbol];
    if (data) {
      etfs.push(createCompleteETF(symbol, data));
    }
  }

  return etfs;
}

// 모의 데이터 (API 호출 실패시 사용)
export function getMockETFData(): ETF[] {
  return [
    {
      id: "SPY",
      symbol: "SPY",
      name: "SPDR S&P 500 ETF Trust",
      category: "대형주",
      price: 450.23,
      changeRate: 1.2,
      volume: 45000000,
      marketCap: 400000000000,
      expense: 0.0945,
      description:
        "S&P 500 지수를 추적하는 대표적인 ETF로, 미국 대형주 500개에 분산투자할 수 있습니다.",
      risk: "medium",
      correlationFactors: ["금리", "성장률"],
    },
    {
      id: "QQQ",
      symbol: "QQQ",
      name: "Invesco QQQ Trust",
      category: "기술주",
      price: 380.15,
      changeRate: 2.3,
      volume: 35000000,
      marketCap: 180000000000,
      expense: 0.2,
      description:
        "나스닥 100 지수를 추적하는 ETF로, 기술주 중심의 성장주에 투자합니다.",
      risk: "high",
      correlationFactors: ["성장률", "기술혁신"],
    },
    {
      id: "TLT",
      symbol: "TLT",
      name: "iShares 20+ Year Treasury Bond ETF",
      category: "장기채권",
      price: 89.45,
      changeRate: -0.8,
      volume: 12000000,
      marketCap: 15000000000,
      expense: 0.15,
      description:
        "20년 이상 미국 국채에 투자하는 ETF로, 금리 하락시 수익률이 높습니다.",
      risk: "low",
      correlationFactors: ["금리", "인플레이션"],
    },
    {
      id: "GLD",
      symbol: "GLD",
      name: "SPDR Gold Shares",
      category: "원자재",
      price: 185.67,
      changeRate: 0.5,
      volume: 8000000,
      marketCap: 55000000000,
      expense: 0.4,
      description:
        "금 현물 가격을 추적하는 ETF로, 인플레이션 헤지 수단으로 활용됩니다.",
      risk: "medium",
      correlationFactors: ["인플레이션", "달러"],
    },
    {
      id: "VTI",
      symbol: "VTI",
      name: "Vanguard Total Stock Market ETF",
      category: "전체주식시장",
      price: 245.78,
      changeRate: 1.1,
      volume: 2800000,
      marketCap: 1200000000000,
      expense: 0.03,
      description:
        "미국 전체 주식시장을 추적하는 ETF로, 대형주부터 소형주까지 포괄적으로 투자합니다.",
      risk: "medium",
      correlationFactors: ["성장률", "경기순환"],
    },
    {
      id: "BND",
      symbol: "BND",
      name: "Vanguard Total Bond Market ETF",
      category: "채권",
      price: 78.92,
      changeRate: -0.3,
      volume: 1500000,
      marketCap: 95000000000,
      expense: 0.035,
      description:
        "미국 전체 채권시장을 추적하는 ETF로, 안정적인 수익을 추구합니다.",
      risk: "low",
      correlationFactors: ["금리", "인플레이션"],
    },
  ];
}
