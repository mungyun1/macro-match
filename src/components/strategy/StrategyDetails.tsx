import { SimulationSettings, BacktestResult } from "@/types";
import { getRebalanceFrequencyLabel } from "@/utils/strategyUtils";

interface StrategyDetailsProps {
  settings: SimulationSettings;
  result: BacktestResult;
}

export default function StrategyDetails({
  settings,
  result,
}: StrategyDetailsProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        전략 세부 정보
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium text-gray-900 mb-2">선택된 ETF</h3>
          <div className="space-y-2">
            {settings.selectedETFs.map((etf) => (
              <div key={etf.id} className="flex justify-between items-center">
                <span className="text-gray-700">{etf.symbol}</span>
                <span className="font-medium text-blue-600">
                  {settings.allocation[etf.id]}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium text-gray-900 mb-2">백테스트 설정</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">기간:</span>
              <span className="text-gray-900">
                {result.period.start} ~ {result.period.end}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">초기 투자금:</span>
              <span className="text-gray-900">
                ${settings.initialInvestment.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">리밸런싱:</span>
              <span className="text-gray-900">
                {getRebalanceFrequencyLabel(settings.rebalanceFrequency)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
