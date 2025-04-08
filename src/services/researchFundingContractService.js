const { ethers, parseEther, formatEther } = require('ethers');

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
  "function getProjectTransactions(uint _id) public view returns (tuple(uint projectId, uint amount, address user, string txType, uint timestamp)[])",
  "event ProjectCreated(uint256 id, string name, address recipient, bool isActive)"
];

async function getEthPriceInUSD() {
  // Try Alchemy first
  try {
    const response = await fetch('https://api.g.alchemy.com/prices/v1/tokens/by-symbol?symbols=ETH', {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${process.env.ALCHEMY_API_KEY}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      const ethPriceData = data?.data?.find((token) => token.symbol === "ETH");

      const price = parseFloat(ethPriceData?.prices?.[0]?.value);
      if (!isNaN(price)) {
        return price;
      } else {
        throw new Error("Invalid price format from Alchemy.");
      }
    } else {
      console.warn(`Alchemy API failed: ${response.statusText}`);
    }
  } catch (error) {
    console.warn('Error fetching ETH price from Alchemy:', error);
  }

  // Fallback to CoinGecko
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
    if (!res.ok) {
      throw new Error(`CoinGecko API failed: ${res.statusText}`);
    }
    const data = await res.json();
    const price = parseFloat(data.ethereum.usd);
    if (!isNaN(price)) {
      return price;
    } else {
      throw new Error("Invalid price format from CoinGecko.");
    }
  } catch (fallbackError) {
    console.error('Failed to fetch ETH price from CoinGecko:', fallbackError);
  }

  return null;
}

// Create the contract instance
const researchFundingContract = new ethers.Contract(contractAddress, researchFundingABI, adminWallet);

const ethersInterface = new ethers.Interface(researchFundingABI);

// Service to create a project
async function createProject(name, description, recipient) {
  try {
    const tx = await researchFundingContract.createProject(
      name, 
      description,
      recipient,
      { value: parseEther('0.005') } // Fee for creating a project
    );
    const receipt = await tx.wait();

    let onChainProjectId = null;

    for (const log of receipt.logs) {
      try {
        const parsedLog = ethersInterface.parseLog(log);
        if (parsedLog.name === "ProjectCreated") {
          onChainProjectId = parsedLog.args.id;
          console.log("Project ID from event from blockchain:", projectId.toString());
        }
      } catch (err) {
        // ignore
      }
    }
        
    return { success: true, transactionHash: tx.hash , onChainProjectId: Number(onChainProjectId) };
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

async function getProjectTransactions(projectId) {
  try {
    const ethPrice = await getEthPriceInUSD();
    const rawTransactions = await researchFundingContract.getProjectTransactions(projectId);

    const formattedTransactions = rawTransactions.map((tx) => {
      const ethAmount = parseFloat(formatEther(tx.amount));
      const usdAmount = ethPrice ? (ethAmount * ethPrice).toFixed(2) : null;

      return {
        projectId: tx.projectId.toString(),
        amount: ethAmount.toString(),
        amountInUSD: usdAmount ? `$${usdAmount}` : "Unavailable",
        user: tx.user,
        txType: tx.txType,
        timestamp: new Date(Number(tx.timestamp.toString()) * 1000).toLocaleString()
      };
    });

    return formattedTransactions;

  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw new Error('Failed to fetch project transactions');
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


module.exports = {
  createProject,
  fundProject,
  getProjectDetails,
  getProjectTransactions,
  withdraw,
  getContractBalance,
  withdrawFees,
  getEthPriceInUSD,
};
