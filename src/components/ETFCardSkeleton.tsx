export default function ETFCardSkeleton() {
  return (
    <div className="relative p-6 border-2 border-gray-100 rounded-xl bg-white shadow-sm animate-pulse">
      {/* ETF 심볼과 가격 변동 */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="h-7 bg-gray-200 rounded mb-2 w-20"></div>
          <div className="h-5 bg-gray-200 rounded w-40"></div>
        </div>
      </div>

      {/* ETF 정보 그리드 */}
      <div className="grid grid-cols-2 gap-4">
        {/* 카테고리 */}
        <div className="space-y-1">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-5 bg-gray-200 rounded w-20"></div>
        </div>

        {/* 위험도 */}
        <div className="space-y-1">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-7 bg-gray-200 rounded-full w-16"></div>
        </div>

        {/* 가격 */}
        <div className="space-y-1">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-7 bg-gray-200 rounded w-24"></div>
        </div>

        {/* 수수료 */}
        <div className="space-y-1">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-5 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
}
