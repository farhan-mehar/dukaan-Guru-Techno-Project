
import React, { useState } from 'react';

interface NavbarProps {
  onJoinClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onJoinClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of fixed navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center shrink-0">
            <div className="bg-[#25D366] p-2 rounded-xl mr-2.5 shadow-lg shadow-green-100">
              <i className="fa-solid fa-shop text-white text-xl"></i>
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-tight">
              Dukaan<span className="text-[#25D366]">Guru</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-10 text-sm font-semibold text-gray-600">
            <a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')} className="hover:text-[#25D366] transition-colors">Kaise Chalta Hai?</a>
            <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="hover:text-[#25D366] transition-colors">Features</a>
            <a href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')} className="hover:text-[#25D366] transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={onJoinClick}
              className="hidden sm:flex bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-md items-center gap-2 hover:scale-105 active:scale-95"
            >
              <i className="fa-brands fa-whatsapp text-lg"></i>
              Join Waitlist
            </button>
            
            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-gray-600 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars-staggered'} text-2xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 absolute top-20 left-0 w-full p-6 space-y-4 shadow-xl scale-in">
          <a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')} className="block text-lg font-bold text-gray-800 p-2">Kaise Chalta Hai?</a>
          <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="block text-lg font-bold text-gray-800 p-2">Features</a>
          <a href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')} className="block text-lg font-bold text-gray-800 p-2">Pricing</a>
          <button 
            onClick={() => { onJoinClick(); setIsMenuOpen(false); }}
            className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 mt-4"
          >
            <i className="fa-brands fa-whatsapp text-xl"></i>
            Join Waitlist
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
