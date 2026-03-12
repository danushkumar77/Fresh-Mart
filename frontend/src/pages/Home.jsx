import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const heroRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Parallax effect on hero
    gsap.to(heroRef.current, {
      yPercent: 50,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      } 
    });
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div ref={heroRef} className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          {/* Abstract floating shapes for Antigravity UI */}
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-emerald-500/30 rounded-full mix-blend-screen filter blur-[100px] floating"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full mix-blend-screen filter blur-[120px] floating-slow delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-cyan-500/20 rounded-full mix-blend-screen filter blur-[100px] floating delay-2000"></div>
        </div>
        
        <div className="z-10 text-center glass-panel p-16 rounded-[2.5rem] max-w-4xl mx-4 floating-slow border border-slate-200/50 backdrop-blur-2xl">
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-800 via-emerald-600 to-teal-500 mb-8 drop-shadow-lg tracking-tight">
            Taste the Future <br /> of Fresh
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-10 font-medium max-w-2xl mx-auto leading-relaxed">
            Experience grocery shopping redefined. High-quality, organic produce delivered with antigravity speed and premium care.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/products" className="inline-flex items-center justify-center bg-emerald-500 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:shadow-[0_0_60px_rgba(16,185,129,0.6)] hover:bg-emerald-400 transition-all hover:-translate-y-1 w-full sm:w-auto">
              Shop Now
            </Link>
            <Link to="/about" className="inline-flex items-center justify-center bg-white/50 border border-slate-200 text-slate-700 font-bold text-lg px-8 py-4 rounded-2xl hover:bg-slate-100 transition-all hover:-translate-y-1 backdrop-blur-md w-full sm:w-auto">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="glass-panel rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Fresh Organic Fruits</h2>
            <p className="text-slate-600 mb-6">Get 20% off on your first order of organic fruits directly from local farms. Handpicked and delivered with care.</p>
            <button className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-medium px-6 py-2 rounded-xl backdrop-blur-sm transition shadow-sm">
              Claim Offer
            </button>
          </div>
          <div className="md:w-1/2 flex justify-center floating">
            {/* Placeholder for floating fruit image */}
            <div className="w-64 h-64 rounded-full bg-gradient-to-tr from-emerald-100 to-teal-50 border border-emerald-100 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.1)]">
               <span className="text-6xl">🍎</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
