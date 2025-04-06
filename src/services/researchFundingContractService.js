const { ethers, parseEther } = require('ethers');

// Set up the provider and contract
const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`);
const adminWallet = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY, provider);
const contractAddress = process.env.DEPLOYED_CONTRACT_ADDRESS;

if (!contractAddress) {
  throw new Error('Please set the DEPLOYED_CONTRACT_ADDRESS environment variable');
}

// Contract ABI (simplified version)
const researchFundingABI = [
  "function createProject(string memory _name, string memory _description, address payable _recipient) public payable",
  "function activateProject(uint _id) public",
  "function deactivateProject(uint _id) public",
  "function fundProject(uint _id) public payable",
  "function withdraw(uint _id) public",
  "function getProjectDetails(uint _id) public view returns (string memory, string memory, uint, address, bool)",
  "function getContractBalance() public view returns (uint)",
  "function withdrawFees() public",

];

// Create the contract instance
const researchFundingContract = new ethers.Contract(contractAddress, researchFundingABI, adminWallet);

// Service to create a project
async function createProject(name, description, recipient) {
  try {
    const tx = await researchFundingContract.createProject(
      name, 
      description,
      recipient,
      { value: parseEther('0.005') } // Fee for creating a project
    );
    await tx.wait(); // Wait for the transaction to be mined
    return { success: true, transactionHash: tx.hash };
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create project', error);
  }
}

// Service to fund a project
async function fundProject(projectId, amount, userWallet) {
  try {
    
    const contractWithSigner = researchFundingContract.connect(userWallet);
    const tx = await contractWithSigner.fundProject(
      projectId,
      { value: parseEther(amount.toString()) } // Fund amount
    );
    await tx.wait(); // Wait for the transaction to be mined
    return { success: true, transactionHash: tx.hash };
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fund project');
  }
}

// Service to get project details
async function getProjectDetails(projectId) {
  try {
    const projectDetails = await researchFundingContract.getProjectDetails(projectId);
    return projectDetails;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch project details');
  }
}

async function withdraw(projectId) {
  try {
    const withrawal = await researchFundingContract.withdraw(projectId);
    return { success: true, transactionHash: withrawal.hash };
  } catch (error) {
    console.error(error);
    throw new Error('Failed to withdraw funds');
  }
}

async function getContractBalance() {
  try {
    const balance = await researchFundingContract.getContractBalance();
    console.log(`raw balance: ${balance}`);
    const formattedBalance = ethers.formatEther(balance);
    console.log(`formatted balance: ${formattedBalance}`);
    return formattedBalance;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch contract balance');
  }
  
}

async function withdrawFees() {
  try {
    const tx = await researchFundingContract.withdrawFees();
    await tx.wait(); // Wait for the transaction to be mined
    return { success: true, transactionHash: tx.hash };
  } catch (error) {
    console.error(error);
    throw new Error('Failed to withdraw fees');
  }
}


module.exports = { createProject, fundProject, getProjectDetails, withdraw, getContractBalance, withdrawFees};
