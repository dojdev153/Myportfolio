import { useState, useEffect } from 'react';
import { FolderOpen, Plus, Edit, Trash2, Eye, Star, ExternalLink } from 'lucide-react';
import { projectsAPI } from '../../lib/api';

const ProjectsPanel = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const response = await projectsAPI.getAll({ limit: 50 });
      
      if (response.success) {
        setProjects(response.projects);
      } else {
        throw new Error(response.message || 'Failed to load projects');
      }
    } catch (error: any) {
      console.error('Projects loading error:', error);
      // Set mock data
      setProjects([
        {
          _id: '1',
          title: 'CyberCommerce Platform',
          description: 'Full-stack e-commerce solution',
          technologies: ['React', 'Node.js', 'MongoDB'],
          category: 'fullstack',
          featured: true,
          status: 'completed',
          views: 150,
          likes: 25
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-cyber-blue/30 border-t-cyber-blue rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-tech">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-cyber font-bold text-cyber-purple mb-2">
            Projects Management
          </h2>
          <p className="text-gray-400 font-tech">
            Manage your portfolio projects and showcase your work
          </p>
        </div>
        
        <button className="cyber-button flex items-center gap-2">
          <Plus size={18} />
          Add Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project._id} className="hologram rounded-lg p-6 hover:scale-105 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${project.featured ? 'bg-cyber-yellow' : 'bg-gray-500'}`}></div>
                <span className={`text-xs font-tech ${project.featured ? 'text-cyber-yellow' : 'text-gray-500'}`}>
                  {project.featured ? 'Featured' : 'Standard'}
                </span>
              </div>
              
              <div className="flex gap-1">
                <button className="p-1 text-cyber-blue hover:bg-cyber-blue/10 rounded">
                  <Edit size={14} />
                </button>
                <button className="p-1 text-red-400 hover:bg-red-500/10 rounded">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-cyber font-bold text-white mb-2">
              {project.title}
            </h3>
            
            <p className="text-sm text-gray-400 font-tech mb-4 line-clamp-3">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-1 mb-4">
              {project.technologies?.slice(0, 3).map((tech: string, index: number) => (
                <span key={index} className="px-2 py-1 text-xs bg-cyber-blue/10 text-cyber-blue rounded font-tech">
                  {tech}
                </span>
              ))}
              {project.technologies?.length > 3 && (
                <span className="px-2 py-1 text-xs bg-gray-500/10 text-gray-500 rounded font-tech">
                  +{project.technologies.length - 3} more
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Eye size={12} />
                  <span>{project.views || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={12} />
                  <span>{project.likes || 0}</span>
                </div>
              </div>
              
              <span className={`px-2 py-1 rounded text-xs ${
                project.status === 'completed' ? 'bg-cyber-green/10 text-cyber-green' :
                project.status === 'in-progress' ? 'bg-cyber-yellow/10 text-cyber-yellow' :
                'bg-gray-500/10 text-gray-500'
              }`}>
                {project.status}
              </span>
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="w-16 h-16 bg-cyber-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderOpen size={24} className="text-cyber-purple" />
            </div>
            <h3 className="text-lg font-cyber font-bold text-cyber-purple mb-2">
              No Projects Yet
            </h3>
            <p className="text-gray-400 font-tech text-sm mb-4">
              Create your first project to showcase your work
            </p>
            <button className="cyber-button">
              <Plus size={18} />
              Add First Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPanel;
