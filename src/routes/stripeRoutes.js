// routes/stripeRoutes.js
const express = require('express');
const router = express.Router();
const { stripeTransactionsController } = require('../controllers/stripeTransactionsController');

// Webhook route for Stripe events
router.post('/stripe-webhook', stripeTransactionsController.handleStripeWebhook);

module.exports = router;
