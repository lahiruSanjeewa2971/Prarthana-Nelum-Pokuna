import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Create a lotus petal shape geometry
 * Returns a custom shape that looks like a realistic lotus petal
 */
function createLotusPetalGeometry(): THREE.ShapeGeometry {
  const shape = new THREE.Shape();
  
  // Start at the bottom center (stem attachment point)
  shape.moveTo(0, -0.75);
  
  // Left side of petal - curved outward
  shape.bezierCurveTo(
    -0.3, -0.5,  // Control point 1
    -0.5, 0,     // Control point 2
    -0.35, 0.5   // End point (widest part)
  );
  
  // Curve to the pointed tip
  shape.bezierCurveTo(
    -0.25, 0.65, // Control point 1
    -0.1, 0.72,  // Control point 2
    0, 0.75      // Tip of petal
  );
  
  // Right side of petal - mirror of left
  shape.bezierCurveTo(
    0.1, 0.72,   // Control point 1
    0.25, 0.65,  // Control point 2
    0.35, 0.5    // Widest part
  );
  
  // Curve back to stem
  shape.bezierCurveTo(
    0.5, 0,      // Control point 1
    0.3, -0.5,   // Control point 2
    0, -0.75     // Back to stem
  );
  
  return new THREE.ShapeGeometry(shape);
}

// Theme colors for petals
export const PETAL_COLORS = {
  primary: '#E6B7B0',    // Subtle rose (60% of petals)
  secondary: '#FFFFFF',   // White (30% of petals)
  accent: '#C8A951',      // Gold tint (10% of petals)
} as const;

export interface PetalProps {
  initialPosition: [number, number, number];
  scale: number;
  color?: string;
  opacity?: number;
  driftSpeed?: number;
  swaySpeed?: number;
  rotationSpeed?: [number, number, number];
  swayAmplitude?: number;
  spreadBounds: {
    x: number;
    y: number;
    z: number;
  };
}

/**
 * Individual lotus petal component
 * Uses simple plane geometry for optimal performance
 * 
 * Features:
 * - Smooth downward drift (gravity simulation)
 * - Side-to-side sway using sine wave
 * - Continuous gentle rotation
 * - Automatic reset when off-screen (seamless loop)
 */
export function Petal({
  initialPosition,
  scale,
  color = PETAL_COLORS.primary,
  opacity = 0.7,
  driftSpeed = 0.012,
  swaySpeed = 0.002,
  rotationSpeed = [0.001, 0.002, 0.001],
  swayAmplitude = 1.5,
  spreadBounds,
}: PetalProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create lotus petal geometry once
  const petalGeometry = useMemo(() => createLotusPetalGeometry(), []);
  
  // Store initial state for reset
  const initialState = useMemo(() => ({
    position: [...initialPosition] as [number, number, number],
    offset: Math.random() * Math.PI * 2, // Random phase offset for sway variation
  }), [initialPosition]);

  // Animation loop
  useFrame((state) => {
    if (!meshRef.current) return;

    const mesh = meshRef.current;
    const time = state.clock.getElapsedTime();

    // Apply downward drift (gravity)
    mesh.position.y -= driftSpeed;

    // Apply side-to-side sway (sine wave)
    const swayOffset = Math.sin(time * swaySpeed + initialState.offset) * swayAmplitude;
    mesh.position.x = initialState.position[0] + swayOffset * 0.3;
    mesh.position.z = initialState.position[2] + swayOffset * 0.2;

    // Apply continuous rotation (gentle tumble)
    mesh.rotation.x += rotationSpeed[0];
    mesh.rotation.y += rotationSpeed[1];
    mesh.rotation.z += rotationSpeed[2];

    // Reset position when petal goes off-screen (below viewport)
    if (mesh.position.y < -spreadBounds.y - 5) {
      // Reset to top with slight randomization
      mesh.position.y = spreadBounds.y + Math.random() * 5;
      mesh.position.x = initialState.position[0] + (Math.random() - 0.5) * spreadBounds.x * 0.5;
      mesh.position.z = initialState.position[2] + (Math.random() - 0.5) * spreadBounds.z * 0.3;
      
      // Reset rotation for variety
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={initialPosition}
      scale={scale}
      rotation={[
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      ]}
    >
      {/* Custom lotus petal shape geometry */}
      <primitive object={petalGeometry} />
      
      {/* MeshBasicMaterial - no lighting calculations = better performance */}
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide} // Visible from both sides
        depthWrite={false} // Prevents z-fighting with overlapping petals
      />
    </mesh>
  );
}

/**
 * Helper function to get random petal color based on distribution
 * 60% subtle rose, 30% white, 10% gold
 */
export function getRandomPetalColor(): string {
  const rand = Math.random();
  
  if (rand < 0.6) {
    return PETAL_COLORS.primary; // 60% - Subtle rose
  } else if (rand < 0.9) {
    return PETAL_COLORS.secondary; // 30% - White
  } else {
    return PETAL_COLORS.accent; // 10% - Gold
  }
}

/**
 * Helper function to generate random petal properties
 * Returns randomized configuration for natural variation
 */
export function getRandomPetalProps(
  spreadBounds: { x: number; y: number; z: number },
  particleSize: { min: number; max: number }
) {
  return {
    initialPosition: [
      (Math.random() - 0.5) * spreadBounds.x,
      (Math.random() - 0.5) * spreadBounds.y + spreadBounds.y * 0.5,
      (Math.random() - 0.5) * spreadBounds.z,
    ] as [number, number, number],
    scale: particleSize.min + Math.random() * (particleSize.max - particleSize.min),
    color: getRandomPetalColor(),
    opacity: 0.5 + Math.random() * 0.3, // 0.5 - 0.8
    driftSpeed: 0.008 + Math.random() * 0.008, // 0.008 - 0.016 (faster falling)
    swaySpeed: 0.001 + Math.random() * 0.002, // 0.001 - 0.003
    rotationSpeed: [
      (Math.random() - 0.5) * 0.002,
      (Math.random() - 0.5) * 0.003,
      (Math.random() - 0.5) * 0.002,
    ] as [number, number, number],
    swayAmplitude: 1.0 + Math.random() * 1.0, // 1.0 - 2.0
  };
}
