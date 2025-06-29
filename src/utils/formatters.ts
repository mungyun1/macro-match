import { format, formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

// 숫자 포맷팅
export const formatNumber = (num: number, decimals: number = 2): string => {
  return new Intl.NumberFormat("ko-KR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

// 통화 포맷팅
export const formatCurrency = (
  amount: number,
  currency: string = "USD"
): string => {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency,
  }).format(amount);
};

// 백분율 포맷팅
export const formatPercentage = (
  value: number,
  decimals: number = 2
): string => {
  return `${value > 0 ? "+" : ""}${value.toFixed(decimals)}%`;
};

// 큰 숫자 축약 표시 (1,000,000 -> 1M)
export const formatLargeNumber = (num: number): string => {
  if (num >= 1000000000000) {
    return `${(num / 1000000000000).toFixed(1)}T`;
  } else if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(1)}B`;
  } else if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toLocaleString("ko-KR");
};

// 날짜 포맷팅
export const formatDate = (
  date: string | Date,
  pattern: string = "yyyy.MM.dd"
): string => {
  return format(new Date(date), pattern, { locale: ko });
};

// 상대 시간 표시 (예: "2시간 전")
export const formatRelativeTime = (date: string | Date): string => {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: ko,
  });
};

// 위험도 색상 반환
export const getRiskColor = (risk: "low" | "medium" | "high"): string => {
  const riskColors = {
    low: "text-green-600",
    medium: "text-yellow-600",
    high: "text-red-600",
  };
  return riskColors[risk];
};

// 위험도 배경색 반환
export const getRiskBgColor = (risk: "low" | "medium" | "high"): string => {
  const riskBgColors = {
    low: "bg-green-100",
    medium: "bg-yellow-100",
    high: "bg-red-100",
  };
  return riskBgColors[risk];
};

// 변화율에 따른 색상 반환
export const getChangeColor = (change: number): string => {
  if (change > 0) return "text-green-500";
  if (change < 0) return "text-red-500";
  return "text-gray-500";
};
