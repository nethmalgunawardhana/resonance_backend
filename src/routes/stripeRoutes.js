// routes/stripeRoutes.js
const express = require('express');
const router = express.Router();
const { stripeTransactionsController } = require('../controllers/stripeTransactionsController');

router.post('/create-checkout-session', stripeTransactionsController.createStripeCheckoutSession);

module.exports = router;