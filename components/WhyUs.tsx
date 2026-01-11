
import React from 'react';

const WhyUs: React.FC = () => {
  const points = [
    { title: "No App Required", icon: "fa-mobile-screen-button", desc: "Aapka normal WhatsApp kafi hai." },
    { title: "No English Needed", icon: "fa-language", desc: "Urdu aur Roman Urdu mein baat karein." },
    { title: "No Training", icon: "fa-graduation-cap", desc: "Jaise doston se chat, wese hi kaam." },
    { title: "No FBR Jhanjhat", icon: "fa-shield-halved", desc: "Aapka data sirf aapka hai." }
  ];

  return (
    <section className="py-24 px-4 bg-[#0a0f0b] text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="w-12 h-1.5 bg-[#25D366] rounded-full mb-8"></div>
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
              Dukaan Guru Ki <br/><span className="text-[#25D366]">Khasosiyat</span>
            </h2>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
              Hum jaantay hain Pakistan mein dukaan chalana kitna mushkil hai. Is liye hum ne ise asaan banaya hai takay aap baray karobar ka muqabla kar sakein.
            </p>
            <div className="space-y-5">
              <div className="flex items-start gap-5 bg-white/5 p-6 rounded-3xl border border-white/10 hover:border-[#25D366]/50 transition-colors">
                <div className="bg-[#25D366]/20 p-2 rounded-lg">
                    <i className="fa-solid fa-check text-[#25D366]"></i>
                </div>
                <div>
                    <h4 className="font-bold text-lg">App download nahi karni</h4>
                    <p className="text-sm text-gray-500">Phone ki memory aur internet bachaen.</p>
                </div>
              </div>
              <div className="flex items-start gap-5 bg-white/5 p-6 rounded-3xl border border-white/10 hover:border-[#25D366]/50 transition-colors">
                <div className="bg-[#25D366]/20 p-2 rounded-lg">
                    <i className="fa-solid fa-lock text-[#25D366]"></i>
                </div>
                <div>
                    <h4 className="font-bold text-lg">Data 100% Private</h4>
                    <p className="text-sm text-gray-500">Aapka record cloud par safe aur encrypted hai.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {points.map((p, idx) => (
              <div key={idx} className="p-10 bg-white/[0.03] rounded-[2.5rem] text-center hover:bg-[#25D366]/10 transition-all border border-white/10 group">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#25D366] transition-colors">
                    <i className={`fa-solid ${p.icon} text-3xl text-[#25D366] group-hover:text-white`}></i>
                </div>
                <h4 className="font-black text-xl mb-3">{p.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#25D366]/10 blur-[120px] rounded-full -mr-64 -mt-64"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#128C7E]/10 blur-[100px] rounded-full -ml-48 -mb-48"></div>
    </section>
  );
};

export default WhyUs;
