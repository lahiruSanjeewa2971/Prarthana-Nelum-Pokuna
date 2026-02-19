# Hero Section - Advanced Petal Interactions

## 📋 Project Overview
Enhance the existing floating lotus petals with scroll-reactive animations. The petals will respond dynamically to user scroll behavior, creating an immersive and interactive experience that adds depth and engagement to the hero section.

---

## 🎯 Goals & Requirements

### Primary Goals
- ✅ Add scroll-reactive camera zoom (FOV adjustment)
- ✅ Dynamic petal speed based on scroll velocity
- ✅ Fade-out effect as user scrolls down
- ✅ Motion trails for fast scrolling
- ✅ Maintain 60 FPS on desktop, 30+ FPS on mobile
- ✅ No bundle size increase (uses existing dependencies)

### Performance Targets
- **Desktop**: Smooth 60 FPS with all effects
- **Tablet**: 45-60 FPS
- **Mobile**: 30-45 FPS
- **Bundle Impact**: +5-10KB gzipped (scroll tracking utilities only)
- **Memory**: No additional overhead (reuses existing petals)

---

## 🎬 Animation Behaviors

### 1. Camera Zoom on Scroll
```typescript
Scroll Position 0% (Top):
- Camera FOV: 50° (default)
- Normal field of view

Scroll Position 50%:
- Camera FOV: 60° (wider)
- Creates zoom-out effect

Scroll Position 100% (Scrolled past hero):
- Camera FOV: 70° (widest)
- Petals appear to recede into distance
```

**Technical:**
- Smooth interpolation using lerp
- 60ms easing for natural feel
- FOV updates max 60 times/second

---

### 2. Scroll Velocity-Based Speed
```typescript
No Scroll (Idle):
- Petal drift speed: 0.012 (default)
- Gentle falling

Slow Scroll (< 5px/frame):
- Petal drift speed: 0.012-0.020
- Slightly faster

Fast Scroll (5-20px/frame):
- Petal drift speed: 0.020-0.040
- Rapid descent

Very Fast Scroll (> 20px/frame):
- Petal drift speed: 0.040-0.060
- Dramatic rush effect
```

**Technical:**
- Velocity calculated: `scrollDelta / deltaTime`
- Smoothed over 5 frames to prevent jitter
- Speed multiplier: `1 + (velocity * 0.002)`

---

### 3. Fade-Out on Scroll Down
```typescript
Scroll Position 0% (Top):
- Petal opacity: 0.5-0.8 (normal)
- Full visibility

Scroll Position 30%:
- Petal opacity: 0.4-0.6
- Slight fade

Scroll Position 60%:
- Petal opacity: 0.2-0.4
- Strong fade

Scroll Position 100%:
- Petal opacity: 0.0-0.1
- Nearly invisible
```

**Technical:**
- Opacity calculated: `baseOpacity * (1 - scrollProgress * 0.9)`
- Applied per-petal for smooth transition
- Prevents particles from interfering with next section

---

### 4. Motion Trails (Fast Scroll Only)
```typescript
Scroll Velocity < 10px/frame:
- No trails (normal rendering)

Scroll Velocity > 10px/frame:
- Enable motion blur/trails
- Trail length: proportional to velocity
- Gold/white color shift (speed effect)

Scroll Velocity > 30px/frame:
- Maximum trail effect
- Streak-like appearance
- Color: Gold accent (dramatic effect)
```

**Technical:**
- Use afterimage effect with opacity decay
- Render previous 3-5 frames with decreasing opacity
- Only enabled on desktop (performance)

---

### 5. Depth-of-Field Blur (Optional Enhancement)
```typescript
Scroll Position 0%:
- All petals sharp

Scroll Position 50%:
- Background petals blur (Z < -5)
- Focus on mid-ground petals

Scroll Position 100%:
- All petals blur
- Emphasizes content transition
```

**Technical:**
- Fragment shader: Gaussian blur based on Z-depth
- Blur radius: `abs(depth) * scrollProgress * 2`
- GPU-accelerated

---

## 🏗️ File Structure

```
src/
├── components/
│   └── three/
│       ├── LotusParticles.tsx (modify - add scroll props)
│       ├── Petal.tsx (modify - accept dynamic speed/opacity)
│       └── ParticleCanvas.tsx (modify - integrate scroll tracking)
├── hooks/
│   ├── useScrollVelocity.ts (new - track scroll speed)
│   └── useScrollProgress.ts (new - track scroll position)
└── utils/
    └── animation-utils.ts (new - lerp, easing functions)
```

---

## 📝 Implementation Phases

### **Phase 1: Scroll Tracking Hooks** (30 mins)

#### Step 1.1: Create useScrollProgress Hook
**File**: `src/hooks/useScrollProgress.ts`

**Purpose**: Track scroll position relative to hero section

**Features**:
- Calculate scroll progress (0 to 1)
- Debounced updates (16ms = 60fps)
- Returns normalized scroll position

**Return Type**:
```typescript
{
  scrollProgress: number; // 0 to 1
  isScrollingDown: boolean;
  isScrolling: boolean;
}
```

---

#### Step 1.2: Create useScrollVelocity Hook
**File**: `src/hooks/useScrollVelocity.ts`

**Purpose**: Track scroll velocity for speed-based effects

**Features**:
- Calculate velocity (pixels per frame)
- Smooth velocity over 5 frames (reduce jitter)
- Detect fast vs slow scrolling

**Return Type**:
```typescript
{
  velocity: number; // pixels per frame
  smoothedVelocity: number; // averaged
  isFastScrolling: boolean; // > 10px/frame
}
```

---

### **Phase 2: Animation Utility Functions** (20 mins)

#### Step 2.1: Create Animation Utils
**File**: `src/utils/animation-utils.ts`

**Functions**:
```typescript
// Linear interpolation
lerp(start: number, end: number, t: number): number

// Smooth easing
easeOutCubic(t: number): number

// Clamp value between min and max
clamp(value: number, min: number, max: number): number

// Map value from one range to another
mapRange(
  value: number,
  inMin: number, inMax: number,
  outMin: number, outMax: number
): number
```

**Purpose**: Reusable math utilities for smooth animations

---

### **Phase 3: Update Petal Component** (30 mins)

#### Step 3.1: Add Dynamic Properties to Petal
**File**: `src/components/three/Petal.tsx`

**Changes**:

1. **Accept new props**:
```typescript
interface PetalProps {
  // ... existing props
  scrollSpeedMultiplier?: number; // 1.0 to 3.0
  scrollOpacityMultiplier?: number; // 0.0 to 1.0
}
```

2. **Apply multipliers in useFrame**:
```typescript
// Apply scroll-influenced speed
const effectiveSpeed = driftSpeed * scrollSpeedMultiplier;
mesh.position.y -= effectiveSpeed;

// Apply scroll-influenced opacity
material.opacity = baseOpacity * scrollOpacityMultiplier;
```

3. **No breaking changes**: Default values maintain current behavior

---

### **Phase 4: Update LotusParticles Component** (30 mins)

#### Step 4.1: Pass Scroll Props to Petals
**File**: `src/components/three/LotusParticles.tsx`

**Changes**:

1. **Accept scroll multipliers**:
```typescript
interface LotusParticlesProps {
  scrollSpeedMultiplier?: number;
  scrollOpacityMultiplier?: number;
}
```

2. **Pass to all Petal components**:
```typescript
<Petal
  {...petalProps}
  scrollSpeedMultiplier={scrollSpeedMultiplier}
  scrollOpacityMultiplier={scrollOpacityMultiplier}
/>
```

---

### **Phase 5: Update ParticleCanvas Component** (45 mins)

#### Step 5.1: Integrate Scroll Tracking
**File**: `src/components/three/ParticleCanvas.tsx`

**Changes**:

1. **Import scroll hooks**:
```typescript
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { useScrollVelocity } from '@/hooks/useScrollVelocity';
```

2. **Track scroll state**:
```typescript
const { scrollProgress } = useScrollProgress();
const { smoothedVelocity } = useScrollVelocity();
```

3. **Calculate multipliers**:
```typescript
// Speed multiplier (1.0 to 3.0)
const speedMultiplier = 1 + Math.min(smoothedVelocity * 0.002, 2);

// Opacity multiplier (1.0 to 0.1)
const opacityMultiplier = Math.max(1 - scrollProgress * 0.9, 0.1);
```

4. **Update camera FOV dynamically**:
```typescript
useFrame(({ camera }) => {
  const targetFOV = particleConfig.cameraFOV + scrollProgress * 20;
  camera.fov = lerp(camera.fov, targetFOV, 0.1);
  camera.updateProjectionMatrix();
});
```

5. **Pass to LotusParticles**:
```typescript
<LotusParticles
  scrollSpeedMultiplier={speedMultiplier}
  scrollOpacityMultiplier={opacityMultiplier}
/>
```

---

### **Phase 6: Motion Trails (Optional - Desktop Only)** (60 mins)

#### Step 6.1: Add Trail Effect
**File**: `src/components/three/Petal.tsx`

**Concept**: Render previous positions with fading opacity

**Implementation**:

1. **Track position history**:
```typescript
const positionHistory = useRef<Vector3[]>([]);

useFrame(() => {
  // Store current position
  positionHistory.current.push(mesh.position.clone());
  
  // Keep last 5 positions only
  if (positionHistory.current.length > 5) {
    positionHistory.current.shift();
  }
});
```

2. **Render trail (if fast scrolling)**:
```typescript
{isFastScrolling && positionHistory.current.map((pos, i) => (
  <mesh key={i} position={pos}>
    <planeGeometry args={[1, 1.5]} />
    <meshBasicMaterial
      color={PETAL_COLORS.accent} // Gold for speed effect
      transparent
      opacity={0.3 * (i / 5)} // Fade older positions
    />
  </mesh>
))}
```

3. **Performance consideration**:
- Only render on desktop (not mobile)
- Only when velocity > 10px/frame
- Limit to 3-5 historical positions

---

### **Phase 7: Depth-of-Field Blur (Optional - Advanced)** (90 mins)

#### Step 7.1: Add Post-Processing
**File**: `src/components/three/ParticleCanvas.tsx`

**Requirements**:
```bash
npm install postprocessing
```

**Implementation**:

1. **Import effects**:
```typescript
import { EffectComposer, DepthOfField } from '@react-three/postprocessing';
```

2. **Wrap scene with effects**:
```typescript
<Canvas>
  <LotusParticles />
  
  <EffectComposer>
    <DepthOfField
      focusDistance={0}
      focalLength={0.02 + scrollProgress * 0.05}
      bokehScale={2 + scrollProgress * 3}
    />
  </EffectComposer>
</Canvas>
```

**Note**: This is optional and may impact mobile performance. Test thoroughly.

---

### **Phase 8: Performance Optimization** (30 mins)

#### Optimization Checklist:

1. **Throttle scroll updates**:
```typescript
// Update max 60 times per second
const throttledScroll = useThrottle(scrollProgress, 16);
```

2. **Disable effects on low-end devices**:
```typescript
const { isLowEnd } = useDeviceDetection();
const enableAdvancedEffects = !isLowEnd && !isMobile;
```

3. **Reduce particle count during fast scroll** (optional):
```typescript
if (smoothedVelocity > 20) {
  renderEveryNthParticle(2); // Skip every other particle
}
```

4. **Use requestAnimationFrame for smooth updates**:
```typescript
// Already handled by Three.js useFrame
```

---

### **Phase 9: Mobile Optimization** (30 mins)

#### Mobile-Specific Adjustments:

1. **Disable motion trails**:
```typescript
const showTrails = !isMobile && isFastScrolling;
```

2. **Disable depth-of-field**:
```typescript
const showDOF = !isMobile && enableAdvancedEffects;
```

3. **Reduce FOV change range**:
```typescript
const fovRange = isMobile ? 10 : 20; // Smaller change on mobile
```

4. **Increase opacity fade threshold**:
```typescript
// Keep petals more visible on mobile (smaller screens)
const opacityMultiplier = isMobile
  ? Math.max(1 - scrollProgress * 0.5, 0.3)
  : Math.max(1 - scrollProgress * 0.9, 0.1);
```

---

### **Phase 10: Testing & Refinement** (45 mins)

#### Testing Checklist:

**Desktop Testing**:
- [ ] Camera zoom feels natural (not jarring)
- [ ] Petal speed increases smoothly
- [ ] Fade-out is gradual and elegant
- [ ] Motion trails appear only during fast scroll
- [ ] 60 FPS maintained throughout

**Tablet Testing**:
- [ ] Effects work on iPad Pro (1024x1366)
- [ ] 45-60 FPS maintained
- [ ] Smooth scroll performance

**Mobile Testing**:
- [ ] Effects disabled appropriately (trails, DOF)
- [ ] 30-45 FPS maintained
- [ ] No jank or stuttering
- [ ] Battery impact is minimal

**Edge Cases**:
- [ ] Scroll to top (reverse) works correctly
- [ ] Fast scroll up/down doesn't break
- [ ] Works with smooth scroll behavior (CSS)
- [ ] No memory leaks after multiple scrolls

---

### **Phase 11: Fine-Tuning Parameters** (30 mins)

#### Adjustable Parameters:

```typescript
// In ParticleCanvas.tsx - tune these for best feel
const SCROLL_CONFIG = {
  // Camera zoom
  fovMin: 50,
  fovMax: 70,
  fovLerpSpeed: 0.1,
  
  // Speed multiplier
  speedMin: 1.0,
  speedMax: 3.0,
  velocityScale: 0.002,
  
  // Opacity fade
  opacityMin: 0.1,
  opacityMax: 1.0,
  fadeStart: 0.0,
  fadeEnd: 1.0,
  
  // Motion trails
  trailVelocityThreshold: 10,
  trailLength: 5,
  trailOpacity: 0.3,
};
```

**Recommended Values** (after testing):
- FOV range: 50° to 65° (not too extreme)
- Speed multiplier: 1.0 to 2.5 (feels responsive)
- Opacity fade: 1.0 to 0.2 (still slightly visible)
- Trail threshold: 15px/frame (not too sensitive)

---

### **Phase 12: Documentation & Comments** (15 mins)

#### Add inline documentation:

```typescript
/**
 * Advanced Petal Scroll Interactions
 * 
 * Enhances lotus petals with scroll-reactive behavior:
 * - Camera zooms out as user scrolls (FOV 50° → 70°)
 * - Petals speed up based on scroll velocity (1x → 3x)
 * - Petals fade out as user scrolls past hero (100% → 10%)
 * - Motion trails appear during fast scrolling (desktop only)
 * 
 * Performance:
 * - Desktop: 60 FPS with all effects
 * - Mobile: 30-45 FPS with reduced effects
 * - Bundle: +8KB gzipped (scroll tracking utilities)
 */
```

---

## 📊 Performance Benchmarks

### Target Metrics:

| Device Type | FPS Target | Effects Enabled | Bundle Impact |
|-------------|-----------|-----------------|---------------|
| Desktop 1920x1080 | 60 FPS | All | +8KB |
| Laptop 1366x768 | 55-60 FPS | All | +8KB |
| iPad Pro | 45-60 FPS | All except DOF | +8KB |
| iPad Air | 40-50 FPS | No trails/DOF | +8KB |
| iPhone 13+ | 35-45 FPS | Basic only | +8KB |
| iPhone 8 | 30-40 FPS | Basic only | +8KB |

### Expected Performance:

**Before enhancements:**
- Desktop: 60 FPS, 150-200 particles
- Mobile: 40 FPS, 50-75 particles

**After enhancements:**
- Desktop: 58-60 FPS, 150-200 particles + effects
- Mobile: 35-45 FPS, 50-75 particles (reduced effects)

**Performance Cost:**
- Camera FOV updates: ~1-2 FPS
- Velocity tracking: ~0.5 FPS
- Motion trails: ~3-5 FPS (desktop only)
- Depth-of-field: ~5-8 FPS (desktop only)

---

## 🎨 Visual Design Specifications

### Animation Timings:

```typescript
// Smooth and elegant (luxury hotel aesthetic)
const ANIMATION_CONFIG = {
  cameraLerp: 0.1,          // 10% per frame (smooth)
  speedTransition: 0.15,     // Responsive but not jarring
  opacityTransition: 0.1,    // Gradual fade
  trailFadeSpeed: 0.3,       // Quick trail decay
};
```

### Color Shifts (Optional):

```typescript
// During fast scrolling, shift petal colors
Normal Speed: Soft rose (#E6B7B0) + White (#FFFFFF)
Fast Scroll: Add gold tint (#C8A951) 
Very Fast: Increase gold ratio (10% → 30%)
```

### Effect Intensity:

```typescript
Subtle (Default):
- FOV change: 50° → 65° (15° range)
- Speed multiplier: 1.0x → 2.0x
- Opacity: 100% → 20%

Dramatic (Optional):
- FOV change: 50° → 75° (25° range)
- Speed multiplier: 1.0x → 4.0x
- Opacity: 100% → 5%
```

**Recommendation**: Start with subtle, allow configuration later

---

## ⚠️ Known Limitations & Solutions

### Issue 1: Scroll Jitter on Mousewheel
**Problem**: Velocity spikes cause speed jumps  
**Solution**: Smooth velocity over 5-10 frames

### Issue 2: Mobile Performance
**Problem**: Effects may cause FPS drops on older phones  
**Solution**: Disable trails and DOF on mobile automatically

### Issue 3: Safari Scroll Behavior
**Problem**: Safari has momentum scrolling (iOS)  
**Solution**: Use normalized velocity, cap max speed multiplier

### Issue 4: Fast Scroll Memory
**Problem**: Storing position history increases memory  
**Solution**: Limit history to 3-5 positions, clear on idle

---

## 🚀 Deployment Checklist

**Before Going Live**:
- [ ] Test on minimum 5 different devices
- [ ] Verify FPS on each device type (use React DevTools Profiler)
- [ ] Test with slow network (scroll hooks still work?)
- [ ] Verify no console errors/warnings
- [ ] Check bundle size increase (<10KB)
- [ ] Test with mouse wheel, trackpad, touch
- [ ] Test scroll up (reverse direction)
- [ ] Verify reduced motion preference
- [ ] Check accessibility (screen reader ignores effects)
- [ ] Memory profiler (no leaks after 10+ scrolls)

---

## 📅 Estimated Timeline

| Phase | Task | Time | Cumulative |
|-------|------|------|------------|
| 1 | Scroll tracking hooks | 30 min | 30 min |
| 2 | Animation utilities | 20 min | 50 min |
| 3 | Update Petal component | 30 min | 1h 20min |
| 4 | Update LotusParticles | 30 min | 1h 50min |
| 5 | Update ParticleCanvas | 45 min | 2h 35min |
| 6 | Motion trails (optional) | 60 min | 3h 35min |
| 7 | DOF blur (optional) | 90 min | 5h 05min |
| 8 | Performance optimization | 30 min | 5h 35min |
| 9 | Mobile optimization | 30 min | 6h 05min |
| 10 | Testing & refinement | 45 min | 6h 50min |
| 11 | Fine-tuning parameters | 30 min | 7h 20min |
| 12 | Documentation | 15 min | 7h 35min |

**Minimum Viable Implementation**: ~2.5 hours (Phases 1-5)  
**Full Implementation**: ~4 hours (without optional effects)  
**Complete with All Effects**: ~7.5 hours

---

## 🎯 Success Metrics

### User Experience:
- ✅ Scroll feels responsive and engaging
- ✅ Effects enhance (not distract from) content
- ✅ No performance degradation
- ✅ Seamless on all devices

### Technical Metrics:
- ✅ FPS never drops below 30 (mobile) / 55 (desktop)
- ✅ Bundle size increase < 10KB
- ✅ No memory leaks
- ✅ Zero console errors

### Visual Quality:
- ✅ Camera zoom feels natural (not nauseating)
- ✅ Petal speed change is smooth (not jarring)
- ✅ Fade-out is gradual (not abrupt)
- ✅ Motion trails add excitement (not clutter)

---

## 🔄 Future Enhancements (Post-Launch)

1. **Mouse/Touch Parallax**: Petals subtly follow cursor
2. **Directional Influence**: Wind effect based on scroll direction
3. **Interactive Disruption**: Click/touch creates ripple effect
4. **Sound Design**: Subtle whoosh sound on fast scroll (optional)
5. **Preset Modes**: Gentle / Normal / Dramatic intensity presets

---

## 📝 Notes & Considerations

### Why This Approach?
- **Minimal dependencies**: Uses existing Three.js setup
- **Progressive enhancement**: Works without JS (static bg)
- **Performance-first**: All effects optional/conditional
- **Mobile-friendly**: Automatically reduces complexity

### Alternative Approaches Considered:
1. **CSS parallax only**: Less impressive, no velocity response
2. **Lottie animation**: Not interactive, larger file size
3. **GSAP ScrollTrigger**: Extra dependency, overkill for this

**Chosen approach** balances visual impact with performance.

---

## ✅ Definition of Done

**Basic Implementation Complete When**:
- ✅ Camera FOV adjusts on scroll
- ✅ Petals speed up with scroll velocity
- ✅ Petals fade out on scroll down
- ✅ 60 FPS on desktop, 35+ FPS on mobile
- ✅ No console errors
- ✅ Respects reduced motion preference

**Full Implementation Complete When**:
- All above +
- ✅ Motion trails on fast scroll (desktop)
- ✅ Tested on 5+ devices
- ✅ Documentation complete
- ✅ Passed accessibility audit

---

**Ready to implement?** Start with Phases 1-5 for core functionality (2.5 hours), then add optional effects as needed! 🚀
