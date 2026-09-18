import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  UploadCloud, 
  GitCommitHorizontal, 
  Network, 
  FolderArchive, 
  Search, 
  Settings, 
  Users, 
  ListChecks, 
  ShieldCheck, 
  UserPlus, 
  FileCheck2, 
  Stethoscope, 
  LogOut, 
  Pill 
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activePage, 
  onNavigate, 
  isOpenMobile = false,
  onCloseMobile 
}) => {
  const { role, user, logout } = useAuth();

  const getNavForRole = () => {
    switch (role) {
      case 'ADMIN':
        return [
          { id: 'admin-dashboard', label: 'Hospital Overview', icon: LayoutDashboard },
          { id: 'admin-users', label: 'Staff & Patients', icon: Users },
          { id: 'admin-medicines', label: 'Medicine Inventory', icon: Pill },
          { id: 'admin-audit', label: 'Audit Logs', icon: ShieldCheck },
        ];
      case 'DOCTOR':
        return [
          { id: 'dashboard', label: "Doctor Workspace", icon: Stethoscope },
          { id: 'doctor-appointments', label: "Today's Appointments", icon: ListChecks },
          { id: 'doctor-patients', label: 'Patient Medical Record', icon: GitCommitHorizontal },
          { id: 'search', label: 'Patient Search', icon: Search },
        ];
      case 'REGISTRATION_STAFF':
        return [
          { id: 'registration-patients', label: 'Patient Registration', icon: UserPlus },
          { id: 'registration-list', label: 'Registered Patients', icon: Users },
        ];
      case 'MEDICAL_RECORDS_STAFF':
        return [
          { id: 'medical-records-dashboard', label: 'Medical Records Hub', icon: FileCheck2 },
          { id: 'upload', label: 'Upload Documents', icon: UploadCloud },
          { id: 'documents', label: 'Document Library', icon: FolderArchive },
          { id: 'relationships', label: 'Multi-Doc Linking', icon: Network },
        ];
      case 'PATIENT':
      default:
        return [
          { id: 'patient-dashboard', label: 'Personal Dashboard', icon: LayoutDashboard },
          { id: 'timeline', label: 'Medical Timeline', icon: GitCommitHorizontal },
          { id: 'documents', label: 'My Documents', icon: FolderArchive },
        ];
    }
  };

  const currentNav = getNavForRole();

  const handleNavClick = (id: string) => {
    onNavigate(id);
    if (onCloseMobile) onCloseMobile();
  };

  const getUserInitials = (name: string) => {
    if (!name) return 'MT';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <>
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-40 transform transition-transform duration-200 ease-in-out flex flex-col justify-between select-none ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-6 overflow-y-auto">
          <div className="md:hidden flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-lg font-black tracking-tight">
              <span className="text-emerald-600">med</span>
              <span className="text-blue-600">trace</span>
            </span>
          </div>

          <div className="px-3">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              {role.replace('_', ' ')} Navigation
            </span>
          </div>

          <nav className="space-y-1">
            {currentNav.map(item => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/60 shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-3 border-t border-slate-200 bg-slate-50/50 space-y-2">
          <div className="p-2 bg-white rounded-xl border border-slate-200 flex items-center gap-2.5">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-8 h-8 rounded-lg object-cover border border-slate-200"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white font-bold text-xs flex items-center justify-center">
                {getUserInitials(user?.name || '')}
              </div>
            )}
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-800 truncate">{user?.name}</span>
              <span className="text-[10px] text-slate-400 font-mono truncate">{user?.role}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1 text-xs">
            <button
              onClick={() => handleNavClick('settings')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 font-semibold text-slate-700 transition-colors cursor-pointer ${
                activePage === 'settings' ? 'bg-blue-50 border-blue-200 text-blue-700' : ''
              }`}
            >
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              <span>Settings</span>
            </button>
            <button
              onClick={logout}
              className="flex items-center justify-center gap-1.5 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 font-semibold text-rose-700 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
