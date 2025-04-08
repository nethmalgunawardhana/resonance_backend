const { db } = require('../config/firebase');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { ApiResponse } = require('../utils/responseFormatter');

const stripeTransactionsController = {

  async createStripeCheckoutSession(req, res, next) {
    try {
      let { projectDocId, userId } = req.body;

      if (!projectDocId) {
        throw new Error('Missing projectDocId');
      }

      if (!userId) {
        userId = 'guest';
      }

      const researchDocSnap = await db.collection('research').doc(projectDocId).get();
      if (!researchDocSnap.exists) {
        return res.status(404).json(ApiResponse.error('Research project not found'));
      }

      const researchDoc = researchDocSnap.data();
      const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
      const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID || 'price_1RBW2YPJXJckY4cRpZDuEqpR'; 

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
          {
            price: STRIPE_PRICE_ID,
            quantity: 1,
          },
        ],
        metadata: {
          projectDocId,
          userId,
        },
        payment_intent_data: {
          metadata: {
            projectDocId,
            userId,
          },
        },
        success_url: `${FRONTEND_URL}/ResearchView?id=${projectDocId}&success=true`,
        cancel_url: `${FRONTEND_URL}/ResearchView?id=${projectDocId}&canceled=true`,
      });

      res.status(200).json(ApiResponse.success({ url: session.url }));
    } catch (error) {
      console.error(`Error creating checkout session: ${error.message}`);
      next(error);
    }
  },


  // Original method to record a Stripe transaction manually
  // async recordStripeTransaction(req, res, next) {
  //   try {
  //     const {
  //       projectDocId, // Firestore research document ID
  //       stripeCustomerId,
  //       paymentIntentId,
  //       amount,
  //       currency,
  //       status,
  //       paymentMethod,
  //       receiptUrl
  //     } = req.body;

  //     if (!projectDocId || !stripeCustomerId || !paymentIntentId || !amount || !currency || !status) {
  //       throw new Error('Missing required fields');
  //     }

  //     const stripeTransaction = {
  //       stripeCustomerId,
  //       paymentIntentId,
  //       amount,
  //       currency,
  //       status,
  //       paymentMethod,
  //       receiptUrl,
  //       createdAt: new Date().toISOString()
  //     };

  //     const stripeTransactionRef = db
  //       .collection('research')
  //       .doc(projectDocId)
  //       .collection('stripeTransactions');

  //     await stripeTransactionRef.add(stripeTransaction);

  //     res.status(200).json(ApiResponse.success({
  //       message: 'Stripe transaction recorded successfully',
  //       paymentIntentId
  //     }));
  //   } catch (error) {
  //     next(error);
  //   }
  // },


  // Stripe webhook handler
  async handleStripeWebhook(req, res, next) {
    // const sig = req.headers['stripe-signature'];
    // const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
    let event;
  
    try {
      // Skipping Stripe signature verification for now
      event = req.body;
      console.warn('⚠️ Stripe signature verification is disabled. Be cautious in production.');
    } catch (err) {
      console.error(`⚠️ Failed to parse webhook event: ${err.message}`);
      return res.status(400).send(`Webhook error: ${err.message}`);
    }
  
  
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log(`PaymentIntent ${paymentIntent.id} succeeded for ${paymentIntent.amount_received}`);
  
        try {
          // const paymentIntentData = {
          //   paymentIntentId: paymentIntent.id,
          //   stripeCustomerId: paymentIntent.customer,
          //   amount: paymentIntent.amount_received,
          //   currency: paymentIntent.currency,
          //   status: paymentIntent.status,
          //   paymentMethod: paymentIntent.payment_method_types[0],
          //   receiptUrl: paymentIntent.charges.data[0]?.receipt_url || null,
          //   createdAt: new Date().toISOString(),
          // };
  
          // Store in DB if needed
          const projectDocId = paymentIntent.metadata.projectDocId;
          const userId = paymentIntent.metadata.userId || 'guest';

          console.log(`Project Doc ID: ${projectDocId}, User ID: ${userId}`);
  
          // Add to fundingTransactions too
          const fundingRef = db
            .collection('research')
            .doc(projectDocId)
            .collection('fundingTransactions');

          console.log("the data to save is  ")

          result = await fundingRef.add({
            amountUSD: paymentIntent.amount_received,
            type: 'stripe/card',
            createdAt: new Date().toISOString(),
            user: userId,
          });

          console.log("Saved: " , result)

          console.log(`Transaction recorded for project ${projectDocId}`);

  
          res.status(200).json({
            message: 'Payment succeeded, transaction recorded.',
            paymentIntentId: paymentIntentData.paymentIntentId,
          });
        } catch (error) {
          console.error(`🔥 Error handling payment_intent.succeeded: ${error.message}`);
          res.status(500).send('Internal Server Error');
        }
        break;
  
      case 'payment_method.attached':
        const paymentMethod = event.data.object;
        console.log(`💳 Payment method ${paymentMethod.id} was attached to a customer.`);
        res.status(200).send('Payment method attached.');
        break;
  
      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
        res.status(200).send('Event received');
    }
  }
  
};


module.exports = {stripeTransactionsController};
