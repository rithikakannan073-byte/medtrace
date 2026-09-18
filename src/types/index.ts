export type UserRole = 
  | 'ADMIN' 
  | 'DOCTOR' 
  | 'PATIENT' 
  | 'REGISTRATION_STAFF' 
  | 'MEDICAL_RECORDS_STAFF';

export interface User {
  id: string;
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  patientId?: string;
  phone?: string;
  department?: string;
  createdAt: string;
}

export type DocumentType = 
  | 'LAB_REPORT'
  | 'PRESCRIPTION'
  | 'DISCHARGE_SUMMARY'
  | 'IMAGING_REPORT'
  | 'CLINICAL_NOTE'
  | 'OTHER';

export type ProcessingStatus = 
  | 'UPLOADED'
  | 'READING'
  | 'EXTRACTING'
  | 'IDENTIFYING'
  | 'LINKING'
  | 'BUILDING_TIMELINE'
  | 'PROCESSED'
  | 'FAILED';

export interface DocumentSourceRef {
  documentId: string;
  documentName: string;
  page?: number;
  sourceText: string;
  confidence?: number;
}

export interface MedicalDocument {
  id: string;
  patientId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  storagePath: string;
  documentType: DocumentType;
  detectedTypeConfidence: number;
  isVerifiedByUser: boolean;
  uploadDate: string;
  documentDate: string;
  hospitalOrClinic?: string;
  doctorName?: string;
  processingStatus: ProcessingStatus;
  processingStage?: string;
  processingError?: string;
  createdAt: string;
  rawText?: string;
  extractedData?: ExtractedMedicalData;
}

export interface ExtractedField<T = string | number | null> {
  value: T;
  sourceText?: string;
  page?: number;
  confidence?: number;
}

export interface ExtractedMedicalData {
  patientInfo: {
    name?: ExtractedField<string>;
    dob?: ExtractedField<string>;
    patientId?: ExtractedField<string>;
    age?: ExtractedField<number>;
  };
  documentInfo: {
    documentType: ExtractedField<DocumentType>;
    hospital?: ExtractedField<string>;
    doctor?: ExtractedField<string>;
    date?: ExtractedField<string>;
  };
  symptoms?: ExtractedField<string[]>;
  diagnoses?: ExtractedField<string[]>;
  medications?: Array<{
    name: ExtractedField<string>;
    dosage: ExtractedField<string>;
    frequency?: ExtractedField<string>;
    duration?: ExtractedField<string>;
    instructions?: ExtractedField<string>;
    sourceRef: DocumentSourceRef;
  }>;
  labResults?: Array<{
    testName: ExtractedField<string>;
    value: ExtractedField<string | number>;
    unit: ExtractedField<string>;
    referenceRange?: ExtractedField<string>;
    status?: ExtractedField<'NORMAL' | 'ABNORMAL' | 'CRITICAL'>;
    sourceRef: DocumentSourceRef;
  }>;
  vitalSigns?: Array<{
    name: ExtractedField<string>;
    value: ExtractedField<string>;
    unit?: ExtractedField<string>;
    sourceRef: DocumentSourceRef;
  }>;
  procedures?: Array<{
    name: ExtractedField<string>;
    date?: ExtractedField<string>;
    notes?: ExtractedField<string>;
    sourceRef: DocumentSourceRef;
  }>;
  imagingFindings?: Array<{
    modality: ExtractedField<string>;
    bodyPart?: ExtractedField<string>;
    findings: ExtractedField<string>;
    impression?: ExtractedField<string>;
    sourceRef: DocumentSourceRef;
  }>;
  allergies?: ExtractedField<string[]>;
  followUpInstructions?: ExtractedField<string>;
}

export type EventType = 
  | 'LAB_RESULT'
  | 'PRESCRIPTION'
  | 'DOCTOR_VISIT'
  | 'DISCHARGE'
  | 'IMAGING'
  | 'PROCEDURE'
  | 'OTHER';

export interface MedicalEvent {
  id: string;
  patientId: string;
  documentId: string;
  eventType: EventType;
  eventDate: string;
  eventTime?: string;
  title: string;
  description: string;
  doctorName?: string;
  facilityName?: string;
  confidence: number;
  sourcePage?: number;
  sourceText: string;
  sourceDocumentName: string;
  keyDetails: Array<{ label: string; value: string }>;
  createdAt: string;
}

export type RelationshipType = 
  | 'FOLLOW_UP_FOR' 
  | 'PRESCRIBED_DURING' 
  | 'ORDERED_BY' 
  | 'MONITORED_BY' 
  | 'RELATED_CONDITION';

export interface EventRelationship {
  id: string;
  sourceEventId: string;
  targetEventId: string;
  relationshipType: RelationshipType;
  evidence: string;
  confidence: number;
}

export interface PipelineStage {
  id: string;
  name: string;
  description: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
}

export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface Patient {
  id: string;
  patientId: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  medicalCondition: string;
  address?: string;
  emergencyContact?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  time: string;
  date: string;
  type: string;
  status: 'Scheduled' | 'Completed' | 'Waiting' | 'Cancelled';
}

export interface GlobalSearchResult {
  patients: Patient[];
  events: MedicalEvent[];
  documents: MedicalDocument[];
  labResults: Array<{
    testName: string;
    result: string;
    unit: string;
    date: string;
    documentId: string;
    documentName: string;
  }>;
  medications: Array<{
    name: string;
    dosage: string;
    date: string;
    documentId: string;
    documentName: string;
  }>;
}
