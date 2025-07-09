import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useWeather } from '../../lib/stores/useWeather';

export function MeteorologicalStation() {
  const weather = useWeather();
  const stationRef = useRef<THREE.Group>(null);
  const anemometerRef = useRef<THREE.Group>(null);
  const windVaneRef = useRef<THREE.Group>(null);
  const solarPanelRef = useRef<THREE.Group>(null);
  
  // Load 3D models
  const { scene: stationModel } = useGLTF('/models/weather-station.glb');
  const { scene: anemometerModel } = useGLTF('/models/anemometer.glb');
  const { scene: windVaneModel } = useGLTF('/models/wind-vane.glb');
  
  // Animate rotating components
  useFrame((state, delta) => {
    if (anemometerRef.current) {
      anemometerRef.current.rotation.y += (weather.windSpeed / 100) * delta * 10;
    }
    
    if (windVaneRef.current) {
      windVaneRef.current.rotation.y = THREE.MathUtils.lerp(
        windVaneRef.current.rotation.y,
        (weather.windDirection * Math.PI) / 180,
        delta * 2
      );
    }
    
    if (solarPanelRef.current) {
      // Solar panel tracks the sun (simplified)
      const time = state.clock.getElapsedTime() * 0.1;
      solarPanelRef.current.rotation.x = Math.sin(time) * 0.3;
      solarPanelRef.current.rotation.y = Math.cos(time) * 0.2;
    }
  });

  return (
    <group ref={stationRef} position={[0, 0, 0]}>
      {/* Main Station Base */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 1]} />
        <meshStandardMaterial color="#444" />
      </mesh>
      
      {/* Vertical Mast */}
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 3]} />
        <meshStandardMaterial color="#666" />
      </mesh>
      
      {/* Anemometer (Wind Speed Sensor) */}
      <group ref={anemometerRef} position={[0, 3.5, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.1]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        {/* Anemometer cups */}
        {[0, 1, 2].map((i) => (
          <group key={i} rotation={[0, (i * Math.PI * 2) / 3, 0]}>
            <mesh position={[0.15, 0, 0]} castShadow>
              <sphereGeometry args={[0.03]} />
              <meshStandardMaterial color="#ff4444" />
            </mesh>
            <mesh position={[0.1, 0, 0]} castShadow>
              <cylinderGeometry args={[0.005, 0.005, 0.1]} />
              <meshStandardMaterial color="#333" />
            </mesh>
          </group>
        ))}
      </group>
      
      {/* Wind Vane (Wind Direction Sensor) */}
      <group ref={windVaneRef} position={[0, 3.2, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.05]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        {/* Wind vane arrow */}
        <mesh position={[0.1, 0, 0]} castShadow>
          <coneGeometry args={[0.02, 0.08]} />
          <meshStandardMaterial color="#44ff44" />
        </mesh>
        <mesh position={[-0.1, 0, 0]} castShadow>
          <boxGeometry args={[0.06, 0.04, 0.01]} />
          <meshStandardMaterial color="#44ff44" />
        </mesh>
      </group>
      
      {/* Temperature Sensor with Radiation Shield */}
      <group position={[0.5, 2.5, 0]}>
        {/* Connecting pole from main mast */}
        <mesh position={[-0.25, -0.5, 0]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 1]} />
          <meshStandardMaterial color="#666" />
        </mesh>
        {/* Horizontal arm */}
        <mesh position={[-0.25, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.008, 0.008, 0.5]} />
          <meshStandardMaterial color="#666" />
        </mesh>
        
        <mesh castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.3]} />
          <meshStandardMaterial color="#ddd" />
        </mesh>
        {/* Radiation shield slats */}
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} position={[0, 0.1 - i * 0.05, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.16, 0.02]} />
            <meshStandardMaterial color="#eee" />
          </mesh>
        ))}
        {/* Temperature sensor inside */}
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.2]} />
          <meshStandardMaterial color="#ff6666" />
        </mesh>
      </group>
      
      {/* Humidity Sensor */}
      <group position={[-0.5, 2.5, 0]}>
        {/* Connecting pole from main mast */}
        <mesh position={[0.25, -0.5, 0]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 1]} />
          <meshStandardMaterial color="#666" />
        </mesh>
        {/* Horizontal arm */}
        <mesh position={[0.25, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.008, 0.008, 0.5]} />
          <meshStandardMaterial color="#666" />
        </mesh>
        
        <mesh castShadow>
          <boxGeometry args={[0.1, 0.1, 0.05]} />
          <meshStandardMaterial color="#4444ff" />
        </mesh>
        <mesh position={[0, 0.1, 0]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.1]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </group>
      
      {/* Pressure Sensor */}
      <group position={[0, 1.8, 0.5]}>
        {/* Connecting pole from main mast */}
        <mesh position={[0, -0.8, -0.5]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 1.6]} />
          <meshStandardMaterial color="#666" />
        </mesh>
        {/* Horizontal arm */}
        <mesh position={[0, 0, -0.25]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.008, 0.008, 0.5]} />
          <meshStandardMaterial color="#666" />
        </mesh>
        
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.1]} />
          <meshStandardMaterial color="#666" />
        </mesh>
        <mesh position={[0, 0.1, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.05]} />
          <meshStandardMaterial color="#888" />
        </mesh>
      </group>
      
      {/* Rain Gauge */}
      <group position={[1, 1.5, 0]}>
        {/* Connecting pole from base */}
        <mesh position={[-0.5, -0.5, 0]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 1]} />
          <meshStandardMaterial color="#666" />
        </mesh>
        {/* Horizontal arm */}
        <mesh position={[-0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.008, 0.008, 1]} />
          <meshStandardMaterial color="#666" />
        </mesh>
        
        <mesh castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.3]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        <mesh position={[0, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.02]} />
          <meshStandardMaterial color="#444" />
        </mesh>
      </group>
      
      {/* Tipping Bucket Rain Gauge */}
      <group position={[1, 1, 0]}>
        {/* Connecting pole from base */}
        <mesh position={[-0.5, -0.5, 0]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 1]} />
          <meshStandardMaterial color="#666" />
        </mesh>
        {/* Horizontal arm */}
        <mesh position={[-0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.008, 0.008, 1]} />
          <meshStandardMaterial color="#666" />
        </mesh>
        
        <mesh castShadow>
          <boxGeometry args={[0.2, 0.1, 0.2]} />
          <meshStandardMaterial color="#555" />
        </mesh>
        {/* Tipping mechanism */}
        <mesh position={[0, 0.1, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.15]} />
          <meshStandardMaterial color="#666" />
        </mesh>
      </group>
      
      {/* Solar Radiation Sensor */}
      <group ref={solarPanelRef} position={[0, 4, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.2, 0.02, 0.2]} />
          <meshStandardMaterial color="#001122" />
        </mesh>
        <mesh position={[0, 0.02, 0]} castShadow>
          <boxGeometry args={[0.18, 0.01, 0.18]} />
          <meshStandardMaterial color="#002244" />
        </mesh>
      </group>
      
      {/* UV Sensor */}
      <group position={[0.3, 4, 0]}>
        {/* Connecting pole from main mast */}
        <mesh position={[-0.15, -1, 0]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 2]} />
          <meshStandardMaterial color="#666" />
        </mesh>
        {/* Horizontal arm */}
        <mesh position={[-0.15, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.008, 0.008, 0.3]} />
          <meshStandardMaterial color="#666" />
        </mesh>
        
        <mesh castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.08]} />
          <meshStandardMaterial color="#8844ff" />
        </mesh>
        <mesh position={[0, 0.05, 0]} castShadow>
          <sphereGeometry args={[0.02]} />
          <meshStandardMaterial color="#aa66ff" />
        </mesh>
      </group>
      
      {/* Data Logger Box */}
      <group position={[0, 1.2, 0.8]}>
        {/* Connecting pole from main mast */}
        <mesh position={[0, -0.2, -0.8]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.4]} />
          <meshStandardMaterial color="#666" />
        </mesh>
        {/* Horizontal arm */}
        <mesh position={[0, 0, -0.4]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.008, 0.008, 0.8]} />
          <meshStandardMaterial color="#666" />
        </mesh>
        
        <mesh castShadow>
          <boxGeometry args={[0.4, 0.3, 0.2]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        {/* LED indicators */}
        <mesh position={[-0.15, 0.1, 0.11]} castShadow>
          <sphereGeometry args={[0.01]} />
          <meshStandardMaterial color="#00ff00" emissive="#004400" />
        </mesh>
        <mesh position={[0, 0.1, 0.11]} castShadow>
          <sphereGeometry args={[0.01]} />
          <meshStandardMaterial color="#ffff00" emissive="#444400" />
        </mesh>
        <mesh position={[0.15, 0.1, 0.11]} castShadow>
          <sphereGeometry args={[0.01]} />
          <meshStandardMaterial color="#ff0000" emissive="#440000" />
        </mesh>
      </group>
      
      {/* Communication Antenna */}
      <group position={[0, 4.5, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.5]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
        <mesh position={[0, 0.3, 0]} castShadow>
          <sphereGeometry args={[0.03]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
      </group>
      
      {/* Ground Sensors */}
      <group position={[0, -0.3, 1.5]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.4]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        <mesh position={[0, -0.1, 0]} castShadow>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial color="#444" />
        </mesh>
      </group>
    </group>
  );
}
