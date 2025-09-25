
import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState('frontend');
  
  // Animation refs
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const radarRef = useRef<HTMLDivElement>(null);
  const skillsListRef = useRef<HTMLDivElement>(null);
  const categorySelectorRef = useRef<HTMLDivElement>(null);

  const skillCategories = {
    frontend: {
      title: 'Frontend',
      color: 'cyber-blue',
      skills: [
        { name: 'React', level: 75 },
        { name: 'TypeScript', level: 65 },
        { name: 'Next.js', level: 60 },
        { name: 'Tailwind CSS', level: 80 },
        { name: 'JavaScript', level: 78 },
        { name: 'CSS/HTML', level: 85 }
      ]
    },
    backend: {
      title: 'Backend',
      color: 'cyber-purple',
      skills: [
        { name: 'Node.js', level: 68 },
        { name: 'Python', level: 60 },
        { name: 'PostgreSQL', level: 55 },
        { name: 'MongoDB', level: 62 },
        { name: 'REST APIs', level: 70 },
        { name: 'Express.js', level: 65 }
      ]
    },
    tools: {
      title: 'Tools & Design',
      color: 'cyber-green',
      skills: [
        { name: 'Figma', level: 70 },
        { name: 'Git', level: 80 },
        { name: 'VS Code', level: 85 },
        { name: 'Photoshop', level: 65 },
        { name: 'Responsive Design', level: 75 },
        { name: 'Problem Solving', level: 80 }
      ]
    }
  };

  // GSAP animations
  useEffect(() => {
    if (!sectionRef.current || !headerRef.current || !radarRef.current || !skillsListRef.current || !categorySelectorRef.current) return;

    // Set initial states
    gsap.set(headerRef.current, { opacity: 0, y: 50 });
    gsap.set(categorySelectorRef.current, { opacity: 0, y: 30 });
    gsap.set(radarRef.current, { opacity: 0, scale: 0.5, rotation: -180 });
    gsap.set(skillsListRef.current.children, { opacity: 0, y: 30 });

    // Create timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        once: true
      }
    });

    // Animate header
    tl.to(headerRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.out'
    });

    // Animate category selector
    tl.to(categorySelectorRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.5');

    // Animate radar chart with rotation and scale
    tl.to(radarRef.current, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 1.2,
      ease: 'back.out(1.7)'
    }, '-=0.3');

    // Animate skills list with stagger
    tl.to(skillsListRef.current.children, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out'
    }, '-=0.5');

    // Cleanup
    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === sectionRef.current) {
          trigger.kill();
        }
      });
    };
  }, []);

  // Animate radar points when category changes
  useEffect(() => {
    if (!radarRef.current) return;

    const radarPoints = radarRef.current.querySelectorAll('[data-radar-point]');
    
    gsap.fromTo(radarPoints, 
      { scale: 0, opacity: 0 },
      { 
        scale: 1, 
        opacity: 1, 
        duration: 0.5, 
        stagger: 0.1, 
        ease: 'back.out(1.7)' 
      }
    );
  }, [activeCategory]);

  return (
    <section ref={sectionRef} className="py-20 px-4 relative" id="skills">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-cyber font-bold mb-4">
            <span className="bg-gradient-to-r from-cyber-purple to-cyber-green bg-clip-text text-transparent glow-text">
              Skills Matrix
            </span>
          </h2>
          <p className="text-xl text-gray-400 font-tech">
            Technical abilities and creative expertise
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-cyber-purple to-cyber-green mx-auto rounded-full mt-4"></div>
        </div>

        {/* Category Selector */}
        <div ref={categorySelectorRef} className="flex justify-center mb-12">
          <div className="hologram rounded-lg p-2 flex gap-2">
            {Object.entries(skillCategories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`px-6 py-3 rounded-lg font-tech font-semibold transition-all duration-300 ${
                  activeCategory === key
                    ? `bg-${category.color} text-cyber-dark shadow-[0_0_20px_rgba(0,217,255,0.5)]`
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {category.title}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Display */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Holographic Radar Chart */}
          <div ref={radarRef} className="relative">
            <div className="hologram rounded-full p-8 aspect-square flex items-center justify-center">
              <div className="relative w-80 h-80">
                {/* Radar rings */}
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute border border-${skillCategories[activeCategory].color}/30 rounded-full`}
                    style={{
                      width: `${(i + 1) * 20}%`,
                      height: `${(i + 1) * 20}%`,
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                ))}
                
                {/* Radar lines */}
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-px h-40 bg-${skillCategories[activeCategory].color}/30 origin-bottom`}
                    style={{
                      bottom: '50%',
                      left: '50%',
                      transform: `translateX(-50%) rotate(${i * 60}deg)`
                    }}
                  />
                ))}

                {/* Center point */}
                <div className={`absolute w-4 h-4 bg-${skillCategories[activeCategory].color} rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse-neon`} />
                
                {/* Skill points */}
                {skillCategories[activeCategory].skills.map((skill, index) => {
                  const angle = (index * 60) * (Math.PI / 180);
                  const radius = (skill.level / 100) * 150;
                  const x = Math.sin(angle) * radius;
                  const y = -Math.cos(angle) * radius;
                  
                  return (
                    <div
                      key={skill.name}
                      data-radar-point
                      className={`absolute w-3 h-3 bg-${skillCategories[activeCategory].color} rounded-full transform -translate-x-1/2 -translate-y-1/2`}
                      style={{
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Skills List */}
          <div ref={skillsListRef} className="space-y-6">
            {skillCategories[activeCategory].skills.map((skill, index) => (
              <div 
                key={skill.name}
                className=""
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-tech font-semibold text-white">{skill.name}</span>
                  <span className={`text-${skillCategories[activeCategory].color} font-cyber font-bold`}>
                    {skill.level}%
                  </span>
                </div>
                
                <div className="relative h-3 bg-cyber-dark rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r from-${skillCategories[activeCategory].color} to-${skillCategories[activeCategory].color}/60 rounded-full transition-all duration-1000 ease-out relative`}
                    style={{ width: `${skill.level}%` }}
                  >
                    {/* Animated glow effect */}
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                  
                  {/* Skill bar glow */}
                  <div 
                    className={`absolute top-0 h-full bg-${skillCategories[activeCategory].color} opacity-50 blur-sm transition-all duration-1000 ease-out`}
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}

            {activeCategory === 'tools' && (
              <div className="pt-4">
                <a
                  href="/design-portfolio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 px-6 py-3 rounded-lg font-tech font-semibold bg-cyber-green text-cyber-dark hover:opacity-90 transition"
                >
                  View Design Portfolio
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Floating decorative elements */}
        <div className="absolute top-40 right-10 w-20 h-20 border-2 border-cyber-purple/30 rounded-lg transform rotate-45 animate-float"></div>
        <div className="absolute bottom-20 left-20 w-16 h-16 bg-gradient-to-r from-cyber-green/20 to-cyber-blue/20 rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
      </div>
    </section>
  );
};

export default Skills;
