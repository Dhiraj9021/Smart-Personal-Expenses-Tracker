import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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

  // Scroll to bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Send message to AI server
  const sendMessageToAI = async (message) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/aichat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message }),
      });

      if (!res.ok) throw new Error("AI server error");

      const data = await res.json();
      return data.reply || "I couldn’t generate a response right now.";
    } catch (err) {
      toast.warning("AI server error. Please try again.");
      return "I'm sorry, I couldn't generate a response right now.";
    }
  };

  // Handle sending user input
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { from: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    const aiReply = await sendMessageToAI(userMessage);
    setLoading(false);

    setMessages((prev) => [...prev, { from: "bot", text: aiReply }]);
  };

  // Bot message styling
  const getBotStyle = (text) => {
 
    return "bg-gray-200 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200";
  };

  return (
    <div className="flex justify-center mt-10 pb-40 px-4 dark:bg-gray-900 dark:text-gray-100">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-4 font-semibold text-xl text-center">
          Finance AI Assistant 
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-gray-50 dark:bg-gray-900 h-96">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-3 rounded-2xl max-w-xl whitespace-pre-line border ${
                  msg.from === "user"
                    ? "bg-blue-500 dark:bg-blue-600 text-white rounded-br-none"
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
              <div className="bg-gray-300 dark:bg-gray-700 px-4 py-2 rounded-xl animate-pulse text-gray-800 dark:text-gray-200">
                🤖 Typing...
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="flex p-4 border-t dark:border-gray-700 gap-3 bg-gray-100 dark:bg-gray-800">
          <input
            type="text"
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600"
            placeholder="Ask about savings, expenses, or advice..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-2 rounded-full hover:bg-blue-700 dark:hover:bg-blue-800 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
