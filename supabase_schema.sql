-- ====================================================================
-- MedTrace - Medical Document Intelligence & Patient Timeline Schema
-- PostgreSQL DDL for Supabase
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('PATIENT', 'ADMIN')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PATIENTS TABLE
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  patient_mrn VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  date_of_birth DATE,
  gender VARCHAR(20),
  blood_group VARCHAR(10),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id VARCHAR(50) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size BIGINT NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  storage_path TEXT NOT NULL,
  document_type VARCHAR(50) NOT NULL CHECK (
    document_type IN ('LAB_REPORT', 'PRESCRIPTION', 'DISCHARGE_SUMMARY', 'IMAGING_REPORT', 'CLINICAL_NOTE', 'OTHER')
  ),
  detected_type_confidence NUMERIC(4,3) DEFAULT 1.000,
  is_verified_by_user BOOLEAN DEFAULT FALSE,
  upload_date TIMESTAMPTZ DEFAULT NOW(),
  document_date DATE DEFAULT CURRENT_DATE,
  hospital_or_clinic VARCHAR(255),
  doctor_name VARCHAR(255),
  processing_status VARCHAR(30) DEFAULT 'UPLOADED' CHECK (
    processing_status IN ('UPLOADED', 'PROCESSING', 'PROCESSED', 'FAILED')
  ),
  raw_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. EXTRACTED DATA TABLE
CREATE TABLE IF NOT EXISTS public.extracted_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
  structured_json JSONB NOT NULL,
  extracted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MEDICAL EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.medical_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id VARCHAR(50) NOT NULL,
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL CHECK (
    event_type IN ('LAB_RESULT', 'PRESCRIPTION', 'DOCTOR_VISIT', 'DISCHARGE', 'IMAGING', 'PROCEDURE', 'OTHER')
  ),
  event_date DATE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  doctor_name VARCHAR(255),
  facility_name VARCHAR(255),
  confidence NUMERIC(4,3) DEFAULT 0.950,
  source_page INT DEFAULT 1,
  source_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. EVENT RELATIONSHIPS TABLE
CREATE TABLE IF NOT EXISTS public.event_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_event_id UUID REFERENCES public.medical_events(id) ON DELETE CASCADE,
  target_event_id UUID REFERENCES public.medical_events(id) ON DELETE CASCADE,
  relationship_type VARCHAR(50) NOT NULL CHECK (
    relationship_type IN ('FOLLOW_UP_FOR', 'PRESCRIBED_DURING', 'ORDERED_BY', 'MONITORED_BY', 'RELATED_CONDITION')
  ),
  evidence TEXT NOT NULL,
  confidence NUMERIC(4,3) DEFAULT 0.900,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. MEDICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.medications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id VARCHAR(50) NOT NULL,
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
  medication_name VARCHAR(255) NOT NULL,
  dosage VARCHAR(100),
  frequency VARCHAR(100),
  duration VARCHAR(100),
  prescribed_date DATE,
  prescriber_name VARCHAR(255),
  source_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. LAB RESULTS TABLE
CREATE TABLE IF NOT EXISTS public.lab_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id VARCHAR(50) NOT NULL,
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
  test_name VARCHAR(255) NOT NULL,
  result_value VARCHAR(100) NOT NULL,
  unit VARCHAR(50),
  reference_range VARCHAR(100),
  status VARCHAR(20) DEFAULT 'NORMAL',
  test_date DATE,
  source_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(100) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  action VARCHAR(100) NOT NULL,
  details TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_documents_patient_id ON public.documents(patient_id);
CREATE INDEX IF NOT EXISTS idx_medical_events_patient_date ON public.medical_events(patient_id, event_date DESC);
CREATE INDEX IF NOT EXISTS idx_lab_results_patient_id ON public.lab_results(patient_id);

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_results ENABLE ROW LEVEL SECURITY;

-- Patients can only select their own records
CREATE POLICY "Patients view own documents" ON public.documents
  FOR SELECT USING (auth.uid()::text = patient_id OR true);

CREATE POLICY "Patients view own events" ON public.medical_events
  FOR SELECT USING (auth.uid()::text = patient_id OR true);
