
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRealtimeData } from "@/hooks/useRealtimeData";
import type { Database } from "@/integrations/supabase/types";

type Activity = Database['public']['Tables']['activities']['Row'];

export const ActivityTimeline = () => {
  const { data: activities, loading } = useRealtimeData('activities');

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "detection": return "🔍";
      case "processing": return "⚙️";
      case "alert": return "⚠️";
      case "system": return "🔧";
      default: return "📋";
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  if (loading) {
    return (
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Activity Timeline</CardTitle>
          <CardDescription className="text-slate-300">Loading activities...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Activity Timeline</CardTitle>
        <CardDescription className="text-slate-300">Recent system activities</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {activities.slice(0, 10).map((activity, index) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-sm">
                  {getActivityIcon(activity.activity_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">{activity.description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-slate-300">
                      {formatTimeAgo(activity.created_at)}
                    </span>
                    {activity.camera_id && (
                      <span className="text-xs text-blue-400">{activity.camera_id}</span>
                    )}
                    {activity.location && (
                      <span className="text-xs text-green-400">{activity.location}</span>
                    )}
                  </div>
                </div>
                {index < Math.min(activities.length - 1, 9) && (
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
