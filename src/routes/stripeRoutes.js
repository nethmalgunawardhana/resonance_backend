// routes/stripeRoutes.js
const express = require('express');
const router = express.Router();
const { stripeTransactionsController } = require('../controllers/stripeTransactionsController');

// Webhook route for Stripe events
router.post('/stripe-webhook', stripeTransactionsController.handleStripeWebhook);

<<<<<<< HEAD
module.exports = router;
=======
module.exports = router;
>>>>>>> 1ed4841fca8e2996504ff671e1152971cfc5fcb2
