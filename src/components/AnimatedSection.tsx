import React, { ReactNode } from 'react';
import { useGSAP } from '../hooks/useGSAP';

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: 'fadeIn' | 'scaleIn' | 'slideIn' | 'staggerIn';
  direction?: 'left' | 'right' | 'top' | 'bottom';
  delay?: number;
  duration?: number;
  className?: string;
  id?: string;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  animation = 'fadeIn',
  direction = 'bottom',
  delay = 0,
  duration = 1,
  className = '',
  id
}) => {
  const { elementRef, fadeIn, scaleIn, slideIn, staggerIn } = useGSAP();

  React.useEffect(() => {
    const config = { delay, duration, once: true };

    switch (animation) {
      case 'fadeIn':
        fadeIn({ ...config, from: direction, distance: 50 });
        break;
      case 'scaleIn':
        scaleIn(config);
        break;
      case 'slideIn':
        slideIn(direction, config);
        break;
      case 'staggerIn':
        staggerIn({ ...config, stagger: 0.2 });
        break;
    }
  }, [animation, direction, delay, duration, fadeIn, scaleIn, slideIn, staggerIn]);

  return (
    <div
      ref={elementRef}
      className={className}
      id={id}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
