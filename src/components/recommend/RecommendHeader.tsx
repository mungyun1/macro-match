import { Target } from "lucide-react";

export default function RecommendHeader() {
  return (
    <div className="mb-8">
      <div className="mb-4">
        <div className="flex items-center">
          <Target className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">ETF 추천</h1>
        </div>
      </div>
      <p className="text-lg text-gray-600">
        투자 목적과 위험 성향에 맞는 최적의 ETF를 찾아보세요. 검증된 데이터를
        기반으로 맞춤형 ETF 포트폴리오를 추천해드립니다.
      </p>
    </div>
  );
}
