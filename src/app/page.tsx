"use client";

import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Target,
  Calculator,
  Brain,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const featureCards = [
    {
      icon: BarChart3,
      title: "실시간 시장 분석",
      description:
        "주요 경제 지표와 시장 데이터를 분석하여 투자 의사결정에 필요한 인사이트를 제공합니다.",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      icon: TrendingUp,
      title: "AI 기반 포트폴리오 추천",
      description:
        "다양한 ETF 조합으로 투자 전략을 백테스트하고 성과를 시뮬레이션합니다.",
      gradient: "from-green-500 to-green-600",
    },
    {
      icon: DollarSign,
      title: "리스크 관리 최적화",
      description:
        "현재 거시경제 지표를 바탕으로 시장 상황을 분석하여 최적의 ETF를 추천합니다.",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      icon: Target,
      title: "맞춤형 ETF 추천",
      description: "투자 목적과 위험 성향에 맞는 최적의 ETF를 찾아보세요.",
      gradient: "from-orange-500 to-orange-600",
    },
    {
      icon: Calculator,
      title: "전략 시뮬레이터",
      description:
        "다양한 ETF 조합으로 투자 전략을 백테스트하고 성과를 시뮬레이션해보세요.",
      gradient: "from-indigo-500 to-indigo-600",
    },
    {
      icon: Brain,
      title: "AI 예측 분석",
      description: "머신러닝 기반 포트폴리오 미래 전망을 제공합니다.",
      gradient: "from-teal-500 to-teal-600",
    },
  ];

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 서비스 소개 */}
      <motion.section className="text-center my-12" variants={itemVariants}>
        <motion.h2
          className="text-4xl sm:text-5xl font-bold mb-4 px-2 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="text-gray-900">거시경제 흐름에 맞는</span>
          <br />
          <span className="text-blue-600">ETF를 추천</span>받으세요
        </motion.h2>
        <motion.p
          className="text-xl text-gray-600 max-w-3xl mx-auto px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          금리, 인플레이션, 유가, 실업률 등 주요 거시경제 지표를 실시간으로
          분석하여 시장 상황에 적합한 ETF를 추천해드립니다.
        </motion.p>
        <motion.div
          className="mt-6 sm:mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.button
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-4 px-8 sm:py-5 sm:px-12 rounded-full text-lg sm:text-xl transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
            whileHover={{
              scale: 1.05,
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            무료로 추천받기📊
          </motion.button>
        </motion.div>
      </motion.section>

      {/* 서비스 특징 */}
      <motion.section
        className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl shadow-lg p-6 sm:p-8 lg:p-12 border border-gray-100 mb-8 sm:mb-12"
        variants={itemVariants}
      >
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            왜{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              MicroMatch
            </span>
            를 선택해야 할까요?
          </h3>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            투자 목적과 위험 성향에 맞는 최적의 ETF를 찾아보세요. 검증된
            데이터를 기반으로 맞춤형 ETF 포트폴리오를 추천해드립니다.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featureCards.map((card, index) => (
            <motion.div
              key={index}
              className="group bg-white rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
              variants={cardVariants}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{
                y: -10,
                transition: { duration: 0.3 },
              }}
            >
              <motion.div
                className={`bg-gradient-to-br ${card.gradient} rounded-2xl p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-lg`}
                whileHover={{
                  scale: 1.1,
                  rotate: 5,
                  transition: { duration: 0.3 },
                }}
              >
                <card.icon className="h-8 w-8 text-white" />
              </motion.div>
              <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">
                {card.title}
              </h4>
              <p className="text-base text-gray-600 leading-relaxed text-center">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
