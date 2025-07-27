"use client";

import { useEffect } from "react";
import { useMacroStore } from "@/store/macroStore";
import { useAIPrediction } from "@/hooks/useAIPrediction";
import { useETFData } from "@/hooks/useETFData";
import { useStrategySimulator } from "@/hooks/useStrategySimulator";
import {
  StrategyHeader,
  StrategyTabNavigation,
  StrategySetupSection,
  StrategyResultsSection,
  StrategyPredictionSection,
} from "@/components";

export default function StrategySimulatorPage() {
  const { fetchMacroData } = useMacroStore();
  const {
    predictionResult,
    isPredicting,
    predictionError,
    runPrediction: executePrediction,
  } = useAIPrediction();
  const {
    etfs: availableETFs,
    loading: etfLoading,
    error: etfError,
  } = useETFData();

  const {
    settings,
    setSettings,
    simulationResult,
    isSimulating,
    activeTab,
    setActiveTab,
    handleToggleETF,
    runSimulation,
  } = useStrategySimulator();

  useEffect(() => {
    fetchMacroData();
  }, [fetchMacroData]);

  // AI 예측 실행
  const runPrediction = async () => {
    setActiveTab("prediction");

    const success = await executePrediction(settings);

    if (!success && predictionError) {
      alert(predictionError);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* 페이지 헤더 */}
      <StrategyHeader />

      {/* 탭 네비게이션 */}
      <StrategyTabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 탭 컨텐츠 */}
      {activeTab === "setup" && (
        <StrategySetupSection
          settings={settings}
          availableETFs={availableETFs}
          etfLoading={etfLoading}
          etfError={etfError}
          onSettingsChange={setSettings}
          onToggleETF={handleToggleETF}
          onRunSimulation={runSimulation}
          onRunPrediction={runPrediction}
        />
      )}

      {activeTab === "results" && (
        <StrategyResultsSection
          isSimulating={isSimulating}
          simulationResult={simulationResult}
          settings={settings}
          onGoToSetup={() => setActiveTab("setup")}
        />
      )}

      {activeTab === "prediction" && (
        <StrategyPredictionSection
          isPredicting={isPredicting}
          predictionResult={predictionResult}
          settings={settings}
          onGoToSetup={() => setActiveTab("setup")}
        />
      )}
    </div>
  );
}
