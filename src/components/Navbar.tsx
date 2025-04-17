
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ModeToggle';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl">CodeShift</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              to="/"
              className={`transition-colors hover:text-foreground/80 ${
                isActive('/') ? 'text-foreground' : 'text-foreground/60'
              }`}
            >
              Home
            </Link>
            <Link
              to="/converter"
              className={`transition-colors hover:text-foreground/80 ${
                isActive('/converter') ? 'text-foreground' : 'text-foreground/60'
              }`}
            >
              Converter
            </Link>
            <Link
              to="/visualizer"
              className={`transition-colors hover:text-foreground/80 ${
                isActive('/visualizer') ? 'text-foreground' : 'text-foreground/60'
              }`}
            >
              Visualizer
            </Link>
            <Link
              to="/langchain"
              className={`transition-colors hover:text-foreground/80 ${
                isActive('/langchain') ? 'text-foreground' : 'text-foreground/60'
              }`}
            >
              LangChain
            </Link>
            <Link
              to="/documentation"
              className={`transition-colors hover:text-foreground/80 ${
                isActive('/documentation') ? 'text-foreground' : 'text-foreground/60'
              }`}
            >
              Docs
            </Link>
            <Link
              to="/about"
              className={`transition-colors hover:text-foreground/80 ${
                isActive('/about') ? 'text-foreground' : 'text-foreground/60'
              }`}
            >
              About
            </Link>
          </nav>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
