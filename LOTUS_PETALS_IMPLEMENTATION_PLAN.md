# Floating Lotus Petals - Complete Implementation Plan

## 📋 Project Overview
Implement an elegant floating lotus petals effect using Three.js in the Hero Section. The effect will overlay the existing background image with 3D particles that drift gently across the screen, enhancing the "Nelum Pokuna" (Lotus Pond) theme.

---

## 🎯 Goals & Requirements

### Primary Goals
- ✅ Add subtle, elegant floating lotus petal particles to hero section
- ✅ Maintain 60 FPS on desktop, 30+ FPS on mobile
- ✅ Preserve existing Framer Motion text animations
- ✅ Keep bundle size under 50KB for the effect
- ✅ Fully responsive across all screen sizes

### Performance Targets
- **Desktop**: 100-200 particles, 60 FPS
- **Tablet**: 75-100 particles, 45-60 FPS
- **Mobile**: 50-75 particles, 30-45 FPS
- **Low-end devices**: Graceful fallback or disable

---

## 📦 Dependencies to Install

```bash
npm install three @react-three/fiber @react-three/drei
```

### Package Details
- `three`: Core Three.js library (~150KB)
- `@react-three/fiber`: React renderer for Three.js (~45KB)
- `@react-three/drei`: Helper components (~30KB tree-shakeable)

**Total Bundle Impact**: ~45KB gzipped (only Three.js essentials)

---

## 🏗️ File Structure

```
src/
├── components/
│   ├── sections/
│   │   ├── HeroSection.tsx (existing - will be modified)
│   │   └── HeroSectionWithPetals.tsx (new - enhanced version)
│   └── three/
│       ├── LotusParticles.tsx (new - main particle component)
│       ├── Petal.tsx (new - individual petal geometry)
│       └── ParticleCanvas.tsx (new - Three.js canvas wrapper)
├── hooks/
│   ├── useDeviceDetection.ts (new - detect device type)
│   └── useParticleCount.ts (new - adaptive particle count)
└── lib/
    └── three-utils.ts (new - helper functions)
```

---

## 📝 Implementation Steps

### **Phase 1: Setup & Dependencies** (10 mins)

#### Step 1.1: Install Dependencies
```bash
npm install three @react-three/fiber @react-three/drei
```

#### Step 1.2: Verify Installation
Check that packages are in package.json and types are available.

---

### **Phase 2: Device Detection Hook** (15 mins)

#### Step 2.1: Create useDeviceDetection Hook
**File**: `src/hooks/useDeviceDetection.ts`

**Purpose**: Detect device type and capabilities for adaptive rendering.

**Features**:
- Detect mobile, tablet, desktop
- Check for low-end devices (< 2GB RAM, < 4 cores)
- Use `window.matchMedia` for screen size
- Use `navigator.hardwareConcurrency` for CPU cores
- Return optimal settings for each device type

**Return Type**:
```typescript
{
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLowEnd: boolean;
  shouldReduceMotion: boolean; // prefers-reduced-motion
}
```

---

### **Phase 3: Adaptive Particle Count Hook** (10 mins)

#### Step 3.1: Create useParticleCount Hook
**File**: `src/hooks/useParticleCount.ts`

**Purpose**: Calculate optimal particle count based on device.

**Logic**:
```typescript
Desktop: 150-200 particles
Tablet: 75-100 particles
Mobile (high-end): 50-75 particles
Mobile (low-end): 30-50 particles
Reduced motion: 0 particles (disabled)
```

**Additional Features**:
- Listen to window resize events
- Debounce resize handler (300ms)
- Return particle count and spread area

---

### **Phase 4: Petal Geometry Component** (20 mins)

#### Step 4.1: Create Petal Component
**File**: `src/components/three/Petal.tsx`

**Purpose**: Individual lotus petal with geometry and animation.

**Geometry Options**:
1. **Simple Plane** (lightest, ~10 vertices)
   - Flat plane with petal texture
   - Alpha transparency for petal shape
   
2. **Custom Geometry** (medium, ~50 vertices)
   - Oval shape with slight curve
   - More realistic but heavier

**Recommendation**: Use simple plane with texture for performance.

**Material**:
```typescript
- MeshBasicMaterial (no lighting calculation = faster)
- Texture: Petal PNG with transparency
- Color: Tinted based on theme (pink/white/subtle teal)
- Opacity: 0.6-0.8 for subtle effect
- Side: DoubleSide (visible from both angles)
```

**Animation Properties**:
```typescript
{
  position: [x, y, z],
  rotation: [x, y, z],
  velocity: { x, y, z },
  rotationSpeed: { x, y, z },
  scale: 0.3-0.8 (random variation)
}
```

**Movement Pattern**:
- Slow drift downward (gravity)
- Gentle side-to-side sway (sine wave)
- Random rotation on all axes
- Reset position when off-screen (loop)

---

### **Phase 5: Particle System Component** (30 mins)

#### Step 5.1: Create LotusParticles Component
**File**: `src/components/three/LotusParticles.tsx`

**Purpose**: Manage all petals, handle updates, and animations.

**Key Features**:

1. **Particle Initialization**:
   ```typescript
   - Create array of particle data
   - Random initial positions across screen bounds
   - Staggered starting positions (depth)
   - Random velocities and rotation speeds
   ```

2. **Animation Loop** (useFrame hook):
   ```typescript
   - Update each petal position every frame
   - Apply drift physics:
     * Gravity: slow downward motion
     * Wind: sine wave horizontal movement
     * Rotation: continuous gentle spin
   - Boundary check: reset particles that exit screen
   ```

3. **Responsive Bounds**:
   ```typescript
   Desktop: Full viewport width × height
   Mobile: Viewport width × height (adjusted for safe area)
   
   Spread area calculation:
   - Camera frustum based on screen size
   - Particles distributed in 3D space (-10 to 10 on Z-axis)
   ```

4. **Performance Optimization**:
   ```typescript
   - Use instanced meshes if particle count > 100
   - Frustum culling (only render visible particles)
   - LOD: Reduce geometry detail for distant particles
   ```

---

### **Phase 6: Canvas Wrapper Component** (20 mins)

#### Step 6.1: Create ParticleCanvas Component
**File**: `src/components/three/ParticleCanvas.tsx`

**Purpose**: Three.js <Canvas> wrapper with responsive settings.

**Canvas Configuration**:
```typescript
<Canvas
  camera={{
    position: [0, 0, 15],
    fov: 50, // Narrower on mobile (40) for better performance
    near: 0.1,
    far: 100
  }}
  gl={{
    antialias: isDesktop, // Only on desktop for performance
    alpha: true, // Transparent background
    powerPreference: "high-performance"
  }}
  dpr={[1, isDesktop ? 2 : 1.5]} // Pixel ratio: lower on mobile
  className="absolute inset-0 pointer-events-none"
  style={{ zIndex: 1 }}
>
```

**Responsive Camera Adjustment**:
- Desktop: Default FOV (50°)
- Tablet: Slightly wider FOV (55°)
- Mobile: Adjusted FOV (60°) for better coverage

**Features**:
- `pointer-events-none`: Allows clicking through to buttons
- Absolute positioning to overlay background
- Z-index management (between background and text)

---

### **Phase 7: Hero Section Integration** (25 mins)

#### Step 7.1: Update HeroSection Component
**File**: `src/components/sections/HeroSection.tsx`

**Changes**:

1. **Import ParticleCanvas**:
   ```typescript
   import { ParticleCanvas } from '@/components/three/ParticleCanvas';
   import { useDeviceDetection } from '@/hooks/useDeviceDetection';
   ```

2. **Add Device Detection**:
   ```typescript
   const { shouldReduceMotion, isLowEnd } = useDeviceDetection();
   const showParticles = !shouldReduceMotion && !isLowEnd;
   ```

3. **Layer Structure** (Z-index management):
   ```typescript
   Layer 0 (z-index: 0): Static background image (existing)
   Layer 1 (z-index: 1): ParticleCanvas with petals (new)
   Layer 2 (z-index: 10): Text content with Framer Motion (existing)
   Layer 3 (z-index: 20): CTA Buttons (existing)
   ```

4. **Conditional Rendering**:
   ```typescript
   {showParticles && (
     <ParticleCanvas />
   )}
   ```

5. **Fallback Handling**:
   - If three.js fails to load: Show only existing background
   - Use error boundary to catch rendering errors
   - Log errors but don't break page

---

### **Phase 8: Responsive Design Strategy** (15 mins)

#### Breakpoint Configurations

**Desktop (1280px+)**:
```typescript
{
  particleCount: 150-200,
  particleSize: 0.5-1.0,
  cameraFOV: 50,
  dpr: 2, // Retina
  antialias: true,
  spread: { x: 20, y: 15, z: 20 }
}
```

**Laptop (1024px - 1279px)**:
```typescript
{
  particleCount: 100-150,
  particleSize: 0.4-0.8,
  cameraFOV: 50,
  dpr: 2,
  antialias: true,
  spread: { x: 16, y: 12, z: 16 }
}
```

**Tablet (768px - 1023px)**:
```typescript
{
  particleCount: 75-100,
  particleSize: 0.4-0.7,
  cameraFOV: 55,
  dpr: 1.5,
  antialias: false,
  spread: { x: 12, y: 10, z: 12 }
}
```

**Mobile (< 768px)**:
```typescript
{
  particleCount: 50-75,
  particleSize: 0.3-0.6,
  cameraFOV: 60,
  dpr: 1,
  antialias: false,
  spread: { x: 8, y: 8, z: 10 }
}
```

**Mobile Low-End**:
```typescript
{
  particleCount: 30-40,
  particleSize: 0.3-0.5,
  cameraFOV: 60,
  dpr: 1,
  antialias: false,
  spread: { x: 8, y: 8, z: 8 }
}
```

#### Responsive Camera Positioning
```typescript
const getCameraPosition = (screenWidth: number) => {
  if (screenWidth < 768) return [0, 0, 18]; // Mobile: farther back
  if (screenWidth < 1024) return [0, 0, 16]; // Tablet: medium
  return [0, 0, 15]; // Desktop: closer
};
```

---

### **Phase 9: Performance Optimization** (20 mins)

#### 9.1: Lazy Loading Strategy
```typescript
// Dynamic import for code splitting
const ParticleCanvas = dynamic(
  () => import('@/components/three/ParticleCanvas'),
  { 
    ssr: false, // Don't render on server
    loading: () => null // No loading state needed
  }
);
```

#### 9.2: Instanced Rendering (if count > 100)
```typescript
// Use InstancedMesh for better performance
<instancedMesh args={[geometry, material, count]}>
  // Much faster than individual meshes
</instancedMesh>
```

#### 9.3: Texture Optimization
```typescript
// Petal texture requirements:
- Format: PNG with transparency
- Size: 128x128px or 256x256px (small!)
- Optimized: TinyPNG or similar
- Fallback: Simple circle if texture fails to load
```

#### 9.4: Frame Rate Management
```typescript
// Target 60 FPS, skip frames if lagging
let lastFrameTime = 0;
const targetFPS = isMobile ? 30 : 60;
const frameInterval = 1000 / targetFPS;

useFrame((state, delta) => {
  const now = performance.now();
  if (now - lastFrameTime < frameInterval) return;
  
  // Update logic here
  lastFrameTime = now;
});
```

#### 9.5: Memory Management
```typescript
// Clean up on unmount
useEffect(() => {
  return () => {
    // Dispose geometries, materials, textures
    geometry.dispose();
    material.dispose();
    texture.dispose();
  };
}, []);
```

---

### **Phase 10: Visual Design Specifications** (10 mins)

#### Color Scheme Integration
```typescript
// Match your existing theme colors
const petalColors = {
  primary: '#E6B7B0',    // Subtle rose (from your palette)
  secondary: '#FFFFFF',   // White
  accent: '#C8A951',      // Gold tint (rare petals)
};

// Random color assignment:
// 60% subtle rose
// 30% white
// 10% gold accent
```

#### Petal Visual Properties
```typescript
{
  size: {
    min: 0.3,
    max: 0.8,
    variance: 'random'
  },
  opacity: {
    min: 0.5,
    max: 0.8,
    fadeIn: true,
    fadeOut: true
  },
  shape: 'oval',  // Petal-like
  texture: 'soft-gradient', // Subtle gradient for depth
  blur: 'slight' // Very subtle blur for dreamlike effect
}
```

#### Animation Timing
```typescript
{
  driftSpeed: 0.005,        // Slow downward drift
  swaySpeed: 0.002,         // Gentle side-to-side
  rotationSpeed: 0.001,     // Slow tumble
  swayAmplitude: 1.5,       // Horizontal movement range
  resetDuration: 0,         // Instant reset (seamless loop)
}
```

---

### **Phase 11: Testing Plan** (30 mins)

#### 11.1: Device Testing Matrix

| Device Type | Screen Size | Expected FPS | Particle Count | Status |
|-------------|-------------|--------------|----------------|---------|
| iPhone 12+  | 390x844     | 30-45 FPS    | 50-60         | ⬜ |
| iPhone 8    | 375x667     | 25-35 FPS    | 40-50         | ⬜ |
| iPad Pro    | 1024x1366   | 45-60 FPS    | 80-100        | ⬜ |
| Galaxy S21  | 360x800     | 30-45 FPS    | 50-60         | ⬜ |
| Desktop FHD | 1920x1080   | 60 FPS       | 150-200       | ⬜ |
| Desktop 4K  | 3840x2160   | 45-60 FPS    | 150-200       | ⬜ |

#### 11.2: Performance Benchmarks
```typescript
// Add FPS counter in dev mode
const [fps, setFps] = useState(60);

useFrame(() => {
  if (process.env.NODE_ENV === 'development') {
    const currentFps = Math.round(1 / state.clock.getDelta());
    setFps(currentFps);
  }
});

// Display in corner during development
{process.env.NODE_ENV === 'development' && (
  <div className="fixed bottom-4 right-4 bg-black/80 text-white px-3 py-1 rounded">
    {fps} FPS | {particleCount} particles
  </div>
)}
```

#### 11.3: Functionality Tests
- ✅ Particles load correctly on all devices
- ✅ No blocking of clickable elements (buttons, links)
- ✅ Framer Motion text animations still work
- ✅ Graceful degradation on unsupported browsers
- ✅ No memory leaks after multiple page visits
- ✅ Responsive behavior on orientation change
- ✅ Reduced motion preference respected
- ✅ Background image still visible and clear

#### 11.4: Browser Compatibility
- Chrome/Edge: Full support ✅
- Firefox: Full support ✅
- Safari: Full support (with vendor prefixes) ✅
- Mobile Safari: Reduced particle count ⚠️
- Opera: Full support ✅
- Samsung Internet: Test required ⚠️

---

### **Phase 12: Fallback Strategies** (15 mins)

#### Fallback Hierarchy

**Level 1: Full Experience**
- Modern browser + Desktop/High-end mobile
- All particles, full animation

**Level 2: Reduced Experience**
- Mid-range devices
- Fewer particles, simpler animation

**Level 3: Minimal Experience**
- Low-end devices
- Very few particles OR disabled completely

**Level 4: No Effect**
- Reduced motion preference
- Unsupported browser
- JavaScript disabled
- Three.js loading error

#### Error Boundary
```typescript
// Wrap ParticleCanvas in error boundary
<ErrorBoundary fallback={null}>
  {showParticles && <ParticleCanvas />}
</ErrorBoundary>
```

#### Feature Detection
```typescript
const hasWebGL = () => {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
};
```

---

## 🎨 Visual Design Mockup Description

### Desktop View (1920x1080)
```
┌─────────────────────────────────────────────┐
│ [Navbar with menu]                   [Theme]│
├─────────────────────────────────────────────┤
│                                             │
│  🌸     🌸                    🌸           │
│               WELCOME TO            🌸      │
│        🌸                                   │
│      Prarthana Nelum Pokuna    🌸          │
│   🌸                                        │
│     Your premier destination...      🌸    │
│                  🌸                         │
│        [Book Event] [View Gallery]         │
│  🌸                          🌸             │
│              🌸                      🌸     │
└─────────────────────────────────────────────┘
```

### Mobile View (375x667)
```
┌──────────────────┐
│ [≡]      [PN] [@]│
├──────────────────┤
│                  │
│  🌸     🌸       │
│                  │
│   WELCOME TO     │
│  🌸              │
│  Prarthana       │
│  Nelum Pokuna    │
│        🌸        │
│   Your premier   │
│   destination... │
│  🌸              │
│  [Book Event]    │
│  [View Gallery]  │
│        🌸        │
└──────────────────┘
```

**Key Visual Elements**:
- 🌸 = Floating lotus petals (subtle, semi-transparent)
- Petals drift slowly downward with gentle sway
- Depth: Some petals closer (larger), some farther (smaller)
- Color: Soft pink/white with occasional gold tint
- Opacity: 50-80% for ethereal effect

---

## 📊 Success Metrics

### Performance Metrics
- ✅ Desktop: Consistent 60 FPS
- ✅ Mobile: Minimum 30 FPS
- ✅ Bundle size: < 50KB for particle system
- ✅ Initial load: No blocking of page render
- ✅ Memory: < 50MB additional RAM usage

### User Experience Metrics
- ✅ Visual appeal: Enhances luxury feel
- ✅ No distraction: Text remains primary focus
- ✅ Smooth animation: No jank or stuttering
- ✅ Accessibility: Respects reduced motion
- ✅ CTAs remain visible and clickable

### Technical Metrics
- ✅ No console errors
- ✅ WebGL context doesn't crash
- ✅ Proper cleanup on unmount
- ✅ Works across all target browsers
- ✅ Responsive across all breakpoints

---

## ⚠️ Potential Issues & Solutions

### Issue 1: Three.js Bundle Size
**Problem**: Large bundle impact
**Solution**: 
- Use dynamic imports
- Tree-shake unused drei components
- Only import necessary Three.js modules

### Issue 2: Mobile Performance
**Problem**: Low FPS on budget phones
**Solution**:
- Adaptive particle count
- Disable on low-end devices
- Use simpler geometry

### Issue 3: Text Readability
**Problem**: Particles obscure text
**Solution**:
- Keep particles at low opacity (50-60%)
- Add subtle text shadow
- Ensure high contrast

### Issue 4: Click Blocking
**Problem**: Canvas blocks button clicks
**Solution**:
- Add `pointer-events: none` to canvas
- Ensure proper z-index layering

### Issue 5: Safari Performance
**Problem**: Safari has issues with WebGL
**Solution**:
- Reduce particle count specifically for Safari
- Test on actual iOS devices
- Use feature detection

---

## 🚀 Deployment Checklist

**Before Going Live**:
- [ ] Test on minimum 5 different devices
- [ ] Verify FPS on each device type
- [ ] Test with network throttling (slow 3G)
- [ ] Verify accessibility (screen readers ignore)
- [ ] Check reduced motion preference
- [ ] Test error boundaries
- [ ] Verify no console errors/warnings
- [ ] Check bundle size impact
- [ ] Test on Safari iOS
- [ ] Verify text remains readable
- [ ] Test button/CTA clickability
- [ ] Check memory leaks (10+ page navigations)

---

## 📅 Estimated Timeline

| Phase | Task | Time | Cumulative |
|-------|------|------|------------|
| 1 | Setup & Dependencies | 10 min | 10 min |
| 2 | Device Detection Hook | 15 min | 25 min |
| 3 | Particle Count Hook | 10 min | 35 min |
| 4 | Petal Component | 20 min | 55 min |
| 5 | Particle System | 30 min | 1h 25min |
| 6 | Canvas Wrapper | 20 min | 1h 45min |
| 7 | Hero Integration | 25 min | 2h 10min |
| 8 | Responsive Design | 15 min | 2h 25min |
| 9 | Optimization | 20 min | 2h 45min |
| 10 | Visual Polish | 10 min | 2h 55min |
| 11 | Testing | 30 min | 3h 25min |
| 12 | Bug Fixes | 20 min | 3h 45min |

**Total Estimated Time**: ~4 hours

---

## 🎯 Next Steps

Once you approve this plan, implementation will proceed in this order:

1. **Install dependencies** → Test basic Three.js integration
2. **Build hooks** → Verify device detection works
3. **Create components** → Progressive building and testing
4. **Integrate with Hero** → Ensure no breaking changes
5. **Optimize & test** → Device testing and refinement
6. **Deploy** → Gradual rollout with monitoring

---

## 📝 Notes & Considerations

### Why This Approach?
- **Modular**: Each component can be tested independently
- **Performant**: Device-adaptive rendering ensures good UX
- **Maintainable**: Clear separation of concerns
- **Scalable**: Easy to adjust particle count or add effects later
- **Safe**: Multiple fallback layers ensure page always works

### Alternative Approaches Considered
1. **CSS-only animation**: Lighter but less impressive visually
2. **Canvas 2D instead of Three.js**: Simpler but lacks depth
3. **Video background**: No interactivity, larger file size
4. **Lottie animation**: Fixed animation, no randomness

**Chosen Three.js because**: Best balance of visual impact, performance, and flexibility.

---

## ✅ Final Approval Required

Before implementation begins, please confirm:

- [ ] You approve the overall approach
- [ ] Performance targets are acceptable
- [ ] Visual design matches your expectations
- [ ] Timeline works for your project schedule
- [ ] You understand the bundle size impact (~45KB)
- [ ] You're okay with graceful degradation on low-end devices

**Ready to implement?** Let me know and I'll start with Phase 1! 🚀
