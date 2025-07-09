import React from 'react';
import { WeatherControls } from '../components/weather/WeatherControls';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Settings, Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useWeather } from '../lib/stores/useWeather';
import { WeatherSimulation } from '../lib/weather/WeatherSimulation';

export function ControlPage() {
  const { isSimulating, simulationSpeed, startSimulation, stopSimulation } = useWeather();
  const simulation = WeatherSimulation.getInstance();

  const handleStartSimulation = () => {
    startSimulation();
    simulation.start(simulationSpeed);
  };

  const handleStopSimulation = () => {
    stopSimulation();
    simulation.stop();
  };

  const handleResetSimulation = () => {
    simulation.stop();
    stopSimulation();
    // Reset to default values would go here
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Simulation Controls</h1>
              <p className="text-muted-foreground">
                Configure weather parameters and simulation settings
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={isSimulating ? "destructive" : "default"}
              onClick={isSimulating ? handleStopSimulation : handleStartSimulation}
              className="flex items-center gap-2"
            >
              {isSimulating ? (
                <>
                  <Pause className="w-4 h-4" />
                  Stop Simulation
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Start Simulation
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleResetSimulation}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </div>

        {/* Status Card */}
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                isSimulating ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
              }`} />
              Simulation Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-lg font-semibold">
                  {isSimulating ? 'Running' : 'Stopped'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Speed</p>
                <p className="text-lg font-semibold">{simulationSpeed}x</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Uptime</p>
                <p className="text-lg font-semibold">
                  {isSimulating ? '00:00:00' : '--:--:--'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weather Controls */}
        <WeatherControls />
      </div>
    </div>
  );
}
