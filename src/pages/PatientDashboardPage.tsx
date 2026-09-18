import React from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { 
  GitCommitHorizontal, 
  Pill, 
  Heart,
  Eye
} from 'lucide-react';

export const PatientDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { events, documents, openDocumentViewer } = useData();

  const patientEvents = events.filter(e => e.patientId === (user?.patientId || 'PT-1024') || e.patientId === 'P-10042');
  const patientDocs = documents.filter(d => d.patientId === (user?.patientId || 'PT-1024') || d.patientId === 'P-10042');

  return (
    <div className="space-y-6 animate-fade-in pb-12 font-sans select-none">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
            <Heart className="w-7 h-7 text-teal-600" />
            Patient Health Workspace
          </h1>
          <p className="text-sm font-medium text-slate-500">
            View personal medical profile and authorized chronological history
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-xl text-xs font-bold font-mono">
            PATIENT ID: {user?.patientId || 'PT-1024'}
          </span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 lg:p-8 text-white shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500 text-white font-black text-lg flex items-center justify-center shadow-lg">
              {user?.name.slice(0, 2).toUpperCase() || 'AK'}
            </div>
            <div>
              <h2 className="text-2xl font-black">{user?.name || 'Arun Kumar'}</h2>
              <p className="text-xs text-teal-300 font-semibold font-mono">Registered Email: {user?.email}</p>
            </div>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed max-w-xl">
            Welcome to MedTrace. Your medical documents are continuously processed into a unified, traceable timeline for easy review with your physician.
          </p>
        </div>

        <div className="bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-xs space-y-2 text-xs">
          <span className="font-extrabold uppercase tracking-wider text-teal-400 block">Attending Physician</span>
          <p className="font-bold text-base text-white">Dr. Sarah Jenkins, MD</p>
          <p className="text-slate-300">MedTrace Primary Care Clinic</p>
          <p className="text-[11px] text-teal-300 font-mono pt-1">Next Follow-Up: 18 Sep 2026</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <GitCommitHorizontal className="w-5 h-5 text-teal-600" />
              My Chronological Medical History
            </h3>
            <span className="text-xs font-mono font-bold text-slate-500">{patientEvents.length} Events</span>
          </div>

          <div className="space-y-4">
            {patientEvents.map(evt => {
              const matchingDoc = patientDocs.find(d => d.id === evt.documentId);
              return (
                <div key={evt.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-md">
                      {evt.eventDate} {evt.eventTime ? `• ${evt.eventTime}` : ''}
                    </span>
                    <span className="font-extrabold text-slate-400 uppercase tracking-wider text-[10px]">{evt.eventType}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{evt.title}</h4>
                  <p className="text-xs text-slate-600">{evt.description}</p>

                  {matchingDoc && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => openDocumentViewer(matchingDoc, evt.sourcePage, evt.sourceText)}
                        className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-teal-600" />
                        <span>View Verified Source Document ({evt.sourceDocumentName})</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Pill className="w-5 h-5 text-purple-600" />
            Active Prescriptions
          </h3>

          <div className="space-y-3">
            <div className="p-3.5 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-1">
              <span className="font-extrabold text-purple-900 text-sm block">Metformin HCl 500 mg</span>
              <p className="text-xs text-purple-800 font-semibold">Dosage: 1 Tablet Twice Daily with Meals</p>
              <p className="text-[11px] text-slate-500 font-mono">Prescribed by Dr. Sarah Jenkins</p>
            </div>

            <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-1">
              <span className="font-extrabold text-blue-900 text-sm block">Amlodipine Besylate 5 mg</span>
              <p className="text-xs text-blue-800 font-semibold">Dosage: 1 Tablet Daily in Morning</p>
              <p className="text-[11px] text-slate-500 font-mono">Prescribed by Dr. Sarah Jenkins</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
