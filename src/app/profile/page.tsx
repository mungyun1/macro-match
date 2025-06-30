"use client";

import { useState } from "react";
import {
  User,
  Settings,
  Heart,
  Bell,
  Crown,
  Star,
  Trash2,
  Plus,
  Gift,
  UserCircle,
} from "lucide-react";

export default function ProfilePage() {
  const [user] = useState({
    name: "김투자",
    email: "kimtooja@example.com",
    joinDate: "2024.01.15",
    membershipTier: "프리미엄", // 무료, 프리미엄, VIP
    subscriptionEndDate: "2024.07.15",
  });

  const [watchlist, setWatchlist] = useState([
    {
      id: 1,
      symbol: "KODEX 200",
      name: "KODEX 코스피200",
      currentPrice: 32500,
      change: 2.3,
      addedDate: "2024.01.15",
    },
    {
      id: 2,
      symbol: "TIGER 미국나스닥100",
      name: "TIGER 미국나스닥100",
      currentPrice: 18750,
      change: -1.2,
      addedDate: "2024.01.18",
    },
    {
      id: 3,
      symbol: "ARIRANG 코스닥150",
      name: "ARIRANG 코스닥150",
      currentPrice: 8920,
      change: 0.8,
      addedDate: "2024.01.20",
    },
    {
      id: 4,
      symbol: "KODEX 미국S&P500",
      name: "KODEX 미국S&P500",
      currentPrice: 15600,
      change: 1.5,
      addedDate: "2024.01.22",
    },
  ]);

  const getMembershipIcon = () => {
    switch (user.membershipTier) {
      case "VIP":
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case "프리미엄":
        return <Star className="w-5 h-5 text-blue-500" />;
      default:
        return <User className="w-5 h-5 text-gray-500" />;
    }
  };

  const getMembershipColor = () => {
    switch (user.membershipTier) {
      case "VIP":
        return "bg-gradient-to-r from-yellow-400 to-yellow-600";
      case "프리미엄":
        return "bg-gradient-to-r from-blue-400 to-blue-600";
      default:
        return "bg-gray-500";
    }
  };

  const removeFromWatchlist = (id: number) => {
    setWatchlist(watchlist.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <UserCircle className="w-8 h-8 text-blue-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">마이페이지</h1>
          </div>
          <p className="text-gray-600 mt-2">
            관심 ETF를 관리하고 구독 정보를 확인하세요
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 프로필 정보 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 기본 프로필 */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {user.name}
                  </h2>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">가입일</span>
                  <span className="font-medium">{user.joinDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">관심 ETF</span>
                  <span className="font-medium text-blue-600">
                    {watchlist.length}개
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Settings className="w-4 h-4 mr-2" />
                  설정
                </button>
              </div>
            </div>

            {/* 멤버십 정보 */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                {getMembershipIcon()}
                <h3 className="text-lg font-semibold text-gray-900 ml-2">
                  멤버십
                </h3>
              </div>

              <div
                className={`${getMembershipColor()} text-white p-4 rounded-lg mb-4`}
              >
                <div className="text-lg font-bold">{user.membershipTier}</div>
                <div className="text-sm opacity-90">
                  {user.membershipTier !== "무료" &&
                    `구독 만료: ${user.subscriptionEndDate}`}
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      user.membershipTier !== "무료"
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  ></div>
                  <span
                    className={
                      user.membershipTier !== "무료"
                        ? "text-gray-900"
                        : "text-gray-500"
                    }
                  >
                    무제한 ETF 추천
                  </span>
                </div>
                <div className="flex items-center">
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      user.membershipTier === "프리미엄" ||
                      user.membershipTier === "VIP"
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  ></div>
                  <span
                    className={
                      user.membershipTier === "프리미엄" ||
                      user.membershipTier === "VIP"
                        ? "text-gray-900"
                        : "text-gray-500"
                    }
                  >
                    AI 분석 리포트
                  </span>
                </div>
              </div>

              {user.membershipTier === "무료" && (
                <button className="w-full mt-4 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-colors">
                  <Gift className="w-4 h-4 mr-2" />
                  프리미엄 업그레이드
                </button>
              )}
            </div>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 관심 ETF 목록 */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Heart className="w-5 h-5 text-red-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    관심 ETF
                  </h3>
                </div>
                <button className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  <Plus className="w-4 h-4 mr-1" />
                  추가
                </button>
              </div>

              {watchlist.length > 0 ? (
                <div className="space-y-3">
                  {watchlist.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">
                              {item.symbol}
                            </div>
                            <div className="text-sm text-gray-600">
                              {item.name}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              추가일: {item.addedDate}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-medium text-gray-900">
                              {item.currentPrice.toLocaleString()}원
                            </div>
                            <div
                              className={`text-sm font-medium ${
                                item.change >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {item.change >= 0 ? "+" : ""}
                              {item.change}%
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromWatchlist(item.id)}
                        className="ml-4 p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>관심 ETF가 없습니다</p>
                  <p className="text-sm">관심있는 ETF를 추가해보세요</p>
                </div>
              )}
            </div>

            {/* 알림 설정 */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <Bell className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">
                  알림 설정
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">
                      가격 변동 알림
                    </div>
                    <div className="text-sm text-gray-600">
                      관심 ETF의 가격이 5% 이상 변동시 알림
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">
                      시장 분석 리포트
                    </div>
                    <div className="text-sm text-gray-600">
                      주간 시장 분석 리포트 수신
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
