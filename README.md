# 🚀 The Ultimate AI-Powered Internship Engine

<div align="center">

[![GitHub stars](https://img.shields.io/github/stars/kartiksharma76/The-Ultimate-AI-Powered-Internship-Engine?style=for-the-badge&color=blue)](https://github.com/kartiksharma76/The-Ultimate-AI-Powered-Internship-Engine/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/kartiksharma76/The-Ultimate-AI-Powered-Internship-Engine?style=for-the-badge&color=indigo)](https://github.com/kartiksharma76/The-Ultimate-AI-Powered-Internship-Engine/network)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![NVIDIA AI](https://img.shields.io/badge/NVIDIA_NIM-76B900?style=for-the-badge&logo=nvidia&logoColor=white)](https://build.nvidia.com)

**An intelligent, end-to-end AI career accelerator and recruitment ecosystem for modern students and recruiters.**

[Explore Live Demo](#-getting-started) • [Key Features](#-supercharged-features) • [Architecture](#-tech-stack--architecture) • [Setup Guide](#-setup--installation)

</div>

---

## 📖 Overview

**The Ultimate AI-Powered Internship Engine** (InternAI) bridges the gap between ambitious students and high-growth opportunities. Driven by **NVIDIA Llama 3.1 AI Models**, the platform automates the entire recruitment and upskilling lifecycle:

- Real-time voice & video AI mock interviews with simulated high-pressure personas.
- Smart ATS resume analysis, gap detection, and personalized bullet generation.
- Dynamic coding assessments with automated fraud detection and proctoring.
- Recruiter smart dashboards with neural applicant scoring and global talent heatmaps.
- Salary benchmarking, visa intelligence, and negotiation simulations.

---

## ✨ Supercharged Features

### 🎙️ 1. AI Interview Ghost & Jarvis Voice Room
- **Voice-to-Voice AI Interviewer**: Powered by Speech Recognition (STT) and Speech Synthesis (TTS).
- **Adaptive Personas**: Choose between friendly HR mentors or brutal Tier-1 system design interviewers.
- **Instant Behavioral & Technical Feedback**: AI critiques answers in real-time with score breakdowns.

### 📄 2. AI Resume Architect & ATS Analyzer
- **ATS Compatibility Scoring**: Instant scoring against modern applicant tracking systems.
- **Skill Extraction & Match Engine**: Maps resume bullet points to active internship job descriptions.
- **AI Bullet Enhancer**: Rewrites weak accomplishments into impactful, metric-driven statements.

### ⚡ 3. Career Multiplier & Interactive Skill Graph
- **Career Path Forecasting**: Visual career trajectory models and skill ladder diagnostics.
- **Skill Gap Diagnostics**: Identifies high-value missing competencies for desired roles.
- **Curated Learning Roadmaps**: Auto-generated actionable study paths to close skill gaps.

### 💻 4. Code Architect & AI Assessments
- **Adaptive Problem Generation**: Dynamic coding challenges tailored to the candidate's exact skill level.
- **Live Code Mentor**: Real-time syntax and algorithmic architectural advice.
- **Anti-Cheat Proctoring**: Monitors browser tab switching, paste events, and suspicious patterns.

### 🤝 5. Alumni Hub, Mentorship & Network Engine
- **Mentor Matching**: Connects students with vetted industry alumni.
- **Referral Network**: Direct referral pipelines between companies and top-ranked candidates.
- **Community Events Hub**: Hackathons, webinars, and networking meetups tracker.

### 📊 6. Market Intelligence & Recruiter Hub
- **Neural Candidate Ranking**: Multi-factor candidate scoring (GitHub contributions + Assessment scores + ATS match).
- **Salary Benchmarker & Negotiation Sim**: Real-time compensation insights and interactive negotiation practice.
- **Global Talent Heatmap & Visa Intelligence**: Geolocation talent distribution and international visa sponsorship insights.
- **Burnout & Psych Lab**: Predictive wellbeing indicators and work-style compatibility profiling.

---

## 🛠️ Tech Stack & Architecture

```
                                  ┌────────────────────────┐
                                  │   React 18 + Vite UI   │
                                  │  (Tailwind + Radix UI) │
                                  └───────────┬────────────┘
                                              │ REST API / WebSockets
                                  ┌───────────▼────────────┐
                                  │ Express.js API Server  │
                                  │      (TypeScript)      │
                                  └─────┬────────────┬─────┘
                     ┌──────────────────┘            └──────────────────┐
                     ▼                                                  ▼
       ┌────────────────────────┐                         ┌────────────────────────┐
       │   NVIDIA NIM Llama 3   │                         │  MySQL + Drizzle ORM   │
       │   (GenAI Engine)       │                         │ (Persistence Layer)    │
       └────────────────────────┘                         └────────────────────────┘
```

| Component | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Radix UI, Framer Motion |
| **Backend** | Node.js, Express, TypeScript, Zod Validation, OpenAPI / Orval |
| **AI / ML** | NVIDIA NIM API (`meta/llama-3.1-8b-instruct`), Web Speech API (STT / TTS) |
| **Database** | MySQL, Drizzle ORM, Drizzle Kit |
| **Auth & Security** | Google OAuth 2.0, Firebase Auth, Session-based authentication |
| **Integrations** | Razorpay SDK, Nodemailer SMTP |

---

## 🚀 Setup & Installation

### Prerequisites
- **Node.js**: v18.0 or higher
- **pnpm**: `npm install -g pnpm`
- **MySQL**: Local instance or cloud database (e.g. PlanetScale, Neon, Railway)

### 1. Clone the Repository
```bash
git clone https://github.com/kartiksharma76/The-Ultimate-AI-Powered-Internship-Engine.git
cd The-Ultimate-AI-Powered-Internship-Engine
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL=mysql://username:password@localhost:3306/internship_db

# Ports & URLs
PORT=3000
BACKEND_PORT=8080
BASE_PATH=/
FRONTEND_URL=http://localhost:5173

# AI Service (NVIDIA NIM)
NVIDIA_API_KEY=your_nvidia_nim_api_key

# Authentication
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_secure_session_secret_key

# Payments (Razorpay)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Email Service (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### 4. Database Setup
```bash
# Push schema migrations
pnpm run db:push

# (Optional) Seed dummy internships & candidate data
pnpm run db:seed
```

### 5. Launch Development Server
```bash
pnpm run dev
```

The application will be accessible at:
- **Frontend App**: `http://localhost:5173`
- **API Server**: `http://localhost:8080`

---

## 📂 Project Structure

```
├── artifacts/
│   ├── api-server/             # Express.js backend & AI routes
│   │   └── src/routes/         # AI, assessment, candidate, & payment endpoints
│   └── internship-engine/      # React Vite frontend application
│       └── src/pages/          # All 25+ frontend feature pages
├── lib/
│   ├── api-client-react/       # Generated React Query API hooks
│   ├── api-spec/               # OpenAPI / Swagger specification
│   ├── api-zod/                # Zod schemas for validation
│   └── db/                     # Drizzle schema definitions & DB migrations
├── package.json
└── README.md
```

---

## 🔒 Security & Privacy Best Practices

- **Strict Environment Isolation**: API keys and database credentials are fully isolated in `.env` (enforced via `.gitignore`).
- **No Client Key Exposure**: AI prompts, payments, and authentication are executed securely on the backend server.
- **Proctoring Integrity**: Real-time client-side event listeners track assessment validity without saving sensitive screen data.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">
  <sub>Built with ❤️ by <b>Kartik Sharma</b></sub>
</div>
