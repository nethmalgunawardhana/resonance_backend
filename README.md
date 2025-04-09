# ⚙️ Resonance Backend: Node.js for Stripe & Firestore

This is the Node.js backend application for the Resonance project. It handles Stripe payment transactions, blockchain smart contract integrations, and AI-powered research operations.

---

## 🚀 Features

🪙 Blockchain payment logging using Smart Contracts (ResearchFund)
🧠 Serve LLM responses for research recommendation 
✅ Record Stripe payment transactions manually or via webhook  
💽 AI-powered research recommendation using Gemini API  
🔒 Secure Stripe webhook verification  
💰 Stripe integration for payments, donations, and grants  
🔍 Index and fetch papers from **Google Scholar**, **OpenAlex**, and **Arxiv**  
🗃️ Store transactions in Firestore under `research/{projectDocId}/stripeTransactions`  
 
---

## 🛠️ Requirements

- Node.js (v14 or above)  
- npm or yarn  
- Firebase Admin SDK service account key  
- Stripe API keys  
- Gemini API key  
- Infura Project ID (for Sepolia network)  
- Smart contract ABI and address  

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/nethmalgunawardhana/resonance_backend.git
cd resonance_backend
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Environment Variables

Create a `.env` file in the root folder and add the following:

```
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
FIREBASE_SERVICE_ACCOUNT_PATH=/path/to/your/serviceAccountKey.json
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
INFURA_API_KEY=YOUR_INFURA_PROJECT_ID
CONTRACT_ADDRESS=YOUR_SMART_CONTRACT_ADDRESS
ETHEREUM_PRIVATE_KEY=YOUR_PRIVATE_KEY
```

> ❗ Do not commit your `.env` file to version control.

### 4. Run the Backend

```bash
npm start
# or
node index.js
```

The server will run locally on `http://localhost:5000`.

---

## ⚙️ Configuration Notes

- **Stripe**: Set up webhooks on the Stripe dashboard to hit your `/webhook` endpoint.
- **Firebase**: Ensure Firestore security rules match your API access patterns.
- **Gemini API**: Required for summarization and research recommendation.
- **Blockchain**: Use `ethers.js` or `web3.js` to interact with ResearchFund smart contract on Sepolia testnet.

---

## 📚 Tech Stack (Backend)

| Area                | Tech Stack                                     |
|---------------------|------------------------------------------------|
| Backend             | Node.js                                        |
| Database            | Firebase Firestore                             |
| Authentication      | Firebase Auth                                  |
| Payments            | Stripe                                         |
| AI/LLM              | Gemini API                                     |
| Research Indexing   | OpenAlex, Arxiv, Google Scholar                |
| Blockchain          | Sepolia Ethereum Testnet, Solidity, Metawallet|
| Contract            | ResearchFund Smart Contract                    |
| Deployment          | Vercel                                         |

---

## 📂 Folder Structure

```
resonance_backend/
├── controllers/           # Route logic
├── routes/                # API routes
├── services/              # Stripe, AI, Blockchain services
├── middleware/            # Webhook auth, error handlers
├── utils/                 # Utility functions
├── index.js               # Entry point
├── .env                   # Environment variables
└── package.json
```

---

## 👨‍💻 Team Members

- Tharin Edirisinghe  
- Garuka Satharasinghe  
- Nethmal Gunawardhana  
- Harindu Hadithya  
- Sachintha Lakmin  

