import React, { useState, useRef, useEffect, useMemo } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { jsPDF } from "jspdf";

interface BatchItem {
  name: string;
  qty: number;
  price: number;
  type: 'sale' | 'stock' | 'udhaar';
  action?: 'upsert' | 'delete';
  customerName?: string;
  phone?: string;
}

interface UdhaarEntry {
  customerName: string;
  phone: string;
  amount: number;
  product: string;
  date: string;
  timestamp: number;
}

interface Message {
  role: 'user' | 'ai';
  text: string;
  isError?: boolean;
}

interface HowItWorksProps {
  shopName?: string;
  initialStock?: string;
}

// Extend Window interface for SpeechRecognition
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

const HowItWorks: React.FC<HowItWorksProps> = ({ shopName, initialStock }) => {
  const [input, setInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentBatch, setRecentBatch] = useState<BatchItem[]>([]);
  const [udhaarList, setUdhaarList] = useState<UdhaarEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'stock' | 'udhaar'>('stock');
  const [isReportOpen, setIsReportOpen] = useState(false);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setMessages([
      { 
        role: 'ai', 
        text: `Salaam ${shopName || 'Dukaan Guru'}! Maine aapka initial stock record kar liya hai. Ab aur kuch enter karna hai?` 
      }
    ]);

    if (initialStock) {
        processInitialStock(initialStock);
    }
  }, [shopName]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US'; 

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsRecording(false);
        handleSendMessage(undefined, transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  const updateInventory = (extractedItems: BatchItem[]) => {
    setRecentBatch(prev => {
      let newList = [...prev];
      extractedItems.forEach(newItem => {
        const cleanName = newItem.name.trim().toLowerCase();
        if (!cleanName || newItem.type === 'udhaar') return;

        const existingIndex = newList.findIndex(item => 
          item.name.trim().toLowerCase() === cleanName
        );

        if (newItem.action === 'delete') {
          if (existingIndex !== -1) {
            newList.splice(existingIndex, 1);
          }
        } else {
          if (existingIndex !== -1) {
            const currentQty = newList[existingIndex].qty;
            let newQty = currentQty;
            
            if (newItem.type === 'sale') {
                newQty = Math.max(0, currentQty - newItem.qty);
            } else if (newItem.type === 'stock') {
                newQty = newItem.qty;
            }

            newList[existingIndex] = {
              ...newList[existingIndex],
              qty: newQty,
              price: newItem.price > 0 ? newItem.price : newList[existingIndex].price,
            };
          } else if (newItem.type !== 'sale') {
            newList.unshift(newItem);
          }
        }
      });
      return newList;
    });

    const newUdhaars = extractedItems
      .filter(item => item.type === 'udhaar')
      .map(item => ({
        customerName: item.customerName || 'Gumnam Grahak',
        phone: item.phone || 'N/A',
        amount: item.price,
        product: item.name,
        date: new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'short' }),
        timestamp: Date.now()
      }));
    
    if (newUdhaars.length > 0) {
      setUdhaarList(prev => [...newUdhaars, ...prev]);
      setActiveTab('udhaar');
    }
  };

  const processInitialStock = (text: string) => {
    const rawLines = text.split(/[\n,]| aur | and /i).filter(l => l.trim().length > 1);
    const items: BatchItem[] = rawLines.map((line): BatchItem => {
      const parts = line.match(/(\d+)\s+([\w\s.]+)\s+(\d+)/);
      if (parts) {
        return {
          qty: parseInt(parts[1]),
          name: parts[2].trim(),
          price: parseInt(parts[3]),
          type: 'stock',
          action: 'upsert'
        };
      }
      return { name: line.trim(), qty: 1, price: 0, type: 'stock', action: 'upsert' };
    }).filter(i => i.name.length > 0);
    
    updateInventory(items);
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Aapka browser voice support nahi karta.");
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  const handleSendMessage = async (e?: React.FormEvent, directText?: string) => {
    if (e) e.preventDefault();
    const messageToSend = directText || input;
    if (!messageToSend.trim() || loading) return;

    setMessages(prev => [...prev, { role: 'user', text: messageToSend }]);
    if (!directText) setInput("");
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const currentStockNames = recentBatch.map(i => i.name).join(", ");

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `
          User message: "${messageToSend}"
          Context: You are Dukaan Guru AI assistant for ${shopName || 'a shop'}.
          Current Inventory in Stock: [${currentStockNames || "No items in stock yet"}]
          
          CRITICAL INSTRUCTIONS:
          1. REPORT REQUEST: If the user asks for a report, summary, "hisab kitab", "hisaab", "analysis", or "total", set 'generateReport' to true.
          2. AVAILABILITY CHECK: 
             - If the user tries to SELL ('sale') an item that is NOT in the [Current Inventory] list, you MUST NOT include it in the 'items' array. Instead, provide a 'confirmationMessage' in Roman Urdu stating that the product is not available in stock.
          3. DETECT INTENT: 'sale', 'stock' (add/update), or 'udhaar'.
          4. CLEAN NAMES: Use raw product names only.
        `,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              confirmationMessage: { type: Type.STRING },
              generateReport: { type: Type.BOOLEAN },
              hasError: { type: Type.BOOLEAN },
              items: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    qty: { type: Type.NUMBER },
                    price: { type: Type.NUMBER },
                    type: { type: Type.STRING, enum: ["sale", "stock", "udhaar"] },
                    action: { type: Type.STRING, enum: ["upsert", "delete"] },
                    customerName: { type: Type.STRING },
                    phone: { type: Type.STRING }
                  },
                  required: ["name", "qty", "price", "action", "type"]
                }
              }
            },
            required: ["confirmationMessage", "items"]
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      const lowerMsg = data.confirmationMessage?.toLowerCase() || "";
      const isMissing = lowerMsg.includes("nahi hai") || lowerMsg.includes("not in stock") || lowerMsg.includes("maaf kijiyega");

      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: data.confirmationMessage || "Ok, noted.",
        isError: isMissing || data.hasError
      }]);
      
      if (data.generateReport) {
        setIsReportOpen(true);
      }

      if (data.items && data.items.length > 0) {
        updateInventory(data.items);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'ai', text: "Maf kijiyega, main thora confuse ho gaya. Please dobara bataiye.", isError: true }]);
    } finally {
      setLoading(false);
      if (directText) setInput("");
    }
  };

  const totalStockValue = useMemo(() => 
    recentBatch.reduce((acc, curr) => acc + (curr.qty * curr.price), 0), 
  [recentBatch]);

  const totalUdhaarValue = useMemo(() => 
    udhaarList.reduce((acc, curr) => acc + curr.amount, 0),
  [udhaarList]);

  const handleDownloadReport = () => {
    try {
      const doc = new jsPDF();
      const dateStr = new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });
      const shop = shopName || 'Dukaan Guru User';

      doc.setFillColor(7, 94, 84); 
      doc.rect(0, 0, 210, 45, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(28);
      doc.text(shop.toUpperCase(), 20, 25);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("BUSINESS PERFORMANCE REPORT", 20, 35);
      doc.text("GENERATED BY DUKAAN GURU AI", 20, 40);
      doc.text(`DATE: ${dateStr}`, 155, 25);

      let y = 60;
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(20, y, 170, 35, 3, 3, 'F');
      
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("FINANCIAL SUMMARY", 25, y + 10);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Total Inventory Asset Value: Rs. ${totalStockValue.toLocaleString()}`, 25, y + 20);
      doc.text(`Total Credit Outstanding (Udhaar): Rs. ${totalUdhaarValue.toLocaleString()}`, 25, y + 27);

      y += 50;
      doc.setFont("helvetica", "bold");
      doc.text("STOCK INVENTORY", 20, y);
      y += 10;
      doc.setFontSize(9);
      doc.text("Item Name", 20, y);
      doc.text("Qty", 100, y);
      doc.text("Price", 130, y);
      doc.text("Total", 160, y);
      doc.line(20, y + 2, 190, y + 2);
      
      y += 10;
      recentBatch.forEach((item) => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.text(item.name.charAt(0).toUpperCase() + item.name.slice(1), 20, y);
        doc.text(item.qty.toString(), 100, y);
        doc.text(item.price.toString(), 130, y);
        doc.text((item.qty * item.price).toString(), 160, y);
        y += 8;
      });

      y += 10;
      doc.setFont("helvetica", "bold");
      doc.text("UDHAAR REGISTER", 20, y);
      y += 10;
      doc.line(20, y + 2, 190, y + 2);
      y += 10;
      udhaarList.forEach((entry) => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.text(`${entry.customerName} (${entry.phone})`, 20, y);
        doc.text(entry.product, 100, y);
        doc.text(`Rs. ${entry.amount}`, 160, y);
        y += 8;
      });

      doc.save(`Report_${shop.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error("PDF generation error", err);
      alert("Report generation fail ho gayi. Dobara koshish karein.");
    }
  };

  const handleShareWhatsApp = () => {
    const text = `*Dukaan Guru Business Summary*\n*Shop:* ${shopName || 'My Shop'}\n*Date:* ${new Date().toLocaleDateString()}\n\n📦 Stock Value: Rs. ${totalStockValue.toLocaleString()}\n🔴 Total Udhaar: Rs. ${totalUdhaarValue.toLocaleString()}\n🛒 Total Items: ${recentBatch.length}\n\n_Powered by Dukaan Guru AI_`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const filteredStock = useMemo(() => {
    return recentBatch.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [recentBatch, searchTerm]);

  const filteredUdhaar = useMemo(() => {
    return udhaarList.filter(u => 
      u.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.product.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [udhaarList, searchTerm]);

  return (
    <section id="how-it-works" className="py-24 px-4 bg-slate-100 overflow-hidden relative border-t border-slate-200">
      <div className="absolute inset-0 section-pattern opacity-20"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 lg:mb-24">
          <div className="inline-block px-4 py-1.5 bg-[#25D366]/10 text-[#128C7E] rounded-full text-xs font-black uppercase tracking-widest mb-6">Live Demo</div>
          <h2 className="text-4xl md:text-6xl font-black mb-8 text-slate-900 tracking-tight">{shopName || 'Aapki Dukaan'} <span className="text-[#25D366]">Action Mein</span></h2>
          <p className="text-slate-600 text-xl max-w-3xl mx-auto font-medium leading-relaxed">
            Ab bol kar ya likh kar apni dukaan manage karein. Voice commands Urdu aur English dono samajhta hai.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <div className="bg-white rounded-[3rem] shadow-xl border border-slate-200 overflow-hidden flex flex-col">
              <div className="flex border-b border-slate-100">
                <button 
                  onClick={() => { setActiveTab('stock'); setSearchTerm(""); }}
                  className={`flex-1 py-6 font-black text-sm uppercase tracking-widest transition-all ${activeTab === 'stock' ? 'text-[#25D366] bg-slate-50 border-b-4 border-[#25D366]' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <i className="fa-solid fa-boxes-stacked mr-2"></i> Stock Status
                </button>
                <button 
                  onClick={() => { setActiveTab('udhaar'); setSearchTerm(""); }}
                  className={`flex-1 py-6 font-black text-sm uppercase tracking-widest transition-all ${activeTab === 'udhaar' ? 'text-red-500 bg-slate-50 border-b-4 border-red-500' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <i className="fa-solid fa-receipt mr-2"></i> Udhaar Register
                </button>
              </div>

              <div className="px-8 py-4 bg-slate-50 border-b border-slate-100">
                <div className="relative">
                  <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                  <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={activeTab === 'stock' ? "Search stock items..." : "Search customers..."}
                    className="w-full pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-semibold outline-none focus:border-[#25D366] transition-all text-slate-900"
                  />
                </div>
              </div>

              <div className="p-8 h-[400px] overflow-y-auto custom-scrollbar bg-white">
                {activeTab === 'stock' ? (
                  <table className="w-full text-left">
                    <thead className="sticky top-0 bg-white z-10">
                      <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                        <th className="pb-4">Item</th>
                        <th className="pb-4">Qty</th>
                        <th className="pb-4">Price</th>
                        <th className="pb-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredStock.length > 0 ? filteredStock.map((item, idx) => (
                        <tr key={idx} className="group hover:bg-slate-50 transition-colors">
                          <td className="py-4 font-bold text-slate-700 capitalize">{item.name}</td>
                          <td className="py-4 text-slate-500 font-bold">{item.qty}x</td>
                          <td className="py-4 text-slate-900 font-black">₨ {item.price}</td>
                          <td className="py-4 text-right">
                            <span className="text-[9px] bg-green-100 text-[#128C7E] px-2 py-1 rounded-md font-black">IN STOCK</span>
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan={4} className="py-20 text-center text-slate-400">Inventory Khali Hai</td></tr>
                      )}
                    </tbody>
                  </table>
                ) : (
                  <table className="w-full text-left">
                    <thead className="sticky top-0 bg-white z-10">
                      <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                        <th className="pb-4">Customer</th>
                        <th className="pb-4">Product</th>
                        <th className="pb-4">Amount</th>
                        <th className="pb-4 text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredUdhaar.length > 0 ? filteredUdhaar.map((entry, idx) => (
                        <tr key={idx} className="group hover:bg-red-50/30 transition-colors">
                          <td className="py-4">
                            <div className="font-bold text-slate-900">{entry.customerName}</div>
                            <div className="text-[10px] text-slate-400 font-black">{entry.phone}</div>
                          </td>
                          <td className="py-4 text-slate-500 font-bold capitalize">{entry.product}</td>
                          <td className="py-4 text-red-600 font-black">₨ {entry.amount}</td>
                          <td className="py-4 text-right text-slate-400 font-bold text-xs">{entry.date}</td>
                        </tr>
                      )) : (
                        <tr><td colSpan={4} className="py-20 text-center text-slate-400">Udhaar Register Saaf Hai</td></tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#128C7E] p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">Total Udhaar</p>
                  <h3 className="text-2xl font-black">₨ {totalUdhaarValue.toLocaleString()}</h3>
                </div>
              </div>
              <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">Stock Value</p>
                  <h3 className="text-2xl font-black">₨ {totalStockValue.toLocaleString()}</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-32">
            <div className="bg-white rounded-[3.5rem] shadow-2xl border-[12px] border-slate-900 overflow-hidden max-w-[420px] mx-auto">
              <div className="bg-[#075e54] p-5 flex items-center justify-between text-white">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/10">
                        <i className="fa-solid fa-shop text-sm"></i>
                    </div>
                    <div>
                        <h4 className="font-black text-sm tracking-tight text-white">{shopName || 'Dukaan Guru AI'}</h4>
                        <p className="text-[10px] opacity-70 font-bold text-white">Online & Listening</p>
                    </div>
                </div>
              </div>
              
              <div ref={chatContainerRef} className="bg-[#e5ddd5] h-[400px] p-6 overflow-y-auto flex flex-col gap-4 custom-scrollbar">
                {messages.map((m, i) => (
                  <div key={i} className={`max-w-[85%] p-4 rounded-2xl shadow-sm text-[15px] font-medium leading-relaxed ${m.role === 'user' ? 'bg-[#dcf8c6] text-slate-900 self-end rounded-tr-none' : `bg-white text-slate-900 self-start rounded-tl-none border-l-4 ${m.isError ? 'border-red-500 bg-red-50' : 'border-[#25D366]'}`}`}>
                    {m.text}
                  </div>
                ))}
                {loading && (
                  <div className="bg-white self-start p-4 rounded-2xl shadow-sm w-48 animate-pulse flex gap-2 items-center">
                    <div className="w-2 h-2 bg-[#25D366] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#25D366] rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-[#25D366] rounded-full animate-bounce delay-150"></div>
                  </div>
                )}
                {isRecording && (
                  <div className="bg-white/90 backdrop-blur border border-[#25D366]/30 self-center p-4 rounded-2xl flex items-center gap-4 animate-scale-in">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-black text-[#128C7E] uppercase tracking-widest">Listening...</span>
                  </div>
                )}
              </div>

              <div className="p-4 bg-white border-t border-slate-100">
                <form onSubmit={(e) => handleSendMessage(e)} className="flex items-center gap-2">
                    <textarea 
                        rows={1}
                        value={input} 
                        onChange={(e) => setInput(e.target.value)} 
                        placeholder={isRecording ? "Listening..." : "Likhein ya bolain..."}
                        disabled={isRecording}
                        className="flex-1 p-3.5 rounded-xl text-[14px] font-medium outline-none border border-slate-200 focus:border-[#25D366] bg-white text-slate-900 placeholder:text-slate-400 resize-none shadow-sm" 
                    />
                    <button 
                      type="button"
                      onClick={toggleRecording}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isRecording ? 'bg-red-500' : 'bg-[#25D366]'} text-white shadow-lg`}
                    >
                      <i className={`fa-solid ${isRecording ? 'fa-stop' : 'fa-microphone'}`}></i>
                    </button>
                    {input.trim() !== "" && (
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center transition-transform active:scale-95"
                      >
                        <i className="fa-solid fa-paper-plane"></i>
                      </button>
                    )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isReportOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setIsReportOpen(false)}>
           <div className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl scale-in" onClick={e => e.stopPropagation()}>
              <div className="bg-slate-900 p-10 text-white">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-4xl font-black text-white">{shopName || 'Report'}</h3>
                    <button onClick={() => setIsReportOpen(false)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                  <p className="text-slate-400 font-medium">Business Performance Summary</p>
              </div>
              <div className="p-10 space-y-10 bg-white">
                  <div className="grid grid-cols-2 gap-6">
                      <div className="bg-slate-50 p-6 rounded-3xl">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inventory Value</p>
                          <p className="text-3xl font-black text-slate-900">₨ {totalStockValue.toLocaleString()}</p>
                      </div>
                      <div className="bg-slate-50 p-6 rounded-3xl">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Udhaar</p>
                          <p className="text-3xl font-black text-red-600">₨ {totalUdhaarValue.toLocaleString()}</p>
                      </div>
                  </div>
                  <div className="flex gap-4">
                      <button onClick={handleShareWhatsApp} className="flex-1 py-4 bg-[#25D366] text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-[#128C7E] transition-colors">
                          <i className="fa-brands fa-whatsapp"></i> Share Summary
                      </button>
                      <button onClick={handleDownloadReport} className="px-8 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition-colors">
                          <i className="fa-solid fa-download"></i> PDF
                      </button>
                  </div>
              </div>
           </div>
        </div>
      )}
    </section>
  );
};

export default HowItWorks;