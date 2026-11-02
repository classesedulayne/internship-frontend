import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../services/api';

export default function AdminLoginPage({ onLoginSuccess, onBackToHome }) {
  const [email, setEmail] = useState('nandananb2003@gmail.com');
  const [password, setPassword] = useState('nandana@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter admin email and password.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const data = await api.adminLogin(email.trim(), password.trim());
      localStorage.setItem('looka_token', data.token);
      onLoginSuccess(data.user);
    } catch (err) {
      setError(err.message || 'Invalid administrator credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('nandananb2003@gmail.com');
    setPassword('nandana@123');
    setError('');
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
          border: '1px solid rgba(139, 92, 246, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            boxShadow: '0 4px 16px rgba(124, 58, 237, 0.4)'
          }}>
            <Shield size={26} color="#fff" />
          </div>
          <span className="badge badge-purple" style={{ marginBottom: '8px' }}>
            Enterprise SuperAdmin
          </span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800' }}>SuperAdmin Portal</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
            Verify payment screenshots, filter applicants, and manage internship cohorts.
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

        {/* Demo Credentials Pill */}
        <div style={{
          padding: '10px 14px',
          background: 'rgba(139, 92, 246, 0.1)',
          border: '1px solid rgba(139, 92, 246, 0.25)',
          borderRadius: '10px',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          color: '#c084fc'
        }}>
          <div>
            <strong>SuperAdmin:</strong> nandananb2003@gmail.com / nandana@123
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            style={{
              background: 'rgba(139, 92, 246, 0.2)',
              border: 'none',
              color: '#fff',
              padding: '3px 8px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              cursor: 'pointer'
            }}
          >
            Auto Fill
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              Admin Email <span className="required-dot">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="nandananb2003@gmail.com"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Password <span className="required-dot">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="form-input"
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              marginTop: '10px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)'
            }}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Sign In as SuperAdmin'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-glass)', textAlign: 'center' }}>
          <button
            onClick={onBackToHome}
            style={{ background: 'none', color: 'var(--text-dim)', fontSize: '0.82rem', cursor: 'pointer' }}
          >
            ← Return to Public Portal
          </button>
        </div>
      </div>
    </div>
  );
}
