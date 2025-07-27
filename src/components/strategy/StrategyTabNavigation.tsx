import { Brain } from "lucide-react";

interface StrategyTabNavigationProps {
  activeTab: "setup" | "results" | "prediction";
  onTabChange: (tab: "setup" | "results" | "prediction") => void;
}

export default function StrategyTabNavigation({
  activeTab,
  onTabChange,
}: StrategyTabNavigationProps) {
  return (
    <div className="mb-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex">
          <button
            onClick={() => onTabChange("setup")}
            className={`py-2 px-4 border-b-2 font-medium text-sm ${
              activeTab === "setup"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            전략 설정
          </button>
          <button
            onClick={() => onTabChange("results")}
            className={`py-2 px-4 border-b-2 font-medium text-sm ${
              activeTab === "results"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            시뮬레이션 결과
          </button>
          <button
            onClick={() => onTabChange("prediction")}
            className={`py-2 px-4 border-b-2 font-medium text-sm flex items-center ${
              activeTab === "prediction"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Brain className="h-4 w-4 mr-1" />
            AI 예측 분석
          </button>
        </nav>
      </div>
    </div>
  );
}
