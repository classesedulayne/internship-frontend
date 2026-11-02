import React, { useState } from 'react';
import { User, KeyRound, ArrowRight, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../services/api';

export default function StudentLoginPage({ onLoginSuccess, onBackToHome, onOpenRegister }) {
  const [identifier, setIdentifier] = useState('');
  const [secret, setSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !secret.trim()) {
      setError('Please enter your Application ID / Email and Contact Phone.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const data = await api.studentLogin(identifier.trim(), secret.trim());
      localStorage.setItem('looka_token', data.token);
      onLoginSuccess(data.user, data.application);
    } catch (err) {
      setError(err.message || 'Invalid credentials. Check your Application ID and phone number.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div 
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '36px',
          borderRadius: '24px',
          background: 'rgba(11, 17, 30, 0.95)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            boxShadow: '0 4px 16px rgba(37, 99, 235, 0.4)'
          }}>
            <User size={26} color="#fff" />
          </div>
          <span className="badge badge-blue" style={{ marginBottom: '8px' }}>
            Student Portal
          </span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800' }}>Student Login</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
            Track application status, download registration slip & access cohort details.
          </p>
        </div>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '10px',
            color: '#fca5a5',
            fontSize: '0.85rem',
            marginBottom: '20px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              Application ID or Registered Email <span className="required-dot">*</span>
            </label>
            <input
              type="text"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              placeholder="e.g. INTR-2026-FYU-1001 or student@example.com"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Contact Phone / College Reg No <span className="required-dot">*</span>
            </label>
            <input
              type="password"
              value={secret}
              onChange={e => setSecret(e.target.value)}
              placeholder="Enter your registered phone number"
              className="form-input"
              required
            />
            <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
              Hint: Enter the phone number you used during registration.
            </span>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '12px', marginTop: '10px' }}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Log In to Student Portal'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-glass)', textAlign: 'center', fontSize: '0.85rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>
            Haven't registered for an internship yet?{' '}
            <button
              onClick={onOpenRegister}
              style={{ background: 'none', color: '#60a5fa', fontWeight: '600', cursor: 'pointer' }}
            >
              Register Now
            </button>
          </p>
          <button
            onClick={onBackToHome}
            style={{ background: 'none', color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '12px', cursor: 'pointer' }}
          >
            ← Back to Programs
          </button>
        </div>
      </div>
    </div>
  );
}
