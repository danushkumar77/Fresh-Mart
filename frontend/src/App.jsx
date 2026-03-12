import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthGuard from './components/AuthGuard';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="flex flex-col min-h-screen text-slate-800 bg-slate-50">
            <Navbar />
            <main className="flex-grow pt-16 relative">
              <div className="absolute inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-slate-50 to-slate-100 opacity-80 pointer-events-none"></div>
              <Routes>
                <Route path="/login" element={<Login />} />
                
                {/* Protected Routes */}
                <Route path="/" element={<AuthGuard><Home /></AuthGuard>} />
                <Route path="/about" element={<AuthGuard><About /></AuthGuard>} />
                <Route path="/contact" element={<AuthGuard><Contact /></AuthGuard>} />
                <Route path="/products" element={<AuthGuard><Products /></AuthGuard>} />
                <Route path="/cart" element={<AuthGuard><Cart /></AuthGuard>} />
                <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
                <Route path="/admin" element={<AuthGuard><AdminDashboard /></AuthGuard>} />
                
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
