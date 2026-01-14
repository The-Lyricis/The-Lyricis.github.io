# 🎨 Shader Effects Portfolio

A comprehensive collection of shader effects integrated into the Technical Artist portfolio website.

## 🌟 Implemented Shader Effects

### 1. **GlitchText** - RGB Glitch Effect
**Location:** Hero Section (Main Title)
**Effect:** 
- Random RGB channel separation
- Periodic glitch animations every 3 seconds
- Scan line artifacts
- Creates cyberpunk aesthetic

**Technical Details:**
- Uses Motion React for smooth animations
- Red and Cyan color channel displacement
- Mix blend mode: screen
- 200ms glitch duration

---

### 2. **HologramEffect** - Sci-Fi Hologram
**Location:** Hero Section (Wrapping main title)
**Effect:**
- Horizontal scanning lines
- Moving scan beam
- Chromatic aberration
- Periodic flicker
- Blue-cyan color scheme

**Technical Details:**
- Repeating linear gradient scanlines
- Animated gradient beam with blur
- Opacity-based flicker animation
- 8s scan cycle

---

### 3. **MatrixRain** - Digital Rain Background
**Location:** Manifesto Section Background
**Effect:**
- Falling code characters (Matrix-style)
- Uses alphanumeric + special characters
- Fade trail effect
- Customizable color and opacity

**Technical Details:**
- Canvas-based rendering
- 50ms frame interval
- Semi-transparent trails
- Random drop reset logic
- Opacity: 0.08 (subtle background)

---

### 4. **GridDistortion** - Interactive Mesh Warp
**Location:** Manifesto Section Background
**Effect:**
- Dynamic grid that warps based on mouse position
- Real-time distortion calculation
- Creates "energy field" effect
- Smooth falloff radius

**Technical Details:**
- Canvas-based line rendering
- 50x50 pixel grid
- 180px distortion radius
- Force-based displacement calculation
- RequestAnimationFrame for smooth updates

---

### 5. **CRTOverlay** - Retro CRT Monitor
**Location:** Global (Full screen overlay)
**Effect:**
- Horizontal scanlines
- Screen vignette/curvature simulation
- Film grain noise
- Periodic flicker
- Rolling interference waves

**Technical Details:**
- Fixed position overlay (z-index: 50)
- Mix blend mode: overlay
- SVG noise filter
- 8s rolling interference cycle
- Intensity parameter: 0.4

---

### 6. **ChromaticCard** - RGB Aberration on Hover
**Location:** Project Gallery Cards
**Effect:**
- Red and cyan channel separation on hover
- Animated scan lines
- Glowing border effect
- Pulsing RGB colors

**Technical Details:**
- Triggered by mouse hover
- 0.15s repeat animation
- 5px intensity displacement
- Mix blend mode: screen
- Gradient glow halo

---

### 7. **RippleDistortion** - Interactive Water Ripple
**Location:** Global (Click anywhere)
**Effect:**
- Click to create expanding ripples
- Concentric circle waves
- Cyan and blue color scheme
- Fading alpha animation

**Technical Details:**
- Canvas-based rendering
- Multiple ripples support
- 3 concentric circles per ripple
- 200px max radius
- Mix blend mode: screen
- Auto-cleanup when fade completes

---

## 🎯 Shader Distribution Map

```
App.tsx
├─ CRTOverlay (Global)
├─ RippleDistortion (Global)
│
├─ Hero Section
│  ├─ HologramEffect
│  └─ GlitchText
│
├─ Manifesto Section
│  ├─ MatrixRain (Background)
│  └─ GridDistortion (Background)
│
└─ Project Gallery
   └─ ChromaticCard (Per card)
```

---

## 🔧 Technical Stack

- **Motion/React** - Smooth animations and transitions
- **Canvas API** - Real-time rendering (Matrix, Grid, Ripple)
- **CSS Shaders** - Blend modes, filters, gradients
- **React Hooks** - State management and lifecycle
- **TypeScript** - Type safety and component props

---

## 🎨 Color Palette

| Effect | Primary Color | Hex Code |
|--------|---------------|----------|
| Matrix Rain | Cyan | #64FFDA |
| Grid Distortion | Blue | #4A9EFF |
| Ripple | Cyan/Blue | #64FFDA / #4A9EFF |
| Glitch | Red/Cyan | #FF0000 / #00FFFF |
| Hologram | Cyan | #64FFDA |

---

## ⚡ Performance Optimization

1. **Canvas Effects** - Use `requestAnimationFrame` for 60fps
2. **Conditional Rendering** - Only render when visible/hovered
3. **Event Cleanup** - Proper cleanup in useEffect returns
4. **Opacity Control** - Keep background effects subtle (0.08-0.15)
5. **Z-Index Management** - Proper layering to avoid conflicts

---

## 🚀 Usage Examples

### GlitchText
```tsx
<GlitchText intensity={2}>
  <h1>Your Title</h1>
</GlitchText>
```

### MatrixRain
```tsx
<MatrixRain 
  opacity={0.08} 
  color="#64FFDA" 
  fontSize={12} 
/>
```

### ChromaticCard
```tsx
<ChromaticCard intensity={4}>
  <YourCardContent />
</ChromaticCard>
```

---

## 🎬 Animation Timings

- Glitch: 3s interval, 200ms duration
- Hologram scan: 8s cycle
- CRT scanline: 8s cycle
- Matrix rain: 50ms frame
- Ripple fade: ~3s per ripple
- Chromatic: 0.15s loop on hover

---

## 📝 Future Enhancements

- [ ] Shader-based particle effects
- [ ] GPU-accelerated distortions
- [ ] Custom WebGL shaders
- [ ] Post-processing effects
- [ ] Bloom/glow passes
- [ ] Depth of field

---

**Created for Technical Artist Portfolio - Jiliang Ye**
*Showcasing shader development, visual effects, and creative coding skills*
