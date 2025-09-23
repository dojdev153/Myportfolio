
import { User, MapPin, Mail, Phone, Calendar, Code2, Zap } from 'lucide-react';

const Profile = () => {
  return (
    <section className="py-20 px-4 relative" id="profile">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-cyber font-bold mb-4">
            <span className="bg-gradient-to-r from-cyber-green to-cyber-blue bg-clip-text text-transparent glow-text">
              Profile
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyber-green to-cyber-blue mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Profile Image Section */}
          <div className="relative">
            <div className="hologram p-8 rounded-lg text-center">
              {/* Profile Image Container */}
              <div className="relative mb-8">
                <div className="w-64 h-64 mx-auto relative">
                  {/* Outer glowing ring */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-green rounded-full p-2 animate-pulse-neon">
                    <div className="w-full h-full bg-cyber-dark rounded-full"></div>
                  </div>
                  
                  {/* Inner profile placeholder */}
                  <div className="absolute inset-4 bg-gradient-to-br from-cyber-blue/20 to-cyber-purple/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <img
                      src="/profile.png"
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                      />
                  </div>
                  <div className="absolute inset-4 z-20 rounded-full bg-cyber-blue/10 backdrop-blur-xm border border-cyber-blue/20 pointer-events-none"></div>
                  
                  {/* Status indicator */}
                  <div className="absolute bottom-4 right-4 w-8 h-8 bg-cyber-green rounded-full animate-pulse flex items-center justify-center">
                    <div className="w-4 h-4 bg-cyber-green rounded-full animate-ping"></div>
                  </div>
                  
                  {/* Floating decorative elements */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 border-2 border-cyber-pink/50 rounded-full animate-float"></div>
                  <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-cyber-yellow/30 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
                </div>
              </div>

              {/* View Projects Button */}
              <a href="#projects" className="cyber-button mb-6 inline-flex items-center gap-2">
                <Code2 size={20} />
                View Projects
              </a>

              {/* Profile Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 border border-cyber-blue/30 rounded-lg hover:bg-cyber-blue/10 transition-colors">
                  <div className="text-2xl font-cyber font-bold text-cyber-blue">1+</div>
                  <div className="text-xs text-gray-400">Years</div>
                </div>
                <div className="text-center p-4 border border-cyber-purple/30 rounded-lg hover:bg-cyber-purple/10 transition-colors">
                  <div className="text-2xl font-cyber font-bold text-cyber-purple">10+</div>
                  <div className="text-xs text-gray-400">Projects</div>
                </div>
                <div className="text-center p-4 border border-cyber-green/30 rounded-lg hover:bg-cyber-green/10 transition-colors">
                  <div className="text-2xl font-cyber font-bold text-cyber-green">100%</div>
                  <div className="text-xs text-gray-400">Passion</div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            <div className="hologram p-8 rounded-lg">
              <h3 className="text-2xl font-cyber font-bold text-cyber-blue mb-6 flex items-center gap-3">
                <Zap className="text-cyber-yellow" />
                Personal Information
              </h3>
              
              <div className="space-y-4">
                {/* Name */}
                <div className="flex items-center gap-4 p-4 bg-cyber-dark/50 rounded-lg border border-cyber-blue/20 hover:border-cyber-blue/50 transition-colors">
                  <User className="text-cyber-blue flex-shrink-0" size={20} />
                  <div>
                    <div className="text-sm text-gray-400">Full Name</div>
                    <div className="text-white font-tech font-semibold">HITAYEZU Frank Duff</div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-4 p-4 bg-cyber-dark/50 rounded-lg border border-cyber-purple/20 hover:border-cyber-purple/50 transition-colors">
                  <Mail className="text-cyber-purple flex-shrink-0" size={20} />
                  <div>
                    <div className="text-sm text-gray-400">Email</div>
                    <div className="text-white font-tech font-semibold">frankduffhitayezufrank@gmail.com</div>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-4 p-4 bg-cyber-dark/50 rounded-lg border border-cyber-green/20 hover:border-cyber-green/50 transition-colors">
                  <Phone className="text-cyber-green flex-shrink-0" size={20} />
                  <div>
                    <div className="text-sm text-gray-400">Phone</div>
                    <div className="text-white font-tech font-semibold">+250 788 442 902</div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-4 p-4 bg-cyber-dark/50 rounded-lg border border-cyber-pink/20 hover:border-cyber-pink/50 transition-colors">
                  <MapPin className="text-cyber-pink flex-shrink-0" size={20} />
                  <div>
                    <div className="text-sm text-gray-400">Location</div>
                    <div className="text-white font-tech font-semibold">Kigali, Rwanda</div>
                  </div>
                </div>

                {/* Availability */}
                <div className="flex items-center gap-4 p-4 bg-cyber-dark/50 rounded-lg border border-cyber-yellow/20 hover:border-cyber-yellow/50 transition-colors">
                  <Calendar className="text-cyber-yellow flex-shrink-0" size={20} />
                  <div>
                    <div className="text-sm text-gray-400">Availability</div>
                    <div className="text-white font-tech font-semibold flex items-center gap-2">
                      <span className="w-2 h-2 bg-cyber-green rounded-full animate-pulse"></span>
                      Available for Projects
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-4">
              <button className="cyber-button flex-1">
                <Mail size={20} />
                Contact Me
              </button>
              <button className="cyber-button flex-1 bg-gradient-to-r from-cyber-green to-cyber-blue">
                <User size={20} />
                View Resume
              </button>
            </div>
          </div>
        </div>

        {/* Floating decorative elements */}
        <div className="absolute top-20 right-10 w-20 h-20 border border-cyber-blue/30 rounded-full animate-float"></div>
        <div className="absolute bottom-10 left-10 w-16 h-16 bg-gradient-to-r from-cyber-purple/20 to-cyber-pink/20 transform rotate-45 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
    </section>
  );
};

export default Profile;
