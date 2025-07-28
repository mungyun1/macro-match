// ETF 실제 데이터 서비스
import { ETF } from "@/types";

// 내부 API 라우트 (CORS 문제 해결)
const ETF_API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/etf-data`
    : "http://localhost:3000/api/etf-data";

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
