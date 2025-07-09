import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Weather Station API Route
  app.get('/api/weather-station', async (req, res) => {
    try {
      const apiKey = process.env.WEATHER_API_KEY;
      const apiSecret = process.env.WEATHER_API_SECRET;
      
      if (!apiKey || !apiSecret) {
        return res.status(500).json({ 
          error: 'API credentials not configured',
          message: 'Please configure WEATHER_API_KEY and WEATHER_API_SECRET' 
        });
      }

      // Mock data for now - replace with actual API call once endpoint is known
      const mockData = {
        timestamp: new Date().toISOString(),
        temperature: 22.5 + Math.random() * 10,
        humidity: 60 + Math.random() * 30,
        pressure: 1013.25 + Math.random() * 10,
        windSpeed: 5 + Math.random() * 15,
        windDirection: Math.random() * 360,
        solarRadiation: 400 + Math.random() * 600,
        uvIndex: 3 + Math.random() * 8,
        precipitation: Math.random() * 2,
        visibility: 8000 + Math.random() * 7000,
        status: 'online',
        batteryLevel: 85 + Math.random() * 15,
        signalStrength: 70 + Math.random() * 30
      };

      res.json(mockData);
    } catch (error) {
      console.error('Weather station API error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch weather data',
        message: 'Please check API configuration and try again'
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
