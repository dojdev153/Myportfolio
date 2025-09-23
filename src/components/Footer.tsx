
const Footer = () => {
  return (
    <footer className="py-12 px-4 border-t border-cyber-blue/30 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Brand */}
          <div>
            <div className="font-cyber font-bold text-2xl mb-4">
              <span className="text-cyber-blue glow-text">doj</span>
              <span className="text-cyber-purple">dev</span>
            </div>
            <p className="text-gray-400 font-tech">
              Building the future, one line of code at a time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-cyber font-bold text-cyber-green mb-4">Quick Links</h4>
            <div className="space-y-2">
              {['About', 'Projects', 'Skills', 'Contact'].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="block text-gray-400 hover:text-cyber-blue font-tech transition-colors duration-300"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-cyber font-bold text-cyber-pink mb-4">Get In Touch</h4>
            <div className="space-y-2 text-gray-400 font-tech">
              <p>frank.duff@dojdev.com</p>
              <p>+1 (555) 123-4567</p>
              <p>Kigali, Rwanda</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-cyber-blue/20 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 font-tech text-sm">
            © 2024 HITAYEZU Frank Duff. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            {['Privacy', 'Terms', 'Cookies'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-gray-400 hover:text-cyber-blue font-tech text-sm transition-colors duration-300"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative grid overlay */}
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none"></div>
    </footer>
  );
};

export default Footer;
