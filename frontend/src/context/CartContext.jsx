import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (user) {
      const fetchCart = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const { data } = await axios.get('http://localhost:5000/api/users/profile', config);
          setCart(data.cart || []);
        } catch (error) {
          console.error(error);
        }
      };
      fetchCart();
    } else {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) setCart(JSON.parse(savedCart));
    }
  }, [user]);

  const addToCart = async (product, quantity = 1) => {
    // Support either full nested product or just reference depending on backend population
    const productId = product._id || product.product?._id;
    const existItem = cart.find(x => (x.product._id || x.product) === productId);
    
    let newCart;
    if (existItem) {
      newCart = cart.map(x => (x.product._id || x.product) === productId ? { ...x, quantity: x.quantity + quantity } : x);
    } else {
      newCart = [...cart, { product, quantity }];
    }
    
    setCart(newCart);

    if (user) {
      const newBackendCart = newCart.map(item => ({ product: item.product._id || item.product, quantity: item.quantity }));
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put('http://localhost:5000/api/users/profile', { cart: newBackendCart }, config).catch(console.error);
    } else {
      localStorage.setItem('cartItems', JSON.stringify(newCart));
    }
  };

  const removeFromCart = async (id) => {
    const newCart = cart.filter(x => (x.product._id || x.product) !== id);
    setCart(newCart);
    if (user) {
      const newBackendCart = newCart.map(item => ({ product: item.product._id || item.product, quantity: item.quantity }));
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put('http://localhost:5000/api/users/profile', { cart: newBackendCart }, config).catch(console.error);
    } else {
      localStorage.setItem('cartItems', JSON.stringify(newCart));
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
