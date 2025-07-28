import { Settings, BarChart3, PlayCircle, Zap } from "lucide-react";
import ETFSelectionSection from "@/components/strategy/ETFSelectionSection";
import { SimulationSettings, ETF } from "@/types";

interface StrategySetupSectionProps {
  settings: SimulationSettings;
  availableETFs: ETF[];
  etfLoading: boolean;
  etfError: string | null;
  onSettingsChange: (settings: SimulationSettings) => void;
  onToggleETF: (etf: ETF) => void;
  onRunSimulation: () => void;
  onRunPrediction: () => void;
}

export default function StrategySetupSection({
  settings,
  availableETFs,
  etfLoading,
  etfError,
  onSettingsChange,
  onToggleETF,
  onRunSimulation,
  onRunPrediction,
}: StrategySetupSectionProps) {
  // 비중 조정
  const updateAllocation = (etfId: string, percentage: number) => {
    onSettingsChange({
      ...settings,
      allocation: {
        ...settings.allocation,
        [etfId]: percentage,
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* 기본 설정 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <Settings className="h-5 w-5 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">기본 설정</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              시작일
            </label>
            <input
              type="date"
              value={settings.startDate}
              onChange={(e) =>
                onSettingsChange({ ...settings, startDate: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              종료일
            </label>
            <input
              type="date"
              value={settings.endDate}
              onChange={(e) =>
                onSettingsChange({ ...settings, endDate: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              초기 투자금 ($)
            </label>
            <input
              type="number"
              value={settings.initialInvestment}
              onChange={(e) =>
                onSettingsChange({
                  ...settings,
                  initialInvestment: Number(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              리밸런싱 주기
            </label>
            <select
              value={settings.rebalanceFrequency}
              onChange={(e) =>
                onSettingsChange({
                  ...settings,
                  rebalanceFrequency: e.target.value as
                    | "monthly"
                    | "quarterly"
                    | "yearly",
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="monthly">월간</option>
              <option value="quarterly">분기별</option>
              <option value="yearly">연간</option>
            </select>
          </div>
        </div>
      </div>

      {/* ETF 선택 */}
      <ETFSelectionSection
        availableETFs={availableETFs}
        selectedETFs={settings.selectedETFs}
        loading={etfLoading}
        error={etfError}
        onToggleETF={onToggleETF}
      />

      {/* 비중 조정 */}
      {settings.selectedETFs.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              포트폴리오 비중
            </h2>
          </div>

          <div className="space-y-4">
            {settings.selectedETFs.map((etf) => (
              <div key={etf.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <span className="font-medium text-gray-900 mr-2">
                      {etf.symbol}
                    </span>
                    <span className="text-sm text-gray-600">{etf.name}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.allocation[etf.id] || 0}
                    onChange={(e) =>
                      updateAllocation(etf.id, Number(e.target.value))
                    }
                    className="w-32"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={settings.allocation[etf.id] || 0}
                    onChange={(e) =>
                      updateAllocation(etf.id, Number(e.target.value))
                    }
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                  />
                  <span className="text-sm text-gray-600">%</span>
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">총 비중</span>
                <span
                  className={`font-semibold ${
                    Math.abs(
                      Object.values(settings.allocation).reduce(
                        (sum, val) => sum + val,
                        0
                      ) - 100
                    ) < 0.1
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {Object.values(settings.allocation)
                    .reduce((sum, val) => sum + val, 0)
                    .toFixed(1)}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 실행 버튼들 */}
      <div className="text-center space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRunSimulation}
            disabled={settings.selectedETFs.length === 0}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            <PlayCircle className="h-5 w-5 mr-2" />
            백테스트 실행
          </button>
          <button
            onClick={onRunPrediction}
            disabled={settings.selectedETFs.length === 0}
            className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            <Zap className="h-5 w-5 mr-2" />
            AI 예측 분석
          </button>
        </div>
        <p className="text-sm text-gray-600">
          백테스트는 과거 데이터 기반 성과를, AI 예측은 미래 전망을 분석합니다
        </p>
      </div>
    </div>
  );
}
