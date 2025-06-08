
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";

interface AnalyticsChartProps {
  type: "throughput" | "accuracy" | "vehicles" | "goods";
}

export const AnalyticsChart = ({ type }: AnalyticsChartProps) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Generate sample data based on chart type
    const generateData = () => {
      const hours = Array.from({ length: 24 }, (_, i) => i);
      
      if (type === "throughput" || type === "goods") {
        return hours.map(hour => ({
          hour: `${hour.toString().padStart(2, '0')}:00`,
          value: Math.floor(Math.random() * 200) + 300 + (hour > 8 && hour < 18 ? 200 : 0)
        }));
      } else if (type === "vehicles") {
        return hours.map(hour => ({
          hour: `${hour.toString().padStart(2, '0')}:00`,
          value: Math.floor(Math.random() * 50) + 20 + (hour > 8 && hour < 18 ? 30 : 0)
        }));
      } else {
        return hours.map(hour => ({
          hour: `${hour.toString().padStart(2, '0')}:00`,
          value: 95 + Math.random() * 4 // Accuracy between 95-99%
        }));
      }
    };

    setData(generateData());

    // Update data every 30 seconds
    const interval = setInterval(() => {
      setData(generateData());
    }, 30000);

    return () => clearInterval(interval);
  }, [type]);

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
