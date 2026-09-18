import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2 text-xs md:text-sm flex items-center justify-center gap-2 font-medium shrink-0">
      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
      <span>
        <strong>Hackathon Prototype Disclaimer:</strong> MedTrace organizes information from medical documents and does not provide medical diagnosis or treatment advice.
      </span>
    </div>
  );
};
