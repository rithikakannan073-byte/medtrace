import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  GitCommitHorizontal, 
  Filter, 
  FileCode, 
  User, 
  Building2, 
  Network
} from 'lucide-react';

export const TimelinePage: React.FC = () => {
  const { events, documents, relationships, openDocumentViewer } = useData();
  
  const [selectedDocType, setSelectedDocType] = useState<string>('ALL');
  const [selectedEventType, setSelectedEventType] = useState<string>('ALL');
  const [searchDoctor, setSearchDoctor] = useState<string>('');

  const filteredEvents = events.filter(evt => {
    const matchingDoc = documents.find(d => d.id === evt.documentId);
    if (selectedDocType !== 'ALL' && matchingDoc?.documentType !== selectedDocType) {
      return false;
    }
    if (selectedEventType !== 'ALL' && evt.eventType !== selectedEventType) {
      return false;
    }
    if (searchDoctor.trim() && !evt.doctorName?.toLowerCase().includes(searchDoctor.toLowerCase())) {
      return false;
    }
    return true;
  });

  const groupedEventsByYear: { [year: string]: typeof events } = {};
  filteredEvents.forEach(evt => {
    const year = evt.eventDate.split('-')[0] || '2026';
    if (!groupedEventsByYear[year]) groupedEventsByYear[year] = [];
    groupedEventsByYear[year].push(evt);
  });

  const yearKeys = Object.keys(groupedEventsByYear).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="space-y-6 animate-fade-in pb-12 font-sans select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
            <GitCommitHorizontal className="w-7 h-7 text-emerald-600" />
            Patient Chronological Timeline
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Sorted strictly by clinical event date, providing full traceability back to source documents
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <Filter className="w-4 h-4 text-emerald-600" />
          <span>Timeline Filters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">Document Category</label>
            <select
              value={selectedDocType}
              onChange={e => setSelectedDocType(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="ALL">All Categories</option>
              <option value="LAB_REPORT">Laboratory Reports</option>
              <option value="PRESCRIPTION">Prescriptions</option>
              <option value="DISCHARGE_SUMMARY">Discharge Summaries</option>
              <option value="IMAGING_REPORT">Imaging Reports</option>
              <option value="CLINICAL_NOTE">Clinical Notes</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">Event Type</label>
            <select
              value={selectedEventType}
              onChange={e => setSelectedEventType(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="ALL">All Event Types</option>
              <option value="LAB_RESULT">Lab Results</option>
              <option value="PRESCRIPTION">Prescriptions</option>
              <option value="DOCTOR_VISIT">Doctor Visits</option>
              <option value="DISCHARGE">Discharges</option>
              <option value="IMAGING">Imaging Scans</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1 uppercase tracking-wider">Physician Name</label>
            <input
              type="text"
              placeholder="Search Dr. Jenkins..."
              value={searchDoctor}
              onChange={e => setSearchDoctor(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>
      </div>

      {yearKeys.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500 text-xs font-semibold">
          No medical timeline events match the selected filters.
        </div>
      ) : (
        <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 md:before:left-8 before:w-0.5 before:bg-slate-200">
          {yearKeys.map(year => (
            <div key={year} className="space-y-6 relative">
              <div className="inline-block relative z-10 px-4 py-1.5 rounded-full bg-slate-900 text-white font-mono font-bold text-xs shadow-md">
                Year {year}
              </div>

              <div className="space-y-6">
                {groupedEventsByYear[year].map(evt => {
                  const matchingDoc = documents.find(d => d.id === evt.documentId);
                  const relatedRels = relationships.filter(r => r.sourceEventId === evt.id || r.targetEventId === evt.id);

                  return (
                    <div key={evt.id} className="relative pl-8 md:pl-16 group">
                      <div className="absolute left-2 md:left-6 top-5 -translate-x-1/2 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-white shadow-xs group-hover:scale-125 transition-transform" />

                      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                              {evt.eventDate}
                            </span>
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                              {evt.eventType}
                            </span>
                          </div>

                          <span className="text-[11px] text-slate-400 font-mono">
                            Confidence Score: {(evt.confidence * 100).toFixed(0)}%
                          </span>
                        </div>

                        <div>
                          <h3 className="text-base font-bold text-slate-900">{evt.title}</h3>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{evt.description}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                          {evt.doctorName && (
                            <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 font-medium">
                              <User className="w-3.5 h-3.5 text-blue-600" /> {evt.doctorName}
                            </span>
                          )}
                          {evt.facilityName && (
                            <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 font-medium">
                              <Building2 className="w-3.5 h-3.5 text-emerald-600" /> {evt.facilityName}
                            </span>
                          )}
                        </div>

                        {evt.keyDetails.length > 0 && (
                          <div className="bg-slate-50/70 p-3 rounded-2xl border border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                            {evt.keyDetails.map((kd, idx) => (
                              <div key={idx}>
                                <span className="text-[10px] text-slate-400 block font-semibold uppercase">{kd.label}</span>
                                <span className="font-bold text-slate-800">{kd.value}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {relatedRels.length > 0 && (
                          <div className="p-2.5 bg-blue-50/70 border border-blue-200/70 rounded-xl text-xs text-blue-900 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 font-medium">
                              <Network className="w-4 h-4 text-blue-600 shrink-0" />
                              <span>{relatedRels[0].evidence}</span>
                            </div>
                          </div>
                        )}

                        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                          <span className="text-xs text-slate-400 font-mono">
                            Source: {evt.sourceDocumentName} (Pg {evt.sourcePage || 1})
                          </span>

                          {matchingDoc && (
                            <button
                              onClick={() => openDocumentViewer(matchingDoc, evt.sourcePage, evt.sourceText)}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                            >
                              <FileCode className="w-3.5 h-3.5" />
                              <span>View Source Document</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
