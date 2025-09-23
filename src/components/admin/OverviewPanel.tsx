import { useState, useEffect } from 'react';
import { 
  Mail, 
  FolderOpen, 
  Eye, 
  Heart, 
  TrendingUp, 
  Users, 
  MessageCircle,
  Activity,
  Calendar,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { adminAPI, analyticsAPI } from '../../lib/api';

interface OverviewData {
  totalContacts: number;
  unreadContacts: number;
  totalProjects: number;
  featuredProjects: number;
  recentContacts: any[];
  recentAnalytics: any[];
  monthlyStats: any[];
}

const OverviewPanel = () => {
  const [data, setData] = useState<OverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOverviewData = async () => {
      try {
        setIsLoading(true);
        const response = await adminAPI.getOverview();
        
        if (response.success) {
          setData(response.overview);
        } else {
          throw new Error(response.message || 'Failed to load overview data');
        }
      } catch (error: any) {
        console.error('Overview data error:', error);
        setError(error.message || 'Failed to load overview data');
        
        // Set mock data for demonstration
        setData({
          totalContacts: 12,
          unreadContacts: 3,
          totalProjects: 4,
          featuredProjects: 3,
          recentContacts: [],
          recentAnalytics: [],
          monthlyStats: []
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadOverviewData();
  }, []);

  // Stats cards configuration
  const statsCards = [
    {
      title: 'Total Messages',
      value: data?.totalContacts || 0,
      change: '+12%',
      changeType: 'positive',
      icon: Mail,
      color: 'cyber-green',
      description: 'Contact form submissions'
    },
    {
      title: 'Unread Messages',
      value: data?.unreadContacts || 0,
      change: '+3 new',
      changeType: 'neutral',
      icon: MessageCircle,
      color: 'cyber-blue',
      description: 'Pending responses'
    },
    {
      title: 'Total Projects',
      value: data?.totalProjects || 0,
      change: '+2 this month',
      changeType: 'positive',
      icon: FolderOpen,
      color: 'cyber-purple',
      description: 'Portfolio projects'
    },
    {
      title: 'Featured Projects',
      value: data?.featuredProjects || 0,
      change: '75% of total',
      changeType: 'neutral',
      icon: Heart,
      color: 'cyber-pink',
      description: 'Highlighted projects'
    }
  ];

  const quickActions = [
    {
      title: 'View Messages',
      description: 'Check new contact submissions',
      icon: Mail,
      color: 'cyber-green',
      action: () => console.log('View Messages')
    },
    {
      title: 'Add Project',
      description: 'Create a new portfolio project',
      icon: FolderOpen,
      color: 'cyber-blue',
      action: () => console.log('Add Project')
    },
    {
      title: 'View Analytics',
      description: 'Check portfolio performance',
      icon: TrendingUp,
      color: 'cyber-purple',
      action: () => console.log('View Analytics')
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-cyber-blue/30 border-t-cyber-blue rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-tech">Loading overview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-cyber font-bold text-cyber-blue mb-2">
          Welcome to your Admin Portal
        </h2>
        <p className="text-gray-400 font-tech">
          Manage your portfolio, track visitor engagement, and handle communications.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((card, index) => (
          <div
            key={card.title}
            className="hologram rounded-lg p-6 hover:scale-105 transition-all duration-300"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 bg-${card.color}/20 rounded-lg flex items-center justify-center`}>
                <card.icon size={24} className={`text-${card.color}`} />
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                card.changeType === 'positive' ? 'text-cyber-green' :
                card.changeType === 'negative' ? 'text-red-400' : 'text-gray-400'
              }`}>
                {card.changeType === 'positive' && <ArrowUp size={14} />}
                {card.changeType === 'negative' && <ArrowDown size={14} />}
                <span className="font-tech">{card.change}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-cyber font-bold text-white">
                {card.value}
              </h3>
              <p className="font-tech text-sm text-gray-300">{card.title}</p>
              <p className="font-tech text-xs text-gray-500">{card.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="hologram rounded-lg p-6">
          <h3 className="text-lg font-cyber font-bold text-cyber-blue mb-4 flex items-center gap-2">
            <Activity size={20} />
            Quick Actions
          </h3>
          
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <button
                key={action.title}
                onClick={action.action}
                className={`w-full p-4 bg-${action.color}/10 border border-${action.color}/20 rounded-lg hover:bg-${action.color}/20 transition-all duration-300 text-left group`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-${action.color}/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <action.icon size={18} className={`text-${action.color}`} />
                  </div>
                  <div>
                    <h4 className="font-tech font-semibold text-white">{action.title}</h4>
                    <p className="text-sm text-gray-400 font-tech">{action.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="hologram rounded-lg p-6">
          <h3 className="text-lg font-cyber font-bold text-cyber-green mb-4 flex items-center gap-2">
            <Calendar size={20} />
            Recent Activity
          </h3>
          
          <div className="space-y-4">
            {data?.recentContacts && data.recentContacts.length > 0 ? (
              data.recentContacts.map((contact: any, index: number) => (
                <div key={contact._id || index} className="flex items-center gap-3 p-3 bg-cyber-green/5 rounded-lg">
                  <div className="w-8 h-8 bg-cyber-green/20 rounded-full flex items-center justify-center">
                    <Mail size={14} className="text-cyber-green" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-tech text-white truncate">{contact.name}</p>
                    <p className="text-xs text-gray-400 font-tech truncate">{contact.subject}</p>
                  </div>
                  <span className="text-xs text-gray-500 font-tech">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Activity size={20} className="text-gray-500" />
                </div>
                <p className="text-gray-500 font-tech text-sm">No recent activity</p>
                <p className="text-gray-600 font-tech text-xs mt-1">
                  Activity will appear here as visitors interact with your portfolio
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="hologram rounded-lg p-6">
        <h3 className="text-lg font-cyber font-bold text-cyber-purple mb-4 flex items-center gap-2">
          <Activity size={20} />
          System Status
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-cyber-green/10 rounded-lg">
            <div className="w-3 h-3 bg-cyber-green rounded-full animate-pulse"></div>
            <div>
              <p className="font-tech text-sm text-white">API Server</p>
              <p className="font-tech text-xs text-cyber-green">Online</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-cyber-blue/10 rounded-lg">
            <div className="w-3 h-3 bg-cyber-blue rounded-full animate-pulse"></div>
            <div>
              <p className="font-tech text-sm text-white">Database</p>
              <p className="font-tech text-xs text-cyber-blue">Connected</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-cyber-yellow/10 rounded-lg">
            <div className="w-3 h-3 bg-cyber-yellow rounded-full animate-pulse"></div>
            <div>
              <p className="font-tech text-sm text-white">Email Service</p>
              <p className="font-tech text-xs text-cyber-yellow">Needs Setup</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="hologram rounded-lg p-6 border-red-500/30 bg-red-500/5">
          <p className="text-red-400 font-tech text-sm">
            ⚠️ {error}
          </p>
          <p className="text-gray-500 font-tech text-xs mt-2">
            Some features may not work without proper backend configuration.
          </p>
        </div>
      )}
    </div>
  );
};

export default OverviewPanel;
