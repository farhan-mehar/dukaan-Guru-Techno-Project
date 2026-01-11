
import React from 'react';

const Features: React.FC = () => {
  const features = [
    {
      title: "Sales Tracking",
      desc: "Har sale ka record rakhein baghair kisi ghalti ke. Sirf likhein '10 Pepsi sales' aur guru record karlega.",
      icon: "fa-solid fa-chart-line"
    },
    {
      title: "Stock Alerts",
      desc: "Maal khatam honay se pehle hi WhatsApp par warning mil jaye gi takay aapka ghiraq khali hath na jaye.",
      icon: "fa-solid fa-bell"
    },
    {
      title: "Udhaar Reminders",
      desc: "Ghirako ko WhatsApp par auto-reminders bheinjein. Professional tareeke se apna paisa wapas mangain.",
      icon: "fa-solid fa-receipt"
    },
    {
      title: "Urdu Voice Support",
      desc: "Likhna mushkil hai? Bol kar entry karein. Dukaan Guru aapki awaz aur Roman Urdu dono samajhta hai.",
      icon: "fa-solid fa-microphone-lines"
    }
  ];

  return (
    <section id="features" className="py-28 px-4 bg-white scroll-mt-20 border-y border-slate-100 relative">
      <div className="absolute inset-0 section-pattern opacity-20 -z-0"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-black mb-8 text-slate-900 tracking-tight">
              Aapki Dukaan, <span className="text-[#128C7E]">Digital Power</span>
            </h2>
            <p className="text-slate-600 text-xl font-medium leading-relaxed">
              Woh sub kuch jo ek mehangay software mein hota hai, ab aapke ussi WhatsApp par jo aap roz chalatay hain.
            </p>
          </div>
          <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 shadow-sm">
             <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">Verified Solution</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((f, idx) => (
            <div key={idx} className="group p-10 rounded-[3rem] border-2 border-slate-50 hover:border-[#25D366] hover:bg-[#25D366]/[0.02] hover:shadow-2xl hover:shadow-green-100/30 transition-all duration-500 bg-white">
              <div className="w-16 h-16 bg-[#25D366]/10 rounded-[1.5rem] flex items-center justify-center mb-10 group-hover:scale-110 transition-transform shadow-sm">
                <i className={`${f.icon} text-[#128C7E] text-3xl`}></i>
              </div>
              <h3 className="text-2xl font-black mb-5 text-slate-900">{f.title}</h3>
              <p className="text-slate-500 text-lg leading-relaxed font-medium">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
