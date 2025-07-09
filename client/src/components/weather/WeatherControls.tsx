import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { useWeather } from '../../lib/stores/useWeather';
import { WeatherSimulation } from '../../lib/weather/WeatherSimulation';
import { 
  Thermometer, 
  Droplets, 
  Gauge, 
  Wind, 
  Sun, 
  Zap, 
  CloudRain,
  Eye,
  RotateCcw
} from 'lucide-react';

export function WeatherControls() {
  const weather = useWeather();
  const simulation = WeatherSimulation.getInstance();

  const handleControlChange = (key: string, value: any) => {
    // Update local state
    (weather as any)[`set${key.charAt(0).toUpperCase() + key.slice(1)}`](value);
    
    // Update simulation user controls
    simulation.setUserControls({ [key]: value });
  };

  const resetToDefaults = () => {
    // Clear user controls to allow natural simulation
    simulation.setUserControls({});
    
    // Reset local state
    weather.setTemperature(22.5);
    weather.setHumidity(65);
    weather.setPressure(1013.25);
    weather.setWindSpeed(12.5);
    weather.setWindDirection(225);
    weather.setSolarRadiation(800);
    weather.setUvIndex(6);
    weather.setPrecipitation(0);
    weather.setPrecipitationType('none');
    weather.setVisibility(10000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Temperature Controls */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Thermometer className="w-5 h-5 text-red-400" />
            Temperature
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">Air Temperature</Label>
            <Slider
              value={[weather.temperature]}
              onValueChange={([value]) => handleControlChange('temperature', value)}
              min={-40}
              max={50}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>-40°C</span>
              <span className="font-mono">{weather.temperature.toFixed(1)}°C</span>
              <span>50°C</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Humidity Controls */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Droplets className="w-5 h-5 text-blue-400" />
            Humidity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">Relative Humidity</Label>
            <Slider
              value={[weather.humidity]}
              onValueChange={([value]) => handleControlChange('humidity', value)}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span className="font-mono">{weather.humidity.toFixed(0)}%</span>
              <span>100%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pressure Controls */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Gauge className="w-5 h-5 text-green-400" />
            Atmospheric Pressure
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">Barometric Pressure</Label>
            <Slider
              value={[weather.pressure]}
              onValueChange={([value]) => handleControlChange('pressure', value)}
              min={950}
              max={1080}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>950 hPa</span>
              <span className="font-mono">{weather.pressure.toFixed(1)} hPa</span>
              <span>1080 hPa</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wind Controls */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Wind className="w-5 h-5 text-cyan-400" />
            Wind
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">Wind Speed</Label>
            <Slider
              value={[weather.windSpeed]}
              onValueChange={([value]) => handleControlChange('windSpeed', value)}
              min={0}
              max={100}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0 km/h</span>
              <span className="font-mono">{weather.windSpeed.toFixed(1)} km/h</span>
              <span>100 km/h</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm">Wind Direction</Label>
            <Slider
              value={[weather.windDirection]}
              onValueChange={([value]) => handleControlChange('windDirection', value)}
              min={0}
              max={359}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0° (N)</span>
              <span className="font-mono">{weather.windDirection.toFixed(0)}°</span>
              <span>359° (N)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Solar Radiation Controls */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sun className="w-5 h-5 text-yellow-400" />
            Solar Radiation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">Solar Radiation</Label>
            <Slider
              value={[weather.solarRadiation]}
              onValueChange={([value]) => handleControlChange('solarRadiation', value)}
              min={0}
              max={1200}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0 W/m²</span>
              <span className="font-mono">{weather.solarRadiation.toFixed(0)} W/m²</span>
              <span>1200 W/m²</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm">UV Index</Label>
            <Slider
              value={[weather.uvIndex]}
              onValueChange={([value]) => handleControlChange('uvIndex', value)}
              min={0}
              max={11}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span className="font-mono">{weather.uvIndex.toFixed(1)}</span>
              <span>11+</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Precipitation Controls */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CloudRain className="w-5 h-5 text-blue-400" />
            Precipitation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">Precipitation Type</Label>
            <Select 
              value={weather.precipitationType} 
              onValueChange={(value: 'none' | 'rain' | 'snow') => handleControlChange('precipitationType', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="rain">Rain</SelectItem>
                <SelectItem value="snow">Snow</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm">Precipitation Rate</Label>
            <Slider
              value={[weather.precipitation]}
              onValueChange={([value]) => handleControlChange('precipitation', value)}
              min={0}
              max={50}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0 mm/h</span>
              <span className="font-mono">{weather.precipitation.toFixed(1)} mm/h</span>
              <span>50 mm/h</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visibility Controls */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Eye className="w-5 h-5 text-purple-400" />
            Visibility
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">Visibility Distance</Label>
            <Slider
              value={[weather.visibility]}
              onValueChange={([value]) => handleControlChange('visibility', value)}
              min={100}
              max={50000}
              step={100}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0.1 km</span>
              <span className="font-mono">{(weather.visibility / 1000).toFixed(1)} km</span>
              <span>50 km</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Simulation Speed Controls */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Zap className="w-5 h-5 text-orange-400" />
            Simulation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">Simulation Speed</Label>
            <Slider
              value={[weather.simulationSpeed]}
              onValueChange={([value]) => weather.setSimulationSpeed(value)}
              min={0.1}
              max={5}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0.1x</span>
              <span className="font-mono">{weather.simulationSpeed.toFixed(1)}x</span>
              <span>5x</span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={resetToDefaults}
            className="w-full flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
