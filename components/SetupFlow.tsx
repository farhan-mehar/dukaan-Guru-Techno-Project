
import React, { useState, useRef, useEffect } from 'react';

interface SetupFlowProps {
  onComplete: (shopName: string, initialStock: string) => void;
}

// Extend Window interface for SpeechRecognition
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

const SetupFlow: React.FC<SetupFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [shopName, setShopName] = useState('');
  const [initialStock, setInitialStock] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US'; // Supports Roman Urdu/English mix

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (step === 1) {
          setShopName(transcript);
        } else {
          setInitialStock(prev => prev ? `${prev}\n${transcript}` : transcript);
        }
        setIsRecording(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, [step]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Aapka browser voice support nahi karta. Please Chrome ya Edge istemal karein.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  const handleNext = () => {
    if (step === 1 && shopName.trim()) {
      setStep(2);
    }
  };

  const handleFinish = () => {
    if (initialStock.trim()) {
      setIsSubmitting(true);
      setTimeout(() => {
        onComplete(shopName, initialStock);
      }, 800);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-50 flex items-center justify-center p-4">
      {/* Background Decor */}
      <div className="absolute inset-0 section-pattern opacity-40"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#25D366]/5 blur-[120px] rounded-full -mr-64 -mt-64"></div>
      
      <div className="w-full max-w-2xl bg-white rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden relative animate-scale-in">
        <div className="p-10 md:p-16">
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center">
              <div className="bg-[#25D366] p-2 rounded-xl mr-3 shadow-lg">
                <i className="fa-solid fa-shop text-white text-sm"></i>
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tighter">
                Dukaan<span className="text-[#25D366]">Guru</span>
              </span>
            </div>
            <div className="flex gap-2">
                <div className={`h-1.5 w-8 rounded-full transition-all ${step >= 1 ? 'bg-[#25D366]' : 'bg-slate-100'}`}></div>
                <div className={`h-1.5 w-8 rounded-full transition-all ${step >= 2 ? 'bg-[#25D366]' : 'bg-slate-100'}`}></div>
            </div>
          </div>

          {step === 1 ? (
            <div className="animate-scale-in">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                Khush Amdeed! <br/> Aapki <span className="text-[#25D366]">Dukaan</span> ka kya naam hai?
              </h2>
              <p className="text-slate-500 text-lg mb-10 font-medium">
                Pehle humein apne brand ka naam batayein takay hum aapka dashboard tayyar kar sakein.
              </p>
              
              <div className="flex gap-3">
                <div className="relative group flex-1">
                  <input 
                    autoFocus
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder={isRecording ? "Suniye..." : "e.g. Madina General Store"}
                    onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                    className={`w-full px-8 py-6 bg-slate-50 border-2 rounded-3xl text-xl font-black text-slate-900 focus:bg-white transition-all outline-none ${isRecording ? 'border-red-500 bg-red-50' : 'border-slate-100 focus:border-[#25D366]'}`}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#25D366] transition-colors">
                      <i className="fa-solid fa-pen-nib text-xl"></i>
                  </div>
                </div>
                <button 
                  onClick={toggleRecording}
                  className={`w-20 rounded-3xl flex items-center justify-center text-white transition-all shadow-lg ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-[#25D366] hover:bg-[#128C7E]'}`}
                >
                  <i className={`fa-solid ${isRecording ? 'fa-stop' : 'fa-microphone'} text-2xl`}></i>
                </button>
              </div>

              <button 
                onClick={handleNext}
                disabled={!shopName.trim() || isRecording}
                className="mt-10 w-full py-6 bg-[#25D366] text-white rounded-[2rem] font-black text-xl shadow-xl shadow-green-100 hover:bg-[#128C7E] hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                Agla Qadam <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          ) : (
            <div className="animate-scale-in">
              <div className="flex items-center gap-4 mb-6">
                 <button onClick={() => setStep(1)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
                    <i className="fa-solid fa-arrow-left"></i>
                 </button>
                 <span className="text-xs font-black text-[#128C7E] uppercase tracking-widest bg-green-50 px-3 py-1 rounded-lg">Step 2: Inventory</span>
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-6 leading-tight">
                Pehla <span className="text-[#25D366]">Stock</span> Enter Karein
              </h2>
              <p className="text-slate-500 text-lg mb-8 font-medium">
                Kuch items likhein ya bol kar enter karein jo abhi aapki dukaan mein maujood hain. 
              </p>

              <div className="relative group">
                <textarea 
                  autoFocus
                  rows={4}
                  value={initialStock}
                  onChange={(e) => setInitialStock(e.target.value)}
                  placeholder={isRecording ? "Bolte jayein (e.g. 10 Lays 500, 20 Pepsi 1000)..." : "Yahan items ki list likhein ya mic button dabayein..."}
                  className={`w-full px-8 py-6 bg-slate-50 border-2 rounded-[2rem] text-lg font-bold text-slate-800 focus:bg-white transition-all outline-none resize-none ${isRecording ? 'border-red-500 bg-red-50' : 'border-slate-100 focus:border-[#25D366]'}`}
                />
                
                <button 
                  onClick={toggleRecording}
                  className={`absolute bottom-6 right-6 w-14 h-14 rounded-2xl flex items-center justify-center text-white transition-all shadow-xl z-10 ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-[#25D366] hover:bg-[#128C7E]'}`}
                >
                  <i className={`fa-solid ${isRecording ? 'fa-stop' : 'fa-microphone'} text-xl`}></i>
                </button>
              </div>
              
              {isRecording && (
                <div className="mt-4 flex items-center gap-2 text-red-500 font-black text-xs uppercase tracking-widest animate-pulse">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Listening to your inventory...
                </div>
              )}

              <button 
                onClick={handleFinish}
                disabled={!initialStock.trim() || isSubmitting || isRecording}
                className="mt-10 w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xl shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <i className="fa-solid fa-circle-notch animate-spin"></i>
                ) : (
                  <>Setup Mukammal Karein <i className="fa-solid fa-check"></i></>
                )}
              </button>
            </div>
          )}
        </div>
        
        <div className="bg-slate-900 p-6 text-center">
            <p className="text-white/50 text-[10px] font-black uppercase tracking-[0.2em]">
                <i className="fa-solid fa-shield-halved mr-2 text-[#25D366]"></i> Data mehfooz hai aur sirf aapke phone par rahega
            </p>
        </div>
      </div>
    </div>
  );
};

export default SetupFlow;
