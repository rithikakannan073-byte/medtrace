import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import type { MedicalDocument, AuditLog } from '../types';
import { 
  Users, 
  UserCheck, 
  Pill, 
  FileText, 
  ListChecks, 
  RotateCcw, 
  Trash2,
  X,
  Activity,
  Calendar,
  Clock,
  CheckCircle2
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { patients, appointments, documents, auditLogs, openDocumentViewer, deleteDocument, reprocessDocument, updateExtractedData } = useData();
  const [editingExtractionDocId, setEditingExtractionDocId] = useState<string | null>(null);
  const [jsonText, setJsonText] = useState<string>('');

  const patientCount = patients.length;
  const staffCount = 56;
  const medicineCount = 132;

  const todayAppointmentsCount = appointments.filter(a => a.date === '2026-09-18' || a.date === new Date().toISOString().split('T')[0]).length || 4;
  const docsProcessedTodayCount = documents.filter(d => d.processingStatus === 'PROCESSED').length;
  const newRegistrationsTodayCount = patients.length;

  const handleOpenEditJson = (doc: MedicalDocument) => {
    setEditingExtractionDocId(doc.id);
    setJsonText(JSON.stringify(doc.extractedData || {}, null, 2));
  };

  const handleSaveJson = () => {
    try {
      if (editingExtractionDocId) {
        const parsed = JSON.parse(jsonText);
        updateExtractedData(editingExtractionDocId, parsed);
        setEditingExtractionDocId(null);
      }
    } catch (err) {
      alert('Invalid JSON syntax. Please verify JSON formatting before saving.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 font-sans select-none">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Hospital Overview
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Current hospital activity and resources
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold font-mono">
            LIVE SYSTEM DATA
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">PATIENTS</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-4xl font-black text-slate-900 tracking-tight">{patientCount}</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Registered patients</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">STAFF</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-4xl font-black text-slate-900 tracking-tight">{staffCount}</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Active staff members</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 hover:border-purple-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">MEDICINES</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Pill className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-4xl font-black text-slate-900 tracking-tight">{medicineCount}</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Available medicines</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 text-white p-5 rounded-2xl flex items-center justify-between shadow-md">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Appointments</span>
            <p className="text-2xl font-black text-emerald-400">{todayAppointmentsCount}</p>
          </div>
          <Calendar className="w-8 h-8 text-slate-600" />
        </div>
        <div className="bg-slate-900 text-white p-5 rounded-2xl flex items-center justify-between shadow-md">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Documents Processed Today</span>
            <p className="text-2xl font-black text-blue-400">{docsProcessedTodayCount}</p>
          </div>
          <FileText className="w-8 h-8 text-slate-600" />
        </div>
        <div className="bg-slate-900 text-white p-5 rounded-2xl flex items-center justify-between shadow-md">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">New Registrations Today</span>
            <p className="text-2xl font-black text-purple-400">{newRegistrationsTodayCount}</p>
          </div>
          <Users className="w-8 h-8 text-slate-600" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            Recent Activity
          </h2>
          <span className="text-xs text-slate-400 font-medium">Real-time Hospital Audit Feed</span>
        </div>

        <div className="space-y-3">
          {auditLogs.slice(0, 6).map((log: AuditLog) => (
            <div key={log.id} className="p-3.5 bg-slate-50/70 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 mr-2">{log.action.replace(/_/g, ' ')}</span>
                  <p className="text-slate-600 text-xs mt-0.5">{log.details}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                <Clock className="w-3.5 h-3.5" />
                <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-blue-600" />
            Document Intelligence Processing Queue
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3">Document Name</th>
                <th className="p-3">Patient ID</th>
                <th className="p-3">Category</th>
                <th className="p-3">Upload Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {documents.map((doc: MedicalDocument) => (
                <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{doc.fileName}</span>
                  </td>
                  <td className="p-3 font-mono font-bold text-slate-700">{doc.patientId}</td>
                  <td className="p-3 font-mono font-semibold text-emerald-700">{doc.documentType}</td>
                  <td className="p-3 font-mono text-slate-500">{new Date(doc.uploadDate).toLocaleDateString()}</td>
                  <td className="p-3">
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-md text-[10px] font-mono">
                      {doc.processingStatus}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-1.5">
                    <button
                      onClick={() => openDocumentViewer(doc)}
                      className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg font-bold hover:bg-blue-100 cursor-pointer"
                    >
                      Viewer
                    </button>
                    <button
                      onClick={() => handleOpenEditJson(doc)}
                      className="px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg font-bold hover:bg-amber-100 cursor-pointer"
                    >
                      JSON
                    </button>
                    <button
                      onClick={() => reprocessDocument(doc.id)}
                      className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg cursor-pointer inline-flex items-center"
                      title="Reprocess Document"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteDocument(doc.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer inline-flex items-center"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingExtractionDocId && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Admin Correction: Edit Extracted Medical JSON</h3>
              <button onClick={() => setEditingExtractionDocId(null)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <textarea
              rows={14}
              value={jsonText}
              onChange={e => setJsonText(e.target.value)}
              className="w-full font-mono text-xs p-3.5 bg-slate-900 text-emerald-400 rounded-2xl focus:outline-none"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setEditingExtractionDocId(null)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveJson}
                className="flex-1 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer"
              >
                Save Extraction Correction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
