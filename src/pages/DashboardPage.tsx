import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import type { Appointment } from '../types';
import { 
  Stethoscope, 
  Calendar, 
  Search, 
  ArrowRight, 
  Clock, 
  Activity
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (page: string, patientId?: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { appointments, patients } = useData();
  const { user } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPatients = searchQuery.trim()
    ? patients.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.phone.includes(searchQuery) ||
        p.medicalCondition.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : patients;

  const getStatusBadgeClass = (status: Appointment['status']) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Waiting':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 font-sans select-none">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
            <Stethoscope className="w-7 h-7 text-blue-600" />
            Doctor Workspace
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Today's patient care overview
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold font-mono">
            {user?.name || 'Dr. Sarah Jenkins, MD'}
          </span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 rounded-3xl text-white shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold flex items-center gap-2 text-emerald-400">
              <Search className="w-5 h-5 text-emerald-400" />
              Doctor Patient Search
            </h2>
            <p className="text-xs text-slate-300">
              Lookup authorized patient medical timelines by Name, Patient ID (e.g. PT-1024), or Phone.
            </p>
          </div>
        </div>

        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by patient name (e.g. Arun Kumar), ID (PT-1024), or phone number..."
            className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-sm font-semibold text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all"
          />
        </div>

        {searchQuery.trim() && (
          <div className="space-y-2 pt-2 animate-fade-in">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 block">
              Matching Patient Results ({filteredPatients.length})
            </span>
            {filteredPatients.length === 0 ? (
              <div className="p-4 bg-white/5 rounded-2xl text-xs text-slate-400 text-center">
                No matching patients found for "{searchQuery}"
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredPatients.map(p => (
                  <div
                    key={p.id}
                    onClick={() => onNavigate('doctor-patients')}
                    className="p-3.5 bg-white text-slate-900 rounded-2xl hover:ring-2 hover:ring-emerald-500 cursor-pointer transition-all space-y-1 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-slate-900">{p.name}</span>
                      <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                        {p.patientId}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">{p.medicalCondition}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100 mt-2">
                      <span>Age: {p.age} ({p.gender})</span>
                      <span className="text-blue-600 font-bold flex items-center gap-0.5">
                        View Record <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-slate-900 uppercase">
                TODAY'S APPOINTMENTS
              </h2>
              <p className="text-xs font-medium text-slate-500">
                Scheduled consultations for 18 Sep 2026
              </p>
            </div>
          </div>
          <span className="text-xs font-bold font-mono px-3 py-1 bg-slate-100 text-slate-700 rounded-xl">
            {appointments.length} Total
          </span>
        </div>

        <div className="space-y-3">
          {appointments.map((apt: Appointment) => (
            <div
              key={apt.id}
              className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 hover:border-blue-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center justify-center bg-white px-3.5 py-2 rounded-xl border border-slate-200 shrink-0">
                  <Clock className="w-4 h-4 text-blue-600 mb-0.5" />
                  <span className="text-xs font-extrabold text-slate-900 font-mono">{apt.time}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900">{apt.patientName}</h3>
                    <span className="text-[10px] font-mono font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md">
                      {apt.patientId}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Appointment Type: {apt.type}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-200">
                <span className={`px-3 py-1 text-xs font-extrabold rounded-xl border ${getStatusBadgeClass(apt.status)}`}>
                  {apt.status}
                </span>

                <button
                  onClick={() => onNavigate('doctor-patients')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Open Patient Record</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
