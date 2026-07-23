# Meteorological Station Simulator

An interactive, full-stack meteorological station simulator for configuring weather conditions, observing calculated sensor readings, exploring weather behavior in 3D, and connecting to live station data.

The project combines an operator-style dashboard with a configurable simulation engine. Users can change environmental parameters, see the resulting measurements in real time, inspect trends and alerts, and move through a rendered weather-station scene containing animated equipment and precipitation effects.

## Table of contents

- [Overview](#overview)
- [Core features](#core-features)
- [How the simulation works](#how-the-simulation-works)
- [Technology stack](#technology-stack)
- [Architecture](#architecture)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment configuration](#environment-configuration)
- [Available commands](#available-commands)
- [Development workflow](#development-workflow)
- [Production build](#production-build)
- [Troubleshooting](#troubleshooting)
- [Security notes](#security-notes)
- [Contributing](#contributing)
- [License](#license)

## Overview

Meteorological Station Simulator is designed as both a visual learning tool and a weather-monitoring interface. It supports two related workflows:

1. **Simulation mode** — enter weather conditions and observe how a virtual station and its sensors respond.
2. **Live-data mode** — connect the dashboard to an external meteorological station through the backend API.

The simulated environment includes control panels, sensor cards, charts, alerts, derived measurements, 3D equipment, and visual effects such as rain, snow, and fog.

## Core features

### Weather controls

The control interface supports parameters such as:

- Air temperature
- Relative humidity
- Atmospheric pressure
- Wind speed and direction
- Precipitation type and intensity
- Visibility
- Solar radiation
- UV index

Changes are reflected in the application state and are used to update sensor measurements and the rendered environment.

### Sensor dashboard

The dashboard presents a broad set of meteorological readings with:

- Live value updates
- Units and operational status
- Derived weather calculations
- Historical charts
- Warning and error states
- Sensor-health information

### Interactive 3D station

The application uses React Three Fiber and Three.js to render a weather-station scene featuring:

- A station mast and connected sensor equipment
- Anemometer and wind-vane animation
- Solar-panel and sensor models
- Camera navigation
- Rain, snow, and fog effects
- Weather-responsive scene behavior

### Live station integration

The server provides a boundary for external weather data so API credentials and upstream requests do not need to be handled directly in the browser. The interface can display station connectivity, update times, battery or signal details when available, and live environmental readings.

## How the simulation works

The main data flow is:

1. A user changes a weather parameter in the control interface.
2. The weather state is updated in a Zustand store.
3. Sensor calculation logic derives appropriate readings from the selected conditions.
4. Dashboard components subscribed to the stores re-render immediately.
5. Time-series values are retained for charts and trends.
6. The 3D scene reads the same state to animate equipment and weather effects.
7. Alerts and status indicators are calculated from the resulting readings.

This shared-state approach keeps the control panel, charts, sensors, and 3D scene synchronized.

## Technology stack

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Radix UI primitives
- Zustand
- TanStack Query
- React Three Fiber
- Three.js and Drei
- Recharts
- Wouter
- Framer Motion

### Backend and data

- Node.js
- Express
- TypeScript with ES modules
- PostgreSQL
- Neon serverless PostgreSQL driver
- Drizzle ORM and Drizzle Kit
- Express sessions

### Tooling

- TSX for development execution
- ESBuild for the production server bundle
- PostCSS and Autoprefixer
- Vite GLSL support for shader assets

## Architecture

The repository is a single full-stack TypeScript project.

### Client

The client is rooted at \`client/\`. Vite resolves \`@\` to \`client/src\` and \`@shared\` to the shared directory. The frontend contains the user interface, pages, weather simulation components, stores, hooks, charts, and 3D assets.

### Server

The Express application lives in \`server/\`. In development, Express integrates with Vite middleware. In production, it serves the compiled frontend from \`dist/public\` and runs the bundled server from \`dist/index.js\`.

### Shared code

The \`shared/\` directory contains schemas and types used across the client and server, reducing duplication at the API and persistence boundaries.

### Persistence

Drizzle provides typed database access and schema management. PostgreSQL is used for persistent features, while development-oriented in-memory behavior may be available for portions of the application.

## Project structure

\`\`\`text
.
├── client/
│   ├── src/
│   │   ├── components/     Reusable UI, dashboard, and weather components
│   │   ├── pages/          Application screens
│   │   ├── hooks/          Custom React hooks
│   │   └── lib/            Stores, calculations, utilities, and query setup
│   └── public/             Static frontend assets
├── server/
│   ├── index.ts            Server entry point
│   ├── routes.ts           API route registration
│   ├── storage.ts          Storage abstraction
│   └── vite.ts             Development/static frontend integration
├── shared/                 Shared schemas and TypeScript types
├── migrations/             Database migration assets
├── package.json
├── tsconfig.json
└── vite.config.ts
\`\`\`

## Getting started

### Prerequisites

Install:

- Node.js 20 or newer
- npm
- PostgreSQL for database-backed features

### Clone and install

\`\`\`bash
git clone https://github.com/CPablo08/Meteorological-Simulator.git
cd Meteorological-Simulator
npm install
\`\`\`

### Configure the environment

Create a local environment file or export variables through your shell. Do not commit secrets.

At minimum, database-backed operation expects:

\`\`\`dotenv
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
\`\`\`

External weather-station integrations may require additional provider-specific URLs, identifiers, or credentials depending on the configured route implementation.

### Prepare the database

\`\`\`bash
npm run db:push
\`\`\`

### Start development

\`\`\`bash
npm run dev
\`\`\`

Open the local URL printed by the server.

## Environment configuration

| Variable | Purpose | Required |
| --- | --- | --- |
| \`DATABASE_URL\` | PostgreSQL connection string used by Drizzle/database features | For persistent database use |
| \`NODE_ENV\` | Selects development or production server behavior | Set automatically by scripts |
| Provider-specific weather variables | Credentials and endpoints for live station data | Only for live integrations |

Keep production values in your deployment provider's secret manager.

## Available commands

| Command | Description |
| --- | --- |
| \`npm run dev\` | Start the TypeScript/Express development server with Vite |
| \`npm run check\` | Run the TypeScript compiler without emitting files |
| \`npm run build\` | Build the Vite frontend and bundle the Express server |
| \`npm start\` | Run the compiled production server |
| \`npm run db:push\` | Push the Drizzle schema to the configured database |

## Development workflow

Before opening a change:

\`\`\`bash
npm run check
npm run build
\`\`\`

When changing weather behavior, verify all affected views:

- The control retains the selected value
- Sensor readings update consistently
- Charts receive the intended values
- 3D effects turn on and off correctly
- Navigation does not reset simulation state unexpectedly

When changing shared schemas, update both client and server consumers and push the database schema if necessary.

## Production build

Create the compiled output:

\`\`\`bash
npm run build
\`\`\`

The build produces:

- Frontend assets in \`dist/public\`
- A bundled Node server in \`dist/index.js\`

Run it with:

\`\`\`bash
npm start
\`\`\`

The production environment must provide the database and integration variables used by the application.

## Troubleshooting

### The development server does not start

- Confirm Node.js and npm are installed.
- Delete and reinstall \`node_modules\` if dependencies are inconsistent.
- Run \`npm run check\` to locate TypeScript errors.
- Confirm the configured port is available.

### Database operations fail

- Verify \`DATABASE_URL\`.
- Confirm the database host is reachable.
- Ensure the database user has schema permissions.
- Run \`npm run db:push\` after schema changes.

### Weather effects do not match controls

- Verify both the precipitation type and amount.
- Check the weather and sensor Zustand stores.
- Confirm navigation is not recreating or resetting the store.
- Inspect the browser console for rendering or shader errors.

### 3D assets do not load

- Confirm model, audio, and shader files remain under Vite-supported asset paths.
- Check the browser network panel for missing \`.gltf\`, \`.glb\`, or GLSL files.
- Verify the asset path works from the production base URL.

### Live data does not refresh

- Confirm the backend can reach the upstream station service.
- Check provider credentials without logging their values.
- Inspect the backend response and browser network request.
- Verify the configured refresh interval and station identifier.

## Security notes

- Never expose weather-provider credentials in client-side code.
- Keep \`DATABASE_URL\`, session secrets, and API keys outside Git.
- Use TLS for production database and API connections.
- Restrict CORS and session settings for the deployed domain.
- Rotate any credential that has been committed or printed in logs.

## Contributing

1. Create a focused branch.
2. Make the change.
3. Run type checks and a production build.
4. Test the controls, dashboard, charts, and 3D view affected by the change.
5. Open a pull request explaining the user-visible behavior and verification performed.

## License

This project is licensed under the MIT License.
