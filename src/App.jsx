import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import RegistrationModal from './components/RegistrationModal';
import SuccessModal from './components/SuccessModal';
import TrackStatusModal from './components/TrackStatusModal';
import { api } from './services/api';

export default function App() {
  const [currentView, setCurrentView] = useState('login'); // 'login' | 'student' | 'admin' | 'home'
  const [programs, setPrograms] = useState([]);
  const [domains, setDomains] = useState([]);
  const [authUser, setAuthUser] = useState(null);
  const [activeApplication, setActiveApplication] = useState(null);

  // Modals state
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [preselectedProgram, setPreselectedProgram] = useState('FYUGP');
  const [preselectedDomain, setPreselectedDomain] = useState('');
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [createdApplication, setCreatedApplication] = useState(null);
  const [trackStatusOpen, setTrackStatusOpen] = useState(false);

  // Initial load
  useEffect(() => {
    // 1. Fetch programs
    api.getPrograms()
      .then(data => setPrograms(data))
      .catch(err => console.warn('Could not load programs:', err));

    // 2. Fetch domains
    api.getDomains()
      .then(data => setDomains(data))
      .catch(err => console.warn('Could not load domains:', err));

    // 3. Always start at login page — clear any stored session
    localStorage.removeItem('looka_token');
    setCurrentView('login');
  }, []);

  // Handlers
  const handleOpenRegister = (programCode = null, domainName = null) => {
    if (programCode) setPreselectedProgram(programCode);
    if (domainName) setPreselectedDomain(domainName);
    setRegisterModalOpen(true);
  };

  const handleRegistrationSuccess = (response) => {
    setRegisterModalOpen(false);
    setCreatedApplication(response.application);
    setActiveApplication(response.application);
    if (response.token) {
      localStorage.setItem('looka_token', response.token);
      setAuthUser(response.user);
    }
    setSuccessModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('looka_token');
    setAuthUser(null);
    setActiveApplication(null);
    setCurrentView('login');
  };

  const handleStudentLoginSuccess = (user, app) => {
    setAuthUser(user);
    setActiveApplication(app);
    setCurrentView('student');
  };

  const handleAdminLoginSuccess = (user) => {
    setAuthUser(user);
    setCurrentView('admin');
  };

  const handleViewStatusFromSuccess = (applicationId) => {
    setSuccessModalOpen(false);
    setTrackStatusOpen(false);
    setCurrentView('student');
  };

  const handleOpenStudentFromSearch = (app) => {
    setActiveApplication(app);
    setCurrentView('student');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation bar — hidden on login page */}
      {currentView !== 'login' && (
        <Navbar
          currentView={currentView}
          setCurrentView={setCurrentView}
          authUser={authUser}
          onLogout={handleLogout}
          onOpenRegister={handleOpenRegister}
          onOpenTrackStatus={() => setTrackStatusOpen(true)}
        />
      )}

      {/* Main Content Router */}
      <main style={{ flex: 1 }}>
        {currentView === 'home' && (
          <HomePage
            programs={programs}
            domains={domains}
            onGoToAdminDashboard={() => {
              if (authUser?.role === 'student') {
                setCurrentView('student');
              } else {
                setCurrentView('admin');
              }
            }}
            onSelectProgram={(pCode) => handleOpenRegister(pCode, null)}
            onSelectDomain={(dName) => handleOpenRegister(null, dName)}
            onOpenRegister={() => handleOpenRegister(null, null)}
            onOpenTrackStatus={() => setTrackStatusOpen(true)}
          />
        )}

        {currentView === 'student' && (
          <StudentDashboard
            application={activeApplication}
            authUser={authUser}
            onBackToHome={() => setCurrentView('home')}
            onLogout={handleLogout}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard
            onLogout={handleLogout}
            onBackToHome={() => setCurrentView('home')}
          />
        )}

        {currentView === 'login' && (
          <LoginPage
            onStudentLoginSuccess={handleStudentLoginSuccess}
            onAdminLoginSuccess={handleAdminLoginSuccess}
            onRegistrationSuccess={handleRegistrationSuccess}
            programs={programs}
            onBackToHome={() => setCurrentView('home')}
            onOpenRegister={() => {
              setCurrentView('home');
              setRegisterModalOpen(true);
            }}
          />
        )}
      </main>

      {/* Footer — hidden on login page */}
      {currentView !== 'login' && (
        <Footer
          onOpenRegister={handleOpenRegister}
          setCurrentView={setCurrentView}
        />
      )}

      {/* Modals */}
      <RegistrationModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        preselectedProgram={preselectedProgram}
        preselectedDomain={preselectedDomain}
        onSuccess={handleRegistrationSuccess}
      />

      <SuccessModal
        isOpen={successModalOpen}
        application={createdApplication}
        onClose={() => setSuccessModalOpen(false)}
        onViewStatus={handleViewStatusFromSuccess}
      />

      <TrackStatusModal
        isOpen={trackStatusOpen}
        onClose={() => setTrackStatusOpen(false)}
        onOpenDashboard={handleOpenStudentFromSearch}
      />
    </div>
  );
}
