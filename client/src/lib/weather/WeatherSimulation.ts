import { WeatherState } from '../stores/useWeather';

export class WeatherSimulation {
  private static instance: WeatherSimulation;
  private intervalId: number | null = null;
  private subscribers: ((weather: Partial<WeatherState>) => void)[] = [];
  
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
    const time = Date.now();
    const hour = new Date(time).getHours();
    
    // Simulate realistic weather patterns
    const baseTemp = 20 + Math.sin((hour - 6) * Math.PI / 12) * 8;
    const tempVariation = (Math.random() - 0.5) * 2;
    const temperature = baseTemp + tempVariation;
    
    // Humidity inversely related to temperature
    const baseHumidity = 80 - (temperature - 15) * 1.5;
    const humidityVariation = (Math.random() - 0.5) * 10;
    const humidity = Math.max(20, Math.min(100, baseHumidity + humidityVariation));
    
    // Pressure with small variations
    const pressure = 1013.25 + (Math.random() - 0.5) * 20;
    
    // Wind with random variations
    const windSpeed = 5 + Math.random() * 25;
    const windDirection = (windDirection + (Math.random() - 0.5) * 30) % 360;
    
    // Solar radiation based on time of day
    const solarRadiation = Math.max(0, Math.sin((hour - 6) * Math.PI / 12) * 1000);
    
    // UV index based on solar radiation
    const uvIndex = Math.max(0, Math.min(11, solarRadiation / 100));
    
    // Precipitation (random chance)
    const precipitationChance = Math.random();
    const precipitation = precipitationChance < 0.95 ? 0 : Math.random() * 10;
    const precipitationType = precipitation > 0 ? 
      (temperature < 2 ? 'snow' : 'rain') : 'none';
    
    // Visibility based on weather conditions
    const visibility = precipitation > 0 ? 
      Math.max(1000, 10000 - precipitation * 1000) : 10000;
    
    const weatherUpdate = {
      temperature,
      humidity,
      pressure,
      windSpeed,
      windDirection,
      solarRadiation,
      uvIndex,
      precipitation,
      precipitationType,
      visibility
    };
    
    // Notify all subscribers
    this.subscribers.forEach(callback => callback(weatherUpdate));
  }
}
