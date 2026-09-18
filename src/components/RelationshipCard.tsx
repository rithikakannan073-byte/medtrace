import type { EventRelationship, MedicalEvent } from '../types';
import { Network, ArrowDown, ArrowRight, ShieldCheck } from 'lucide-react';

interface RelationshipCardProps {
  relationship: EventRelationship;
  events: MedicalEvent[];
  onSelectEvent?: (eventId: string) => void;
}

export const RelationshipCard: React.FC<RelationshipCardProps> = ({ 
  relationship, 
  events,
  onSelectEvent 
}) => {
  const sourceEvent = events.find(e => e.id === relationship.sourceEventId);
  const targetEvent = events.find(e => e.id === relationship.targetEventId);

  if (!sourceEvent || !targetEvent) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
            <Network className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {relationship.relationshipType.replace('_', ' ')}
          </span>
        </div>
        <span className="text-xs font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-semibold border border-emerald-200/50">
          {(relationship.confidence * 100).toFixed(0)}% Confidence
        </span>
      </div>

      {/* Visual Flow Tree */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
        {/* Source Event Card */}
        <div 
          onClick={() => onSelectEvent && onSelectEvent(sourceEvent.id)}
          className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-emerald-400 cursor-pointer transition-colors shadow-2xs space-y-1"
        >
          <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">{sourceEvent.eventDate}</span>
          <p className="text-sm font-bold text-slate-900 line-clamp-1">{sourceEvent.title}</p>
          <span className="inline-block text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">
            {sourceEvent.eventType}
          </span>
        </div>

        {/* Directional Connector Arrow */}
        <div className="flex flex-col items-center justify-center text-blue-600 my-1 md:my-0">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shadow-xs">
            <ArrowRight className="w-4 h-4 hidden md:block" />
            <ArrowDown className="w-4 h-4 md:hidden" />
          </div>
        </div>

        {/* Target Event Card */}
        <div 
          onClick={() => onSelectEvent && onSelectEvent(targetEvent.id)}
          className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 cursor-pointer transition-colors shadow-2xs space-y-1"
        >
          <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">{targetEvent.eventDate}</span>
          <p className="text-sm font-bold text-slate-900 line-clamp-1">{targetEvent.title}</p>
          <span className="inline-block text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">
            {targetEvent.eventType}
          </span>
        </div>
      </div>

      {/* Evidence Callout required by rule #10 */}
      <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/60 text-xs text-emerald-950 flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-emerald-900 font-bold block mb-0.5">Relationship detected from source documents:</strong>
          {relationship.evidence}
        </p>
      </div>
    </div>
  );
};
