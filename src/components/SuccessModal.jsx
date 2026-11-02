import React from 'react';
import { CheckCircle2, Download, ExternalLink, Sparkles, Printer, ArrowRight, ArrowLeft } from 'lucide-react';

export default function SuccessModal({ application, onClose, onViewStatus, isOpen }) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !application) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(application.application_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          padding: '36px',
          borderRadius: '24px',
          background: '#ffffff',
          border: '1.5px solid #e2e8f0',
          boxShadow: '0 25px 60px -15px rgba(37, 99, 235, 0.2)',
          textAlign: 'center',
          color: '#0f172a'
        }}
      >
        {/* Success Icon */}
        <div style={{
          width: '68px',
          height: '68px',
          borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '2px solid rgba(16, 185, 129, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px auto'
        }}>
          <CheckCircle2 size={36} color="#10b981" />
        </div>

        <span className="badge badge-green" style={{ marginBottom: '12px', fontSize: '0.8rem' }}>
          Registration Submitted Successfully
        </span>

        <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
          Welcome, {application.student_name}!
        </h2>
        <p style={{ color: '#475569', fontSize: '0.92rem', marginBottom: '22px' }}>
          Your internship application has been recorded and submitted for SuperAdmin verification.
        </p>

        {/* Application ID Card Box */}
        <div style={{
          background: '#f8faff',
          border: '1.5px dashed #93c5fd',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '22px',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>
              Your Application ID
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#2563eb', letterSpacing: '0.04em' }}>
                {application.application_id}
              </span>
              <button
                onClick={handleCopyId}
                style={{
                  background: copied ? '#10b981' : '#e0e7ff',
                  border: 'none',
                  color: copied ? '#fff' : '#3730a3',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Program Track</span>
              <strong style={{ color: '#0f172a' }}>{application.program_code}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Domain Specialization</span>
              <strong style={{ color: '#4f46e5' }}>{application.domain}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Required Hours</span>
              <strong style={{ color: '#2563eb' }}>{application.internship_hours || '120 Hours'}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>College</span>
              <span style={{ color: '#334155' }}>{application.college_name}</span>
            </div>
          </div>
        </div>

        {/* Quick Instructions */}
        <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '20px' }}>
          💡 Save your Application ID. You can log in anytime using this ID and your registered phone number.
        </p>

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={() => onViewStatus(application.application_id)}
            className="btn-primary"
            style={{ width: '100%', padding: '12px', justifyContent: 'center' }}
          >
            <span>Open Student Dashboard</span>
            <ArrowRight size={16} />
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              onClick={handlePrint}
              className="btn-secondary"
              style={{ padding: '10px', justifyContent: 'center' }}
            >
              <Printer size={15} />
              <span>Print Slip</span>
            </button>

            <button
              onClick={onClose}
              className="btn-secondary"
              style={{ padding: '10px', justifyContent: 'center' }}
            >
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
