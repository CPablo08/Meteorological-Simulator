import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { TechnicalCard } from '../components/ui/technical-card';
import { Button } from '../components/ui/button';
import { Radio, RefreshCw, Wifi, WifiOff, Thermometer, Droplets, Wind, Gauge, Sun, Cloud, Eye, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface WeatherStationData {
  timestamp: string;
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  solarRadiation: number;
  uvIndex: number;
  precipitation: number;
  visibility: number;
  status: 'online' | 'offline' | 'error';
  batteryLevel: number;
  signalStrength: number;
}

// Fetch weather station data from the backend API
const fetchWeatherStationData = async (): Promise<WeatherStationData> => {
  const response = await fetch('/api/weather-station');
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  return data;
};

export function RealtimePage() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  const { data: stationData, isLoading, isError, refetch } = useQuery({
    queryKey: ['weatherStation'],
    queryFn: fetchWeatherStationData,
    refetchInterval: autoRefresh ? 10000 : false, // Refresh every 10 seconds
    retry: 3
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'error': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <Wifi className="w-4 h-4" />;
      case 'offline': return <WifiOff className="w-4 h-4" />;
      default: return <Radio className="w-4 h-4" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin" />
              <span>Connecting to weather station...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Card className="bg-card/50 border-red-500">
              <CardContent className="p-6 text-center">
                <WifiOff className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Connection Error</h3>
                <p className="text-muted-foreground mb-4">
                  Unable to connect to the weather station. Please check your API credentials.
                </p>
                <Button onClick={() => refetch()} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry Connection
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Check if we have an authentication error in the data
  if (stationData?.status === 'error') {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Card className="bg-card/50 border-yellow-500">
              <CardContent className="p-6 text-center">
                <WifiOff className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">API Authentication Failed</h3>
                <p className="text-muted-foreground mb-4">
                  {stationData.message || 'Please verify your WeatherLink v2 API credentials'}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Go to <a href="https://www.weatherlink.com/account" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">WeatherLink Account</a> to generate new credentials
                </p>
                <Button onClick={() => refetch()} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry Connection
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Radio className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Real-time Weather Station</h1>
              <p className="text-muted-foreground">
                Live data from your meteorological station
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge 
              variant={stationData?.status === 'online' ? 'default' : 'destructive'}
              className="flex items-center gap-1"
            >
              {getStatusIcon(stationData?.status || 'offline')}
              {stationData?.status?.toUpperCase() || 'OFFLINE'}
            </Badge>
            
            <Button
              variant="outline"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="flex items-center gap-2"
            >
              <Radio className={`w-4 h-4 ${autoRefresh ? 'animate-pulse' : ''}`} />
              {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Now
            </Button>
          </div>
        </div>

        {/* Station Status */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="bg-card/50 border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(stationData?.status || 'offline')} animate-pulse`} />
                Station Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{stationData?.status?.toUpperCase() || 'OFFLINE'}</div>
              <div className="text-xs text-muted-foreground">
                Last update: {stationData ? formatTimestamp(stationData.timestamp) : 'Never'}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Battery Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{stationData?.batteryLevel?.toFixed(0) || 0}%</div>
              <div className="text-xs text-muted-foreground">System Power</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Radio className="w-4 h-4" />
                Signal Strength
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{stationData?.signalStrength?.toFixed(0) || 0}%</div>
              <div className="text-xs text-muted-foreground">Communication</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Data Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{autoRefresh ? '10s' : 'Manual'}</div>
              <div className="text-xs text-muted-foreground">Update Interval</div>
            </CardContent>
          </Card>
        </div>

        {/* Weather Data Grid */}
        <div className="grid grid-cols-6 gap-4">
          <TechnicalCard
            title="Air Temperature"
            value={stationData?.temperature?.toFixed(1) || '0.0'}
            unit="°C"
            icon={<Thermometer className="w-5 h-5" />}
            status="normal"
          />
          
          <TechnicalCard
            title="Relative Humidity"
            value={stationData?.humidity?.toFixed(1) || '0.0'}
            unit="%"
            icon={<Droplets className="w-5 h-5" />}
            status="normal"
          />
          
          <TechnicalCard
            title="Atmospheric Pressure"
            value={stationData?.pressure?.toFixed(1) || '0.0'}
            unit="hPa"
            icon={<Gauge className="w-5 h-5" />}
            status="normal"
          />
          
          <TechnicalCard
            title="Wind Speed"
            value={stationData?.windSpeed?.toFixed(1) || '0.0'}
            unit="km/h"
            icon={<Wind className="w-5 h-5" />}
            status="normal"
          />
          
          <TechnicalCard
            title="Wind Direction"
            value={stationData?.windDirection?.toFixed(0) || '0'}
            unit="°"
            icon={<Wind className="w-5 h-5" />}
            status="normal"
          />
          
          <TechnicalCard
            title="Solar Radiation"
            value={stationData?.solarRadiation?.toFixed(0) || '0'}
            unit="W/m²"
            icon={<Sun className="w-5 h-5" />}
            status="normal"
          />
          
          <TechnicalCard
            title="UV Index"
            value={stationData?.uvIndex?.toFixed(1) || '0.0'}
            unit=""
            icon={<Sun className="w-5 h-5" />}
            status="normal"
          />
          
          <TechnicalCard
            title="Precipitation"
            value={stationData?.precipitation?.toFixed(1) || '0.0'}
            unit="mm"
            icon={<Cloud className="w-5 h-5" />}
            status="normal"
          />
          
          <TechnicalCard
            title="Visibility"
            value={((stationData?.visibility || 0) / 1000).toFixed(1)}
            unit="km"
            icon={<Eye className="w-5 h-5" />}
            status="normal"
          />
        </div>

        {/* API Configuration Info */}
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="text-sm">API Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">API Key</p>
                <p className="font-mono">xqjk7rvv...dlen</p>
              </div>
              <div>
                <p className="text-muted-foreground">API Secret</p>
                <p className="font-mono">yzsmaecyfvz...ldx</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-sm text-yellow-400">
                <strong>Note:</strong> Currently displaying simulated data. To connect to your actual weather station API, 
                please provide the correct API endpoint URL and documentation.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}