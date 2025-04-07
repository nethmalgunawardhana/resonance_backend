const processFormData = (req) => {
    const data = req.body;
    
    // Process arrays from form data
    const processArray = (prefix) => {
      const result = [];
      const keys = Object.keys(data).filter(key => key.startsWith(prefix));
      
      if (keys.length === 0) return [];
      
      // Sort the keys to maintain order
      keys.sort((a, b) => {
        const indexA = parseInt(a.match(/\[(\d+)\]/)[1]);
        const indexB = parseInt(b.match(/\[(\d+)\]/)[1]);
        return indexA - indexB;
      });
      
      keys.forEach(key => {
        result.push(data[key]);
      });
      
      return result;
    };
    
    // Process Cloudinary files
    const files = {};
    if (req.files) {
      if (req.files.thumbnail) {
        files.thumbnail = req.files.thumbnail[0];
      }
      
      if (req.files.trailerVideo) {
        files.trailerVideo = req.files.trailerVideo[0];
      }
    }
    
    return {
      ...data,
      keyInformation: processArray('keyInformation['),
      requestedSkills: processArray('requestedSkills['),
      team: processArray('team['),
      ...files
    };
  };
  
  module.exports = {
    processFormData
  };