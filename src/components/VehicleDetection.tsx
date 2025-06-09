
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRealtimeData } from "@/hooks/useRealtimeData";
import { dataService } from "@/services/dataService";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type DetectedVehicle = Database['public']['Tables']['vehicles']['Row'];

export const VehicleDetection = () => {
  const { data: detectedVehicles, loading } = useRealtimeData('vehicles');
  const { toast } = useToast();

  // Filter only active/recent vehicles
  const recentVehicles = detectedVehicles
    .filter(vehicle => vehicle.status === 'active')
    .slice(0, 10);

  const getVehicleTypeColor = (type: string) => {
    switch (type) {
      case "truck": return "bg-blue-600";
      case "van": return "bg-green-600";
      case "car": return "bg-purple-600";
      case "forklift": return "bg-orange-600";
      default: return "bg-gray-600";
    }
  };

  const handleExportData = async () => {
    try {
      const csvData = detectedVehicles.map(vehicle => ({
        license_plate: vehicle.license_plate,
        vehicle_type: vehicle.vehicle_type,
        location: vehicle.location,
        detected_at: vehicle.detected_at,
        confidence_score: vehicle.confidence_score
      }));

      const csvContent = [
        ['License Plate', 'Vehicle Type', 'Location', 'Detected At', 'Confidence Score'],
        ...csvData.map(row => Object.values(row))
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `vehicle_data_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Data exported",
        description: "Vehicle data has been exported to CSV file.",
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Export failed",
        description: "Failed to export vehicle data. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Vehicle Detection & License Plates</CardTitle>
          <CardDescription className="text-slate-300">Loading vehicle data...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <span>Vehicle Detection & License Plates</span>
          <Badge className="bg-green-600 hover:bg-green-700 text-white">
            {recentVehicles.length} Recent
          </Badge>
        </CardTitle>
        <CardDescription className="text-slate-300">Real-time license plate recognition and vehicle tracking</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {recentVehicles.map((vehicle) => (
            <div key={vehicle.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700">
              <div className="flex items-center space-x-3">
                <Badge className={`${getVehicleTypeColor(vehicle.vehicle_type)} text-white`}>
                  {vehicle.vehicle_type.toUpperCase()}
                </Badge>
                <div>
                  <div className="font-mono text-lg font-bold text-white">
                    {vehicle.license_plate}
                  </div>
                  <div className="text-xs text-slate-300">
                    {vehicle.location} • {new Date(vehicle.detected_at).toLocaleTimeString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-green-400">
                  {vehicle.confidence_score?.toFixed(1)}%
                </div>
                <div className="text-xs text-slate-400">Confidence</div>
              </div>
            </div>
          ))}
          
          {recentVehicles.length === 0 && (
            <div className="text-center text-slate-300 py-8">
              No recent vehicle detections
            </div>
          )}
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <Button variant="outline" size="sm" className="border-slate-600 hover:bg-slate-700 text-white">
            View All Records ({detectedVehicles.length})
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-slate-600 hover:bg-slate-700 text-white"
            onClick={handleExportData}
          >
            Export Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
