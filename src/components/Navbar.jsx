import React, { useState } from 'react';
import { Sparkles, Shield, User, LogOut, CheckCircle2, Search, ArrowRight, Menu, X } from 'lucide-react';

export default function Navbar({ currentView, setCurrentView, authUser, onLogout, onOpenRegister, onOpenTrackStatus }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(37, 99, 235, 0.1)',
      padding: '14px 0',
      boxShadow: '0 2px 12px rgba(37,99,235,0.06)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand */}
        <div 
          onClick={() => { setCurrentView('home'); setMobileMenuOpen(false); }}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)'
          }}>
            <Sparkles size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
                LOOKA <span className="gradient-text">INTERNSHIP</span>
              </span>
              <span className="badge badge-blue" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>2026</span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>FYUGP • B.Tech • PG Career Programs</p>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <div style={{ display: 'none', alignItems: 'center', gap: '24px' }} className="desktop-nav">
          <button 
            onClick={() => setCurrentView('home')}
            style={{ 
              background: 'none', 
              color: currentView === 'home' ? '#2563eb' : 'var(--text-muted)', 
              fontWeight: currentView === 'home' ? '600' : '500',
              fontSize: '0.9rem',
              transition: 'color 0.2s'
            }}
          >
            Programs
          </button>


          <button 
            onClick={onOpenTrackStatus}
            style={{ 
              background: 'none', 
              color: 'var(--text-muted)', 
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Search size={14} />
            Track Status
          </button>

          {/* User Session or Login links */}
          {authUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button 
                onClick={() => setCurrentView(authUser.role === 'superadmin' ? 'admin' : 'student')}
                style={{
                  background: 'rgba(37, 99, 235, 0.07)',
                  border: '1.5px solid rgba(37, 99, 235, 0.2)',
                  color: '#2563eb',
                  padding: '7px 14px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <User size={14} />
                {authUser.name || 'Dashboard'}
              </button>

              <button 
                onClick={onLogout}
                title="Logout"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  padding: '7px 10px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '0.82rem',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button 
                onClick={() => setCurrentView('login')}
                style={{
                  background: 'rgba(37, 99, 235, 0.08)',
                  border: '1px solid rgba(37, 99, 235, 0.2)',
                  color: '#2563eb',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <User size={14} />
                Login
              </button>
            </div>
          )}

          <button 
            onClick={() => onOpenRegister(null)}
            className="btn-primary"
            style={{ padding: '9px 18px', fontSize: '0.88rem' }}
          >
            Register Now
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="mobile-toggle">
          <button 
            onClick={() => onOpenRegister(null)}
            className="btn-primary"
            style={{ padding: '8px 14px', fontSize: '0.8rem' }}
          >
            Register
          </button>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ background: 'rgba(255,255,255,0.06)', padding: '8px', borderRadius: '8px', color: 'white' }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          padding: '16px 20px',
          background: 'rgba(15, 23, 42, 0.98)',
          borderBottom: '1px solid var(--border-glass)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <button 
            onClick={() => { setCurrentView('home'); setMobileMenuOpen(false); }}
            style={{ textAlign: 'left', background: 'none', color: '#60a5fa', padding: '8px 0', fontSize: '1rem' }}
          >
            Home / Programs
          </button>
          <button 
            onClick={() => { onOpenTrackStatus(); setMobileMenuOpen(false); }}
            style={{ textAlign: 'left', background: 'none', color: 'var(--text-muted)', padding: '8px 0', fontSize: '1rem' }}
          >
            Track Application Status
          </button>
          {authUser ? (
            <>
              <button 
                onClick={() => { setCurrentView(authUser.role === 'superadmin' ? 'admin' : 'student'); setMobileMenuOpen(false); }}
                style={{ textAlign: 'left', background: 'none', color: '#a78bfa', padding: '8px 0', fontSize: '1rem' }}
              >
                Dashboard ({authUser.role})
              </button>
              <button 
                onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                style={{ textAlign: 'left', background: 'none', color: '#f87171', padding: '8px 0', fontSize: '1rem' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => { setCurrentView('login'); setMobileMenuOpen(false); }}
                style={{ textAlign: 'left', background: 'none', color: 'white', padding: '8px 0', fontSize: '1rem' }}
              >
                Login
              </button>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 860px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
