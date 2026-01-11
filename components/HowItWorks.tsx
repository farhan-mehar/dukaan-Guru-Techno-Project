const handleSendMessage = async (e?: React.FormEvent, directText?: string) => {
  if (e) e.preventDefault();
  const messageToSend = directText || input;
  if (!messageToSend.trim() || loading) return;

  setMessages(prev => [...prev, { role: 'user', text: messageToSend }]);
  if (!directText) setInput("");
  setLoading(true);

  try {
    // ✅ FIXED: Vite-compatible env variable
    const ai = new GoogleGenAI({
      apiKey: import.meta.env.VITE_GEMINI_API_KEY
    });

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
           - If the user tries to SELL ('sale') an item that is NOT in the [Current Inventory] list, DO NOT include it in 'items'.
        3. DETECT INTENT: 'sale', 'stock', or 'udhaar'.
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

    const data = JSON.parse(response.text || "{}");

    setMessages(prev => [
      ...prev,
      {
        role: 'ai',
        text: data.confirmationMessage || "Ok, noted.",
        isError: data.hasError
      }
    ]);

    if (data.generateReport) setIsReportOpen(true);
    if (data.items?.length) updateInventory(data.items);

  } catch (err) {
    console.error(err);
    setMessages(prev => [
      ...prev,
      {
        role: 'ai',
        text: "Maf kijiyega, main thora confuse ho gaya. Please dobara bataiye.",
        isError: true
      }
    ]);
  } finally {
    setLoading(false);
    if (directText) setInput("");
  }
};
