import { useState, useEffect, useCallback } from "react";
import { ETF } from "@/types";
import { fetchRecommendedETFs, getMockETFData } from "@/utils/etfDataService";

interface UseETFDataReturn {
  etfs: ETF[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
  useMockData: () => void;
}

export function useETFData(): UseETFDataReturn {
  const [etfs, setEtfs] = useState<ETF[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadETFData = useCallback(async (useMockData = false) => {
    setLoading(true);
    setError(null);

    try {
      let data: ETF[];

      if (useMockData) {
        data = getMockETFData();
      } else {
        data = await fetchRecommendedETFs();
      }

      setEtfs(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("ETF 데이터 로드 실패:", err);
      setError(
        "ETF 데이터를 불러오는데 실패했습니다. 모의 데이터를 사용합니다."
      );
      // 에러 발생시 모의 데이터 사용
      setEtfs(getMockETFData());
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await loadETFData();
  }, [loadETFData]);

  const useMockData = useCallback(() => {
    loadETFData(true);
  }, [loadETFData]);

  // 초기 데이터 로드
  useEffect(() => {
    loadETFData();
  }, [loadETFData]);

  return {
    etfs,
    loading,
    error,
    lastUpdated,
    refresh,
    useMockData,
  };
}
