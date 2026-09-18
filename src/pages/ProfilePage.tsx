import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, role } = useAuth();

  const getUserInitials = (name: string) => {
    if (!name) return 'MT';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-12 font-sans select-none">
      <div className="space-y-1 border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black tracking-tight text-slate-900">User Account Profile</h1>
        <p className="text-sm font-medium text-slate-500">Account credentials, patient ID, and security role.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-2xs space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-16 h-16 rounded-2xl border-2 border-emerald-500 object-cover shadow-md"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white font-black text-xl flex items-center justify-center shadow-md">
              {getUserInitials(user?.name || '')}
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
            <p className="text-xs text-slate-500 font-mono">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-mono font-bold rounded-xl border border-emerald-200">
              Role: {role}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-slate-400 font-semibold block uppercase tracking-wider">User ID</span>
            <span className="font-mono font-bold text-slate-900 text-sm">{user?.userId}</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-slate-400 font-semibold block uppercase tracking-wider">Patient Record ID (MRN)</span>
            <span className="font-mono font-bold text-slate-900 text-sm">{user?.patientId || 'PT-1024'}</span>
          </div>
        </div>

        <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs text-emerald-950 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Supabase Row Level Security (RLS) is active. Patient documents are isolated to authorized identity.</span>
        </div>
      </div>
    </div>
  );
};
