import { useState } from "react";
import { Target, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { ETF } from "@/types";
import SelectableETFCard from "./SelectableETFCard";
import ETFCardSkeleton from "../recommend/ETFCardSkeleton";

interface ETFSelectionSectionProps {
  availableETFs: ETF[];
  selectedETFs: ETF[];
  loading: boolean;
  error: string | null;
  onToggleETF: (etf: ETF) => void;
}

export default function ETFSelectionSection({
  availableETFs,
  selectedETFs,
  loading,
  error,
  onToggleETF,
}: ETFSelectionSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const ETFsPerPage = 6;

  const totalPages = Math.ceil(availableETFs.length / ETFsPerPage);
  const startIndex = (currentPage - 1) * ETFsPerPage;
  const endIndex = startIndex + ETFsPerPage;
  const currentETFs = availableETFs.slice(startIndex, endIndex);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <Target className="h-5 w-5 text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">ETF 선택</h2>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <ETFCardSkeleton key={index} />
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600">ETF 데이터를 불러오는데 실패했습니다.</p>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
        </div>
      ) : availableETFs.length === 0 ? (
        <div className="text-center py-8">
          <Target className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">사용 가능한 ETF가 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* ETF 카드 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentETFs.map((etf) => {
              const isSelected = selectedETFs.some(
                (selected) => selected.id === etf.id
              );
              return (
                <SelectableETFCard
                  key={etf.id}
                  etf={etf}
                  isSelected={isSelected}
                  onToggle={onToggleETF}
                />
              );
            })}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-6">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* 선택된 ETF 표시 */}
          {selectedETFs.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">
                선택된 ETF ({selectedETFs.length}개)
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedETFs.map((etf) => (
                  <span
                    key={etf.id}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {etf.symbol}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
