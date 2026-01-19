// utils/aiFinance.js
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Generate the dashboard AI summary (monthly insights)
 * @param {Object} data - User's financial data
 * @param {number} data.totalIncome
 * @param {number} data.totalExpense
 * @param {number} data.remaining
 * @param {Object} data.categoryTotals - { categoryName: amount }
 */
async function generateAISummary(data) {
  const prompt = `
You are a smart personal finance assistant. You have the following user data:

Total Income: ₹${data.totalIncome}
Total Expense: ₹${data.totalExpense}
Remaining Balance: ₹${data.remaining}
Category-wise expenses: ${JSON.stringify(data.categoryTotals)}

Generate simple words to understand all a monthly summary in that includes:
1. One-line financial health overview 
2. Two practical money-saving tips
3. One warning if any category spending is high
6. Keep it simple, concise, and friendly for the user
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
}

/**
 * Generate AI Chat Bot reply (dynamic Q/A)
 * @param {string} userMessage - The question asked by the user
 * @param {Object} userData - User's financial data
 */
async function generateAiChatReply(userMessage, userData) {
  const prompt = `
You are a personal finance assistant.

User Data:
- Total Income: ₹${userData.totalIncome}
- Total Expense: ₹${userData.totalExpense}
- Remaining Balance: ₹${userData.remaining}
- Category-wise expenses: ${JSON.stringify(userData.categoryTotals)}

Rules:
1. Only answer questions about the user's personal income, expenses, remaining balance, savings, or financial health.
2. If the question is unrelated (e.g., sports, politics), politely respond: "I'm sorry, I can only answer questions about your personal finances."
3. Provide actionable tips, warnings, or insights strictly based on the user's own data.
4. Keep answers clear, concise, and friendly in 2 or 3 lines.

User Question: "${userMessage}"
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
}

module.exports = {
  generateAISummary,
  generateAiChatReply,
};
