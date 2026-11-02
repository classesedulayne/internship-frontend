import React from 'react';

export default function Footer({ setCurrentView }) {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '20px 0',
      marginTop: '40px',
      fontSize: '0.82rem',
      color: 'var(--text-dim)',
      textAlign: 'center'
    }}>
      <div className="container" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
        <div>
          © 2026 Looka Internship Portal • FYUGP, B.Tech & PG Programs
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button 
            onClick={() => setCurrentView('login')} 
            style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '0.82rem' }}
          >
            Portal Login
          </button>
        </div>
      </div>
    </footer>
  );
}
