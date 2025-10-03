import axios from 'axios';

// Resolve API base URL based on environment
export const API_BASE_URL: string = (() => {
  const provided = import.meta.env.VITE_API_URL as string | undefined;
  if (import.meta.env.PROD) {
    if (!provided) {
      throw new Error('VITE_API_URL must be set in production');
    }
    return provided;
  }
  // Development default
  return provided || 'http://localhost:5000/api';
})();

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      // Redirect to login if needed
    }
    return Promise.reject(error);
  }
);

// Contact API
export const contactAPI = {
  // Submit contact form
  submit: async (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => {
    const response = await api.post('/contact', data);
    return response.data;
  },

  // Get all contacts (admin only)
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) => {
    const response = await api.get('/contact', { params });
    return response.data;
  },

  // Get single contact (admin only)
  getById: async (id: string) => {
    const response = await api.get(`/contact/${id}`);
    return response.data;
  },

  // Update contact status (admin only)
  updateStatus: async (id: string, status: 'unread' | 'read' | 'replied') => {
    const response = await api.patch(`/contact/${id}/status`, { status });
    return response.data;
  },

  // Delete contact (admin only)
  delete: async (id: string) => {
    const response = await api.delete(`/contact/${id}`);
    return response.data;
  }
};

// Projects API
export const projectsAPI = {
  // Get all projects (public)
  getAll: async (params?: {
    category?: string;
    featured?: boolean;
    status?: string;
    limit?: number;
    page?: number;
  }) => {
    const response = await api.get('/projects', { params });
    return response.data;
  },

  // Get single project (public)
  getById: async (id: string) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  // Create project (admin only)
  create: async (data: {
    title: string;
    description: string;
    longDescription?: string;
    technologies: string[];
    image: string;
    images?: string[];
    githubUrl?: string;
    liveUrl?: string;
    category: 'frontend' | 'backend' | 'fullstack' | 'mobile' | 'design';
    featured?: boolean;
    status?: 'completed' | 'in-progress' | 'planned';
    order?: number;
  }) => {
    const response = await api.post('/projects', data);
    return response.data;
  },

  // Update project (admin only)
  update: async (id: string, data: Partial<{
    title: string;
    description: string;
    longDescription: string;
    technologies: string[];
    image: string;
    images: string[];
    githubUrl: string;
    liveUrl: string;
    category: 'frontend' | 'backend' | 'fullstack' | 'mobile' | 'design';
    featured: boolean;
    status: 'completed' | 'in-progress' | 'planned';
    order: number;
  }>) => {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  },

  // Delete project (admin only)
  delete: async (id: string) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  // Like project (public)
  like: async (id: string) => {
    const response = await api.patch(`/projects/${id}/like`);
    return response.data;
  },

  // Toggle featured status (admin only)
  toggleFeatured: async (id: string) => {
    const response = await api.patch(`/projects/${id}/feature`);
    return response.data;
  },

  // Get project stats (admin only)
  getStats: async () => {
    const response = await api.get('/projects/stats/overview');
    return response.data;
  }
};

// Auth API
export const authAPI = {
  // Login
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success && response.data.token) {
      localStorage.setItem('adminToken', response.data.token);
    }
    return response.data;
  },

  // Get current user
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Refresh token
  refresh: async () => {
    const response = await api.post('/auth/refresh');
    if (response.data.success && response.data.token) {
      localStorage.setItem('adminToken', response.data.token);
    }
    return response.data;
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.post('/auth/change-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('adminToken');
  }
};

// Analytics API
export const analyticsAPI = {
  // Track event (public)
  track: async (data: {
    event: 'page_view' | 'project_view' | 'contact_form' | 'download_resume' | 'skill_hover' | 'social_click';
    page: string;
    projectId?: string;
    metadata?: Record<string, any>;
  }) => {
    try {
      const response = await api.post('/analytics/track', data);
      return response.data;
    } catch (error) {
      // Don't throw errors for analytics to avoid disrupting user experience
      console.error('Analytics tracking error:', error);
      return null;
    }
  },

  // Get dashboard data (admin only)
  getDashboard: async (period: '24h' | '7d' | '30d' | '90d' = '7d') => {
    const response = await api.get('/analytics/dashboard', { params: { period } });
    return response.data;
  },

  // Get popular projects (admin only)
  getPopularProjects: async (period: '7d' | '30d' | '90d' = '30d', limit = 10) => {
    const response = await api.get('/analytics/popular-projects', {
      params: { period, limit }
    });
    return response.data;
  }
};

// Admin API
export const adminAPI = {
  // Get overview (admin only)
  getOverview: async () => {
    const response = await api.get('/admin/overview');
    return response.data;
  },

  // Get system info (admin only)
  getSystemInfo: async () => {
    const response = await api.get('/admin/system-info');
    return response.data;
  },

  // Seed projects (admin only)
  seedProjects: async () => {
    const response = await api.post('/admin/seed-projects');
    return response.data;
  },

  // Create admin (setup only)
  createAdmin: async () => {
    const response = await api.post('/admin/create-admin');
    return response.data;
  },

  // Clear old analytics (admin only)
  clearAnalytics: async (days = 90) => {
    const response = await api.delete('/admin/clear-analytics', {
      params: { days }
    });
    return response.data;
  }
};

// Utility function to check API health
export const checkAPIHealth = async (): Promise<boolean> => {
  try {
    const response = await api.get('/health');
    return response.data.success;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};

export default api;
