import { notFound } from "next/navigation";
import { fetchRecommendedETFs } from "@/utils/etfDataService";
import ETFDetailClient from "./ETFDetailClient";

interface ETFDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ETFDetailPage({ params }: ETFDetailPageProps) {
  try {
    // params를 await하여 Next.js 15 요구사항 준수
    const resolvedParams = await params;

    // 서버에서 ETF 데이터 가져오기
    const allETFs = await fetchRecommendedETFs();

    // ID로 ETF 찾기
    const etfId = Array.isArray(resolvedParams.id)
      ? resolvedParams.id[0]
      : resolvedParams.id;
    const etf = allETFs.find((e) => e.id === etfId);

    if (!etf) {
      notFound();
    }

    return <ETFDetailClient etf={etf} />;
  } catch {
    notFound();
  }
}
