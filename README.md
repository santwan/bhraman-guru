# 🌍 BhramanGuru - Your AI Travel Planner ✈️

**BhramanGuru** is a full-stack AI-powered travel itinerary generator that uses **Google Gemini Pro**, **Google Places API**, and **Firebase**. It provides personalized, location-based travel plans including hotels, places to visit, and maps — all curated through AI.

🚀 Hosted On:
- 🔗 [Frontend (Vercel)](https://your-vercel-link.vercel.app)
- 🔗 [Backend (Railway)](https://your-backend-url.up.railway.app)

---

## 📸 Demo Preview

![Demo Screenshot](https://your-demo-link-here.com)

---

## 🚀 Features

### ✨ AI-Powered Itinerary
- Smart trip plans powered by Google Gemini Pro.
- Returns structured JSON with hotels, daily itinerary, maps, and more.

### 🏨 Real Hotels & Places
- Hotels and itinerary locations pulled using **Google Places API**.
- Image fetching via backend proxy to avoid CORS.

### 🔐 Auth & User Dashboard
- Modern authentication with **Clerk**.
- Authenticated users can:
  - Generate trips
  - View **Trip History**
  - See saved trip details

### ☁️ Firebase Firestore
- User-specific storage of trip data with timestamps.
- Trip details are tied to `userId`.

### 🌗 Theme Support
- Dark mode / light mode toggle.
- Fully responsive Tailwind UI with Framer Motion.

---

## ⚙️ Tech Stack

| Frontend         | Backend          | APIs Used                      | Hosting              |
|------------------|------------------|--------------------------------|-----------------------|
| React + Vite     | Node.js + Express| Google Gemini Pro              | Vercel (Frontend)     |
| Tailwind CSS     | CORS-secured API | Google Places & Maps API       | Railway (Backend)     |
| Clerk Auth       | Axios + dotenv   | Firebase Firestore + Clerk SDK | Firebase (Firestore)  |

---

## 📂 Folder Structure

BHRAMAN-GURU/ ├── backend/ # Express.js backend server │ ├── index.js # Main API entry point │ ├── .env # Environment variables (GEMINI, GOOGLE keys, etc.) │ ├── package.json # Backend dependencies │ └── node_modules/ │ ├── frontend/ # React frontend built with Vite │ ├── public/ # Static assets │ ├── src/ # All frontend logic (components, pages, services) │ ├── .env # Vite environment vars (frontend) │ ├── index.html │ ├── vite.config.js # Vite + Tailwind setup │ ├── vercel.json # Rewrites config for routing │ └── package.json # Frontend dependencies │ ├── .gitignore ├── LICENSE ├── README.md