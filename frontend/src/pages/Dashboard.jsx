import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="py-20 max-w-4xl mx-auto px-4 mt-8">
      <h1 className="text-4xl font-bold text-emerald-600 mb-8">Hello, {user.name}</h1>
      
      <div className="glass-panel p-8 rounded-3xl floating-slow">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Your Profile</h2>
        <div className="space-y-4 text-slate-600 text-lg">
          <p><strong className="text-emerald-600">Name:</strong> {user.name}</p>
          <p><strong className="text-emerald-600">Email:</strong> {user.email}</p>
          <p><strong className="text-emerald-600">Role:</strong> <span className="capitalize">{user.role}</span></p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
