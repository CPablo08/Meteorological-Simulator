import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface SensorReading {
  timestamp: number;
  value: number;
  status: 'normal' | 'warning' | 'error';
}

export interface SensorData {
  current: number;
  readings: SensorReading[];
  min: number;
  max: number;
  average: number;
  lastUpdated: number;
  status: 'normal' | 'warning' | 'error';
}

export interface SensorsState {
  // Temperature sensors
  airTemperature: SensorData;
  radiationShieldTemp: SensorData;
  soilTemperature: SensorData;
  
  // Humidity sensors
  relativeHumidity: SensorData;
  dewPoint: SensorData;
  absoluteHumidity: SensorData;
  
  // Wind sensors
  windSpeed: SensorData;
  windDirection: SensorData;
  gustSpeed: SensorData;
  
  // Precipitation sensors
  rainGauge: SensorData;
  tippingBucket: SensorData;
  precipitationRate: SensorData;
  
  // Pressure sensors
  atmosphericPressure: SensorData;
  seaLevelPressure: SensorData;
  
  // Solar and UV sensors
  solarRadiation: SensorData;
  uvIndex: SensorData;
  solarPanelVoltage: SensorData;
  
  // System sensors
  batteryLevel: SensorData;
  internalTemperature: SensorData;
  
  // Actions
  updateSensorData: (sensorName: keyof SensorsState, value: number) => void;
  addSensorReading: (sensorName: keyof SensorsState, reading: SensorReading) => void;
  resetSensorData: () => void;
}

const createEmptySensorData = (): SensorData => ({
  current: 0,
  readings: [],
  min: 0,
  max: 0,
  average: 0,
  lastUpdated: Date.now(),
  status: 'normal'
});

export const useSensors = create<SensorsState>()(
  subscribeWithSelector((set, get) => ({
    // Initialize all sensors
    airTemperature: createEmptySensorData(),
    radiationShieldTemp: createEmptySensorData(),
    soilTemperature: createEmptySensorData(),
    relativeHumidity: createEmptySensorData(),
    dewPoint: createEmptySensorData(),
    absoluteHumidity: createEmptySensorData(),
    windSpeed: createEmptySensorData(),
    windDirection: createEmptySensorData(),
    gustSpeed: createEmptySensorData(),
    rainGauge: createEmptySensorData(),
    tippingBucket: createEmptySensorData(),
    precipitationRate: createEmptySensorData(),
    atmosphericPressure: createEmptySensorData(),
    seaLevelPressure: createEmptySensorData(),
    solarRadiation: createEmptySensorData(),
    uvIndex: createEmptySensorData(),
    solarPanelVoltage: createEmptySensorData(),
    batteryLevel: createEmptySensorData(),
    internalTemperature: createEmptySensorData(),
    
    updateSensorData: (sensorName, value) => {
      const state = get();
      const sensor = state[sensorName] as SensorData;
      
      if (!sensor) return;
      
      const readings = [...sensor.readings, {
        timestamp: Date.now(),
        value,
        status: 'normal' as const
      }];
      
      // Keep only last 100 readings
      if (readings.length > 100) {
        readings.shift();
      }
      
      const values = readings.map(r => r.value);
      const min = Math.min(...values);
      const max = Math.max(...values);
      const average = values.reduce((a, b) => a + b, 0) / values.length;
      
      set({
        [sensorName]: {
          current: value,
          readings,
          min,
          max,
          average,
          lastUpdated: Date.now(),
          status: 'normal' as const
        }
      });
    },
    
    addSensorReading: (sensorName, reading) => {
      const state = get();
      const sensor = state[sensorName] as SensorData;
      
      if (!sensor) return;
      
      const readings = [...sensor.readings, reading];
      
      // Keep only last 100 readings
      if (readings.length > 100) {
        readings.shift();
      }
      
      set({
        [sensorName]: {
          ...sensor,
          readings,
          lastUpdated: Date.now()
        }
      });
    },
    
    resetSensorData: () => {
      set({
        airTemperature: createEmptySensorData(),
        radiationShieldTemp: createEmptySensorData(),
        soilTemperature: createEmptySensorData(),
        relativeHumidity: createEmptySensorData(),
        dewPoint: createEmptySensorData(),
        absoluteHumidity: createEmptySensorData(),
        windSpeed: createEmptySensorData(),
        windDirection: createEmptySensorData(),
        gustSpeed: createEmptySensorData(),
        rainGauge: createEmptySensorData(),
        tippingBucket: createEmptySensorData(),
        precipitationRate: createEmptySensorData(),
        atmosphericPressure: createEmptySensorData(),
        seaLevelPressure: createEmptySensorData(),
        solarRadiation: createEmptySensorData(),
        uvIndex: createEmptySensorData(),
        solarPanelVoltage: createEmptySensorData(),
        batteryLevel: createEmptySensorData(),
        internalTemperature: createEmptySensorData(),
      });
    }
  }))
);
