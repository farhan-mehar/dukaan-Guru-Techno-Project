
import React, { useState, useEffect } from 'react';

interface HeroProps {
  onJoinClick: () => void;
  shopName?: string;
}

const Hero: React.FC<HeroProps> = ({ onJoinClick, shopName }) => {
  const [count, setCount] = useState(142);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 2));
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const scrollToDemo = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-32 pb-16 lg:pt-52 lg:pb-36 px-4 overflow-hidden">
      {/* Background visual structure */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f0fff4] via-white to-[#f8fafc] -z-10"></div>
      <div className="absolute inset-0 section-pattern opacity-40 -z-10"></div>
      
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-24 relative">
        <div className="lg:w-3/5 text-center lg:text-left z-10">
          <div className="inline-flex items-center bg-[#25D366]/10 text-[#128C7E] px-5 py-2.5 rounded-full text-xs md:text-sm font-black mb-8 border border-[#25D366]/20">
            <span className="mr-2.5">🇵🇰</span> {count} Shops registered in the last 24h
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-8xl font-black text-slate-900 leading-[1] mb-8 tracking-tighter">
            {shopName ? <span className="text-sm block uppercase tracking-[0.3em] text-slate-400 mb-4">Welcome back, {shopName}</span> : null}
            Digital Manager <br/>
            <span className="text-[#25D366]">WhatsApp</span> par
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
            Hisab-kitab asaan karein. Sales, stock aur udhaar manage karein sirf message bhej kar. 
            <span className="text-slate-900 font-bold"> Na koi app, na koi training.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
            <button 
              onClick={onJoinClick}
              className="group bg-[#25D366] hover:bg-[#128C7E] text-white px-10 py-6 rounded-3xl font-black text-xl shadow-2xl shadow-green-200 transition-all flex items-center justify-center gap-4 hover:-translate-y-1.5 active:scale-95"
            >
              <i className="fa-brands fa-whatsapp text-3xl"></i>
              Join Free Waitlist
            </button>
            <a 
              href="#how-it-works"
              onClick={scrollToDemo}
              className="bg-white border-2 border-slate-200 hover:border-[#25D366] px-10 py-6 rounded-3xl font-black text-xl transition-all flex items-center justify-center text-slate-700 shadow-sm hover:shadow-xl hover:bg-slate-50"
            >
              How It Works
            </a>
          </div>
          
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8 border-t border-slate-200 pt-10">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-14 h-14 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center overflow-hidden shadow-md">
                  <img 
                    src={`https://i.pravatar.cc/120?img=${i+24}`} 
                    alt={`Dukaan Guru Successful Shopkeeper ${i}`} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=User+${i}&background=random`;
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="text-center sm:text-left">
              <div className="flex justify-center sm:justify-start text-yellow-400 text-sm gap-1 mb-1.5">
                {[1, 2, 3, 4, 5].map(s => <i key={s} className="fa-solid fa-star"></i>)}
              </div>
              <p className="text-base font-black text-slate-900">
                Trusted by 5,000+ Kiryana Stores
              </p>
            </div>
          </div>
        </div>

        <div className="lg:w-2/5 relative w-full flex justify-center lg:justify-end py-12">
          {/* Main Floating Mockup */}
          <div className="relative w-full max-w-[340px] bg-white rounded-[4rem] p-4 shadow-[0_60px_120px_-20px_rgba(0,0,0,0.18)] border-[14px] border-slate-900 float-animation">
             <div className="bg-[#075e54] h-16 rounded-t-[3rem] flex items-center px-5 text-white gap-4">
                <i className="fa-solid fa-arrow-left"></i>
                <div className="w-10 h-10 rounded-full bg-slate-100/20 flex items-center justify-center text-white border border-white/10">
                  <i className="fa-solid fa-shop text-sm"></i>
                </div>
                <div>
                  <div className="text-base font-black leading-none">{shopName || 'Dukaan Guru AI'}</div>
                  <div className="text-xs opacity-80 mt-1">Always Online</div>
                </div>
             </div>
             <div className="bg-[#e5ddd5] h-[480px] p-5 flex flex-col gap-5 overflow-hidden text-[15px] relative">
                <div className="self-end bg-[#dcf8c6] p-4 rounded-2xl rounded-tr-none shadow-sm max-w-[90%] scale-in">
                  "Lays Masala 20 sales"
                </div>
                <div className="self-start bg-white p-4 rounded-2xl rounded-tl-none shadow-sm max-w-[90%] border-l-4 border-[#25D366] scale-in" style={{animationDelay: '0.2s'}}>
                  ✅ Recorded! <br/>
                  Current Balance: <span className="font-black text-slate-900">₨ 15,840</span>
                </div>
                <div className="self-end bg-[#dcf8c6] p-4 rounded-2xl rounded-tr-none shadow-sm max-w-[90%] flex items-center gap-3 scale-in" style={{animationDelay: '0.4s'}}>
                  <i className="fa-solid fa-microphone text-blue-500 text-xl"></i>
                  <span className="font-medium italic">"Hamza 150 udhaar"</span>
                </div>
                <div className="self-start bg-white p-4 rounded-2xl rounded-tl-none shadow-sm max-w-[90%] scale-in border-l-4 border-[#25D366]" style={{animationDelay: '0.6s'}}>
                  ✅ Done! Hamza's total udhaar: <br/>
                  <span className="font-black text-slate-900">₨ 850</span>
                </div>
                
                <div className="absolute bottom-6 left-0 right-0 px-6">
                    <div className="bg-white/95 backdrop-blur-md py-2.5 rounded-xl text-[10px] text-center text-slate-500 font-black border border-slate-200 uppercase tracking-[0.15em] shadow-sm">
                        <i className="fa-solid fa-lock mr-2 text-[#25D366]"></i> Secured by AI
                    </div>
                </div>
             </div>
             <div className="h-16 bg-white rounded-b-[3rem] flex items-center px-6 gap-4">
                <div className="flex-1 bg-slate-100 h-10 rounded-full px-5 text-sm flex items-center text-slate-400 font-medium">Type a message...</div>
                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white">
                  <i className="fa-solid fa-microphone text-lg"></i>
                </div>
             </div>
          </div>
          
          {/* Accent Card */}
          <div className="absolute -bottom-4 -right-4 lg:-right-16 bg-white p-7 rounded-[2.5rem] shadow-2xl border border-slate-100 hidden sm:block float-animation" style={{ animationDelay: '2s', animationDuration: '14s' }}>
            <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-green-50 rounded-2xl flex items-center justify-center">
                    <i className="fa-solid fa-arrow-trend-up text-[#25D366] text-sm"></i>
                </div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Monthly Profit</p>
            </div>
            <p className="text-4xl font-black text-slate-900 tracking-tighter">₨ 58,240</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] bg-green-100 text-[#128C7E] px-2 py-0.5 rounded-md font-black">+18% Growth</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
