import { useEffect, useState } from 'react';
import { checkAPIHealth } from '@/lib/api';

const APIHealthBanner = () => {
  const [healthy, setHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    checkAPIHealth().then((ok) => {
      if (mounted) setHealthy(ok);
    }).catch(() => {
      if (mounted) setHealthy(false);
    });
    return () => { mounted = false; };
  }, []);

  if (healthy === null || healthy) return null;

  return (
    <div className="w-full px-4 py-2 bg-red-500/10 border-b border-red-500/30 text-red-400 font-tech text-sm text-center">
      Cannot reach API at {import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}. Check backend server and CORS settings.
    </div>
  );
};

export default APIHealthBanner;


