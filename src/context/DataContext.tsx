import React, { createContext, useContext, useState } from 'react';
import type { 
  MedicalDocument, 
  MedicalEvent, 
  EventRelationship, 
  AuditLog, 
  DocumentType, 
  ExtractedMedicalData, 
  GlobalSearchResult,
  PipelineStage,
  Patient,
  Appointment
} from '../types';
import { 
  INITIAL_DOCUMENTS, 
  INITIAL_EVENTS, 
  INITIAL_RELATIONSHIPS, 
  INITIAL_AUDIT_LOGS,
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENTS
} from '../services/mockData';
import { processDocumentPipeline } from '../services/aiPipeline';
import { useAuth } from './AuthContext';

interface ActiveSnippet {
  documentId: string;
  documentName: string;
  page?: number;
  text: string;
  fieldKey?: string;
}

interface DataContextType {
  patients: Patient[];
  appointments: Appointment[];
  documents: MedicalDocument[];
  events: MedicalEvent[];
  relationships: EventRelationship[];
  auditLogs: AuditLog[];
  activeDocument: MedicalDocument | null;
  activeSnippet: ActiveSnippet | null;
  isProcessingUpload: boolean;
  pipelineProgress: { stageIndex: number; stages: PipelineStage[] } | null;
  
  registerPatient: (patientData: Omit<Patient, 'id' | 'patientId' | 'createdAt'>) => Patient;
  uploadAndProcessDocument: (file: File, targetPatientId?: string, categoryOverride?: DocumentType) => Promise<MedicalDocument | null>;
  reclassifyDocument: (documentId: string, newType: DocumentType) => void;
  updateExtractedData: (documentId: string, newExtraction: ExtractedMedicalData) => void;
  deleteDocument: (documentId: string) => void;
  reprocessDocument: (documentId: string) => Promise<void>;
  searchMedicalRecords: (query: string) => GlobalSearchResult;
  resetToDemoDataset: () => void;
  openDocumentViewer: (doc: MedicalDocument, page?: number, snippetText?: string, fieldKey?: string) => void;
  closeDocumentViewer: () => void;
  addAuditLog: (action: string, details: string) => void;
  getPatientById: (patientId: string) => Patient | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [documents, setDocuments] = useState<MedicalDocument[]>(INITIAL_DOCUMENTS);
  const [events, setEvents] = useState<MedicalEvent[]>(INITIAL_EVENTS);
  const [relationships, setRelationships] = useState<EventRelationship[]>(INITIAL_RELATIONSHIPS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  
  const [activeDocument, setActiveDocument] = useState<MedicalDocument | null>(null);
  const [activeSnippet, setActiveSnippet] = useState<ActiveSnippet | null>(null);
  const [isProcessingUpload, setIsProcessingUpload] = useState<boolean>(false);
  const [pipelineProgress, setPipelineProgress] = useState<{ stageIndex: number; stages: PipelineStage[] } | null>(null);

  const addAuditLog = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      userId: user?.id || 'usr-guest',
      userEmail: user?.email || 'guest@medtrace.health',
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const registerPatient = (patientData: Omit<Patient, 'id' | 'patientId' | 'createdAt'>): Patient => {
    const nextNumber = 1000 + patients.length + 1;
    const newPatientId = `PT-${nextNumber}`;
    const newPatient: Patient = {
      ...patientData,
      id: `pat-${Date.now()}`,
      patientId: newPatientId,
      createdAt: new Date().toISOString(),
      avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?auto=format&fit=crop&q=80&w=256`
    };

    setPatients(prev => [newPatient, ...prev]);
    addAuditLog('PATIENT_REGISTERED', `Registered patient ${newPatient.name} (${newPatient.patientId})`);
    return newPatient;
  };

  const getPatientById = (patientId: string): Patient | undefined => {
    return patients.find(p => p.patientId === patientId || p.id === patientId);
  };

  const uploadAndProcessDocument = async (file: File, targetPatientId?: string, categoryOverride?: DocumentType): Promise<MedicalDocument | null> => {
    setIsProcessingUpload(true);
    try {
      const patientId = targetPatientId || user?.patientId || 'PT-1024';
      
      const result = await processDocumentPipeline(
        file, 
        patientId, 
        categoryOverride,
        (stageIndex, stages) => {
          setPipelineProgress({ stageIndex, stages });
        }
      );

      setDocuments(prev => [result.document, ...prev]);
      setEvents(prev => [result.event, ...prev].sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()));
      setRelationships(prev => [...result.relationships, ...prev]);

      addAuditLog('DOCUMENT_UPLOADED', `Uploaded file: ${file.name} for Patient ID: ${patientId}, Classified as: ${result.document.documentType}`);
      
      setIsProcessingUpload(false);
      return result.document;
    } catch (err: any) {
      console.error('Upload processing error:', err);
      setIsProcessingUpload(false);
      throw err;
    }
  };

  const reclassifyDocument = (documentId: string, newType: DocumentType) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === documentId) {
        return {
          ...doc,
          documentType: newType,
          isVerifiedByUser: true,
          detectedTypeConfidence: 1.0,
        };
      }
      return doc;
    }));

    setEvents(prev => prev.map(evt => {
      if (evt.documentId === documentId) {
        return {
          ...evt,
          title: `Reclassified Document (${newType})`,
        };
      }
      return evt;
    }));

    addAuditLog('DOCUMENT_RECLASSIFIED', `Document ID ${documentId} manually changed to ${newType}`);
  };

  const updateExtractedData = (documentId: string, newExtraction: ExtractedMedicalData) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === documentId) {
        return {
          ...doc,
          extractedData: newExtraction,
          isVerifiedByUser: true,
        };
      }
      return doc;
    }));

    addAuditLog('EXTRACTION_CORRECTED', `Manually corrected extraction fields for document ${documentId}`);
  };

  const deleteDocument = (documentId: string) => {
    const docToDelete = documents.find(d => d.id === documentId);
    setDocuments(prev => prev.filter(d => d.id !== documentId));
    setEvents(prev => prev.filter(e => e.documentId !== documentId));
    setRelationships(prev => prev.filter(r => {
      const relatedEventIds = events.filter(e => e.documentId === documentId).map(e => e.id);
      return !relatedEventIds.includes(r.sourceEventId) && !relatedEventIds.includes(r.targetEventId);
    }));

    addAuditLog('DOCUMENT_DELETED', `Deleted document ${docToDelete?.fileName || documentId}`);
  };

  const reprocessDocument = async (documentId: string) => {
    const doc = documents.find(d => d.id === documentId);
    if (!doc) return;

    setIsProcessingUpload(true);
    addAuditLog('REPROCESS_TRIGGERED', `Reprocessing requested for document ${doc.fileName}`);
    
    await new Promise(r => setTimeout(r, 1200));

    setDocuments(prev => prev.map(d => {
      if (d.id === documentId) {
        return {
          ...d,
          processingStatus: 'PROCESSED',
          detectedTypeConfidence: 0.98,
        };
      }
      return d;
    }));

    setIsProcessingUpload(false);
  };

  const searchMedicalRecords = (query: string): GlobalSearchResult => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return { patients: [], events: [], documents: [], labResults: [], medications: [] };
    }

    const matchedPatients = patients.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.patientId.toLowerCase().includes(q) ||
      p.phone.toLowerCase().includes(q) ||
      p.medicalCondition.toLowerCase().includes(q)
    );

    const matchedEvents = events.filter(evt => 
      evt.title.toLowerCase().includes(q) ||
      evt.description.toLowerCase().includes(q) ||
      evt.eventType.toLowerCase().includes(q) ||
      evt.sourceText.toLowerCase().includes(q) ||
      (evt.doctorName && evt.doctorName.toLowerCase().includes(q)) ||
      (evt.facilityName && evt.facilityName.toLowerCase().includes(q))
    );

    const matchedDocuments = documents.filter(doc => 
      doc.fileName.toLowerCase().includes(q) ||
      doc.documentType.toLowerCase().includes(q) ||
      (doc.hospitalOrClinic && doc.hospitalOrClinic.toLowerCase().includes(q)) ||
      (doc.rawText && doc.rawText.toLowerCase().includes(q))
    );

    const matchedLabResults: Array<any> = [];
    const matchedMedications: Array<any> = [];

    documents.forEach(doc => {
      if (doc.extractedData?.labResults) {
        doc.extractedData.labResults.forEach(lab => {
          if (
            String(lab.testName.value).toLowerCase().includes(q) ||
            String(lab.value.value).toLowerCase().includes(q) ||
            String(lab.sourceRef.sourceText).toLowerCase().includes(q)
          ) {
            matchedLabResults.push({
              testName: String(lab.testName.value),
              result: String(lab.value.value),
              unit: String(lab.unit.value),
              date: doc.documentDate,
              documentId: doc.id,
              documentName: doc.fileName
            });
          }
        });
      }

      if (doc.extractedData?.medications) {
        doc.extractedData.medications.forEach(med => {
          if (
            String(med.name.value).toLowerCase().includes(q) ||
            String(med.dosage.value).toLowerCase().includes(q) ||
            String(med.sourceRef.sourceText).toLowerCase().includes(q)
          ) {
            matchedMedications.push({
              name: String(med.name.value),
              dosage: String(med.dosage.value),
              date: doc.documentDate,
              documentId: doc.id,
              documentName: doc.fileName
            });
          }
        });
      }
    });

    return {
      patients: matchedPatients,
      events: matchedEvents,
      documents: matchedDocuments,
      labResults: matchedLabResults,
      medications: matchedMedications,
    };
  };

  const resetToDemoDataset = () => {
    setPatients(INITIAL_PATIENTS);
    setAppointments(INITIAL_APPOINTMENTS);
    setDocuments(INITIAL_DOCUMENTS);
    setEvents(INITIAL_EVENTS);
    setRelationships(INITIAL_RELATIONSHIPS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setActiveDocument(null);
    setActiveSnippet(null);
    addAuditLog('DATASET_RESET', 'Reset dataset to MedTrace hackathon baseline');
  };

  const openDocumentViewer = (doc: MedicalDocument, page: number = 1, snippetText?: string, fieldKey?: string) => {
    setActiveDocument(doc);
    if (snippetText) {
      setActiveSnippet({
        documentId: doc.id,
        documentName: doc.fileName,
        page,
        text: snippetText,
        fieldKey
      });
    } else {
      setActiveSnippet(null);
    }
  };

  const closeDocumentViewer = () => {
    setActiveDocument(null);
    setActiveSnippet(null);
  };

  return (
    <DataContext.Provider
      value={{
        patients,
        appointments,
        documents,
        events,
        relationships,
        auditLogs,
        activeDocument,
        activeSnippet,
        isProcessingUpload,
        pipelineProgress,
        registerPatient,
        uploadAndProcessDocument,
        reclassifyDocument,
        updateExtractedData,
        deleteDocument,
        reprocessDocument,
        searchMedicalRecords,
        resetToDemoDataset,
        openDocumentViewer,
        closeDocumentViewer,
        addAuditLog,
        getPatientById,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
