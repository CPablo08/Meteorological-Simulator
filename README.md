# Meteorological Station Simulator

An interactive full-stack weather-station simulator with real-time sensor readings, configurable weather conditions, historical charts, and a 3D visualization of a meteorological station.

## Features

- Control temperature, humidity, pressure, wind, precipitation, visibility, solar radiation, and UV conditions
- Monitor live and derived readings from meteorological sensors
- Explore an interactive Three.js weather-station scene with rain, snow, fog, and animated equipment
- View historical sensor data and system alerts
- Connect to external weather-station data through the backend API

## Tech stack

- React 18, TypeScript, Vite, Tailwind CSS, and Radix UI
- React Three Fiber and Three.js for 3D visualization
- Zustand and TanStack Query for application state and data fetching
- Express, PostgreSQL, Neon, and Drizzle ORM

## Getting started

### Prerequisites

- Node.js 20 or later
- npm
- PostgreSQL when using persistent database features

### Installation

```bash
git clone https://github.com/CPablo08/Meteorological-Simulator.git
cd Meteorological-Simulator
npm install
```

Set the environment variables required by your database and external weather data integrations. At minimum, database-backed features expect `DATABASE_URL`.

Start the development server:

```bash
npm run dev
```

## Useful commands

```bash
npm run dev      # Run the development server
npm run check    # Type-check the project
npm run build    # Build the frontend and backend
npm start        # Run the production build
npm run db:push  # Push the Drizzle schema to the database
```

## Project structure

```text
client/      React application, dashboards, controls, and 3D simulation
server/      Express API and application server
shared/      Shared schemas and types
migrations/  Database migrations
```

## License

This project is licensed under the MIT License.
