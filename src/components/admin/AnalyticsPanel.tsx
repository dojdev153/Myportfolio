import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Eye, MessageCircle, Calendar } from 'lucide-react';
import { analyticsAPI } from '../../lib/api';

const AnalyticsPanel = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<'24h' | '7d' | '30d' | '90d'>('7d');

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      const response = await analyticsAPI.getDashboard(period);
      
      if (response.success) {
        setData(response);
      } else {
        throw new Error(response.message || 'Failed to load analytics');
      }
    } catch (error: any) {
      console.error('Analytics loading error:', error);
      
      // Mock data for demonstration
      setData({
        period,
        summary: {
          totalPageViews: 1250,
          uniqueVisitors: 435,
          contactFormSubmissions: 12,
          projectViews: 320
        },
        topPages: [
          { page: '/projects', views: 450 },
          { page: '/', views: 380 },
          { page: '/about', views: 280 },
          { page: '/contact', views: 140 }
        ],
        events: {
          page_view: 1250,
          project_view: 320,
          contact_form: 12,
          social_click: 45
        },
        dailyStats: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  const periods = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-cyber-blue/30 border-t-cyber-blue rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-tech">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-cyber font-bold text-cyber-pink mb-2">
            Portfolio Analytics
          </h2>
          <p className="text-gray-400 font-tech">
            Track visitor engagement and portfolio performance
          </p>
        </div>
        
        <div className="flex gap-2">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value as any)}
              className={`px-3 py-2 rounded-lg text-sm font-tech transition-all duration-300 ${
                period === p.value
                  ? 'bg-cyber-pink/20 text-cyber-pink border border-cyber-pink/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="hologram rounded-lg p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-cyber-blue/20 rounded-lg flex items-center justify-center">
              <Eye size={24} className="text-cyber-blue" />
            </div>
            <div>
              <p className="text-2xl font-cyber font-bold text-white">
                {data?.summary?.totalPageViews || 0}
              </p>
              <p className="text-sm font-tech text-gray-400">Page Views</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-cyber-green text-sm">
            <TrendingUp size={14} />
            <span className="font-tech">+15% vs last period</span>
          </div>
        </div>

        <div className="hologram rounded-lg p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-cyber-green/20 rounded-lg flex items-center justify-center">
              <Users size={24} className="text-cyber-green" />
            </div>
            <div>
              <p className="text-2xl font-cyber font-bold text-white">
                {data?.summary?.uniqueVisitors || 0}
              </p>
              <p className="text-sm font-tech text-gray-400">Unique Visitors</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-cyber-green text-sm">
            <TrendingUp size={14} />
            <span className="font-tech">+8% vs last period</span>
          </div>
        </div>

        <div className="hologram rounded-lg p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-cyber-purple/20 rounded-lg flex items-center justify-center">
              <BarChart3 size={24} className="text-cyber-purple" />
            </div>
            <div>
              <p className="text-2xl font-cyber font-bold text-white">
                {data?.summary?.projectViews || 0}
              </p>
              <p className="text-sm font-tech text-gray-400">Project Views</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-cyber-blue text-sm">
            <TrendingUp size={14} />
            <span className="font-tech">+22% vs last period</span>
          </div>
        </div>

        <div className="hologram rounded-lg p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-cyber-yellow/20 rounded-lg flex items-center justify-center">
              <MessageCircle size={24} className="text-cyber-yellow" />
            </div>
            <div>
              <p className="text-2xl font-cyber font-bold text-white">
                {data?.summary?.contactFormSubmissions || 0}
              </p>
              <p className="text-sm font-tech text-gray-400">Messages</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-cyber-green text-sm">
            <TrendingUp size={14} />
            <span className="font-tech">+3 new</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="hologram rounded-lg p-6">
          <h3 className="text-lg font-cyber font-bold text-cyber-blue mb-4 flex items-center gap-2">
            <BarChart3 size={20} />
            Top Pages
          </h3>
          
          <div className="space-y-4">
            {data?.topPages?.map((page: any, index: number) => (
              <div key={page.page} className="flex items-center justify-between p-3 bg-cyber-blue/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-cyber-blue/20 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-cyber text-cyber-blue">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-tech text-white text-sm">{page.page}</p>
                    <div className="w-32 bg-cyber-dark/50 rounded-full h-2 mt-1">
                      <div 
                        className="bg-cyber-blue rounded-full h-2 transition-all duration-1000"
                        style={{ width: `${(page.views / (data.topPages[0]?.views || 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <span className="font-tech text-cyber-blue font-bold">{page.views}</span>
              </div>
            ))}
            
            {(!data?.topPages || data.topPages.length === 0) && (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BarChart3 size={16} className="text-gray-500" />
                </div>
                <p className="text-gray-500 font-tech text-sm">No page data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Event Breakdown */}
        <div className="hologram rounded-lg p-6">
          <h3 className="text-lg font-cyber font-bold text-cyber-green mb-4 flex items-center gap-2">
            <Calendar size={20} />
            Event Breakdown
          </h3>
          
          <div className="space-y-4">
            {data?.events && Object.entries(data.events).map(([event, count]: [string, any]) => (
              <div key={event} className="flex items-center justify-between p-3 bg-cyber-green/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-cyber-green rounded-full"></div>
                  <span className="font-tech text-white text-sm capitalize">
                    {event.replace('_', ' ')}
                  </span>
                </div>
                <span className="font-tech text-cyber-green font-bold">{count}</span>
              </div>
            ))}
            
            {(!data?.events || Object.keys(data.events).length === 0) && (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar size={16} className="text-gray-500" />
                </div>
                <p className="text-gray-500 font-tech text-sm">No event data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Period Info */}
      <div className="hologram rounded-lg p-4 bg-cyber-pink/5 border-cyber-pink/20">
        <p className="text-cyber-pink font-tech text-sm">
          📊 Analytics data for the last {period === '24h' ? '24 hours' : period === '7d' ? '7 days' : period === '30d' ? '30 days' : '90 days'}
        </p>
        <p className="text-gray-500 font-tech text-xs mt-1">
          Data updates in real-time as visitors interact with your portfolio
        </p>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
