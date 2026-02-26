# Instamart Smart Cart Engine 🛒⚡

A modern, serverless React application simulating a high-performance "Instamart-like" grocery delivery experience. This project features a sophisticated, dual-layered recommendation engine powered by an intelligent local rule system and real-time generative AI context matching via **Google Gemini 2.0 Flash**.

## ✨ Key Features
- **Contextual Discovery**: The cart state dynamically responds to user inputs. Add "Chips" -> "Movie Night" context unlocks. Add "Aspirin" -> "Recovery" context activates.
- **Dual-Engine Recommendations**:
  - Deterministic/Rule-based Engine (Local processing for fallback & absolute reliability).
  - LLM AI-Driven Engine (Serverless Gemini API matching complex user intent).
- **In-Memory Caching Strategy**: Smart LRU cache blocks redundant AI calls when a user rapidly toggles items (`add/remove/add`).
- **Edge Deployment Ready**: Designed to minimize Time-to-First-Byte (TTFB) by running the backend logic on Vercel's global Edge network.

## 🛠️ Tech Stack
- **Frontend Framework**: React 19 / Vite
- **Typing**: TypeScript
- **Styling**: Tailwind CSS & Lucide-React Icons
- **Backend Infrastructure**: Vercel Serverless/Edge Functions (`@vercel/node`)
- **AI Core**: Google Gemini API (`@google/genai`) 

## 🚀 Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Setup environment variables:**
   Create a `.env` file in the root directory and add your Google Gemini API Key:
   ```env
   API_KEY=your_gemini_api_key_here
   ```
3. **Start the local Vite development server:**
   ```bash
   npm run dev
   ```
   *(Note: For local testing of the `/api/analyze` Vercel function alongside Vite, you may need Vercel CLI installed: `npm i -g vercel` and run `vercel dev`)*

## 🌐 Deploying to Vercel

Deployment is practically zero-configuration!

1. Push this entire repository (excluding `node_modules` and `.env` files) to GitHub.
2. Log into the Vercel Dashboard and click "Add New > Project".
3. Import your GitHub repository.
4. Leave the default Vite settings (`npm run build`, output: `dist`).
5. In the **Environment Variables** section, add your `API_KEY`.
6. Click **Deploy**. Vercel will bundle the frontend and deploy the backend `/api/analyze.ts` handler to the Edge automatically!

## 🔐 Security Note
The Gemini API SDK is strictly executed on the server side (`/api/analyze.ts`). The `API_KEY` is completely hidden from the browser. 

---
*Created as part of a codebase audit and optimization sprint for ultra-low latency contextual cart experiences.*
