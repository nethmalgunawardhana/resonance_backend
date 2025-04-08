This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

---------- SETUP INSTRUCTIONS ----------

# 🎯 Node.js Backend for Stripe Payments & Firestore Integration

This is a Node.js backend application designed to handle Stripe payment transactions and store related data in Firebase Firestore. It includes a secure Stripe webhook endpoint to automatically capture and log payment events.

## 🚀 Features

- ✅ Record Stripe payment transactions manually or via webhook
- 🔒 Secure Stripe webhook verification
- 🗃️ Store transactions in Firestore under `research/{projectDocId}/stripeTransactions`
- 📦 Built using plain Node.js (no Express)
- 🔧 Environment variable support via `.env`


## 🛠️ Requirements

- Node.js (v14 or above)
- Firebase Admin SDK credentials
- Stripe account with webhook secret

## ⚙️ Setup Instructions

1. **Clone the Repository**

```bash
git https://github.com/nethmalgunawardhana/resonance_backend.git
cd resonance_backend


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



---------- TECH STACK ----------

* Frontend  : Next.js with TailwindCSS (for responsive, dynamic UI)
* Backend   : Node.js (Express)
* Database : Firebase Firestore 
* AI/ML & Integration:
    - LLM API (Gemini) for AI-powered research summarization and insights
    - Google Scholar for real-time research paper indexing
* Blockchain & Payments:
    - Stripe integration and Blockchain for payments, donations, grant distribution
* Deployment & Scaling 
    - Vercel



---------- TEAM MEMEBERS ----------

* Tharin Edirisinghe
* Garuka Satharasinghe
* Nethmal Gunawardhana
* Harindu Hadithya

