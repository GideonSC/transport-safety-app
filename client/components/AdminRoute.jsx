import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) {
    return <p>Checking admin access...</p>;
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
}
