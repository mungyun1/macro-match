import { Calculator } from "lucide-react";
import PortfolioPerformanceChart from "@/components/PortfolioPerformanceChart";
import PerformanceSummary from "./PerformanceSummary";
import StrategyDetails from "./StrategyDetails";
import { BacktestResult, SimulationSettings } from "@/types";

interface StrategyResultsSectionProps {
  isSimulating: boolean;
  simulationResult: BacktestResult | null;
  settings: SimulationSettings;
  onGoToSetup: () => void;
}

export default function StrategyResultsSection({
  isSimulating,
  simulationResult,
  settings,
  onGoToSetup,
}: StrategyResultsSectionProps) {
  if (isSimulating) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600">시뮬레이션 실행 중...</p>
        <p className="text-sm text-gray-500">
          과거 데이터를 분석하여 성과를 계산하고 있습니다.
        </p>
      </div>
    );
  }

  if (!simulationResult) {
    return (
      <div className="text-center py-12">
        <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg text-gray-600">시뮬레이션 결과가 없습니다</p>
        <p className="text-sm text-gray-500">
          전략 설정 탭에서 시뮬레이션을 실행해주세요.
        </p>
        <button
          onClick={onGoToSetup}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          전략 설정하기
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 성과 요약 */}
      <PerformanceSummary result={simulationResult} />

      {/* 성과 차트 */}
      <PortfolioPerformanceChart
        performanceData={simulationResult.performanceData}
        initialInvestment={settings.initialInvestment}
      />

      {/* 전략 세부 정보 */}
      <StrategyDetails settings={settings} result={simulationResult} />
    </div>
  );
}
