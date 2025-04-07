const { ethers } = require('ethers');
const { db } = require('../config/firebase');
const {
  createProject,
  fundProject,
  getProjectDetails,
  withdraw,
  getContractBalance,
  withdrawFees,
  getProjectTransactions
} = require('../services/researchFundingContractService');
const { AppError } = require('../middleware/errorHandler');
const { ApiResponse } = require('../utils/responseFormatter');

const blockchainController = {
  async createProject(req, res, next) {
    try {
      const { name, description, recipient } = req.body;
      const result = await createProject(name, description, recipient);
      res.status(200).json(ApiResponse.success({
        message: 'Project created successfully',
        transactionHash: result.transactionHash
      }));
    } catch (error) {
      next(error);
    }
  },

  async fundProjectRecord(req, res, next) {
    try {

      const { projectDocId, fundingProjectId, amountEth, transactionHash } = req.body;

      if (!projectDocId || !fundingProjectId || !amountEth || !transactionHash) {
        console.log('Missing required fields' + projectDocId + fundingProjectId + amountEth + transactionHash);
        throw new AppError('Missing required fields', 400);
    }

      // fundingTransactions subcollection
      const fundingTransactionRef = db.collection('research').doc(projectDocId).collection('fundingTransactions');
      const fundingTransactionDoc = {
        fundingProjectId,
        amountEth,
        transactionHash,
        createdAt: new Date().toISOString()
      };

       // Add the funding transaction to the subcollection
       await fundingTransactionRef.add(fundingTransactionDoc);
       console.log(`Funding transaction added to project ${projectDocId} with funding project id ${fundingProjectId}`);
        

      res.status(200).json(ApiResponse.success({
        message: 'Transaction recorded successfully',
        transactionHash
      }));
    } catch (error) {
      next(error);
    }
  },

  async getProjectDetails(req, res, next) {
    try {
      const projectId = req.params.id;
      
      const [projectDetails, transactions] = await Promise.all([
        getProjectDetails(projectId),
        getProjectTransactions(projectId)
     ]);

      const response = {
        name: projectDetails[0],
        description: projectDetails[1],
        currentFunding: projectDetails[2].toString(),
        recipient: projectDetails[3],
        isActive: projectDetails[4],
        transactions: transactions
      };

      res.status(200).json(ApiResponse.success(response));
    } catch (error) {
      next(error);
    }
  },


  async getProjectTransactions(req, res, next) {

    try {
        const projectId = req.params.id;
        const transactions = await getProjectTransactions(projectId);
        res.status(200).json(ApiResponse.success(transactions));
    } catch (error) {
        next(error);
    }    
  },

  async insecureTestingFundProject(req, res, next) {
    try {
      const { projectId, amount, userWalletPrivateKey } = req.body;

      const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`);
      const adminWallet = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY, provider);

      console.log(`Funding from adminWallet: ${adminWallet.address}`);
      console.log(`User private key (unsafe): ${userWalletPrivateKey}`);

      const result = await fundProject(projectId, amount, adminWallet);

      res.status(200).json(ApiResponse.success({
        message: 'Project funded successfully',
        transactionHash: result.transactionHash
      }));
    } catch (error) {
      next(error);
    }
  },

  async withdrawFunds(req, res, next) {
    try {
      const { projectId } = req.body;
      const result = await withdraw(projectId);

      res.status(200).json(ApiResponse.success({
        message: 'Funds withdrawn successfully',
        transactionHash: result.transactionHash
      }));
    } catch (error) {
      next(error);
    }
  },

  async getContractBalance(req, res, next) {
    try {
      const balance = await getContractBalance();
      res.status(200).json(ApiResponse.success({
        balance: ethers.formatEther(balance)
      }));
    } catch (error) {
      next(error);
    }
  },

  async withdrawFees(req, res, next) {
    try {
      const result = await withdrawFees();
      res.status(200).json(ApiResponse.success({
        message: 'Fees withdrawn successfully',
        transactionHash: result.transactionHash
      }));
    } catch (error) {
      next(error);
    }
  }
};

module.exports = { blockchainController };
