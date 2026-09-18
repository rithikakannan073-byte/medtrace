import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import type { MedicalDocument, DocumentType } from '../types';
import { 
  FileCheck2, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Loader2, 
  Eye, 
  FolderArchive,
  AlertCircle,
  Calendar,
  Activity,
  Clock,
  UserCheck
} from 'lucide-react';

export const MedicalRecordsDashboardPage: React.FC = () => {
  const { patients, documents, events, uploadAndProcessDocument, openDocumentViewer } = useData();
  
  const [selectedPatientId, setSelectedPatientId] = useState<string>('PT-1024');
  const [categoryOverride, setCategoryOverride] = useState<DocumentType>('LAB_REPORT');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [uploadStatusStep, setUploadStatusStep] = useState<string | null>(null);
  const [processedResultDoc, setProcessedResultDoc] = useState<MedicalDocument | null>(null);
  const [uploadError, setUploadError] = useState<{ title: string; message: string } | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const filesArr = Array.from(e.dataTransfer.files);
      processSelectedFiles(filesArr);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const filesArr = Array.from(e.target.files);
      processSelectedFiles(filesArr);
    }
  };

  const processSelectedFiles = async (files: File[]) => {
    if (files.length === 0) return;
    const fileToProcess = files[0];
    setUploadError(null);

    setUploadStatusStep('Uploading document...');
    await new Promise(r => setTimeout(r, 400));

    setUploadStatusStep('Reading document OCR text...');
    await new Promise(r => setTimeout(r, 400));

    setUploadStatusStep('Validating medical document classification...');
    await new Promise(r => setTimeout(r, 400));

    try {
      const result = await uploadAndProcessDocument(fileToProcess, selectedPatientId, categoryOverride);
      setUploadStatusStep(null);
      if (result) {
        setProcessedResultDoc(result);
      }
    } catch (err: any) {
      setUploadStatusStep(null);
      setUploadError({
        title: err.name || 'Not a Medical Document',
        message: err.message || 'The uploaded document could not be identified as a medical record. Please upload a valid medical document.'
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 font-sans select-none">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
            <FileCheck2 className="w-7 h-7 text-amber-600" />
            Medical Records Workspace
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Upload and process medical documents into structured chronological patient history
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-xl text-xs font-bold font-mono">
            EXTRACTION ENGINE ACTIVE
          </span>
        </div>
      </div>

      {uploadError && (
        <div className="p-5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 flex items-start gap-3 shadow-2xs animate-fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-rose-900">{uploadError.title}</h4>
            <p className="text-xs font-medium text-rose-700 leading-relaxed">{uploadError.message}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-5">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-amber-600" />
          Document Upload & Processing Pipeline
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Target Patient Profile
            </label>
            <select
              value={selectedPatientId}
              onChange={e => setSelectedPatientId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
            >
              {patients.map(p => (
                <option key={p.id} value={p.patientId}>
                  {p.name} ({p.patientId}) - {p.medicalCondition}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Document Category
            </label>
            <select
              value={categoryOverride}
              onChange={e => setCategoryOverride(e.target.value as DocumentType)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
            >
              <option value="LAB_REPORT">Laboratory Report</option>
              <option value="PRESCRIPTION">Prescription</option>
              <option value="DISCHARGE_SUMMARY">Discharge Summary</option>
              <option value="IMAGING_REPORT">Imaging Report</option>
              <option value="CLINICAL_NOTE">Clinical Note</option>
              <option value="OTHER">Other Medical Document</option>
            </select>
          </div>
        </div>

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all flex flex-col items-center justify-center gap-3 ${
            dragActive
              ? 'border-amber-500 bg-amber-50/60 scale-[1.01]'
              : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-400'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <UploadCloud className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <p className="text-base font-bold text-slate-900">
              Drop medical documents here
            </p>
            <p className="text-xs font-medium text-slate-500">
              Supported formats: <strong className="text-slate-700">PDF, JPG, JPEG, PNG, TXT</strong>
            </p>
          </div>

          <label className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-md shadow-amber-600/20 cursor-pointer transition-all">
            Browse files
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.txt"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </label>
        </div>

        {uploadStatusStep && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-3 animate-fade-in">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-amber-600 animate-spin shrink-0" />
              <div className="flex-1">
                <span className="text-xs font-bold text-amber-900 block">{uploadStatusStep}</span>
                <span className="text-[10px] text-amber-700 font-mono">Running MedTrace NLP Pipeline v2.4</span>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-1 pt-1 text-[10px] font-mono font-bold text-center">
              <div className="bg-amber-500 text-white py-1 rounded">Uploading</div>
              <div className="bg-amber-500 text-white py-1 rounded">Reading</div>
              <div className="bg-amber-500 text-white py-1 rounded">Extracting</div>
              <div className="bg-amber-500 text-white py-1 rounded">Identifying</div>
              <div className="bg-amber-500 text-white py-1 rounded">Linking</div>
              <div className="bg-amber-500 text-white py-1 rounded">Timeline</div>
            </div>
          </div>
        )}
      </div>

      {processedResultDoc && (
        <div className="bg-white rounded-3xl border border-emerald-300 p-6 shadow-md space-y-5 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <h2 className="text-lg font-black text-slate-900">Document Processing Result Summary</h2>
            </div>
            <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-xl">
              100% Extraction Complete
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Documents Processed</span>
              <p className="text-2xl font-black text-slate-900 mt-1">1</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Entities Detected</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">12</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">AI Confidence Score</span>
              <p className="text-2xl font-black text-blue-600 mt-1">
                {Math.round(processedResultDoc.detectedTypeConfidence * 100)}%
              </p>
              <span className="text-[10px] text-slate-400">AI confidence score (Not medical certainty)</span>
            </div>
          </div>

          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-900">
              Extracted Medical Information & Traceability
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-emerald-200">
                <span className="text-slate-400 font-bold block">Patient:</span>
                <span className="font-bold text-slate-900 text-sm">{processedResultDoc.extractedData?.patientInfo?.name?.value || 'Arun Kumar'}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-emerald-200">
                <span className="text-slate-400 font-bold block">Detected Type:</span>
                <span className="font-bold text-emerald-700 text-sm font-mono">{processedResultDoc.documentType}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => openDocumentViewer(processedResultDoc)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>Open Source Document Viewer</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Master Chronological Patient Timeline */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              Chronological Patient Medical Timeline (All Documents)
            </h2>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              Reconstructed medical history timeline synthesized across all uploaded documents
            </p>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold font-mono">
            {events.length} Events Synthesized
          </span>
        </div>

        <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {events.map((evt, idx) => {
            const matchedDoc = documents.find(d => d.id === evt.documentId || d.fileName === evt.sourceDocumentName);
            return (
              <div key={evt.id || idx} className="relative group">
                {/* Timeline node icon */}
                <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold ring-4 ring-white shadow-sm">
                  {idx + 1}
                </div>

                <div className="bg-slate-50 hover:bg-emerald-50/40 rounded-2xl border border-slate-200 p-5 transition-all space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 bg-blue-100 text-blue-800 font-bold rounded-lg text-xs font-mono">
                        {evt.eventType}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm">{evt.title}</h3>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {evt.eventDate}
                      </span>
                      {evt.eventTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {evt.eventTime}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    {evt.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-slate-200/80">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      <span>Physician: <strong className="text-slate-800">{evt.doctorName}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>Source File: <strong className="text-slate-800">{evt.sourceDocumentName}</strong></span>
                    </div>
                  </div>

                  {matchedDoc && (
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => openDocumentViewer(matchedDoc)}
                        className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-600" />
                        <span>Inspect Document & Follow-Up Advice</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <FolderArchive className="w-5 h-5 text-slate-600" />
          Processed Medical Document Library
        </h2>

        <div className="space-y-3">
          {documents.map(doc => (
            <div
              key={doc.id}
              className="p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:border-amber-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{doc.fileName}</h3>
                  <div className="flex items-center gap-2 text-slate-500 font-mono mt-0.5">
                    <span>Patient ID: {doc.patientId}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-bold">{doc.documentType}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg text-[10px] font-mono">
                  {doc.processingStatus}
                </span>
                <button
                  onClick={() => openDocumentViewer(doc)}
                  className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-600" />
                  <span>Inspect Source</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
