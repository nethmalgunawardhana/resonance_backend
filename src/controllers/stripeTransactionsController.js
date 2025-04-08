const { db } = require('../config/firebase');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { ApiResponse } = require('../utils/responseFormatter');

const stripeTransactionsController = {
  // Original method to record a Stripe transaction manually
  async recordStripeTransaction(req, res, next) {
    try {
      const {
        projectDocId, // Firestore research document ID
        stripeCustomerId,
        paymentIntentId,
        amount,
        currency,
        status,
        paymentMethod,
        receiptUrl
      } = req.body;

      if (!projectDocId || !stripeCustomerId || !paymentIntentId || !amount || !currency || !status) {
        throw new Error('Missing required fields');
      }

      const stripeTransaction = {
        stripeCustomerId,
        paymentIntentId,
        amount,
        currency,
        status,
        paymentMethod,
        receiptUrl,
        createdAt: new Date().toISOString()
      };

      // Store transaction in Firestore
      const stripeTransactionRef = db
        .collection('research')
        .doc(projectDocId)
        .collection('stripeTransactions');

      await stripeTransactionRef.add(stripeTransaction);

      res.status(200).json(ApiResponse.success({
        message: 'Stripe transaction recorded successfully',
        paymentIntentId
      }));
    } catch (error) {
      next(error);
    }
  },

  // New method to handle incoming Stripe Webhook events
  async handleStripeWebhook(req, res, next) {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // Your webhook secret from Stripe

    let event;

    // Verify the webhook signature to ensure the event is from Stripe
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error(`Webhook error: ${err.message}`);
      return res.status(400).send(`Webhook error: ${err.message}`);
    }

    // Handle the event based on its type
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntentSucceeded = event.data.object;
          const paymentIntentData = {
            paymentIntentId: paymentIntentSucceeded.id,
            stripeCustomerId: paymentIntentSucceeded.customer,
            amount: paymentIntentSucceeded.amount_received,
            currency: paymentIntentSucceeded.currency,
            status: paymentIntentSucceeded.status,
            paymentMethod: paymentIntentSucceeded.payment_method_types[0],
            receiptUrl: paymentIntentSucceeded.charges.data[0].receipt_url,
            createdAt: new Date().toISOString(),
          };

          const projectDocId = paymentIntentSucceeded.metadata.projectDocId; // Ensure projectDocId is passed as metadata

          // Store the transaction details in Firestore
          const stripeTransactionRef = db
            .collection('research')
            .doc(projectDocId)
            .collection('stripeTransactions');

          await stripeTransactionRef.add(paymentIntentData);

          res.status(200).json(ApiResponse.success({
            message: 'Payment succeeded, transaction recorded in Firestore.',
            paymentIntentId: paymentIntentData.paymentIntentId,
          }));
          break;

        case 'payment_intent.payment_failed':
          const paymentIntentFailed = event.data.object;
          // Handle the failed payment (log or notify users)
          console.log(`Payment failed: ${paymentIntentFailed.id}`);
          res.status(200).send('Payment failed event received');
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
          res.status(200).send('Event received');
      }
    } catch (err) {
      console.error(`Error processing event: ${err.message}`);
      res.status(500).send('Internal Server Error');
    }
  },
};

module.exports = { stripeTransactionsController };