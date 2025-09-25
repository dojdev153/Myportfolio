# GSAP Animations Documentation

This document outlines the GSAP (GreenSock Animation Platform) animations implemented in the portfolio.

## Overview

The portfolio uses GSAP with ScrollTrigger for smooth, performant animations that enhance the user experience. All animations are responsive, accessible, and optimized for performance.

## Architecture

### Animation Hooks (`src/hooks/useGSAP.ts`)

A comprehensive custom hook that provides reusable animation functions:

- **fadeIn**: Fade in with optional directional movement
- **scaleIn**: Scale in with bounce effect
- **staggerIn**: Staggered animations for multiple elements
- **parallax**: Parallax scrolling effects
- **slideIn**: Slide in from specific directions
- **rotateIn**: Rotate in with scale effect

### Responsive Animation Hooks (`src/hooks/useResponsiveAnimation.ts`)

- **useResponsiveAnimation**: Handles window resize and orientation changes
- **useAnimationPerformance**: Optimizes animations for different devices
- **useAnimationCleanup**: Cleans up animations on component unmount

### Animated Section Component (`src/components/AnimatedSection.tsx`)

A wrapper component that simplifies animation implementation:

```tsx
<AnimatedSection animation="fadeIn" direction="bottom" delay={0.2}>
  <YourContent />
</AnimatedSection>
```

## Section-Specific Animations

### Hero Section
- **Background**: Parallax scrolling effect
- **Particles**: Staggered fade-in and scale animation
- **Title**: Scale-up with bounce effect
- **Subtitle**: Fade-in with upward motion
- **Buttons**: Fade-in with scale effect

### About Section
- **Header**: Fade-in from bottom
- **Profile**: Slide-in from left
- **Timeline**: Slide-in from right
- **Timeline Items**: Staggered fade-in with upward motion

### Projects Section
- **Header**: Fade-in from bottom
- **Project Cards**: Staggered fade-up with scale effect
- **Hover Effects**: Scale and glow effects

### Skills Section
- **Header**: Fade-in from bottom
- **Category Selector**: Fade-in with upward motion
- **Radar Chart**: Scale-in with rotation effect
- **Skills List**: Staggered fade-in
- **Radar Points**: Animated when category changes

### Contact Section
- **Header**: Fade-in from bottom
- **Contact Info**: Fade-in with upward motion
- **Form**: Fade-in with upward motion
- **Contact Items**: Staggered slide-in from left

## Performance Optimizations

### Mobile Optimization
- Reduced animation duration on mobile devices
- Simplified easing functions for better performance
- Disabled complex animations on low-end devices

### Accessibility
- Respects `prefers-reduced-motion` setting
- Maintains semantic HTML structure
- Provides fallbacks for users with motion sensitivity

### Memory Management
- Automatic cleanup of ScrollTrigger instances
- Proper disposal of GSAP timelines
- Event listener cleanup on component unmount

## Configuration

### ScrollTrigger Settings
```typescript
ScrollTrigger.config({
  ignoreMobileResize: true,
  autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load'
});
```

### Animation Defaults
```typescript
gsap.defaults({
  duration: 0.6,
  ease: 'power2.out'
});
```

## Usage Examples

### Basic Fade In
```tsx
const { elementRef, fadeIn } = useGSAP();

useEffect(() => {
  fadeIn({ duration: 1, delay: 0.2 });
}, [fadeIn]);

return <div ref={elementRef}>Content</div>;
```

### Staggered Animation
```tsx
const { elementRef, staggerIn } = useGSAP();

useEffect(() => {
  staggerIn({ stagger: 0.2, duration: 0.8 });
}, [staggerIn]);

return (
  <div ref={elementRef}>
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
  </div>
);
```

### Parallax Effect
```tsx
const { elementRef, parallax } = useGSAP();

useEffect(() => {
  parallax({ speed: 0.5, direction: 'up' });
}, [parallax]);

return <div ref={elementRef}>Parallax Content</div>;
```

## Best Practices

1. **Always use refs** for elements you want to animate
2. **Clean up animations** in useEffect return functions
3. **Test on mobile devices** to ensure smooth performance
4. **Use appropriate easing** for different animation types
5. **Respect user preferences** for reduced motion
6. **Optimize for performance** by using transform and opacity properties

## Troubleshooting

### Common Issues

1. **Animations not triggering**: Check if ScrollTrigger is properly registered
2. **Performance issues**: Reduce animation complexity on mobile
3. **Memory leaks**: Ensure proper cleanup in useEffect
4. **Layout shifts**: Use transform properties instead of changing layout properties

### Debug Mode

Enable GSAP debug mode in development:
```typescript
gsap.config({
  force3D: true,
  nullTargetWarn: false
});
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Dependencies

- `gsap`: ^3.12.2
- `gsap/ScrollTrigger`: Included with GSAP

## Future Enhancements

- [ ] Add more animation presets
- [ ] Implement gesture-based animations
- [ ] Add animation timeline controls
- [ ] Create animation preview tool
- [ ] Add more accessibility features
