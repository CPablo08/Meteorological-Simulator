import React from 'react';
import { TechnicalCard } from '../ui/technical-card';
import { Gauge } from '../ui/gauge';
import { useSensors } from '../../lib/stores/useSensors';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Gauge as GaugeIcon, 
  Sun, 
  CloudRain, 
  Zap,
  Eye,
  Battery,
  Cpu
} from 'lucide-react';

export function SensorGrid() {
  const sensors = useSensors();

  const sensorGroups = [
    {
      title: 'Temperature Sensors',
      icon: <Thermometer className="w-5 h-5 text-red-400" />,
      sensors: [
        { name: 'Air Temperature', key: 'airTemperature', unit: '°C', min: -40, max: 50 },
        { name: 'Radiation Shield', key: 'radiationShieldTemp', unit: '°C', min: -40, max: 50 },
        { name: 'Soil Temperature', key: 'soilTemperature', unit: '°C', min: -40, max: 50 },
      ]
    },
    {
      title: 'Humidity Sensors',
      icon: <Droplets className="w-5 h-5 text-blue-400" />,
      sensors: [
        { name: 'Relative Humidity', key: 'relativeHumidity', unit: '%', min: 0, max: 100 },
        { name: 'Dew Point', key: 'dewPoint', unit: '°C', min: -40, max: 50 },
        { name: 'Absolute Humidity', key: 'absoluteHumidity', unit: 'g/m³', min: 0, max: 50 },
      ]
    },
    {
      title: 'Wind Sensors',
      icon: <Wind className="w-5 h-5 text-cyan-400" />,
      sensors: [
        { name: 'Wind Speed', key: 'windSpeed', unit: 'km/h', min: 0, max: 100 },
        { name: 'Wind Direction', key: 'windDirection', unit: '°', min: 0, max: 360 },
        { name: 'Gust Speed', key: 'gustSpeed', unit: 'km/h', min: 0, max: 150 },
      ]
    },
    {
      title: 'Precipitation Sensors',
      icon: <CloudRain className="w-5 h-5 text-blue-400" />,
      sensors: [
        { name: 'Rain Gauge', key: 'rainGauge', unit: 'mm', min: 0, max: 100 },
        { name: 'Tipping Bucket', key: 'tippingBucket', unit: 'tips', min: 0, max: 500 },
        { name: 'Precipitation Rate', key: 'precipitationRate', unit: 'mm/h', min: 0, max: 50 },
      ]
    },
    {
      title: 'Pressure Sensors',
      icon: <GaugeIcon className="w-5 h-5 text-green-400" />,
      sensors: [
        { name: 'Atmospheric Pressure', key: 'atmosphericPressure', unit: 'hPa', min: 950, max: 1080 },
        { name: 'Sea Level Pressure', key: 'seaLevelPressure', unit: 'hPa', min: 950, max: 1080 },
      ]
    },
    {
      title: 'Solar & UV Sensors',
      icon: <Sun className="w-5 h-5 text-yellow-400" />,
      sensors: [
        { name: 'Solar Radiation', key: 'solarRadiation', unit: 'W/m²', min: 0, max: 1200 },
        { name: 'UV Index', key: 'uvIndex', unit: '', min: 0, max: 11 },
        { name: 'Solar Panel Voltage', key: 'solarPanelVoltage', unit: 'V', min: 0, max: 15 },
      ]
    },
    {
      title: 'System Sensors',
      icon: <Cpu className="w-5 h-5 text-purple-400" />,
      sensors: [
        { name: 'Battery Level', key: 'batteryLevel', unit: '%', min: 0, max: 100 },
        { name: 'Internal Temperature', key: 'internalTemperature', unit: '°C', min: -40, max: 80 },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Sensor Data</h2>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
      
      {sensorGroups.map((group) => (
        <div key={group.title} className="space-y-4">
          <div className="flex items-center gap-2">
            {group.icon}
            <h3 className="text-lg font-semibold">{group.title}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.sensors.map((sensor) => {
              const sensorData = sensors[sensor.key as keyof typeof sensors];
              const isValidSensor = sensorData && typeof sensorData === 'object' && 'current' in sensorData;
              
              if (!isValidSensor) return null;
              
              return (
                <TechnicalCard
                  key={sensor.key}
                  title={sensor.name}
                  value={sensorData.current}
                  unit={sensor.unit}
                  status={sensorData.status}
                  subtitle={`Min: ${sensorData.min.toFixed(1)} | Max: ${sensorData.max.toFixed(1)} | Avg: ${sensorData.average.toFixed(1)}`}
                >
                  <div className="mt-2 flex justify-center">
                    <Gauge
                      value={sensorData.current}
                      min={sensor.min}
                      max={sensor.max}
                      size="sm"
                    />
                  </div>
                </TechnicalCard>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
