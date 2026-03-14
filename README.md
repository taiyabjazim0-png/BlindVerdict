<p align="center">
  <img src="docs/screenshots/01-logo.png" alt="BlindVerdict Logo" width="280" />
</p>

<h1 align="center">BlindVerdict</h1>

<p align="center">
  <strong>AI-Powered Legal Accessibility & Case Management Platform</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/FastAPI-0.110+-009688?logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/SQLAlchemy-2.x-D71F00?logo=python&logoColor=white" alt="SQLAlchemy" />
  <img src="https://img.shields.io/badge/Groq_AI-LLM-FF6600?logo=ai&logoColor=white" alt="Groq" />
</p>

<p align="center">
  Connect with verified lawyers, manage your cases, and get AI-powered legal analysis — all in one secure platform.
</p>

---

## Overview

**BlindVerdict** is a full-stack legal technology platform that bridges the gap between clients seeking legal assistance and verified lawyers. The platform leverages AI for case analysis, multi-language voice input, intelligent lawyer matching, secure document management, and a premium RAG (Retrieval-Augmented Generation) model for deep legal research.

Built as a production-quality prototype for a hackathon, it demonstrates a complete legal workflow — from initial case submission through AI triage, lawyer matching, mediator coordination, payment processing, and secure case collaboration.

<p align="center">
  <img src="docs/screenshots/02-landing-page.png" alt="BlindVerdict Landing Page" width="100%" />
</p>

---

## Architecture

<p align="center">
  <img src="docs/screenshots/00-architecture.png" alt="System Architecture" width="380" />
</p>

```
Users (Client / Lawyer)
        │
  React Frontend (Vite + TypeScript + TailwindCSS)
        │
  FastAPI Backend (Python)
        │
  ┌─────┼──────────────┬───────────────┐
  │     │              │               │
Auth  Matching      Case Engine    AI Service
Service  Engine                    (Groq LLM)
  │     │              │               │
NeonDB/SQLite    File Storage    Vector Database
                                      │
                                     RAG
```

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite 5, TypeScript, TailwindCSS, Zustand, React Query |
| **Backend** | Python, FastAPI, SQLAlchemy ORM, Pydantic |
| **Database** | PostgreSQL (NeonDB) / SQLite (local dev) |
| **AI Engine** | Groq API (LLM), RAG Pipeline, Vector Embeddings |
| **Auth** | JWT Tokens, PBKDF2-SHA256 Password Hashing |
| **Security** | 256-bit Encryption, SHA-256 Document Hashing |

---

## Features

### For Clients

- **Submit Legal Issues** with text or multi-language voice input (Hindi, Bengali, Marathi, Telugu, Tamil)
- **AI-Powered Case Triage** — instantly determines if a lawyer is needed or provides self-help steps
- **Smart Lawyer Matching** — filtered by specialization, experience, rating, price range, and state
- **Secure Document Upload** — encrypted, hashed, categorized by AI, accessible only by assigned lawyer
- **Real-time Chat** with assigned lawyer
- **AI Case Assistant** for case-related queries
- **Case Tracking** with status updates, hearing dates, and activity logs

### For Lawyers

- **Professional Dashboard** with case stats, client overview, and recent activity
- **Inbox** for incoming case requests with accept/reject workflow
- **Document Vault** — categorized documents, activity logs, client chat, and AI research
- **Active Case Management** — set hearing dates, close cases, open document vaults
- **Premium RAG Model** — process 1,200+ pages of legal documents with vector search and multi-model inference
- **Client Review System** for internal flagging

### Platform Features

- **5% Commission Model** — transparent platform fee on case settlement
- **Mediator Coordination** — assigned mediators for initial client-lawyer introductions
- **Payment Gateway** — secure bank account verification before case activation
- **Multi-step Registration** with KYC verification for both clients and lawyers
- **20 Pre-seeded Demo Lawyers** with diverse specializations across Indian states

---

## Screenshots

### Landing Page & Authentication

<p align="center">
  <img src="docs/screenshots/03-landing-full.png" alt="Landing Page - Full View" width="100%" />
</p>

> Clean, modern landing page with role-based login (Client/Lawyer), registration flow, password visibility toggle, and trust indicators (20+ Verified Lawyers, AI Case Analysis, 256-bit Encryption).

---

### Submit Legal Issue — Voice Input & Multi-Language Support

<table>
  <tr>
    <td width="50%">
      <img src="docs/screenshots/04-submit-issue.png" alt="Submit Issue - Empty" width="100%" />
    </td>
    <td width="50%">
      <img src="docs/screenshots/05-voice-input-languages.png" alt="Voice Input Languages" width="100%" />
    </td>
  </tr>
  <tr>
    <td align="center"><em>Submit issue with title, description, and voice input</em></td>
    <td align="center"><em>Multi-language support: English, Hindi, Bengali, Marathi, Telugu, Tamil</em></td>
  </tr>
</table>

<p align="center">
  <img src="docs/screenshots/06-issue-with-content.png" alt="Issue with Content" width="80%" />
</p>

<p align="center"><em>Detailed case description with AI analysis and language selection</em></p>

---

### AI-Powered Lawyer Matching

<p align="center">
  <img src="docs/screenshots/07-lawyer-matching.png" alt="Lawyer Matching" width="100%" />
</p>

> After AI analysis determines a lawyer is needed, the platform recommends verified lawyers filtered by **specialization**, **experience**, **rating**, **price range (INR)**, and **state**. Each lawyer card shows location, practice area, and a direct "Raise a ticket" option.

---

### Lawyer Dashboard

<table>
  <tr>
    <td width="50%">
      <img src="docs/screenshots/08-lawyer-dashboard-empty.png" alt="Dashboard - Empty State" width="100%" />
    </td>
    <td width="50%">
      <img src="docs/screenshots/09-lawyer-dashboard-active.png" alt="Dashboard - Active" width="100%" />
    </td>
  </tr>
  <tr>
    <td align="center"><em>Fresh lawyer dashboard — clean empty state</em></td>
    <td align="center"><em>Active practice — case stats, onboarded clients, recent activity</em></td>
  </tr>
</table>

---

### Active Cases Management

<p align="center">
  <img src="docs/screenshots/10-active-cases.png" alt="Active Cases" width="100%" />
</p>

> Lawyers can manage active cases — view case summaries, open the document vault, access mediator details, set next hearing dates, and close resolved cases.

---

### Document Vault — Case Summary & Activity Logs

<p align="center">
  <img src="docs/screenshots/11-document-vault-summary.png" alt="Document Vault - Summary" width="100%" />
</p>

> Complete case overview with AI-generated client summary, activity logs, categorized documents, and document upload functionality.

---

### Document Vault — Real-time Chat & AI Research

<p align="center">
  <img src="docs/screenshots/12-vault-chat-ai.png" alt="Vault - Chat and AI" width="100%" />
</p>

> Side-by-side **real-time chat** with the client and **AI Research Chat** that analyzes case materials (summary, documents, logs) to provide intelligent research assistance.

---

### Premium RAG Model Interface

<p align="center">
  <img src="docs/screenshots/13-premium-rag.png" alt="Premium RAG Model" width="100%" />
</p>

> **Paid Version (₹10,000/case)** — Purpose-built for lawyers handling bulky case files (1,200–1,300+ pages). Features include:
> - Vector Database Indexing with transformer-based embeddings
> - Semantic Document Search across thousands of pages
> - Multi-Model RAG Inference Pipeline
> - Chunked Document Processing preserving context
> - Structured Output with risk assessments and legal citations
> - Trained on Indian legal frameworks (IPC, CrPC, CPC, Evidence Act)

---

## Project Structure

```
BlindVerdict/
├── backend/
│   ├── app/
│   │   ├── database/        # SQLAlchemy engine, session, base
│   │   ├── models/          # ORM models (User, Lawyer, Case, Message, etc.)
│   │   ├── routes/          # API endpoints (auth, cases, documents, messages, etc.)
│   │   ├── schemas/         # Pydantic request/response schemas
│   │   ├── services/        # AI service (Groq), dependencies
│   │   └── utils/           # Security (JWT, password hashing)
│   ├── main.py              # FastAPI app entry, CORS, startup, seed data
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI (Card, Sidebar, FileUploader, PremiumRAG, etc.)
│   │   ├── features/        # Zustand stores (case flow, profiles, mediators)
│   │   ├── hooks/           # Auth store
│   │   ├── layouts/         # Client & Lawyer layouts with sidebar navigation
│   │   ├── pages/           # All page components (client/, lawyer/, shared)
│   │   ├── services/        # API service layer (platformService)
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Hardcoded AI engine, helpers
│   ├── index.html
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
├── docs/
│   └── screenshots/         # Application screenshots
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and **npm**
- **Python** 3.10+
- **Groq API Key** (for AI features) — [Get one here](https://console.groq.com)

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/BlindVerdict.git
cd BlindVerdict
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate (Windows)
.venv\Scripts\Activate

# Activate (macOS/Linux)
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

**Set environment variables** (PowerShell):

```powershell
$env:GROQ_API_KEY = "your-groq-api-key"
$env:JWT_SECRET = "your-secret-key"
```

**Or (Bash)**:

```bash
export GROQ_API_KEY="your-groq-api-key"
export JWT_SECRET="your-secret-key"
```

**Start the server**:

```bash
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

The app will be available at **http://localhost:5173**

### 4. Optional: PostgreSQL (NeonDB)

For production, set the `DATABASE_URL` environment variable:

```bash
DATABASE_URL=postgresql://user:password@host/dbname
```

If not set, the app defaults to SQLite for local development.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register new client or lawyer |
| `POST` | `/auth/login` | Authenticate and receive JWT |
| `GET` | `/lawyers` | List all verified lawyers |
| `GET` | `/lawyers/{id}` | Get lawyer profile details |
| `POST` | `/ai/analyze` | AI-powered case analysis |
| `POST` | `/ai/chat` | AI research chat with case context |
| `POST` | `/ai/summarize-messages` | Summarize client messages |
| `GET` | `/cases` | List cases for current user |
| `POST` | `/cases` | Create new case/ticket |
| `PUT` | `/cases/{id}` | Update case status/details |
| `POST` | `/documents/upload/{case_id}` | Upload document (encrypted + AI-categorized) |
| `GET` | `/documents/{case_id}` | List case documents |
| `GET` | `/documents/download/{doc_id}` | Download document (token-authenticated) |
| `POST` | `/messages` | Send chat message |
| `GET` | `/messages/{case_id}` | List messages for a case |
| `POST` | `/reviews` | Submit review |
| `GET` | `/caselogs/{case_id}` | Get activity logs |
| `POST` | `/ai/timeline` | Generate case timeline |

---

## Tech Stack Deep Dive

### Frontend

| Technology | Purpose |
|-----------|---------|
| **React 18** | Component-based UI with hooks |
| **Vite 5** | Lightning-fast dev server and build tool |
| **TypeScript** | Type safety across the entire frontend |
| **TailwindCSS** | Utility-first styling with custom design system |
| **Zustand** | Lightweight state management for auth, profiles, case flow |
| **React Query** | Server state management with caching and polling |
| **React Router** | Client-side routing with protected routes |
| **Lucide React** | Modern icon library |
| **Web Speech API** | Browser-based speech-to-text for voice input |

### Backend

| Technology | Purpose |
|-----------|---------|
| **FastAPI** | High-performance async Python web framework |
| **SQLAlchemy** | ORM for database operations |
| **Pydantic** | Data validation and serialization |
| **python-jose** | JWT token generation and verification |
| **passlib** | Secure password hashing (PBKDF2-SHA256) |
| **Groq SDK** | LLM inference for AI features |
| **httpx** | Async HTTP client |

### Security

- **JWT Authentication** — Stateless token-based auth with expiry
- **Password Hashing** — PBKDF2-SHA256 with salt
- **Document Encryption** — SHA-256 hashing for uploaded files
- **CORS Protection** — Configured allowed origins
- **Token-authenticated Downloads** — Secure document access via query tokens
- **Role-based Access Control** — Client/Lawyer route protection

---

## Key Workflows

### Client Journey

```
Register → KYC Verification → Login → Submit Issue → AI Analysis
    → Lawyer Matching → Raise Ticket → Mediator Assigned
    → Payment (5% Commission) → Case Workspace → Upload Docs
    → Chat with Lawyer → AI Case Assistant → Case Resolution
```

### Lawyer Journey

```
Register → License Verification → Login → Dashboard
    → Inbox (Case Requests) → Accept Ticket → Mediator Page
    → Payment → Active Cases → Document Vault → Chat with Client
    → AI Research → Premium RAG (Optional) → Close Case
```

---

## Commission Model

BlindVerdict operates on a **5% commission** on the final case settlement amount. This covers:

- Mediator coordination and assignment
- Secure, encrypted document vault
- AI-powered case analysis and research
- Real-time encrypted communication
- Platform maintenance and support

---

## Demo Data

The platform comes pre-seeded with **20 demo lawyers** covering diverse specializations:

| Specialization | Example Lawyers | States |
|---------------|----------------|--------|
| Criminal Law | Aditya Joshi, Rahul Gupta | Delhi, UP, Maharashtra |
| Civil Litigation | Arjun Deshmukh, Karthik Sundaram | Maharashtra, Tamil Nadu |
| Family Law | Sneha Patel, Nandini Rao | Gujarat, Karnataka |
| Property Law | Vikram Singh, Rohit Verma | Punjab, Haryana |
| Corporate Law | Priya Iyer, Meera Nair | Tamil Nadu, Kerala |
| Labour Law | Deepak Choudhary, Satyam Singh | Rajasthan, Telangana |
| Taxation | Kavita Jha, Amit Saxena | MP, Delhi |

All lawyers have realistic pricing in INR, bar council IDs, experience levels, and ratings.

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## License

This project is built for the **hackathon** demonstration. All rights reserved.

---

<p align="center">
  <img src="docs/screenshots/01-logo.png" alt="BlindVerdict" width="120" />
  <br />
  <strong>BlindVerdict</strong> — Justice, Accessible to All
  <br />
  <sub>Built with React, FastAPI, and AI</sub>
</p>
