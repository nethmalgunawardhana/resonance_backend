const { model } = require('../config/gemini');

// Store chat history if needed
let chatHistory = [];

exports.generateResponse = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Store in history if needed
    chatHistory.push({ role: 'user', parts: [prompt] });
    chatHistory.push({ role: 'model', parts: [text] });
    
    return text;
  } catch (error) {
    console.error('Error generating response from Gemini:', error);
    throw error;
  }
};

exports.clearHistory = async () => {
  chatHistory = [];
  return true;
};
