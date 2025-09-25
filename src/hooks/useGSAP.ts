import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Animation configuration types
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  ease?: string;
  stagger?: number;
  once?: boolean;
  start?: string;
  end?: string;
  scrub?: boolean | number;
}

export interface FadeInConfig extends AnimationConfig {
  from?: 'top' | 'bottom' | 'left' | 'right';
  distance?: number;
}

export interface ScaleConfig extends AnimationConfig {
  from?: number;
  to?: number;
}

export interface ParallaxConfig extends AnimationConfig {
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

// Custom hook for GSAP animations
export const useGSAP = () => {
  const elementRef = useRef<HTMLElement>(null);

  // Fade in animation
  const fadeIn = (config: FadeInConfig = {}) => {
    const {
      duration = 1,
      delay = 0,
      ease = 'power2.out',
      stagger = 0,
      once = true,
      from = 'bottom',
      distance = 50,
      start = 'top 80%',
      end = 'bottom 20%'
    } = config;

    useEffect(() => {
      if (!elementRef.current) return;

      const element = elementRef.current;
      const children = element.children;

      // Set initial state
      gsap.set(element, { opacity: 0 });
      
      if (from === 'top') {
        gsap.set(element, { y: -distance });
      } else if (from === 'bottom') {
        gsap.set(element, { y: distance });
      } else if (from === 'left') {
        gsap.set(element, { x: -distance });
      } else if (from === 'right') {
        gsap.set(element, { x: distance });
      }

      // Create animation
      const animation = gsap.to(element, {
        opacity: 1,
        x: 0,
        y: 0,
        duration,
        delay,
        ease,
        stagger: children.length > 0 ? stagger : 0,
        scrollTrigger: {
          trigger: element,
          start,
          end,
          once,
          toggleActions: once ? 'play none none none' : 'play none none reverse'
        }
      });

      return () => {
        animation.kill();
        ScrollTrigger.getAll().forEach(trigger => {
          if (trigger.trigger === element) {
            trigger.kill();
          }
        });
      };
    }, []);

    return elementRef;
  };

  // Scale animation
  const scaleIn = (config: ScaleConfig = {}) => {
    const {
      duration = 1,
      delay = 0,
      ease = 'back.out(1.7)',
      stagger = 0,
      once = true,
      from = 0,
      to = 1,
      start = 'top 80%',
      end = 'bottom 20%'
    } = config;

    useEffect(() => {
      if (!elementRef.current) return;

      const element = elementRef.current;
      const children = element.children;

      // Set initial state
      gsap.set(element, { 
        opacity: 0,
        scale: from
      });

      // Create animation
      const animation = gsap.to(element, {
        opacity: 1,
        scale: to,
        duration,
        delay,
        ease,
        stagger: children.length > 0 ? stagger : 0,
        scrollTrigger: {
          trigger: element,
          start,
          end,
          once,
          toggleActions: once ? 'play none none none' : 'play none none reverse'
        }
      });

      return () => {
        animation.kill();
        ScrollTrigger.getAll().forEach(trigger => {
          if (trigger.trigger === element) {
            trigger.kill();
          }
        });
      };
    }, []);

    return elementRef;
  };

  // Staggered animation for multiple elements
  const staggerIn = (config: AnimationConfig = {}) => {
    const {
      duration = 0.8,
      delay = 0,
      ease = 'power2.out',
      stagger = 0.2,
      once = true,
      start = 'top 80%',
      end = 'bottom 20%'
    } = config;

    useEffect(() => {
      if (!elementRef.current) return;

      const element = elementRef.current;
      const children = Array.from(element.children);

      if (children.length === 0) return;

      // Set initial state for all children
      gsap.set(children, { 
        opacity: 0,
        y: 50
      });

      // Create staggered animation
      const animation = gsap.to(children, {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease,
        stagger,
        scrollTrigger: {
          trigger: element,
          start,
          end,
          once,
          toggleActions: once ? 'play none none none' : 'play none none reverse'
        }
      });

      return () => {
        animation.kill();
        ScrollTrigger.getAll().forEach(trigger => {
          if (trigger.trigger === element) {
            trigger.kill();
          }
        });
      };
    }, []);

    return elementRef;
  };

  // Parallax animation
  const parallax = (config: ParallaxConfig = {}) => {
    const {
      speed = 0.5,
      direction = 'up',
      start = 'top bottom',
      end = 'bottom top',
      scrub = true
    } = config;

    useEffect(() => {
      if (!elementRef.current) return;

      const element = elementRef.current;
      
      let yValue = 0;
      if (direction === 'up') {
        yValue = -100 * speed;
      } else if (direction === 'down') {
        yValue = 100 * speed;
      }

      const animation = gsap.to(element, {
        y: yValue,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start,
          end,
          scrub: typeof scrub === 'number' ? scrub : 1
        }
      });

      return () => {
        animation.kill();
        ScrollTrigger.getAll().forEach(trigger => {
          if (trigger.trigger === element) {
            trigger.kill();
          }
        });
      };
    }, []);

    return elementRef;
  };

  // Slide in from specific direction
  const slideIn = (direction: 'left' | 'right' | 'top' | 'bottom', config: AnimationConfig = {}) => {
    const {
      duration = 1,
      delay = 0,
      ease = 'power2.out',
      once = true,
      start = 'top 80%',
      end = 'bottom 20%'
    } = config;

    useEffect(() => {
      if (!elementRef.current) return;

      const element = elementRef.current;
      
      // Set initial position based on direction
      const distance = 100;
      let initialX = 0;
      let initialY = 0;
      
      switch (direction) {
        case 'left':
          initialX = -distance;
          break;
        case 'right':
          initialX = distance;
          break;
        case 'top':
          initialY = -distance;
          break;
        case 'bottom':
          initialY = distance;
          break;
      }

      gsap.set(element, { 
        opacity: 0,
        x: initialX,
        y: initialY
      });

      const animation = gsap.to(element, {
        opacity: 1,
        x: 0,
        y: 0,
        duration,
        delay,
        ease,
        scrollTrigger: {
          trigger: element,
          start,
          end,
          once,
          toggleActions: once ? 'play none none none' : 'play none none reverse'
        }
      });

      return () => {
        animation.kill();
        ScrollTrigger.getAll().forEach(trigger => {
          if (trigger.trigger === element) {
            trigger.kill();
          }
        });
      };
    }, []);

    return elementRef;
  };

  // Rotate animation
  const rotateIn = (config: AnimationConfig = {}) => {
    const {
      duration = 1,
      delay = 0,
      ease = 'back.out(1.7)',
      once = true,
      start = 'top 80%',
      end = 'bottom 20%'
    } = config;

    useEffect(() => {
      if (!elementRef.current) return;

      const element = elementRef.current;

      gsap.set(element, { 
        opacity: 0,
        rotation: -180,
        scale: 0.5
      });

      const animation = gsap.to(element, {
        opacity: 1,
        rotation: 0,
        scale: 1,
        duration,
        delay,
        ease,
        scrollTrigger: {
          trigger: element,
          start,
          end,
          once,
          toggleActions: once ? 'play none none none' : 'play none none reverse'
        }
      });

      return () => {
        animation.kill();
        ScrollTrigger.getAll().forEach(trigger => {
          if (trigger.trigger === element) {
            trigger.kill();
          }
        });
      };
    }, []);

    return elementRef;
  };

  return {
    elementRef,
    fadeIn,
    scaleIn,
    staggerIn,
    parallax,
    slideIn,
    rotateIn
  };
};

// Hook for page load animations
export const usePageLoad = () => {
  useEffect(() => {
    // Set initial state for all animated elements
    gsap.set('[data-animate]', { opacity: 0 });
    
    // Create master timeline for page load
    const tl = gsap.timeline();
    
    // Animate elements with data-animate attribute
    tl.to('[data-animate]', {
      opacity: 1,
      duration: 1,
      stagger: 0.1,
      ease: 'power2.out'
    });

    return () => {
      tl.kill();
    };
  }, []);
};

// Hook for responsive animations
export const useResponsiveAnimation = () => {
  useEffect(() => {
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
};
