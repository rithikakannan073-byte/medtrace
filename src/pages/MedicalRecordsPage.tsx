import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import type { EventType } from '../types';
import { 
  GitCommitHorizontal, 
  Filter, 
  ArrowUpDown, 
  ShieldCheck, 
  Eye, 
  Building2 
} from 'lucide-react';

export const MedicalRecordsPage: React.FC = () => {
  const { patients, events, documents, openDocumentViewer } = useData();

  const [selectedPatientId, setSelectedPatientId] = useState<string>('PT-1024');
  const currentPatient = patients.find(p => p.patientId === selectedPatientId) || patients[0];
  
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [sortOrder, setSortOrder] = useState<'NEWEST' | 'OLDEST'>('NEWEST');

  const getFilteredEvents = () => {
    let filtered = events.filter(e => e.patientId === currentPatient.patientId);

    if (filterCategory !== 'ALL') {
      filtered = filtered.filter(e => {
        if (filterCategory === 'CONSULTATIONS') return e.eventType === 'DOCTOR_VISIT';
        if (filterCategory === 'DIAGNOSES') return e.eventType === 'DOCTOR_VISIT' || e.eventType === 'DISCHARGE';
        if (filterCategory === 'MEDICATIONS') return e.eventType === 'PRESCRIPTION';
        if (filterCategory === 'LAB_RESULTS') return e.eventType === 'LAB_RESULT';
        if (filterCategory === 'PROCEDURES') return e.eventType === 'PROCEDURE';
        if (filterCategory === 'IMAGING') return e.eventType === 'IMAGING';
        if (filterCategory === 'DISCHARGE') return e.eventType === 'DISCHARGE';
        return true;
      });
    }

    return filtered.sort((a, b) => {
      const timeA = new Date(a.eventDate).getTime();
      const timeB = new Date(b.eventDate).getTime();
      return sortOrder === 'NEWEST' ? timeB - timeA : timeA - timeB;
    });
  };

  const timelineEvents = getFilteredEvents();

  const getEventBadgeColor = (type: EventType) => {
    switch (type) {
      case 'LAB_RESULT': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'PRESCRIPTION': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'DOCTOR_VISIT': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'DISCHARGE': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'IMAGING': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'PROCEDURE': return 'bg-teal-100 text-teal-800 border-teal-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 font-sans select-none">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 lg:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentPatient.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256'}
            alt={currentPatient.name}
            className="w-16 h-16 rounded-2xl border-2 border-emerald-400 object-cover shadow-lg"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black">{currentPatient.name}</h1>
              <span className="text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-lg">
                {currentPatient.patientId}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium flex items-center gap-3 flex-wrap">
              <span>Age: {currentPatient.age} ({currentPatient.gender})</span>
              <span>•</span>
              <span>Phone: {currentPatient.phone}</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">Condition: {currentPatient.medicalCondition}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-300 bg-white/10 px-3.5 py-2 rounded-xl border border-white/10">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verified Master Patient Record</span>
          </div>

          <select
            value={selectedPatientId}
            onChange={e => setSelectedPatientId(e.target.value)}
            className="px-3 py-2 bg-white/10 text-white font-bold text-xs rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
          >
            {patients.map(p => (
              <option key={p.id} value={p.patientId} className="bg-slate-900 text-white">
                {p.name} ({p.patientId})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {[
            { id: 'ALL', label: 'All Events' },
            { id: 'CONSULTATIONS', label: 'Consultations' },
            { id: 'DIAGNOSES', label: 'Diagnoses' },
            { id: 'MEDICATIONS', label: 'Medications' },
            { id: 'LAB_RESULTS', label: 'Lab Results' },
            { id: 'PROCEDURES', label: 'Procedures' },
            { id: 'IMAGING', label: 'Imaging' },
            { id: 'DISCHARGE', label: 'Discharge' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                filterCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setSortOrder(prev => prev === 'NEWEST' ? 'OLDEST' : 'NEWEST')}
          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
          <span>Sort: {sortOrder === 'NEWEST' ? 'Newest First' : 'Oldest First'}</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <GitCommitHorizontal className="w-5 h-5 text-emerald-600" />
            Chronological Patient Medical Timeline
          </h2>
          <span className="text-xs text-slate-500 font-mono font-bold">
            {timelineEvents.length} Recorded Events
          </span>
        </div>

        {timelineEvents.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No medical records matched the selected category filter.
          </div>
        ) : (
          <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-8">
            {timelineEvents.map(evt => {
              const matchingDoc = documents.find(d => d.id === evt.documentId);

              return (
                <div key={evt.id} className="relative group">
                  <div className="absolute -left-[31px] top-1.5 w-5 h-5 rounded-full bg-white border-4 border-blue-600 shadow-xs" />

                  <div className="bg-slate-50/90 border border-slate-200/90 hover:border-blue-300 rounded-2xl p-5 space-y-4 transition-all shadow-2xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-bold text-xs text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                          {evt.eventDate} {evt.eventTime ? `• ${evt.eventTime}` : ''}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase border ${getEventBadgeColor(evt.eventType)}`}>
                          {evt.eventType.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>Source: <strong className="text-slate-800">{evt.sourceDocumentName}</strong></span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-base font-black text-slate-900">{evt.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{evt.description}</p>
                    </div>

                    {evt.keyDetails && evt.keyDetails.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs bg-white p-3 rounded-xl border border-slate-200/70">
                        {evt.keyDetails.map((detail, idx) => (
                          <div key={idx} className="space-y-0.5">
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                              {detail.label}
                            </span>
                            <span className="font-bold text-slate-900">{detail.value}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Confidence: {Math.round((evt.confidence || 0.95) * 100)}%</span>
                      </div>

                      {matchingDoc && (
                        <button
                          onClick={() => openDocumentViewer(matchingDoc, evt.sourcePage, evt.sourceText)}
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Source Document</span>
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
