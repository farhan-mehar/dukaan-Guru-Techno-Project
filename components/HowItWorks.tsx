import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

type Message = {
  role: "user" | "ai";
  text: string;
  isError?: boolean;
};

type InventoryItem = {
  name: string;
  qty: number;
  price: number;
  type: "sale" | "stock" | "udhaar";
  action: "upsert" | "delete";
  customerName?: string;
  phone?: string;
};

const HowItWorks: React.FC = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [recentBatch, setRecentBatch] = useState<InventoryItem[]>([]);
  const [shopName] = useState<string>("My Shop");
  const [isReportOpen, setIsReportOpen] = useState(false);

  const updateInventory = (items: InventoryItem[]) => {
    setRecentBatch(prev => [...prev, ...items]);
  };

  const handleSendMessage = async (
    e?: React.FormEvent,
    directText?: string
  ) => {
    if (e) e.preventDefault();

    const messageToSend = directText || input;
    if (!messageToSend.trim() || loading) return;

    setMessages(prev => [...prev, { role: "user", text: messageToSend }]);
    if (!directText) setInput("");
    setLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(
        import.meta.env.VITE_GEMINI_API_KEY
      );

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const currentStockNames = recentBatch.map(i => i.name).join(", ");

      const prompt = `
User message: "${messageToSend}"

Context:
You are Dukaan Guru AI assistant for ${shopName}.
Current Inventory: ${currentStockNames || "No items yet"}

Instructions:
- Detect intent: sale, stock, udhaar, or report
- Reply in simple confirmation message
- If report requested, say "REPORT"
`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      setMessages(prev => [
        ...prev,
        {
          role: "ai",
          text: text || "Theek hai, note kar liya."
        }
      ]);

      if (text?.toLowerCase().includes("report")) {
        setIsReportOpen(true);
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => [
        ...prev,
        {
          role: "ai",
          text: "Maf kijiye, koi masla aa gaya hai.",
          isError: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Dukaan Guru AI</h2>

      <form onSubmit={handleSendMessage}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Message likhiye..."
        />
        <button type="submit" disabled={loading}>
          {loading ? "Soch raha hoon..." : "Send"}
        </button>
      </form>

      <div>
        {messages.map((m, i) => (
          <p key={i}>
            <b>{m.role === "user" ? "You" : "AI"}:</b> {m.text}
          </p>
        ))}
      </div>

      {isReportOpen && <p>📊 Report Generated</p>}
    </div>
  );
};

export default HowItWorks;
