import React from 'react';
import { useData } from '../context/DataContext';
import { RelationshipCard } from '../components/RelationshipCard';
import { Network, Sparkles } from 'lucide-react';

export const RelationshipGraphPage: React.FC = () => {
  const { relationships, events, documents, openDocumentViewer } = useData();

  const handleSelectEvent = (eventId: string) => {
    const evt = events.find(e => e.id === eventId);
    if (!evt) return;
    const doc = documents.find(d => d.id === evt.documentId);
    if (doc) {
      openDocumentViewer(doc, evt.sourcePage, evt.sourceText);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 font-sans select-none">
      {/* Header */}
      <div className="space-y-1 border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
          <Network className="w-7 h-7 text-blue-600" />
          Multi-Document Relationship Graph & Medical Lineage
        </h1>
        <p className="text-sm font-medium text-slate-500">
          Visualizing how consultations, prescriptions, lab panels, and imaging findings link together across documents
        </p>
      </div>

      {/* Banner */}
      <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl flex items-start gap-3 shadow-md">
        <Sparkles className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <span className="font-bold text-blue-300 block">AI Evidence Linkage Rule</span>
          <p className="text-slate-300 leading-relaxed">
            MedTrace connects events only when there is explicit source evidence referencing matching medical conditions, medications, tests, or clinical appointments.
          </p>
        </div>
      </div>

      {/* Relationship Cards Grid */}
      <div className="space-y-4">
        {relationships.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500 text-xs font-semibold">
            No event relationships detected yet. Upload more documents to construct cross-record linkages.
          </div>
        ) : (
          relationships.map(rel => (
            <RelationshipCard
              key={rel.id}
              relationship={rel}
              events={events}
              onSelectEvent={handleSelectEvent}
            />
          ))
        )}
      </div>
    </div>
  );
};
