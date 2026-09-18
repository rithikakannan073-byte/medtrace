# MedTrace 🏥

**Medical Document Intelligence & Patient Timeline System**

MedTrace is a complete working web application built for healthcare document intelligence. Patient information is frequently distributed across laboratory reports, prescriptions, discharge summaries, imaging reports, and clinical notes. MedTrace extracts structured clinical information from uploaded documents and reconstructs a chronological patient timeline with 100% source traceability and evidence-backed event relationship detection.

---

## 🚀 Key Features

- **Branding & UI**: Professional healthcare SaaS interface built with React, TypeScript, Vite, Tailwind CSS, and Lucide React icons.
- **Authentication**: Secure login flow with User ID + Email, OTP email verification (with preset demo OTP helper `123456`), Supabase Google OAuth integration, loading states, and error handling.
- **Role-Based Access Control (RBAC)**:
  - **PATIENT**: Upload documents, view chronological medical timeline, view extracted JSON facts, search records, view source documents, and inspect AI processing status.
  - **ADMIN**: Monitor registered users, view document processing queue, inspect extraction metrics, correct extraction JSON errors, reclassify categories, reprocess pipeline, and view audit history.
- **11-Stage Document Intelligence Pipeline**:
  `UPLOAD` → `DOCUMENT STORAGE` → `DOCUMENT CLASSIFICATION` → `TEXT EXTRACTION / OCR` → `MEDICAL INFORMATION EXTRACTION` → `STRUCTURED JSON` → `EVENT GENERATION` → `DATE NORMALIZATION` → `RELATIONSHIP DETECTION` → `TIMELINE GENERATION` → `TRACEABILITY LINKS`.
- **Chronological Patient Timeline**: Medical events sorted strictly by clinical date (not upload date) with filtering by date range, document category, event type, physician, and hospital.
- **Visual Event Relationship Detection**: Directional event linkages (e.g. *Doctor Visit → Prescription → Lab Test → Follow-up*) displaying explicit source evidence ("*Relationship detected from source documents*").
- **100% Source Traceability**: Split-screen document viewer linking every extracted medical fact back to its original document page and highlighted text snippet.
- **Global Medical Search**: Instant search across lab results, prescriptions, vitals, clinical notes, and source text snippets.
- **Hackathon Demo Dataset**: Includes 5 synthetic medical documents (*blood_report.pdf*, *prescription.pdf*, *discharge_summary.pdf*, *imaging_report.pdf*, *clinical_note.pdf*) with a one-click demo data reset button.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS v4, Lucide React Icons.
- **Backend / Database**: Supabase PostgreSQL, Supabase Authentication, Supabase Storage.
- **Deployment**: Works out-of-the-box locally with instant mock fallback layer or connected to live Supabase environment variables.

---

## 📂 Project Structure

```
medtrace/
├── public/
├── src/
│   ├── components/
│   │   ├── DisclaimerBanner.tsx        # Top healthcare disclaimer banner
│   │   ├── DocumentViewerModal.tsx     # Split-screen viewer with highlighted source text
│   │   ├── Header.tsx                  # Top navigation, global search, role switcher
│   │   ├── PipelineProgressModal.tsx   # 11-stage real-time AI progress visualizer
│   │   ├── RelationshipCard.tsx        # Event relationship card & directional tree
│   │   └── Sidebar.tsx                 # Responsive navigation menu
│   ├── context/
│   │   ├── AuthContext.tsx             # Authentication, OTP, OAuth, and RBAC state
│   │   └── DataContext.tsx             # Global reactive state for docs, events & search
│   ├── lib/
│   │   └── supabase.ts                 # Supabase client wrapper & mock fallback logic
│   ├── pages/
│   │   ├── AdminDashboardPage.tsx      # Admin queue, JSON correction, audit trail
│   │   ├── AuthPage.tsx                # Login & OTP verification screen
│   │   ├── DashboardPage.tsx           # Overview metrics & recent activity feed
│   │   ├── DocumentsPage.tsx           # Document library & category reclassification
│   │   ├── MedicalRecordsPage.tsx      # Tabulated lab results, medications & vitals
│   │   ├── ProfilePage.tsx             # User demographic profile
│   │   ├── RelationshipGraphPage.tsx   # Full visual relationship graph
│   │   ├── SearchPage.tsx              # Global search results grouped by category
│   │   ├── SettingsPage.tsx            # System settings & demo dataset reset
│   │   ├── SplashScreen.tsx            # Initial animated brand splash screen
│   │   ├── TimelinePage.tsx            # Chronological patient timeline
│   │   └── UploadPage.tsx              # Drag & drop document dropzone
│   ├── services/
│   │   ├── aiPipeline.ts               # 11-stage AI document extraction engine
│   │   └── mockData.ts                 # Synthetic demo dataset & patient records
│   ├── types/
│   │   └── index.ts                    # Complete TypeScript domain definitions
│   ├── App.tsx                         # Root app component
│   ├── index.css                       # Tailwind CSS & custom healthcare styles
│   └── main.tsx                        # React DOM entry point
├── supabase_schema.sql                 # PostgreSQL DDL script for Supabase
├── vite.config.ts                      # Vite configuration
└── package.json                        # Dependencies and scripts
```

---

## ⚡ Local Setup Instructions

1. **Clone or Open Project Folder**:
   ```bash
   cd C:\Users\natar\.gemini\antigravity\scratch\medtrace
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

---

## 🔐 Environment Variables (.env)

Create a `.env` file in the root directory if connecting to a live Supabase backend:

```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

*Note: If environment variables are omitted, MedTrace automatically runs in local Hackathon Demo Mode with pre-populated synthetic data, full OTP simulation, and client storage.*

---

## 🗄️ Supabase Database & Storage Setup

1. **Database Schema**:
   Run the contents of `supabase_schema.sql` inside your Supabase SQL Editor. This initializes tables:
   - `users`, `patients`, `documents`, `extracted_data`, `medical_events`, `event_relationships`, `medications`, `lab_results`, `audit_logs`.
   - Enables Row Level Security (RLS) policies ensuring patients can only query their own records.

2. **Storage Bucket**:
   - Create a bucket named `medical-documents` in Supabase Storage.
   - Set public read access or configure bucket policies for authenticated patient access.

3. **Authentication**:
   - Enable Email OTP Authentication under **Supabase Auth → Providers → Email**.
   - Enable Google OAuth under **Supabase Auth → Providers → Google** (add Redirect URI `http://localhost:5173`).

---

## 💡 3-5 Minute Hackathon Demo Credentials & Workflow

1. **Login Screen**:
   - User ID: `john_doe_85`
   - Email: `john.doe@example.com`
   - Click **Continue** → On the OTP screen, click **Autofill Demo Code (123456)** or type `123456`.
   - Alternatively, toggle **Patient View / Admin View** in the top bar anytime.

2. **Demo Flow**:
   - **Dashboard**: View summary cards (5 Processed Documents, 5 Timeline Events).
   - **Upload Page**: Drag & drop or click *Upload Sample Blood Test*. Watch the real-time **11-stage AI progress modal**.
   - **Document Viewer**: Click **View Source** on any record to view the split-screen document viewer with highlighted source text.
   - **Patient Timeline**: Scroll through events sorted chronologically by medical date. Filter by category or doctor.
   - **Event Relationships**: View how Doctor Visit → Prescription → Blood Test are visually linked with explicit evidence text.
   - **Global Search**: Type `hemoglobin` or `Amlodipine` to view grouped matching records.
   - **Admin View**: Switch to Admin View to inspect the processing queue and use **Correct JSON** to modify extracted fields.

---

## ⚠️ Medical Disclaimer

*MedTrace organizes information extracted from uploaded medical documents and does not provide medical diagnosis, clinical prognosis, or treatment advice.*
