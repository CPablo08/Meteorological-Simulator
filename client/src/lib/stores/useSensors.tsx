
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
  resetPrecipitationSensors: () => void;
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
    },

    resetPrecipitationSensors: () => set((state) => ({
      ...state,
      rainGauge: { ...state.rainGauge, current: 0 },
      tippingBucket: { ...state.tippingBucket, current: 0 },
      precipitationRate: { ...state.precipitationRate, current: 0 },
    })),
  }))
);

// Import weather store
import { useWeather } from './useWeather';
import { SensorCalculations } from '../weather/SensorCalculations';

// Subscribe to weather changes
useWeather.subscribe(
  (state) => state,
  (weather) => {
    useSensors.setState((state) => {
      // Calculate precipitation sensors based on weather
      const isPrecipitating = weather.precipitationType !== 'none';
      const currentPrecipitation = isPrecipitating ? weather.precipitation : 0;
      
      // Reset precipitation sensors when no precipitation
      let newRainGauge = state.rainGauge.current;
      let newTippingBucket = state.tippingBucket.current;
      
      if (isPrecipitating) {
        const incrementPerMinute = currentPrecipitation * 0.016667; // Convert mm/h to mm/min
        newRainGauge += incrementPerMinute;
        newTippingBucket += incrementPerMinute / 0.2; // 0.2mm per tip
      } else {
        // Reset when no precipitation
        newRainGauge = 0;
        newTippingBucket = 0;
      }

      return {
        ...state,
        airTemperature: { ...state.airTemperature, current: weather.temperature },
        radiationShieldTemp: { ...state.radiationShieldTemp, current: weather.temperature - 0.5 },
        soilTemperature: { ...state.soilTemperature, current: weather.temperature - 2 },
        relativeHumidity: { ...state.relativeHumidity, current: weather.humidity },
        dewPoint: { ...state.dewPoint, current: SensorCalculations.calculateDewPoint(weather.temperature, weather.humidity) },
        absoluteHumidity: { ...state.absoluteHumidity, current: SensorCalculations.calculateAbsoluteHumidity(weather.temperature, weather.humidity) },
        windSpeed: { ...state.windSpeed, current: weather.windSpeed },
        windDirection: { ...state.windDirection, current: weather.windDirection },
        gustSpeed: { ...state.gustSpeed, current: weather.windSpeed * (1 + Math.random() * 0.5) },
        atmosphericPressure: { ...state.atmosphericPressure, current: weather.pressure },
        seaLevelPressure: { ...state.seaLevelPressure, current: weather.pressure + 1.2 },
        solarRadiation: { ...state.solarRadiation, current: weather.solarRadiation },
        uvIndex: { ...state.uvIndex, current: weather.uvIndex },
        solarPanelVoltage: { ...state.solarPanelVoltage, current: (weather.solarRadiation / 1000) * 12 },
        batteryLevel: { ...state.batteryLevel, current: Math.max(20, Math.min(100, state.batteryLevel.current + (weather.solarRadiation > 100 ? 0.1 : -0.05))) },
        internalTemperature: { ...state.internalTemperature, current: weather.temperature + 5 + Math.random() * 2 },
        // Fixed precipitation sensors
        rainGauge: { ...state.rainGauge, current: newRainGauge },
        tippingBucket: { ...state.tippingBucket, current: newTippingBucket },
        precipitationRate: { ...state.precipitationRate, current: currentPrecipitation },
      };
    });
  }
);
