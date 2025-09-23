
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import Profile from '../components/Profile';
import About from '../components/About';
import Projects from '../components/Projects';
import Skills from '../components/Skills';
import Certifications from '../components/Certifications';
import ResumeSection from '../components/ResumeSection';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-cyber-dark text-white overflow-x-hidden">
      {/* Navigation */}
      <Navigation />
      
      {/* Page Sections */}
      <div id="home">
        <Hero />
      </div>
      
      <div id="profile">
        <Profile />
      </div>
      
      <div id="about">
        <About />
      </div>
      
      <div id="projects">
        <Projects />
      </div>
      
      <div id="skills">
        <Skills />
      </div>

      <div id="certifications">
        <Certifications />
      </div>

      <div id="resume">
        <ResumeSection />
      </div>
      
      <div id="contact">
        <Contact />
      </div>
      
      {/* Footer */}
      <Footer />

      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-cyber-blue/5 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-3/4 right-20 w-40 h-40 bg-cyber-purple/5 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-cyber-green/5 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>
    </div>
  );
};

export default Index;
