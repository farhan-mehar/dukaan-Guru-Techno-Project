
import React from 'react';

interface FooterProps {
  onJoinClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onJoinClick }) => {
  return (
    <footer className="bg-white pt-24 pb-12 px-4 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          <div className="md:col-span-5">
            <div className="flex items-center mb-8">
              <div className="bg-[#25D366] p-2.5 rounded-xl mr-3 shadow-lg shadow-green-100">
                <i className="fa-solid fa-shop text-white text-xl"></i>
              </div>
              <span className="text-3xl font-black text-gray-900 tracking-tighter">
                Dukaan<span className="text-[#25D366]">Guru</span>
              </span>
            </div>
            <p className="text-gray-500 mb-10 text-lg leading-relaxed max-w-md">
              Pakistan ka pehla WhatsApp-based AI assistant jo aapki dukaan ka hisaab kitab digital aur mehfooz banata hai.
            </p>
            <div className="flex gap-4">
               {['facebook-f', 'instagram', 'whatsapp', 'x-twitter'].map(icon => (
                 <a key={icon} href="#" className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#25D366] transition-all shadow-sm hover:-translate-y-1">
                    <i className={`fa-brands fa-${icon} text-lg`}></i>
                 </a>
               ))}
            </div>
          </div>
          
          <div className="md:col-span-2">
            <h4 className="font-black text-gray-900 mb-8 uppercase text-xs tracking-widest">Company</h4>
            <ul className="space-y-4 text-gray-500 font-semibold">
              <li><a href="#how-it-works" className="hover:text-[#25D366] transition-colors">How it Works</a></li>
              <li><a href="#features" className="hover:text-[#25D366] transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-[#25D366] transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-[#25D366] transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div className="md:col-span-2">
            <h4 className="font-black text-gray-900 mb-8 uppercase text-xs tracking-widest">Legal</h4>
            <ul className="space-y-4 text-gray-500 font-semibold">
              <li><a href="#" className="hover:text-[#25D366] transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-[#25D366] transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-[#25D366] transition-colors">Security</a></li>
            </ul>
          </div>
          
          <div className="md:col-span-3">
            <div className="bg-green-50 p-8 rounded-[2rem] border border-green-100">
                <h4 className="font-black text-[#128C7E] mb-4">Support Chahiye?</h4>
                <p className="text-sm text-green-800/70 mb-6">Hamari team aapki madad ke liye tayyar hai.</p>
                <button 
                  onClick={onJoinClick}
                  className="w-full bg-white text-[#128C7E] py-4 rounded-2xl font-black text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <i className="fa-brands fa-whatsapp text-lg"></i>
                  Chat with Team
                </button>
            </div>
          </div>
        </div>
        
        <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 text-sm font-medium">
            © 2024 Dukaan Guru. Crafted with ❤️ in Lahore.
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-widest">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            System Status: Healthy
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
