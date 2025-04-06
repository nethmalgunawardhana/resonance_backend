const express = require('express');
const router = express.Router();
const { createProject, fundProject, getProjectDetails, withdraw } = require('../services/researchFundingContractService');
const { ethers } = require('ethers');


// Route to create a project
router.post('/create-project', async (req, res) => {
  const { name, description, recipient } = req.body;

  try {
    const result = await createProject(name, description, recipient);
    res.json({ message: 'Project created successfully', transactionHash: result.transactionHash });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// for record keeping transaction happens through the frontend
router.post('/fund-project', async (req, res) => {
  const { projectId, amount, transactionHash } = req.body;

  try {
    console.log(`Project ${projectId} funded with amount ${amount} ETH`);
    console.log(`Transaction hash: ${transactionHash}`);


    // store in firestore

    res.json({
      message: 'Transaction sent successfully',
      transactionHash
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process funding' });
  }
});

router.get('/project/:id', async (req, res) => {
  const projectId = req.params.id;

  try {
    const projectDetails = await getProjectDetails(projectId);

    const response = {
      name: projectDetails[0],
      description: projectDetails[1],
      currentFunding: projectDetails[2].toString(),
      recipient: projectDetails[3],
      isActive: projectDetails[4]
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch project details' });
  }

});


router.post('/insecure-testing-fund-project', async (req, res) => {
    const { projectId, amount, userWalletPrivateKey } = req.body;

  
    try {
    //   const userWallet = new ethers.Wallet(userWalletPrivateKey); // User signs with their MetaMask private key

      const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`);
      const adminWallet = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY, provider);

      const result = await fundProject(projectId, amount, adminWallet);
      res.json({ message: 'Project funded successfully', transactionHash: result.transactionHash });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fund project' });
    }
  });


router.post('/withdraw', async (req, res) => {
  const { projectId } = req.body;

  try {
    const result = await withdraw(projectId);
    res.json({ message: 'Funds withdrawn successfully', transactionHash: result.transactionHash });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to withdraw funds' });
  }
});

module.exports = router;
