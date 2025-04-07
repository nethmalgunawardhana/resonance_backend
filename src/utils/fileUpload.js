const processFormData = (req) => {
  const data = req.body;
  
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
  
  // Simply return all data as is, with the processed files
  return {
    ...data,
    ...files
  };
};

module.exports = {
  processFormData
};