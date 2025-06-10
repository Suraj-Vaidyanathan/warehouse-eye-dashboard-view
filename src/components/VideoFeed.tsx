
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface VideoFeedProps {
  cameraId: string;
  location: string;
  detectionCount: number;
  status: "active" | "maintenance" | "offline";
}

export const VideoFeed = ({ cameraId, location, detectionCount, status }: VideoFeedProps) => {
  const [currentDetections, setCurrentDetections] = useState(detectionCount);
  const [lastDetection, setLastDetection] = useState("Package");
  const [showLicensePlate, setShowLicensePlate] = useState(false);
  const [currentPlate, setCurrentPlate] = useState("ABC-123");

  useEffect(() => {
    if (status === "active") {
      const interval = setInterval(() => {
        // Simulate real-time detection updates
        const random = Math.random();
        if (random > 0.7) {
          setCurrentDetections(prev => prev + 1);
          const detectionTypes = ["Package", "Pallet", "Person", "Forklift", "Vehicle"];
          const newDetection = detectionTypes[Math.floor(Math.random() * detectionTypes.length)];
          setLastDetection(newDetection);
          
          // Show license plate for vehicle detections
          if (newDetection === "Vehicle" && Math.random() > 0.5) {
            const plates = ["ABC-123", "XYZ-789", "DEF-456", "GHI-012"];
            setCurrentPlate(plates[Math.floor(Math.random() * plates.length)]);
            setShowLicensePlate(true);
            setTimeout(() => setShowLicensePlate(false), 3000);
          }
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [status]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-600";
      case "maintenance": return "bg-amber-600";
      case "offline": return "bg-red-600";
      default: return "bg-gray-600";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return <Badge className="bg-green-600 hover:bg-green-700">Online</Badge>;
      case "maintenance": return <Badge className="bg-amber-600 hover:bg-amber-700">Maintenance</Badge>;
      case "offline": return <Badge variant="destructive">Offline</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-600 overflow-hidden">
      <CardContent className="p-0">
        {/* Video Feed Simulation */}
        <div className="relative aspect-video bg-gradient-to-br from-slate-700 to-slate-800">
          {/* Simulated video background */}
          <div className="absolute inset-0 bg-slate-700 opacity-90">
            <video src="./Sample_Video.mov" autoPlay loop muted className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20 animate-pulse"></div>
            
            {/* Simulated detection boxes */}
            {status === "active" && (
              <>
                <div className="absolute top-8 left-8 w-16 h-12 border-2 border-green-400 animate-pulse">
                  <div className="absolute -top-6 left-0 text-xs text-green-400 bg-black/50 px-1 rounded">
                    {lastDetection}
                  </div>
                </div>
                <div className="absolute bottom-12 right-12 w-20 h-16 border-2 border-blue-400 animate-pulse">
                  <div className="absolute -top-6 left-0 text-xs text-blue-400 bg-black/50 px-1 rounded">
                    Robot
                  </div>
                </div>
                
                {/* License Plate Detection */}
                {showLicensePlate && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-32 h-8 border-2 border-yellow-400 animate-pulse">
                      <div className="absolute -top-8 left-0 text-sm font-mono text-yellow-400 bg-black/80 px-2 py-1 rounded">
                        {currentPlate}
                      </div>
                      <div className="absolute -bottom-6 left-0 text-xs text-yellow-400 bg-black/50 px-1 rounded">
                        License Plate
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Camera Info Overlay */}
          <div className="absolute top-3 left-3 flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(status)} animate-pulse`}></div>
            <span className="text-xs font-medium text-slate-200">{cameraId}</span>
          </div>

          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            {getStatusBadge(status)}
          </div>

          {/* Detection Counter */}
          <div className="absolute bottom-3 left-3 bg-black/70 rounded px-2 py-1">
            <span className="text-xs text-slate-200">
              Detections: <span className="text-blue-400 font-semibold">{currentDetections}</span>
            </span>
          </div>

          {/* Goods Counter */}
          <div className="absolute bottom-3 right-3 bg-black/70 rounded px-2 py-1">
            <span className="text-xs text-slate-200">
              Goods: <span className="text-green-400 font-semibold">{Math.floor(currentDetections * 0.7)}</span>
            </span>
          </div>
        </div>

        {/* Location Info */}
        <div className="p-3 bg-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-200">{location}</span>
            <Button variant="outline" size="sm" className="h-6 text-xs border-slate-600 hover:bg-slate-700">
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
