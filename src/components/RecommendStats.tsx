import { formatLastUpdated } from "@/utils/recommendUtils";

interface RecommendStatsProps {
  totalCount: number;
  currentPage: number;
  totalPages: number;
  lastUpdated?: Date;
}

export default function RecommendStats({
  totalCount,
  currentPage,
  totalPages,
  lastUpdated,
}: RecommendStatsProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <p className="text-gray-600">
        총 <span className="font-semibold text-gray-900">{totalCount}</span>
        개의 ETF (페이지 {currentPage} / {totalPages})
      </p>
      <div className="flex items-center space-x-4 text-sm text-gray-500">
        {lastUpdated && (
          <span>마지막 업데이트: {formatLastUpdated(lastUpdated)}</span>
        )}
      </div>
    </div>
  );
}
