"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMacroStore } from "@/store/macroStore";
import { ETF } from "@/types";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Info,
  DollarSign,
  BarChart3,
  Target,
} from "lucide-react";
import {
  generateETFRecommendation,
  analyzeETFInDetail,
} from "@/utils/etfRecommendationEngine";

interface ETFDetailClientProps {
  etf: ETF;
}

export default function ETFDetailClient({ etf }: ETFDetailClientProps) {
  const router = useRouter();
  const { indicators, fetchMacroData, isLoading } = useMacroStore();
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await fetchMacroData();
      setIsDataLoaded(true);
    };
    loadData();
  }, [fetchMacroData]);

  const getRiskLabel = (risk: string) => {
    const labels = { low: "낮음", medium: "보통", high: "높음" };
    return labels[risk as keyof typeof labels];
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "buy":
        return "border-green-200 bg-gradient-to-r from-green-50 to-emerald-50";
      case "sell":
        return "border-red-200 bg-gradient-to-r from-red-50 to-pink-50";
      default:
        return "border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50";
    }
  };

  // 새로운 추천 알고리즘 적용
  const recommendation = generateETFRecommendation(etf, indicators);
  const detailedAnalysis = analyzeETFInDetail(etf, indicators);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-all duration-200 group bg-white rounded-lg px-4 py-2 shadow-sm hover:shadow-md"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          뒤로가기
        </button>

        {/* ETF 헤더 정보 */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-3">
                  <DollarSign className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-1">
                    {etf.symbol}
                  </h1>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {etf.category}
                  </span>
                </div>
              </div>
              <p className="text-xl text-gray-600 mb-4 font-medium">
                {etf.name}
              </p>
              <p className="text-gray-500 max-w-2xl leading-relaxed">
                {etf.description}
              </p>
            </div>
            <div className="text-right">
              <p className="text-5xl font-bold text-gray-900 mb-3">
                ${etf.price?.toFixed(2) || "N/A"}
              </p>
              {etf.changeRate !== null && (
                <div className="flex items-center justify-end gap-3">
                  {etf.changeRate >= 0 ? (
                    <div className="bg-green-100 rounded-full p-2">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                  ) : (
                    <div className="bg-red-100 rounded-full p-2">
                      <TrendingDown className="h-6 w-6 text-red-600" />
                    </div>
                  )}
                  <p
                    className={`text-2xl font-bold ${
                      etf.changeRate >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {etf.changeRate >= 0 ? "+" : ""}
                    {etf.changeRate.toFixed(2)}%
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 추천 요약 카드 */}
        <div
          className={`mb-8 p-8 rounded-2xl border-2 ${getRecommendationColor(
            recommendation.recommendation
          )} shadow-lg`}
        >
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <h2 className="text-3xl font-bold text-gray-900">
                  {etf.symbol} 추천
                </h2>
                <span
                  className={`px-6 py-3 rounded-full text-lg font-bold ${
                    recommendation.recommendation === "buy"
                      ? "bg-green-100 text-green-800 border-2 border-green-200"
                      : recommendation.recommendation === "sell"
                      ? "bg-red-100 text-red-800 border-2 border-red-200"
                      : "bg-gray-100 text-gray-800 border-2 border-gray-200"
                  }`}
                >
                  {recommendation.recommendation === "buy"
                    ? "매수"
                    : recommendation.recommendation === "sell"
                    ? "매도"
                    : "중립"}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <p className="text-sm text-gray-600 mb-1">점수</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {recommendation.score}점
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <p className="text-sm text-gray-600 mb-1">위험도</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {getRiskLabel(recommendation.riskLevel)}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                  <p className="text-sm text-gray-600 mb-1">시장전망</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {recommendation.marketOutlook}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                {recommendation.summary}
              </p>
            </div>
          </div>
        </div>

        {/* 분석 섹션 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* 추천 사유 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-100 rounded-lg p-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">추천 사유</h3>
            </div>
            {isLoading || !isDataLoaded ? (
              <div className="flex items-center gap-3 text-gray-500">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                거시경제 데이터를 불러오는 중입니다...
              </div>
            ) : recommendation.reasons.length > 0 ? (
              <ul className="space-y-3">
                {recommendation.reasons.map((reason, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-sm bg-green-50 rounded-lg p-3"
                  >
                    <span className="text-green-600 mt-1 text-lg">•</span>
                    <span className="text-gray-700 leading-relaxed">
                      {reason}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-gray-500 text-sm">
                  현재 거시경제 지표가 중립적입니다.
                </p>
              </div>
            )}
          </div>

          {/* 위험 요인 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-red-100 rounded-lg p-2">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">위험 요인</h3>
            </div>
            {detailedAnalysis.riskFactors.length > 0 ? (
              <ul className="space-y-3">
                {detailedAnalysis.riskFactors.map((risk, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-sm bg-red-50 rounded-lg p-3"
                  >
                    <span className="text-red-600 mt-1 text-lg">•</span>
                    <span className="text-gray-700 leading-relaxed">
                      {risk}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-gray-500 text-sm">
                  특별한 위험 요인이 감지되지 않았습니다.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 기회 요인 */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 rounded-lg p-2">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">기회 요인</h3>
          </div>
          {detailedAnalysis.opportunities.length > 0 ? (
            <ul className="space-y-3">
              {detailedAnalysis.opportunities.map((op, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-sm bg-blue-50 rounded-lg p-3"
                >
                  <span className="text-blue-600 mt-1 text-lg">•</span>
                  <span className="text-gray-700 leading-relaxed">{op}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-gray-500 text-sm">
                특별한 기회 요인이 감지되지 않았습니다.
              </p>
            </div>
          )}
        </div>

        {/* 분석 섹션 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* 기술적 분석 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-100 rounded-lg p-2">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">기술적 분석</h3>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed">
                {detailedAnalysis.technicalAnalysis}
              </p>
            </div>
          </div>

          {/* 기본적 분석 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-indigo-100 rounded-lg p-2">
                <Target className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">기본적 분석</h3>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed">
                {detailedAnalysis.fundamentalAnalysis}
              </p>
            </div>
          </div>
        </div>

        {/* 기본 정보 */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <div className="bg-gray-100 rounded-lg p-2">
              <Info className="h-6 w-6 text-gray-600" />
            </div>
            기본 정보
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-50 rounded-xl p-4 mb-3">
                <p className="text-sm text-gray-600 mb-2">시가총액</p>
                <p className="text-2xl font-bold text-gray-900">
                  {etf.marketCap
                    ? `$${(etf.marketCap / 1e9).toFixed(1)}B`
                    : "N/A"}
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-green-50 rounded-xl p-4 mb-3">
                <p className="text-sm text-gray-600 mb-2">운용비용</p>
                <p className="text-2xl font-bold text-gray-900">
                  {etf.expense ? `${etf.expense.toFixed(3)}%` : "N/A"}
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-orange-50 rounded-xl p-4 mb-3">
                <p className="text-sm text-gray-600 mb-2">거래량</p>
                <p className="text-2xl font-bold text-gray-900">
                  {etf.volume ? `${(etf.volume / 1e6).toFixed(1)}M` : "N/A"}
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-purple-50 rounded-xl p-4 mb-3">
                <p className="text-sm text-gray-600 mb-2">위험도</p>
                <p className="text-2xl font-bold text-gray-900">
                  {getRiskLabel(etf.risk)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 거시경제 요약 */}
        {macroSummary && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <div className="bg-indigo-100 rounded-lg p-2">
                <BarChart3 className="h-6 w-6 text-indigo-600" />
              </div>
              주요 거시경제 지표
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {macroSummary.interestRate && (
                <div className="text-center">
                  <div className="bg-blue-50 rounded-xl p-6">
                    <p className="text-sm text-gray-600 mb-2">기준금리</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {macroSummary.interestRate.value}%
                    </p>
                    <p className="text-sm text-gray-500">
                      {macroSummary.interestRate.trend}
                    </p>
                  </div>
                </div>
              )}
              {macroSummary.inflation && (
                <div className="text-center">
                  <div className="bg-orange-50 rounded-xl p-6">
                    <p className="text-sm text-gray-600 mb-2">인플레이션</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {macroSummary.inflation.value}%
                    </p>
                    <p className="text-sm text-gray-500">
                      {macroSummary.inflation.trend}
                    </p>
                  </div>
                </div>
              )}
              {macroSummary.employment && (
                <div className="text-center">
                  <div className="bg-green-50 rounded-xl p-6">
                    <p className="text-sm text-gray-600 mb-2">실업률</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {macroSummary.employment.value}%
                    </p>
                    <p className="text-sm text-gray-500">
                      {macroSummary.employment.trend}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
