
const { db } = require('../config/firebase');
const researchFundingContractService = require('../services/researchFundingContractService');

const researchCollection = db.collection('research');
const categoriesDoc = db.collection('metadata').doc('categories');
const languagesDoc = db.collection('metadata').doc('languages');

const saveResearch = async (data, userId, isDraft = false) => {
  // Create a research document
  const researchData = {
    title: data.title,
    category: data.category,
    language: data.language,
    fundingGoal: parseFloat(data.fundingGoal),
    description: data.description,
    keyInformation: data.keyInformation || [],
    isEthereumFundingEnabled: data.isEthereumFundingEnabled === 'true',
    ethereumAddress: data.ethereumAddress || '',
    allowCollaboratorRequests: data.allowCollaboratorRequests === 'true',
    allowUnlistedSkills: data.allowUnlistedSkills === 'true',
    requestedSkills: data.requestedSkills || [],
    team: data.team || [],
    createdBy: userId,
    createdAt: new Date(),
    updatedAt: new Date(),
    isDraft: isDraft,
    status: isDraft ? 'draft' : 'pending'
  };

  // Handle files that were uploaded to Cloudinary via multer-storage-cloudinary
  if (data.thumbnail) {
    researchData.thumbnailUrl = data.thumbnail.path;
    researchData.thumbnailPublicId = data.thumbnail.filename;
  }

  if (data.trailerVideo) {
    researchData.trailerVideoUrl = data.trailerVideo.path;
    researchData.trailerVideoPublicId = data.trailerVideo.filename;
  }

  // if isEthereumFundingEnabled the create the project on the blockchain
  let isSavingOnChain = false;
  if (!isDraft && data.isEthereumFundingEnabled && data.ethereumAddress && data.ethereumAddress !== '') {
    isSavingOnChain = true;
    researchFundingContractService.createProject(
      data.title,
      data.description,
      data.ethereumAddress
    ).then((result) => {
      console.log('Project created on blockchain:', result);

      // add to the research document
      researchData.onChainProjectId = result.onChainProjectId;
      researchData.onChainTransactionHash = result.transactionHash;
      isSavingOnChain = false;
    }).catch((error) => {
      isSavingOnChain = false;
      console.error('Error creating project on blockchain:', error);
    });   
  }

  // wait for the project to be created on the blockchain
  while (isSavingOnChain) {
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  console.log('beforesaveResearch', researchData);
  const docRef = await researchCollection.add(researchData);
  console.log('docRef', docRef);
  
  
  return { id: docRef.id, ...researchData };
};

const getCategories = async () => {
  const doc = await categoriesDoc.get();
  if (!doc.exists) {
    // Initialize with default categories if none exist
    const defaultCategories = [
      'Medical Research', 
      'Environmental Science', 
      'Technology', 
      'Social Sciences',
      'Physics',
      'Biology',
      'Chemistry',
      'Economics',
      'Psychology'
    ];
    await categoriesDoc.set({ list: defaultCategories });
    return defaultCategories;
  }
  return doc.data().list;
};

const getLanguages = async () => {
  const doc = await languagesDoc.get();
  if (!doc.exists) {
    // Initialize with default languages if none exist
    const defaultLanguages = [
      'English', 
      'Spanish', 
      'French', 
      'German',
      'Chinese',
      'Japanese',
      'Russian',
      'Arabic',
      'Portuguese'
    ];
    await languagesDoc.set({ list: defaultLanguages });
    return defaultLanguages;
  }
  return doc.data().list;
};

module.exports = {
  saveResearch,
  getCategories,
  getLanguages
};