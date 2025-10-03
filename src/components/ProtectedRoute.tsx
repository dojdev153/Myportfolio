import { Navigate } from 'react-router-dom';
import { ReactNode, useEffect, useState } from 'react';
import { authAPI } from '@/lib/api';

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const verify = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
      if (!token) {
        setAllowed(false);
        return;
      }
      try {
        const res = await authAPI.getMe();
        if (res?.success) {
          setAllowed(true);
          return;
        }
      } catch (e) {
        // try a single refresh
        try {
          const refresh = await authAPI.refresh();
          if (refresh?.success) {
            const me = await authAPI.getMe();
            setAllowed(Boolean(me?.success));
            return;
          }
        } catch {}
      }
      setAllowed(false);
    };
    verify();
  }, []);

  if (allowed === null) {
    return null;
  }
  if (!allowed) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;


