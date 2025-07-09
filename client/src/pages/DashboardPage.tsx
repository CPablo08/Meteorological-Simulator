import React, { useEffect } from 'react';
import { SensorGrid } from '../components/dashboard/SensorGrid';
import { DataCharts } from '../components/dashboard/DataCharts';
import { TechnicalDisplay } from '../components/dashboard/TechnicalDisplay';
import { NormalParameters } from '../components/dashboard/NormalParameters';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { BarChart3, Activity, Database, AlertTriangle } from 'lucide-react';
import { useWeather } from '../lib/stores/useWeather';
import { useSensors } from '../lib/stores/useSensors';
import { WeatherSimulation } from '../lib/weather/WeatherSimulation';
import { SensorCalculations } from '../lib/weather/SensorCalculations';

export function DashboardPage() {
  const weather = useWeather();
  const sensors = useSensors();

  useEffect(() => {
    const simulation = WeatherSimulation.getInstance();

    const unsubscribe = simulation.subscribe((weatherUpdate) => {
      weather.updateWeather(weatherUpdate);

      // Update sensor readings based on weather
      const sensorReadings = SensorCalculations.generateSensorReadings({
        ...weather,
        ...weatherUpdate
      });

      // Update all sensors
      Object.entries(sensorReadings).forEach(([sensorName, value]) => {
        if (typeof value === 'number') {
          sensors.updateSensorData(sensorName as any, value);
        }
      });
    });

    return unsubscribe;
  }, [weather, sensors]);

  const totalSensors = 19;
  const activeSensors = 19;
  const warningCount = 1;
  const errorCount = 0;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Sensor Dashboard</h1>
              <p className="text-muted-foreground">
                Real-time meteorological data and system diagnostics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{activeSensors}</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{warningCount}</div>
              <div className="text-xs text-muted-foreground">Warnings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{errorCount}</div>
              <div className="text-xs text-muted-foreground">Errors</div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="bg-card/50 border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Database className="w-4 h-4" />
                Data Collection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">100%</div>
              <div className="text-xs text-muted-foreground">Success Rate</div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="w-4 h-4" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">95%</div>
              <div className="text-xs text-muted-foreground">Operational</div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">{warningCount}</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Database className="w-4 h-4" />
                Data Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">1,247</div>
              <div className="text-xs text-muted-foreground">Last 24h</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <SensorGrid />
          <NormalParameters />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Technical Display - Takes up 1 column */}
            <TechnicalDisplay />
          </div>
        </div>

        {/* Data Charts - Full width */}
        <DataCharts />
      </div>
    </div>
  );
}