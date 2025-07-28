import { create } from "zustand";
import { ETF } from "@/types";
import { fetchRecommendedETFs } from "@/utils/etfDataService";

interface ETFStore {
  // 상태
  etfs: ETF[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  isInitialized: boolean;

  // 액션
  fetchETFs: () => Promise<void>;
  refreshETFs: () => Promise<void>;
  setETFs: (etfs: ETF[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useETFStore = create<ETFStore>((set, get) => ({
  // 초기 상태
  etfs: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
  isInitialized: false,

  // ETF 데이터 가져오기 (중복 호출 방지)
  fetchETFs: async () => {
    const { isInitialized, isLoading, lastUpdated } = get();

    // 이미 로딩 중이면 중복 호출 방지
    if (isLoading) {
      return;
    }

    // 이미 초기화되었고 1시간 이내라면 캐시된 데이터 사용
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    if (isInitialized && lastUpdated && now - lastUpdated.getTime() < oneHour) {
      console.log("캐시된 ETF 데이터 사용");
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const data = await fetchRecommendedETFs();
      set({
        etfs: data,
        lastUpdated: new Date(),
        isInitialized: true,
        isLoading: false,
      });
    } catch (err) {
      console.error("ETF 데이터 로드 실패:", err);
      set({
        error: "ETF 데이터를 불러오는데 실패했습니다.",
        isLoading: false,
      });
    }
  },

  // ETF 데이터 새로고침 (강제 업데이트)
  refreshETFs: async () => {
    set({ isLoading: true, error: null });

    try {
      const data = await fetchRecommendedETFs();
      set({
        etfs: data,
        lastUpdated: new Date(),
        isInitialized: true,
        isLoading: false,
      });
    } catch (err) {
      console.error("ETF 데이터 새로고침 실패:", err);
      set({
        error: "ETF 데이터를 새로고침하는데 실패했습니다.",
        isLoading: false,
      });
    }
  },

  // 상태 설정 액션들
  setETFs: (etfs) => set({ etfs }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
