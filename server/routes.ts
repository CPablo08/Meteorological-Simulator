import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get weather stations list
  app.get('/api/weather-stations', async (req, res) => {
    try {
      const apiKey = process.env.WEATHER_API_KEY;
      const apiSecret = process.env.WEATHER_API_SECRET;
      
      if (!apiKey || !apiSecret) {
        return res.status(500).json({ 
          error: 'API credentials not configured',
          message: 'Please configure WEATHER_API_KEY and WEATHER_API_SECRET' 
        });
      }

      console.log('Making API call to WeatherLink stations endpoint...');
      console.log('API Key length:', apiKey?.length);
      console.log('API Secret length:', apiSecret?.length);
      
      const response = await fetch(`https://api.weatherlink.com/v2/stations?api-key=${apiKey}`, {
        headers: {
          'X-Api-Secret': apiSecret
        }
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response body:', errorText);
        throw new Error(`WeatherLink API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Weather stations API error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch weather stations',
        message: error.message || 'Please check API configuration and try again',
        debug: {
          suggestion: 'Please verify your WeatherLink v2 API credentials are correct and have been generated from https://www.weatherlink.com/account',
          apiKeyLength: process.env.WEATHER_API_KEY?.length || 0,
          apiSecretLength: process.env.WEATHER_API_SECRET?.length || 0
        }
      });
    }
  });

  // Get current weather data for a specific station
  app.get('/api/weather-station/:stationId?', async (req, res) => {
    try {
      const apiKey = process.env.WEATHER_API_KEY;
      const apiSecret = process.env.WEATHER_API_SECRET;
      
      if (!apiKey || !apiSecret) {
        return res.status(500).json({ 
          error: 'API credentials not configured',
          message: 'Please configure WEATHER_API_KEY and WEATHER_API_SECRET' 
        });
      }

      // If no station ID provided, first get stations and use the first one
      let stationId = req.params.stationId;
      
      if (!stationId) {
        const stationsResponse = await fetch(`https://api.weatherlink.com/v2/stations?api-key=${apiKey}`, {
          headers: {
            'X-Api-Secret': apiSecret
          }
        });

        if (!stationsResponse.ok) {
          const errorText = await stationsResponse.text();
          throw new Error(`WeatherLink API error: ${stationsResponse.status} ${stationsResponse.statusText} - ${errorText}`);
        }

        const stationsData = await stationsResponse.json();
        if (!stationsData.stations || stationsData.stations.length === 0) {
          return res.status(404).json({ 
            error: 'No weather stations found',
            message: 'No accessible weather stations found for your API credentials'
          });
        }
        
        stationId = stationsData.stations[0].station_id;
      }

      // Get current conditions for the station
      const response = await fetch(`https://api.weatherlink.com/v2/current/${stationId}?api-key=${apiKey}`, {
        headers: {
          'X-Api-Secret': apiSecret
        }
      });

      if (!response.ok) {
        throw new Error(`WeatherLink API error: ${response.status} ${response.statusText}`);
      }

      const rawData = await response.json();
      
      // Transform WeatherLink data to our expected format
      const transformedData = transformWeatherLinkData(rawData);
      
      res.json(transformedData);
    } catch (error) {
      console.error('Weather station API error:', error);
      console.error('Error message:', error.message);
      
      // If it's an authentication error, provide helpful fallback data
      if (error.message?.includes('401') || error.message?.includes('Invalid authentication') || error.message?.includes('Unauthorized')) {
        console.log('Authentication error detected, returning fallback data');
        return res.json({
          timestamp: new Date().toISOString(),
          temperature: null,
          humidity: null,
          pressure: null,
          windSpeed: null,
          windDirection: null,
          solarRadiation: null,
          uvIndex: null,
          precipitation: null,
          visibility: null,
          status: 'error',
          batteryLevel: null,
          signalStrength: null,
          error: 'API Authentication Failed',
          message: 'Please verify your WeatherLink v2 API credentials are correct and generated from https://www.weatherlink.com/account'
        });
      }
      
      res.status(500).json({ 
        error: 'Failed to fetch weather data',
        message: error.message || 'Please check API configuration and try again'
      });
    }
  });

  

    // Parse sensor data from WeatherLink response
    if (rawData.sensors && Array.isArray(rawData.sensors)) {
      rawData.sensors.forEach(sensor => {
        if (sensor.data && Array.isArray(sensor.data) && sensor.data.length > 0) {
          const sensorData = sensor.data[0]; // Most recent data point
          
          // Map sensor types to our data structure
          switch (sensor.sensor_type) {
            case 45: // ISS (Integrated Sensor Suite)
            case 323: // Vantage Pro2/Pro2 Plus
              if (sensorData.temp !== undefined) transformed.temperature = sensorData.temp;
              if (sensorData.hum !== undefined) transformed.humidity = sensorData.hum;
              if (sensorData.bar !== undefined) transformed.pressure = sensorData.bar;
              if (sensorData.wind_speed !== undefined) transformed.windSpeed = sensorData.wind_speed;
              if (sensorData.wind_dir !== undefined) transformed.windDirection = sensorData.wind_dir;
              if (sensorData.solar_rad !== undefined) transformed.solarRadiation = sensorData.solar_rad;
              if (sensorData.uv_index !== undefined) transformed.uvIndex = sensorData.uv_index;
              if (sensorData.rain_rate_last !== undefined) transformed.precipitation = sensorData.rain_rate_last;
              break;
              
            case 242: // AirLink (Air Quality)
              // AirLink data structure is different, extract what we can
              break;
              
            default:
              // Handle other sensor types as needed
              if (sensorData.temp !== undefined) transformed.temperature = sensorData.temp;
              if (sensorData.hum !== undefined) transformed.humidity = sensorData.hum;
              break;
          }
          
          // Battery and signal data
          if (sensorData.battery_voltage !== undefined) {
            // Convert battery voltage to percentage (approximate)
            transformed.batteryLevel = Math.min(100, Math.max(0, (sensorData.battery_voltage - 3.0) / 0.6 * 100));
          }
          if (sensorData.rssi !== undefined) {
            // Convert RSSI to percentage
            transformed.signalStrength = Math.min(100, Math.max(0, (sensorData.rssi + 100) * 2));
          }
        }
      });
    }

    // Set default visibility if not available
    if (transformed.visibility === null) {
      transformed.visibility = 10000; // Default 10km visibility
    }

    return transformed;
  }

  const httpServer = createServer(app);

  return httpServer;
}
