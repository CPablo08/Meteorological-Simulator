import React from 'react';
import { Button } from './button';
import { Card } from './card';
import { Cloud, Settings, BarChart3, Radio } from 'lucide-react';

interface NavigationProps {
  currentPage: 'control' | 'simulation' | 'dashboard';
  onPageChange: (page: 'control' | 'simulation' | 'dashboard') => void;
}

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const pages = [
    { id: 'control', label: 'Control', icon: Settings },
    { id: 'simulation', label: 'Simulation', icon: Cloud },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  ] as const;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">Meteorological Station Simulator</h1>
          </div>
          
          <div className="flex items-center gap-2">
            {pages.map((page) => {
              const Icon = page.icon;
              return (
                <Button
                  key={page.id}
                  variant={currentPage === page.id ? 'default' : 'ghost'}
                  onClick={() => onPageChange(page.id)}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {page.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
