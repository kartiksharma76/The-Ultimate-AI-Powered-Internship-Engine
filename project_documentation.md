# Project Documentation: Internship Engine & AI Career Hub

## 1. Executive Summary
The **Internship Engine** is an AI-first career platform designed to bridge the gap between students and industry opportunities. By leveraging Large Language Models (LLMs) and vector-based matching, the platform provides personalized recommendations, resume insights, and real-time career coaching.

---

## 2. Business Requirements
- **Goal:** Increase student placement success rates by 40% through AI-driven matching.
- **Problem Statement:** Traditional job portals rely on static keyword matching, leading to poor candidate-job alignment.
- **Target Audience:** College students, fresh graduates, and recruiters.
- **Monetization (Optional):** Premium AI features for advanced resume auditing and interview coaching.

---

## 3. Functional Requirements
- **Student Dashboard:** Real-time visibility into application status and compatibility scores.
- **AI Career Hub:** 
  - Automated skill extraction from resumes (PDF/DOCX).
  - Specialized AI modules (Email Assistant, Interview Coach).
- **Matching Engine:** Multi-layered filtering (Location, Tech Stack, Experience).
- **Admin Portal:** Manage internship listings and student profiles.
- **Auth System:** Secure Google OAuth integration for seamless onboarding.

---

## 4. System Architecture
The project follows a modern **Decoupled Architecture**:

- **Frontend:** Single Page Application (SPA) for high interactivity.
- **Backend:** RESTful API Server for logic and data management.
- **Database:** Relational database with ORM for data integrity.
- **AI Layer:** Integration with NVIDIA's high-performance LLM APIs (Llama 3.1).

---

## 5. Technology Stack
| Layer | Technology |
|-------|------------|
| **Frontend** | React, Vite, TypeScript, TailwindCSS, Framer Motion |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | MySQL (with Drizzle ORM) |
| **AI Models** | NVIDIA Llama-3.1-8b-instruct, Meta-Llama-3.1-70b |
| **Icons/UI** | Lucide-React, Radix UI |
| **Deployment** | Vercel (Frontend), Railway/Docker (Backend) |

---

## 6. Core Workflow & Process
1. **User Onboarding:** Student signs in via Google OAuth.
2. **Profile Synthesis:** Student uploads resume -> AI extracts skills -> Profile is created.
3. **AI Discovery:** System runs a vector match between student skills and internship requirements.
4. **Active Coaching:** Student uses the "Interview Coach" to prepare for specific roles.
5. **Application:** Student applies; AI Email Assistant helps draft a professional cover letter.

---

## 7. AI Implementation (LLM & Chatbot)
### Backend Logic (Express)
```typescript
// AI Career Chat Logic
router.post("/career-chat", async (req, res) => {
  const { message, studentId } = req.body;
  const prompt = `You are a professional career counselor. 
  Student asking: "${message}". Analyze their profile and provide guidance.`;
  
  const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${process.env.NVIDIA_API_KEY}` },
    body: JSON.stringify({
      model: "meta/llama-3.1-8b-instruct",
      messages: [{ role: "user", content: prompt }]
    }),
  });
  const data = await response.json();
  res.json({ response: data.choices[0].message.content });
});
```

---

## 8. Presentation & Teamwork
- **Collaboration:** The project is built using a Monorepo structure (PNPM Workspaces) to ensure frontend and backend developers can work synchronously.
- **Continuous Integration:** TypeScript is used across the stack to prevent runtime errors and ensure code quality.
- **User Experience (UX):** A "Premium-First" design approach ensures that students feel they are using a state-of-the-art tool.

---
**Prepared by:** AI Project Assistant (Antigravity)
**Date:** May 7, 2026
