import { useContext, useRef } from 'react';
import { CartContext } from '../context/CartContext';
import { PlusIcon } from '@heroicons/react/24/outline';
import gsap from 'gsap';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const imgRef = useRef(null);

  const handleAddToCart = (e) => {
    addToCart(product);

    // Antigravity cart fly animation logic
    if (imgRef.current) {
      const img = imgRef.current;
      const clone = img.cloneNode(true);
      const rect = img.getBoundingClientRect();

      fetchAndFly(clone, rect);
    }
  };

  const fetchAndFly = (clone, rect) => {
    clone.style.position = 'fixed';
    clone.style.top = `${rect.top}px`;
    clone.style.left = `${rect.left}px`;
    clone.style.width = `${rect.width}px`;
    clone.style.height = `${rect.height}px`;
    clone.style.borderRadius = '12px';
    clone.style.zIndex = '1000';
    clone.style.pointerEvents = 'none';

    document.body.appendChild(clone);

    const cartIcon = document.querySelector('.h-6.w-6'); // simple selector for navbar cart icon
    if (cartIcon) {
        const cartRect = cartIcon.getBoundingClientRect();
        
        gsap.to(clone, {
          x: cartRect.left - rect.left,
          y: cartRect.top - rect.top,
          opacity: 0.1,
          scale: 0.1,
          duration: 0.8,
          ease: 'power3.inOut',
          onComplete: () => {
            clone.remove();
          }
        });
    } else {
        clone.remove();
    }
  };

  return (
    <div className="glass-card rounded-2xl p-4 flex flex-col items-center group transition-transform duration-300 hover:scale-105 floating product-card-container cursor-pointer">
      <img ref={imgRef} src={product.image} alt={product.name} className="h-40 object-cover w-full rounded-xl mb-4 shadow-lg shadow-black/20" />
      <h3 className="text-lg font-semibold text-slate-800 w-full text-left">{product.name}</h3>
      <div className="flex justify-between items-center w-full mt-2">
        <p className="text-emerald-600 font-bold">₹{product.price.toFixed(2)}</p>
      </div>
      
      <button 
        onClick={handleAddToCart}
        className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-xl flex justify-center items-center transition-all duration-300 opacity-0 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 absolute bottom-4 left-0 right-0 mx-4 shadow-lg shadow-emerald-500/30 z-10"
        style={{ width: 'calc(100% - 32px)' }}
      >
        <PlusIcon className="w-5 h-5 mr-2" /> Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
