
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Alert {
  id: string;
  type: "warning" | "error" | "info";
  title: string;
  description: string;
  timestamp: Date;
  camera?: string;
}

export const AlertPanel = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      type: "warning",
      title: "Low Detection Accuracy",
      description: "CAM-003 accuracy dropped to 94.2%",
      timestamp: new Date(Date.now() - 5 * 60000),
      camera: "CAM-003"
    },
    {
      id: "2",
      type: "error",
      title: "Camera Offline",
      description: "CAM-004 connection lost",
      timestamp: new Date(Date.now() - 15 * 60000),
      camera: "CAM-004"
    },
    {
      id: "3",
      type: "info",
      title: "Scheduled Maintenance",
      description: "System backup initiated",
      timestamp: new Date(Date.now() - 30 * 60000)
    }
  ]);

  const getAlertBadge = (type: string) => {
    switch (type) {
      case "error": return <Badge variant="destructive">Error</Badge>;
      case "warning": return <Badge className="bg-amber-600 hover:bg-amber-700">Warning</Badge>;
      case "info": return <Badge variant="secondary">Info</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const minutes = Math.floor((Date.now() - timestamp.getTime()) / 60000);
    if (minutes < 1) return "Just now";
    if (minutes === 1) return "1 minute ago";
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  };

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>System Alerts</span>
          <Badge variant="outline" className="border-slate-600">
            {alerts.length}
          </Badge>
        </CardTitle>
        <CardDescription>Recent system notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <div className="text-center text-slate-400 py-8">
                No active alerts
              </div>
            ) : (
              alerts.map((alert) => (
                <div key={alert.id} className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                  <div className="flex items-start justify-between mb-2">
                    {getAlertBadge(alert.type)}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-slate-700"
                      onClick={() => dismissAlert(alert.id)}
                    >
                      ×
                    </Button>
                  </div>
                  <h4 className="text-sm font-medium text-slate-100 mb-1">
                    {alert.title}
                  </h4>
                  <p className="text-xs text-slate-400 mb-2">
                    {alert.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{formatTimeAgo(alert.timestamp)}</span>
                    {alert.camera && (
                      <span className="text-blue-400">{alert.camera}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
