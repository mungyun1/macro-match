// 무료 API를 사용한 실제 경제 데이터 서비스

// Alpha Vantage API 키 (무료 티어: 분당 5회, 일일 500회)
const ALPHA_VANTAGE_API_KEY =
  process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || "demo";
const ALPHA_VANTAGE_BASE_URL = "https://www.alphavantage.co/query";

// Exchange Rate API (무료)
const EXCHANGE_RATE_BASE_URL = "https://api.exchangerate-api.com/v4/latest";

// Federal Reserve Economic Data (FRED) API (무료)
const FRED_API_KEY = process.env.NEXT_PUBLIC_FRED_API_KEY || "demo";
const FRED_BASE_URL = "https://api.stlouisfed.org/fred/series/observations";

export interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: string;
}

export interface CurrencyData {
  base: string;
  rates: Record<string, number>;
  timestamp: string;
}

export interface EconomicData {
  series_id: string;
  observations: Array<{
    date: string;
    value: string;
  }>;
}

// 주식 데이터 가져오기
export async function fetchStockData(
  symbol: string
): Promise<StockData | null> {
  try {
    const response = await fetch(
      `${ALPHA_VANTAGE_BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error("주식 데이터를 가져오는데 실패했습니다.");
    }

    const data = await response.json();

    if (data["Error Message"]) {
      throw new Error(data["Error Message"]);
    }

    const quote = data["Global Quote"];
    if (!quote) {
      return null;
    }

    return {
      symbol: quote["01. symbol"],
      price: parseFloat(quote["05. price"]),
      change: parseFloat(quote["09. change"]),
      changePercent: parseFloat(quote["10. change percent"].replace("%", "")),
      volume: parseInt(quote["06. volume"]),
      timestamp: quote["07. latest trading day"],
    };
  } catch (error) {
    console.error("주식 데이터 가져오기 실패:", error);
    return null;
  }
}

// 환율 데이터 가져오기
export async function fetchCurrencyData(
  base: string = "USD"
): Promise<CurrencyData | null> {
  try {
    const response = await fetch(`${EXCHANGE_RATE_BASE_URL}/${base}`);

    if (!response.ok) {
      throw new Error("환율 데이터를 가져오는데 실패했습니다.");
    }

    const data = await response.json();

    return {
      base: data.base,
      rates: data.rates,
      timestamp: data.date,
    };
  } catch (error) {
    console.error("환율 데이터 가져오기 실패:", error);
    return null;
  }
}

// 원유 가격 데이터 가져오기 (WTI)
export async function fetchOilPrice(): Promise<number | null> {
  try {
    const response = await fetch(
      `${ALPHA_VANTAGE_BASE_URL}?function=WTI&interval=daily&apikey=${ALPHA_VANTAGE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error("원유 가격 데이터를 가져오는데 실패했습니다.");
    }

    const data = await response.json();

    if (data["Error Message"]) {
      throw new Error(data["Error Message"]);
    }

    const timeSeries = data["Time Series (Daily)"];
    if (!timeSeries) {
      return null;
    }

    // 최신 데이터 가져오기
    const latestDate = Object.keys(timeSeries)[0];
    const latestData = timeSeries[latestDate];

    return parseFloat(latestData["4. close"]);
  } catch (error) {
    console.error("원유 가격 데이터 가져오기 실패:", error);
    return null;
  }
}

// FRED 경제 데이터 가져오기
export async function fetchEconomicData(
  seriesId: string
): Promise<EconomicData | null> {
  try {
    const response = await fetch(
      `${FRED_BASE_URL}?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&limit=2`
    );

    if (!response.ok) {
      throw new Error("경제 데이터를 가져오는데 실패했습니다.");
    }

    const data = await response.json();

    if (data.error_code) {
      throw new Error(data.error_message);
    }

    return data;
  } catch (error) {
    console.error("경제 데이터 가져오기 실패:", error);
    return null;
  }
}

// 여러 주식 데이터를 한번에 가져오기
export async function fetchMultipleStockData(
  symbols: string[]
): Promise<Record<string, StockData>> {
  const results: Record<string, StockData> = {};

  // API 호출 제한을 고려하여 순차적으로 처리
  for (const symbol of symbols) {
    const data = await fetchStockData(symbol);
    if (data) {
      results[symbol] = data;
    }
    // API 호출 제한을 위한 지연
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  return results;
}

// 모의 데이터 (API 호출 실패시 사용)
export function getMockData() {
  return {
    stocks: {
      SPY: {
        symbol: "SPY",
        price: 450.23,
        change: 5.67,
        changePercent: 1.27,
        volume: 45000000,
        timestamp: new Date().toISOString().split("T")[0],
      },
      QQQ: {
        symbol: "QQQ",
        price: 380.45,
        change: 8.92,
        changePercent: 2.4,
        volume: 35000000,
        timestamp: new Date().toISOString().split("T")[0],
      },
      TLT: {
        symbol: "TLT",
        price: 89.45,
        change: -0.72,
        changePercent: -0.8,
        volume: 12000000,
        timestamp: new Date().toISOString().split("T")[0],
      },
    },
    currency: {
      base: "USD",
      rates: {
        KRW: 1335.5,
        EUR: 0.92,
        JPY: 148.25,
        GBP: 0.79,
      },
      timestamp: new Date().toISOString().split("T")[0],
    },
    oilPrice: 82.45,
  };
}
