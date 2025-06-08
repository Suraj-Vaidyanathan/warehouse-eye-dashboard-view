
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DetectedVehicle {
  id: string;
  licensePlate: string;
  timestamp: Date;
  location: string;
  confidence: number;
  vehicleType: "truck" | "van" | "car" | "forklift";
}

export const VehicleDetection = () => {
  const [detectedVehicles, setDetectedVehicles] = useState<DetectedVehicle[]>([
    {
      id: "1",
      licensePlate: "ABC-123",
      timestamp: new Date(Date.now() - 300000),
      location: "Gate A",
      confidence: 98.5,
      vehicleType: "truck"
    },
    {
      id: "2",
      licensePlate: "XYZ-789",
      timestamp: new Date(Date.now() - 150000),
      location: "Loading Dock 2",
      confidence: 95.2,
      vehicleType: "van"
    }
  ]);

  useEffect(() => {
    // Simulate real-time vehicle detection
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const licensePlates = ["DEF-456", "GHI-789", "JKL-012", "MNO-345", "PQR-678"];
        const locations = ["Gate A", "Gate B", "Loading Dock 1", "Loading Dock 2", "Parking Area"];
        const vehicleTypes: ("truck" | "van" | "car" | "forklift")[] = ["truck", "van", "car", "forklift"];
        
        const newVehicle: DetectedVehicle = {
          id: Math.random().toString(36).substr(2, 9),
          licensePlate: licensePlates[Math.floor(Math.random() * licensePlates.length)],
          timestamp: new Date(),
          location: locations[Math.floor(Math.random() * locations.length)],
          confidence: 90 + Math.random() * 10,
          vehicleType: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)]
        };

        setDetectedVehicles(prev => [newVehicle, ...prev.slice(0, 9)]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getVehicleTypeColor = (type: string) => {
    switch (type) {
      case "truck": return "bg-blue-600";
      case "van": return "bg-green-600";
      case "car": return "bg-purple-600";
      case "forklift": return "bg-orange-600";
      default: return "bg-gray-600";
    }
  };

  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Vehicle Detection & License Plates</span>
          <Badge className="bg-green-600 hover:bg-green-700">
            {detectedVehicles.length} Recent
          </Badge>
        </CardTitle>
        <CardDescription>Real-time license plate recognition and vehicle tracking</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {detectedVehicles.map((vehicle) => (
            <div key={vehicle.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700">
              <div className="flex items-center space-x-3">
                <Badge className={`${getVehicleTypeColor(vehicle.vehicleType)} text-white`}>
                  {vehicle.vehicleType.toUpperCase()}
                </Badge>
                <div>
                  <div className="font-mono text-lg font-bold text-slate-100">
                    {vehicle.licensePlate}
                  </div>
                  <div className="text-xs text-slate-400">
                    {vehicle.location} • {vehicle.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-green-400">
                  {vehicle.confidence.toFixed(1)}%
                </div>
                <div className="text-xs text-slate-500">Confidence</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <Button variant="outline" size="sm" className="border-slate-600 hover:bg-slate-700">
            View All Records
          </Button>
          <Button variant="outline" size="sm" className="border-slate-600 hover:bg-slate-700">
            Export Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
