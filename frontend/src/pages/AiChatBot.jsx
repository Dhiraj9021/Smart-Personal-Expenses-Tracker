import React, { useState, useEffect, useRef } from "react";
import { toast } from 'react-toastify';

export default function AiChatBot() {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hello! 🤖 I’m your finance assistant. Ask me about expenses, savings, or financial tips.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessageToAI = async (message) => {
    try {
      const res = await fetch("http://localhost:5000/aichat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      return data.reply || "I couldn’t generate a response right now.";
    } catch (err) {
      toast.warning(" AI server error. Please try again.");
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { from: "user", text: input }]);
    setInput("");
    setLoading(true);

    const aiReply = await sendMessageToAI(input);

    setLoading(false);
    setMessages((prev) => [...prev, { from: "bot", text: aiReply }]);
  };

  const getBotStyle = (text) => {
    if (text.toLowerCase().includes("warning") || text.toLowerCase().includes("high"))
      return "bg-gray-200 border-gray-300 text-gray-900";
    if (text.toLowerCase().includes("healthy") || text.toLowerCase().includes("good"))
      return "bg-green-100 border-green-400 text-green-900";
    return "bg-gray-200 border-gray-300 text-gray-900";
  };

  return (
    <div className="flex justify-center mt-10 pb-40 px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-blue-600 text-white px-6 py-4 font-semibold text-xl text-center">
          🤖 Finance AI Assistant
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-gray-50 h-96">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-3 rounded-2xl max-w-xl whitespace-pre-line border ${
                  msg.from === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : `${getBotStyle(msg.text)} rounded-bl-none`
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-300 px-4 py-2 rounded-xl animate-pulse">
                🤖 Typing...
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="flex p-4 border-t gap-3">
          <input
            type="text"
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Ask about savings, expenses, advice..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
