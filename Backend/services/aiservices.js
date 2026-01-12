const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});


async function generateAISummary(data) {
  const prompt = `
You are a smart personal finance assistant.

Monthly Summary:
Total Income: ₹${data.totalIncome}
Total Expense: ₹${data.totalExpense}
Remaining Balance: ₹${data.remaining}

Category-wise expenses:
${JSON.stringify(data.categoryTotals)}

Give:
1. One line financial health summary
2. 2 practical money-saving tips
3. One warning if spending is high

Keep it simple and user-friendly.
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
}

module.exports = { generateAISummary };
