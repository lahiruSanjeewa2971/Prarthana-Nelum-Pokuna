"use client";

import { Canvas } from '@react-three/fiber';
import { LotusParticles } from './LotusParticles';
import { useParticleCount, getCameraPosition } from '@/hooks/useParticleCount';
import { useState, useEffect } from 'react';

/**
 * Particle Canvas Component
 * Three.js Canvas wrapper with responsive settings and adaptive configuration
 * 
 * Features:
 * - Responsive camera positioning based on screen size
 * - Adaptive device pixel ratio (dpr) for performance
 * - Conditional antialiasing (desktop only)
 * - Transparent background to overlay on hero section
 * - Pointer events disabled for click-through to buttons
 * - Optimal z-index layering
 */
export function ParticleCanvas() {
  const particleConfig = useParticleCount();
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [mounted, setMounted] = useState(false);

  // Update window size for camera positioning
  useEffect(() => {
    setMounted(true);
    
    const updateSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateSize();

    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateSize, 300);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Don't render until mounted (prevents hydration mismatch)
  if (!mounted || particleConfig.count === 0) {
    return null;
  }

  // Get adaptive camera position based on screen width
  const cameraPosition = getCameraPosition(windowSize.width);

  return (
    <div 
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    >
      <Canvas
        camera={{
          position: cameraPosition,
          fov: particleConfig.cameraFOV,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: particleConfig.antialias, // Only on desktop for performance
          alpha: true, // Transparent background
          powerPreference: 'high-performance', // Request high-performance GPU
        }}
        dpr={[1, particleConfig.dpr]} // [min, max] device pixel ratio
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none', // Allow clicking through to hero content
        }}
      >
        {/* Ambient lighting (optional, for future enhancements) */}
        {/* <ambientLight intensity={0.5} /> */}
        
        {/* Lotus Particles System */}
        <LotusParticles />
      </Canvas>
    </div>
  );
}

/**
 * Configuration Summary by Device:
 * 
 * Desktop (1280px+):
 * - Camera: [0, 0, 15] (closer)
 * - FOV: 50°
 * - DPR: 2 (Retina)
 * - Antialias: true
 * - Particles: 150-200
 * 
 * Laptop (1024px - 1279px):
 * - Camera: [0, 0, 15] (closer)
 * - FOV: 50°
 * - DPR: 2
 * - Antialias: true
 * - Particles: 100-150
 * 
 * Tablet (768px - 1023px):
 * - Camera: [0, 0, 16] (medium)
 * - FOV: 55°
 * - DPR: 1.5
 * - Antialias: false
 * - Particles: 75-100
 * 
 * Mobile (< 768px):
 * - Camera: [0, 0, 18] (farther back for better coverage)
 * - FOV: 60°
 * - DPR: 1
 * - Antialias: false
 * - Particles: 30-75
 * 
 * Performance Features:
 * - SSR safe (doesn't render until mounted)
 * - Automatic cleanup on unmount
 * - Debounced resize handling
 * - Returns null for reduced motion preference
 * - Returns null for zero particle count
 */
