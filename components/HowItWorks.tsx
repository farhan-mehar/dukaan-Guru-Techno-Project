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
};

type HowItWorksProps = {
  shopName?: string;
  initialStock?: string;
};

const HowItWorks: React.FC<HowItWorksProps> = ({
  shopName = "My Shop"
}) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [recentBatch, setRecentBatch] = useState<InventoryItem[]>([]);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    setMessages(prev => [...prev, { role: "user", text: input }]);
    setLoading(true);
    setInput("");

    try {
      const genAI = new GoogleGenerativeAI(
        import.meta.env.VITE_GEMINI_API_KEY
      );

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash"
      });

      const stockNames = recentBatch.map(i => i.name).join(", ");

      const prompt = `
You are Dukaan Guru AI for ${shopName}
Stock: ${stockNames || "No stock yet"}
User: ${input}
`;

      const result = await model.generateContent(prompt);
      const reply = result.response.text();

      setMessages(prev => [...prev, { role: "ai", text: reply }]);

      if (reply.toLowerCase().includes("report")) {
        setIsReportOpen(true);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          role: "ai",
          text: "Kuch ghalat ho gaya, dobara koshish karein.",
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
        <button disabled={loading}>
          {loading ? "Soch raha hoon..." : "Send"}
        </button>
      </form>

      {messages.map((m, i) => (
        <p key={i}>
          <b>{m.role}:</b> {m.text}
        </p>
      ))}

      {isReportOpen && <p>📊 Report Ready</p>}
    </div>
  );
};

export default HowItWorks;
