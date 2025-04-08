const { db, admin } = require('../config/firebase');
const { getEthPriceInUSD } = require("../services/researchFundingContractService");

exports.getFundingTransactions = async (req, res) => {
    const projectId = req.params.id;

    // get the subcollection of funding transactions (this is blockchain records for now)
    const fundingTransactionRef = db.collection('research').doc(projectId).collection('fundingTransactions');
    const fundingTransactionSnapshot = await fundingTransactionRef.get();

    const fundingTransactions = fundingTransactionSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    
    if (fundingTransactions.length === 0) {
        return res.status(404).json({ message: 'No funding transactions found' });
    }

    // if type = eth then convert to usd
    const ethPrice = await getEthPriceInUSD();

    fundingTransactions.forEach(transaction => {
        if (transaction.type === 'eth') {
            transaction.amountEth = parseFloat(transaction.amountEth);
            transaction.amountUSD = ethPrice ? (transaction.amountEth * ethPrice).toFixed(2) : 0;
        }
    }
    );
    
    console.log('Funding transactions:', fundingTransactions);
    // Calculate total funding
    const totalFunding = fundingTransactions.reduce((acc, transaction) => {
        const amount = parseFloat(transaction.amountUSD);
        return acc + (isNaN(amount) ? 0 : amount);
    }, 0);

    console.log('Total funding:', totalFunding);
    // Calculate number of transactions
    const numberOfTransactions = fundingTransactions.length;
    console.log('Number of transactions:', numberOfTransactions);

    return res.status(200).json({
        totalFunding: totalFunding.toFixed(2),
        numberOfTransactions: numberOfTransactions,
        fundingTransactions: fundingTransactions
    });
}




    