import React from 'react';

const ResumeSection: React.FC = () => {
  return (
    <section className="py-20 px-4 relative" id="resume">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-6xl font-cyber font-bold mb-4">
            <span className="bg-gradient-to-r from-cyber-purple to-cyber-blue bg-clip-text text-transparent glow-text">
              Resume
            </span>
          </h2>
          <p className="text-xl text-gray-400 font-tech">View or download my CV</p>
          <div className="w-24 h-1 bg-gradient-to-r from-cyber-purple to-cyber-blue mx-auto rounded-full mt-4"></div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 rounded-lg font-tech font-semibold bg-cyber-blue text-cyber-dark hover:opacity-90 transition"
          >
            View Resume
          </a>
          <a
            href="/resume.pdf"
            download
            className="px-8 py-3 rounded-lg font-tech font-semibold bg-cyber-green text-cyber-dark hover:opacity-90 transition "
          >
            Download Resume
          </a>
        </div>
      </div>
    </section>
  );
};

export default ResumeSection;


