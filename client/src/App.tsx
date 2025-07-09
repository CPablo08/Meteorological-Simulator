import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navigation } from './components/ui/navigation';
import { ControlPage } from './pages/ControlPage';
import { SimulationPage } from './pages/SimulationPage';
import { DashboardPage } from './pages/DashboardPage';
import { RealtimePage } from './pages/RealtimePage';
import '@fontsource/inter';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

type PageType = 'control' | 'simulation' | 'dashboard' | 'realtime';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('control');

  useEffect(() => {
    // Start the weather simulation immediately
    console.log('Meteorological Station Simulator initialized');
  }, []);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'control':
        return <ControlPage />;
      case 'simulation':
        return <SimulationPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'realtime':
        return <RealtimePage />;
      default:
        return <ControlPage />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-background text-foreground">
        <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
        <main className="pt-16">
          {renderCurrentPage()}
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;
