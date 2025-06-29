import { Calculator } from "lucide-react";

interface StrategyHeaderProps {
  title?: string;
  description?: string;
}

export default function StrategyHeader({
  title = "전략 시뮬레이터",
  description = "다양한 ETF 조합으로 투자 전략을 백테스트하고 성과를 시뮬레이션해보세요.",
}: StrategyHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <Calculator className="h-8 w-8 text-blue-600 mr-3" />
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      </div>
      <p className="text-lg text-gray-600">{description}</p>
    </div>
  );
}
