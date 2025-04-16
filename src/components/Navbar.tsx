
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  return (
    <nav className="bg-primary text-primary-foreground py-4 px-6 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold">CodeShift</h1>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded">Graph-Based Migration</span>
        </div>
        
        <div className="flex space-x-6">
          <NavLink to="/" active={location.pathname === "/"}>Home</NavLink>
          <NavLink to="/converter" active={location.pathname === "/converter"}>Converter</NavLink>
          <NavLink to="/visualizer" active={location.pathname === "/visualizer"}>Visualizer</NavLink>
          <NavLink to="/documentation" active={location.pathname === "/documentation"}>Documentation</NavLink>
          <NavLink to="/about" active={location.pathname === "/about"}>About</NavLink>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, active, children }: { to: string; active: boolean; children: React.ReactNode }) => {
  return (
    <Link 
      to={to} 
      className={`transition-colors ${active ? 'font-semibold border-b-2 border-white' : 'hover:text-gray-200'}`}
    >
      {children}
    </Link>
  );
};

export default Navbar;
