import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Mail, 
  FolderOpen, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Home,
  User,
  Activity,
  Database
} from 'lucide-react';
import { authAPI, adminAPI } from '../lib/api';

// Dashboard components
import ContactsPanel from '../components/admin/ContactsPanel';
import ProjectsPanel from '../components/admin/ProjectsPanel';
import AnalyticsPanel from '../components/admin/AnalyticsPanel';
import OverviewPanel from '../components/admin/OverviewPanel';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Navigation items
  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: Home, color: 'cyber-blue' },
    { id: 'contacts', label: 'Messages', icon: Mail, color: 'cyber-green' },
    { id: 'projects', label: 'Projects', icon: FolderOpen, color: 'cyber-purple' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'cyber-pink' },
  ];

  // Load admin info
  useEffect(() => {
    const loadAdminInfo = async () => {
      try {
        const response = await authAPI.getMe();
        if (response.success) {
          setAdminInfo(response.admin);
        } else {
          throw new Error('Failed to load admin info');
        }
      } catch (error) {
        console.error('Admin auth error:', error);
        navigate('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    loadAdminInfo();
  }, [navigate]);

  // Handle logout
  const handleLogout = () => {
    authAPI.logout();
    navigate('/admin/login');
  };

  // Render active panel
  const renderActivePanel = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewPanel />;
      case 'contacts':
        return <ContactsPanel />;
      case 'projects':
        return <ProjectsPanel />;
      case 'analytics':
        return <AnalyticsPanel />;
      default:
        return <OverviewPanel />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cyber-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyber-blue/30 border-t-cyber-blue rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyber-blue font-tech">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-dark text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 cyber-grid opacity-10 pointer-events-none"></div>

      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-cyber-darker border-r border-cyber-blue/20 transition-all duration-300 relative z-20`}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-cyber-blue/20">
              <div className="flex items-center justify-between">
                {sidebarOpen && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-lg flex items-center justify-center">
                      <Database size={16} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-cyber text-sm text-cyber-blue">Admin Portal</h3>
                      <p className="text-xs text-gray-400 font-tech">dojdev</p>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-1 hover:bg-cyber-blue/10 rounded transition-colors"
                >
                  {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                    activeTab === item.id
                      ? `bg-${item.color}/20 border border-${item.color}/30 text-${item.color}`
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon size={18} />
                  {sidebarOpen && (
                    <span className="font-tech font-medium">{item.label}</span>
                  )}
                </button>
              ))}
            </nav>

            {/* User Info & Logout */}
            <div className="p-4 border-t border-cyber-blue/20">
              {sidebarOpen && adminInfo && (
                <div className="mb-4 p-3 bg-cyber-blue/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-cyber-green to-cyber-blue rounded-full flex items-center justify-center">
                      <User size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-tech text-sm text-white truncate">{adminInfo.name}</p>
                      <p className="font-tech text-xs text-gray-400 truncate">{adminInfo.email}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-300"
              >
                <LogOut size={18} />
                {sidebarOpen && <span className="font-tech">Logout</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <header className="h-16 bg-cyber-darker/50 border-b border-cyber-blue/20 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-cyber font-bold text-cyber-blue">
                {navigationItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h1>
              <div className="flex items-center gap-2 text-xs text-gray-400 font-tech">
                <Activity size={12} />
                <span>Live</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-cyber-blue/10 hover:bg-cyber-blue/20 border border-cyber-blue/30 rounded-lg text-cyber-blue font-tech text-sm transition-all duration-300"
              >
                View Portfolio
              </button>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto p-6 bg-cyber-dark/50">
            <div className="max-w-7xl mx-auto">
              {renderActivePanel()}
            </div>
          </main>
        </div>
      </div>

      {/* Floating decorative elements */}
      <div className="fixed top-20 right-10 w-16 h-16 border border-cyber-pink/20 rounded-full animate-float pointer-events-none"></div>
      <div className="fixed bottom-20 left-20 w-12 h-12 bg-cyber-green/5 rounded-full animate-float pointer-events-none" style={{ animationDelay: '1s' }}></div>
    </div>
  );
};

export default AdminDashboard;
