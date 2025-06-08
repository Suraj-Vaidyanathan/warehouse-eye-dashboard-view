
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Activity {
  id: string;
  type: "detection" | "processing" | "alert" | "system";
  description: string;
  timestamp: Date;
  camera?: string;
}

export const ActivityTimeline = () => {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "1",
      type: "detection",
      description: "Package detected and processed",
      timestamp: new Date(Date.now() - 2 * 60000),
      camera: "CAM-001"
    },
    {
      id: "2",
      type: "processing",
      description: "Batch processing completed - 47 items",
      timestamp: new Date(Date.now() - 5 * 60000)
    },
    {
      id: "3",
      type: "detection",
      description: "Forklift movement tracked",
      timestamp: new Date(Date.now() - 8 * 60000),
      camera: "CAM-002"
    },
    {
      id: "4",
      type: "alert",
      description: "Camera calibration alert resolved",
      timestamp: new Date(Date.now() - 12 * 60000),
      camera: "CAM-003"
    },
    {
      id: "5",
      type: "system",
      description: "System health check completed",
      timestamp: new Date(Date.now() - 15 * 60000)
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new activities
      const newActivity: Activity = {
        id: Date.now().toString(),
        type: Math.random() > 0.5 ? "detection" : "processing",
        description: Math.random() > 0.5 ? "New package detected" : "Batch processing initiated",
        timestamp: new Date(),
        camera: `CAM-00${Math.floor(Math.random() * 4) + 1}`
      };

      setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "detection": return "🔍";
      case "processing": return "⚙️";
      case "alert": return "⚠️";
      case "system": return "🔧";
      default: return "📋";
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const seconds = Math.floor((Date.now() - timestamp.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader>
        <CardTitle>Activity Timeline</CardTitle>
        <CardDescription>Recent system activities</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-sm">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200">{activity.description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-slate-400">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                    {activity.camera && (
                      <span className="text-xs text-blue-400">{activity.camera}</span>
                    )}
                  </div>
                </div>
                {index < activities.length - 1 && (
                  <div className="absolute left-4 mt-8 w-px h-6 bg-slate-700"></div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
