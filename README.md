# MoodSnap 🌟
Your AI-Powered Mental Wellness Companion

![MoodSnap Overview](https://img.shields.io/badge/Status-Live_in_Production-success?style=for-the-badge) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

## Overview
MoodSnap is a sophisticated, full-stack web application designed to help users track, analyze, and improve their mental wellbeing. Beyond simple journaling, MoodSnap uses Artificial Intelligence to analyze emotional patterns, offers interactive therapeutic mini-games, and provides a beautiful, premium glassmorphic interface that adapts perfectly across all devices.

---

## 💻 Tech Stack
- **Frontend**: React.js, Custom CSS3 (Glassmorphism Design System)
- **Backend**: Node.js, Express.js
- **Database & Authentication**: Supabase (PostgreSQL), Google OAuth 2.0
- **AI Integration**: Gemini API (for advanced pattern analysis and insights), OpenAI/Groq (for natural language mood parsing)
- **Deployment**: Vercel (Frontend Hosting), Render (Backend API Hosting)

---

## ✨ Core Features

### 🧠 AI-Powered Journaling
- **Natural Language Parsing**: Type naturally (e.g., *"I'm feeling really overwhelmed with work today"*) and the AI automatically extracts the core emotion, intensity (1-10), and generates immediate, personalized therapeutic advice.

### 🎮 Context-Aware Therapeutic Mini-Games
- The application dynamically serves mini-games based on your current emotional state to help regulate your nervous system:
  - **Bubble Breathing** (for Anxiety): A guided 4-7-8 breathing pacer.
  - **Zen Sand Drawing** (for Stress): A relaxing, interactive canvas.
  - **Gratitude Amplifier** (for Sadness): A prompt-based reframing exercise.
  - **5-4-3-2-1 Grounding** (for Panic): A guided sensory countdown.

### 📊 Advanced Analytics Dashboard
- **Mood Heatmap**: A GitHub-style contribution calendar mapping your emotional frequency over the year.
- **7-Day AI Pattern Analysis**: The backend AI securely reads your last 7 entries to provide deep, personalized psychological insights and identify hidden triggers.
- **Monthly Report Cards**: Visual summaries of your wellness journey.
- **Community Vibe**: A live, anonymized widget showing the collective emotional state of all MoodSnap users over the last 24 hours.

### 🌅 Morning Intentions & Nightly Reflections
- Set a daily intention in the morning (e.g., *"Stay calm"*). The AI will compare your evening journal entries against your morning intention to see how your day actually went.

### 🎨 Deep Personalization & Privacy
- **Secure Authentication**: End-to-end user isolation using Supabase Auth (Email/Password & Google Sign-In).
- **Themes**: Full Light/Dark mode support.
- **Custom Accent Colors**: Choose between Ocean, Forest, Sunset, and Rose to customize the app's glowing gradients.
- **Data Ownership**: 1-click Client-Side CSV Export allows users to download their entire encrypted mood history directly to their device.

---

## 🧩 Development Journey & Key Challenges Overcome

Building a premium, AI-driven wellness app involved overcoming several complex technical hurdles:

1. **Crafting a Performant Glassmorphic UI**: 
   - Achieving the highly sought-after "frosted glass" look (`backdrop-filter`) while maintaining smooth 60fps scrolling and perfect responsive padding on narrow mobile screens required meticulous CSS Grid, Flexbox, and media-query tuning without relying on bulky UI libraries.

2. **AI Rate Limits & JSON Reliability**: 
   - Integrating multiple AI providers required building robust fallback mechanisms. We had to craft highly specific, rigid system prompts so the AI would consistently return perfectly formatted JSON data instead of conversational text, ensuring the React frontend never crashed during parsing.

3. **CORS & Full-Stack Split Deployment**: 
   - Migrating from a local environment (`localhost`) to a split-deployment architecture (Vercel for frontend + Render for backend) introduced strict browser Cross-Origin Resource Sharing (CORS) blocks. We had to carefully configure the Express backend headers to safely accept pre-flight requests exclusively from the Vercel production domain.

4. **Silent OAuth Redirect Suppression**: 
   - During the Supabase Google Auth integration, we discovered that aggressive browser privacy extensions (like Brave Shields) and Vercel's preview iframes were silently blocking the automated OAuth redirects. We engineered a manual `window.location.href` override and a fallback UI timeout system to guarantee successful, frustration-free authentication for all users.
