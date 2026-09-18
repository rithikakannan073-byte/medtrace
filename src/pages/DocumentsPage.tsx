import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import type { DocumentType } from '../types';
import { 
  FolderArchive, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Edit, 
  Trash2, 
  FileCode,
  X
} from 'lucide-react';

export const DocumentsPage: React.FC = () => {
  const { documents, openDocumentViewer, reclassifyDocument, deleteDocument } = useData();
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [newTypeSelection, setNewTypeSelection] = useState<DocumentType>('LAB_REPORT');

  const categories: DocumentType[] = [
    'LAB_REPORT',
    'PRESCRIPTION',
    'DISCHARGE_SUMMARY',
    'IMAGING_REPORT',
    'CLINICAL_NOTE',
    'OTHER'
  ];

  const handleOpenReclassify = (docId: string, currentType: DocumentType) => {
    setEditingDocId(docId);
    setNewTypeSelection(currentType);
  };

  const handleSaveReclassify = () => {
    if (editingDocId) {
      reclassifyDocument(editingDocId, newTypeSelection);
      setEditingDocId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 font-sans select-none">
      {/* Header */}
      <div className="space-y-1 border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
          <FolderArchive className="w-7 h-7 text-emerald-600" />
          Patient Document Repository
        </h1>
        <p className="text-sm font-medium text-slate-500">
          All uploaded source files stored securely in Supabase Storage with auto-classification confidence
        </p>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-4">Filename</th>
                <th className="p-4">Category Type</th>
                <th className="p-4">Confidence</th>
                <th className="p-4">Upload Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {documents.map(doc => {
                const isLowConfidence = doc.detectedTypeConfidence < 0.85;
                return (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{doc.fileName}</span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-xl font-mono font-bold border border-emerald-200/60">
                        {doc.documentType}
                      </span>
                    </td>
                    <td className="p-4 font-mono">
                      <span className={`inline-flex items-center gap-1 font-bold ${
                        isLowConfidence ? 'text-amber-600' : 'text-slate-700'
                      }`}>
                        {isLowConfidence && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                        {(doc.detectedTypeConfidence * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 font-mono">
                      {new Date(doc.uploadDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg font-bold text-[10px] font-mono">
                        {doc.processingStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => openDocumentViewer(doc)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <FileCode className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => handleOpenReclassify(doc.id, doc.documentType)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit Type</span>
                      </button>
                      <button
                        onClick={() => deleteDocument(doc.id)}
                        className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-xl transition-colors inline-block cursor-pointer"
                        title="Delete Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Category Reclassify Modal */}
      {editingDocId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Verify / Reclassify Document Category</h3>
              <button onClick={() => setEditingDocId(null)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Select the corrected document category. This will update classification records and AI event generation.
            </p>

            <div className="space-y-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setNewTypeSelection(cat)}
                  className={`w-full p-2.5 rounded-xl text-xs font-semibold text-left border flex items-center justify-between transition-all cursor-pointer ${
                    newTypeSelection === cat
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{cat}</span>
                  {newTypeSelection === cat && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </button>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setEditingDocId(null)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveReclassify}
                className="flex-1 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-700 shadow-md cursor-pointer"
              >
                Save Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
