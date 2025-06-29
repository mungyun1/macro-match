import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PerformanceData {
  date: string;
  value: number;
}

interface PortfolioPerformanceChartProps {
  performanceData: PerformanceData[];
  initialInvestment: number;
  className?: string;
}

export default function PortfolioPerformanceChart({
  performanceData,
  initialInvestment,
  className = "",
}: PortfolioPerformanceChartProps) {
  const finalValue = performanceData[performanceData.length - 1]?.value;

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        포트폴리오 성과
      </h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getFullYear()}.${(date.getMonth() + 1)
                  .toString()
                  .padStart(2, "0")}`;
              }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              domain={["dataMin * 0.95", "dataMax * 1.05"]}
            />
            <Tooltip
              formatter={(value: number) => [
                `$${value.toLocaleString()}`,
                "포트폴리오 가치",
              ]}
              labelFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("ko-KR");
              }}
              contentStyle={{
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "#2563eb" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
        <span>시작 가치: ${initialInvestment.toLocaleString()}</span>
        <span>최종 가치: ${finalValue?.toLocaleString()}</span>
      </div>
    </div>
  );
}
