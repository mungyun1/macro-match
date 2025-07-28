"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMacroStore } from "@/store/macroStore";
import { ETF } from "@/types";
import { ArrowLeft, TrendingUp } from "lucide-react";

interface ETFDetailClientProps {
  etf: ETF;
}

export default function ETFDetailClient({ etf }: ETFDetailClientProps) {
  const router = useRouter();
  const { indicators, fetchMacroData } = useMacroStore();

  useEffect(() => {
    fetchMacroData();
  }, [fetchMacroData]);

  const getRiskLabel = (risk: string) => {
    const labels = { low: "낮음", medium: "보통", high: "높음" };
    return labels[risk as keyof typeof labels];
  };

  // ETF 추천 이유 생성 함수
  const getRecommendationReason = (selectedETF: ETF) => {
    if (indicators.length === 0) {
      return {
        reasons: ["거시경제 데이터를 불러오는 중입니다."],
        riskWarnings: [],
      };
    }

    const interestRateIndicator = indicators.find(
      (i) => i.category === "interest-rate"
    );
    const inflationIndicator = indicators.find(
      (i) => i.category === "inflation"
    );
    const employmentIndicator = indicators.find(
      (i) => i.category === "employment"
    );

    const reasons: string[] = [];
    const riskWarnings: string[] = [];

    // ETF별 맞춤 추천 이유 생성
    switch (selectedETF.symbol) {
      case "SPY":
        if (employmentIndicator && employmentIndicator.changeRate < 0) {
          reasons.push("• 고용 지표 개선으로 소비 증가 및 기업 실적 향상 기대");
        }
        if (interestRateIndicator && interestRateIndicator.changeRate > 0) {
          riskWarnings.push("• 금리 상승으로 인한 밸류에이션 부담 주의");
        } else {
          reasons.push("• 안정적인 금리 환경으로 주식 투자 매력도 증가");
        }
        reasons.push("• 미국 대형주 중심으로 안정적인 분산투자 효과");
        break;

      case "TLT":
        if (interestRateIndicator && interestRateIndicator.changeRate < 0) {
          reasons.push("• 금리 하락 기대로 장기채권 가격 상승 가능성");
        } else if (
          interestRateIndicator &&
          interestRateIndicator.changeRate > 0
        ) {
          riskWarnings.push("• 금리 상승으로 인한 채권 가격 하락 위험");
        }
        if (inflationIndicator && inflationIndicator.changeRate < 0) {
          reasons.push("• 인플레이션 둔화로 실질 수익률 개선");
        }
        reasons.push("• 경기 불확실성 시기 안전자산으로서의 역할");
        break;

      case "QQQ":
        if (interestRateIndicator && interestRateIndicator.changeRate < 0) {
          reasons.push("• 저금리 환경에서 성장주 매력도 증가");
        } else {
          riskWarnings.push("• 금리 상승으로 인한 기술주 밸류에이션 부담");
        }
        reasons.push("• 기술 혁신과 디지털 전환 트렌드 지속");
        riskWarnings.push("• 높은 변동성으로 단기 투자시 주의 필요");
        break;

      case "GLD":
        if (inflationIndicator && inflationIndicator.changeRate > 0) {
          reasons.push("• 인플레이션 상승으로 금의 실물자산 가치 부각");
        }
        if (interestRateIndicator && interestRateIndicator.value < 2) {
          reasons.push("• 저금리 환경에서 무이자 자산인 금의 기회비용 감소");
        }
        reasons.push("• 지정학적 리스크 증가 시 안전자산 수요 증가");
        riskWarnings.push("• 달러 강세 시 금 가격 하락 위험");
        break;

      default:
        reasons.push("• 현재 거시경제 환경을 고려한 포트폴리오 다양화 효과");
        reasons.push("• 시장 변동성에 대응하는 분산투자 전략");
    }

    return { reasons, riskWarnings };
  };

  // 거시경제 요약 정보 생성
  const getMacroSummary = () => {
    if (indicators.length === 0) return null;

    const interestRate = indicators.find((i) => i.category === "interest-rate");
    const inflation = indicators.find((i) => i.category === "inflation");
    const employment = indicators.find((i) => i.category === "employment");

    return {
      interestRate: interestRate
        ? {
            value: interestRate.value,
            change: interestRate.changeRate,
            trend:
              interestRate.changeRate > 0
                ? "상승"
                : interestRate.changeRate < 0
                ? "하락"
                : "횡보",
          }
        : null,
      inflation: inflation
        ? {
            value: inflation.value,
            change: inflation.changeRate,
            trend:
              inflation.changeRate > 0
                ? "상승"
                : inflation.changeRate < 0
                ? "하락"
                : "횡보",
          }
        : null,
      employment: employment
        ? {
            value: employment.value,
            change: employment.changeRate,
            trend:
              employment.changeRate > 0
                ? "악화"
                : employment.changeRate < 0
                ? "개선"
                : "횡보",
          }
        : null,
    };
  };

  const macroSummary = getMacroSummary();
  const recommendation = getRecommendationReason(etf);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        뒤로가기
      </button>

      {/* ETF 헤더 정보 */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {etf.symbol}
            </h1>
            <p className="text-lg text-gray-600 mb-2">{etf.name}</p>
            <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              {etf.category}
            </span>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900">
              ${etf.price?.toFixed(2) || "N/A"}
            </p>
            {etf.changeRate !== null && (
              <p
                className={`text-lg font-semibold ${
                  etf.changeRate >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {etf.changeRate >= 0 ? "+" : ""}
                {etf.changeRate.toFixed(2)}%
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 메인 내용 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 왼쪽 컬럼 - 기본 정보 */}
        <div className="space-y-6">
          {/* 기본 정보 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              기본 정보
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">시가총액</p>
                <p className="font-medium text-lg">
                  {etf.marketCap
                    ? `$${(etf.marketCap / 1000000000).toFixed(1)}B`
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">거래량</p>
                <p className="font-medium text-lg">
                  {etf.volume ? `${(etf.volume / 1000000).toFixed(1)}M` : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">운용비용</p>
                <p className="font-medium text-lg">{etf.expense}%</p>
              </div>
              <div>
                <p className="text-gray-500">위험도</p>
                <p className="font-medium text-lg">{getRiskLabel(etf.risk)}</p>
              </div>
            </div>
          </div>

          {/* 설명 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              상품 설명
            </h3>
            <p className="text-gray-700 leading-relaxed">{etf.description}</p>
          </div>

          {/* 연관 지표 */}
          {etf.correlationFactors.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                연관 거시경제 지표
              </h3>
              <div className="flex flex-wrap gap-2">
                {etf.correlationFactors.map((factor, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium"
                  >
                    {factor}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 거시경제 현황 */}
          {macroSummary &&
            (macroSummary.interestRate ||
              macroSummary.inflation ||
              macroSummary.employment) && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  현재 거시경제 현황
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {macroSummary.interestRate && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">기준금리</p>
                      <p className="text-xl font-bold text-gray-900">
                        {macroSummary.interestRate.value}%
                      </p>
                      <p
                        className={`text-sm ${
                          macroSummary.interestRate.change >= 0
                            ? "text-red-500"
                            : "text-blue-500"
                        }`}
                      >
                        {macroSummary.interestRate.trend} (
                        {macroSummary.interestRate.change >= 0 ? "+" : ""}
                        {macroSummary.interestRate.change}%p)
                      </p>
                    </div>
                  )}
                  {macroSummary.inflation && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">물가상승률</p>
                      <p className="text-xl font-bold text-gray-900">
                        {macroSummary.inflation.value}%
                      </p>
                      <p
                        className={`text-sm ${
                          macroSummary.inflation.change >= 0
                            ? "text-red-500"
                            : "text-blue-500"
                        }`}
                      >
                        {macroSummary.inflation.trend} (
                        {macroSummary.inflation.change >= 0 ? "+" : ""}
                        {macroSummary.inflation.change}%p)
                      </p>
                    </div>
                  )}
                  {macroSummary.employment && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">실업률</p>
                      <p className="text-xl font-bold text-gray-900">
                        {macroSummary.employment.value}%
                      </p>
                      <p
                        className={`text-sm ${
                          macroSummary.employment.change <= 0
                            ? "text-blue-500"
                            : "text-red-500"
                        }`}
                      >
                        {macroSummary.employment.trend} (
                        {macroSummary.employment.change >= 0 ? "+" : ""}
                        {macroSummary.employment.change}%p)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
        </div>

        {/* 오른쪽 컬럼 - 추천 분석 */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
              거시경제 분석 기반 추천 이유
            </h3>

            <div className="space-y-6">
              {recommendation.reasons.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-green-700 mb-3">
                    ✅ 투자 포인트
                  </h4>
                  <div className="bg-green-50 rounded-lg p-4">
                    {recommendation.reasons.map((reason, index) => (
                      <p
                        key={index}
                        className="text-sm text-green-800 leading-relaxed mb-2 last:mb-0"
                      >
                        {reason}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {recommendation.riskWarnings.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-amber-700 mb-3">
                    ⚠️ 주의사항
                  </h4>
                  <div className="bg-amber-50 rounded-lg p-4">
                    {recommendation.riskWarnings.map((warning, index) => (
                      <p
                        key={index}
                        className="text-sm text-amber-800 leading-relaxed mb-2 last:mb-0"
                      >
                        {warning}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  💡 <strong>투자 참고:</strong> 위 분석은 현재 거시경제 지표를
                  바탕으로 한 참고 정보이며, 실제 투자 결정 시에는 추가적인
                  분석과 전문가 상담을 권장합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
