import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const query = new URLSearchParams();
        if (search) query.append('search', search);
        if (category) query.append('category', category);

        const { data } = await axios.get(`http://localhost:5000/api/products?${query.toString()}`);
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, [search, category]);

  return (
    <div className="py-20 max-w-7xl mx-auto px-4 mt-8">
      <div className="glass-panel p-6 rounded-3xl mb-8 flex flex-col md:flex-row justify-between gap-4 sticky top-20 z-40 shadow-xl shadow-black/50">
        <input 
          type="text" 
          placeholder="Search products..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 bg-white/80 border border-slate-200 rounded-xl px-4 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
        />
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          className="w-full md:w-1/4 bg-white border border-slate-200 rounded-xl px-4 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
        >
          <option value="">All Categories</option>
          <option value="Fruits">Fruits</option>
          <option value="Vegetables">Vegetables</option>
          <option value="Dairy">Dairy</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.length === 0 ? (
          <p className="text-slate-500 col-span-full text-center">No products found.</p>
        ) : (
          products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))
        )}
      </div>
    </div>
  );
};

export default Products;
