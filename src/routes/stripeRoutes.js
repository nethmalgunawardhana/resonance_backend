// routes/stripeRoutes.js
const express = require('express');
const router = express.Router();
const { stripeTransactionsController } = require('../controllers/stripeTransactionsController');

router.post('/create-checkout-session', stripeTransactionsController.createStripeCheckoutSession);

<<<<<<< HEAD
module.exports = router;
=======
module.exports = router;
>>>>>>> 1ed4841fca8e2996504ff671e1152971cfc5fcb2
