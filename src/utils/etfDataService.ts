// ETF 실제 데이터 서비스
import { cache } from "react";
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
      `${ETF_API_BASE_URL}?symbol=${symbol}&source=yahoo`,
      {
        next: {
          revalidate: 3600, // 1시간마다 재검증
          tags: [`etf-${symbol}`], // 태그로 캐시 관리
        },
      }
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
  // 대형주 ETF
  SPY: {
    name: "SPDR S&P 500 ETF Trust",
    category: "대형주",
    expense: 0.0945,
    description:
      "S&P 500 지수를 추적하는 대표적인 ETF로, 미국 대형주 500개에 분산투자할 수 있습니다.",
    risk: "medium",
    correlationFactors: ["금리", "성장률"],
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
  IVV: {
    name: "iShares Core S&P 500 ETF",
    category: "대형주",
    expense: 0.03,
    description:
      "S&P 500 지수를 추적하는 저비용 ETF로, SPY의 대안으로 활용됩니다.",
    risk: "medium",
    correlationFactors: ["금리", "성장률"],
  },

  // 기술주 ETF
  QQQ: {
    name: "Invesco QQQ Trust",
    category: "기술주",
    expense: 0.2,
    description:
      "나스닥 100 지수를 추적하는 ETF로, 기술주 중심의 성장주에 투자합니다.",
    risk: "high",
    correlationFactors: ["성장률", "기술혁신"],
  },
  XLK: {
    name: "Technology Select Sector SPDR Fund",
    category: "기술주",
    expense: 0.13,
    description:
      "S&P 500 기술 섹터에 투자하는 ETF로, 기술주에 집중 투자합니다.",
    risk: "high",
    correlationFactors: ["기술혁신", "성장률"],
  },

  // 소형주 ETF
  IWM: {
    name: "iShares Russell 2000 ETF",
    category: "소형주",
    expense: 0.19,
    description: "러셀 2000 지수를 추적하는 ETF로, 미국 소형주에 투자합니다.",
    risk: "high",
    correlationFactors: ["경기순환", "성장률"],
  },
  VB: {
    name: "Vanguard Small-Cap ETF",
    category: "소형주",
    expense: 0.05,
    description:
      "미국 소형주 시장을 추적하는 ETF로, 성장 잠재력이 높은 기업들에 투자합니다.",
    risk: "high",
    correlationFactors: ["경기순환", "성장률"],
  },

  // 국제주식 ETF
  VEA: {
    name: "Vanguard FTSE Developed Markets ETF",
    category: "선진국주식",
    expense: 0.05,
    description:
      "선진국 주식시장에 투자하는 ETF로, 미국 외 선진국 기업들에 분산투자합니다.",
    risk: "medium",
    correlationFactors: ["글로벌경기", "환율"],
  },
  EFA: {
    name: "iShares MSCI EAFE ETF",
    category: "선진국주식",
    expense: 0.32,
    description:
      "MSCI EAFE 지수를 추적하는 ETF로, 유럽, 아시아, 호주 선진국에 투자합니다.",
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
  IEMG: {
    name: "iShares Core MSCI Emerging Markets ETF",
    category: "신흥국주식",
    expense: 0.11,
    description:
      "MSCI Emerging Markets 지수를 추적하는 ETF로, 신흥국 대형주와 중형주에 투자합니다.",
    risk: "high",
    correlationFactors: ["신흥국성장", "원자재가격"],
  },

  // 채권 ETF
  BND: {
    name: "Vanguard Total Bond Market ETF",
    category: "채권",
    expense: 0.035,
    description:
      "미국 전체 채권시장을 추적하는 ETF로, 안정적인 수익을 추구합니다.",
    risk: "low",
    correlationFactors: ["금리", "인플레이션"],
  },
  AGG: {
    name: "iShares Core U.S. Aggregate Bond ETF",
    category: "채권",
    expense: 0.03,
    description:
      "미국 투자등급 채권 시장을 추적하는 ETF로, 안정적인 수익을 제공합니다.",
    risk: "low",
    correlationFactors: ["금리", "인플레이션"],
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
  SHY: {
    name: "iShares 1-3 Year Treasury Bond ETF",
    category: "단기채권",
    expense: 0.15,
    description: "1-3년 미국 국채에 투자하는 ETF로, 단기 안정성을 추구합니다.",
    risk: "low",
    correlationFactors: ["금리", "인플레이션"],
  },

  // 섹터 ETF
  XLE: {
    name: "Energy Select Sector SPDR Fund",
    category: "에너지",
    expense: 0.13,
    description:
      "에너지 섹터에 투자하는 ETF로, 원유 가격과 밀접한 관련이 있습니다.",
    risk: "high",
    correlationFactors: ["원유가격", "에너지수요"],
  },
  XLF: {
    name: "Financial Select Sector SPDR Fund",
    category: "금융",
    expense: 0.13,
    description:
      "금융 섹터에 투자하는 ETF로, 은행, 보험, 투자회사 등에 투자합니다.",
    risk: "medium",
    correlationFactors: ["금리", "경기순환"],
  },
  XLV: {
    name: "Health Care Select Sector SPDR Fund",
    category: "헬스케어",
    expense: 0.13,
    description:
      "헬스케어 섹터에 투자하는 ETF로, 제약, 바이오, 의료기기 등에 투자합니다.",
    risk: "medium",
    correlationFactors: ["인구고령화", "의료혁신"],
  },
  XLI: {
    name: "Industrial Select Sector SPDR Fund",
    category: "산업재",
    expense: 0.13,
    description:
      "산업재 섹터에 투자하는 ETF로, 제조업, 운송, 건설 등에 투자합니다.",
    risk: "medium",
    correlationFactors: ["경기순환", "원자재가격"],
  },

  // 부동산 ETF
  VNQ: {
    name: "Vanguard Real Estate ETF",
    category: "부동산",
    expense: 0.12,
    description:
      "부동산 투자신탁(REIT)에 투자하는 ETF로, 부동산 시장의 성과를 추적합니다.",
    risk: "medium",
    correlationFactors: ["부동산시장", "금리"],
  },
  IYR: {
    name: "iShares U.S. Real Estate ETF",
    category: "부동산",
    expense: 0.42,
    description:
      "미국 부동산 시장을 추적하는 ETF로, 상업용 부동산에 투자합니다.",
    risk: "medium",
    correlationFactors: ["부동산시장", "금리"],
  },

  // 원자재 ETF
  GLD: {
    name: "SPDR Gold Shares",
    category: "원자재",
    expense: 0.4,
    description:
      "금 현물 가격을 추적하는 ETF로, 인플레이션 헤지 수단으로 활용됩니다.",
    risk: "medium",
    correlationFactors: ["인플레이션", "달러"],
  },
  SLV: {
    name: "iShares Silver Trust",
    category: "원자재",
    expense: 0.5,
    description:
      "은 현물 가격을 추적하는 ETF로, 산업용 금속으로서의 가치를 가집니다.",
    risk: "high",
    correlationFactors: ["원자재가격", "산업수요"],
  },
  USO: {
    name: "United States Oil Fund LP",
    category: "원자재",
    expense: 0.83,
    description:
      "WTI 원유 가격을 추적하는 ETF로, 에너지 시장에 직접 투자합니다.",
    risk: "high",
    correlationFactors: ["원유가격", "에너지수요"],
  },

  // 배당주 ETF
  VYM: {
    name: "Vanguard High Dividend Yield ETF",
    category: "배당주",
    expense: 0.06,
    description: "높은 배당 수익률을 제공하는 주식에 투자하는 ETF입니다.",
    risk: "medium",
    correlationFactors: ["배당수익률", "경기순환"],
  },
  DVY: {
    name: "iShares Select Dividend ETF",
    category: "배당주",
    expense: 0.39,
    description: "배당 성장 기록이 있는 우량 배당주에 투자하는 ETF입니다.",
    risk: "medium",
    correlationFactors: ["배당수익률", "경기순환"],
  },

  // 성장주 ETF
  VUG: {
    name: "Vanguard Growth ETF",
    category: "성장주",
    expense: 0.04,
    description: "성장 잠재력이 높은 대형주에 투자하는 ETF입니다.",
    risk: "high",
    correlationFactors: ["성장률", "기술혁신"],
  },
  IWF: {
    name: "iShares Russell 1000 Growth ETF",
    category: "성장주",
    expense: 0.19,
    description:
      "러셀 1000 성장 지수를 추적하는 ETF로, 성장주에 집중 투자합니다.",
    risk: "high",
    correlationFactors: ["성장률", "기술혁신"],
  },

  // 가치주 ETF
  VTV: {
    name: "Vanguard Value ETF",
    category: "가치주",
    expense: 0.04,
    description:
      "저평가된 대형주에 투자하는 ETF로, 안정적인 수익을 추구합니다.",
    risk: "medium",
    correlationFactors: ["배당수익률", "경기순환"],
  },
  IWD: {
    name: "iShares Russell 1000 Value ETF",
    category: "가치주",
    expense: 0.19,
    description:
      "러셀 1000 가치 지수를 추적하는 ETF로, 가치주에 집중 투자합니다.",
    risk: "medium",
    correlationFactors: ["배당수익률", "경기순환"],
  },

  // 통화 ETF
  UUP: {
    name: "Invesco DB US Dollar Index Bullish Fund",
    category: "통화",
    expense: 0.77,
    description:
      "달러 강세에 베팅하는 ETF로, 주요 통화 대비 달러 가치를 추적합니다.",
    risk: "medium",
    correlationFactors: ["환율", "금리"],
  },
  FXY: {
    name: "Invesco CurrencyShares Japanese Yen Trust",
    category: "통화",
    expense: 0.4,
    description:
      "엔화 가격을 추적하는 ETF로, 안전자산으로서의 엔화에 투자합니다.",
    risk: "medium",
    correlationFactors: ["환율", "경기순환"],
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

// 추천 ETF 목록 가져오기 (캐시 적용)
export const fetchRecommendedETFs = cache(async (): Promise<ETF[]> => {
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
});
