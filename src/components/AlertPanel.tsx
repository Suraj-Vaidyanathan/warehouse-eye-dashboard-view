
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRealtimeData } from "@/hooks/useRealtimeData";
import { dataService } from "@/services/dataService";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type Alert = Database['public']['Tables']['alerts']['Row'];

export const AlertPanel = () => {
  const { data: alerts, loading } = useRealtimeData('alerts');
  const { toast } = useToast();

  // Filter only active alerts
  const activeAlerts = alerts.filter(alert => alert.status === 'active');

  const getAlertBadge = (type: string) => {
    switch (type) {
      case "error": return <Badge variant="destructive">Error</Badge>;
      case "warning": return <Badge className="bg-amber-600 hover:bg-amber-700 text-white">Warning</Badge>;
      case "info": return <Badge variant="secondary" className="text-white">Info</Badge>;
      default: return <Badge variant="secondary" className="text-white">Unknown</Badge>;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const minutes = Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000);
    if (minutes < 1) return "Just now";
    if (minutes === 1) return "1 minute ago";
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  };

  const dismissAlert = async (id: string) => {
    try {
      await dataService.dismissAlert(id);
      toast({
        title: "Alert dismissed",
        description: "The alert has been successfully dismissed.",
      });
    } catch (error) {
      console.error('Error dismissing alert:', error);
      toast({
        title: "Error",
        description: "Failed to dismiss alert. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">System Alerts</CardTitle>
          <CardDescription className="text-slate-300">Loading alerts...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <span>System Alerts</span>
          <Badge variant="outline" className="border-slate-600 text-white">
            {activeAlerts.length}
          </Badge>
        </CardTitle>
        <CardDescription className="text-slate-300">Recent system notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {activeAlerts.length === 0 ? (
              <div className="text-center text-slate-300 py-8">
                No active alerts
              </div>
            ) : (
              activeAlerts.map((alert) => (
                <div key={alert.id} className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                  <div className="flex items-start justify-between mb-2">
                    {getAlertBadge(alert.alert_type)}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-slate-700 text-white"
                      onClick={() => dismissAlert(alert.id)}
                    >
                      ×
                    </Button>
                  </div>
                  <h4 className="text-sm font-medium text-white mb-1">
                    {alert.title}
                  </h4>
                  <p className="text-xs text-slate-300 mb-2">
                    {alert.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{formatTimeAgo(alert.created_at)}</span>
                    {alert.camera_id && (
                      <span className="text-blue-400">{alert.camera_id}</span>
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
