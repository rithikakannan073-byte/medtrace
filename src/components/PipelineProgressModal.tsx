import React from 'react';
import { useData } from '../context/DataContext';
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react';

export const PipelineProgressModal: React.FC = () => {
  const { isProcessingUpload, pipelineProgress } = useData();

  if (!isProcessingUpload || !pipelineProgress) return null;

  const { stageIndex, stages } = pipelineProgress;

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-6">
        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Processing Medical Document</h3>
            <p className="text-xs text-slate-500">Executing 11-Stage AI Intelligence Pipeline...</p>
          </div>
        </div>

        {/* Pipeline Stage Checklist */}
        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
          {stages.map((stg, idx) => {
            const isCompleted = stg.status === 'COMPLETED';
            const isRunning = stg.status === 'RUNNING';

            return (
              <div
                key={stg.id}
                className={`p-2.5 rounded-xl text-xs flex items-center justify-between border transition-all ${
                  isRunning
                    ? 'bg-blue-50 border-blue-300 shadow-xs'
                    : isCompleted
                    ? 'bg-emerald-50/70 border-emerald-200'
                    : 'bg-slate-50 border-slate-100 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : isRunning ? (
                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 text-[10px] flex items-center justify-center font-mono text-slate-400">
                      {idx + 1}
                    </div>
                  )}

                  <div>
                    <p className={`font-bold ${isRunning ? 'text-blue-900' : isCompleted ? 'text-emerald-900' : 'text-slate-500'}`}>
                      {stg.name}
                    </p>
                    <p className="text-[11px] text-slate-500">{stg.description}</p>
                  </div>
                </div>

                <span className="font-mono text-[10px] uppercase font-bold text-slate-400">
                  {isCompleted ? 'OK' : isRunning ? 'Active' : 'Wait'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom Status Bar */}
        <div className="p-3 bg-slate-100 rounded-xl flex items-center justify-between text-xs text-slate-600 font-medium">
          <span>Overall Stage {stageIndex + 1} of 11</span>
          <span className="font-mono font-bold text-emerald-600">
            {Math.round(((stageIndex + 1) / 11) * 100)}% Complete
          </span>
        </div>
      </div>
    </div>
  );
};
