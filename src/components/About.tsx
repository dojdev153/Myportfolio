
import { User, Code, Palette, Zap } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const About = () => {
  // Animation refs
  const sectionRef = useRef<HTMLElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const timelineItems = [
    {
      year: '2024',
      title: 'Started Coding Journey',
      description: 'Began learning programming fundamentals and web development',
      icon: Code
    },
    {
      year: 'Mid 2024',
      title: 'Frontend Development',
      description: 'Built solid foundation in React, HTML, CSS, and JavaScript',
      icon: Palette
    },
    {
      year: 'Late 2024',
      title: 'Full-Stack Learning',
      description: 'Explored backend technologies and database management',
      icon: Zap
    },
    {
      year: '2025',
      title: 'Building & Creating',
      description: 'Developing projects and expanding technical skills',
      icon: User
    }
  ];

  // GSAP animations
  useEffect(() => {
    if (!sectionRef.current || !profileRef.current || !timelineRef.current || !headerRef.current) return;

    // Set initial states
    gsap.set(headerRef.current, { opacity: 0, y: 50 });
    gsap.set(profileRef.current, { opacity: 0, x: -100 });
    gsap.set(timelineRef.current, { opacity: 0, x: 100 });

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

    // Animate profile and timeline simultaneously
    tl.to([profileRef.current, timelineRef.current], {
      opacity: 1,
      x: 0,
      duration: 1.2,
      ease: 'power2.out'
    }, '-=0.5');

    // Animate timeline items with stagger
    const timelineItems = timelineRef.current.querySelectorAll('.timeline-item');
    if (timelineItems.length > 0) {
      gsap.set(timelineItems, { opacity: 0, y: 30 });
      
      tl.to(timelineItems, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out'
      }, '-=0.3');
    }

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

  return (
    <section ref={sectionRef} className="py-20 px-4 relative" id="about">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-cyber font-bold mb-4">
            <span className="bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent glow-text">
              About Me
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyber-blue to-cyber-purple mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Profile Section */}
          <div ref={profileRef} className="hologram p-8 rounded-lg">
            <div className="relative mb-6">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-cyber-blue to-cyber-purple rounded-full p-1">
                <div className="w-full h-full bg-cyber-dark rounded-full flex items-center justify-center">
                  <User size={48} className="text-cyber-blue" />
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-cyber-green rounded-full animate-pulse-neon"></div>
            </div>
            
            <h3 className="text-2xl font-cyber font-bold text-center mb-4 text-cyber-blue">
              HITAYEZU Frank Duff
            </h3>
            
            <p className="text-gray-300 leading-relaxed mb-6">
              A passionate junior full-stack developer and creative technologist with a love for building 
              engaging digital experiences. I'm actively learning modern web technologies and have a 
              keen eye for clean, futuristic design aesthetics.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border border-cyber-blue/30 rounded-lg">
                <div className="text-2xl font-cyber font-bold text-cyber-blue">1+</div>
                <div className="text-sm text-gray-400">Year Experience</div>
              </div>
              <div className="text-center p-4 border border-cyber-purple/30 rounded-lg">
                <div className="text-2xl font-cyber font-bold text-cyber-purple">15+</div>
                <div className="text-sm text-gray-400">Projects Completed</div>
              </div>
            </div>
          </div>

          {/* Timeline Section */}
          <div ref={timelineRef} className="space-y-8">
            <h3 className="text-2xl font-cyber font-bold text-cyber-green mb-8">Journey Timeline</h3>
            
            {timelineItems.map((item, index) => (
              <div key={index} className="timeline-item relative pl-8">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-cyber-blue to-cyber-purple"></div>
                
                {/* Timeline node */}
                <div className="absolute left-0 top-0 w-8 h-8 bg-cyber-dark border-2 border-cyber-blue rounded-full flex items-center justify-center animate-pulse-neon">
                  <item.icon size={16} className="text-cyber-blue" />
                </div>
                
                {/* Content */}
                <div className="hologram p-6 rounded-lg ml-8 hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-cyber-green font-cyber font-bold text-lg">{item.year}</span>
                    <h4 className="text-white font-tech font-semibold">{item.title}</h4>
                  </div>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating decorative elements */}
        <div className="absolute top-10 right-10 w-24 h-24 border border-cyber-pink/30 rounded-full animate-float"></div>
        <div className="absolute bottom-20 left-20 w-16 h-16 bg-gradient-to-r from-cyber-blue/20 to-cyber-purple/20 transform rotate-45 animate-float" style={{ animationDelay: '1s' }}></div>
      </div>
    </section>
  );
};

export default About;
