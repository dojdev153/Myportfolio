import { useState, useEffect } from 'react';
import { ExternalLink, Github, Heart } from 'lucide-react';
import { projectsAPI, analyticsAPI } from '../lib/api';

interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  image: string;
  githubUrl?: string;
  liveUrl?: string;
  category: string;
  featured: boolean;
  status: string;
  views: number;
  likes: number;
  createdAt: string;
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const response = await projectsAPI.getAll({ featured: true, limit: 4 });
        
        if (response.success) {
          setProjects(response.projects);
        } else {
          throw new Error(response.message || 'Failed to fetch projects');
        }
      } catch (error: any) {
        console.error('Error fetching projects:', error);
        setError(error.message || 'Failed to load projects');
        
        // Fallback to static data if API fails
        setProjects(fallbackProjects);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();

    // Track page view
    analyticsAPI.track({
      event: 'page_view',
      page: '/projects'
    });
  }, []);

  // Handle project like
  const handleLike = async (projectId: string) => {
    try {
      const response = await projectsAPI.like(projectId);
      if (response.success) {
        setProjects(prev => prev.map(project => 
          project._id === projectId 
            ? { ...project, likes: response.likes }
            : project
        ));
      }
    } catch (error) {
      console.error('Error liking project:', error);
    }
  };

  // Fallback projects data
  const fallbackProjects: Project[] = [
    {
      _id: '1',
      title: 'CyberCommerce Platform',
      description: 'Full-stack e-commerce solution with modern UI and secure payment integration',
      technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
      image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80',
      githubUrl: '#',
      liveUrl: '#',
      category: 'fullstack',
      featured: true,
      status: 'completed',
      views: 0,
      likes: 0,
      createdAt: new Date().toISOString()
    },
    {
      _id: '2',
      title: 'Neural Network Visualizer',
      description: 'Interactive tool for visualizing deep learning architectures and training processes',
      technologies: ['Vue.js', 'D3.js', 'Python', 'FastAPI'],
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      githubUrl: '#',
      liveUrl: '#',
      category: 'frontend',
      featured: true,
      status: 'completed',
      views: 0,
      likes: 0,
      createdAt: new Date().toISOString()
    },
    {
      _id: '3',
      title: 'Real-time Analytics Dashboard',
      description: 'Modern dashboard with real-time data visualization and quantum-inspired design',
      technologies: ['Angular', 'TypeScript', 'WebGL', 'Socket.io'],
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      githubUrl: '#',
      liveUrl: '#',
      category: 'frontend',
      featured: false,
      status: 'completed',
      views: 0,
      likes: 0,
      createdAt: new Date().toISOString()
    },
    {
      _id: '4',
      title: 'Holographic Portfolio',
      description: 'This very portfolio showcasing advanced CSS animations and modern React architecture',
      technologies: ['React', 'Tailwind CSS', 'Node.js', 'MongoDB'],
      image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=800&q=80',
      githubUrl: '#',
      liveUrl: '#',
      category: 'fullstack',
      featured: true,
      status: 'completed',
      views: 0,
      likes: 0,
      createdAt: new Date().toISOString()
    }
  ];

  return (
    <section className="py-20 px-4 relative" id="projects">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-cyber font-bold mb-4">
            <span className="bg-gradient-to-r from-cyber-green to-cyber-blue bg-clip-text text-transparent glow-text">
              Projects
            </span>
          </h2>
          <p className="text-xl text-gray-400 font-tech">
            Exploring the boundaries of technology and creativity
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-cyber-green to-cyber-blue mx-auto rounded-full mt-4"></div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3 text-cyber-blue">
              <div className="w-6 h-6 border-2 border-cyber-blue/30 border-t-cyber-blue rounded-full animate-spin"></div>
              <span className="font-tech">Loading projects...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-12">
            <div className="text-red-400 font-tech">
              {error === 'Failed to load projects' ? 'Using offline data' : error}
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {!isLoading && (
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <div 
                key={project._id}
                className="group hologram rounded-lg overflow-hidden hover:scale-105 transition-all duration-500 animate-scale-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
              {/* Project Image */}
              <div className="relative overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark via-transparent to-transparent opacity-60"></div>
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-cyber-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex gap-4">
                    {project.githubUrl && project.githubUrl !== '#' && (
                      <a 
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-cyber-dark/80 rounded-full hover:bg-cyber-blue hover:scale-110 transition-all duration-300"
                      >
                        <Github size={20} className="text-white" />
                      </a>
                    )}
                    {project.liveUrl && project.liveUrl !== '#' && (
                      <a 
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-cyber-dark/80 rounded-full hover:bg-cyber-green hover:scale-110 transition-all duration-300"
                      >
                        <ExternalLink size={20} className="text-white" />
                      </a>
                    )}
                    <button 
                      onClick={() => handleLike(project._id)}
                      className="p-3 bg-cyber-dark/80 rounded-full hover:bg-cyber-pink hover:scale-110 transition-all duration-300 group/like"
                    >
                      <Heart size={20} className="text-white group-hover/like:text-cyber-pink transition-colors" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-6">
                <h3 className="text-xl font-cyber font-bold text-cyber-blue mb-2 group-hover:glow-text transition-all duration-300">
                  {project.title}
                </h3>
                <p className="text-gray-400 mb-4 leading-relaxed">
                  {project.description}
                </p>
                
                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, techIndex) => (
                    <span 
                      key={techIndex}
                      className="px-3 py-1 text-xs bg-gradient-to-r from-cyber-purple/20 to-cyber-blue/20 border border-cyber-purple/30 rounded-full text-cyber-blue font-tech font-medium hover:scale-105 transition-transform duration-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                {/* Project Stats */}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-cyber-green animate-pulse"></div>
                    <span>{project.views} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart size={12} className="text-cyber-pink" />
                    <span>{project.likes} likes</span>
                  </div>
                </div>
              </div>

              {/* Glowing border effect */}
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute inset-0 rounded-lg border-2 border-cyber-blue animate-pulse-neon"></div>
              </div>
                {/* Glowing border effect */}
                <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute inset-0 rounded-lg border-2 border-cyber-blue animate-pulse-neon"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View More Button */}
        <div className="text-center mt-12">
          <button className="cyber-button">
            View All Projects
          </button>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 border border-cyber-green/20 transform rotate-45 animate-float"></div>
      <div className="absolute bottom-40 right-20 w-20 h-20 bg-gradient-to-br from-cyber-purple/10 to-cyber-pink/10 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
    </section>
  );
};

export default Projects;
