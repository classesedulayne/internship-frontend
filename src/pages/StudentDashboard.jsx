import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Clock, ShieldCheck, Download, Printer, User, Mail, Phone, 
  Building, BookOpen, CreditCard, ExternalLink, Edit3, Save, X, Sparkles, ArrowLeft, ArrowRight,
  Copy, Award, Check, Loader2, Upload, AlertCircle, GraduationCap, Cpu, Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';

export default function StudentDashboard({ application: initialApp, authUser, onBackToHome, onLogout }) {
  const [app, setApp] = useState(initialApp);
  const [isEditing, setIsEditing] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [editForm, setEditForm] = useState({
    contact_number: initialApp?.contact_number || '',
    hod_name: initialApp?.hod_name || '',
    hod_contact: initialApp?.hod_contact || '',
    registration_no: initialApp?.registration_no || '',
    department: initialApp?.department || ''
  });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  // New Application Form states for students without active application
  const [selectedProgram, setSelectedProgram] = useState('FYUGP');
  const [hoursType, setHoursType] = useState('120');
  const [customHours, setCustomHours] = useState('');
  const [appForm, setAppForm] = useState({
    student_name: authUser?.name || '',
    email: authUser?.email || '',
    contact_number: '',
    college_name: '',
    department: '',
    academic_year: '3rd Year',
    domain: 'AI Data Science',
    internship_month: 'May 2026',
    duration_months: '1 Month',
    internship_hours: '120 Hours',
    hod_name: '',
    hod_contact: '',
  });
  const [submittingApp, setSubmittingApp] = useState(false);
  const [appError, setAppError] = useState('');

  useEffect(() => {
    if (initialApp?.application_id) {
      api.checkApplicationStatus(initialApp.application_id)
        .then(data => setApp(data))
        .catch(() => {});
    }
  }, [initialApp]);

  useEffect(() => {
    if (authUser?.email && !appForm.email) {
      setAppForm(prev => ({ ...prev, email: authUser.email, student_name: authUser.name || prev.student_name }));
    }
  }, [authUser]);

  const handleAppFormChange = (e) => {
    const { name, value } = e.target;
    setAppForm(prev => ({ ...prev, [name]: value }));
    setAppError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScreenshotFile(file);
      setAppError('');
    }
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText("looka.internship@upi");
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    if (!appForm.student_name.trim()) return setAppError("Please enter your Full Name.");
    if (!appForm.email.trim() || !appForm.email.includes("@")) return setAppError("Please enter a valid Email Address.");
    if (!appForm.contact_number.trim() || appForm.contact_number.length < 10) return setAppError("Please enter a valid 10-digit Contact Number.");
    if (!appForm.college_name.trim()) return setAppError("Please enter your College Name.");
    if (!appForm.department.trim()) return setAppError("Please enter your Department / Branch.");
    if (!appForm.hod_name.trim()) return setAppError("Please enter your Head of Department (HOD) Name.");

    if (hoursType === 'custom') {
      const parsed = parseInt(customHours, 10);
      if (!customHours.trim() || isNaN(parsed) || parsed <= 0) {
        return setAppError("Please enter valid required internship hours (e.g. 60, 90, 150, 300).");
      }
    }

    setSubmittingApp(true);
    setAppError('');

    try {
      const finalHours = hoursType === '120' ? '120 Hours' : hoursType === '240' ? '240 Hours' : `${customHours.trim()} Hours`;
      const payload = new FormData();
      payload.append('program_code', selectedProgram);
      Object.keys(appForm).forEach(key => {
        payload.append(key, appForm[key]);
      });
      payload.set('internship_hours', finalHours);
      payload.set('payment_status', 'Not Required');

      const res = await api.registerInternship(payload);
      setSubmittingApp(false);
      setApp(res.application);
      setShowConfirmationModal(true);


    } catch (err) {
      setSubmittingApp(false);
      setAppError(err.message || 'Failed to submit application. Please check details.');
    }
  };

  // If student is logged in but hasn't applied yet, render the Apply for Internship dashboard
  if (!app) {
    return (
      <div style={{ padding: '36px 0 80px 0', minHeight: '85vh', background: '#f8faff' }}>
        <div className="container" style={{ maxWidth: '840px', margin: '0 auto' }}>
          
          {/* Top Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={16} color="#ffffff" />
              </div>
              <span style={{ fontWeight: '800', fontSize: '1.05rem', color: '#0f172a' }}>LOOKA INTERNSHIP</span>
            </div>

            {onLogout && (
              <button 
                type="button" 
                onClick={onLogout}
                style={{
                  padding: '8px 14px', background: '#fff', border: '1.5px solid #fecdd3',
                  borderRadius: '10px', color: '#e11d48', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer'
                }}
              >
                Logout
              </button>
            )}
          </div>

          {/* Welcome Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
            color: '#fff', borderRadius: '20px', padding: '30px 32px', marginBottom: '28px',
            boxShadow: '0 8px 24px rgba(37,99,235,0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-blue" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>
                Student Portal
              </span>
              <span style={{ fontSize: '0.8rem', opacity: 0.85 }}>Signed in as: {authUser?.email || appForm.email}</span>
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '8px' }}>
              Apply for Internship
            </h1>
            <p style={{ opacity: 0.9, fontSize: '0.92rem', maxWidth: '640px', lineHeight: '1.5' }}>
              Select your academic program (FYUGP, B.Tech, or PG), fill in your details, and submit payment receipt to finalize your internship registration.
            </p>
          </div>

          {/* Error Alert */}
          {appError && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px',
              background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px',
              color: '#dc2626', fontSize: '0.88rem', marginBottom: '22px'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{appError}</span>
            </div>
          )}

          {/* Application Form */}
          <form onSubmit={handleApplicationSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            
            {/* 1. Program Selection */}
            <div style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '18px', padding: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GraduationCap size={18} color="#2563eb" />
                <span>1. Select Internship Program</span>
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                {[
                  { code: 'FYUGP', title: 'FYUGP Track', desc: 'NEP 2020 Aligned Coursework', icon: GraduationCap },
                  { code: 'BTECH', title: 'B.Tech / B.E Track', desc: 'Engineering & Production Repos', icon: Cpu },
                  { code: 'PG', title: 'PG Advanced Track', desc: 'MCA, M.Tech, M.Sc Cohort', icon: Award }
                ].map((p) => {
                  const Icon = p.icon;
                  const isSel = selectedProgram === p.code;
                  return (
                    <div
                      key={p.code}
                      onClick={() => setSelectedProgram(p.code)}
                      style={{
                        padding: '18px', borderRadius: '14px',
                        border: isSel ? '2px solid #2563eb' : '1.5px solid #e2e8f0',
                        background: isSel ? '#eff6ff' : '#f8fafc',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <Icon size={22} color={isSel ? '#2563eb' : '#64748b'} />
                        {isSel && <span className="badge badge-blue" style={{ fontSize: '0.68rem' }}>Selected ✓</span>}
                      </div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: isSel ? '#1e3a8a' : '#0f172a', marginBottom: '4px' }}>
                        {p.title}
                      </h4>
                      <p style={{ fontSize: '0.78rem', color: '#64748b' }}>{p.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Student Academic Details */}
            <div style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '18px', padding: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={18} color="#2563eb" />
                <span>2. Student Academic & Contact Details</span>
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                    Full Name <span style={{ color: '#e11d48' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="student_name"
                    value={appForm.student_name}
                    onChange={handleAppFormChange}
                    placeholder="e.g. Rahul Sharma"
                    className="form-input"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                    Email Address <span style={{ color: '#e11d48' }}>*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={appForm.email}
                    onChange={handleAppFormChange}
                    placeholder="student@example.com"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                    Phone / WhatsApp Number <span style={{ color: '#e11d48' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    name="contact_number"
                    value={appForm.contact_number}
                    onChange={handleAppFormChange}
                    placeholder="+91 9876543210"
                    className="form-input"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                    College / University Name <span style={{ color: '#e11d48' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="college_name"
                    value={appForm.college_name}
                    onChange={handleAppFormChange}
                    placeholder="e.g. College of Engineering"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                    Department / Branch <span style={{ color: '#e11d48' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={appForm.department}
                    onChange={handleAppFormChange}
                    placeholder="e.g. Computer Science, MCA"
                    className="form-input"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                    Year of Study
                  </label>
                  <select
                    name="academic_year"
                    value={appForm.academic_year}
                    onChange={handleAppFormChange}
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

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Internship Domain Track <span style={{ color: '#e11d48' }}>*</span>
                </label>
                <select
                  name="domain"
                  value={appForm.domain}
                  onChange={handleAppFormChange}
                  className="form-select"
                  style={{ fontWeight: '600' }}
                >
                  <option value="AI Data Science">AI Data Science</option>
                  <option value="AIML">AIML</option>
                  <option value="Full Stack">Full Stack</option>
                  <option value="Full Stack with AI">Full Stack with AI</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                    HOD Name <span style={{ color: '#e11d48' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="hod_name"
                    value={appForm.hod_name}
                    onChange={handleAppFormChange}
                    placeholder="e.g. Dr. K. S. Nambiar"
                    className="form-input"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                    HOD Contact / Email
                  </label>
                  <input
                    type="text"
                    name="hod_contact"
                    value={appForm.hod_contact}
                    onChange={handleAppFormChange}
                    placeholder="+91 94470 11223"
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Required Internship Hours */}
            <div style={{
              background: '#ffffff',
              padding: '20px',
              borderRadius: '16px',
              border: '1.5px solid #bfdbfe',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Clock size={18} color="#2563eb" />
                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#1e3a8a', margin: 0 }}>
                  Required Internship Hours
                </h3>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '14px' }}>
                Choose the required duration mandated by your college/university:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '12px' }}>
                {[
                  { id: '120', label: '120 Hours', sub: 'Standard Track' },
                  { id: '240', label: '240 Hours', sub: 'Extended Track' },
                  { id: 'custom', label: 'Custom Hours', sub: 'Your Requirement' }
                ].map(opt => {
                  const isSel = hoursType === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setHoursType(opt.id)}
                      style={{
                        padding: '12px 8px',
                        borderRadius: '10px',
                        border: isSel ? '2px solid #2563eb' : '1.5px solid #cbd5e1',
                        background: isSel ? '#eff6ff' : '#ffffff',
                        color: isSel ? '#1d4ed8' : '#334155',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontWeight: '800', fontSize: '0.92rem' }}>{opt.label}</div>
                      <div style={{ fontSize: '0.7rem', color: isSel ? '#2563eb' : '#64748b' }}>{opt.sub}</div>
                    </button>
                  );
                })}
              </div>

              {hoursType === 'custom' && (
                <div style={{ marginTop: '10px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#1e3a8a', marginBottom: '4px' }}>
                    Enter Custom Hours: <span style={{ color: '#e11d48' }}>*</span>
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="number"
                      min="10"
                      max="1000"
                      value={customHours}
                      onChange={e => setCustomHours(e.target.value)}
                      placeholder="e.g. 60, 90, 150, 300"
                      className="form-input"
                      style={{ maxWidth: '200px', fontWeight: '700' }}
                    />
                    <span style={{ fontWeight: '700', color: '#1e3a8a', fontSize: '0.9rem' }}>Hours</span>
                  </div>
                </div>
              )}
            </div>



            {/* Submit Button */}
            <button
              type="submit"
              disabled={submittingApp}
              className="btn-primary"
              style={{
                width: '100%', padding: '14px', fontSize: '1rem', fontWeight: '800',
                justifyContent: 'center', borderRadius: '12px'
              }}
            >
              {submittingApp ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Submitting Application...</span>
                </>
              ) : (
                <>
                  <span>Submit Internship Application</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const handleCopyId = () => {
    navigator.clipboard.writeText(app.application_id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg('');
    try {
      const res = await api.updateStudentProfile(editForm);
      setApp(res.application);
      setIsEditing(false);
      setSaveMsg('Profile updated successfully!');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const isVerified = app.payment_status === 'Verified';
  const isApproved = app.application_status === 'Approved' || app.application_status === 'Enrolled';

  return (
    <div style={{ padding: '30px 0 80px 0', minHeight: '85vh' }}>
      <div className="container">

        {/* Top Header & Navigation Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '26px'
        }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={16} color="#ffffff" />
            </div>
            <span style={{ fontWeight: '800', fontSize: '1.05rem', color: '#0f172a' }}>LOOKA INTERNSHIP</span>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              onClick={() => setShowConfirmationModal(true)}
              style={{
                padding: '8px 16px',
                fontSize: '0.85rem',
                fontWeight: '700',
                background: '#eff6ff',
                border: '1.5px solid #bfdbfe',
                borderRadius: '10px',
                color: '#1d4ed8',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <CheckCircle2 size={15} color="#2563eb" />
              <span>Registration Confirmation</span>
            </button>

            <button 
              onClick={() => window.print()}
              className="btn-secondary"
              style={{
                padding: '8px 16px',
                fontSize: '0.85rem',
                background: '#ffffff',
                border: '1.5px solid #e2e8f0',
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Printer size={15} color="#2563eb" />
              <span>Print Slip</span>
            </button>

            {onLogout && (
              <button 
                onClick={onLogout}
                className="btn-secondary"
                style={{
                  padding: '8px 14px',
                  fontSize: '0.85rem',
                  color: '#e11d48',
                  background: '#ffffff',
                  border: '1.5px solid #fecdd3'
                }}
              >
                Logout
              </button>
            )}
          </div>
        </div>

        {/* Top Profile Summary Card */}
        <div style={{
          padding: '28px 32px',
          borderRadius: '20px',
          marginBottom: '26px',
          border: '1.5px solid #dbeafe',
          background: 'linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)',
          boxShadow: '0 4px 20px rgba(37, 99, 235, 0.08)'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <span className="badge badge-blue" style={{ fontSize: '0.75rem', fontWeight: '700' }}>
                  {app.program_code} INTERNSHIP
                </span>
                <span className="badge badge-purple" style={{ fontSize: '0.75rem', fontWeight: '700' }}>
                  {app.domain}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>
                  📅 {app.internship_month || 'May 2026'}
                </span>
                <span className="badge badge-green" style={{ fontSize: '0.75rem', fontWeight: '700' }}>
                  ⏱️ {app.internship_hours || '120 Hours'}
                </span>
              </div>

              <h1 style={{ fontSize: 'clamp(1.6rem, 2.6vw, 2.2rem)', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
                {app.student_name}
              </h1>
              <p style={{ color: '#475569', fontSize: '0.95rem', fontWeight: '500' }}>
                🏛️ {app.college_name} • {app.department}
              </p>
            </div>

            {/* Application ID Card */}
            <div style={{
              background: '#ffffff',
              padding: '16px 22px',
              borderRadius: '16px',
              border: '1.5px solid #bfdbfe',
              boxShadow: '0 2px 10px rgba(37, 99, 235, 0.08)',
              textAlign: 'right'
            }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '700', display: 'block' }}>
                Application ID
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                <p style={{ fontSize: '1.25rem', fontWeight: '800', color: '#2563eb', letterSpacing: '0.04em' }}>
                  {app.application_id}
                </p>
                <button
                  onClick={handleCopyId}
                  title="Copy ID"
                  style={{
                    background: copiedId ? '#10b981' : '#eff6ff',
                    border: '1px solid #bfdbfe',
                    color: copiedId ? '#fff' : '#2563eb',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {copiedId ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div style={{ marginTop: '8px' }}>
                <span className={`badge ${isApproved ? 'badge-green' : 'badge-yellow'}`}>
                  {isApproved ? '✓ Application Approved' : '⏳ Application Under Review'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Success Alert if just saved */}
        {saveMsg && (
          <div style={{
            padding: '12px 18px',
            background: '#ecfdf5',
            border: '1.5px solid #a7f3d0',
            borderRadius: '12px',
            color: '#065f46',
            marginBottom: '22px',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}>
            {saveMsg}
          </div>
        )}

        {/* Verification Progress Stepper */}
        <div style={{
          background: '#ffffff',
          padding: '28px',
          borderRadius: '20px',
          marginBottom: '26px',
          border: '1.5px solid #e2e8f0',
          boxShadow: '0 4px 18px rgba(0,0,0,0.03)'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '20px', color: '#0f172a' }}>
            Internship Onboarding Timeline
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px'
          }}>
            {[
              {
                step: 1,
                title: 'Application Received',
                desc: 'Submitted with student, HOD & college credentials',
                done: true
              },
              {
                step: 2,
                title: 'Academic & Hours Verification',
                desc: `${app.internship_hours || '120 Hours'} curriculum alignment confirmed`,
                done: isVerified || isApproved,
                pending: !(isVerified || isApproved)
              },
              {
                step: 3,
                title: 'Domain Track Allotted',
                desc: `${app.domain} cohort induction`,
                done: isApproved,
                pending: isVerified && !isApproved
              },
              {
                step: 4,
                title: 'Final Certificate / NOC',
                desc: 'University credit validation',
                done: app.application_status === 'Enrolled',
                pending: isApproved && app.application_status !== 'Enrolled'
              }
            ].map((st) => (
              <div 
                key={st.step}
                style={{
                  background: st.done ? '#f0fdf4' : st.pending ? '#fffbeb' : '#f8fafc',
                  border: st.done ? '1.5px solid #86efac' : st.pending ? '1.5px solid #fde68a' : '1.5px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '18px',
                  position: 'relative'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: st.done ? '#10b981' : st.pending ? '#f59e0b' : '#94a3b8',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  marginBottom: '10px'
                }}>
                  {st.done ? <Check size={18} strokeWidth={3} /> : st.step}
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '4px', color: st.done ? '#166534' : st.pending ? '#92400e' : '#1e293b' }}>
                  {st.title}
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Application Information */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          
          {/* Student & College info */}
          <div style={{
            background: '#ffffff',
            padding: '28px',
            borderRadius: '20px',
            border: '1.5px solid #e2e8f0',
            boxShadow: '0 4px 18px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>
                Academic & Contact Details
              </h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    color: '#2563eb',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer'
                  }}
                >
                  <Edit3 size={13} />
                  Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Phone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={editForm.contact_number}
                    onChange={e => setEditForm({ ...editForm, contact_number: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Department
                  </label>
                  <input
                    type="text"
                    value={editForm.department}
                    onChange={e => setEditForm({ ...editForm, department: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>
                    HOD Name
                  </label>
                  <input
                    type="text"
                    value={editForm.hod_name}
                    onChange={e => setEditForm({ ...editForm, hod_name: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>
                    HOD Contact
                  </label>
                  <input
                    type="text"
                    value={editForm.hod_contact}
                    onChange={e => setEditForm({ ...editForm, hod_contact: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Registration No
                  </label>
                  <input
                    type="text"
                    value={editForm.registration_no}
                    onChange={e => setEditForm({ ...editForm, registration_no: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                  <button type="submit" className="btn-primary" disabled={saving} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                    <Save size={14} />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.92rem' }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.78rem', fontWeight: '600' }}>Email Address</span>
                  <p style={{ color: '#0f172a', fontWeight: '600' }}>{app.email}</p>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.78rem', fontWeight: '600' }}>Contact Number</span>
                  <p style={{ color: '#0f172a', fontWeight: '600' }}>{app.contact_number}</p>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.78rem', fontWeight: '600' }}>College / University</span>
                  <p style={{ color: '#0f172a', fontWeight: '600' }}>{app.college_name}</p>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.78rem', fontWeight: '600' }}>Department & Academic Year</span>
                  <p style={{ color: '#0f172a', fontWeight: '600' }}>{app.department} ({app.academic_year || 'Current'})</p>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.78rem', fontWeight: '600' }}>HOD Reference</span>
                  <p style={{ color: '#0f172a', fontWeight: '600' }}>
                    {app.hod_name || 'Not provided'} {app.hod_contact ? `• ${app.hod_contact}` : ''}
                  </p>
                </div>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.78rem', fontWeight: '600' }}>Internship Month & Duration</span>
                  <p style={{ color: '#2563eb', fontWeight: '700' }}>
                    📅 {app.internship_month || 'May 2026'} ({app.duration_months || '1 Month'})
                  </p>
                </div>
                {app.registration_no && (
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.78rem', fontWeight: '600' }}>Roll / University Reg No</span>
                    <p style={{ color: '#0f172a', fontWeight: '600' }}>{app.registration_no}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Academic & Internship Curriculum Record */}
          <div style={{
            background: '#ffffff',
            padding: '28px',
            borderRadius: '20px',
            border: '1.5px solid #e2e8f0',
            boxShadow: '0 4px 18px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <Clock size={20} color="#2563eb" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Academic & Enrolment Record
              </h3>
            </div>

            <div style={{
              background: '#f8fafc',
              borderRadius: '14px',
              padding: '20px',
              border: '1.5px solid #e2e8f0',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.78rem', fontWeight: '600' }}>Program Track</span>
                  <p style={{ color: '#0f172a', fontWeight: '700', fontSize: '0.95rem', marginTop: '3px' }}>
                    {app.program_code} ({app.program_title || 'Internship Program'})
                  </p>
                </div>

                <div>
                  <span style={{ color: '#64748b', fontSize: '0.78rem', fontWeight: '600' }}>Specialization Domain</span>
                  <p style={{ color: '#2563eb', fontWeight: '700', fontSize: '0.95rem', marginTop: '3px' }}>
                    {app.domain}
                  </p>
                </div>

                <div>
                  <span style={{ color: '#64748b', fontSize: '0.78rem', fontWeight: '600' }}>Required Internship Hours</span>
                  <p style={{ color: '#059669', fontWeight: '800', fontSize: '1rem', marginTop: '3px' }}>
                    ⏱️ {app.internship_hours || '120 Hours'}
                  </p>
                </div>

                <div>
                  <span style={{ color: '#64748b', fontSize: '0.78rem', fontWeight: '600' }}>Starting Batch</span>
                  <p style={{ color: '#475569', fontWeight: '700', fontSize: '0.95rem', marginTop: '3px' }}>
                    📅 {app.internship_month || 'May 2026'}
                  </p>
                </div>
              </div>

              {app.admin_notes && (
                <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #e2e8f0' }}>
                  <span style={{ color: '#64748b', fontSize: '0.78rem', fontWeight: '600' }}>Faculty / Coordinator Remarks</span>
                  <p style={{ color: '#1e40af', fontSize: '0.88rem', fontWeight: '500', marginTop: '3px' }}>
                    {app.admin_notes}
                  </p>
                </div>
              )}
            </div>

            {/* Academic Credit Transfer Banner */}
            <div style={{
              background: '#f0fdf4',
              borderRadius: '12px',
              padding: '14px 18px',
              border: '1px solid #bbf7d0',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <CheckCircle2 size={20} color="#059669" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '0.84rem', color: '#166534', lineHeight: '1.4' }}>
                <strong>Academic Hours Validated:</strong> Your completion certificate and letter of recommendation will be officially accredited for <strong>{app.internship_hours || '120 Hours'}</strong> for university submission.
              </div>
            </div>
          </div>
        </div>

        {/* Official Registration Confirmation Modal */}
        {showConfirmationModal && (
          <div className="modal-overlay" onClick={() => setShowConfirmationModal(false)}>
            <div 
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '560px',
                padding: '36px',
                borderRadius: '24px',
                background: '#ffffff',
                border: '1.5px solid #bfdbfe',
                boxShadow: '0 25px 60px -15px rgba(37, 99, 235, 0.25)',
                textAlign: 'center',
                color: '#0f172a'
              }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '2px solid #10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto'
              }}>
                <CheckCircle2 size={36} color="#10b981" />
              </div>

              <span className="badge badge-green" style={{ marginBottom: '12px', fontSize: '0.8rem' }}>
                Official Registration Confirmed
              </span>

              <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
                {app.student_name}
              </h2>
              <p style={{ color: '#475569', fontSize: '0.92rem', marginBottom: '22px' }}>
                Registered in <strong>{app.program_code} Internship Track</strong> ({app.program_title || app.program_code})
              </p>

              {/* Application Details Summary */}
              <div style={{
                background: '#f8faff',
                border: '1.5px dashed #93c5fd',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '22px',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>
                    Application ID
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#2563eb' }}>
                      {app.application_id}
                    </span>
                    <button
                      onClick={handleCopyId}
                      style={{
                        background: copiedId ? '#10b981' : '#dbeafe',
                        border: 'none',
                        color: copiedId ? '#fff' : '#1d4ed8',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      {copiedId ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.85rem' }}>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>Program Track</span>
                    <strong style={{ color: '#0f172a' }}>{app.program_code} Track</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>Internship Domain</span>
                    <strong style={{ color: '#2563eb' }}>{app.domain}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>College Name</span>
                    <span style={{ color: '#334155' }}>{app.college_name}</span>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>Department</span>
                    <span style={{ color: '#334155' }}>{app.department}</span>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>Payment Status</span>
                    <span style={{ color: isVerified ? '#059669' : '#d97706', fontWeight: '700' }}>
                      {app.payment_status}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.72rem' }}>Transaction ID</span>
                    <span style={{ color: '#334155', fontWeight: '600' }}>{app.transaction_id}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => window.print()}
                  className="btn-primary"
                  style={{ flex: 1, padding: '12px', justifyContent: 'center' }}
                >
                  <Printer size={16} />
                  <span>Print Slip</span>
                </button>
                <button
                  onClick={() => setShowConfirmationModal(false)}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '12px', justifyContent: 'center' }}
                >
                  <span>Close</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
