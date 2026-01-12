import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-base-200 text-base-content py-4 ">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        
        {/* LEFT */}
        <p className="opacity-80">
          © {new Date().getFullYear()} <span className="font-semibold">SmartExpense Develop By Dhiraj</span>
        </p>

        {/* CENTER LINKS */}
        <div className="flex gap-4 opacity-80">
          <NavLink to="/about" className="hover:text-primary">About</NavLink>
          <NavLink to="/contact" className="hover:text-primary">Contact</NavLink>
          <NavLink to="" className="hover:text-primary">Help</NavLink>
        </div>

        {/* RIGHT */}
        <p className="opacity-70 text-center sm:text-right">
          Track • Save • Grow
        </p>

      </div>
    </footer>
  );
}
