import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Target,
  Calculator,
  Brain,
} from "lucide-react";

export default async function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* 서비스 소개 */}
      <section className="text-center my-12">
        <h2 className="text-4xl sm:text-5xl font-bold mb-4 px-2 leading-tight">
          <span className="text-gray-900">거시경제 흐름에 맞는</span>
          <br />
          <span className="text-blue-600">ETF를 추천받으세요</span>
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto px-4">
          금리, 인플레이션, 유가, 실업률 등 주요 거시경제 지표를 실시간으로
          분석하여 시장 상황에 적합한 ETF를 추천해드립니다.
        </p>
        <div className="mt-6 sm:mt-10">
          <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-4 px-8 sm:py-5 sm:px-12 rounded-full text-lg sm:text-xl transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer">
            무료 시작하기
          </button>
        </div>
      </section>

      {/* 서비스 특징 */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl shadow-lg p-6 sm:p-8 lg:p-12 border border-gray-100 mb-8 sm:mb-12">
        <div className="text-center mb-8 sm:mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            왜 MacroMatch를 선택해야 할까요?
          </h3>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            투자 목적과 위험 성향에 맞는 최적의 ETF를 찾아보세요. 검증된
            데이터를 기반으로 맞춤형 ETF 포트폴리오를 추천해드립니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="group bg-white rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-lg">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">
              실시간 시장 분석
            </h4>
            <p className="text-base text-gray-600 leading-relaxed text-center">
              주요 경제 지표와 시장 데이터를 분석하여 투자 의사결정에 필요한
              인사이트를 제공합니다.
            </p>
          </div>

          <div className="group bg-white rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-lg">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">
              AI 기반 포트폴리오 추천
            </h4>
            <p className="text-base text-gray-600 leading-relaxed text-center">
              다양한 ETF 조합으로 투자 전략을 백테스트하고 성과를
              시뮬레이션합니다.
            </p>
          </div>

          <div className="group bg-white rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-lg">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">
              리스크 관리 최적화
            </h4>
            <p className="text-base text-gray-600 leading-relaxed text-center">
              현재 거시경제 지표를 바탕으로 시장 상황을 분석하여 최적의 ETF를
              추천합니다.
            </p>
          </div>

          <div className="group bg-white rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-lg">
              <Target className="h-8 w-8 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">
              맞춤형 ETF 추천
            </h4>
            <p className="text-base text-gray-600 leading-relaxed text-center">
              투자 목적과 위험 성향에 맞는 최적의 ETF를 찾아보세요.
            </p>
          </div>

          <div className="group bg-white rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-lg">
              <Calculator className="h-8 w-8 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">
              전략 시뮬레이터
            </h4>
            <p className="text-base text-gray-600 leading-relaxed text-center">
              다양한 ETF 조합으로 투자 전략을 백테스트하고 성과를
              시뮬레이션해보세요.
            </p>
          </div>

          <div className="group bg-white rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
            <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-lg">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">
              AI 예측 분석
            </h4>
            <p className="text-base text-gray-600 leading-relaxed text-center">
              머신러닝 기반 포트폴리오 미래 전망을 제공합니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
