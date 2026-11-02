import React, { useState } from 'react';
import { X, Search, CheckCircle2, Clock, AlertTriangle, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '../services/api';

export default function TrackStatusModal({ isOpen, onClose, initialId = '', onOpenDashboard }) {
  const [identifier, setIdentifier] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your Application ID or registered Email.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await api.checkApplicationStatus(identifier.trim());
      setResult(data);
    } catch (err) {
      setError(err.message || 'No application found with the provided details.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
      case 'Enrolled':
        return <span className="badge badge-green">{status}</span>;
      case 'Under Review':
        return <span className="badge badge-yellow">{status}</span>;
      case 'Rejected':
        return <span className="badge badge-red">{status}</span>;
      default:
        return <span className="badge badge-blue">{status || 'Submitted'}</span>;
    }
  };

  const getPaymentBadge = (status) => {
    switch (status) {
      case 'Verified':
        return <span className="badge badge-green">Payment Verified</span>;
      case 'Rejected':
        return <span className="badge badge-red">Payment Rejected</span>;
      default:
        return <span className="badge badge-yellow">Payment Verification Pending</span>;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="glass-panel" 
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '540px',
          padding: '30px',
          borderRadius: '24px',
          background: 'rgba(11, 17, 30, 0.98)',
          border: '1px solid var(--border-glass)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(59, 130, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Search size={18} color="#60a5fa" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Track Application Status</h3>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              color: 'var(--text-muted)',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearch} style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={identifier}
              onChange={e => { setIdentifier(e.target.value); setError(''); }}
              placeholder="Enter Application ID (e.g. INTR-2026-...) or Email"
              className="form-input"
              style={{ flex: 1 }}
              autoFocus
            />
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ padding: '0 20px', flexShrink: 0 }}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : 'Search'}
            </button>
          </div>
          {error && (
            <p style={{ color: '#f87171', fontSize: '0.82rem', marginTop: '8px' }}>
              {error}
            </p>
          )}
        </form>

        {/* Result Card */}
        {result && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '20px',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                  {result.program_code} Track
                </span>
                <h4 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#fff' }}>
                  {result.student_name}
                </h4>
              </div>
              <div style={{ textAlign: 'right' }}>
                {getStatusBadge(result.application_status)}
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              fontSize: '0.84rem',
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '10px',
              marginBottom: '16px'
            }}>
              <div>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.74rem' }}>Application ID</span>
                <p style={{ color: '#60a5fa', fontWeight: '700' }}>{result.application_id}</p>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.74rem' }}>Domain</span>
                <p style={{ color: '#a78bfa', fontWeight: '600' }}>{result.domain}</p>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.74rem' }}>College</span>
                <p style={{ color: 'var(--text-muted)' }}>{result.college_name}</p>
              </div>
              <div>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.74rem' }}>Payment Status</span>
                <div style={{ marginTop: '3px' }}>{getPaymentBadge(result.payment_status)}</div>
              </div>
            </div>

            {/* Admin Notes */}
            {result.admin_notes && (
              <div style={{
                padding: '10px 14px',
                background: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '8px',
                fontSize: '0.82rem',
                color: '#93c5fd',
                marginBottom: '16px'
              }}>
                <strong>Coordinator Note:</strong> {result.admin_notes}
              </div>
            )}

            <button
              onClick={() => {
                onClose();
                onOpenDashboard(result);
              }}
              className="btn-secondary"
              style={{ width: '100%', padding: '10px', fontSize: '0.88rem' }}
            >
              Open Full Student View
              <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
