"use client";

import { useState, useEffect } from 'react';

export interface DeviceDetection {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLowEnd: boolean;
  shouldReduceMotion: boolean;
}

/**
 * Hook to detect device type and capabilities for adaptive rendering
 * 
 * @returns DeviceDetection object with device information
 * 
 * Features:
 * - Detects mobile, tablet, and desktop devices based on screen width
 * - Identifies low-end devices using CPU cores and memory
 * - Checks for user's reduced motion preference
 * - Updates on window resize
 */
export function useDeviceDetection(): DeviceDetection {
  const [deviceInfo, setDeviceInfo] = useState<DeviceDetection>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isLowEnd: false,
    shouldReduceMotion: false,
  });

  useEffect(() => {
    const detectDevice = () => {
      // Screen size detection using matchMedia
      const width = window.innerWidth;
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;

      // Low-end device detection
      // Check CPU cores (< 4 cores = potentially low-end)
      const cpuCores = navigator.hardwareConcurrency || 4;
      
      // Check memory if available (< 2GB = low-end)
      // @ts-ignore - deviceMemory is not in all TypeScript definitions
      const deviceMemory = navigator.deviceMemory || 4;
      
      // Consider device low-end if:
      // - Less than 4 CPU cores
      // - Less than 2GB RAM
      // - Mobile device with less than 4 cores
      const isLowEnd = 
        cpuCores < 4 || 
        deviceMemory < 2 || 
        (isMobile && cpuCores < 4);

      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      console.log('Device Detection:', {
        isMobile,
        isTablet,
        isDesktop,
        isLowEnd,
        shouldReduceMotion: prefersReducedMotion,
      });

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        isLowEnd,
        shouldReduceMotion: prefersReducedMotion,
      });
    };

    // Initial detection
    detectDevice();

    // Update on resize (debounced)
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(detectDevice, 150);
    };

    window.addEventListener('resize', handleResize);

    // Listen for reduced motion preference changes
    const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setDeviceInfo(prev => ({
        ...prev,
        shouldReduceMotion: e.matches,
      }));
    };

    // Modern browsers
    if (motionMediaQuery.addEventListener) {
      motionMediaQuery.addEventListener('change', handleMotionChange);
    } else {
      // Fallback for older browsers
      // @ts-ignore
      motionMediaQuery.addListener(handleMotionChange);
    }

    // Cleanup
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      
      if (motionMediaQuery.removeEventListener) {
        motionMediaQuery.removeEventListener('change', handleMotionChange);
      } else {
        // @ts-ignore
        motionMediaQuery.removeListener(handleMotionChange);
      }
    };
  }, []);

  return deviceInfo;
}

/**
 * Helper function to check if WebGL is supported
 * Used for feature detection before rendering Three.js content
 */
export function hasWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

/**
 * Get optimal settings based on device type
 * Returns recommended particle count and quality settings
 */
export function getDeviceOptimalSettings(device: DeviceDetection) {
  if (device.shouldReduceMotion) {
    return {
      particleCount: 0,
      enableAnimation: false,
      quality: 'none' as const,
    };
  }

  if (device.isMobile) {
    if (device.isLowEnd) {
      return {
        particleCount: 30,
        enableAnimation: true,
        quality: 'low' as const,
      };
    }
    return {
      particleCount: 60,
      enableAnimation: true,
      quality: 'medium' as const,
    };
  }

  if (device.isTablet) {
    return {
      particleCount: 90,
      enableAnimation: true,
      quality: 'medium' as const,
    };
  }

  // Desktop
  return {
    particleCount: 175,
    enableAnimation: true,
    quality: 'high' as const,
  };
}
