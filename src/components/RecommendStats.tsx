import { formatLastUpdated } from "@/utils/recommendUtils";

interface RecommendStatsProps {
  totalCount: number;
  currentPage: number;
  totalPages: number;
  lastUpdated?: Date;
}

export default function RecommendStats({ lastUpdated }: RecommendStatsProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center space-x-4 text-sm text-gray-500">
        {lastUpdated && (
          <span>마지막 업데이트: {formatLastUpdated(lastUpdated)}</span>
        )}
      </div>
    </div>
  );
}
