import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import { SplashScreen } from './pages/SplashScreen';
import { AuthPage } from './pages/AuthPage';

import { DisclaimerBanner } from './components/DisclaimerBanner';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DocumentViewerModal } from './components/DocumentViewerModal';
import { PipelineProgressModal } from './components/PipelineProgressModal';

import { DashboardPage } from './pages/DashboardPage';
import { RegistrationDashboardPage } from './pages/RegistrationDashboardPage';
import { MedicalRecordsDashboardPage } from './pages/MedicalRecordsDashboardPage';
import { PatientDashboardPage } from './pages/PatientDashboardPage';
import { UploadPage } from './pages/UploadPage';
import { RelationshipGraphPage } from './pages/RelationshipGraphPage';
import { MedicalRecordsPage } from './pages/MedicalRecordsPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { SearchPage } from './pages/SearchPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const { isAuthenticated, role } = useAuth();
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [activePage, setActivePage] = useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
      case 'doctor-appointments':
        return <DashboardPage onNavigate={setActivePage} />;
      case 'registration-patients':
      case 'registration-list':
        return <RegistrationDashboardPage />;
      case 'medical-records-dashboard':
        return <MedicalRecordsDashboardPage />;
      case 'patient-dashboard':
        return <PatientDashboardPage />;
      case 'upload':
        return <UploadPage onNavigate={setActivePage} />;
      case 'timeline':
      case 'doctor-patients':
        return <MedicalRecordsPage />;
      case 'relationships':
        return <RelationshipGraphPage />;
      case 'medical-records':
        return <MedicalRecordsPage />;
      case 'documents':
        return <DocumentsPage />;
      case 'search':
        return <SearchPage />;
      case 'admin-dashboard':
      case 'admin-users':
      case 'admin-medicines':
      case 'admin-documents':
      case 'admin-audit':
        return <AdminDashboardPage />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        if (role === 'ADMIN') return <AdminDashboardPage />;
        if (role === 'REGISTRATION_STAFF') return <RegistrationDashboardPage />;
        if (role === 'MEDICAL_RECORDS_STAFF') return <MedicalRecordsDashboardPage />;
        if (role === 'PATIENT') return <PatientDashboardPage />;
        return <DashboardPage onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-emerald-500 selection:text-white">
      <DisclaimerBanner />

      <Header 
        activePage={activePage} 
        onNavigate={setActivePage}
        onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} 
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          activePage={activePage} 
          onNavigate={setActivePage}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {renderActivePage()}
        </main>
      </div>

      <DocumentViewerModal />
      <PipelineProgressModal />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}
