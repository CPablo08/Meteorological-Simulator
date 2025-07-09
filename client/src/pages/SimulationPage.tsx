import React, { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Stats } from '@react-three/drei';
import { MeteorologicalStation } from '../components/weather/MeteorologicalStation';
import { WeatherEffects } from '../components/weather/WeatherEffects';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Cloud, Eye, Thermometer, Wind } from 'lucide-react';
import { useWeather } from '../lib/stores/useWeather';
import { WeatherSimulation } from '../lib/weather/WeatherSimulation';

export function SimulationPage() {
  const weather = useWeather();
  const simulationRef = useRef<WeatherSimulation>();

  useEffect(() => {
    simulationRef.current = WeatherSimulation.getInstance();
    
    const unsubscribe = simulationRef.current.subscribe((weatherUpdate) => {
      weather.updateWeather(weatherUpdate);
    });

    return unsubscribe;
  }, [weather]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Cloud className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">3D Weather Simulation</h1>
              <p className="text-muted-foreground">
                Interactive meteorological station environment
              </p>
            </div>
          </div>
          
          {/* Quick stats */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-primary" />
              <span className="text-lg font-semibold">
                {weather.temperature.toFixed(1)}°C
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="w-5 h-5 text-primary" />
              <span className="text-lg font-semibold">
                {weather.windSpeed.toFixed(1)} km/h
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              <span className="text-lg font-semibold">
                {(weather.visibility / 1000).toFixed(1)} km
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Scene */}
      <div className="flex h-[calc(100vh-120px)]">
        {/* Main 3D View */}
        <div className="flex-1 relative">
          <Canvas
            camera={{ position: [10, 8, 10], fov: 60 }}
            shadows
            gl={{ antialias: true }}
          >
            <color attach="background" args={['#0a0a0a']} />
            
            {/* Lighting */}
            <ambientLight intensity={0.3} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={1}
              castShadow
              shadow-mapSize={[1024, 1024]}
            />
            
            {/* Ground Grid */}
            <Grid
              position={[0, -0.01, 0]}
              args={[50, 50]}
              cellSize={0.05}
              cellThickness={0.2}
              cellColor="#666"
              sectionSize={10}
              sectionThickness={0.4}
              sectionColor="#999"
            />
            
            {/* Ground Plane */}
            <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[100, 100]} />
              <meshStandardMaterial color="#1a1a1a" />
            </mesh>
            
            {/* Weather Station */}
            <MeteorologicalStation />
            
            {/* Weather Effects */}
            <WeatherEffects />
            
            {/* Camera Controls */}
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={5}
              maxDistance={50}
              maxPolarAngle={Math.PI / 2}
            />
            
            {/* Performance Stats */}
            <Stats />
          </Canvas>
          
          {/* Simulation Controls Overlay */}
          <div className="absolute top-4 left-4 space-y-2">
            <Card className="bg-card/80 backdrop-blur-sm border-border w-64">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Camera Controls</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-1">
                <p>• Left click + drag: Rotate view</p>
                <p>• Right click + drag: Pan view</p>
                <p>• Scroll wheel: Zoom in/out</p>
                <p>• Double click: Reset view</p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Side Panel */}
        <div className="w-80 bg-card/30 border-l border-border p-4 space-y-4 overflow-y-auto">
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle className="text-sm">Current Conditions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Temperature</span>
                <span className="text-sm font-mono">{weather.temperature.toFixed(1)}°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Humidity</span>
                <span className="text-sm font-mono">{weather.humidity.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Pressure</span>
                <span className="text-sm font-mono">{weather.pressure.toFixed(1)} hPa</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Wind Speed</span>
                <span className="text-sm font-mono">{weather.windSpeed.toFixed(1)} km/h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Wind Direction</span>
                <span className="text-sm font-mono">{weather.windDirection.toFixed(0)}°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Solar Radiation</span>
                <span className="text-sm font-mono">{weather.solarRadiation.toFixed(0)} W/m²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">UV Index</span>
                <span className="text-sm font-mono">{weather.uvIndex.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Precipitation</span>
                <span className="text-sm font-mono">{weather.precipitation.toFixed(1)} mm/h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Visibility</span>
                <span className="text-sm font-mono">{(weather.visibility / 1000).toFixed(1)} km</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle className="text-sm">Station Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm">All sensors operational</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm">Data transmission active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <span className="text-sm">Battery at 85%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
