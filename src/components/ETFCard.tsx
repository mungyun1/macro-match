"use client";

import { useRouter } from "next/navigation";
import { ETF } from "@/types";
import {
  TrendingUp,
  TrendingDown,
  Shield,
  AlertTriangle,
  Zap,
} from "lucide-react";

interface ETFCardProps {
  etf: ETF;
  onSelect?: (etf: ETF) => void;
}

export default function ETFCard({ etf, onSelect }: ETFCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onSelect) {
      onSelect(etf);
    } else {
      router.push(`/recommend/${etf.id}`);
    }
  };
  const getRiskIcon = () => {
    switch (etf.risk) {
      case "low":
        return <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />;
      case "medium":
        return (
          <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
        );
      case "high":
        return <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getRiskLabel = () => {
    const riskLabels = {
      low: "낮음",
      medium: "보통",
      high: "높음",
    };
    return riskLabels[etf.risk];
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(1)}B`;
    } else if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-all cursor-pointer border border-gray-200 hover:border-blue-300 active:scale-95"
      onClick={handleClick}
    >
      <div className="flex justify-between items-start mb-3 sm:mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">
            {etf.symbol}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 font-medium truncate">
            {etf.name}
          </p>
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1">
            {etf.category}
          </span>
        </div>
        <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
          {getRiskIcon()}
          <span className="text-xs text-gray-500">{getRiskLabel()}</span>
        </div>
      </div>

      <div className="mb-3 sm:mb-4">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-xl sm:text-2xl font-bold text-gray-900">
              ${etf.price.toFixed(2)}
            </span>
            <div
              className={`flex items-center mt-1 ${
                etf.changeRate >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {etf.changeRate >= 0 ? (
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              )}
              <span className="text-xs sm:text-sm font-medium">
                {etf.changeRate >= 0 ? "+" : ""}
                {etf.changeRate.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
        <div className="flex justify-between">
          <span>시가총액</span>
          <span className="font-medium">${formatNumber(etf.marketCap)}</span>
        </div>
        <div className="flex justify-between">
          <span>거래량</span>
          <span className="font-medium">{formatNumber(etf.volume)}</span>
        </div>
        <div className="flex justify-between">
          <span>운용비용</span>
          <span className="font-medium">{etf.expense}%</span>
        </div>
      </div>

      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
          {etf.description}
        </p>

        {etf.correlationFactors.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {etf.correlationFactors.slice(0, 3).map((factor, index) => (
              <span
                key={index}
                className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
              >
                {factor}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
