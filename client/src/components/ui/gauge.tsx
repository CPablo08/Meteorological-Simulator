import React from 'react';
import { cn } from '@/lib/utils';

interface GaugeProps {
  value: number;
  min: number;
  max: number;
  label?: string;
  unit?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Gauge({ 
  value, 
  min, 
  max, 
  label, 
  unit, 
  className,
  size = 'md' 
}: GaugeProps) {
  const normalizedValue = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  
  const sizes = {
    sm: { width: 120, height: 120, strokeWidth: 8 },
    md: { width: 150, height: 150, strokeWidth: 10 },
    lg: { width: 200, height: 200, strokeWidth: 12 }
  };
  
  const { width, height, strokeWidth } = sizes[size];
  const radius = (width - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="relative">
        <svg width={width} height={height} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={width / 2}
            cy={height / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted/20"
          />
          {/* Progress circle */}
          <circle
            cx={width / 2}
            cy={height / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-primary transition-all duration-300"
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-foreground">
            {typeof value === 'number' ? value.toFixed(1) : value}
          </span>
          {unit && (
            <span className="text-sm text-muted-foreground">{unit}</span>
          )}
        </div>
      </div>
      
      {label && (
        <span className="mt-2 text-sm text-muted-foreground text-center">
          {label}
        </span>
      )}
    </div>
  );
}
