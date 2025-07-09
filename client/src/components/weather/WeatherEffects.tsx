import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useWeather } from '../../lib/stores/useWeather';

export function WeatherEffects() {
  const weather = useWeather();
  const rainRef = useRef<THREE.Points>(null);
  const snowRef = useRef<THREE.Points>(null);
  const fogRef = useRef<THREE.Mesh>(null);
  
  // Create rain particles
  const rainGeometry = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    const velocities = new Float32Array(2000 * 3);
    
    for (let i = 0; i < 2000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = Math.random() * 30 + 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
      
      velocities[i * 3] = (Math.random() - 0.5) * 0.2;
      velocities[i * 3 + 1] = -Math.random() * 0.5 - 0.5;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
    }
    
    return { positions, velocities };
  }, []);
  
  // Create snow particles
  const snowGeometry = useMemo(() => {
    const positions = new Float32Array(1000 * 3);
    const velocities = new Float32Array(1000 * 3);
    
    for (let i = 0; i < 1000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = Math.random() * 30 + 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
      
      velocities[i * 3] = (Math.random() - 0.5) * 0.1;
      velocities[i * 3 + 1] = -Math.random() * 0.2 - 0.1;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
    }
    
    return { positions, velocities };
  }, []);
  
  // Animate particles
  useFrame((state, delta) => {
    // Rain animation
    if (rainRef.current && weather.precipitationType === 'rain' && weather.precipitation > 0) {
      const positions = rainRef.current.geometry.attributes.position.array as Float32Array;
      const velocities = rainGeometry.velocities;
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += velocities[i] * delta * weather.windSpeed * 0.1;
        positions[i + 1] += velocities[i + 1] * delta * weather.precipitation * 2;
        positions[i + 2] += velocities[i + 2] * delta * weather.windSpeed * 0.1;
        
        // Reset particles that fall below ground
        if (positions[i + 1] < -1) {
          positions[i] = (Math.random() - 0.5) * 50;
          positions[i + 1] = Math.random() * 10 + 20;
          positions[i + 2] = (Math.random() - 0.5) * 50;
        }
      }
      
      rainRef.current.geometry.attributes.position.needsUpdate = true;
    }
    
    // Snow animation
    if (snowRef.current && weather.precipitationType === 'snow' && weather.precipitation > 0) {
      const positions = snowRef.current.geometry.attributes.position.array as Float32Array;
      const velocities = snowGeometry.velocities;
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += velocities[i] * delta * weather.windSpeed * 0.05;
        positions[i + 1] += velocities[i + 1] * delta * weather.precipitation;
        positions[i + 2] += velocities[i + 2] * delta * weather.windSpeed * 0.05;
        
        // Add some swaying motion
        positions[i] += Math.sin(state.clock.elapsedTime + i) * 0.01;
        positions[i + 2] += Math.cos(state.clock.elapsedTime + i) * 0.01;
        
        // Reset particles that fall below ground
        if (positions[i + 1] < -1) {
          positions[i] = (Math.random() - 0.5) * 50;
          positions[i + 1] = Math.random() * 10 + 20;
          positions[i + 2] = (Math.random() - 0.5) * 50;
        }
      }
      
      snowRef.current.geometry.attributes.position.needsUpdate = true;
    }
    
    // Fog opacity based on visibility
    if (fogRef.current) {
      const fogOpacity = Math.max(0, 1 - (weather.visibility / 10000));
      fogRef.current.material.opacity = fogOpacity * 0.8;
    }
  });
  
  return (
    <group>
      {/* Rain Particles */}
      {weather.precipitationType === 'rain' && weather.precipitation > 0 && (
        <Points ref={rainRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2000}
              array={rainGeometry.positions}
              itemSize={3}
            />
          </bufferGeometry>
          <PointMaterial
            color="#6699ff"
            size={0.1}
            transparent
            opacity={Math.min(0.7, weather.precipitation / 10)}
            vertexColors={false}
          />
        </Points>
      )}
      
      {/* Snow Particles */}
      {weather.precipitationType === 'snow' && weather.precipitation > 0 && (
        <Points ref={snowRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={1000}
              array={snowGeometry.positions}
              itemSize={3}
            />
          </bufferGeometry>
          <PointMaterial
            color="#ffffff"
            size={0.3}
            transparent
            opacity={Math.min(0.8, weather.precipitation / 10)}
            vertexColors={false}
          />
        </Points>
      )}
      
      {/* Fog Effect */}
      {weather.visibility < 10000 && (
        <mesh ref={fogRef} position={[0, 5, 0]}>
          <sphereGeometry args={[40, 32, 32]} />
          <meshBasicMaterial
            color="#999999"
            transparent
            opacity={0}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      
      {/* Wind Visualization */}
      {weather.windSpeed > 5 && (
        <group>
          {Array.from({ length: 20 }, (_, i) => (
            <mesh
              key={i}
              position={[
                (Math.random() - 0.5) * 40,
                Math.random() * 10 + 2,
                (Math.random() - 0.5) * 40
              ]}
              rotation={[0, (weather.windDirection * Math.PI) / 180, 0]}
            >
              <cylinderGeometry args={[0.02, 0.02, weather.windSpeed * 0.1]} />
              <meshBasicMaterial
                color="#ffffff"
                transparent
                opacity={0.3}
              />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}
