import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { TrashIcon } from '@heroicons/react/24/outline';
import jsPDF from 'jspdf';

const Cart = () => {
  const { cart, removeFromCart, addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    // Generate PDF Receipt
    const doc = new jsPDF();
    doc.text("FreshMart Receipt", 20, 20);
    
    let yPos = 30;
    cart.forEach((item, index) => {
      const name = item.product.name;
      const quantity = item.quantity;
      const price = item.product.price;
      doc.text(`${name} - ${quantity} x Rs.${price.toFixed(2)} = Rs.${(quantity * price).toFixed(2)}`, 20, yPos);
      yPos += 10;
    });

    const total = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    doc.text(`Total: Rs.${total.toFixed(2)}`, 20, yPos + 10);
    
    doc.save("freshmart-receipt.pdf");
    alert("Checkout successful! Receipt downloaded.");
    navigate('/');
  };

  return (
    <div className="py-20 max-w-5xl mx-auto px-4 mt-8">
      <h1 className="text-4xl font-bold text-emerald-600 mb-8 mt-4 text-center">Your Cart</h1>
      
      {cart.length === 0 ? (
        <div className="glass-panel p-10 rounded-3xl text-center floating-slow">
          <p className="text-2xl text-slate-500 mb-6">Your cart is empty.</p>
          <Link to="/products" className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-full font-semibold transition inline-block">
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3 space-y-4">
            {cart.map(item => (
              <div key={item.product._id} className="glass-panel p-4 rounded-2xl flex items-center justify-between floating transition-transform">
                <div className="flex items-center space-x-4">
                  <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-cover rounded-xl shadow-sm" />
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{item.product.name}</h3>
                    <p className="text-emerald-600 font-bold">₹{item.product.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                    <button onClick={() => addToCart(item.product, -1)} disabled={item.quantity <= 1} className="px-3 py-1 text-slate-500 hover:text-slate-800 hover:bg-slate-50 disabled:opacity-50 transition-colors">-</button>
                    <span className="px-3 py-1 bg-slate-50 text-slate-800 font-medium border-x border-slate-200">{item.quantity}</span>
                    <button onClick={() => addToCart(item.product, 1)} className="px-3 py-1 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors">+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.product._id)} className="text-red-400 hover:text-red-300 transition">
                    <TrashIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="w-full lg:w-1/3">
            <div className="glass-panel p-6 rounded-3xl sticky top-24">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Order Summary</h2>
              <div className="space-y-4 text-slate-600 border-b border-slate-200 pb-4 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-800">₹{cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-medium">Free</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-xl text-emerald-600 mb-8">
                <span>Total</span>
                <span>₹{cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0).toFixed(2)}</span>
              </div>
              <button onClick={handleCheckout} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-emerald-500/30">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
