import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;


