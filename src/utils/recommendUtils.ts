import { ETF } from "@/types";

// 위험도 라벨 반환
export const getRiskLabel = (risk: string): string => {
  const labels = { all: "전체", low: "낮음", medium: "보통", high: "높음" };
  return labels[risk as keyof typeof labels];
};

// 카테고리 라벨 반환
export const getCategoryLabel = (category: string): string => {
  return category === "all" ? "전체" : category;
};

// 마지막 업데이트 시간 포맷팅
export const formatLastUpdated = (date: Date): string => {
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ETF 필터링 함수
export const filterETFs = (
  etfs: ETF[],
  searchTerm: string,
  selectedCategory: string,
  selectedRisk: string
): ETF[] => {
  return etfs.filter((etf) => {
    const matchesSearch =
      etf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      etf.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || etf.category === selectedCategory;
    const matchesRisk = selectedRisk === "all" || etf.risk === selectedRisk;

    return matchesSearch && matchesCategory && matchesRisk;
  });
};

// ETF 정렬 함수
export const sortETFs = (etfs: ETF[], sortBy: string): ETF[] => {
  return [...etfs].sort((a, b) => {
    switch (sortBy) {
      case "performance":
        // null 값은 맨 뒤로 정렬
        if (a.changeRate == null && b.changeRate == null) return 0;
        if (a.changeRate == null) return 1;
        if (b.changeRate == null) return -1;
        return b.changeRate - a.changeRate;
      case "volume":
        // null 값은 맨 뒤로 정렬
        if (a.volume == null && b.volume == null) return 0;
        if (a.volume == null) return 1;
        if (b.volume == null) return -1;
        return b.volume - a.volume;
      case "expense":
        // null 값은 맨 뒤로 정렬
        if (a.expense == null && b.expense == null) return 0;
        if (a.expense == null) return 1;
        if (b.expense == null) return -1;
        return a.expense - b.expense;
      default:
        return 0; // 추천순은 기본 순서 유지
    }
  });
};

// 페이지 번호 배열 생성
export const getPageNumbers = (
  currentPage: number,
  totalPages: number
): number[] => {
  const pages: number[] = [];
  const maxVisiblePages = 5;

  if (totalPages <= maxVisiblePages) {
    // 전체 페이지가 5개 이하면 모두 표시
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // 현재 페이지 주변의 페이지들 표시
    let startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // 끝 페이지 조정
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
  }

  return pages;
};

// 상수 정의
export const CATEGORIES = [
  "all",
  "대형주",
  "기술주",
  "장기채권",
  "원자재",
  "전체주식시장",
  "선진국주식",
  "신흥국주식",
  "채권",
  "부동산",
  "에너지",
];

export const RISKS = ["all", "low", "medium", "high"];

export const ITEMS_PER_PAGE = 6;
