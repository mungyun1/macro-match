"use client";

interface RecommendStatsProps {
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export default function RecommendStats({
  totalCount,
  currentPage,
  totalPages,
}: RecommendStatsProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center space-x-4 text-sm text-gray-500">
        <span>총 {totalCount}개 ETF</span>
        <span>•</span>
        <span>
          페이지 {currentPage} / {totalPages}
        </span>
      </div>
    </div>
  );
}
