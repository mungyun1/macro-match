export default function ETFCardSkeleton() {
  return (
    <div className="relative p-6 border-2 border-gray-100 rounded-xl bg-white shadow-sm animate-pulse">
      {/* ETF 심볼과 가격 변동 */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="h-7 bg-gray-200 rounded mb-2 w-20"></div>
          <div className="h-5 bg-gray-200 rounded w-40"></div>
        </div>
        {/* 가격 변동률 스켈레톤 */}
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
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

        {/* 거래량 */}
        <div className="space-y-1">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-5 bg-gray-200 rounded w-20"></div>
        </div>
      </div>

      {/* 수수료 섹션 */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-5 bg-gray-200 rounded w-12"></div>
        </div>
      </div>

      {/* 설명 섹션 */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
}
