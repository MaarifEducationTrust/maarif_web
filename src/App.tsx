import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { SiteSettings } from './types';
import { getSiteSettings } from './lib/db';
import { initialSiteSettings } from './lib/initialData';

// Public Components & Pages
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { DonationModal } from './components/common/DonationModal';
import { Home } from './pages/Home';
import { Programs } from './pages/Programs';
import { Problems } from './pages/Problems';
import { Students } from './pages/Students';
import { Activities } from './pages/Activities';
import { LegalDocuments } from './pages/LegalDocuments';
import { NotFound } from './pages/NotFound';

// Admin Components & Pages
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { AdminLayout } from './components/layout/AdminLayout';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminHomepage } from './pages/admin/AdminHomepage';
import { AdminPrograms } from './pages/admin/AdminPrograms';
import { AdminProblems } from './pages/admin/AdminProblems';
import { AdminStatistics } from './pages/admin/AdminStatistics';
import { AdminActivities } from './pages/admin/AdminActivities';
import { AdminDocuments } from './pages/admin/AdminDocuments';
import { AdminDonation } from './pages/admin/AdminDonation';

// Layout wrapper for Public Pages
const PublicLayout: React.FC<{
  settings: SiteSettings;
  onOpenDonate: () => void;
}> = ({ settings, onOpenDonate }) => {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50 selection:bg-emerald-800 selection:text-white">
      <Header settings={settings} onOpenDonate={onOpenDonate} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer settings={settings} onOpenDonate={onOpenDonate} />
    </div>
  );
};

export const App: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(initialSiteSettings);
  const [donateModalOpen, setDonateModalOpen] = useState(false);

  useEffect(() => {
    getSiteSettings().then((s) => {
      if (s) setSettings(s);
    });

    const handleSettingsUpdate = (e: any) => {
      if (e.detail) {
        setSettings(e.detail);
      } else {
        getSiteSettings().then((s) => {
          if (s) setSettings(s);
        });
      }
    };

    window.addEventListener('madrasa_settings_updated', handleSettingsUpdate);
    return () => {
      window.removeEventListener('madrasa_settings_updated', handleSettingsUpdate);
    };
  }, []);

  const openDonateModal = () => setDonateModalOpen(true);
  const closeDonateModal = () => setDonateModalOpen(false);

  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Pages */}
            <Route
              element={
                <PublicLayout
                  settings={settings}
                  onOpenDonate={openDonateModal}
                />
              }
            >
              <Route path="/" element={<Home onOpenDonate={openDonateModal} />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/activities/:id" element={<Activities />} />
              <Route path="/needs" element={<Problems onOpenDonate={openDonateModal} />} />
              <Route path="/students" element={<Students />} />
              <Route path="/documents" element={<LegalDocuments />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Admin Login */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="homepage" element={<AdminHomepage />} />
                <Route path="programs" element={<AdminPrograms />} />
                <Route path="problems" element={<AdminProblems />} />
                <Route path="statistics" element={<AdminStatistics />} />
                <Route path="activities" element={<AdminActivities />} />
                <Route path="documents" element={<AdminDocuments />} />
                <Route path="donation" element={<AdminDonation />} />
              </Route>
            </Route>
          </Routes>

          {/* Global Donation Modal */}
          <DonationModal
            isOpen={donateModalOpen}
            onClose={closeDonateModal}
            settings={settings}
          />
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
