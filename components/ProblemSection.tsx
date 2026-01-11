
import React from 'react';

const ProblemSection: React.FC = () => {
  const problems = [
    {
      title: "Register Gum Jane Ka Dar",
      desc: "Kaghazi register phat sakte hain ya gum sakte hain. Aapka barson ka data ek pal mein khatam ho sakta hai.",
      icon: "fa-solid fa-book-open text-red-500",
      bg: "bg-red-50"
    },
    {
      title: "Udhaar Ke Jhagray",
      desc: "Hisab barabar na honay ki wajah se ghirako se jhagray aur karobar mein nuqsan hota hai.",
      icon: "fa-solid fa-handshake-slash text-orange-500",
      bg: "bg-orange-50"
    },
    {
      title: "Stock Ki Pareshani",
      desc: "Pata nahi chalta kab cheez khatam ho gayi. Ghiraq aata hai aur cheez na honay par wapas chala jata hai.",
      icon: "fa-solid fa-boxes-stacked text-blue-500",
      bg: "bg-blue-50"
    }
  ];

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 lg:mb-24">
          <h2 className="text-3xl md:text-5xl font-black mb-6">Purana Tareeka <span className="text-red-500">Mushkil</span> Hai</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Kya aap abhi bhi kaghaz aur qalam se apni dukaan chalatay hain? In mushkilat ka hal ab aapke mobile mein hai.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {problems.map((p, idx) => (
            <div key={idx} className="group p-10 rounded-[2.5rem] bg-white border border-gray-100 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 relative overflow-hidden">
              <div className={`w-20 h-20 ${p.bg} rounded-3xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                <i className={`${p.icon} text-3xl`}></i>
              </div>
              <h3 className="text-2xl font-black mb-4 group-hover:text-gray-900 transition-colors">{p.title}</h3>
              <p className="text-gray-500 leading-relaxed text-base">{p.desc}</p>
              
              {/* Decorative background element */}
              <div className="absolute -bottom-6 -right-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <i className={`${p.icon} text-[120px]`}></i>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
