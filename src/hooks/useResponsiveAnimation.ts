import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Responsive animation hook
export const useResponsiveAnimation = () => {
  useEffect(() => {
    // Handle window resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    // Handle orientation change
    const handleOrientationChange = () => {
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    };

    // Add event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    // Set up responsive breakpoints
    ScrollTrigger.config({
      ignoreMobileResize: true,
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load'
    });

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);
};

// Performance optimization hook
export const useAnimationPerformance = () => {
  useEffect(() => {
    // Reduce motion for users who prefer it
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      gsap.globalTimeline.timeScale(0.1);
    }

    // Optimize for mobile devices
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      // Reduce animation complexity on mobile
      gsap.defaults({
        duration: 0.6,
        ease: 'power2.out'
      });
    }

    // Cleanup
    return () => {
      gsap.globalTimeline.timeScale(1);
    };
  }, []);
};

// Animation cleanup hook
export const useAnimationCleanup = () => {
  useEffect(() => {
    return () => {
      // Kill all ScrollTrigger instances
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      
      // Kill all GSAP timelines
      gsap.killTweensOf('*');
    };
  }, []);
};
