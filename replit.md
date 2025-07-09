# Meteorological Station Simulator

## Overview

This is a full-stack web application that simulates a meteorological (weather) station with real-time data visualization, interactive 3D simulation, and comprehensive weather parameter controls. The system provides an immersive experience for monitoring and controlling weather conditions through a modern web interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **State Management**: Zustand for lightweight state management
- **3D Rendering**: React Three Fiber (@react-three/fiber) with Three.js for 3D weather visualization
- **UI Framework**: Radix UI components with Tailwind CSS for styling
- **Data Fetching**: TanStack Query for server state management

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Session Management**: In-memory storage with connect-pg-simple for production sessions
- **Development**: Hot reload with Vite middleware integration

### Project Structure
```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # UI components (dashboard, weather, ui)
│   │   ├── pages/         # Main application pages
│   │   ├── lib/           # Utilities, stores, and business logic
│   │   └── hooks/         # Custom React hooks
├── server/                # Backend Express application
│   ├── index.ts          # Main server entry point
│   ├── routes.ts         # API route definitions
│   ├── storage.ts        # Database abstraction layer
│   └── vite.ts           # Vite middleware for development
├── shared/                # Shared types and schemas
└── migrations/           # Database migration files
```

## Key Components

### Weather Simulation Engine
- **Real-time Weather Updates**: Continuous simulation of weather parameters
- **Sensor Data Generation**: Automatic calculation of sensor readings based on weather conditions
- **3D Visualization**: Interactive meteorological station with animated components (anemometer, wind vane, solar panel)
- **Weather Effects**: Particle systems for rain, snow, and fog visualization

### Dashboard System
- **Sensor Grid**: Real-time monitoring of 19+ meteorological sensors
- **Data Charts**: Historical data visualization with Recharts
- **Technical Display**: System status, derived calculations, and sensor health monitoring
- **Alert System**: Warning and error notifications for sensor readings

### Control Interface
- **Weather Parameter Controls**: Sliders and selectors for temperature, humidity, pressure, wind, solar radiation, UV index, precipitation, and visibility
- **Simulation Management**: Start/stop/reset simulation controls
- **Real-time Feedback**: Immediate response to parameter changes

### Data Storage
- **Database Schema**: User management with Drizzle ORM
- **Session Management**: PostgreSQL-based session storage
- **In-Memory Fallback**: MemStorage class for development without database

## Data Flow

1. **User Input**: Weather parameters adjusted through control interface
2. **Weather Simulation**: WeatherSimulation class processes changes and updates weather state
3. **Sensor Calculations**: SensorCalculations class derives realistic sensor readings from weather conditions
4. **State Updates**: Zustand stores manage application state (weather, sensors, simulation status)
5. **Real-time Updates**: Components subscribe to state changes for immediate UI updates
6. **3D Visualization**: React Three Fiber renders interactive 3D scene with weather effects
7. **Data Persistence**: Sensor readings stored in time-series format for historical analysis

## External Dependencies

### Core Libraries
- **React Ecosystem**: React, React-DOM, React Three Fiber, React Three Drei
- **State Management**: Zustand, TanStack Query
- **Database**: Drizzle ORM, Neon Database serverless driver
- **UI Components**: Radix UI primitives, Tailwind CSS
- **3D Graphics**: Three.js, React Three Postprocessing
- **Charts**: Recharts for data visualization
- **Utilities**: Date-fns, clsx, class-variance-authority

### Development Tools
- **Build System**: Vite, TypeScript, ESBuild
- **Code Quality**: ESLint, Prettier (implied)
- **Development Server**: Express with Vite middleware
- **Asset Processing**: PostCSS, Autoprefixer

## Deployment Strategy

### Production Build
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: ESBuild bundles Node.js server to `dist/index.js`
- **Database**: Drizzle migrations applied via `db:push` command

### Environment Configuration
- **Database**: PostgreSQL connection via `DATABASE_URL` environment variable
- **Session Storage**: PostgreSQL-based sessions in production, in-memory for development
- **Static Assets**: Served from `dist/public` in production

### Scaling Considerations
- **Database**: Neon Database provides serverless PostgreSQL with automatic scaling
- **State Management**: Client-side state with server-side persistence for user sessions
- **Real-time Updates**: WebSocket integration possible for multi-user scenarios
- **Caching**: TanStack Query provides client-side caching, Redis could be added for server-side caching

The application is designed as a single-page application with server-side rendering capabilities, suitable for deployment on platforms like Vercel, Netlify, or traditional VPS hosting with Node.js support.