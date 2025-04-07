const express = require('express');
const router = express.Router();
const { blockchainController } = require('../controllers/blockchainController');

router.post('/create-project', blockchainController.createProject);
router.post('/fund-project', blockchainController.fundProjectRecord);
router.get('/project/:id', blockchainController.getProjectDetails);
router.get('/project-transactions/:id', blockchainController.getProjectTransactions);
router.post('/insecure-testing-fund-project', blockchainController.insecureTestingFundProject);
router.post('/withdraw', blockchainController.withdrawFunds);
router.get('/contract-bal', blockchainController.getContractBalance);
router.post('/withdraw-fees', blockchainController.withdrawFees);

module.exports = router;
