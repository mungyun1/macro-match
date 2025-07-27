import MacroIndicatorCard from "@/components/MacroIndicatorCard";
import ETFCardWrapper from "@/components/ETFCardWrapper";
import { BarChart3, TrendingUp, DollarSign } from "lucide-react";
import { getMacroData } from "@/utils/macroDataService";
import { MacroIndicator, ETF } from "@/types";

export default async function Home() {
  let indicators: MacroIndicator[] = [];
  let featuredETFs: ETF[] = [];
  let error = null;

  try {
    const data = await getMacroData();
    indicators = data.indicators;
    featuredETFs = data.featuredETFs;
  } catch (err) {
    error =
      err instanceof Error ? err.message : "데이터를 불러오는데 실패했습니다.";
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="text-center py-8">
          <p className="text-red-500 text-sm sm:text-base">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* 서비스 소개 */}
      <section className="text-center my-8 sm:my-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 px-2">
          거시경제 흐름에 맞는 ETF를 추천받으세요
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
          금리, 인플레이션, 유가, 실업률 등 주요 거시경제 지표를 실시간으로
          분석하여 시장 상황에 적합한 ETF를 추천해드립니다.
        </p>
      </section>

      {/* 거시경제 지표 대시보드 */}
      <section className="mb-8 sm:mb-12">
        <div className="flex items-center mb-4 sm:mb-6">
          <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mr-2" />
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
            주요 거시경제 지표
          </h3>
        </div>

        {indicators.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {indicators.map((indicator) => (
              <MacroIndicatorCard key={indicator.id} indicator={indicator} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm sm:text-base">
              거시경제 지표 데이터를 불러오는 중입니다...
            </p>
          </div>
        )}
      </section>

      {/* 추천 ETF */}
      <section className="mb-8 sm:mb-12">
        <div className="flex items-center mb-4 sm:mb-6">
          <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mr-2" />
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
            현재 상황 추천 ETF
          </h3>
        </div>

        {featuredETFs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {featuredETFs.map((etf) => (
              <ETFCardWrapper key={etf.id} etf={etf} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm sm:text-base">
              추천 ETF 데이터를 불러오는 중입니다...
            </p>
          </div>
        )}
      </section>

      {/* 서비스 특징 */}
      <section className="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
          MacroMatch의 특징
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full p-3 sm:p-4 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            </div>
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              실시간 지표 분석
            </h4>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              주요 거시경제 지표를 실시간으로 모니터링하고 변화 추이를
              분석합니다.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 rounded-full p-3 sm:p-4 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
            </div>
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              AI 기반 추천
            </h4>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              거시경제 상황에 맞는 최적의 ETF를 AI 알고리즘으로 추천해드립니다.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 rounded-full p-3 sm:p-4 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
              <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
            </div>
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              포트폴리오 최적화
            </h4>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              개인의 투자 성향과 목표에 맞는 포트폴리오 구성을 도와드립니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
