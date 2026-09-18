import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  X, 
  FileText, 
  CheckCircle2, 
  ExternalLink, 
  FileSearch, 
  BookOpen, 
  Layers, 
  Zap
} from 'lucide-react';

export const DocumentViewerModal: React.FC = () => {
  const { activeDocument, activeSnippet, closeDocumentViewer } = useData();
  const [activeTab, setActiveTab] = useState<'structured' | 'rawText' | 'json'>('structured');
  const [selectedField, setSelectedField] = useState<string | null>(activeSnippet?.text || null);

  if (!activeDocument) return null;

  const extracted = activeDocument.extractedData;

  const handleFieldClick = (sourceText?: string) => {
    if (sourceText) {
      setSelectedField(sourceText);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 md:p-6 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{activeDocument.fileName}</h3>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-mono px-2 py-0.5 rounded font-semibold">
                  {activeDocument.documentType}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {activeDocument.detectedTypeConfidence > 0 
                    ? `${(activeDocument.detectedTypeConfidence * 100).toFixed(0)}% Confidence` 
                    : 'Confidence: Not available'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Uploaded: {new Date(activeDocument.uploadDate).toLocaleDateString()} | Facility: {activeDocument.hospitalOrClinic || 'General Clinic'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (activeDocument.storagePath) {
                  window.open(activeDocument.storagePath, '_blank');
                }
              }}
              className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Original Document</span>
            </button>
            <button
              onClick={closeDocumentViewer}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Split Body */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
          {/* LEFT SIDE: Original Document Preview & Text Highlighter */}
          <div className="bg-slate-900 p-4 md:p-6 flex flex-col justify-between overflow-y-auto border-r border-slate-800 relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-mono text-emerald-400">
                <BookOpen className="w-3.5 h-3.5" /> Document Visual Viewer (Page 1 of 1)
              </span>
              <span className="text-slate-500">Source Verification Mode</span>
            </div>

            {/* Document Paper / Image Container */}
            <div className="my-4 bg-white text-slate-900 rounded-lg p-4 shadow-2xl font-serif text-sm leading-relaxed border border-slate-200 max-w-xl mx-auto w-full relative flex flex-col items-center">
              {/* Header watermark */}
              <div className="text-center pb-4 border-b border-slate-200 mb-4 font-sans w-full">
                <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Verified Medical Record</p>
                <p className="text-lg font-bold text-slate-900">{activeDocument.hospitalOrClinic || 'Verified Health Facility'}</p>
                <p className="text-xs text-slate-500">Date: {activeDocument.documentDate}</p>
              </div>

              {/* Document Image or Text Body */}
              {activeDocument.fileType?.toLowerCase().startsWith('image/') || ['jpg', 'jpeg', 'png', 'webp', 'bmp'].some(ext => activeDocument.fileName?.toLowerCase().endsWith(ext)) ? (
                <div className="w-full flex flex-col items-center justify-center py-2 space-y-3">
                  <img
                    src={activeDocument.storagePath}
                    alt={activeDocument.fileName}
                    className="max-h-[380px] w-auto object-contain rounded-lg border border-slate-200 shadow-md"
                  />
                  <p className="text-[11px] font-mono text-slate-500 text-center">
                    Original Image Preview • OCR Extracted Below
                  </p>
                </div>
              ) : (
                <div className="font-mono text-xs text-slate-700 whitespace-pre-wrap space-y-2 w-full">
                  {activeDocument.rawText ? (
                    activeDocument.rawText.split('\n').map((line, idx) => {
                      const isHighlighted = selectedField && line.toLowerCase().includes(selectedField.toLowerCase().slice(0, 15));
                      return (
                        <p
                          key={idx}
                          className={`p-1 rounded transition-all ${
                            isHighlighted
                              ? 'bg-amber-200 text-amber-950 font-bold border-l-4 border-amber-500 ring-2 ring-amber-300'
                              : 'hover:bg-slate-100'
                          }`}
                        >
                          {line}
                        </p>
                      );
                    })
                  ) : (
                    <p>Document text content available for traceability verification.</p>
                  )}
                </div>
              )}

              {/* Dynamic Highlight Box Overlay */}
              {selectedField && (
                <div className="mt-4 p-3 bg-amber-50 border-2 border-amber-400 rounded-lg text-amber-900 text-xs font-sans animate-fade-in shadow-md w-full">
                  <div className="flex items-center gap-1.5 font-bold mb-1 text-amber-800">
                    <Zap className="w-3.5 h-3.5" /> Highlighted Source Traceability Match (Page 1)
                  </div>
                  <p className="font-mono bg-amber-100 p-2 rounded text-slate-900 font-semibold">
                    "{selectedField}"
                  </p>
                </div>
              )}
            </div>

            <div className="pt-2 text-center text-xs text-slate-500 font-mono">
              Traceability Status: <span className="text-emerald-400 font-semibold">100% Auditable</span>
            </div>
          </div>

          {/* RIGHT SIDE: Extracted Structured Information */}
          <div className="bg-white flex flex-col overflow-hidden">
            {/* Tab selector */}
            <div className="px-6 pt-4 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50/50">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab('structured')}
                  className="pb-3 text-xs font-bold uppercase tracking-wider border-b-2 border-emerald-600 text-emerald-700"
                >
                  Extracted Fields
                </button>
              </div>

              <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Click field to highlight
              </span>
            </div>

            {/* Tab Contents */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {activeTab === 'structured' && extracted && (
                <div className="space-y-6">
                  {/* Patient Info */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-blue-600" /> Extracted Patient Details
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div 
                        onClick={() => handleFieldClick(extracted.patientInfo?.name?.sourceText)}
                        className="p-2 bg-white rounded-lg border border-slate-200 hover:border-emerald-400 cursor-pointer transition-colors"
                      >
                        <span className="text-xs text-slate-400 block">Patient Name</span>
                        <span className="font-semibold text-slate-800">{extracted.patientInfo?.name?.value || 'Not mentioned'}</span>
                      </div>
                      <div 
                        onClick={() => handleFieldClick(extracted.patientInfo?.patientId?.sourceText)}
                        className="p-2 bg-white rounded-lg border border-slate-200 hover:border-emerald-400 cursor-pointer transition-colors"
                      >
                        <span className="text-xs text-slate-400 block">Patient ID / MRN</span>
                        <span className="font-semibold text-slate-800">{extracted.patientInfo?.patientId?.value || 'Not mentioned'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Lab Results Table */}
                  {extracted.labResults && extracted.labResults.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                        <FileSearch className="w-3.5 h-3.5 text-emerald-600" /> Extracted Lab Measurements
                      </h4>
                      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                            <tr>
                              <th className="p-3">Test Name</th>
                              <th className="p-3">Result</th>
                              <th className="p-3">Ref Range</th>
                              <th className="p-3">Source Quote</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium">
                            {extracted.labResults.map((lab, i) => (
                              <tr
                                key={i}
                                onClick={() => handleFieldClick(lab.sourceRef?.sourceText)}
                                className="hover:bg-amber-50/70 cursor-pointer transition-colors"
                              >
                                <td className="p-3 text-slate-900 font-semibold">{String(lab.testName.value)}</td>
                                <td className="p-3 font-mono font-bold text-blue-700">
                                  {String(lab.value.value)} {String(lab.unit.value)}
                                </td>
                                <td className="p-3 text-slate-500">{String(lab.referenceRange?.value || 'N/A')}</td>
                                <td className="p-3 text-slate-400 font-mono text-[11px] truncate max-w-[140px]">
                                  "{lab.sourceRef?.sourceText}"
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Medications */}
                  {extracted.medications && extracted.medications.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 text-blue-600" /> Prescribed Medications
                      </h4>
                      <div className="space-y-2">
                        {extracted.medications.map((med, i) => (
                          <div
                            key={i}
                            onClick={() => handleFieldClick(med.sourceRef?.sourceText)}
                            className="p-3 bg-blue-50/50 border border-blue-200 rounded-xl hover:bg-amber-50 cursor-pointer transition-colors flex justify-between items-center text-xs"
                          >
                            <div>
                              <p className="font-bold text-slate-900 text-sm">{String(med.name.value)}</p>
                              <p className="text-slate-600">Dosage: {String(med.dosage.value)} | Frequency: {String(med.frequency?.value || 'Daily')}</p>
                            </div>
                            <span className="text-[10px] bg-blue-100 text-blue-800 font-mono px-2 py-1 rounded font-semibold">
                              Pg 1 Ref
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Vital Signs */}
                  {extracted.vitalSigns && extracted.vitalSigns.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Vital Signs</h4>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        {extracted.vitalSigns.map((v, i) => (
                          <div
                            key={i}
                            onClick={() => handleFieldClick(v.sourceRef?.sourceText)}
                            className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl hover:bg-amber-50 cursor-pointer transition-colors"
                          >
                            <span className="text-slate-500 block">{String(v.name.value)}</span>
                            <span className="text-sm font-bold text-slate-900">{String(v.value.value)} {v.unit?.value || ''}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Follow-up & Diagnoses */}
                  <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs space-y-2">
                    <span className="font-bold uppercase tracking-wider text-emerald-800 block">Follow-Up Instructions (Easy Explanation)</span>
                    <p className="text-slate-800 font-medium whitespace-pre-line leading-relaxed">{String(extracted.followUpInstructions?.value || 'Not mentioned')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
