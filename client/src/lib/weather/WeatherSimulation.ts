import { WeatherState } from '../stores/useWeather';

export class WeatherSimulation {
  private static instance: WeatherSimulation;
  private intervalId: number | null = null;
  private subscribers: ((weather: Partial<WeatherState>) => void)[] = [];
  private simulationHour: number = 12; // Start at noon
  private userControls: Partial<WeatherState> = {}; // Store user-controlled values
  
  private constructor() {}
  
  static getInstance(): WeatherSimulation {
    if (!WeatherSimulation.instance) {
      WeatherSimulation.instance = new WeatherSimulation();
    }
    return WeatherSimulation.instance;
  }
  
  subscribe(callback: (weather: Partial<WeatherState>) => void) {
    this.subscribers.push(callback);
    
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }
  
  // Set user-controlled weather parameters
  setUserControls(controls: Partial<WeatherState>) {
    this.userControls = { ...this.userControls, ...controls };
  }
  
  start(speed: number = 1) {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    this.intervalId = window.setInterval(() => {
      this.simulate();
    }, 1000 / speed);
    
    console.log(`Weather simulation started at ${speed}x speed`);
  }
  
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    console.log('Weather simulation stopped');
  }
  
  private simulate() {
    // Advance simulation hour (24-hour cycle)
    this.simulationHour = (this.simulationHour + 0.1) % 24; // 0.1 = 6 minutes per update
    const dayProgress = this.simulationHour / 24;
    
    // Use user-controlled values if set, otherwise simulate realistic patterns
    
    // Temperature: warmer during day, cooler at night
    const baseTemp = this.userControls.temperature ?? 
      (20 + Math.sin((this.simulationHour - 6) * Math.PI / 12) * 8);
    const tempVariation = (Math.random() - 0.5) * 1;
    const temperature = baseTemp + tempVariation;
    
    // Humidity: higher at night, lower during day
    const baseHumidity = this.userControls.humidity ?? 
      (80 - (temperature - 15) * 1.5 + Math.sin((this.simulationHour + 6) * Math.PI / 12) * 10);
    const humidityVariation = (Math.random() - 0.5) * 5;
    const humidity = Math.max(20, Math.min(100, baseHumidity + humidityVariation));
    
    // Pressure: small variations throughout day
    const pressure = this.userControls.pressure ?? 
      (1013.25 + Math.sin(this.simulationHour * Math.PI / 12) * 5 + (Math.random() - 0.5) * 10);
    
    // Wind: typically stronger during day
    const windSpeed = this.userControls.windSpeed ?? 
      (8 + Math.sin((this.simulationHour - 2) * Math.PI / 12) * 5 + Math.random() * 10);
    const windDirection = this.userControls.windDirection ?? 
      (180 + Math.sin(this.simulationHour * Math.PI / 6) * 60 + (Math.random() - 0.5) * 30);
    
    // Solar radiation: follows sun position (0 at night, max at noon)
    const solarRadiation = this.userControls.solarRadiation ?? 
      Math.max(0, Math.sin((this.simulationHour - 6) * Math.PI / 12) * 1000);
    
    // UV index: based on solar radiation
    const uvIndex = this.userControls.uvIndex ?? 
      Math.max(0, Math.min(11, solarRadiation / 100));
    
    // Precipitation: respect user controls or simulate realistic patterns
    const precipitation = this.userControls.precipitation ?? 
      (Math.random() < 0.05 ? Math.random() * 5 : 0); // 5% chance of rain
    const precipitationType = this.userControls.precipitationType ?? 
      (precipitation > 0 ? (temperature < 2 ? 'snow' : 'rain') : 'none');
    
    // Visibility: affected by precipitation and time of day
    const visibility = this.userControls.visibility ?? 
      (precipitation > 0 ? Math.max(1000, 10000 - precipitation * 1500) : 
       (this.simulationHour < 6 || this.simulationHour > 20 ? 8000 : 10000)); // Reduced at night
    
    const weatherUpdate = {
      temperature,
      humidity,
      pressure,
      windSpeed,
      windDirection: windDirection % 360,
      solarRadiation,
      uvIndex,
      precipitation,
      precipitationType,
      visibility,
      simulationHour: this.simulationHour,
      dayProgress
    };
    
    // Notify all subscribers
    this.subscribers.forEach(callback => callback(weatherUpdate));
  }
}
