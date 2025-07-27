import { SimulationSettings } from "@/types";

// 기본 설정값
export const defaultSettings: SimulationSettings = {
  startDate: "2020-01-01",
  endDate: "2024-01-01",
  initialInvestment: 10000,
  rebalanceFrequency: "quarterly",
  selectedETFs: [],
  allocation: {},
};

// 모의 성과 데이터 생성
export const generateMockPerformanceData = (
  startDate: string,
  endDate: string,
  initialInvestment: number
) => {
  const data = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let value = initialInvestment;

  for (let i = 0; i <= diffDays; i += 30) {
    const currentDate = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
    const volatility = 0.15;
    const dailyReturn = ((Math.random() - 0.5) * volatility) / Math.sqrt(252);
    value *= 1 + dailyReturn;

    data.push({
      date: currentDate.toISOString().split("T")[0],
      value: Math.round(value),
    });
  }

  return data;
};

// 총 비중 계산
export const calculateTotalAllocation = (allocation: {
  [key: string]: number;
}) => {
  return Object.values(allocation).reduce((sum, val) => sum + val, 0);
};

// 비중이 100%인지 확인
export const isAllocationValid = (allocation: { [key: string]: number }) => {
  const total = calculateTotalAllocation(allocation);
  return Math.abs(total - 100) < 0.1;
};

// 리밸런싱 주기 한글 변환
export const getRebalanceFrequencyLabel = (frequency: string) => {
  switch (frequency) {
    case "monthly":
      return "월간";
    case "quarterly":
      return "분기별";
    case "yearly":
      return "연간";
    default:
      return frequency;
  }
};
