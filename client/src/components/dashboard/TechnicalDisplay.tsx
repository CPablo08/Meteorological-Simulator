import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Gauge } from '../ui/gauge';
import { useSensors } from '../../lib/stores/useSensors';
import { useWeather } from '../../lib/stores/useWeather';
import { SensorCalculations } from '../../lib/weather/SensorCalculations';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Gauge as GaugeIcon,
  Sun,
  CloudRain,
  Battery,
  Cpu,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

export function TechnicalDisplay() {
  const sensors = useSensors();
  const weather = useWeather();

  // Calculate derived values
  const heatIndex = SensorCalculations.calculateHeatIndex(
    sensors.airTemperature.current,
    sensors.relativeHumidity.current
  );

  const windChill = SensorCalculations.calculateWindChill(
    sensors.airTemperature.current,
    sensors.windSpeed.current
  );

  const precipitationRate = SensorCalculations.calculatePrecipitationRate(
    sensors.tippingBucket.current,
    0.2, // 0.2mm per tip
    60 // 60 minutes
  );

  return (
    <div className="space-y-6">
      {/* System Status */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Cpu className="w-5 h-5 text-purple-400" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Data Logger</span>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <CheckCircle className="w-3 h-3 mr-1" />
              Online
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Communications</span>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <CheckCircle className="w-3 h-3 mr-1" />
              Active
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Sensors</span>
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              <AlertTriangle className="w-3 h-3 mr-1" />
              18/19 OK
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Power</span>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <Battery className="w-3 h-3 mr-1" />
              {sensors.batteryLevel.current.toFixed(0)}%
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Current Conditions Summary */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Thermometer className="w-5 h-5 text-red-400" />
            Current Conditions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">
                {sensors.airTemperature.current.toFixed(1)}°C
              </div>
              <div className="text-xs text-muted-foreground">Temperature</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {sensors.relativeHumidity.current.toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground">Humidity</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">
                {sensors.atmosphericPressure.current.toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">Pressure (hPa)</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-cyan-400">
                {sensors.windSpeed.current.toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">Wind (km/h)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Derived Calculations */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <GaugeIcon className="w-5 h-5 text-orange-400" />
            Calculated Values
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Dew Point</span>
            <span className="text-sm font-mono">
              {sensors.dewPoint.current.toFixed(1)}°C
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Heat Index</span>
            <span className="text-sm font-mono">
              {heatIndex.toFixed(1)}°C
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Wind Chill</span>
            <span className="text-sm font-mono">
              {windChill.toFixed(1)}°C
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Sea Level Pressure</span>
            <span className="text-sm font-mono">
              {sensors.seaLevelPressure.current.toFixed(1)} hPa
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Absolute Humidity</span>
            <span className="text-sm font-mono">
              {sensors.absoluteHumidity.current.toFixed(1)} g/m³
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Battery & Solar */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Battery className="w-5 h-5 text-green-400" />
            Power System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <Gauge
              value={sensors.batteryLevel.current}
              min={0}
              max={100}
              label="Battery Level"
              unit="%"
              size="md"
            />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Solar Panel Output</span>
            <span className="text-sm font-mono">
              {sensors.solarPanelVoltage.current.toFixed(2)}V
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Solar Radiation</span>
            <span className="text-sm font-mono">
              {sensors.solarRadiation.current.toFixed(0)} W/m²
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">UV Index</span>
            <span className="text-sm font-mono">
              {sensors.uvIndex.current.toFixed(1)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Precipitation Details */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CloudRain className="w-5 h-5 text-blue-400" />
            Precipitation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Current Rate</span>
            <span className="text-sm font-mono">
              {sensors.precipitationRate.current.toFixed(1)} mm/h
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Accumulated</span>
            <span className="text-sm font-mono">
              {sensors.rainGauge.current.toFixed(1)} mm
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Bucket Tips</span>
            <span className="text-sm font-mono">
              {sensors.tippingBucket.current.toFixed(0)} tips
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Type</span>
            <Badge variant="outline" className="text-xs">
              {weather.precipitationType.toUpperCase()}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
