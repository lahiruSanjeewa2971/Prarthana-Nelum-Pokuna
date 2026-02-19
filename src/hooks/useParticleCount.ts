"use client";

import { useState, useEffect, useMemo } from 'react';
import { useDeviceDetection } from './useDeviceDetection';

export interface ParticleConfig {
  count: number;
  spreadArea: {
    x: number;
    y: number;
    z: number;
  };
  particleSize: {
    min: number;
    max: number;
  };
  cameraFOV: number;
  dpr: number;
  antialias: boolean;
}

/**
 * Hook to calculate optimal particle count and configuration based on device
 * 
 * @returns ParticleConfig object with count and spread area
 * 
 * Features:
 * - Adaptive particle count based on device type and capabilities
 * - Responsive spread area calculations
 * - Debounced resize handling (300ms)
 * - Returns complete particle configuration
 */
export function useParticleCount(): ParticleConfig {
  const deviceInfo = useDeviceDetection();
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Update window size on mount and resize
  useEffect(() => {
    const updateSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Initial size
    updateSize();

    // Debounced resize handler (300ms)
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

  // Calculate particle configuration based on device
  const particleConfig = useMemo((): ParticleConfig => {
    // If reduced motion is preferred, return zero particles
    if (deviceInfo.shouldReduceMotion) {
      return {
        count: 0,
        spreadArea: { x: 0, y: 0, z: 0 },
        particleSize: { min: 0, max: 0 },
        cameraFOV: 50,
        dpr: 1,
        antialias: false,
      };
    }

    // Calculate aspect ratio
    const aspectRatio = windowSize.width > 0 ? windowSize.width / windowSize.height : 16 / 9;

    // Mobile Low-End Configuration
    if (deviceInfo.isMobile && deviceInfo.isLowEnd) {
      const cameraPos = getCameraPosition(windowSize.width);
      const bounds = getSpreadBounds(60, cameraPos[2], aspectRatio);
      return {
        count: Math.floor(30 + Math.random() * 10), // 30-40 particles
        spreadArea: { 
          x: bounds.width * 1.2, // 120% of visible width for edge coverage
          y: bounds.height * 1.2, 
          z: 8 
        },
        particleSize: { min: 0.3, max: 0.5 },
        cameraFOV: 60,
        dpr: 1,
        antialias: false,
      };
    }

    // Mobile (High-end) Configuration
    if (deviceInfo.isMobile) {
      const cameraPos = getCameraPosition(windowSize.width);
      const bounds = getSpreadBounds(60, cameraPos[2], aspectRatio);
      return {
        count: Math.floor(50 + Math.random() * 25), // 50-75 particles
        spreadArea: { 
          x: bounds.width * 1.2,
          y: bounds.height * 1.2, 
          z: 10 
        },
        particleSize: { min: 0.3, max: 0.6 },
        cameraFOV: 60,
        dpr: 1,
        antialias: false,
      };
    }

    // Tablet Configuration
    if (deviceInfo.isTablet) {
      const cameraPos = getCameraPosition(windowSize.width);
      const bounds = getSpreadBounds(55, cameraPos[2], aspectRatio);
      return {
        count: Math.floor(75 + Math.random() * 25), // 75-100 particles
        spreadArea: { 
          x: bounds.width * 1.2,
          y: bounds.height * 1.2, 
          z: 12 
        },
        particleSize: { min: 0.4, max: 0.7 },
        cameraFOV: 55,
        dpr: 1.5,
        antialias: false,
      };
    }

    // Laptop Configuration (1024px - 1279px)
    if (deviceInfo.isDesktop && windowSize.width < 1280) {
      const cameraPos = getCameraPosition(windowSize.width);
      const bounds = getSpreadBounds(50, cameraPos[2], aspectRatio);
      return {
        count: Math.floor(100 + Math.random() * 50), // 100-150 particles
        spreadArea: { 
          x: bounds.width * 1.2,
          y: bounds.height * 1.2, 
          z: 16 
        },
        particleSize: { min: 0.4, max: 0.8 },
        cameraFOV: 50,
        dpr: 2,
        antialias: true,
      };
    }

    // Desktop Configuration (1280px+)
    const cameraPos = getCameraPosition(windowSize.width);
    const bounds = getSpreadBounds(50, cameraPos[2], aspectRatio);
    return {
      count: Math.floor(150 + Math.random() * 50), // 150-200 particles
      spreadArea: { 
        x: bounds.width * 1.2, // 120% for edge coverage
        y: bounds.height * 1.2, 
        z: 20 
      },
      particleSize: { min: 0.5, max: 1.0 },
      cameraFOV: 50,
      dpr: 2,
      antialias: true,
    };
  }, [deviceInfo, windowSize.width, windowSize.height]);

  return particleConfig;
}

/**
 * Get camera position based on screen width
 * Adjusts camera distance for optimal particle viewing
 */
export function getCameraPosition(screenWidth: number): [number, number, number] {
  if (screenWidth < 768) {
    return [0, 0, 18]; // Mobile: farther back
  }
  if (screenWidth < 1024) {
    return [0, 0, 16]; // Tablet: medium distance
  }
  return [0, 0, 15]; // Desktop: closer for more immersive effect
}

/**
 * Calculate spread bounds based on camera frustum and screen size
 * Returns the visible bounds for particle distribution
 */
export function getSpreadBounds(
  cameraFOV: number,
  cameraDistance: number,
  aspectRatio: number
) {
  // Calculate visible height at camera distance using FOV
  const vFOV = (cameraFOV * Math.PI) / 180; // Convert to radians
  const visibleHeight = 2 * Math.tan(vFOV / 2) * cameraDistance;
  const visibleWidth = visibleHeight * aspectRatio;

  return {
    width: visibleWidth,
    height: visibleHeight,
  };
}
