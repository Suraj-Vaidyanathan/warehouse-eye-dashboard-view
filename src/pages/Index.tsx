
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VideoFeed } from "@/components/VideoFeed";
import { AnalyticsChart } from "@/components/AnalyticsChart";
import { AlertPanel } from "@/components/AlertPanel";
import { ActivityTimeline } from "@/components/ActivityTimeline";
import { KPICard } from "@/components/KPICard";
import { VehicleDetection } from "@/components/VehicleDetection";
import { LayoutDashboard, ChartLine } from "lucide-react";

const Index = () => {
  const [isSystemOnline, setIsSystemOnline] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [goodsCount, setGoodsCount] = useState(12847);
  const [vehicleCount, setVehicleCount] = useState(234);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Simulate real-time updates
      if (Math.random() > 0.8) {
        setGoodsCount(prev => prev + Math.floor(Math.random() * 5) + 1);
      }
      if (Math.random() > 0.9) {
        setVehicleCount(prev => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const kpiData = [
    {
      title: "Goods Transported",
      value: goodsCount.toLocaleString(),
      change: "+8.2%",
      trend: "up" as const,
      description: "Last 24 hours"
    },
    {
      title: "Vehicles Detected",
      value: vehicleCount.toString(),
      change: "+12.1%",
      trend: "up" as const,
      description: "Today"
    },
    {
      title: "Detection Accuracy",
      value: "98.7%",
      change: "+0.3%",
      trend: "up" as const,
      description: "Object recognition"
    },
    {
      title: "System Uptime",
      value: "99.94%",
      change: "-0.02%",
      trend: "down" as const,
      description: "Last 30 days"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="h-8 w-8 text-blue-400" />
            <h1 className="text-2xl font-bold">Warehouse Automation Hub</h1>
          </div>
          <Badge variant={isSystemOnline ? "default" : "destructive"} className="bg-green-600 hover:bg-green-700">
            {isSystemOnline ? "System Online" : "System Offline"}
          </Badge>
        </div>
        <div className="text-sm text-slate-400">
          {currentTime.toLocaleString()}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* Video Feeds */}
        <div className="xl:col-span-2 space-y-4">
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span>Live Video Feeds</span>
              </CardTitle>
              <CardDescription>Real-time monitoring with AI object detection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <VideoFeed 
                  cameraId="CAM-001" 
                  location="Receiving Bay A" 
                  detectionCount={147}
                  status="active"
                />
                <VideoFeed 
                  cameraId="CAM-002" 
                  location="Storage Zone B" 
                  detectionCount={89}
                  status="active"
                />
                <VideoFeed 
                  cameraId="CAM-003" 
                  location="Packing Station" 
                  detectionCount={203}
                  status="active"
                />
                <VideoFeed 
                  cameraId="CAM-004" 
                  location="Shipping Dock" 
                  detectionCount={76}
                  status="maintenance"
                />
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Detection Section */}
          <VehicleDetection />
        </div>

        {/* Alerts Panel */}
        <div className="space-y-4">
          <AlertPanel />
          <ActivityTimeline />
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ChartLine className="h-5 w-5 text-blue-400" />
              <span>Goods per Hour</span>
            </CardTitle>
            <CardDescription>Items transported hourly</CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsChart type="goods" />
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ChartLine className="h-5 w-5 text-green-400" />
              <span>Vehicles per Hour</span>
            </CardTitle>
            <CardDescription>Vehicle detection frequency</CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsChart type="vehicles" />
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ChartLine className="h-5 w-5 text-amber-400" />
              <span>Detection Performance</span>
            </CardTitle>
            <CardDescription>Object detection accuracy</CardDescription>
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
