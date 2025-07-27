import { NextRequest, NextResponse } from "next/server";

// Yahoo Finance API (무료)
const YAHOO_FINANCE_BASE_URL =
  "https://query1.finance.yahoo.com/v8/finance/chart";

// Alpha Vantage API (무료 티어: 분당 5회, 일일 500회)
const ALPHA_VANTAGE_API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;
const ALPHA_VANTAGE_BASE_URL = "https://www.alphavantage.co/query";

// 캐시 설정
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24시간 (밀리초)
const cache = new Map<string, { data: ETFMarketData; timestamp: number }>();

// ETF 데이터 인터페이스
interface ETFMarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  timestamp: string;
}

// 캐시에서 데이터 가져오기
function getCachedData(symbol: string): ETFMarketData | null {
  const cached = cache.get(symbol);
  if (!cached) return null;

  const now = Date.now();
  const isExpired = now - cached.timestamp > CACHE_DURATION;

  if (isExpired) {
    cache.delete(symbol);
    return null;
  }

  return cached.data;
}

// 캐시에 데이터 저장
function setCachedData(symbol: string, data: ETFMarketData): void {
  cache.set(symbol, {
    data,
    timestamp: Date.now(),
  });
}

// 캐시 상태 확인 (디버깅용)
function getCacheStatus(): { size: number; keys: string[] } {
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
  };
}

// Yahoo Finance에서 ETF 데이터 가져오기
async function fetchETFDataFromYahoo(
  symbol: string
): Promise<ETFMarketData | null> {
  try {
    const response = await fetch(
      `${YAHOO_FINANCE_BASE_URL}/${symbol}?interval=1d&range=1d`
    );

    if (!response.ok) {
      throw new Error(`ETF 데이터를 가져오는데 실패했습니다: ${symbol}`);
    }

    const data = await response.json();

    if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
      return null;
    }

    const result = data.chart.result[0];
    const meta = result.meta;
    const indicators = result.indicators.quote[0];
    const timestamp = result.timestamp[0];

    const price = meta.regularMarketPrice;
    const previousClose = meta.previousClose;
    const change = price - previousClose;
    const changePercent = (change / previousClose) * 100;
    const volume = indicators.volume[0] || 0;
    const marketCap = meta.marketCap || 0;

    return {
      symbol,
      price,
      change,
      changePercent,
      volume,
      marketCap,
      timestamp: new Date(timestamp * 1000).toISOString(),
    };
  } catch (error) {
    console.error(`Yahoo Finance ETF 데이터 가져오기 실패 (${symbol}):`, error);
    return null;
  }
}

// Alpha Vantage에서 ETF 데이터 가져오기 (백업) - 캐시 적용
async function fetchETFDataFromAlphaVantage(
  symbol: string
): Promise<ETFMarketData | null> {
  if (!ALPHA_VANTAGE_API_KEY) {
    console.warn("Alpha Vantage API 키가 설정되지 않았습니다.");
    return null;
  }

  // 캐시된 데이터 확인
  const cachedData = getCachedData(symbol);
  if (cachedData) {
    console.log(`캐시된 Alpha Vantage 데이터 사용: ${symbol}`);
    return cachedData;
  }

  try {
    console.log(`Alpha Vantage API 호출: ${symbol}`);
    const response = await fetch(
      `${ALPHA_VANTAGE_BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`ETF 데이터를 가져오는데 실패했습니다: ${symbol}`);
    }

    const data = await response.json();

    if (data["Error Message"]) {
      throw new Error(data["Error Message"]);
    }

    const quote = data["Global Quote"];
    if (!quote) {
      return null;
    }

    const price = parseFloat(quote["05. price"]);
    const change = parseFloat(quote["09. change"]);
    const changePercent = parseFloat(
      quote["10. change percent"].replace("%", "")
    );
    const volume = parseInt(quote["06. volume"]);
    const marketCap = parseFloat(quote["08. market cap"]) || 0;

    const result = {
      symbol: quote["01. symbol"],
      price,
      change,
      changePercent,
      volume,
      marketCap,
      timestamp: quote["07. latest trading day"],
    };

    // 캐시에 저장
    setCachedData(symbol, result);
    console.log(`Alpha Vantage 데이터 캐시 저장: ${symbol}`);

    return result;
  } catch (error) {
    console.error(`Alpha Vantage ETF 데이터 가져오기 실패 (${symbol}):`, error);
    return null;
  }
}

// GET 요청 처리
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol");
    const source = searchParams.get("source") || "yahoo"; // yahoo 또는 alpha
    const debug = searchParams.get("debug") === "true"; // 캐시 상태 확인용

    // 캐시 상태 디버깅
    if (debug) {
      return NextResponse.json({
        cacheStatus: getCacheStatus(),
        message: "캐시 상태 확인",
      });
    }

    if (!symbol) {
      return NextResponse.json(
        { error: "Symbol parameter is required" },
        { status: 400 }
      );
    }

    let data: ETFMarketData | null = null;

    if (source === "yahoo") {
      // Yahoo Finance를 우선 시도
      data = await fetchETFDataFromYahoo(symbol);

      // 실패시 Alpha Vantage 시도
      if (!data) {
        data = await fetchETFDataFromAlphaVantage(symbol);
      }
    } else {
      // Alpha Vantage를 우선 시도
      data = await fetchETFDataFromAlphaVantage(symbol);

      // 실패시 Yahoo Finance 시도
      if (!data) {
        data = await fetchETFDataFromYahoo(symbol);
      }
    }

    if (!data) {
      return NextResponse.json(
        { error: `Failed to fetch data for ${symbol}` },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("ETF API 오류:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// 여러 ETF 데이터를 한번에 가져오기
export async function POST(request: NextRequest) {
  try {
    const { symbols } = await request.json();

    if (!symbols || !Array.isArray(symbols)) {
      return NextResponse.json(
        { error: "Symbols array is required" },
        { status: 400 }
      );
    }

    const results: Record<string, ETFMarketData> = {};

    // 병렬로 데이터 가져오기 (API 호출 제한 고려)
    const promises = symbols.map(async (symbol: string, index: number) => {
      // API 호출 제한을 위한 지연 (Alpha Vantage 캐시 적용으로 지연 감소)
      await new Promise((resolve) => setTimeout(resolve, index * 50));

      try {
        // Yahoo Finance를 우선 시도
        let data = await fetchETFDataFromYahoo(symbol);

        // 실패시 Alpha Vantage 시도
        if (!data) {
          data = await fetchETFDataFromAlphaVantage(symbol);
        }

        if (data) {
          results[symbol] = data;
        }
      } catch (error) {
        console.error(`ETF 데이터 가져오기 실패 (${symbol}):`, error);
      }
    });

    await Promise.all(promises);
    return NextResponse.json(results);
  } catch (error) {
    console.error("ETF API 오류:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
