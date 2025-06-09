
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VideoFeed } from "@/components/VideoFeed";
import { AnalyticsChart } from "@/components/AnalyticsChart";
import { AlertPanel } from "@/components/AlertPanel";
import { ActivityTimeline } from "@/components/ActivityTimeline";
import { KPICard } from "@/components/KPICard";
import { VehicleDetection } from "@/components/VehicleDetection";
import { SimulationControls } from "@/components/SimulationControls";
import { LayoutDashboard, ChartLine } from "lucide-react";
import { useKPIData } from "@/hooks/useKPIData";
import { useRealtimeData } from "@/hooks/useRealtimeData";

interface Camera {
  id: string;
  location: string;
  status: string;
  detection_count: number;
}

const Index = () => {
  const [isSystemOnline, setIsSystemOnline] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { kpiData, loading: kpiLoading } = useKPIData();
  const { data: cameras, loading: camerasLoading } = useRealtimeData('cameras');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const kpiCards = [
    {
      title: "Goods Transported",
      value: kpiLoading ? "Loading..." : kpiData.goods_transported.toLocaleString(),
      change: "+8.2%",
      trend: "up" as const,
      description: "Last 24 hours"
    },
    {
      title: "Vehicles Detected",
      value: kpiLoading ? "Loading..." : kpiData.vehicles_detected.toString(),
      change: "+12.1%",
      trend: "up" as const,
      description: "Today"
    },
    {
      title: "Detection Accuracy",
      value: kpiLoading ? "Loading..." : `${kpiData.detection_accuracy.toFixed(1)}%`,
      change: "+0.3%",
      trend: "up" as const,
      description: "Object recognition"
    },
    {
      title: "System Uptime",
      value: kpiLoading ? "Loading..." : `${kpiData.system_uptime.toFixed(2)}%`,
      change: "-0.02%",
      trend: "down" as const,
      description: "Last 30 days"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="h-8 w-8 text-blue-400" />
            <h1 className="text-2xl font-bold text-white">Warehouse Automation Hub</h1>
          </div>
          <Badge variant={isSystemOnline ? "default" : "destructive"} className="bg-green-600 hover:bg-green-700 text-white">
            {isSystemOnline ? "System Online" : "System Offline"}
          </Badge>
        </div>
        <div className="text-sm text-slate-300">
          {currentTime.toLocaleString()}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpiCards.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* Video Feeds */}
        <div className="xl:col-span-2 space-y-4">
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-white">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span>Live Video Feeds</span>
              </CardTitle>
              <CardDescription className="text-slate-300">Real-time monitoring with AI object detection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {camerasLoading ? (
                  <div className="col-span-2 text-center text-slate-300 py-8">
                    Loading camera feeds...
                  </div>
                ) : cameras.length > 0 ? (
                  cameras.map((camera) => (
                    <VideoFeed 
                      key={camera.id}
                      cameraId={camera.id}
                      location={camera.location}
                      detectionCount={camera.detection_count}
                      status={camera.status as "active" | "maintenance" | "offline"}
                    />
                  ))
                ) : (
                  <div className="col-span-2 text-center text-slate-300 py-8">
                    No cameras available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Detection Section */}
          <VehicleDetection />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          <SimulationControls />
          <AlertPanel />
          <ActivityTimeline />
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <ChartLine className="h-5 w-5 text-blue-400" />
              <span>Goods per Hour</span>
            </CardTitle>
            <CardDescription className="text-slate-300">Items transported hourly</CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsChart type="goods" />
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <ChartLine className="h-5 w-5 text-green-400" />
              <span>Vehicles per Hour</span>
            </CardTitle>
            <CardDescription className="text-slate-300">Vehicle detection frequency</CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsChart type="vehicles" />
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <ChartLine className="h-5 w-5 text-amber-400" />
              <span>Detection Performance</span>
            </CardTitle>
            <CardDescription className="text-slate-300">Object detection accuracy</CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsChart type="accuracy" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
