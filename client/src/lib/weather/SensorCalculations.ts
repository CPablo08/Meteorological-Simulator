import { WeatherState } from '../stores/useWeather';

export class SensorCalculations {
  /**
   * Calculate dew point temperature
   * @param temperature Air temperature in Celsius
   * @param humidity Relative humidity in percentage
   * @returns Dew point in Celsius
   */
  static calculateDewPoint(temperature: number, humidity: number): number {
    const a = 17.27;
    const b = 237.7;
    const alpha = ((a * temperature) / (b + temperature)) + Math.log(humidity / 100);
    const dewPoint = (b * alpha) / (a - alpha);
    return dewPoint;
  }
  
  /**
   * Calculate absolute humidity
   * @param temperature Air temperature in Celsius
   * @param relativeHumidity Relative humidity in percentage
   * @returns Absolute humidity in g/m³
   */
  static calculateAbsoluteHumidity(temperature: number, relativeHumidity: number): number {
    const saturationVaporPressure = 6.112 * Math.exp((17.67 * temperature) / (temperature + 243.5));
    const vaporPressure = (relativeHumidity / 100) * saturationVaporPressure;
    const absoluteHumidity = (216.7 * vaporPressure) / (temperature + 273.15);
    return absoluteHumidity;
  }
  
  /**
   * Calculate sea level pressure
   * @param stationPressure Station pressure in hPa
   * @param altitude Station altitude in meters
   * @param temperature Temperature in Celsius
   * @returns Sea level pressure in hPa
   */
  static calculateSeaLevelPressure(stationPressure: number, altitude: number, temperature: number): number {
    const tempK = temperature + 273.15;
    const seaLevelPressure = stationPressure * Math.pow(1 - (0.0065 * altitude) / tempK, -5.257);
    return seaLevelPressure;
  }
  
  /**
   * Calculate heat index
   * @param temperature Temperature in Celsius
   * @param humidity Relative humidity in percentage
   * @returns Heat index in Celsius
   */
  static calculateHeatIndex(temperature: number, humidity: number): number {
    const tempF = (temperature * 9/5) + 32;
    const c1 = -42.379;
    const c2 = 2.04901523;
    const c3 = 10.14333127;
    const c4 = -0.22475541;
    const c5 = -6.83783e-3;
    const c6 = -5.481717e-2;
    const c7 = 1.22874e-3;
    const c8 = 8.5282e-4;
    const c9 = -1.99e-6;
    
    const heatIndexF = c1 + (c2 * tempF) + (c3 * humidity) + (c4 * tempF * humidity) +
      (c5 * tempF * tempF) + (c6 * humidity * humidity) + (c7 * tempF * tempF * humidity) +
      (c8 * tempF * humidity * humidity) + (c9 * tempF * tempF * humidity * humidity);
    
    return (heatIndexF - 32) * 5/9;
  }
  
  /**
   * Calculate wind chill
   * @param temperature Temperature in Celsius
   * @param windSpeed Wind speed in km/h
   * @returns Wind chill in Celsius
   */
  static calculateWindChill(temperature: number, windSpeed: number): number {
    const windChillF = 35.74 + (0.6215 * ((temperature * 9/5) + 32)) - 
      (35.75 * Math.pow(windSpeed * 0.621371, 0.16)) +
      (0.4275 * ((temperature * 9/5) + 32) * Math.pow(windSpeed * 0.621371, 0.16));
    
    return (windChillF - 32) * 5/9;
  }
  
  /**
   * Calculate precipitation rate from tipping bucket data
   * @param tipCount Number of tips in time period
   * @param bucketVolume Volume per tip in mm
   * @param timePeriod Time period in minutes
   * @returns Precipitation rate in mm/hr
   */
  static calculatePrecipitationRate(tipCount: number, bucketVolume: number, timePeriod: number): number {
    const totalPrecipitation = tipCount * bucketVolume;
    const precipitationRate = (totalPrecipitation / timePeriod) * 60; // Convert to mm/hr
    return precipitationRate;
  }
  
  /**
   * Calculate solar panel voltage based on solar radiation
   * @param solarRadiation Solar radiation in W/m²
   * @param panelEfficiency Panel efficiency (0-1)
   * @param temperature Temperature in Celsius
   * @returns Voltage in V
   */
  static calculateSolarPanelVoltage(solarRadiation: number, panelEfficiency: number, temperature: number): number {
    const baseVoltage = 12; // 12V system
    const temperatureCoeff = -0.004; // -0.4% per degree C
    const radiationFactor = solarRadiation / 1000; // Normalized to 1000 W/m²
    
    const voltage = baseVoltage * panelEfficiency * radiationFactor * (1 + temperatureCoeff * (temperature - 25));
    return Math.max(0, voltage);
  }
  
  /**
   * Generate realistic sensor readings from weather data
   * @param weather Current weather state
   * @returns Object containing all sensor readings
   */
  static generateSensorReadings(weather: WeatherState) {
    const sensorNoise = () => (Math.random() - 0.5) * 0.2; // Small sensor noise
    
    return {
      airTemperature: weather.temperature + sensorNoise(),
      radiationShieldTemp: weather.temperature + sensorNoise() * 0.5,
      soilTemperature: weather.temperature - 2 + sensorNoise(),
      relativeHumidity: weather.humidity + sensorNoise(),
      dewPoint: this.calculateDewPoint(weather.temperature, weather.humidity),
      absoluteHumidity: this.calculateAbsoluteHumidity(weather.temperature, weather.humidity),
      windSpeed: weather.windSpeed + sensorNoise(),
      windDirection: weather.windDirection + sensorNoise() * 5,
      gustSpeed: weather.windSpeed * (1.2 + Math.random() * 0.3),
      rainGauge: weather.precipitation + sensorNoise() * 0.1,
      tippingBucket: Math.floor(weather.precipitation / 0.2), // 0.2mm per tip
      precipitationRate: weather.precipitation,
      atmosphericPressure: weather.pressure + sensorNoise(),
      seaLevelPressure: this.calculateSeaLevelPressure(weather.pressure, 100, weather.temperature),
      solarRadiation: weather.solarRadiation + sensorNoise() * 10,
      uvIndex: weather.uvIndex + sensorNoise() * 0.1,
      solarPanelVoltage: this.calculateSolarPanelVoltage(weather.solarRadiation, 0.2, weather.temperature),
      batteryLevel: 85 + Math.sin(Date.now() / 10000) * 10 + sensorNoise() * 2,
      internalTemperature: weather.temperature + 5 + sensorNoise()
    };
  }
}
