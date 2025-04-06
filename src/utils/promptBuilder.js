exports.buildPromptWithContext = (userQuery, researchData) => {
    // Construct a context-rich prompt for the LLM based on research data
    let contextString = '';
    
    if (researchData && researchData.length > 0) {
      contextString = 'Here is information about our research projects:\n\n';
      
      researchData.forEach(project => {
        if (project.abstract) {
          contextString += `Project ID: ${project.id}\n`;
          contextString += `Abstract: ${project.abstract}\n`;
        }
        
        if (project.description) {
          contextString += `Description: ${project.description}\n`;
        }
        
        if (project.collaborationOpportunities) {
          contextString += 'Collaboration Opportunities: ' + 
            project.collaborationOpportunities.join(', ') + '\n';
        }
        
        contextString += '\n---\n\n';
      });
    }
    
    const fullPrompt = `
  You are an AI assistant for a research organization. Use the following research project information to answer the user's question.
  If the information needed is not in the provided context, politely state that you don't have that specific information.
  
  CONTEXT INFORMATION:
  ${contextString}
  
  USER QUESTION: ${userQuery}
  
  Please provide a helpful, accurate, and concise answer based only on the information provided above.
  `;
  
    return fullPrompt;
  };