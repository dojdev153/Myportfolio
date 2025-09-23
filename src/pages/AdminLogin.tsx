import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { authAPI } from '../lib/api';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authAPI.login(formData.email, formData.password);
      
      if (response.success) {
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1000);
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark flex items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 cyber-grid opacity-20"></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyber-blue rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Login Form */}
      <div className="relative z-10 w-full max-w-md mx-auto p-6">
        <div className="hologram rounded-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-full flex items-center justify-center mb-4">
              <Lock size={24} className="text-white" />
            </div>
            <h1 className="text-3xl font-cyber font-bold bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">
              Admin Portal
            </h1>
            <p className="text-gray-400 font-tech mt-2">
              Secure access to portfolio management
            </p>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
              <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-cyber-green/10 border border-cyber-green/30 rounded-lg flex items-center gap-3">
              <CheckCircle size={20} className="text-cyber-green flex-shrink-0" />
              <span className="text-cyber-green text-sm">{success}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <User size={18} className="text-cyber-blue" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full bg-cyber-dark/50 border-2 border-cyber-blue/30 rounded-lg pl-12 pr-4 py-3 text-white font-tech focus:border-cyber-blue focus:outline-none transition-all duration-300"
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Lock size={18} className="text-cyber-blue" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full bg-cyber-dark/50 border-2 border-cyber-blue/30 rounded-lg pl-12 pr-12 py-3 text-white font-tech focus:border-cyber-blue focus:outline-none transition-all duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyber-blue transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full cyber-button py-3 text-lg font-semibold transition-all duration-300 ${
                isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Authenticating...
                </div>
              ) : (
                'Access Portal'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-cyber-blue hover:text-cyber-green transition-colors font-tech text-sm"
            >
              ← Back to Portfolio
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-4 -left-4 w-12 h-12 border-2 border-cyber-pink/50 rounded-full animate-float"></div>
        <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-cyber-yellow/30 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
};

export default AdminLogin;
