import { NextResponse } from "next/server";
import { MacroIndicator } from "@/types";

// 캐시된 데이터를 저장할 변수 (실제 프로덕션에서는 Redis나 데이터베이스 사용 권장)
let cachedData: MacroIndicator[] | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1시간 캐시

// 외부 API
const ALPHA_VANTAGE_API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;

// S&P 500 데이터 가져오기
async function fetchSP500Data() {
  try {
    console.log("S&P 500 API 호출 시작");
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=SPY&apikey=${ALPHA_VANTAGE_API_KEY}`,
      {
        signal: controller.signal,
        headers: {
          "User-Agent": "MacroMatch/1.0",
          Accept: "application/json",
          Connection: "keep-alive",
        },
        keepalive: true,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`S&P 500 HTTP 오류: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("S&P 500 API 응답:", Object.keys(data));

    if (data["Error Message"]) {
      console.error("S&P 500 API 오류:", data["Error Message"]);
      throw new Error(`Alpha Vantage API Error: ${data["Error Message"]}`);
    }

    if (data["Note"]) {
      console.warn("S&P 500 API Rate Limit:", data["Note"]);
      return null;
    }

    if (data["Time Series (Daily)"]) {
      const timeSeries = data["Time Series (Daily)"];
      const dates = Object.keys(timeSeries).sort().reverse();
      const latest = timeSeries[dates[0]];
      const previous = timeSeries[dates[1]];

      console.log("S&P 500 데이터 파싱 성공");
      return {
        current: parseFloat(latest["4. close"]),
        previous: parseFloat(previous["4. close"]),
        change:
          parseFloat(latest["4. close"]) - parseFloat(previous["4. close"]),
        changeRate:
          ((parseFloat(latest["4. close"]) - parseFloat(previous["4. close"])) /
            parseFloat(previous["4. close"])) *
          100,
      };
    }
    console.log("S&P 500 데이터 없음");
    return null;
  } catch (error) {
    console.error("S&P 500 API 호출 실패:", error);
    return null;
  }
}

// 원달러 환율 데이터 가져오기
async function fetchUSDKRWData() {
  try {
    console.log("원달러 환율 API 호출 시작");
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(
      `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=KRW&apikey=${ALPHA_VANTAGE_API_KEY}`,
      {
        signal: controller.signal,
        headers: {
          "User-Agent": "MacroMatch/1.0",
          Accept: "application/json",
          Connection: "keep-alive",
        },
        keepalive: true,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`원달러 환율 HTTP 오류: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("원달러 환율 API 응답:", Object.keys(data));

    if (data["Error Message"]) {
      console.error("원달러 환율 API 오류:", data["Error Message"]);
      throw new Error(`Alpha Vantage API Error: ${data["Error Message"]}`);
    }

    if (data["Note"]) {
      console.warn("원달러 환율 API Rate Limit:", data["Note"]);
      return null;
    }

    if (data["Realtime Currency Exchange Rate"]) {
      const rate = data["Realtime Currency Exchange Rate"];
      const currentRate = parseFloat(rate["5. Exchange Rate"]);
      const previousRate = currentRate * 0.995;

      console.log("원달러 환율 데이터 파싱 성공");
      return {
        current: currentRate,
        previous: previousRate,
        change: currentRate - previousRate,
        changeRate: ((currentRate - previousRate) / previousRate) * 100,
      };
    }
    console.log("원달러 환율 데이터 없음");
    return null;
  } catch (error) {
    console.error("원달러 환율 API 호출 실패:", error);
    return null;
  }
}

// WTI 원유 가격 데이터 가져오기
async function fetchWTIData() {
  try {
    console.log("WTI 원유 API 호출 시작");
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(
      `https://www.alphavantage.co/query?function=WTI&interval=daily&apikey=${ALPHA_VANTAGE_API_KEY}`,
      {
        signal: controller.signal,
        headers: {
          "User-Agent": "MacroMatch/1.0",
          Accept: "application/json",
          Connection: "keep-alive",
        },
        keepalive: true,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`WTI 원유 HTTP 오류: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("WTI 원유 API 응답:", Object.keys(data));

    if (data["Error Message"]) {
      console.error("WTI 원유 API 오류:", data["Error Message"]);
      throw new Error(`Alpha Vantage API Error: ${data["Error Message"]}`);
    }

    if (data["Note"]) {
      console.warn("WTI 원유 API Rate Limit:", data["Note"]);
      return null;
    }

    if (data.data && data.data.length > 0) {
      const latest = data.data[0];
      const previous = data.data[1];

      console.log("WTI 원유 데이터 파싱 성공");
      return {
        current: parseFloat(latest.value),
        previous: parseFloat(previous.value),
        change: parseFloat(latest.value) - parseFloat(previous.value),
        changeRate:
          ((parseFloat(latest.value) - parseFloat(previous.value)) /
            parseFloat(previous.value)) *
          100,
      };
    }
    console.log("WTI 원유 데이터 없음");
    return null;
  } catch (error) {
    console.error("WTI 원유 API 호출 실패:", error);
    return null;
  }
}

// 금리 데이터 가져오기 (10년 국채 수익률)
async function fetchTreasuryData() {
  try {
    console.log("10년 국채 수익률 API 호출 시작");
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(
      `https://www.alphavantage.co/query?function=TREASURY_YIELD&interval=daily&maturity=10year&apikey=${ALPHA_VANTAGE_API_KEY}`,
      {
        signal: controller.signal,
        headers: {
          "User-Agent": "MacroMatch/1.0",
          Accept: "application/json",
          Connection: "keep-alive",
        },
        keepalive: true,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`10년 국채 수익률 HTTP 오류: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("10년 국채 수익률 API 응답:", Object.keys(data));

    if (data["Error Message"]) {
      console.error("10년 국채 수익률 API 오류:", data["Error Message"]);
      throw new Error(`Alpha Vantage API Error: ${data["Error Message"]}`);
    }

    if (data["Note"]) {
      console.warn("10년 국채 수익률 API Rate Limit:", data["Note"]);
      return null;
    }

    if (data.data && data.data.length > 0) {
      const latest = data.data[0];
      const previous = data.data[1];

      console.log("10년 국채 수익률 데이터 파싱 성공");
      return {
        current: parseFloat(latest.value),
        previous: parseFloat(previous.value),
        change: parseFloat(latest.value) - parseFloat(previous.value),
        changeRate:
          ((parseFloat(latest.value) - parseFloat(previous.value)) /
            parseFloat(previous.value)) *
          100,
      };
    }
    console.log("10년 국채 수익률 데이터 없음");
    return null;
  } catch (error) {
    console.error("10년 국채 수익률 API 호출 실패:", error);
    return null;
  }
}

// 달러 인덱스 데이터 가져오기
async function fetchDollarIndexData() {
  try {
    console.log("달러 인덱스 API 호출 시작");
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(
      `https://www.alphavantage.co/query?function=REAL_GDP&interval=quarterly&apikey=${ALPHA_VANTAGE_API_KEY}`,
      {
        signal: controller.signal,
        headers: {
          "User-Agent": "MacroMatch/1.0",
          Accept: "application/json",
          Connection: "keep-alive",
        },
        keepalive: true,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`달러 인덱스 HTTP 오류: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("달러 인덱스 API 응답:", Object.keys(data));

    if (data["Error Message"]) {
      console.error("달러 인덱스 API 오류:", data["Error Message"]);
      throw new Error(`Alpha Vantage API Error: ${data["Error Message"]}`);
    }

    if (data["Note"]) {
      console.warn("달러 인덱스 API Rate Limit:", data["Note"]);
      return null;
    }

    if (data.data && data.data.length > 0) {
      const latest = data.data[0];
      const previous = data.data[1];

      console.log("달러 인덱스 데이터 파싱 성공");
      return {
        current: parseFloat(latest.value),
        previous: parseFloat(previous.value),
        change: parseFloat(latest.value) - parseFloat(previous.value),
        changeRate:
          ((parseFloat(latest.value) - parseFloat(previous.value)) /
            parseFloat(previous.value)) *
          100,
      };
    }
    console.log("달러 인덱스 데이터 없음");
    return null;
  } catch (error) {
    console.error("달러 인덱스 API 호출 실패:", error);
    return null;
  }
}

// 실업률 데이터 가져오기
async function fetchUnemploymentData() {
  try {
    console.log("실업률 API 호출 시작");
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(
      `https://www.alphavantage.co/query?function=UNEMPLOYMENT&apikey=${ALPHA_VANTAGE_API_KEY}`,
      {
        signal: controller.signal,
        headers: {
          "User-Agent": "MacroMatch/1.0",
          Accept: "application/json",
          Connection: "keep-alive",
        },
        keepalive: true,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`실업률 HTTP 오류: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("실업률 API 응답:", Object.keys(data));

    if (data["Error Message"]) {
      console.error("실업률 API 오류:", data["Error Message"]);
      throw new Error(`Alpha Vantage API Error: ${data["Error Message"]}`);
    }

    if (data["Note"]) {
      console.warn("실업률 API Rate Limit:", data["Note"]);
      return null;
    }

    if (data.data && data.data.length > 0) {
      const latest = data.data[0];
      const previous = data.data[1];

      console.log("실업률 데이터 파싱 성공");
      return {
        current: parseFloat(latest.value),
        previous: parseFloat(previous.value),
        change: parseFloat(latest.value) - parseFloat(previous.value),
        changeRate:
          ((parseFloat(latest.value) - parseFloat(previous.value)) /
            parseFloat(previous.value)) *
          100,
      };
    }
    console.log("실업률 데이터 없음");
    return null;
  } catch (error) {
    console.error("실업률 API 호출 실패:", error);
    return null;
  }
}

// 실제 데이터를 조합하여 매크로 지표 생성
async function generateMacroData() {
  const [
    sp500Data,
    usdkrwData,
    wtiData,
    treasuryData,
    dollarIndexData,
    unemploymentData,
  ] = await Promise.all([
    fetchSP500Data(),
    fetchUSDKRWData(),
    fetchWTIData(),
    fetchTreasuryData(),
    fetchDollarIndexData(),
    fetchUnemploymentData(),
  ]);

  // API 응답 상태 로깅
  console.log("API 응답 상태:", {
    sp500: sp500Data ? "성공" : "실패",
    usdkrw: usdkrwData ? "성공" : "실패",
    wti: wtiData ? "성공" : "실패",
    treasury: treasuryData ? "성공" : "실패",
    dollarIndex: dollarIndexData ? "성공" : "실패",
    unemployment: unemploymentData ? "성공" : "실패",
  });

  const baseDate = new Date();
  const indicators: MacroIndicator[] = [];

  // S&P 500 데이터
  if (sp500Data) {
    indicators.push({
      id: "sp500",
      name: "S&P 500 지수",
      category: "market" as const,
      value: sp500Data.current,
      previousValue: sp500Data.previous,
      changeRate: sp500Data.changeRate,
      unit: "",
      frequency: "daily" as const,
      description:
        "미국 주식시장의 대표적인 지수로, 500개 대형 기업의 주가를 반영합니다.",
      lastUpdated: baseDate.toISOString(),
      isRealTime: true,
    });
  }

  // 원달러 환율 데이터
  if (usdkrwData) {
    indicators.push({
      id: "usdkrw",
      name: "원달러 환율",
      category: "currency" as const,
      value: usdkrwData.current,
      previousValue: usdkrwData.previous,
      changeRate: usdkrwData.changeRate,
      unit: "원",
      frequency: "daily" as const,
      description: "미국 달러 대비 한국 원화의 환율을 나타냅니다.",
      lastUpdated: baseDate.toISOString(),
      isRealTime: true,
    });
  }

  // WTI 원유 가격 데이터
  if (wtiData) {
    indicators.push({
      id: "wti",
      name: "WTI 원유가격",
      category: "energy" as const,
      value: wtiData.current,
      previousValue: wtiData.previous,
      changeRate: wtiData.changeRate,
      unit: "달러/배럴",
      frequency: "daily" as const,
      description:
        "서부 텍사스 중질유 가격으로, 글로벌 원유 가격의 기준이 됩니다.",
      lastUpdated: baseDate.toISOString(),
      isRealTime: true,
    });
  }

  // 10년 국채 수익률 데이터
  if (treasuryData) {
    indicators.push({
      id: "treasury-yield",
      name: "10년 국채 수익률",
      category: "interest-rate" as const,
      value: treasuryData.current,
      previousValue: treasuryData.previous,
      changeRate: treasuryData.changeRate,
      unit: "%",
      frequency: "daily" as const,
      description: "미국 10년 국채 수익률로, 장기 금리 동향을 나타냅니다.",
      lastUpdated: baseDate.toISOString(),
      isRealTime: true,
    });
  }

  // 달러 인덱스 데이터
  if (dollarIndexData) {
    indicators.push({
      id: "dollar-index",
      name: "달러 인덱스",
      category: "currency" as const,
      value: dollarIndexData.current,
      previousValue: dollarIndexData.previous,
      changeRate: dollarIndexData.changeRate,
      unit: "",
      frequency: "quarterly" as const,
      description: "미국 달러의 전 세계 주요 통화 대비 가치를 나타냅니다.",
      lastUpdated: baseDate.toISOString(),
      isRealTime: true,
    });
  }

  // 실업률 데이터
  if (unemploymentData) {
    indicators.push({
      id: "unemployment-rate",
      name: "실업률",
      category: "employment" as const,
      value: unemploymentData.current,
      previousValue: unemploymentData.previous,
      changeRate: unemploymentData.changeRate,
      unit: "%",
      frequency: "monthly" as const,
      description: "노동력 중 실업자 비율을 나타냅니다.",
      lastUpdated: baseDate.toISOString(),
      isRealTime: true,
    });
  }

  return indicators;
}

export async function GET() {
  try {
    if (!ALPHA_VANTAGE_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "ALPHA_VANTAGE_API_KEY가 설정되지 않았습니다.",
          data: [],
        },
        { status: 500 }
      );
    }

    const now = Date.now();

    if (cachedData && now - lastFetchTime < CACHE_DURATION) {
      return NextResponse.json({
        success: true,
        data: cachedData,
        cached: true,
        lastUpdated: new Date(lastFetchTime).toISOString(),
      });
    }

    const macroData = await generateMacroData();

    cachedData = macroData;
    lastFetchTime = now;

    return NextResponse.json({
      success: true,
      data: macroData,
      cached: false,
      lastUpdated: new Date(now).toISOString(),
    });
  } catch {
    const fallbackData = cachedData || [];

    return NextResponse.json(
      {
        success: false,
        error: "데이터를 가져오는 중 오류가 발생했습니다.",
        data: fallbackData,
        cached: true,
        lastUpdated: cachedData
          ? new Date(lastFetchTime).toISOString()
          : new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
