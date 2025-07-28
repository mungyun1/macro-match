import { useState, useEffect, useCallback } from "react";
import { ETF } from "@/types";
import { fetchRecommendedETFs } from "@/utils/etfDataService";

interface UseETFDataReturn {
  etfs: ETF[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
}

export function useETFData(): UseETFDataReturn {
  const [etfs, setEtfs] = useState<ETF[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadETFData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchRecommendedETFs();
      setEtfs(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("ETF 데이터 로드 실패:", err);
      setError("ETF 데이터를 불러오는데 실패했습니다.");
      setEtfs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await loadETFData();
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
  };
}
