# 🌐 TrustBridgeAI — Distributed Real-Time Backend Engine

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20_LTS-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express 5" />
  <img src="https://img.shields.io/badge/Redis-Pub%2FSub_Adapter-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/Socket.IO-4.8-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="Socket.IO" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose_8-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/WebRTC-Agora_RTC-099DFD?style=for-the-badge&logo=agora&logoColor=white" alt="Agora RTC" />
  <img src="https://img.shields.io/badge/Stripe-Escrow_&_Webhooks-635BFF?style=for-the-badge&logo=stripe&logoColor=white" alt="Stripe" />
  <img src="https://img.shields.io/badge/OpenAI-GPT_Matching-412991?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI" />
</p>
<br/>

> **TrustBridgeAI Backend** is a high-concurrency, distributed server-side engine designed for early-stage startup deal negotiations, real-time escrow, and investor-founder collaboration. It features horizontal WebSocket clustering over Redis, dynamic WebRTC signaling via Agora, and automated startup risk scoring with OpenAI.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph Clients ["Client Applications"]
        W["React PWA Web Client"]
        M["Mobile WebRTC Clients"]
    end

    subgraph Gateway ["Perimeter & Security Layer"]
        RateLimit["Sliding-Window Rate Limiter"]
        Auth["JWT & 2FA Auth Middleware (Speakeasy / TOTP)"]
        Approval["Role-Based Approval Guards (Founder / Investor / Admin)"]
    end

    subgraph CoreEngine ["Express 5 Application Engine"]
        REST["REST API Route Handlers"]
        SocketEngine["Socket.IO Real-Time Engine"]
        AIWorker["OpenAI Campaign Evaluator & Matching"]
        StripeWorker["Stripe Payment & Escrow Webhook Processor"]
        AgoraToken["Agora WebRTC Dynamic Token Generator"]
    end

    subgraph StateAndCache ["Distributed State & Persistence"]
        RedisCluster[("Redis Cluster (Pub/Sub & Adapters)")]
        MongoCluster[("MongoDB Replica Set (Mongoose 8)")]
        Push["Web-Push & Nodemailer SMTP Dispatcher"]
    end

    Clients --> RateLimit
    RateLimit --> Auth
    Auth --> Approval
    Approval --> REST
    Approval --> SocketEngine

    REST --> AIWorker
    REST --> StripeWorker
    REST --> AgoraToken
    REST --> MongoCluster

    SocketEngine <--> RedisCluster
    SocketEngine --> MongoCluster

    StripeWorker --> MongoCluster
    AIWorker --> MongoCluster
    REST --> Push
```

---

## ⚡ Core Engineering Highlights

- **Horizontal WebSocket Scaling**: Configured with `@socket.io/redis-adapter` and Redis pub/sub channels, enabling stateless multi-instance backend clustering and synchronized room broadcast events.
- **Enterprise-Grade Two-Factor Security**: Time-based One-Time Password (TOTP) enforcement using `speakeasy` and QR codes, paired with cryptographically signed JWTs and role-based approval middleware.
- **Live Video & Audio Signaling**: Dynamic RTC token generation for WebRTC audio/video rooms powered by Agora SDK, ensuring zero persistent credentials exposed to client devices.
- **AI-Powered Deal Scoring & Chat**: Multi-stage OpenAI evaluation pipelines analyzing startup decks, risk metrics, and investor preferences with rate-guarded retry loops.
- **Robust Financial Integrations**: Webhook-driven Stripe checkout sessions with idempotency keys and asynchronous transaction state machines recorded in MongoDB.

---

## 📁 Repository Structure

```text
app/
  config/               Database connections, Agora tokens, and OpenAI prompts
  middleware/           Auth guards, 2FA validation, rate limiters, approval checks
  models/               Mongoose domain schemas (Deals, Campaigns, RiskEvents, Messages)
  routes/               Modular route controllers (Admin, AI, Deals, Webhooks)
index.js                Server initialization, HTTP server, and Redis Socket.IO adapter
```

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- Node.js >= 20.0.0
- MongoDB >= 6.0
- Redis >= 7.0

### 1. Installation
```bash
git clone https://github.com/DanishAjma1/TrustBridgeAI-Backend.git
cd TrustBridgeAI-Backend
npm install
```

### 2. Environment Configuration
Create a `.env` file in the project root:
```env
PORT=5000
MONGO_URI="mongodb://localhost:27017/trustbridge"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-jwt-secret-key"
OPENAI_API_KEY="your-openai-api-key"
STRIPE_SECRET_KEY="your-stripe-secret"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
AGORA_APP_ID="your-agora-app-id"
AGORA_APP_CERTIFICATE="your-agora-app-certificate"
```

### 3. Run Development Server
```bash
npm run dev
```
The backend starts with live reload on `http://localhost:5000`.

---

## 📜 License
Distributed under the ISC License. Built by [Danish Ajmal](https://github.com/DanishAjma1).
