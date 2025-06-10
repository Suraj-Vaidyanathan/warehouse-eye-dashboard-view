
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const SimulationControls = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [simulationCount, setSimulationCount] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
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
        console.log('Running simulation cycle...');
        
        const { data, error } = await supabase.functions.invoke('warehouse-api/simulate-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (error) {
          console.error('Simulation error:', error);
          toast({
            title: "Simulation Error",
            description: `Error: ${error.message}`,
            variant: "destructive",
          });
        } else {
          console.log('Simulation successful:', data);
          setSimulationCount(prev => prev + 1);
        }
      } catch (error) {
        console.error('Simulation error:', error);
        toast({
          title: "Simulation Error",
          description: "Failed to run simulation cycle",
          variant: "destructive",
        });
      }
    }, 5000);

    setIntervalId(interval);
  };

  const stopSimulation = () => {
    setIsRunning(false);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    toast({
      title: "Simulation Stopped",
      description: "Data simulation has been stopped.",
    });
  };

  const resetSimulation = async () => {
    // Stop simulation first
    stopSimulation();
    
    try {
      // Reset database by clearing all tables
      const { error: vehiclesError } = await supabase.from('vehicles').delete().gt('id', '00000000-0000-0000-0000-000000000000');
      const { error: goodsError } = await supabase.from('goods').delete().gt('id', '00000000-0000-0000-0000-000000000000');
      const { error: activitiesError } = await supabase.from('activities').delete().gt('id', '00000000-0000-0000-0000-000000000000');
      const { error: alertsError } = await supabase.from('alerts').delete().gt('id', '00000000-0000-0000-0000-000000000000');
      
      if (vehiclesError || goodsError || activitiesError || alertsError) {
        console.error('Reset errors:', { vehiclesError, goodsError, activitiesError, alertsError });
        throw new Error('Failed to reset some tables');
      }
      
      // Reset simulation counter
      setSimulationCount(0);
      
      // Force refresh of all real-time subscriptions by triggering a window event
      window.dispatchEvent(new CustomEvent('simulation-reset'));
      
      toast({
        title: "Simulation Reset",
        description: "All simulation data has been cleared from the database.",
      });
    } catch (error) {
      console.error('Reset error:', error);
      toast({
        title: "Reset Error",
        description: "Failed to reset simulation data.",
        variant: "destructive",
      });
    }
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
            Simulation adds random goods and vehicles every 5 seconds
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
