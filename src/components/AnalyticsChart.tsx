
import { AnalyticsChart as OriginalAnalyticsChart } from "./AnalyticsChart";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";

interface AnalyticsChartProps {
  type: "throughput" | "accuracy" | "vehicles" | "goods";
}

export const AnalyticsChart = ({ type }: AnalyticsChartProps) => {
  const { data, loading } = useAnalyticsData(type);

  if (loading) {
    return (
      <div className="h-64 w-full flex items-center justify-center">
        <div className="text-slate-400">Loading analytics data...</div>
      </div>
    );
  }

  const isBarChart = type === "throughput" || type === "goods" || type === "vehicles";
  const color = type === "vehicles" ? "#10B981" : type === "goods" ? "#3B82F6" : "#F59E0B";

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        {isBarChart ? (
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="hour" 
              stroke="#9CA3AF"
              fontSize={12}
              interval={3}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
              domain={[0, 'dataMax']}
            />
            <Bar
              dataKey="value"
              fill={color}
            />
          </BarChart>
        ) : (
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="hour" 
              stroke="#9CA3AF"
              fontSize={12}
              interval={3}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
              domain={type === "accuracy" ? [95, 100] : [0, 'dataMax']}
            />
            <Line
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, strokeWidth: 0, r: 3 }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};
