
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  description: string;
}

export const KPICard = ({ title, value, change, trend, description }: KPICardProps) => {
  const TrendIcon = trend === "up" ? ArrowUp : ArrowDown;
  const trendColor = trend === "up" ? "text-green-400" : "text-red-400";

  return (
    <Card className="bg-slate-900 border-slate-700 hover:bg-slate-800 transition-colors duration-200">
      <CardHeader className="pb-2">
        <CardDescription className="text-slate-400">{title}</CardDescription>
        <CardTitle className="text-2xl font-bold text-slate-100">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">{description}</span>
          <div className={`flex items-center space-x-1 ${trendColor}`}>
            <TrendIcon className="h-4 w-4" />
            <span className="text-sm font-medium">{change}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
