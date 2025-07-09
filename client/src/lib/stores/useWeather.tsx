import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface WeatherState {
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  solarRadiation: number;
  uvIndex: number;
  precipitation: number;
  precipitationType: 'none' | 'rain' | 'snow';
  visibility: number;
  
  // Simulation controls
  isSimulating: boolean;
  simulationSpeed: number;
  
  // Actions
  setTemperature: (temp: number) => void;
  setHumidity: (humidity: number) => void;
  setPressure: (pressure: number) => void;
  setWindSpeed: (speed: number) => void;
  setWindDirection: (direction: number) => void;
  setSolarRadiation: (radiation: number) => void;
  setUvIndex: (index: number) => void;
  setPrecipitation: (amount: number) => void;
  setPrecipitationType: (type: 'none' | 'rain' | 'snow') => void;
  setVisibility: (visibility: number) => void;
  
  startSimulation: () => void;
  stopSimulation: () => void;
  setSimulationSpeed: (speed: number) => void;
  
  // Batch update for simulation
  updateWeather: (updates: Partial<WeatherState>) => void;
}

export const useWeather = create<WeatherState>()(
  subscribeWithSelector((set) => ({
    // Initial weather conditions
    temperature: 22.5,
    humidity: 65,
    pressure: 1013.25,
    windSpeed: 12.5,
    windDirection: 225,
    solarRadiation: 800,
    uvIndex: 6,
    precipitation: 0,
    precipitationType: 'none',
    visibility: 10000,
    
    // Simulation state
    isSimulating: false,
    simulationSpeed: 1,
    
    // Actions
    setTemperature: (temp) => set({ temperature: temp }),
    setHumidity: (humidity) => set({ humidity }),
    setPressure: (pressure) => set({ pressure }),
    setWindSpeed: (speed) => set({ windSpeed: speed }),
    setWindDirection: (direction) => set({ windDirection: direction }),
    setSolarRadiation: (radiation) => set({ solarRadiation: radiation }),
    setUvIndex: (index) => set({ uvIndex: index }),
    setPrecipitation: (amount) => set({ precipitation: amount }),
    setPrecipitationType: (type) => set({ precipitationType: type }),
    setVisibility: (visibility) => set({ visibility }),
    
    startSimulation: () => set({ isSimulating: true }),
    stopSimulation: () => set({ isSimulating: false }),
    setSimulationSpeed: (speed) => set({ simulationSpeed: speed }),
    
    updateWeather: (updates) => set((state) => ({ ...state, ...updates }))
  }))
);
