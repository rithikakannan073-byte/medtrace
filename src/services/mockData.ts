import type { MedicalDocument, MedicalEvent, EventRelationship, AuditLog, User, Patient, Appointment } from '../types';

export const DEMO_USER_ADMIN: User = {
  id: 'usr-adm-001',
  userId: 'admin_medtrace',
  email: 'admin@medtrace.health',
  name: 'Dr. Sarah Connor (Admin)',
  role: 'ADMIN',
  avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256',
  createdAt: '2026-07-15T09:00:00Z',
};

export const DEMO_USER_DOCTOR: User = {
  id: 'usr-doc-001',
  userId: 'dr_jenkins',
  email: 'dr.jenkins@medtrace.health',
  name: 'Dr. Sarah Jenkins, MD',
  role: 'DOCTOR',
  department: 'Internal Medicine',
  avatarUrl: 'https://images.unsplash.com/photo-1594824813566-818a4d799797?auto=format&fit=crop&q=80&w=256',
  createdAt: '2026-07-16T10:00:00Z',
};

export const DEMO_USER_PATIENT: User = {
  id: 'usr-pat-001',
  userId: 'arun_kumar_45',
  email: 'arun.kumar@example.com',
  name: 'Arun Kumar',
  role: 'PATIENT',
  patientId: 'PT-1024',
  phone: '+91 98765 43210',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
  createdAt: '2026-08-01T10:00:00Z',
};

export const DEMO_USER_REGISTRATION: User = {
  id: 'usr-reg-001',
  userId: 'reg_staff_lisa',
  email: 'registration@medtrace.health',
  name: 'Lisa Ray (Registration)',
  role: 'REGISTRATION_STAFF',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
  createdAt: '2026-08-05T11:00:00Z',
};

export const DEMO_USER_MEDICAL_RECORDS: User = {
  id: 'usr-rec-001',
  userId: 'records_staff_mark',
  email: 'records@medtrace.health',
  name: 'Mark Taylor (Medical Records)',
  role: 'MEDICAL_RECORDS_STAFF',
  avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
  createdAt: '2026-08-06T12:00:00Z',
};

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat-1024',
    patientId: 'PT-1024',
    name: 'Arun Kumar',
    age: 45,
    gender: 'Male',
    phone: '+91 98765 43210',
    medicalCondition: 'Type 2 Diabetes',
    address: '14 Healthcare Avenue, District 4',
    emergencyContact: '+91 98765 99999 (Spouse)',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    createdAt: '2026-09-01T08:00:00Z'
  },
  {
    id: 'pat-1032',
    patientId: 'PT-1032',
    name: 'Priya S',
    age: 34,
    gender: 'Female',
    phone: '+91 98401 23456',
    medicalCondition: 'Hypertension Follow-Up',
    address: '88 Riverview Boulevard',
    emergencyContact: '+91 98401 88888 (Brother)',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    createdAt: '2026-09-03T09:30:00Z'
  },
  {
    id: 'pat-10042',
    patientId: 'P-10042',
    name: 'John Doe',
    age: 41,
    gender: 'Male',
    phone: '+1 (555) 234-5678',
    medicalCondition: 'Mild Anemia & Hypertension',
    address: '402 Oak Ridge Lane, Suite B',
    emergencyContact: '+1 (555) 999-0011 (Wife)',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
    createdAt: '2026-08-01T10:00:00Z'
  },
  {
    id: 'pat-1055',
    patientId: 'PT-1055',
    name: 'Rajesh V',
    age: 52,
    gender: 'Male',
    phone: '+91 97100 11223',
    medicalCondition: 'Hyperlipidemia',
    address: '12 Sunshine Enclave',
    emergencyContact: '+91 97100 99887',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256',
    createdAt: '2026-09-07T14:00:00Z'
  },
  {
    id: 'pat-1068',
    patientId: 'PT-1068',
    name: 'Sarah M',
    age: 29,
    gender: 'Female',
    phone: '+91 99402 55443',
    medicalCondition: 'Asthma Routine Check',
    address: '55 Park Side Gardens',
    emergencyContact: '+91 99402 77665',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
    createdAt: '2026-09-11T16:20:00Z'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-001',
    patientId: 'PT-1024',
    patientName: 'Arun Kumar',
    doctorId: 'usr-doc-001',
    doctorName: 'Dr. Sarah Jenkins, MD',
    time: '09:00 AM',
    date: '2026-09-18',
    type: 'Consultation',
    status: 'Scheduled'
  },
  {
    id: 'apt-002',
    patientId: 'PT-1032',
    patientName: 'Priya S',
    doctorId: 'usr-doc-001',
    doctorName: 'Dr. Sarah Jenkins, MD',
    time: '10:30 AM',
    date: '2026-09-18',
    type: 'Follow-up',
    status: 'Waiting'
  },
  {
    id: 'apt-003',
    patientId: 'P-10042',
    patientName: 'John Doe',
    doctorId: 'usr-doc-001',
    doctorName: 'Dr. Sarah Jenkins, MD',
    time: '01:15 PM',
    date: '2026-09-18',
    type: 'Lab Review',
    status: 'Scheduled'
  },
  {
    id: 'apt-004',
    patientId: 'PT-1055',
    patientName: 'Rajesh V',
    doctorId: 'usr-doc-001',
    doctorName: 'Dr. Sarah Jenkins, MD',
    time: '03:00 PM',
    date: '2026-09-18',
    type: 'Routine Assessment',
    status: 'Completed'
  }
];

export const INITIAL_DOCUMENTS: MedicalDocument[] = [
  {
    id: 'doc-001',
    patientId: 'PT-1024',
    fileName: 'Blood_Test_Report.pdf',
    fileSize: 485200,
    fileType: 'application/pdf',
    storagePath: 'documents/PT-1024/Blood_Test_Report.pdf',
    documentType: 'LAB_REPORT',
    detectedTypeConfidence: 0.98,
    isVerifiedByUser: true,
    uploadDate: '2026-09-15T11:10:00Z',
    documentDate: '2026-09-15',
    hospitalOrClinic: 'Metro Clinical Diagnostics',
    doctorName: 'Dr. Marcus Vance, MD',
    processingStatus: 'PROCESSED',
    processingStage: 'COMPLETED',
    createdAt: '2026-09-15T11:10:00Z',
    rawText: `METRO CLINICAL DIAGNOSTICS & LABS
Patient Name: Arun Kumar | Age: 45 | Sex: Male | Patient ID: PT-1024
Ref Doctor: Dr. Sarah Jenkins | Date: 15 Sep 2026

LABORATORY EVALUATION:
-----------------------------------------------------------------
Test Name                Result     Unit       Reference Range
-----------------------------------------------------------------
HbA1c                    8.2        %          < 5.7 (ABNORMAL - High)
Fasting Blood Glucose    186        mg/dL      70 - 99 (ABNORMAL - High)
Serum Creatinine         0.9        mg/dL      0.7 - 1.3 (NORMAL)
eGFR                     94         mL/min     > 60 (NORMAL)

Notes: Marked elevation in HbA1c (8.2%) and Fasting Glucose (186 mg/dL) consistent with Type 2 Diabetes Mellitus.`,
    extractedData: {
      patientInfo: {
        name: { value: 'Arun Kumar', sourceText: 'Patient Name: Arun Kumar', page: 1, confidence: 0.99 },
        patientId: { value: 'PT-1024', sourceText: 'Patient ID: PT-1024', page: 1, confidence: 0.99 },
        age: { value: 45, sourceText: 'Age: 45', page: 1, confidence: 0.98 }
      },
      documentInfo: {
        documentType: { value: 'LAB_REPORT', sourceText: 'LABORATORY EVALUATION', page: 1, confidence: 0.98 },
        hospital: { value: 'Metro Clinical Diagnostics', sourceText: 'METRO CLINICAL DIAGNOSTICS & LABS', page: 1, confidence: 0.98 },
        doctor: { value: 'Dr. Sarah Jenkins', sourceText: 'Ref Doctor: Dr. Sarah Jenkins', page: 1, confidence: 0.97 },
        date: { value: '2026-09-15', sourceText: 'Date: 15 Sep 2026', page: 1, confidence: 0.99 }
      },
      symptoms: { value: ['Fatigue', 'Increased thirst'], sourceText: 'Fatigue and increased thirst', page: 1, confidence: 0.90 },
      diagnoses: { value: ['Type 2 Diabetes Mellitus'], sourceText: 'consistent with Type 2 Diabetes Mellitus', page: 1, confidence: 0.98 },
      labResults: [
        {
          testName: { value: 'HbA1c', sourceText: 'HbA1c 8.2%', page: 1, confidence: 0.99 },
          value: { value: '8.2%', sourceText: '8.2', page: 1, confidence: 0.99 },
          unit: { value: '%', sourceText: '%', page: 1, confidence: 0.99 },
          referenceRange: { value: '< 5.7%', sourceText: '< 5.7', page: 1, confidence: 0.96 },
          status: { value: 'CRITICAL', sourceText: 'ABNORMAL - High', page: 1, confidence: 0.98 },
          sourceRef: {
            documentId: 'doc-001',
            documentName: 'Blood_Test_Report.pdf',
            page: 1,
            sourceText: 'HbA1c 8.2% < 5.7 (ABNORMAL - High)',
            confidence: 0.99
          }
        },
        {
          testName: { value: 'Fasting Blood Glucose', sourceText: 'Fasting Blood Glucose 186 mg/dL', page: 1, confidence: 0.99 },
          value: { value: '186 mg/dL', sourceText: '186', page: 1, confidence: 0.99 },
          unit: { value: 'mg/dL', sourceText: 'mg/dL', page: 1, confidence: 0.99 },
          referenceRange: { value: '70 - 99 mg/dL', sourceText: '70 - 99', page: 1, confidence: 0.96 },
          status: { value: 'CRITICAL', sourceText: 'ABNORMAL - High', page: 1, confidence: 0.98 },
          sourceRef: {
            documentId: 'doc-001',
            documentName: 'Blood_Test_Report.pdf',
            page: 1,
            sourceText: 'Fasting Blood Glucose 186 mg/dL 70 - 99 (ABNORMAL - High)',
            confidence: 0.99
          }
        }
      ],
      followUpInstructions: {
        value: `Follow-Up Plan & Simple Guidance:

• Blood Test Results: Your HbA1c (8.2%) and Fasting Glucose (186 mg/dL) are higher than normal, confirming Type 2 Diabetes.
• Immediate Action Needed: Schedule an appointment with Dr. Sarah Jenkins within 48 hours to start diabetes management.
• What to Do at Home: Avoid sugary drinks, white sugar, and sweets. Include fresh green vegetables and whole grains in your daily meals.
• Warning Signs: Seek immediate medical care if you experience extreme dizziness, blurred vision, or intense thirst.`,
        sourceText: 'HbA1c 8.2% Fasting Blood Glucose 186 mg/dL - Elevated Glucose Assessment',
        page: 1,
        confidence: 0.98
      }
    }
  },
  {
    id: 'doc-002',
    patientId: 'PT-1024',
    fileName: 'Clinical_Note_15Sep.pdf',
    fileSize: 312000,
    fileType: 'application/pdf',
    storagePath: 'documents/PT-1024/Clinical_Note_15Sep.pdf',
    documentType: 'CLINICAL_NOTE',
    detectedTypeConfidence: 0.96,
    isVerifiedByUser: true,
    uploadDate: '2026-09-15T09:30:00Z',
    documentDate: '2026-09-15',
    hospitalOrClinic: 'MedTrace Primary Care Clinic',
    doctorName: 'Dr. Sarah Jenkins, MD',
    processingStatus: 'PROCESSED',
    processingStage: 'COMPLETED',
    createdAt: '2026-09-15T09:30:00Z',
    rawText: `MEDTRACE PRIMARY CARE CLINIC
OUTPATIENT CONSULTATION NOTE
Date: 15 Sep 2026 | Time: 09:30 AM
Patient: Arun Kumar | Age: 45 | Patient ID: PT-1024
Attending Physician: Dr. Sarah Jenkins, MD

CHIEF COMPLAINT & SYMPTOMS:
Patient reports persistent fatigue, polyuria, and increased thirst over past 3 weeks.

ASSESSMENT:
Uncontrolled blood glucose. Clinical picture suspicious for Type 2 Diabetes.

PLAN:
1. Ordered STAT HbA1c and Fasting Blood Glucose panel.
2. Initiated diabetes dietary counseling.
3. Advised follow-up once lab results arrive today.`,
    extractedData: {
      patientInfo: {
        name: { value: 'Arun Kumar', sourceText: 'Patient: Arun Kumar', page: 1, confidence: 0.99 },
        patientId: { value: 'PT-1024', sourceText: 'Patient ID: PT-1024', page: 1, confidence: 0.99 }
      },
      documentInfo: {
        documentType: { value: 'CLINICAL_NOTE', sourceText: 'OUTPATIENT CONSULTATION NOTE', page: 1, confidence: 0.96 },
        hospital: { value: 'MedTrace Primary Care Clinic', sourceText: 'MEDTRACE PRIMARY CARE CLINIC', page: 1, confidence: 0.98 },
        doctor: { value: 'Dr. Sarah Jenkins, MD', sourceText: 'Dr. Sarah Jenkins, MD', page: 1, confidence: 0.99 },
        date: { value: '2026-09-15', sourceText: 'Date: 15 Sep 2026', page: 1, confidence: 0.99 }
      },
      symptoms: { value: ['Fatigue', 'Increased thirst', 'Polyuria'], sourceText: 'persistent fatigue, polyuria, and increased thirst', page: 1, confidence: 0.97 },
      diagnoses: { value: ['Type 2 Diabetes (Suspected)'], sourceText: 'Clinical picture suspicious for Type 2 Diabetes', page: 1, confidence: 0.95 },
      followUpInstructions: {
        value: `Summary of Doctor Consultation & Next Steps:

• Reason for Consultation: Visited clinic due to tiredness, frequent urination, and excessive thirst.
• Clinical Assessment: Doctor suspects early diabetes and ordered blood tests to confirm.
• Diet Advice: Start reducing rice, refined sugar, and bakery items immediately.
• Next Step: Return to the clinic as soon as the lab report comes back today.`,
        sourceText: 'OUTPATIENT CONSULTATION NOTE - PLAN: Ordered STAT HbA1c and Fasting Blood Glucose panel',
        page: 1,
        confidence: 0.97
      }
    }
  },
  {
    id: 'doc-003',
    patientId: 'PT-1024',
    fileName: 'Prescription_15Sep.pdf',
    fileSize: 210500,
    fileType: 'application/pdf',
    storagePath: 'documents/PT-1024/Prescription_15Sep.pdf',
    documentType: 'PRESCRIPTION',
    detectedTypeConfidence: 0.99,
    isVerifiedByUser: true,
    uploadDate: '2026-09-15T14:30:00Z',
    documentDate: '2026-09-15',
    hospitalOrClinic: 'MedTrace Pharmacy Services',
    doctorName: 'Dr. Sarah Jenkins, MD',
    processingStatus: 'PROCESSED',
    processingStage: 'COMPLETED',
    createdAt: '2026-09-15T14:30:00Z',
    rawText: `MEDTRACE PHARMACY SERVICES
MEDICAL PRESCRIPTION
Date: 15 Sep 2026 | Time: 02:30 PM
Patient: Arun Kumar | ID: PT-1024

PRESCRIPTION ITEM:
1. METFORMIN HYDROCHLORIDE 500 MG TABLET
   Dosage: 500 mg by mouth twice daily with meals
   Quantity: 60 Tablets (30 day supply)
   Refills: 3
   Indication: Type 2 Diabetes Mellitus

Prescriber: Dr. Sarah Jenkins, MD`,
    extractedData: {
      patientInfo: {
        name: { value: 'Arun Kumar', sourceText: 'Patient: Arun Kumar', page: 1, confidence: 0.99 },
        patientId: { value: 'PT-1024', sourceText: 'ID: PT-1024', page: 1, confidence: 0.99 }
      },
      documentInfo: {
        documentType: { value: 'PRESCRIPTION', sourceText: 'MEDICAL PRESCRIPTION', page: 1, confidence: 0.99 },
        hospital: { value: 'MedTrace Pharmacy Services', sourceText: 'MEDTRACE PHARMACY SERVICES', page: 1, confidence: 0.98 },
        doctor: { value: 'Dr. Sarah Jenkins, MD', sourceText: 'Dr. Sarah Jenkins, MD', page: 1, confidence: 0.99 },
        date: { value: '2026-09-15', sourceText: 'Date: 15 Sep 2026', page: 1, confidence: 0.99 }
      },
      medications: [
        {
          name: { value: 'Metformin', sourceText: 'METFORMIN HYDROCHLORIDE 500 MG TABLET', page: 1, confidence: 0.99 },
          dosage: { value: '500 mg', sourceText: '500 mg', page: 1, confidence: 0.99 },
          frequency: { value: 'Twice daily with meals', sourceText: 'twice daily with meals', page: 1, confidence: 0.97 },
          duration: { value: '30 days', sourceText: 'Quantity: 60 Tablets (30 day supply)', page: 1, confidence: 0.95 },
          sourceRef: {
            documentId: 'doc-003',
            documentName: 'Prescription_15Sep.pdf',
            page: 1,
            sourceText: 'METFORMIN HYDROCHLORIDE 500 MG TABLET Dosage: 500 mg by mouth twice daily with meals',
            confidence: 0.99
          }
        }
      ],
      followUpInstructions: {
        value: `Medication Instructions & Advice:

• How to Take Medicine: Take 1 Metformin (500mg) tablet twice a day right after breakfast and dinner. Always take with food to prevent stomach discomfort.
• Duration: 30-day supply (60 tablets). 3 refills remaining.
• Important Note: Do not skip doses. If you feel dizzy or sweaty, check your blood sugar and contact your doctor.`,
        sourceText: 'Dosage: 500 mg by mouth twice daily with meals',
        page: 1,
        confidence: 0.99
      }
    }
  },
  {
    id: 'doc-004',
    patientId: 'PT-1032',
    fileName: 'Priya_BP_Check.pdf',
    fileSize: 340000,
    fileType: 'application/pdf',
    storagePath: 'documents/PT-1032/Priya_BP_Check.pdf',
    documentType: 'CLINICAL_NOTE',
    detectedTypeConfidence: 0.95,
    isVerifiedByUser: true,
    uploadDate: '2026-09-14T10:00:00Z',
    documentDate: '2026-09-14',
    hospitalOrClinic: 'St. Jude Medical Center',
    doctorName: 'Dr. Sarah Jenkins, MD',
    processingStatus: 'PROCESSED',
    processingStage: 'COMPLETED',
    createdAt: '2026-09-14T10:00:00Z',
    rawText: `ST. JUDE MEDICAL CENTER - Outpatient Clinic
Patient: Priya S | ID: PT-1032 | Age: 34
BP Check: 120/80 mmHg. Excellent control on current medication.`,
    extractedData: {
      patientInfo: {
        name: { value: 'Priya S', sourceText: 'Patient: Priya S', page: 1, confidence: 0.99 },
        patientId: { value: 'PT-1032', sourceText: 'ID: PT-1032', page: 1, confidence: 0.99 }
      },
      documentInfo: {
        documentType: { value: 'CLINICAL_NOTE', sourceText: 'Outpatient Clinic', page: 1, confidence: 0.95 },
        hospital: { value: 'St. Jude Medical Center', sourceText: 'ST. JUDE MEDICAL CENTER', page: 1, confidence: 0.98 },
        date: { value: '2026-09-14', sourceText: '2026-09-14', page: 1, confidence: 0.99 }
      },
      vitalSigns: [
        {
          name: { value: 'Blood Pressure', sourceText: 'BP Check: 120/80 mmHg', page: 1, confidence: 0.99 },
          value: { value: '120/80', sourceText: '120/80', page: 1, confidence: 0.99 },
          unit: { value: 'mmHg', sourceText: 'mmHg', page: 1, confidence: 0.99 },
          sourceRef: { documentId: 'doc-004', documentName: 'Priya_BP_Check.pdf', page: 1, sourceText: 'BP Check: 120/80 mmHg', confidence: 0.99 }
        }
      ],
      followUpInstructions: {
        value: `Blood Pressure Assessment & Advice:

• Current Status: Your blood pressure reading is 120/80 mmHg, which is perfectly healthy.
• Medication Advice: Continue taking your blood pressure tablets as prescribed every morning.
• Lifestyle Tips: Maintain low salt intake and stay active with 30 minutes of daily walking.
• Next Appointment: Routine BP check-up scheduled in 3 months.`,
        sourceText: 'BP Check: 120/80 mmHg. Excellent control on current medication.',
        page: 1,
        confidence: 0.98
      }
    }
  },
  {
    id: 'doc-005',
    patientId: 'P-10042',
    fileName: 'John_Discharge.pdf',
    fileSize: 890000,
    fileType: 'application/pdf',
    storagePath: 'documents/P-10042/John_Discharge.pdf',
    documentType: 'DISCHARGE_SUMMARY',
    detectedTypeConfidence: 0.97,
    isVerifiedByUser: true,
    uploadDate: '2026-08-28T18:20:00Z',
    documentDate: '2026-08-28',
    hospitalOrClinic: 'St. Jude Medical Center Hospital',
    doctorName: 'Dr. Sarah Jenkins, MD',
    processingStatus: 'PROCESSED',
    processingStage: 'COMPLETED',
    createdAt: '2026-08-28T18:20:00Z',
    rawText: `ST. JUDE MEDICAL CENTER HOSPITAL - DISCHARGE SUMMARY
Patient: John Doe | ID: P-10042
Discharge Diagnosis: Mild Anemia & Essential Hypertension.`,
    extractedData: {
      patientInfo: {
        name: { value: 'John Doe', sourceText: 'Patient: John Doe', page: 1, confidence: 0.99 },
        patientId: { value: 'P-10042', sourceText: 'ID: P-10042', page: 1, confidence: 0.99 }
      },
      documentInfo: {
        documentType: { value: 'DISCHARGE_SUMMARY', sourceText: 'DISCHARGE SUMMARY', page: 1, confidence: 0.97 },
        hospital: { value: 'St. Jude Medical Center Hospital', sourceText: 'ST. JUDE MEDICAL CENTER HOSPITAL', page: 1, confidence: 0.98 },
        date: { value: '2026-08-28', sourceText: '2026-08-28', page: 1, confidence: 0.99 }
      },
      diagnoses: { value: ['Mild Anemia', 'Essential Hypertension'], sourceText: 'Mild Anemia & Essential Hypertension', page: 1, confidence: 0.96 },
      followUpInstructions: {
        value: `Discharge Summary & Care Instructions:

• Condition at Discharge: Patient discharged in stable condition after treatment for mild anemia and high blood pressure.
• Home Medications: Continue iron supplement tablets daily after lunch and take blood pressure medication every morning.
• Dietary Guidelines: Eat iron-rich foods like spinach, lentils, pomegranate, and beetroot.
• Follow-up Visit: Return to clinic for blood count re-check in 2 weeks.`,
        sourceText: 'ST. JUDE MEDICAL CENTER HOSPITAL - DISCHARGE SUMMARY Discharge Diagnosis: Mild Anemia & Essential Hypertension',
        page: 1,
        confidence: 0.97
      }
    }
  }
];

export const INITIAL_EVENTS: MedicalEvent[] = [
  {
    id: 'evt-101',
    patientId: 'PT-1024',
    documentId: 'doc-002',
    eventType: 'DOCTOR_VISIT',
    eventDate: '2026-09-15',
    eventTime: '09:30 AM',
    title: 'Consultation',
    description: 'Patient presented with symptoms of fatigue and persistent thirst. Suspected glucose intolerance; ordered STAT lab work.',
    doctorName: 'Dr. Sarah Jenkins, MD',
    facilityName: 'MedTrace Primary Care Clinic',
    confidence: 0.96,
    sourcePage: 1,
    sourceText: 'CHIEF COMPLAINT: Patient reports persistent fatigue, polyuria, and increased thirst. Clinical picture suspicious for Type 2 Diabetes.',
    sourceDocumentName: 'Clinical_Note_15Sep.pdf',
    keyDetails: [
      { label: 'Symptoms', value: 'Fatigue, Increased Thirst' },
      { label: 'Diagnosis', value: 'Type 2 Diabetes (Suspected)' },
      { label: 'Action Taken', value: 'Ordered HbA1c & Fasting Glucose Lab Panel' }
    ],
    createdAt: '2026-09-15T09:30:00Z'
  },
  {
    id: 'evt-102',
    patientId: 'PT-1024',
    documentId: 'doc-001',
    eventType: 'LAB_RESULT',
    eventDate: '2026-09-15',
    eventTime: '11:10 AM',
    title: 'Lab Report',
    description: 'Elevated HbA1c (8.2%) and Fasting Glucose (186 mg/dL) confirming Type 2 Diabetes diagnosis.',
    doctorName: 'Dr. Marcus Vance, MD',
    facilityName: 'Metro Clinical Diagnostics',
    confidence: 0.98,
    sourcePage: 1,
    sourceText: 'HbA1c: 8.2% (ABNORMAL - High) | Fasting Blood Glucose: 186 mg/dL (ABNORMAL - High)',
    sourceDocumentName: 'Blood_Test_Report.pdf',
    keyDetails: [
      { label: 'HbA1c', value: '8.2% (Target < 5.7%)' },
      { label: 'Fasting Glucose', value: '186 mg/dL' },
      { label: 'Serum Creatinine', value: '0.9 mg/dL (Normal)' }
    ],
    createdAt: '2026-09-15T11:10:00Z'
  },
  {
    id: 'evt-103',
    patientId: 'PT-1024',
    documentId: 'doc-003',
    eventType: 'PRESCRIPTION',
    eventDate: '2026-09-15',
    eventTime: '02:30 PM',
    title: 'Prescription',
    description: 'Initiated oral hypoglycemic therapy with Metformin 500 mg twice daily with meals.',
    doctorName: 'Dr. Sarah Jenkins, MD',
    facilityName: 'MedTrace Pharmacy Services',
    confidence: 0.99,
    sourcePage: 1,
    sourceText: 'METFORMIN HYDROCHLORIDE 500 MG TABLET Sig: Take 1 tablet by mouth twice daily with meals for Glycemic control',
    sourceDocumentName: 'Prescription_15Sep.pdf',
    keyDetails: [
      { label: 'Medication', value: 'Metformin Hydrochloride' },
      { label: 'Dosage', value: '500 mg' },
      { label: 'Frequency', value: 'Twice daily with meals' },
      { label: 'Quantity', value: '60 Tablets (3 Refills)' }
    ],
    createdAt: '2026-09-15T14:30:00Z'
  },
  {
    id: 'evt-104',
    patientId: 'PT-1032',
    documentId: 'doc-004',
    eventType: 'DOCTOR_VISIT',
    eventDate: '2026-09-14',
    eventTime: '10:00 AM',
    title: 'Hypertension Follow-Up Visit',
    description: 'Blood pressure checked at 120/80 mmHg. Medication maintained.',
    doctorName: 'Dr. Sarah Jenkins, MD',
    facilityName: 'St. Jude Medical Center',
    confidence: 0.95,
    sourcePage: 1,
    sourceText: 'BP Check: 120/80 mmHg. Excellent control on current medication.',
    sourceDocumentName: 'Priya_BP_Check.pdf',
    keyDetails: [
      { label: 'Blood Pressure', value: '120/80 mmHg' },
      { label: 'Status', value: 'Optimal Control' }
    ],
    createdAt: '2026-09-14T10:00:00Z'
  },
  {
    id: 'evt-105',
    patientId: 'P-10042',
    documentId: 'doc-005',
    eventType: 'DISCHARGE',
    eventDate: '2026-08-28',
    eventTime: '04:00 PM',
    title: 'Hospital Discharge Summary',
    description: 'Patient discharged in stable condition after hypertension & anemia workup.',
    doctorName: 'Dr. Sarah Jenkins, MD',
    facilityName: 'St. Jude Medical Center Hospital',
    confidence: 0.97,
    sourcePage: 1,
    sourceText: 'Discharge Diagnosis: Mild Anemia & Essential Hypertension.',
    sourceDocumentName: 'John_Discharge.pdf',
    keyDetails: [
      { label: 'Diagnosis', value: 'Mild Anemia, Essential Hypertension' },
      { label: 'Status', value: 'Discharged Stable' }
    ],
    createdAt: '2026-08-28T16:00:00Z'
  }
];

export const INITIAL_RELATIONSHIPS: EventRelationship[] = [
  {
    id: 'rel-101',
    sourceEventId: 'evt-102',
    targetEventId: 'evt-101',
    relationshipType: 'ORDERED_BY',
    evidence: 'Lab report on 15 Sep 11:10 AM ordered during consultation on 15 Sep 09:30 AM based on fatigue symptoms.',
    confidence: 0.98
  },
  {
    id: 'rel-102',
    sourceEventId: 'evt-103',
    targetEventId: 'evt-102',
    relationshipType: 'PRESCRIBED_DURING',
    evidence: 'Metformin 500 mg prescription issued on 15 Sep 02:30 PM following HbA1c lab result of 8.2%.',
    confidence: 0.99
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-101',
    userId: 'usr-rec-001',
    userEmail: 'records@medtrace.health',
    action: 'DOCUMENT_UPLOADED',
    details: 'Uploaded Blood_Test_Report.pdf for patient PT-1024',
    timestamp: '2026-09-15T11:10:00Z'
  },
  {
    id: 'log-102',
    userId: 'usr-rec-001',
    userEmail: 'records@medtrace.health',
    action: 'AI_PIPELINE_COMPLETED',
    details: 'Extracted HbA1c 8.2% and Fasting Glucose 186 mg/dL with 98% confidence',
    timestamp: '2026-09-15T11:10:05Z'
  },
  {
    id: 'log-103',
    userId: 'usr-doc-001',
    userEmail: 'dr.jenkins@medtrace.health',
    action: 'PATIENT_RECORD_VIEWED',
    details: 'Dr. Sarah Jenkins viewed medical timeline for patient Arun Kumar (PT-1024)',
    timestamp: '2026-09-15T11:15:00Z'
  },
  {
    id: 'log-104',
    userId: 'usr-reg-001',
    userEmail: 'registration@medtrace.health',
    action: 'PATIENT_REGISTERED',
    details: 'Registered new patient Arun Kumar (ID: PT-1024)',
    timestamp: '2026-09-01T08:00:00Z'
  }
];
