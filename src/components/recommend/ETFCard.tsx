"use client";

import { ETF } from "@/types";

interface ETFCardProps {
  etf: ETF;
}

export default function ETFCard({ etf }: ETFCardProps) {
  return (
    <div className="relative p-6 border-2 border-gray-100 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:border-blue-200 hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-white">
      {/* ETF 심볼과 가격 변동 */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{etf.symbol}</h3>
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {etf.name}
          </p>
        </div>
        {etf.changeRate !== null && (
          <div className="text-right">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                etf.changeRate >= 0
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {etf.changeRate >= 0 ? "+" : ""}
              {etf.changeRate.toFixed(2)}%
            </span>
          </div>
        )}
      </div>

      {/* ETF 정보 그리드 */}
      <div className="grid grid-cols-2 gap-4">
        {/* 카테고리 */}
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            카테고리
          </p>
          <p className="text-sm font-semibold text-gray-900">{etf.category}</p>
        </div>

        {/* 위험도 */}
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            위험도
          </p>
          <div className="flex items-center">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                etf.risk === "low"
                  ? "bg-green-100 text-green-800"
                  : etf.risk === "medium"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {etf.risk === "low"
                ? "낮음"
                : etf.risk === "medium"
                ? "보통"
                : "높음"}
            </span>
          </div>
        </div>

        {/* 가격 */}
        {etf.price !== null && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              현재가
            </p>
            <p className="text-lg font-bold text-gray-900">
              ${etf.price.toFixed(2)}
            </p>
          </div>
        )}

        {/* 거래량 */}
        {etf.volume !== null && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              거래량
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {etf.volume.toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {/* 수수료 */}
      {etf.expense !== null && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              수수료
            </span>
            <span className="text-sm font-semibold text-gray-900">
              {etf.expense}%
            </span>
          </div>
        </div>
      )}

      {/* 설명 */}
      {etf.description && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
            {etf.description}
          </p>
        </div>
      )}
    </div>
  );
}
