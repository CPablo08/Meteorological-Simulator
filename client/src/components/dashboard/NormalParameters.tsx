
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Thermometer, 
  Droplets, 
  Gauge, 
  Wind, 
  Sun, 
  Eye,
  CloudRain,
  Zap,
  Info
} from 'lucide-react';

interface ParameterRange {
  name: string;
  icon: React.ReactNode;
  ranges: {
    low: { value: string; label: string; color: string };
    normal: { value: string; label: string; color: string };
    high: { value: string; label: string; color: string };
  };
  unit: string;
}

export function NormalParameters() {
  const parameters: ParameterRange[] = [
    {
      name: "Temperature",
      icon: <Thermometer className="w-4 h-4" />,
      ranges: {
        low: { value: "< 10°C", label: "Cold", color: "bg-blue-500" },
        normal: { value: "15-25°C", label: "Normal", color: "bg-green-500" },
        high: { value: "> 30°C", label: "Hot", color: "bg-red-500" }
      },
      unit: "°C"
    },
    {
      name: "Humidity",
      icon: <Droplets className="w-4 h-4" />,
      ranges: {
        low: { value: "< 30%", label: "Dry", color: "bg-yellow-500" },
        normal: { value: "40-70%", label: "Comfortable", color: "bg-green-500" },
        high: { value: "> 80%", label: "Humid", color: "bg-blue-500" }
      },
      unit: "%"
    },
    {
      name: "Pressure",
      icon: <Gauge className="w-4 h-4" />,
      ranges: {
        low: { value: "< 1000", label: "Low", color: "bg-red-500" },
        normal: { value: "1013-1023", label: "Normal", color: "bg-green-500" },
        high: { value: "> 1030", label: "High", color: "bg-blue-500" }
      },
      unit: "hPa"
    },
    {
      name: "Wind Speed",
      icon: <Wind className="w-4 h-4" />,
      ranges: {
        low: { value: "< 5", label: "Calm", color: "bg-green-500" },
        normal: { value: "5-25", label: "Moderate", color: "bg-yellow-500" },
        high: { value: "> 35", label: "Strong", color: "bg-red-500" }
      },
      unit: "km/h"
    },
    {
      name: "Solar Radiation",
      icon: <Sun className="w-4 h-4" />,
      ranges: {
        low: { value: "< 200", label: "Low", color: "bg-gray-500" },
        normal: { value: "400-800", label: "Moderate", color: "bg-yellow-500" },
        high: { value: "> 1000", label: "High", color: "bg-orange-500" }
      },
      unit: "W/m²"
    },
    {
      name: "UV Index",
      icon: <Zap className="w-4 h-4" />,
      ranges: {
        low: { value: "0-2", label: "Low", color: "bg-green-500" },
        normal: { value: "3-7", label: "Moderate", color: "bg-yellow-500" },
        high: { value: "8-11", label: "High", color: "bg-red-500" }
      },
      unit: ""
    },
    {
      name: "Visibility",
      icon: <Eye className="w-4 h-4" />,
      ranges: {
        low: { value: "< 1000m", label: "Poor", color: "bg-red-500" },
        normal: { value: "5-10km", label: "Good", color: "bg-green-500" },
        high: { value: "> 15km", label: "Excellent", color: "bg-blue-500" }
      },
      unit: ""
    },
    {
      name: "Precipitation",
      icon: <CloudRain className="w-4 h-4" />,
      ranges: {
        low: { value: "0mm", label: "None", color: "bg-gray-500" },
        normal: { value: "0.1-2mm", label: "Light", color: "bg-blue-400" },
        high: { value: "> 10mm", label: "Heavy", color: "bg-blue-600" }
      },
      unit: "mm/h"
    }
  ];

  return (
    <Card className="bg-card/50 border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Info className="w-5 h-5 text-blue-400" />
          Normal Weather Parameters
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Reference ranges for meteorological measurements
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {parameters.map((param) => (
            <div key={param.name} className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                {param.icon}
                {param.name}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {param.ranges.low.value}
                  </span>
                  <Badge 
                    variant="secondary" 
                    className={`${param.ranges.low.color} text-white text-xs px-2 py-1`}
                  >
                    {param.ranges.low.label}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">
                    {param.ranges.normal.value}
                  </span>
                  <Badge 
                    variant="secondary" 
                    className={`${param.ranges.normal.color} text-white text-xs px-2 py-1`}
                  >
                    {param.ranges.normal.label}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {param.ranges.high.value}
                  </span>
                  <Badge 
                    variant="secondary" 
                    className={`${param.ranges.high.color} text-white text-xs px-2 py-1`}
                  >
                    {param.ranges.high.label}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Info className="w-4 h-4" />
            Additional Reference Values
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted-foreground">
            <div className="space-y-1">
              <div><strong>Dew Point:</strong> -10°C to 25°C (comfortable: 10-18°C)</div>
              <div><strong>Heat Index:</strong> Dangerous above 40°C</div>
              <div><strong>Wind Chill:</strong> Dangerous below -25°C</div>
            </div>
            <div className="space-y-1">
              <div><strong>Sea Level Pressure:</strong> 1013.25 hPa (standard)</div>
              <div><strong>Absolute Humidity:</strong> 5-20 g/m³ (comfortable)</div>
              <div><strong>Solar Panel Efficiency:</strong> 15-20% typical</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
