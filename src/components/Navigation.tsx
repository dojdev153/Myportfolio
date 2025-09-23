
import { useState, useEffect } from 'react';
import { Menu, X, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-cyber-dark/90 backdrop-blur-lg border-b border-cyber-blue/30' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="font-cyber font-bold text-xl cursor-pointer"
            onClick={() => {
              const clicks = parseInt(sessionStorage.getItem('logoClicks') || '0') + 1;
              sessionStorage.setItem('logoClicks', clicks.toString());
              if (clicks >= 3) {
                setShowAdmin(true);
                sessionStorage.removeItem('logoClicks');
              }
              setTimeout(() => sessionStorage.removeItem('logoClicks'), 2000);
            }}
          >
            <span className="text-cyber-blue glow-text">doj</span>
            <span className="text-cyber-purple">dev</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-cyber-blue font-tech font-medium transition-all duration-300 relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyber-blue transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
            {showAdmin && (
              <button
                onClick={() => navigate('/admin/login')}
                className="text-cyber-pink hover:text-cyber-pink/80 font-tech font-medium transition-colors duration-300 flex items-center gap-1"
                title="Admin Panel"
              >
                <Shield size={14} />
                Admin
              </button>
            )}
            <button className="cyber-button !py-2 !px-4 !text-sm">
              Hire Me
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-cyber-blue hover:text-cyber-purple transition-colors duration-300"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="hologram rounded-lg m-4 p-4 space-y-4">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block text-gray-300 hover:text-cyber-blue font-tech font-medium transition-colors duration-300 py-2"
              >
                {item.name}
              </a>
            ))}
            <button 
              className="w-full cyber-button !py-2 !text-sm"
              onClick={() => setIsOpen(false)}
            >
              Hire Me
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
