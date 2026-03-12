const Contact = () => {
  return (
    <div className="py-20 max-w-4xl mx-auto px-4 mt-8">
      <div className="glass-panel p-10 rounded-3xl floating border border-slate-200">
        <h1 className="text-4xl font-bold text-emerald-600 mb-6 text-center">Contact Us</h1>
        <p className="text-slate-600 text-center mb-10">Have questions about our zero-g grocery delivery? Drop us a line.</p>
        
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-slate-700 text-sm font-medium mb-2">Name</label>
              <input type="text" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow shadow-sm" />
            </div>
            <div>
              <label className="block text-slate-700 text-sm font-medium mb-2">Email</label>
              <input type="email" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow shadow-sm" />
            </div>
          </div>
          <div>
            <label className="block text-slate-700 text-sm font-medium mb-2">Message</label>
            <textarea className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow shadow-sm h-32 resize-none" placeholder="Your message here..."></textarea>
          </div>
          <button type="button" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-emerald-500/30">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
