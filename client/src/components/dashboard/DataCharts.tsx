import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useSensors } from '../../lib/stores/useSensors';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Activity, BarChart3 } from 'lucide-react';

export function DataCharts() {
  const sensors = useSensors();
  const chartUpdateRef = useRef<number>(0);

  // Prepare chart data
  const temperatureData = sensors.airTemperature.readings.slice(-50).map((reading, index) => ({
    time: new Date(reading.timestamp).toLocaleTimeString(),
    temperature: reading.value,
    humidity: sensors.relativeHumidity.readings[index]?.value || 0,
    pressure: sensors.atmosphericPressure.readings[index]?.value || 0,
  }));

  const windData = sensors.windSpeed.readings.slice(-50).map((reading, index) => ({
    time: new Date(reading.timestamp).toLocaleTimeString(),
    speed: reading.value,
    direction: sensors.windDirection.readings[index]?.value || 0,
    gust: sensors.gustSpeed.readings[index]?.value || 0,
  }));

  const precipitationData = sensors.rainGauge.readings.slice(-50).map((reading, index) => ({
    time: new Date(reading.timestamp).toLocaleTimeString(),
    rainfall: reading.value,
    rate: sensors.precipitationRate.readings[index]?.value || 0,
  }));

  const solarData = sensors.solarRadiation.readings.slice(-50).map((reading, index) => ({
    time: new Date(reading.timestamp).toLocaleTimeString(),
    radiation: reading.value,
    uvIndex: sensors.uvIndex.readings[index]?.value || 0,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">Historical Data</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Temperature & Environmental */}
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="w-5 h-5 text-red-400" />
              Temperature & Environmental
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={temperatureData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis 
                  dataKey="time" 
                  stroke="#666"
                  fontSize={12}
                  interval="preserveStartEnd"
                />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    border: '1px solid #333',
                    borderRadius: '4px'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#ff6b6b" 
                  strokeWidth={2}
                  name="Temperature (°C)"
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="humidity" 
                  stroke="#4ecdc4" 
                  strokeWidth={2}
                  name="Humidity (%)"
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="pressure" 
                  stroke="#45b7d1" 
                  strokeWidth={2}
                  name="Pressure (hPa)"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Wind Data */}
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="w-5 h-5 text-cyan-400" />
              Wind Measurements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={windData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis 
                  dataKey="time" 
                  stroke="#666"
                  fontSize={12}
                  interval="preserveStartEnd"
                />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    border: '1px solid #333',
                    borderRadius: '4px'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="speed" 
                  stroke="#00d4aa" 
                  strokeWidth={2}
                  name="Wind Speed (km/h)"
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="direction" 
                  stroke="#ff9f43" 
                  strokeWidth={2}
                  name="Wind Direction (°)"
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="gust" 
                  stroke="#ff6b9d" 
                  strokeWidth={2}
                  name="Gust Speed (km/h)"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Precipitation */}
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="w-5 h-5 text-blue-400" />
              Precipitation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={precipitationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis 
                  dataKey="time" 
                  stroke="#666"
                  fontSize={12}
                  interval="preserveStartEnd"
                />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    border: '1px solid #333',
                    borderRadius: '4px'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="rainfall" 
                  stroke="#4a90e2" 
                  strokeWidth={2}
                  name="Rainfall (mm)"
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#7b68ee" 
                  strokeWidth={2}
                  name="Rate (mm/h)"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Solar & UV */}
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="w-5 h-5 text-yellow-400" />
              Solar & UV Radiation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={solarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis 
                  dataKey="time" 
                  stroke="#666"
                  fontSize={12}
                  interval="preserveStartEnd"
                />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    border: '1px solid #333',
                    borderRadius: '4px'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="radiation" 
                  stroke="#ffd700" 
                  strokeWidth={2}
                  name="Solar Radiation (W/m²)"
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="uvIndex" 
                  stroke="#ff6347" 
                  strokeWidth={2}
                  name="UV Index"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
