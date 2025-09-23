
import { useEffect, useState } from 'react';

const Hero = () => {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const fullText = 'HITAYEZU Frank Duff';
  const nickname = 'dojdev';

  useEffect(() => {
    let currentIndex = 0;
    const typeText = () => {
      if (currentIndex < fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
        setTimeout(typeText, 100);
      }
    };
    typeText();

    // Cursor blinking effect
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden cyber-grid">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyber-blue rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="text-center z-10 max-w-4xl mx-auto px-4">
        {/* Main name with glitch effect */}
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-cyber font-black mb-4 relative">
          <span className="bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-pink bg-clip-text text-transparent glow-text">
            {displayText}
            {showCursor && <span className="animate-pulse">|</span>}
          </span>
          
          {/* Glitch layers */}
          <span 
            className="absolute inset-0 bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-pink bg-clip-text text-transparent opacity-50 animate-glitch"
            style={{ animationDelay: '0.1s' }}
          >
            {displayText}
          </span>
          <span 
            className="absolute inset-0 bg-gradient-to-r from-cyber-pink via-cyber-green to-cyber-blue bg-clip-text text-transparent opacity-30 animate-glitch"
            style={{ animationDelay: '0.2s' }}
          >
            {displayText}
          </span>
        </h1>

        {/* Nickname */}
        <div className="mb-8">
          <span className="text-lg md:text-xl text-cyber-green font-tech font-light">aka</span>
          <h2 className="text-2xl md:text-4xl lg:text-6xl font-cyber font-bold text-cyber-blue glow-text animate-pulse-neon rounded-full">
            {nickname}
          </h2>
        </div>

        {/* Subtitle */}
        <p className="text-lg md:text-xl lg:text-2xl text-gray-300 font-tech mb-12 animate-fade-in" style={{ animationDelay: '3s' }}>
          Junior Full-Stack Developer • Creative Technologist • Problem Solver
        </p>

        {/* Animated CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up" style={{ animationDelay: '4s' }}>
  <a href="#skills" className="cyber-button">
    View My Work
  </a>
  <a
    href="#contact"
    className="relative px-6 py-3 font-tech font-bold text-cyber-blue border-2 border-cyber-blue rounded-lg hover:bg-cyber-blue hover:text-cyber-dark transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(0,217,255,0.5)]"
  >
    Get In Touch
  </a>
</div>

        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 border border-cyber-purple opacity-30 animate-float" style={{ animationDelay: '1s' }}>
          <div className="w-full h-full border border-cyber-blue transform rotate-45"></div>
        </div>
        <div className="absolute bottom-20 right-10 w-16 h-16 border border-cyber-green opacity-40 animate-float" style={{ animationDelay: '2s' }}>
          <div className="w-full h-full bg-gradient-to-br from-cyber-pink to-transparent rounded-full"></div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-cyber-blue rounded-full flex justify-center">
          <div className="w-1 h-3 bg-cyber-blue rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
