import React, { useState, useEffect } from 'react';
import { 
  X, Check, AlertCircle, Clock,
  Loader2, Calendar, FileText, User, School, Sparkles, ArrowLeft
} from 'lucide-react';
import { api } from '../services/api';

export default function RegistrationModal({ 
  isOpen, 
  onClose, 
  preselectedProgram = 'FYUGP', 
  preselectedDomain = '', 
  onSuccess 
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Internship Hours State: '120' | '240' | 'custom'
  const [hoursType, setHoursType] = useState('120');
  const [customHours, setCustomHours] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    program_code: preselectedProgram || 'FYUGP',
    student_name: '',
    email: '',
    contact_number: '',
    college_name: '',
    department: '',
    academic_year: '3rd Year',
    registration_no: '',
    domain: preselectedDomain || 'AI Data Science',
    internship_month: 'May 2026',
    duration_months: '1 Month',
    internship_hours: '120 Hours',
    hod_name: '',
    hod_contact: '',
  });

  useEffect(() => {
    if (preselectedProgram) {
      setFormData(prev => ({ ...prev, program_code: preselectedProgram }));
    }
    if (preselectedDomain) {
      setFormData(prev => ({ ...prev, domain: preselectedDomain }));
    }
  }, [preselectedProgram, preselectedDomain]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.student_name.trim()) return 'Please enter your Full Name.';
    if (!formData.email.trim() || !formData.email.includes('@')) return 'Please enter a valid Email Address.';
    if (!formData.contact_number.trim() || formData.contact_number.length < 10) return 'Please enter a valid 10-digit Contact Number.';
    if (!formData.college_name.trim()) return 'Please enter your College Name.';
    if (!formData.department.trim()) return 'Please enter your Department / Stream (e.g. Computer Science).';
    if (!formData.domain.trim()) return 'Please select an Internship Domain track.';
    if (!formData.internship_month.trim()) return 'Please select the month you intend to do your internship.';
    if (!formData.hod_name.trim()) return 'Please enter your Head of Department (HOD) Name.';
    if (hoursType === 'custom') {
      const parsed = parseInt(customHours, 10);
      if (!customHours.trim() || isNaN(parsed) || parsed <= 0) {
        return 'Please enter the number of required internship hours (e.g. 60, 90, 150, 300).';
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErr = validateForm();
    if (validationErr) {
      setError(validationErr);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const finalHours = hoursType === '120' 
        ? '120 Hours' 
        : hoursType === '240' 
          ? '240 Hours' 
          : `${customHours.trim()} Hours`;

      const payload = new FormData();
      Object.keys(formData).forEach(key => {
        payload.append(key, formData[key]);
      });
      payload.set('internship_hours', finalHours);
      payload.set('payment_status', 'Not Required');

      const response = await api.registerInternship(payload);
      setLoading(false);
      onSuccess(response);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Submission failed. Please check your inputs and try again.');
    }
  };

  const domainOptions = [
    'AI Data Science',
    'AIML',
    'Full Stack',
    'Full Stack with AI',
    'Cybersecurity'
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '720px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '32px 30px',
          borderRadius: '24px',
          border: '1.5px solid rgba(37, 99, 235, 0.15)',
          background: '#ffffff',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.25)',
          color: '#0f172a'
        }}
      >
        {/* Top Navigation Bar: Back to Programs Dashboard */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginBottom: '20px', 
          paddingBottom: '14px', 
          borderBottom: '1px solid #f1f5f9' 
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 18px',
              background: '#eff6ff',
              border: '1.5px solid #bfdbfe',
              borderRadius: '12px',
              color: '#1d4ed8',
              fontWeight: '700',
              fontSize: '0.92rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 6px rgba(37, 99, 235, 0.08)'
            }}
          >
            <ArrowLeft size={18} />
            <span>Back to Dashboard</span>
          </button>

          <button 
            type="button"
            onClick={onClose}
            title="Close"
            style={{
              background: '#f1f5f9',
              color: '#475569',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: 'none',
              transition: 'background 0.2s'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Title */}
        <div style={{ marginBottom: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-blue">{formData.program_code}</span>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>Official Registration Form</span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>
            {formData.program_code} Internship <span className="gradient-text">Registration</span>
          </h2>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '12px',
            color: '#b91c1c',
            fontSize: '0.9rem',
            marginBottom: '22px',
            fontWeight: '500'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>

          {/* Program Switcher */}
          <div style={{
            padding: '16px',
            background: '#f8faff',
            borderRadius: '14px',
            border: '1px solid rgba(37, 99, 235, 0.12)'
          }}>
            <label className="form-label" style={{ marginBottom: '8px', color: '#334155' }}>
              Selected Program:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {['FYUGP', 'BTECH', 'PG'].map(pCode => (
                <button
                  key={pCode}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, program_code: pCode }))}
                  style={{
                    padding: '11px',
                    borderRadius: '10px',
                    border: formData.program_code === pCode ? '2px solid #2563eb' : '1.5px solid #e2e8f0',
                    background: formData.program_code === pCode ? '#eff6ff' : '#ffffff',
                    color: formData.program_code === pCode ? '#2563eb' : '#475569',
                    fontWeight: '700',
                    fontSize: '0.92rem',
                    cursor: 'pointer'
                  }}
                >
                  {pCode}
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 1: Student Information */}
          <div style={{
            padding: '20px',
            background: '#ffffff',
            borderRadius: '16px',
            border: '1.5px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <User size={18} color="#2563eb" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                1. Student Details
              </h3>
            </div>

            {/* Name */}
            <div className="form-group">
              <label className="form-label" style={{ color: '#334155' }}>
                Full Name <span className="required-dot">*</span>
              </label>
              <input
                type="text"
                name="student_name"
                value={formData.student_name}
                onChange={handleInputChange}
                placeholder="e.g. Rahul Sharma"
                className="form-input"
                required
              />
            </div>

            {/* Email & Contact Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label" style={{ color: '#334155' }}>
                  Email Address <span className="required-dot">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="student@example.com"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: '#334155' }}>
                  Contact Number (Phone/WhatsApp) <span className="required-dot">*</span>
                </label>
                <input
                  type="tel"
                  name="contact_number"
                  value={formData.contact_number}
                  onChange={handleInputChange}
                  placeholder="+91 9876543210"
                  className="form-input"
                  required
                />
              </div>
            </div>

            {/* College & Department */}
            <div className="form-group">
              <label className="form-label" style={{ color: '#334155' }}>
                College / University Name <span className="required-dot">*</span>
              </label>
              <input
                type="text"
                name="college_name"
                value={formData.college_name}
                onChange={handleInputChange}
                placeholder="e.g. College of Engineering Trivandrum"
                className="form-input"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label" style={{ color: '#334155' }}>
                  Department / Branch <span className="required-dot">*</span>
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder="e.g. Computer Science, BCA, ECE"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: '#334155' }}>
                  Year of Study
                </label>
                <select
                  name="academic_year"
                  value={formData.academic_year}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="Final Year (4th Year)">Final Year (4th Year)</option>
                  <option value="Postgraduate 1st Year">Postgraduate 1st Year</option>
                  <option value="Postgraduate Final Year">Postgraduate Final Year</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2: Domain, Internship Month & HOD */}
          <div style={{
            padding: '20px',
            background: '#ffffff',
            borderRadius: '16px',
            border: '1.5px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <School size={18} color="#2563eb" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
                2. Internship Specialization & Schedule
              </h3>
            </div>

            {/* Domain selection */}
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label" style={{ color: '#334155', marginBottom: '8px' }}>
                Internship Domain Track <span className="required-dot">*</span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                {domainOptions.map((dom) => {
                  const isSelected = formData.domain === dom;
                  return (
                    <div
                      key={dom}
                      onClick={() => setFormData(prev => ({ ...prev, domain: dom }))}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: isSelected ? '2px solid #2563eb' : '1.5px solid #e2e8f0',
                        background: isSelected ? '#eff6ff' : '#f8fafc',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          border: isSelected ? '5px solid #2563eb' : '2px solid #94a3b8',
                          background: isSelected ? '#fff' : 'transparent'
                        }} />
                        <span style={{ fontWeight: isSelected ? '700' : '600', fontSize: '0.88rem', color: isSelected ? '#0f172a' : '#334155' }}>
                          {dom}
                        </span>
                      </div>
                      {isSelected && <span className="badge badge-blue" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>Selected</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Preferred Starting Month */}
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label" style={{ color: '#334155', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={15} color="#2563eb" />
                <span>Preferred Starting Month <span className="required-dot">*</span></span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '8px' }}>
                {['Immediate', 'May 2026', 'June 2026', 'July 2026', 'August 2026', 'September 2026'].map((m) => {
                  const isSel = formData.internship_month === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, internship_month: m }))}
                      style={{
                        padding: '9px 6px',
                        borderRadius: '10px',
                        border: isSel ? '2px solid #2563eb' : '1.5px solid #cbd5e1',
                        background: isSel ? '#2563eb' : '#ffffff',
                        color: isSel ? '#ffffff' : '#334155',
                        fontWeight: isSel ? '700' : '600',
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s'
                      }}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* HOD Reference */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ color: '#334155' }}>
                  HOD Name <span className="required-dot">*</span>
                </label>
                <input
                  type="text"
                  name="hod_name"
                  value={formData.hod_name}
                  onChange={handleInputChange}
                  placeholder="e.g. Dr. K. S. Ramanujam"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ color: '#334155' }}>
                  HOD Contact / Email
                </label>
                <input
                  type="text"
                  name="hod_contact"
                  value={formData.hod_contact}
                  onChange={handleInputChange}
                  placeholder="e.g. +91 94470... or hod@college.edu"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Required Internship Hours */}
          <div style={{
            padding: '22px',
            background: '#f8faff',
            borderRadius: '16px',
            border: '1.5px solid #bfdbfe'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Clock size={19} color="#2563eb" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#1e3a8a', margin: 0 }}>
                3. Required Internship Hours
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0 0 16px 0', lineHeight: '1.4' }}>
              Select your university / academic internship hour requirement, or specify your own custom hours:
            </p>

            {/* Hours Selection Options */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
              {[
                { id: '120', label: '120 Hours', sub: 'Standard Track (~3-4 Wks)' },
                { id: '240', label: '240 Hours', sub: 'Extended Track (~6-8 Wks)' },
                { id: 'custom', label: 'Custom Hours', sub: 'Specify required hours' }
              ].map(opt => {
                const isSel = hoursType === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setHoursType(opt.id);
                      setError('');
                    }}
                    style={{
                      padding: '14px 10px',
                      borderRadius: '12px',
                      border: isSel ? '2px solid #2563eb' : '1.5px solid #cbd5e1',
                      background: isSel ? '#eff6ff' : '#ffffff',
                      color: isSel ? '#1d4ed8' : '#334155',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.15s ease',
                      boxShadow: isSel ? '0 2px 8px rgba(37,99,235,0.15)' : 'none'
                    }}
                  >
                    <div style={{ fontWeight: '800', fontSize: '1rem', color: isSel ? '#1d4ed8' : '#0f172a' }}>
                      {opt.label}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: isSel ? '#2563eb' : '#64748b', marginTop: '3px' }}>
                      {opt.sub}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Hours Input if selected */}
            {hoursType === 'custom' && (
              <div style={{
                background: '#ffffff',
                padding: '16px',
                borderRadius: '12px',
                border: '1.5px solid #93c5fd',
                marginBottom: '14px'
              }}>
                <label className="form-label" style={{ color: '#1e3a8a', marginBottom: '6px', fontWeight: '700' }}>
                  Enter Required Internship Hours: <span className="required-dot">*</span>
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="number"
                    min="10"
                    max="1000"
                    value={customHours}
                    onChange={(e) => {
                      setCustomHours(e.target.value);
                      setError('');
                    }}
                    placeholder="e.g. 60, 90, 150, 180, 300"
                    className="form-input"
                    style={{ fontWeight: '700', fontSize: '1rem', maxWidth: '240px' }}
                    required
                  />
                  <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1e3a8a' }}>
                    Hours
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
                  Enter the exact total hours mandated by your college/university curriculum.
                </span>
              </div>
            )}

            {/* Free / No Payment Badge Notice */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 14px',
              background: '#ecfdf5',
              borderRadius: '10px',
              border: '1px solid #a7f3d0'
            }}>
              <Check size={18} color="#059669" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '0.82rem', color: '#065f46', fontWeight: '600', lineHeight: '1.4' }}>
                Direct Admission — No payment screenshot or transaction ID required. You will receive an official application confirmation email.
              </span>
            </div>
          </div>

          {/* Action Buttons: Back to Dashboard & Submit */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '16px 22px',
                fontSize: '0.98rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderRadius: '14px',
                background: '#f8fafc',
                border: '1.5px solid #cbd5e1',
                color: '#334155',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <ArrowLeft size={18} />
              <span>Back to Dashboard</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                flex: 1,
                minWidth: '220px',
                padding: '16px',
                fontSize: '1.05rem',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                borderRadius: '14px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="spinner" />
                  <span>Submitting Application...</span>
                </>
              ) : (
                <>
                  <Check size={20} />
                  <span>Submit {formData.program_code} Internship Application</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
