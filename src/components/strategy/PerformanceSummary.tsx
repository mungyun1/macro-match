import { TrendingUp, DollarSign, AlertCircle, BarChart3 } from "lucide-react";
import { BacktestResult } from "@/types";

interface PerformanceSummaryProps {
  result: BacktestResult;
}

export default function PerformanceSummary({
  result,
}: PerformanceSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-2">
          <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
          <span className="text-sm font-medium text-gray-600">총 수익률</span>
        </div>
        <p className="text-2xl font-bold text-green-600">
          +{result.totalReturn.toFixed(1)}%
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-2">
          <DollarSign className="h-5 w-5 text-blue-600 mr-2" />
          <span className="text-sm font-medium text-gray-600">
            연환산 수익률
          </span>
        </div>
        <p className="text-2xl font-bold text-blue-600">
          {result.annualizedReturn.toFixed(1)}%
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-2">
          <AlertCircle className="h-5 w-5 text-orange-600 mr-2" />
          <span className="text-sm font-medium text-gray-600">최대 낙폭</span>
        </div>
        <p className="text-2xl font-bold text-red-600">
          {result.maxDrawdown.toFixed(1)}%
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-2">
          <BarChart3 className="h-5 w-5 text-purple-600 mr-2" />
          <span className="text-sm font-medium text-gray-600">샤프 비율</span>
        </div>
        <p className="text-2xl font-bold text-purple-600">
          {result.sharpeRatio.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
