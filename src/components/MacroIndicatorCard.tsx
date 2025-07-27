import { MacroIndicator } from "@/types";
import { TrendingUp, TrendingDown, Minus, Zap } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface MacroIndicatorCardProps {
  indicator: MacroIndicator;
}

export default function MacroIndicatorCard({
  indicator,
}: MacroIndicatorCardProps) {
  // 실제 API 데이터를 사용하는 지표들
  const realTimeIndicators = ["S&P 500 지수", "원달러 환율", "WTI 원유가격"];

  const isRealTime = realTimeIndicators.includes(indicator.name);

  const getTrendIcon = () => {
    if (indicator.changeRate > 0) {
      return <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />;
    } else if (indicator.changeRate < 0) {
      return <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />;
    } else {
      return <Minus className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />;
    }
  };

  const getTrendColor = () => {
    if (indicator.changeRate > 0) return "text-green-500";
    if (indicator.changeRate < 0) return "text-red-500";
    return "text-gray-400";
  };

  const getCategoryName = (category: string) => {
    const categoryNames = {
      "interest-rate": "금리",
      inflation: "인플레이션",
      employment: "고용",
      energy: "에너지",
      currency: "통화",
      growth: "성장",
    };
    return categoryNames[category as keyof typeof categoryNames] || category;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3 sm:mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
              {indicator.name}
            </h3>
            {isRealTime && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <Zap className="h-3 w-3 mr-1" />
                실시간
              </span>
            )}
          </div>
          <span className="text-xs sm:text-sm text-gray-500">
            {getCategoryName(indicator.category)}
          </span>
        </div>
        <div className="flex items-center ml-2 flex-shrink-0">
          {getTrendIcon()}
        </div>
      </div>

      <div className="mb-3 sm:mb-4">
        <div className="flex items-baseline">
          <span className="text-2xl sm:text-3xl font-bold text-gray-900">
            {indicator.value.toFixed(2)}
          </span>
          <span className="text-xs sm:text-sm text-gray-500 ml-1">
            {indicator.unit}
          </span>
        </div>

        <div className={`flex items-center mt-2 ${getTrendColor()}`}>
          <span className="text-xs sm:text-sm font-medium">
            {indicator.changeRate > 0 ? "+" : ""}
            {indicator.changeRate.toFixed(2)}
            {indicator.unit}
          </span>
          <span className="text-xs text-gray-400 ml-2">(전월 대비)</span>
        </div>
      </div>

      <div className="text-xs text-gray-400">
        업데이트:{" "}
        {format(new Date(indicator.updatedAt), "yyyy.MM.dd HH:mm", {
          locale: ko,
        })}
      </div>
    </div>
  );
}
