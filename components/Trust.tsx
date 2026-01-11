
import React from 'react';

const Trust: React.FC = () => {
  return (
    <section className="py-20 px-4 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#128C7E] rounded-[3rem] p-8 md:p-16 text-white flex flex-col md:flex-row items-center gap-12 relative">
          <div className="md:w-2/3 relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Pakistani Shopkeepers Ke Liye Bana</h2>
            <p className="text-lg opacity-90 mb-8 leading-relaxed">
              Dukaan Guru ka mission hai har choti dukaan ko digital taqat dena. Hum privacy ko sab se pehle rakhtay hain. Aap ka data kisi third party ke sath share nahi kiya jayega.
            </p>
            <div className="flex flex-wrap gap-8">
              <div className="flex items-center gap-3">
                <i className="fa-solid fa-shield-halved text-3xl opacity-50"></i>
                <div>
                  <p className="font-bold">Privacy First</p>
                  <p className="text-xs opacity-70">Secured with AI</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <i className="fa-solid fa-location-dot text-3xl opacity-50"></i>
                <div>
                  <p className="font-bold">Local Support</p>
                  <p className="text-xs opacity-70">24/7 Helpline</p>
                </div>
              </div>
            </div>
          </div>
          <div className="md:w-1/3 flex justify-center">
            <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center border-4 border-white/20 animate-pulse">
               <i className="fa-solid fa-hand-holding-heart text-6xl"></i>
            </div>
          </div>
          {/* Subtle background pattern */}
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <i className="fa-solid fa-shop text-[200px]"></i>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Trust;
