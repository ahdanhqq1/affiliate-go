
import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { UsageProvider } from './contexts/UsageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/layout/Layout';
import { VirtualTryOn } from './pages/VirtualTryOn';
import HomePage from './pages/HomePage';
import GoAesthetic from './pages/GoAesthetic';
import GoKids from './pages/GoKids';
import GoFamily from './pages/GoFamily';
import { GoModelVip } from './pages/GoModelVip';
import GoCermin from './pages/GoCermin';
import GoClean from './pages/GoClean';
import { GoSelfieVip } from './pages/GoSelfieVip';
import { GoSetup } from './pages/GoSetup';
import { FeatureGuide } from './pages/FeatureGuide';
import { Login } from './components/auth/Login';
import { PendingApproval } from './components/auth/PendingApproval';
import Loader from './components/Loader';

import { AdminPanel } from './pages/AdminPanel';
import { Settings } from './pages/Settings';

export type View = 'home' | 'featureGuide' | 'virtualTryOn' | 'goAesthetic' | 'goKids' | 'goFamily' | 'goModelVip' | 'goCermin' | 'goClean' | 'goSelfieVip' | 'goSetup' | 'admin' | 'settings';

function AppContent() {
  const { t } = useLanguage();
  const { user, profile, loading } = useAuth();
  const [activeView, setActiveView] = useState<View>('home');

  const handleNavigate = (view: View) => {
    setActiveView(view);
  };

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <Login />;
  }

  const isAdminEmail = user?.email === 'ahdanhqq1@gmail.com' || profile?.email === 'ahdanhqq1@gmail.com';
  console.log('Admin Check:', { email: user?.email, profileEmail: profile?.email, role: profile?.role, isApproved: profile?.isApproved, isAdminEmail });

  if (!profile?.isApproved && profile?.role !== 'admin' && !isAdminEmail) {
    return <PendingApproval />;
  }

  const renderActiveView = () => {
      switch (activeView) {
        case 'home': return <HomePage />;
        case 'featureGuide': return <FeatureGuide />;
        case 'virtualTryOn': return <VirtualTryOn />;
        case 'goModelVip': return <GoModelVip />;
        case 'goAesthetic': return <GoAesthetic />;
        case 'goKids': return <GoKids />;
        case 'goFamily': return <GoFamily />;
        case 'goCermin': return <GoCermin />;
        case 'goClean': return <GoClean />;
        case 'goSelfieVip': return <GoSelfieVip />;
        case 'goSetup': return <GoSetup />;
        case 'admin': return <AdminPanel />;
        case 'settings': return <Settings />;
        default: return <HomePage />;
      }
  };

  return (
    <Layout activeView={activeView} setActiveView={handleNavigate}>
      {renderActiveView()}
    </Layout>
  );
}

function App() {
  return (
    <LanguageProvider>
      <UsageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </UsageProvider>
    </LanguageProvider>
  );
}

export default App;
