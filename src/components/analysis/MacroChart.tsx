"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartData } from "@/types";
import { formatDate } from "@/utils/formatters";

interface MacroChartProps {
  data: ChartData[];
  title: string;
  color?: string;
  unit?: string;
  height?: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

export default function MacroChart({
  data,
  title,
  color = "#3B82F6",
  unit = "%",
  height = 300,
}: MacroChartProps) {
  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length && label) {
      const value = payload[0].value;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-gray-800 font-medium">{`날짜: ${formatDate(
            label
          )}`}</p>
          <p className="text-blue-600 font-semibold">
            {`${title}: ${value.toFixed(2)}${unit}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const formatXAxisTick = (tickItem: string) => {
    return formatDate(tickItem, "MM/dd");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title} 추세</h3>

      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="date"
              tickFormatter={formatXAxisTick}
              stroke="#6B7280"
              fontSize={12}
            />
            <YAxis
              stroke="#6B7280"
              fontSize={12}
              tickFormatter={(value) => `${value}${unit}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">차트 데이터가 없습니다.</p>
        </div>
      )}

      <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
        <span>최근 30일 추세</span>
        {data.length > 0 && (
          <span>
            최신값: {data[data.length - 1]?.value.toFixed(2)}
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
