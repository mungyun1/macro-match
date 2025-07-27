# MicroMatch

> 거시경제 흐름에 맞는 ETF를 추천받으세요

MicroMatch는 거시경제 지표 기반 ETF 추천 엔진입니다. 금리, 인플레이션, 유가, 실업률, 경기선행지수, 달러인덱스 등 주요 지표를 실시간 반영하여 시장 상황에 적합한 ETF를 큐레이션하는 개인화 웹 서비스입니다.

## 🎯 주요 기능

### 1. 거시지표 대시보드

- 실시간/주간 업데이트 지표 시각화
- 전월 대비 변화율 및 추세 분석
- 사용자 지역 기준 지표 커스터마이징

### 2. 자동 ETF 매칭 시스템

- 지표 변화에 따른 전략 매칭
- 매칭 알고리즘 기반 추천 ETF 카드
- ETF별 성과, 리스크 지표 제공
- **실시간 ETF 데이터 연동** (Yahoo Finance, Alpha Vantage)

### 3. 전략 시뮬레이터

- 사용자 선택 지표 조합 기반 포트폴리오 구성
- 백테스트를 통한 과거 수익률 시뮬레이션

### 4. 사용자 맞춤 전략 저장

- 사용자 프로필 기반 전략 저장
- 지표 변화 시 포트폴리오 리밸런싱 알림

## 🛠️ 기술 스택

### Frontend

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **State Management**: Zustand
- **Icons**: Lucide React
- **Date Handling**: date-fns

### Backend (예정)

- **Runtime**: Node.js + Express
- **Database**: PostgreSQL
- **API Integration**: FRED, OECD, Alpha Vantage

## 🚀 시작하기

### 필수 요구사항

- Node.js 18.0 이상
- npm 또는 yarn

### 설치 및 실행

1. **의존성 설치**

   ```bash
   npm install
   ```

2. **환경 변수 설정 (선택사항)**

   실제 경제 데이터를 사용하려면 API 키를 설정하세요:

   ```bash
   # env.example 파일을 .env.local로 복사
   cp env.example .env.local
   ```

3. **개발 서버 실행**

   ```bash
   npm run dev
   ```

4. **브라우저에서 확인**
   - [http://localhost:3000](http://localhost:3000) 접속

### 📊 실제 데이터 사용 현황

현재 다음 데이터들이 실제 API를 통해 제공됩니다:

#### 거시경제 지표

- **S&P 500 지수**: Alpha Vantage API 실시간 데이터
- **원달러 환율**: Alpha Vantage API 실시간 데이터
- **WTI 원유가격**: Alpha Vantage API 실시간 데이터
- **10년 국채 수익률**: Alpha Vantage API 실시간 데이터
- **달러 인덱스**: Alpha Vantage API 실시간 데이터
- **실업률**: Alpha Vantage API 실시간 데이터

#### ETF 데이터

- **실시간 가격**: Yahoo Finance API (무료, API 키 불필요)
- **백업 데이터**: Alpha Vantage API (무료 티어: 분당 5회, 일일 500회)
- **지원 ETF**: SPY, QQQ, TLT, GLD, VTI, VEA, VWO, BND, VNQ, XLE 등 10개 주요 ETF

> 💡 **데이터 캐싱**: API 호출 제한을 방지하기 위해 ETF 데이터는 5분간 캐시됩니다

### 🔑 API 키 설정

#### Alpha Vantage API (선택사항)

1. [Alpha Vantage](https://www.alphavantage.co/support/#api-key)에서 무료 API 키 발급
2. `.env.local` 파일에 추가:
   ```
   NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY=your_api_key_here
   ```

#### FRED API (선택사항)

1. [FRED](https://fred.stlouisfed.org/docs/api/api_key.html)에서 무료 API 키 발급
2. `.env.local` 파일에 추가:
   ```
   NEXT_PUBLIC_FRED_API_KEY=your_api_key_here
   ```

> **참고**: API 키를 설정하지 않아도 Yahoo Finance API를 통해 ETF 데이터는 정상적으로 제공됩니다.

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── api/                # API 라우트
│   │   └── macro-data/     # 매크로 데이터 API
│   └── ...
├── components/             # 재사용 가능한 컴포넌트
│   ├── MacroIndicatorCard.tsx
│   ├── ETFCard.tsx
│   └── ...
├── store/                  # Zustand 상태 관리
│   └── macroStore.ts
├── types/                  # TypeScript 타입 정의
│   └── index.ts
├── utils/                  # 유틸리티 함수
│   ├── apiServices.ts      # 거시경제 데이터 API
│   ├── etfDataService.ts   # ETF 데이터 API
│   └── ...
├── hooks/                  # 커스텀 훅
│   ├── useETFData.ts       # ETF 데이터 관리 훅
│   └── ...
└── data/                   # 정적 데이터 및 목업

# 환경 변수 설정
env.example                 # API 키 설정 예시 파일
```

## 🎯 타겟 사용자

| 대상            | 니즈                                                     |
| --------------- | -------------------------------------------------------- |
| 투자 초보자     | "지금은 주식에 투자해도 될까?", "어떤 ETF가 안정적일까?" |
| ETF 위주 투자자 | 포트폴리오 리밸런싱, 매크로 연동 자산배분                |
| 경제 관심층     | 실시간 지표 확인 + ETF 추천 매칭                         |

## 📊 페이지 구성

- **홈**: 현재 거시지표 요약 + 대표 ETF 추천
- **지표 분석**: 개별 지표별 상세 설명, 추세 차트
- **ETF 추천**: 조건 선택형/자동 추천형 제공 (실시간 데이터)
- **전략 시뮬레이터**: 사용자 조합 전략 백테스트
- **마이페이지**: 저장한 전략, 알림 설정, 구독 관리

## 🔄 개발 로드맵

### 1단계 (MVP)

- [x] 거시지표 대시보드
- [x] ETF 추천 카드 (룰 기반)
- [x] 기본 UI/UX 구성
- [x] 실제 API 연동 (일부 지표)
- [x] **실시간 ETF 데이터 연동**

### 2단계

- [ ] 사용자 입력 기반 추천
- [ ] 간단한 백테스트 기능
- [ ] 상세 페이지 구성

### 3단계

- [ ] 알림 시스템
- [ ] 프리미엄 구독 구조
- [ ] 더 많은 ETF 지원

### 4단계

- [ ] 머신러닝 기반 추천
- [ ] 시나리오 대응 전략 자동화

## 💰 수익 모델

- **프리미엄 구독**: 시뮬레이터, 고급 지표, 실시간 알림
- **광고 수익**: 무료 사용자 대상 ETF 제휴 광고
- **B2B API**: 증권사/핀테크 플랫폼 대상 API 판매
- **리포트 판매**: 투자 전략 리포트 유료 제공

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 연락처

프로젝트 링크: [https://github.com/yourusername/macro-match](https://github.com/yourusername/macro-match)

---

**MicroMatch** - 거시경제 기반 ETF 추천 서비스
