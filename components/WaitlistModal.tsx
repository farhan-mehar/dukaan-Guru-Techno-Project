
import React, { useState, useEffect } from 'react';

interface WaitlistModalProps {
  onClose: () => void;
}

const WaitlistModal: React.FC<WaitlistModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({ shopName: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if already signed up locally
  useEffect(() => {
    try {
      const isSignedUp = localStorage.getItem('dukaan_guru_waitlist');
      if (isSignedUp) {
        setSubmitted(true);
      }
    } catch (e) {
      console.warn("localStorage is not accessible", e);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.phone.length < 10) {
      setError('Please enter a valid mobile number');
      return;
    }

    setLoading(true);
    setError('');

    // Lead capture simulation
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      try {
        localStorage.setItem('dukaan_guru_waitlist', 'true');
      } catch (e) {
        console.warn("Could not save to localStorage", e);
      }
      console.log('Capture Lead:', formData);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden relative shadow-2xl scale-in border border-gray-100">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-all z-10"
        >
          <i className="fa-solid fa-xmark text-gray-400"></i>
        </button>

        {!submitted ? (
          <div className="p-10">
            <div className="w-16 h-16 bg-[#25D366]/10 rounded-2xl flex items-center justify-center mb-6">
               <i className="fa-brands fa-whatsapp text-3xl text-[#128C7E]"></i>
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">Waitlist Join Karein</h2>
            <p className="text-gray-500 mb-8 font-medium">Be the first to get early access in your area.</p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Dukaan Ka Naam</label>
                <input 
                  required
                  type="text" 
                  value={formData.shopName}
                  onChange={(e) => setFormData({...formData, shopName: e.target.value})}
                  placeholder="e.g. Madina Kiryana Store"
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#25D366] focus:bg-white focus:ring-4 focus:ring-green-50 transition-all outline-none font-semibold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">WhatsApp Number</label>
                <input 
                  required
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="03xx-xxxxxxx"
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#25D366] focus:bg-white focus:ring-4 focus:ring-green-50 transition-all outline-none font-semibold"
                />
                {error && <p className="text-red-500 text-xs mt-2 font-bold ml-1">{error}</p>}
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-[#25D366] text-white font-black rounded-2xl shadow-xl shadow-green-100 hover:bg-[#128C7E] hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
              >
                {loading ? (
                  <i className="fa-solid fa-circle-notch animate-spin"></i>
                ) : (
                  <>Submit Details <i className="fa-solid fa-arrow-right-long"></i></>
                )}
              </button>
              <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-tighter">
                <i className="fa-solid fa-shield-halved mr-1"></i> Data is 100% encrypted & secure
              </p>
            </form>
          </div>
        ) : (
          <div className="p-12 text-center">
             <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                <i className="fa-solid fa-check text-5xl text-[#25D366]"></i>
             </div>
             <h2 className="text-3xl font-black text-gray-900 mb-4">Shukriya!</h2>
             <p className="text-6xl mb-4">🙏</p>
             <p className="text-gray-600 mb-10 text-lg leading-relaxed font-medium">
               Aap waitlist mein shamil ho chukay hain. Hum jald hi aap se WhatsApp par raabta karein ge.
             </p>
             <button 
               onClick={onClose}
               className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-lg hover:bg-black transition-all shadow-lg shadow-gray-200"
             >
               Go Back to Website
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaitlistModal;
