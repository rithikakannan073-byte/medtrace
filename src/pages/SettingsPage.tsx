import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  User as UserIcon, 
  Building2, 
  ShieldCheck, 
  RotateCcw,
  CheckCircle2,
  Phone,
  MapPin,
  Info
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, role } = useAuth();
  const { resetToDemoDataset } = useData();
  
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'appearance' | 'account' | 'hospital' | 'security'>('appearance');

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12 font-sans select-none">
      <div className="space-y-1 border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
          <SettingsIcon className="w-7 h-7 text-blue-600" />
          Settings
        </h1>
        <p className="text-sm font-medium text-slate-500">
          Manage workspace preferences, hospital profile, account details, and security
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-2xs flex flex-wrap gap-1">
        <button
          onClick={() => setActiveTab('appearance')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'appearance' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Moon className="w-4 h-4" />
          <span>Appearance</span>
        </button>

        <button
          onClick={() => setActiveTab('account')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'account' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>Account</span>
        </button>

        <button
          onClick={() => setActiveTab('hospital')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'hospital' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Hospital</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'security' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Security</span>
        </button>
      </div>

      {activeTab === 'appearance' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 lg:p-8 shadow-2xs space-y-6">
          <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">Appearance Theme</h2>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                {darkMode ? <Moon className="w-4 h-4 text-purple-600" /> : <Sun className="w-4 h-4 text-amber-500" />}
                Dark Mode Theme
              </h3>
              <p className="text-xs text-slate-500 max-w-md">
                Switch MedTrace between clean light healthcare theme and low-light hospital night theme.
              </p>
            </div>

            <button
              onClick={toggleDarkMode}
              className={`w-14 h-8 rounded-full transition-colors p-1 cursor-pointer ${
                darkMode ? 'bg-purple-600' : 'bg-slate-300'
              }`}
            >
              <div className={`w-6 h-6 rounded-full bg-white transition-transform ${
                darkMode ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>
      )}

      {activeTab === 'account' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 lg:p-8 shadow-2xs space-y-6">
          <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">Account Details</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-slate-400 font-bold uppercase tracking-wider block">User Name</span>
              <span className="font-bold text-slate-900 text-sm">{user?.name || 'Dr. Sarah Jenkins, MD'}</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-slate-400 font-bold uppercase tracking-wider block">User ID</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{user?.userId || 'dr_jenkins'}</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-slate-400 font-bold uppercase tracking-wider block">Registered Email</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{user?.email || 'dr.jenkins@medtrace.health'}</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-slate-400 font-bold uppercase tracking-wider block">Assigned Role</span>
              <span className="font-mono font-bold text-blue-700 text-sm">{role}</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'hospital' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 lg:p-8 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-black text-slate-900">About the Hospital</h2>
            <p className="text-xs text-slate-500">Connected healthcare facility details</p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-slate-400 font-bold uppercase tracking-wider block">Hospital Name</span>
              <span className="font-bold text-slate-900 text-base">St. Jude Medical Center & Hospital</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider block flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" /> Hospital Address
                </span>
                <span className="font-semibold text-slate-800">100 Healthcare Boulevard, Suite 400</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider block flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" /> General Contact
                </span>
                <span className="font-mono font-bold text-slate-800">+1 (800) 555-TRACE</span>
              </div>
            </div>

            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-1">
              <span className="text-rose-900 font-extrabold uppercase tracking-wider block">Emergency Contact</span>
              <span className="font-mono font-bold text-rose-800 text-sm">911 / +1 (800) 555-9111</span>
            </div>

            <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-2xl space-y-1">
              <span className="text-blue-900 font-extrabold uppercase tracking-wider block flex items-center gap-1">
                <Info className="w-4 h-4 text-blue-600" /> Facility Profile Information
              </span>
              <p className="text-slate-700 leading-relaxed">
                St. Jude Medical Center is a premier multi-specialty regional hospital committed to patient-centered care and cutting-edge document intelligence traceability.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 lg:p-8 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-black text-slate-900">Security & Authentication Status</h2>
            <p className="text-xs text-slate-500">Security audit protocols & session information</p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <div>
                  <span className="font-bold text-emerald-900 text-sm block">Authentication Status Active</span>
                  <span className="text-emerald-700 text-xs">Row Level Security (RLS) & OTP Session Verified</span>
                </div>
              </div>
              <span className="font-mono text-[11px] font-bold bg-emerald-200 text-emerald-900 px-2.5 py-1 rounded-lg">SECURE</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider block">Last Login Timestamp</span>
                <span className="font-mono font-bold text-slate-900">{new Date().toLocaleString()}</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider block">Session Encryption</span>
                <span className="font-mono font-bold text-slate-900">TLS 1.3 / AES-256</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Demo Baseline Reset</h3>
                <p className="text-xs text-slate-500">Reset patient data context to initial state.</p>
              </div>
              <button
                onClick={resetToDemoDataset}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo Baseline</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
