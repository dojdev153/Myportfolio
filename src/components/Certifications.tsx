import React from 'react';

const Certifications: React.FC = () => {
  const items = [
    '2nd position in the national competition of iDebate',
    'Winners of the iDebate at GSSB',
    'Certification of completion of Code Alliance'
  ];

  return (
    <section className="py-20 px-4 relative" id="certifications">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-cyber font-bold mb-4">
            <span className="bg-gradient-to-r from-cyber-blue to-cyber-green bg-clip-text text-transparent glow-text">
              Certifications & Rewards
            </span>
          </h2>
          <p className="text-xl text-gray-400 font-tech">Recognitions and achievements</p>
          <div className="w-24 h-1 bg-gradient-to-r from-cyber-blue to-cyber-green mx-auto rounded-full mt-4"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((text) => (
            <div key={text} className="hologram rounded-xl p-6">
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 rounded-full bg-cyber-green mt-1 animate-pulse-neon"></div>
                <p className="font-tech text-gray-200">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;


