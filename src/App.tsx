import React, { useState } from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { AiAssistantModal } from './components/common/AiAssistantModal';
import { LoginModal } from './components/common/LoginModal';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { ProfilePage } from './pages/public/ProfilePage';
import { AcademicPage } from './pages/public/AcademicPage';
import { ProgramsPage } from './pages/public/ProgramsPage';
import { StudentAffairsPage } from './pages/public/StudentAffairsPage';
import { AchievementsPage } from './pages/public/AchievementsPage';
import { NewsPage } from './pages/public/NewsPage';
import { GalleryPage } from './pages/public/GalleryPage';
import { SpmbPage } from './pages/public/SpmbPage';
import { ContactPage } from './pages/public/ContactPage';
import { LoginPage } from './pages/public/LoginPage';

// Portal Dashboards
import { StudentPortal } from './pages/portal/StudentPortal';
import { ParentPortal } from './pages/portal/ParentPortal';
import { TeacherPortal } from './pages/portal/TeacherPortal';
import { PrincipalPortal } from './pages/portal/PrincipalPortal';
import { AdminPortal } from './pages/portal/AdminPortal';
import { TreasurerPortal } from './pages/portal/TreasurerPortal';

const AppContent: React.FC = () => {
  const { currentView } = useSchool();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Router view selector
  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage />;
      case 'profil':
        return <ProfilePage />;
      case 'akademik':
        return <AcademicPage />;
      case 'program':
      case 'program-unggulan':
        return <ProgramsPage />;
      case 'kesiswaan':
        return <StudentAffairsPage />;
      case 'prestasi':
        return <AchievementsPage />;
      case 'berita':
        return <NewsPage />;
      case 'galeri':
        return <GalleryPage />;
      case 'spmb':
      case 'ppdb':
        return <SpmbPage />;
      case 'kontak':
      case 'suara-warga':
        return <ContactPage />;
      case 'login':
      case 'masuk':
      case 'masuk-portal':
        return <LoginPage />;

      // Role-based portals
      case 'portal-siswa':
        return <StudentPortal />;
      case 'portal-ortu':
        return <ParentPortal />;
      case 'portal-guru':
        return <TeacherPortal />;
      case 'portal-kamad':
        return <PrincipalPortal />;
      case 'portal-bendahara':
      case 'portal-keuangan':
        return <TreasurerPortal />;
      case 'portal-admin':
      case 'admin-settings':
        return <AdminPortal />;

      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-200 selection:text-emerald-950">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content Body */}
      <main className="flex-grow">
        {renderView()}
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Interactive Utilities */}
      <WhatsAppButton />

      {/* AI Assistant Modal & Trigger */}
      <AiAssistantModal />

      {/* Single Sign-On Demo Switcher Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <SchoolProvider>
      <AppContent />
    </SchoolProvider>
  );
}
