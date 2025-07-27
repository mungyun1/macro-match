import { useState } from "react";
import { BacktestResult, ETF, SimulationSettings } from "@/types";
import {
  defaultSettings,
  generateMockPerformanceData,
} from "@/utils/strategyUtils";

export const useStrategySimulator = () => {
  const [settings, setSettings] = useState<SimulationSettings>(defaultSettings);
  const [simulationResult, setSimulationResult] =
    useState<BacktestResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "setup" | "results" | "prediction"
  >("setup");

  // ETF 토글 핸들러
  const handleToggleETF = (etf: ETF) => {
    const isSelected = settings.selectedETFs.some(
      (selected) => selected.id === etf.id
    );

    if (isSelected) {
      // 선택 해제
      setSettings({
        ...settings,
        selectedETFs: settings.selectedETFs.filter(
          (selected) => selected.id !== etf.id
        ),
        allocation: Object.fromEntries(
          Object.entries(settings.allocation).filter(([key]) => key !== etf.id)
        ),
      });
    } else {
      // 선택 추가
      setSettings({
        ...settings,
        selectedETFs: [...settings.selectedETFs, etf],
        allocation: {
          ...settings.allocation,
          [etf.id]: 0,
        },
      });
    }
  };

  // 시뮬레이션 실행
  const runSimulation = async () => {
    if (settings.selectedETFs.length === 0) {
      alert("최소 1개 이상의 ETF를 선택해주세요.");
      return;
    }

    const totalAllocation = Object.values(settings.allocation).reduce(
      (sum, val) => sum + val,
      0
    );
    if (Math.abs(totalAllocation - 100) > 0.1) {
      alert("총 비중이 100%가 되도록 조정해주세요.");
      return;
    }

    setIsSimulating(true);
    setActiveTab("results");

    // 모의 백테스트 결과 생성 (실제로는 API 호출)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockResult: BacktestResult = {
      strategyId: "custom-strategy",
      period: {
        start: settings.startDate,
        end: settings.endDate,
      },
      totalReturn: 45.6,
      annualizedReturn: 12.3,
      volatility: 18.7,
      maxDrawdown: -15.2,
      sharpeRatio: 0.85,
      performanceData: generateMockPerformanceData(
        settings.startDate,
        settings.endDate,
        settings.initialInvestment
      ),
    };

    setSimulationResult(mockResult);
    setIsSimulating(false);
  };

  return {
    settings,
    setSettings,
    simulationResult,
    isSimulating,
    activeTab,
    setActiveTab,
    handleToggleETF,
    runSimulation,
  };
};
