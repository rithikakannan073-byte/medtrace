import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Search as SearchIcon, 
  Activity, 
  FileText, 
  FlaskConical, 
  FileCode,
  Sparkles
} from 'lucide-react';

export const SearchPage: React.FC = () => {
  const { searchMedicalRecords, openDocumentViewer, documents } = useData();
  const [query, setQuery] = useState('hemoglobin');

  const results = searchMedicalRecords(query);

  const sampleKeywords = ['hemoglobin', 'prescription', 'September 2026', 'blood test', 'Amlodipine', 'X-Ray'];

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-5xl mx-auto font-sans select-none">
      {/* Header */}
      <div className="space-y-1 border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
          <SearchIcon className="w-7 h-7 text-emerald-600" />
          Global Medical History Search
        </h1>
        <p className="text-sm font-medium text-slate-500">
          Search across clinical events, lab tests, prescriptions, and original source documents
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="relative">
          <SearchIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type search terms e.g. hemoglobin, blood test, Amlodipine..."
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-inner"
          />
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-400 font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Quick Searches:
          </span>
          {sampleKeywords.map(kw => (
            <button
              key={kw}
              onClick={() => setQuery(kw)}
              className="px-3 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-bold rounded-xl transition-colors border border-slate-200/70 cursor-pointer"
            >
              "{kw}"
            </button>
          ))}
        </div>
      </div>

      {/* Results Output Section */}
      {!query.trim() ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500 text-xs font-semibold">
          Enter a medical keyword, test name, medication, or date above to search records.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Matched Events */}
          {results.events.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" /> Matching Timeline Events ({results.events.length})
              </h3>
              <div className="space-y-2">
                {results.events.map(evt => {
                  const matchingDoc = documents.find(d => d.id === evt.documentId);
                  return (
                    <div key={evt.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-emerald-700 mr-2">{evt.eventDate}</span>
                        <span className="font-bold text-slate-900">{evt.title}</span>
                        <p className="text-slate-500 line-clamp-1 mt-0.5">{evt.description}</p>
                      </div>
                      {matchingDoc && (
                        <button
                          onClick={() => openDocumentViewer(matchingDoc, evt.sourcePage, evt.sourceText)}
                          className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                        >
                          <FileCode className="w-3.5 h-3.5" />
                          <span>View Source</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Matched Lab Results */}
          {results.labResults.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-blue-600" /> Matching Lab Measurements ({results.labResults.length})
              </h3>
              <div className="space-y-2">
                {results.labResults.map((lab, i) => (
                  <div key={i} className="p-3.5 bg-blue-50/50 rounded-2xl border border-blue-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{lab.testName}</span>
                      <span className="font-mono font-bold text-blue-700 ml-3">{lab.result} {lab.unit}</span>
                      <span className="text-slate-500 block">Date: {lab.date} | Doc: {lab.documentName}</span>
                    </div>
                    <button
                      onClick={() => {
                        const doc = documents.find(d => d.id === lab.documentId);
                        if (doc) openDocumentViewer(doc);
                      }}
                      className="px-3 py-1.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      <span>View Source</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Source Documents */}
          {results.documents.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" /> Matching Source Documents ({results.documents.length})
              </h3>
              <div className="space-y-2">
                {results.documents.map(doc => (
                  <div key={doc.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900">{doc.fileName}</span>
                      <span className="text-slate-500 block">Uploaded: {new Date(doc.uploadDate).toLocaleDateString()} | Type: {doc.documentType}</span>
                    </div>
                    <button
                      onClick={() => openDocumentViewer(doc)}
                      className="px-3 py-1.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      <span>View Document</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
