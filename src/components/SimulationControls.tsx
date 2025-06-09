
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const SimulationControls = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [simulationCount, setSimulationCount] = useState(0);
  const { toast } = useToast();

  const startSimulation = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    toast({
      title: "Simulation Started",
      description: "Data simulation is now running...",
    });

    // Run simulation every 5 seconds
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/functions/v1/warehouse-api/simulate-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setSimulationCount(prev => prev + 1);
        }
      } catch (error) {
        console.error('Simulation error:', error);
      }
    }, 5000);

    // Store interval ID for cleanup
    (window as any).simulationInterval = interval;
  };

  const stopSimulation = () => {
    setIsRunning(false);
    clearInterval((window as any).simulationInterval);
    toast({
      title: "Simulation Stopped",
      description: "Data simulation has been stopped.",
    });
  };

  const resetSimulation = () => {
    stopSimulation();
    setSimulationCount(0);
    toast({
      title: "Simulation Reset",
      description: "Simulation counter has been reset.",
    });
  };

  return (
    <Card className="bg-slate-900 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <span>Data Simulation</span>
          <Badge variant={isRunning ? "default" : "secondary"} className={isRunning ? "bg-green-600" : "text-black"}>
            {isRunning ? "Running" : "Stopped"}
          </Badge>
        </CardTitle>
        <CardDescription className="text-slate-300">
          Simulate real-time warehouse data for testing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">Simulation cycles:</span>
            <Badge variant="outline" className="border-slate-600 text-white">
              {simulationCount}
            </Badge>
          </div>
          
          <div className="flex space-x-2">
            {!isRunning ? (
              <Button
                onClick={startSimulation}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                <Play className="h-4 w-4 mr-1" />
                Start
              </Button>
            ) : (
              <Button
                onClick={stopSimulation}
                variant="destructive"
                className="flex-1"
                size="sm"
              >
                <Pause className="h-4 w-4 mr-1" />
                Stop
              </Button>
            )}
            
            <Button
              onClick={resetSimulation}
              variant="outline"
              className="border-slate-600 hover:bg-slate-700"
              size="sm"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-xs text-slate-400">
            Simulation adds random goods and vehicle detections every 5 seconds
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
