"use client";

import { Search } from "lucide-react";

interface EmptyResultsProps {
  onReset: () => void;
}

export default function EmptyResults({ onReset }: EmptyResultsProps) {
  return (
    <div className="text-center py-12">
      <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Search className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        검색 결과가 없습니다
      </h3>
      <p className="text-gray-500 mb-4">
        다른 검색어나 필터 조건을 시도해보세요
      </p>
      <button
        onClick={onReset}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        필터 초기화
      </button>
    </div>
  );
}
