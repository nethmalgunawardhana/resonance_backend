const express = require('express');
const router = express.Router();
const { stripeTransactionsController } = require('../controllers/stripeTransactionsController');

// router.post(
//   '/',
//   express.raw({ type: 'application/json' }),
//   stripeTransactionsController.handleStripeWebhook
// );

router.post(
  '/',
  express.json(), 
  stripeTransactionsController.handleStripeWebhook
);

module.exports = router;
