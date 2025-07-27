import { Info } from "lucide-react";

export default function MarketAnalysisCard() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-8 border border-blue-100">
      <div className="flex items-start">
        <Info className="h-5 w-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            현재 시장 상황 분석
          </h3>
          <p className="text-gray-700 leading-relaxed">
            현재 거시경제 지표를 바탕으로 시장 상황을 분석하여 최적의 ETF를
            추천해드립니다. 금리, 인플레이션, 고용률 등의 지표 변화에 따라 추천
            ETF가 달라질 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
