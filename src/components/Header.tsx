"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Globe, User, LogOut } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = () => {
      const loginStatus = localStorage.getItem("isLoggedIn");
      setIsLoggedIn(loginStatus === "true");
    };

    // 초기 로그인 상태 확인
    checkLoginStatus();

    // 로그인 상태 변경 감지를 위한 이벤트 리스너들
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "isLoggedIn") {
        checkLoginStatus();
      }
    };

    const handleLoginStateChange = (e: CustomEvent) => {
      setIsLoggedIn(e.detail.isLoggedIn);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(
      "loginStateChanged",
      handleLoginStateChange as EventListener
    );

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "loginStateChanged",
        handleLoginStateChange as EventListener
      );
    };
  }, []);

  // 로그아웃 함수
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);

    // 로그아웃 상태 변경 이벤트 발생
    window.dispatchEvent(
      new CustomEvent("loginStateChanged", { detail: { isLoggedIn: false } })
    );

    router.push("/");
  };

  const getCurrentPage = () => {
    if (pathname === "/") return "home";
    if (pathname.startsWith("/analysis")) return "analysis";
    if (pathname.startsWith("/recommend")) return "etf";
    if (pathname.startsWith("/strategy")) return "strategy";
    if (pathname.startsWith("/profile")) return "profile";
    return "home";
  };

  const currentPage = getCurrentPage();

  const getNavItemClass = (page: string) => {
    if (currentPage === page) {
      return "text-white font-medium";
    }
    return "text-white/80 hover:text-white transition-colors";
  };

  const getMobileNavItemClass = (page: string) => {
    if (currentPage === page) {
      return "text-white font-medium py-2 px-4 rounded-md bg-white/10";
    }
    return "text-white/80 hover:text-white transition-colors py-2 px-4 rounded-md hover:bg-white/10";
  };

  return (
    <header className="bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 sm:py-6">
          {/* 로고 */}
          <Link href="/">
            <div className="flex items-center">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg sm:text-xl">
                  M
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold cursor-pointer bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                MicroMatch
              </h1>
            </div>
          </Link>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/analysis" className={getNavItemClass("analysis")}>
              지표 분석
            </Link>
            <Link href="/recommend" className={getNavItemClass("etf")}>
              ETF 추천
            </Link>
            <Link href="/strategy" className={getNavItemClass("strategy")}>
              전략 시뮬레이터
            </Link>
          </nav>

          {/* 우측 버튼들 */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-white hover:text-white/80 transition-colors">
              <Globe className="h-5 w-5" />
            </button>

            {isLoggedIn ? (
              <>
                <Link href="/profile">
                  <button className="p-2 text-white hover:text-white/80 transition-colors">
                    <User className="h-5 w-5" />
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-white bg-gradient-to-r from-red-500/90 to-red-600/90 rounded-md hover:from-red-500 hover:to-red-600 transition-all flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>로그아웃</span>
                </button>
              </>
            ) : (
              <Link href="/login">
                <button className="cursor-pointer px-4 py-2 text-white bg-gradient-to-r from-blue-400/90 to-purple-600/90 rounded-md hover:from-blue-400 hover:to-purple-600 transition-all">
                  로그인
                </button>
              </Link>
            )}
          </div>

          {/* 모바일 햄버거 메뉴 버튼 */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-white hover:text-white/80 hover:bg-white/10 transition-colors"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* 모바일 네비게이션 메뉴 */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-700/50 py-4 bg-gray-900/95 backdrop-blur-md">
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
              <Link
                href="/recommend"
                className={getMobileNavItemClass("etf")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ETF 추천
              </Link>
              <Link
                href="/strategy"
                className={getMobileNavItemClass("strategy")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                전략 시뮬레이터
              </Link>
              <Link
                href="/profile"
                className={getMobileNavItemClass("profile")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                마이페이지
              </Link>
              <div className="pt-4 border-t border-gray-700/50">
                {isLoggedIn ? (
                  <>
                    <Link href="/profile">
                      <button className="w-full px-4 py-2 text-white bg-gradient-to-r from-blue-400/90 to-purple-600/90 rounded-md hover:from-blue-400 hover:to-purple-600 transition-all mb-2 flex items-center justify-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>마이 페이지</span>
                      </button>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-white bg-gradient-to-r from-red-500/90 to-red-600/90 rounded-md hover:from-red-500 hover:to-red-600 transition-all flex items-center justify-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>로그아웃</span>
                    </button>
                  </>
                ) : (
                  <Link href="/login">
                    <button className="w-full px-4 py-2 text-white bg-gradient-to-r from-blue-400/90 to-purple-600/90 rounded-md hover:from-blue-400 hover:to-purple-600 transition-all mb-2">
                      로그인
                    </button>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
