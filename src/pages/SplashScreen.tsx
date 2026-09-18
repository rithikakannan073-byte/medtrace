import React, { useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center z-50 text-white p-4 select-none">
      <div className="text-center space-y-6 max-w-md w-full px-6">
        {/* Animated MedTrace Logo Badge */}
        <div className="relative mx-auto w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-600 to-blue-600 flex items-center justify-center text-5xl font-black shadow-2xl ring-4 ring-white/10">
          <ShieldCheck className="w-12 h-12 text-white" />
          <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
        </div>

        {/* Title & Tagline */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            <span className="text-emerald-400">med</span>
            <span className="text-blue-400">trace</span>
          </h1>
          <p className="text-sm font-medium text-slate-300 tracking-wide">
            Connecting Every Medical Record
          </p>
        </div>

        {/* Progress Loading Animation */}
        <div className="pt-6 max-w-xs mx-auto space-y-3">
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden p-0.5">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full animate-[pulse_1.5s_infinite] w-full" />
          </div>
          <p className="text-xs text-slate-400 font-mono tracking-wider">
            Securing Workspace Environment...
          </p>
        </div>
      </div>
    </div>
  );
};
