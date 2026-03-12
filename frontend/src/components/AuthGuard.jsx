import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AuthGuard = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AuthGuard;
