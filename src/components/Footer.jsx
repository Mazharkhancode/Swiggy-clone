import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <img src="/swiggy_logo.png?v=2" alt="Swiggy" className="h-8 w-auto object-contain" />
          </h3>
          <p className="text-gray-400">
            Fresh food from your favourite restaurants delivered within minutes right to your doorstep.
          </p>
        </div>
        
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
          <ul className="space-y-2">
            <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link to="#careers" className="hover:text-primary transition-colors">Careers</Link></li>
            <li><Link to="#blog" className="hover:text-primary transition-colors">Blog</Link></li>
            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link to="/restaurants" className="hover:text-primary transition-colors">Restaurants</Link></li>
            <li><Link to="#offers" className="hover:text-primary transition-colors">Offers</Link></li>
            <li><Link to="#categories" className="hover:text-primary transition-colors">Categories</Link></li>
            <li><Link to="/cart" className="hover:text-primary transition-colors">Cart</Link></li>
            <li><Link to="/admin" className="hover:text-[#ff5200] text-orange-400 font-bold transition-colors">Admin Panel</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Legal</h4>
          <ul className="space-y-2">
            <li><Link to="#terms" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
            <li><Link to="#privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link to="#refund" className="hover:text-primary transition-colors">Refund Policy</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} Swiggy. All rights reserved.</p>
      </div>
    </footer>
  );
}
