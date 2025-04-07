const firestoreService = require('../services/firestoreService');
const geminiService = require('../services/geminiService');
const promptBuilder = require('../utils/promptBuilder');

exports.handleChatMessage = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const researchData = await firestoreService.getRelevantResearchData(message);
    
  
    const prompt = promptBuilder.buildPromptWithContext(message, researchData);
 
    const response = await geminiService.generateResponse(prompt);
    
    return res.status(200).json({ response });
  } catch (error) {
    console.error('Error in chat controller:', error);
    return res.status(500).json({ error: 'Failed to process your request' });
  }
};

exports.clearChatHistory = async (req, res) => {
  try {
  
    await geminiService.clearHistory();
    return res.status(200).json({ message: 'Chat history cleared' });
  } catch (error) {
    console.error('Error clearing chat history:', error);
    return res.status(500).json({ error: 'Failed to clear chat history' });
  }
};