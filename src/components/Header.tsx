import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import type { UserRole } from '../types';
import { 
  Search, 
  Bell, 
  User as UserIcon, 
  LogOut, 
  RotateCcw, 
  CheckCircle,
  FileText,
  Activity,
  Menu,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  onNavigate: (page: string) => void;
  activePage?: string;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, onToggleSidebar }) => {
  const { user, role, switchRole, logout } = useAuth();
  const { searchMedicalRecords, resetToDemoDataset, openDocumentViewer } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const searchResults = searchQuery.trim() ? searchMedicalRecords(searchQuery) : null;
  const hasResults = searchResults && (
    (searchResults.patients && searchResults.patients.length > 0) ||
    (searchResults.events && searchResults.events.length > 0) || 
    (searchResults.documents && searchResults.documents.length > 0)
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSearchDropdown(true);
  };

  const handleSelectSearchResult = (type: string, item: any) => {
    setShowSearchDropdown(false);
    setSearchQuery('');

    if (type === 'patient') {
      onNavigate('doctor-patient-record');
    } else if (type === 'event') {
      onNavigate('timeline');
    } else if (type === 'document') {
      openDocumentViewer(item);
    }
  };

  const getRoleBadgeLabel = (r: UserRole) => {
    switch (r) {
      case 'ADMIN': return 'Hospital Admin';
      case 'DOCTOR': return 'Doctor Workspace';
      case 'REGISTRATION_STAFF': return 'Registration Staff';
      case 'MEDICAL_RECORDS_STAFF': return 'Medical Records Staff';
      case 'PATIENT': return 'Patient Workspace';
      default: return r;
    }
  };

  const getUserInitials = (name: string) => {
    if (!name) return 'MT';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleSidebar} 
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Toggle navigation drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div 
          onClick={() => onNavigate('dashboard')} 
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-blue-600 flex items-center justify-center shadow-sm text-white font-bold">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight leading-none">
              <span className="text-emerald-600">med</span>
              <span className="text-blue-600">trace</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mt-0.5">
              Healthcare Intelligence
            </span>
          </div>
        </div>
      </div>

      <div className="relative flex-1 max-w-md mx-4 hidden sm:block">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setShowSearchDropdown(true)}
            placeholder="Search patient, ID, lab report, diagnosis..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
          />
        </div>

        {showSearchDropdown && searchResults && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 max-h-96 overflow-y-auto z-50 animate-fade-in p-2">
            {!hasResults ? (
              <div className="p-4 text-center text-xs text-slate-500">
                No matching patients or medical records found for "{searchQuery}"
              </div>
            ) : (
              <div className="space-y-3">
                {searchResults.patients && searchResults.patients.length > 0 && (
                  <div>
                    <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Matching Patients</div>
                    {searchResults.patients.slice(0, 3).map(p => (
                      <div
                        key={p.id}
                        onClick={() => handleSelectSearchResult('patient', p)}
                        className="px-3 py-2 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <UserIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-bold text-slate-800">{p.name}</span>
                          <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{p.patientId}</span>
                        </div>
                        <span className="text-[10px] text-slate-500">{p.medicalCondition}</span>
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.events.length > 0 && (
                  <div>
                    <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Timeline Events</div>
                    {searchResults.events.slice(0, 3).map(evt => (
                      <div
                        key={evt.id}
                        onClick={() => handleSelectSearchResult('event', evt)}
                        className="px-3 py-2 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-blue-600 shrink-0" />
                          <span className="font-semibold text-slate-800 truncate">{evt.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{evt.eventDate}</span>
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.documents.length > 0 && (
                  <div>
                    <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Medical Documents</div>
                    {searchResults.documents.slice(0, 3).map(doc => (
                      <div
                        key={doc.id}
                        onClick={() => handleSelectSearchResult('document', doc)}
                        className="px-3 py-2 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-teal-600 shrink-0" />
                          <span className="font-medium text-slate-800 truncate">{doc.fileName}</span>
                        </div>
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-mono font-bold">
                          {doc.documentType}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={resetToDemoDataset}
          title="Reset dataset to demo state"
          className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset Demo</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 transition-colors cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{getRoleBadgeLabel(role)}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 p-1.5 z-50 animate-fade-in">
              <div className="px-3 py-1.5 text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">
                Switch Active Role
              </div>
              <button
                onClick={() => { switchRole('DOCTOR'); setShowRoleDropdown(false); onNavigate('dashboard'); }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between ${role === 'DOCTOR' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                <span>Doctor Workspace</span>
                {role === 'DOCTOR' && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
              </button>
              <button
                onClick={() => { switchRole('ADMIN'); setShowRoleDropdown(false); onNavigate('admin-dashboard'); }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between ${role === 'ADMIN' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                <span>Hospital Admin</span>
                {role === 'ADMIN' && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
              </button>
              <button
                onClick={() => { switchRole('REGISTRATION_STAFF'); setShowRoleDropdown(false); onNavigate('registration-patients'); }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between ${role === 'REGISTRATION_STAFF' ? 'bg-purple-50 text-purple-700 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                <span>Registration Staff</span>
                {role === 'REGISTRATION_STAFF' && <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />}
              </button>
              <button
                onClick={() => { switchRole('MEDICAL_RECORDS_STAFF'); setShowRoleDropdown(false); onNavigate('medical-records-dashboard'); }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between ${role === 'MEDICAL_RECORDS_STAFF' ? 'bg-amber-50 text-amber-700 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                <span>Medical Records Staff</span>
                {role === 'MEDICAL_RECORDS_STAFF' && <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />}
              </button>
              <button
                onClick={() => { switchRole('PATIENT'); setShowRoleDropdown(false); onNavigate('patient-dashboard'); }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between ${role === 'PATIENT' ? 'bg-teal-50 text-teal-700 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                <span>Patient Portal</span>
                {role === 'PATIENT' && <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />}
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl relative transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Hospital Notifications</span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md">Live</span>
              </div>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="p-2.5 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-800">5 Documents Processed</p>
                    <p className="text-slate-600 text-[11px]">Timeline updated with 100% source traceability.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-9 h-9 rounded-xl border border-slate-200 object-cover shadow-2xs"
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
                {getUserInitials(user?.name || '')}
              </div>
            )}
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 leading-tight">
                {user?.name}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {user?.userId}
              </span>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-fade-in">
              <div className="px-3 py-2.5 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 rounded-md text-slate-700">
                    {role}
                  </span>
                </div>
              </div>
              <button
                onClick={() => { setShowProfileMenu(false); onNavigate('settings'); }}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <UserIcon className="w-4 h-4 text-slate-500" />
                Account & Settings
              </button>
              <button
                onClick={() => { setShowProfileMenu(false); logout(); }}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
