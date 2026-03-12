import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let userData;
      if (isLogin) {
        userData = await login(email, password);
      } else {
        userData = await register(name, email, password);
      }
      
      if (userData && userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      alert("Authentication failed.");
    }
  };

  return (
    <div className="py-20 flex items-center justify-center min-h-[calc(100vh-16rem)]">
      <div className="glass-panel p-10 rounded-3xl w-full max-w-md floating-slow mt-10">
        <h2 className="text-3xl font-bold text-emerald-600 mb-8 text-center">{isLogin ? 'Sign In' : 'Create Account'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-slate-600 font-medium text-sm mb-2">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm" />
            </div>
          )}
          <div>
            <label className="block text-slate-600 font-medium text-sm mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm" />
          </div>
          <div>
            <label className="block text-slate-600 font-medium text-sm mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm" />
          </div>
          <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-emerald-500/30">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="text-slate-500 hover:text-emerald-600 transition font-medium text-sm">
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
