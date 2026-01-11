
import React from 'react';

interface PricingProps {
  onJoinClick: () => void;
}

const Pricing: React.FC<PricingProps> = ({ onJoinClick }) => {
  const plans = [
    {
      name: "Free",
      price: "0",
      features: ["Daily Sales Log", "Basic Stock List", "WhatsApp Access"],
      isPopular: false
    },
    {
      name: "Pro Lite",
      price: "399",
      features: ["Auto Udhaar Reminders", "Voice Entries", "Monthly Reports", "Stock Low Alerts"],
      isPopular: true
    },
    {
      name: "Pro Plus",
      price: "699",
      features: ["Multi-Staff Access", "Profit Analysis", "Supplier Portal", "Priority Support"],
      isPopular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Chota Kharcha, Bara Faida</h2>
        <p className="text-gray-600 mb-12">Chunain woh plan jo aapki dukaan ke liye behtar hai</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`bg-white p-8 rounded-[2.5rem] shadow-sm relative border-2 ${plan.isPopular ? 'border-[#25D366] scale-105 z-10' : 'border-gray-100'}`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#25D366] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-black">PKR {plan.price}</span>
                <span className="text-gray-400 text-sm">/maheena</span>
              </div>
              <ul className="text-left space-y-4 mb-8">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                    <i className="fa-solid fa-circle-check text-[#25D366]"></i>
                    {f}
                  </li>
                ))}
              </ul>
              <button 
                onClick={onJoinClick}
                className={`w-full py-4 rounded-2xl font-bold transition-all ${plan.isPopular ? 'bg-[#25D366] text-white hover:bg-[#128C7E]' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                Join Now
              </button>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-gray-400">* No hidden charges. Cancel anytime.</p>
      </div>
    </section>
  );
};

export default Pricing;
