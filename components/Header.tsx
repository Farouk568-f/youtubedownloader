import React, { useState, useEffect } from 'react';
import { DownloadIcon } from '../constants.tsx';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#hero" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <header className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${isScrolled ? 'py-4' : 'py-8'}`}>
      <div className={`container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`}>
        <div className={`flex items-center justify-between rounded-full pl-6 pr-4 sm:pr-8 transition-all duration-300 ${isScrolled ? 'bg-slate-900/70 backdrop-blur-lg shadow-2xl shadow-black/20 h-20' : 'h-24 bg-transparent'}`}>
            <a href="#hero" className="flex items-center space-x-3">
              <DownloadIcon className="w-8 h-8 text-cyan-400" />
              <span className="sitename text-xl sm:text-3xl text-white whitespace-nowrap">YT Downloader</span>
            </a>
            <nav className="hidden md:flex items-center space-x-2 sm:space-x-4 font-medium text-slate-300" style={{fontFamily: 'var(--nav-font)'}}>
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} className="whitespace-nowrap hover:text-cyan-400 transition-colors duration-200 text-base px-2 sm:px-4 py-2 rounded-md">
                  {link.name}
                </a>
              ))}
            </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;