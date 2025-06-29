"use client";

import { useState } from "react";
import Link from "next/link";
import { BarChart3, Menu, X } from "lucide-react";

interface HeaderProps {
  currentPage?: "home" | "analysis" | "etf" | "strategy" | "profile";
}

export default function Header({ currentPage = "home" }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getNavItemClass = (page: string) => {
    if (currentPage === page) {
      return "text-blue-600 font-medium";
    }
    return "text-gray-600 hover:text-blue-600 transition-colors";
  };

  const getMobileNavItemClass = (page: string) => {
    if (currentPage === page) {
      return "text-blue-600 font-medium py-2 px-4 rounded-md bg-blue-50";
    }
    return "text-gray-600 hover:text-blue-600 transition-colors py-2 px-4 rounded-md hover:bg-gray-50";
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 sm:py-6">
          <div className="flex items-center">
            <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mr-2 sm:mr-3" />
            <Link href="/">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 cursor-pointer">
                MacroMatch
              </h1>
            </Link>
          </div>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className={getNavItemClass("home")}>
              홈
            </Link>
            <Link href="/analysis" className={getNavItemClass("analysis")}>
              지표 분석
            </Link>
            <a href="#" className={getNavItemClass("etf")}>
              ETF 추천
            </a>
            <a href="#" className={getNavItemClass("strategy")}>
              전략 시뮬레이터
            </a>
            <a href="#" className={getNavItemClass("profile")}>
              마이페이지
            </a>
          </nav>

          {/* 모바일 햄버거 메뉴 버튼 */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* 모바일 네비게이션 메뉴 */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className={getMobileNavItemClass("home")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                홈
              </Link>
              <Link
                href="/analysis"
                className={getMobileNavItemClass("analysis")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                지표 분석
              </Link>
              <a
                href="#"
                className={getMobileNavItemClass("etf")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ETF 추천
              </a>
              <a
                href="#"
                className={getMobileNavItemClass("strategy")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                전략 시뮬레이터
              </a>
              <a
                href="#"
                className={getMobileNavItemClass("profile")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                마이페이지
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
