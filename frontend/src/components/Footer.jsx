import { NavLink } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-base-200 text-base-content py-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8">

        {/* LEFT: Brand */}
        <div className="flex flex-col gap-1">
          <h2 className="font-bold text-lg">MyXpenso</h2>
          <p className="text-sm opacity-70">Track, Save & Grow your finances.</p>
          <p className="text-xs opacity-50 mt-1">© {new Date().getFullYear()} ExpenseTracko</p>
        </div>

        {/* CENTER: Navigation */}
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-sm">Quick Links</h3>
          <NavLink to="/about" className="hover:text-primary transition-colors text-sm">About</NavLink>
          <NavLink to="/contact" className="hover:text-primary transition-colors text-sm">Contact</NavLink>
          <NavLink to="/help" className="hover:text-primary transition-colors text-sm">Help</NavLink>
        </div>

        {/* RIGHT: Socials */}
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-sm">Follow Us</h3>
          <div className="flex gap-3 mt-1">
            <a href="#" className="hover:text-primary transition-colors"><FaFacebook size={18} /></a>
            <a href="#" className="hover:text-primary transition-colors"><FaTwitter size={18} /></a>
            <a href="#" className="hover:text-primary transition-colors"><FaInstagram size={18} /></a>
            <a href="#" className="hover:text-primary transition-colors"><FaLinkedin size={18} /></a>
          </div>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="mt-8 border-t border-base-300 pt-3 text-center text-xs opacity-50">
        Made with by Dhiraj • All rights reserved.
      </div>
    </footer>
  );
}
