import { Link } from 'react-router-dom';
import { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ShoppingCartIcon, UserIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const dropdownRef = useRef(null);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    // Check local storage for theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <nav className="fixed w-full z-50 glass-panel border-b border-emerald-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
            FreshMart
          </Link>
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-slate-600 hover:text-emerald-600 transition font-medium">Home</Link>
            <Link to="/products" className="text-slate-600 hover:text-emerald-600 transition font-medium">Products</Link>
            <Link to="/contact" className="text-slate-600 hover:text-emerald-600 transition font-medium">Contact</Link>
            <Link to="/about" className="text-slate-600 hover:text-emerald-600 transition font-medium">About</Link>
          </div>
          <div className="flex items-center space-x-6">
            <button onClick={toggleTheme} className="text-slate-600 hover:text-emerald-600 transition focus:outline-none">
              {isDark ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
            </button>
            <Link to="/cart" className="relative text-slate-600 hover:text-emerald-600 transition">
              <ShoppingCartIcon className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)} 
                  className="flex items-center text-slate-600 hover:text-emerald-600 transition font-medium focus:outline-none"
                >
                  <UserIcon className="h-6 w-6 mr-1" />
                  <span>{user.name}</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg shadow-slate-200 py-1 border border-slate-100 transition-opacity z-50">
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600">Admin Dashboard</Link>
                    )}
                    <Link to="/dashboard" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600">Profile</Link>
                    <button onClick={() => { logout(); setDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-slate-600 hover:text-white font-medium transition border border-emerald-500 px-4 py-1 rounded-full hover:bg-emerald-500">
                Log in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
