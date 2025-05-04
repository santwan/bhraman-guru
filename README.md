# 🌍 BhramanGuru - Your AI Travel Planner ✈️

**BhramanGuru** is a full-stack AI-powered travel itinerary generator that uses **Google Gemini Pro**, **Google Places API**, and **Firebase**. It provides personalized, location-based travel plans including hotels, places to visit, and maps — all curated through AI.

🚀 Hosted On:
- 🔗 [Frontend (Vercel)](https://bhraman-guru.vercel.app/)
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
- Fully responsive Tailwind CSS with Framer Motion.

---

## ⚙️ Tech Stack

| Frontend         | Backend          | APIs Used                      | Hosting              |
|------------------|------------------|--------------------------------|-----------------------|
| React + Vite     | Node.js + Express| Google Gemini Pro              | Vercel (Frontend)     |
| Tailwind CSS     | CORS-secured API | Google Places & Maps API       | Railway (Backend)     |
| Clerk Auth       | Axios + dotenv   | Firebase Firestore + Clerk SDK | Firebase (Firestore)  |

---


## 📁 Project Folder Structure

```bash
BHRAMAN-GURU/
├── backend/                     # Express.js backend (Node.js)
│   ├── node_modules/           # Backend dependencies
│   ├── .env                    # Backend environment variables (API keys etc.)
│   ├── index.js                # Main backend server file
│   ├── package-lock.json
│   └── package.json            # Backend dependencies manifest
│
├── frontend/                   # Frontend (React + Vite)
│   ├── node_modules/           # Frontend dependencies
│   ├── public/                 # Static public files
│   ├── src/                    # Source code (components, pages, services)
│   ├── .env                    # Frontend environment variables
│   ├── eslint.config.js        # Linting configuration
│   ├── index.html              # Root HTML file
│   ├── jsconfig.json           # Path resolution settings for VSCode
│   ├── package-lock.json
│   ├── package.json            # Frontend dependencies manifest
│   ├── vercel.json             # Rewrites/routing config for Vercel
│   └── vite.config.js          # Vite + Tailwind config
│
├── .gitattributes              # Git LFS / linguist hints
├── .gitignore                  # Files ignored by Git
├── components.json             # (Optional) Component metadata or config
├── LICENSE                     # Project license
├── package-lock.json           # Global lock file if using root install
└── README.md                   # Project documentation
