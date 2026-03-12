const Footer = () => {
  return (
    <footer className="glass-panel mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <h3 className="text-2xl font-bold text-emerald-400 mb-4">FreshMart</h3>
        <p className="text-gray-400 mb-6 text-center max-w-md">Your daily source for fresh, quality groceries delivered right to your floating door.</p>
        <div className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} FreshMart. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
