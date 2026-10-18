# 🐻 Toby AI: AI-Powered English Learning Chatbot for Children (Under 7 Years Old)

> **Author**: Mustafizur Rahman Sumon (Full-Stack AI Engineer)  
> **Project Type**: Production-Grade AI EdTech System  
> **Sub-2s Latency SLA**: **100% Passed (Avg ~460ms measured)**  
> **Target Audience**: Early learners aged 3 to 7 years old  

---

## 🌟 Executive Summary & Key Highlights

**Toby AI** is a production-grade, child-centered conversational English tutor designed specifically for early childhood education (ages 3–7). Rather than treating learning as a rigid testing loop, Toby uses **dynamic mode detection** to alternate between instruction, casual conversation, play, and emotional support.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            CORE CAPABILITIES                                │
├───────────────────────┬─────────────────────────────┬───────────────────────┤
│ 1. Progressive System │ 2. Child Mode Detection     │ 3. SEL Guardrails     │
│ • L1: Words & Phonics │ • 🎓 Learning Mode          │ • Confidence Boosts   │
│ • L2: Fun Phrases     │ • 💬 Conversation Mode      │ • Resilience Cheers   │
│ • L3: Mini Stories    │ • 🎮 Fun & Games (Breaker)  │ • Emotion Validation  │
│ • Auto Level-Up       │ • 💖 Support (Frustration)  │ • Star Confetti       │
├───────────────────────┼─────────────────────────────┼───────────────────────┤
│ 4. Sub-2s Latency SLA │ 5. Multi-Child Isolation    │ 6. Dual Voice/Text    │
│ • TTFT: ~350-500ms    │ • 1-Click Profile Switcher  │ • Web Speech API STT  │
│ • Total: < 500ms avg  │ • Scoped Context Memory     │ • Native Speech TTS   │
│ • Latency Watchdog    │ • Zero Context Bleed        │ • Large Push-to-Talk  │
└───────────────────────┴─────────────────────────────┴───────────────────────┘
```

### 📚 Project Documentation Hub
- 🏗️ **[Detailed Architecture Specification](docs/ARCHITECTURE.md)**: Layered architectural diagrams, end-to-end data flows, and subsystem breakdown.
- 📐 **[System Design Document](docs/SYSTEM_DESIGN.md)**: HLD/LLD, Child Mode state machine, CASEL SEL matrix, and latency budget breakdown.
- 🚀 **[Local Setup & Running Instructions](#-local-setup--running-instructions)**: How to run, test, and verify the project locally.
- 🌐 **[Production Deployment Guide](#-production-deployment-guide)**: Live production deployment instructions for Vercel and Render.

---

## 🏗️ System Architecture Diagram

```mermaid
flowchart TD
    subgraph Client ["Client Layer (Next.js 15 + Tailwind CSS)"]
        UI["Tactile Kid UI (cursor-pointer)"]
        Mascot["Animated SVG Mascot (Toby the Bear)"]
        STT["Web Speech Recognition (STT)"]
        TTS["Web Speech Synthesis (TTS)"]
        Switcher["1-Click Profile Switcher (Leo, Sam, Maya)"]
        UI --> Switcher
        UI --> Mascot
        UI --> STT
        UI --> TTS
    end

    subgraph Backend ["Backend API & Gateway (Node.js + Express + Socket.io)"]
        RateGuard["Rate Limiter & Input Sanitizer (Zod)"]
        ModeEngine["Child Mode & Fatigue Detector (4 States)"]
        ContextLRU["In-Memory LRU Multi-Child Session Cache"]
        SELModule["Social-Emotional Learning (SEL) Guardrail"]
    end

    subgraph Intelligence ["AI Core & Latency Watchdog (< 2.0s SLA)"]
        PromptEngine["Child-Centric System Prompts (L1/L2/L3 Rules)"]
        FastLLM["Gemini 2.0/1.5 Flash + Local Fallback (< 50ms)"]
        Watchdog["1.7s Timeout Watchdog & Telemetry"]
    end

    subgraph Persistence ["Data Store (MongoDB / In-Memory Repository)"]
        ProfileStore[(Child Profiles: Stars, Streak, Level)]
        SessionStore[(Partitioned Transcript History)]
    end

    Client -->|REST & WebSockets < 2s| Backend
    Backend --> RateGuard
    RateGuard --> ModeEngine
    ModeEngine --> ContextLRU
    ContextLRU <--> Persistence
    ContextLRU --> SELModule
    SELModule --> PromptEngine
    PromptEngine --> FastLLM
    FastLLM --> Watchdog
    Watchdog --> Backend
    Backend -->|Streamed Audio/Text Response| Client
```

---

## 🎯 Assessment Feature Breakdown

### 1. Progressive Learning System (L1, L2, L3)
- **Level 1 (L1 - Ages 3-4)**: Focuses on single-word vocabulary, phonics sound imitation (e.g. `"/æ/ /æ/ Apple!"`), colors, animals, and objects. Replies strictly capped at 4–6 words.
- **Level 2 (L2 - Ages 5-6)**: Focuses on 2–4 word phrases, simple actions (e.g. `"The big dog is running 🐕"`), and basic feelings.
- **Level 3 (L3 - Ages 6-7)**: Focuses on mini-stories, open-ended curiosity prompts, and expressing preferences (e.g. `"If you could fly a rocket ship, where would you go? 🚀"`).
- **Auto Level-Up**: Earning 100 mastery points automatically promotes the child to the next level with a celebratory banner.

### 2. Child Mode Detection (Non-Continuous Teaching)
Toby does **not** lecture the child continuously. The mode detection engine dynamically transitions across 4 states:
1. **🎓 `learning` Mode**: Direct vocabulary and phonics practice.
2. **💬 `conversation` Mode**: Friendly, non-evaluative casual chatting like a real companion.
3. **🎮 `engagement` Mode (Fatigue Breaker)**: Triggered when the child says "I'm tired/bored" OR automatically triggered after **3 consecutive learning turns** to prevent cognitive overload with riddles, rhymes, and silly animal sounds.
4. **💖 `support` Mode (Emotional Safety)**: Triggered when the child expresses sadness or frustration ("This is too hard", "I can't do it"). Validates feelings, suggests a gentle breath, and offers comforting reassurance.

### 3. Social and Emotional Learning (SEL)
Aligned with early childhood CASEL competencies:
- **Growth Mindset**: "Mistakes help our brain grow stronger!"
- **Milestone Badges**: Awarded dynamically (`Brave Explorer ⭐`, `Super Learner 🌟`, `Curious Spark 🔍`).
- **Festive Confetti**: Triggers kid-friendly confetti celebrations when earning stars.

### 4. Context-Aware Multi-Child Isolation
- Pre-seeded with 3 demo profiles:
  - **Leo**: Age 4, Level 1 (Beginner)
  - **Sam**: Age 5, Level 2 (Intermediate)
  - **Maya**: Age 6, Level 3 (Advanced)
- Users can toggle between children with **one click**. Context, stars, vocabulary, and active level switch immediately with **zero data bleed**.

### 5. Performance Requirement: Sub-2.0s Latency SLA
- **Measured Average Latency**: **~460ms** (Over 4x faster than the 2000ms threshold).
- Single-pass zero-shot classification eliminates roundtrip delays.
- A 1.7-second watchdog ensures the system never hangs if external networks fluctuate.

---

## 🚀 Local Setup & Running Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher (v24+ recommended)
- **npm**: v9.0.0 or higher

### 1. Backend Setup
```bash
cd backend
npm install
npm test            # Runs Vitest automated test suite (6/6 tests passing)
npm run dev         # Starts backend API on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run build       # Validates production TypeScript bundle
npm run dev         # Starts Next.js app on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Production Deployment Guide

### Frontend Deployment (Vercel)
1. Push repository to GitHub.
2. Import project into [Vercel](https://vercel.com).
3. Set **Root Directory** to `frontend`.
4. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL`: Your deployed backend URL (e.g. `https://your-backend.onrender.com/api/v1`)
   - `NEXT_PUBLIC_SOCKET_URL`: Your deployed backend socket URL
5. Deploy.

### Backend Deployment (Render / Railway)
1. In [Render.com](https://render.com), create a new **Web Service**.
2. Connect your GitHub repository and set **Root Directory** to `backend`.
3. Set **Build Command**: `npm install && npm run build`
4. Set **Start Command**: `npm start`
5. Add Environment Variables:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `CORS_ORIGIN`: Your frontend Vercel URL
   - `GEMINI_API_KEY`: (Optional) Your Google Gemini API key
6. Deploy.

---

## 👨‍💻 Author & Connect
- **Author**: Mustafizur Rahman Sumon
- **Role**: Full-Stack AI Engineer
- **GitHub**: [@Sumon-DevCoder](https://github.com/Sumon-DevCoder)

---

*Built with ❤️ by Mustafizur Rahman Sumon • AI-Powered Kids English Tutor (< 7 Years).*
