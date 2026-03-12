import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'users', 'add'
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);

  // Add Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '', price: '', category: 'Fruits', image: '', description: '', stock: '', discount: ''
  });

  // External APIs Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchProducts();
      fetchUsers();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/products');
      setProducts(data);
    } catch (error) { console.error('Failed to fetch products'); }
  };

  const fetchUsers = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
      const { data } = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(data);
    } catch (error) { console.error('Failed to fetch users'); }
  };

  useEffect(() => {
    if (searchQuery.trim().length > 2) {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = setTimeout(async () => {
        setIsSearching(true);
        try {
          const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
          const { data } = await axios.get(`http://localhost:5000/api/products/external-search?query=${searchQuery}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setSuggestions(data);
        } catch (error) {
          console.error('Failed to fetch suggestions', error);
        } finally {
          setIsSearching(false);
        }
      }, 500); // 500ms debounce
    } else {
      setSuggestions([]);
      setIsSearching(false);
    }
  }, [searchQuery]);

  const selectSuggestion = (product) => {
    setNewProduct({
      ...newProduct,
      name: product.name,
      category: product.category,
      description: product.description,
      image: product.image
    });
    setSearchQuery('');
    setSuggestions([]);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
      await axios.post('http://localhost:5000/api/products', newProduct, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Product Added Successfully!');
      setNewProduct({ name: '', price: '', category: 'Fruits', image: '', description: '', stock: '', discount: '' });
      fetchProducts();
      setActiveTab('products');
    } catch (error) {
      alert('Failed to add product. Make sure backend supports POST /api/products.');
    }
  };

  if (!user || user.role !== 'admin') return <Navigate to="/" />;

  const lowStockProducts = products.filter(p => p.stock < 50);

  return (
    <div className="py-20 max-w-7xl mx-auto px-4 mt-8">
      <h1 className="text-4xl font-bold text-emerald-600 mb-8">Admin Control Panel</h1>
      
      {/* Tabs */}
      <div className="flex space-x-4 mb-8">
        <button onClick={() => setActiveTab('products')} className={`px-6 py-2 rounded-xl font-medium transition ${activeTab === 'products' ? 'bg-emerald-500 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>Total Products</button>
        <button onClick={() => setActiveTab('users')} className={`px-6 py-2 rounded-xl font-medium transition ${activeTab === 'users' ? 'bg-emerald-500 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>User Details</button>
        <button onClick={() => setActiveTab('add')} className={`px-6 py-2 rounded-xl font-medium transition ${activeTab === 'add' ? 'bg-emerald-500 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>Add Product</button>
      </div>

      {/* Tab Content: Products */}
      {activeTab === 'products' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-panel p-6 rounded-3xl border-t-4 border-emerald-500">
              <h3 className="text-xl text-slate-800 font-bold mb-2">Total Inventory</h3>
              <p className="text-4xl font-bold text-emerald-600">{products.length} Items</p>
            </div>
            <div className="glass-panel p-6 rounded-3xl border-t-4 border-amber-500">
              <h3 className="text-xl text-slate-800 font-bold mb-2">Needed to Buy (Low Stock &lt; 50)</h3>
              <p className="text-4xl font-bold text-amber-500">{lowStockProducts.length} Items</p>
            </div>
          </div>
          
          {lowStockProducts.length > 0 && (
            <div className="glass-panel p-6 rounded-3xl bg-amber-50 border border-amber-200">
              <h3 className="text-lg font-bold text-amber-800 mb-4">Urgent Restock Needed</h3>
              <ul className="list-disc list-inside space-y-1 text-amber-900">
                {lowStockProducts.map(p => <li key={p._id}>{p.name} (Only {p.stock} left)</li>)}
              </ul>
            </div>
          )}

          <div className="glass-panel p-6 rounded-3xl overflow-hidden">
            <h2 className="text-xl font-bold text-slate-800 mb-4">All Products</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  {products.map(p => (
                    <tr key={p._id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                      <td className="py-3 px-4 font-medium">{p.name}</td>
                      <td className="py-3 px-4">{p.category}</td>
                      <td className="py-3 px-4">₹{p.price}</td>
                      <td className={`py-3 px-4 font-bold ${p.stock < 50 ? 'text-amber-500' : 'text-emerald-600'}`}>{p.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Users */}
      {activeTab === 'users' && (
        <div className="glass-panel p-6 rounded-3xl overflow-hidden">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Registered Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {users.map(u => (
                  <tr key={u._id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium">{u.name}</td>
                    <td className="py-3 px-4">{u.email}</td>
                    <td className="py-3 px-4 capitalize">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>{u.role}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: Add Product */}
      {activeTab === 'add' && (
        <div className="glass-panel p-8 rounded-3xl max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Import & Add New Product</h2>
          
          {/* External Auto-Search */}
          <div className="mb-8 relative">
            <label className="block text-slate-800 font-bold text-sm mb-2">Auto-fill Product details via External APIs</label>
            <div className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products (e.g., 'Apple', 'Chocolate', 'Milk')..." 
                className="w-full bg-white border-2 border-emerald-100 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-emerald-500 shadow-sm transition" 
              />
              {isSearching && (
                <div className="absolute right-4 top-3 h-6 w-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>

            {suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-xl border border-slate-100 max-h-80 overflow-y-auto">
                {suggestions.map((suggestion) => (
                  <div 
                    key={suggestion.id} 
                    onClick={() => selectSuggestion(suggestion)}
                    className="flex items-center p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 transition"
                  >
                    <img src={suggestion.image} alt={suggestion.name} className="w-12 h-12 rounded-lg object-cover bg-slate-100 mr-4" />
                    <div>
                      <p className="font-bold text-slate-800">{suggestion.name}</p>
                      <p className="text-xs text-slate-500">{suggestion.category} &bull; Source: <span className="font-semibold text-emerald-600">{suggestion.source}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleAddProduct} className="space-y-6 pt-6 border-t border-slate-100">
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-slate-600 font-medium text-sm mb-1">Product Name</label>
                <input type="text" required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm" />
              </div>
              <div>
                <label className="block text-slate-600 font-medium text-sm mb-1">Category</label>
                <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm">
                  <option>Fruits</option>
                  <option>Vegetables</option>
                  <option>Dairy</option>
                  <option>Bakery</option>
                  <option>Meat</option>
                  <option>Seafood</option>
                  <option>Pantry</option>
                  <option>Snacks</option>
                  {/* Allow freeform categories populated by external API */}
                  {!['Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Meat', 'Seafood', 'Pantry', 'Snacks'].includes(newProduct.category) && newProduct.category && (
                    <option value={newProduct.category}>{newProduct.category}</option>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-slate-600 font-medium text-sm mb-1">Price (₹)</label>
                <input type="number" step="0.01" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm" />
              </div>
              <div>
                <label className="block text-slate-600 font-medium text-sm mb-1">Stock Amount</label>
                <input type="number" required value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm" />
              </div>
              <div>
                <label className="block text-slate-600 font-medium text-sm mb-1">Discount (%)</label>
                <input 
                  type="number" 
                  min="0" 
                  max="100" 
                  value={newProduct.discount} 
                  onChange={e => setNewProduct({...newProduct, discount: e.target.value})} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm" 
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-600 font-medium text-sm mb-1">Image URL</label>
              <input type="url" required value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm" placeholder="https://..." />
              {newProduct.image && (
                <div className="mt-4 p-4 border-2 border-dashed border-emerald-200 rounded-2xl flex items-center justify-center">
                  <img src={newProduct.image} alt="Preview" className="h-32 object-contain rounded-lg" />
                </div>
              )}
            </div>
            <div>
              <label className="block text-slate-600 font-medium text-sm mb-1">Description</label>
              <textarea required rows="3" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"></textarea>
            </div>
            <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-emerald-500/30">
              Create Product
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
