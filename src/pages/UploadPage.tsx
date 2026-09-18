import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import type { DocumentType } from '../types';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles
} from 'lucide-react';

interface UploadPageProps {
  onNavigate?: (page: string) => void;
}

export const UploadPage: React.FC<UploadPageProps> = () => {
  const { uploadAndProcessDocument, openDocumentViewer } = useData();
  const [selectedCategory, setSelectedCategory] = useState<DocumentType>('LAB_REPORT');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<{ title: string; message: string } | null>(null);

  const categories: Array<{ type: DocumentType; label: string }> = [
    { type: 'LAB_REPORT', label: 'Laboratory Report' },
    { type: 'PRESCRIPTION', label: 'Prescription' },
    { type: 'DISCHARGE_SUMMARY', label: 'Discharge Summary' },
    { type: 'IMAGING_REPORT', label: 'Imaging Report' },
    { type: 'CLINICAL_NOTE', label: 'Clinical Note' },
    { type: 'OTHER', label: 'Other Medical Document' },
  ];

  const handleFiles = async (files: FileList | File[]) => {
    setUploadError(null);
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    const validExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.txt'];
    let lastCreatedDoc = null;

    for (const file of fileArray) {
      if (file.size > 15 * 1024 * 1024) {
        setUploadError({
          title: 'File Size Exceeded',
          message: `File "${file.name}" exceeds the 15MB limit. Please upload smaller documents.`
        });
        continue;
      }

      const fileNameLower = file.name.toLowerCase();
      const isValid = validExtensions.some(ext => fileNameLower.endsWith(ext));

      if (!isValid) {
        setUploadError({
          title: 'Unsupported File Format',
          message: `File "${file.name}" has an unsupported format. Supported: PDF, JPG, JPEG, PNG, TXT.`
        });
        continue;
      }

      try {
        const createdDoc = await uploadAndProcessDocument(file, 'PT-1024', selectedCategory);
        if (createdDoc) {
          lastCreatedDoc = createdDoc;
        }
      } catch (err: any) {
        setUploadError({
          title: err.name || 'Not a Medical Document',
          message: err.message || `File "${file.name}" could not be identified as a medical record.`
        });
      }
    }

    if (lastCreatedDoc) {
      openDocumentViewer(lastCreatedDoc);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const triggerDemoUpload = (docType: DocumentType, name: string) => {
    const demoBlob = new Blob([`MEDTRACE DEMO DATA - ${name}`], { type: 'application/pdf' });
    const demoFile = new File([demoBlob], name, { type: 'application/pdf' });
    setSelectedCategory(docType);
    handleFiles([demoFile]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12 font-sans select-none">
      {/* Header */}
      <div className="space-y-1 border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
          <UploadCloud className="w-7 h-7 text-emerald-600" />
          Upload Medical Documents
        </h1>
        <p className="text-sm font-medium text-slate-500">
          Upload PDF, JPG, PNG, or TXT files. MedTrace auto-classifies the document, runs OCR, extracts structured data, and updates your timeline
        </p>
      </div>

      {/* Error Banner */}
      {uploadError && (
        <div className="p-5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 flex items-start gap-3 shadow-2xs animate-fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-rose-900">{uploadError.title}</h4>
            <p className="text-xs font-medium text-rose-700 leading-relaxed">{uploadError.message}</p>
          </div>
        </div>
      )}

      {/* Main Upload Box */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-2xs space-y-6">
        {/* Category selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
            Expected Document Category
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {categories.map(c => (
              <button
                key={c.type}
                type="button"
                onClick={() => setSelectedCategory(c.type)}
                className={`p-3 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between cursor-pointer ${
                  selectedCategory === c.type
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{c.label}</span>
                {selectedCategory === c.type && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Dropzone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-3xl p-8 md:p-12 text-center transition-all cursor-pointer ${
            dragActive
              ? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]'
              : 'border-slate-300 hover:border-emerald-400 bg-slate-50/50'
          }`}
        >
          <input
            type="file"
            id="fileUploadInput"
            accept=".pdf,.jpg,.jpeg,.png,.txt"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
          />
          <label htmlFor="fileUploadInput" className="cursor-pointer space-y-3 block">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-md">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <p className="text-base font-bold text-slate-900">
                Drag & Drop your medical document here
              </p>
              <p className="text-xs text-slate-500 mt-1">or click to browse files from your computer</p>
            </div>
            <div className="pt-2 inline-block px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors">
              Browse Files
            </div>
            <p className="text-[11px] text-slate-400 font-mono pt-2">
              Supported Formats: PDF, JPG, JPEG, PNG, TXT (Max size: 15MB)
            </p>
          </label>
        </div>

        {/* Quick Demo Upload Buttons */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Hackathon Quick Demo Upload (Test Sample Files)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => triggerDemoUpload('LAB_REPORT', 'blood_test_sep18.pdf')}
              className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-emerald-50 text-slate-800 text-xs font-semibold rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              <span>Upload Sample Blood Test</span>
            </button>
            <button
              onClick={() => triggerDemoUpload('PRESCRIPTION', 'rx_hypertension.pdf')}
              className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-blue-50 text-slate-800 text-xs font-semibold rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Upload Sample Prescription</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
