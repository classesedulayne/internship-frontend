import React, { useState, useEffect, useCallback } from 'react';
import {
  Shield, Users, CheckCircle2, Clock, AlertTriangle, FileSpreadsheet,
  Search, Filter, ExternalLink, RefreshCw, Eye, Trash2, Check, X,
  Settings, Save, ArrowUpDown, ChevronDown, Layers, HelpCircle, Phone,
  Mail, TrendingUp, XCircle, ThumbsUp, ThumbsDown, IndianRupee, BarChart3,
  SlidersHorizontal, Ban
} from 'lucide-react';
import { api } from '../services/api';

/* ─────────────────────────── helpers ─────────────────────────── */
const statusColor = (ps) =>
  ps === 'Verified' ? '#34d399' : ps === 'Rejected' ? '#f87171' : '#fbbf24';
const statusBg = (ps) =>
  ps === 'Verified'
    ? 'rgba(16,185,129,0.15)'
    : ps === 'Rejected'
    ? 'rgba(239,68,68,0.15)'
    : 'rgba(245,158,11,0.15)';
const statusBorder = (ps) =>
  ps === 'Verified'
    ? 'rgba(16,185,129,0.3)'
    : ps === 'Rejected'
    ? 'rgba(239,68,68,0.3)'
    : 'rgba(245,158,11,0.3)';

/* ─────────────────────────── component ─────────────────────────── */
export default function AdminDashboard({ onLogout, onBackToHome }) {
  const [stats, setStats]               = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [activeTab, setActiveTab]       = useState('applications');

  /* filters */
  const [search, setSearch]             = useState('');
  const [filterProgram, setFilterProgram] = useState('ALL');
  const [filterDomain, setFilterDomain]   = useState('ALL');
  const [filterPayment, setFilterPayment] = useState('ALL');
  const [filterStatus, setFilterStatus]   = useState('ALL');

  /* modals */
  const [selectedApp, setSelectedApp]           = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(null);

  /* settings */
  const [settingsData, setSettingsData] = useState({
    portal_name: 'Looka Internship Portal',
    upi_id: 'looka.internship@upi',
    upi_name: 'Looka EdTech Solutions',
    default_fee: 999,
    support_email: 'internships@looka.com',
    support_phone: '+91 98765 43210',
    qr_code_note: 'Scan using GPay, PhonePe, or Paytm',
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMsg, setSettingsMsg]       = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, appsRes, setsRes] = await Promise.all([
        api.getAdminStats().catch(err => { console.warn('Stats fetch:', err); return null; }),
        api.getAdminApplications({
          search,
          program: filterProgram,
          domain: filterDomain,
          payment_status: filterPayment,
          status: filterStatus,
        }).catch(err => { console.warn('Apps fetch:', err); return { count: 0, applications: [] }; }),
        api.getAdminSettings().catch(() => null),
      ]);

      const appsList = appsRes?.applications || [];
      setApplications(appsList);

      if (statsRes) {
        setStats(statsRes);
      } else {
        // Compute live fallback stats from applications
        setStats({
          total_applications: appsList.length,
          programs: {
            FYUGP: appsList.filter(a => a.program_code === 'FYUGP').length,
            BTECH: appsList.filter(a => a.program_code === 'BTECH').length,
            PG: appsList.filter(a => a.program_code === 'PG').length,
          },
          payments: {
            pending: appsList.filter(a => a.payment_status === 'Pending').length,
            verified: appsList.filter(a => a.payment_status === 'Verified').length,
            rejected: appsList.filter(a => a.payment_status === 'Rejected').length,
          }
        });
      }

      if (setsRes) setSettingsData(setsRes);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  }, [search, filterProgram, filterDomain, filterPayment, filterStatus]);

  useEffect(() => { loadData(); }, [filterProgram, filterDomain, filterPayment, filterStatus]);

  const handleSearchSubmit = (e) => { e.preventDefault(); loadData(); };

  const handleUpdateStatus = async (appId, updates) => {
    setActionLoading(prev => ({ ...prev, [appId]: true }));
    try {
      const res = await api.updateApplicationStatus(appId, updates);
      setApplications(prev =>
        prev.map(a => a.application_id === appId ? res.application : a)
      );
      if (selectedApp?.application_id === appId) setSelectedApp(res.application);
      if (showReceiptModal?.application_id === appId) setShowReceiptModal(res.application);
      api.getAdminStats().then(s => setStats(s)).catch(() => {});
    } catch (err) {
      alert(err.message || 'Failed to update status');
    } finally {
      setActionLoading(prev => ({ ...prev, [appId]: false }));
    }
  };

  const activeFilters =
    filterProgram !== 'ALL' || filterDomain !== 'ALL' || filterPayment !== 'ALL' || filterStatus !== 'ALL' || search;

  const resetFilters = () => {
    setFilterProgram('ALL');
    setFilterDomain('ALL');
    setFilterPayment('ALL');
    setFilterStatus('ALL');
    setSearch('');
  };

  const handleDeleteApplication = async (appId) => {
    if (!window.confirm(`Are you sure you want to delete application ${appId}?`)) return;
    try {
      await api.deleteApplication(appId);
      setApplications(prev => prev.filter(a => a.application_id !== appId));
      if (selectedApp?.application_id === appId) setSelectedApp(null);
      api.getAdminStats().then(s => setStats(s)).catch(() => {});
    } catch (err) {
      alert(err.message || 'Failed to delete application');
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsMsg('');
    try {
      await api.updateAdminSettings(settingsData);
      setSettingsMsg('Portal settings updated successfully!');
      setTimeout(() => setSettingsMsg(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update settings');
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div style={{ padding: '30px 0 80px 0' }}>
      <div className="container">
        {/* Top Header */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Shield size={18} color="#fff" />
              </div>
              <span className="badge badge-purple" style={{ letterSpacing: '0.06em' }}>
                SUPERADMIN CONTROL PANEL
              </span>
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>
              Internship Applications <span className="gradient-text">Management</span>
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={onBackToHome}
              className="btn-secondary"
              style={{ padding: '8px 14px', fontSize: '0.85rem' }}
              title="View Programs"
            >
              <Eye size={15} />
              View Programs
            </button>

            <button
              onClick={() => setActiveTab(activeTab === 'applications' ? 'settings' : 'applications')}
              className="btn-secondary"
              style={{ padding: '8px 14px', fontSize: '0.85rem' }}
            >
              <Settings size={15} />
              {activeTab === 'applications' ? 'Portal Settings' : 'Applications List'}
            </button>

            <a
              href="/api/admin/export-csv/"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
              style={{ padding: '8px 14px', fontSize: '0.85rem', color: '#34d399' }}
            >
              <FileSpreadsheet size={15} />
              Export to Excel (CSV)
            </a>

            <button
              onClick={loadData}
              className="btn-secondary"
              style={{ padding: '8px 12px' }}
              title="Refresh Data"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>

            <button
              onClick={onLogout}
              className="btn-danger"
              style={{ padding: '8px 14px', fontSize: '0.85rem' }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* ══ KPI Stats Cards ══ */}
        {stats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(165px, 1fr))',
            gap: '16px', marginBottom: '28px',
          }}>
            {/* Total */}
            <div className="glass-panel" style={{
              padding: '20px 22px', borderRadius: '16px',
              border: '1px solid rgba(99,102,241,0.25)',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.05))',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.73rem', color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>Total Applications</span>
                <div style={{ background: 'rgba(99,102,241,0.2)', borderRadius: '8px', padding: '6px' }}><Users size={14} color="#818cf8" /></div>
              </div>
              <p style={{ fontSize: '2.2rem', fontWeight: '800', color: '#fff', lineHeight: 1 }}>{stats.total_applications}</p>
              <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '6px', display: 'block' }}>All Programs Combined</span>
            </div>

            {/* Pending Payments */}
            <div className="glass-panel" style={{
              padding: '20px 22px', borderRadius: '16px',
              border: '1px solid rgba(245,158,11,0.3)',
              background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(251,191,36,0.04))',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.73rem', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>Pending Payments</span>
                <div style={{ background: 'rgba(245,158,11,0.2)', borderRadius: '8px', padding: '6px' }}><Clock size={14} color="#f59e0b" /></div>
              </div>
              <p style={{ fontSize: '2.2rem', fontWeight: '800', color: '#f59e0b', lineHeight: 1 }}>{stats.payments?.pending || 0}</p>
              <button onClick={() => { setFilterPayment('Pending'); setActiveTab('applications'); }}
                style={{ fontSize: '0.72rem', color: '#fbbf24', background: 'none', marginTop: '6px', cursor: 'pointer', padding: 0 }}>
                View Pending →
              </button>
            </div>

            {/* Approved Payments */}
            <div className="glass-panel" style={{
              padding: '20px 22px', borderRadius: '16px',
              border: '1px solid rgba(16,185,129,0.3)',
              background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(52,211,153,0.04))',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.73rem', color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>Approved Payments</span>
                <div style={{ background: 'rgba(16,185,129,0.2)', borderRadius: '8px', padding: '6px' }}><CheckCircle2 size={14} color="#10b981" /></div>
              </div>
              <p style={{ fontSize: '2.2rem', fontWeight: '800', color: '#34d399', lineHeight: 1 }}>{stats.payments?.verified || 0}</p>
              <button onClick={() => { setFilterPayment('Verified'); setActiveTab('applications'); }}
                style={{ fontSize: '0.72rem', color: '#34d399', background: 'none', marginTop: '6px', cursor: 'pointer', padding: 0 }}>
                View Approved →
              </button>
            </div>

            {/* Rejected */}
            <div className="glass-panel" style={{
              padding: '20px 22px', borderRadius: '16px',
              border: '1px solid rgba(239,68,68,0.25)',
              background: 'linear-gradient(135deg, rgba(239,68,68,0.07), rgba(248,113,113,0.04))',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.73rem', color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>Rejected Payments</span>
                <div style={{ background: 'rgba(239,68,68,0.15)', borderRadius: '8px', padding: '6px' }}><XCircle size={14} color="#ef4444" /></div>
              </div>
              <p style={{ fontSize: '2.2rem', fontWeight: '800', color: '#f87171', lineHeight: 1 }}>{stats.payments?.rejected || 0}</p>
              <button onClick={() => { setFilterPayment('Rejected'); setActiveTab('applications'); }}
                style={{ fontSize: '0.72rem', color: '#f87171', background: 'none', marginTop: '6px', cursor: 'pointer', padding: 0 }}>
                View Rejected →
              </button>
            </div>

            {/* FYUGP */}
            <div className="glass-panel" style={{ padding: '20px 22px', borderRadius: '16px' }}>
              <span style={{ fontSize: '0.73rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>FYUGP</span>
              <p style={{ fontSize: '2rem', fontWeight: '800', color: '#34d399', marginTop: '8px', lineHeight: 1 }}>{stats.programs?.FYUGP || 0}</p>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>NEP Track</span>
            </div>

            {/* B.Tech */}
            <div className="glass-panel" style={{ padding: '20px 22px', borderRadius: '16px' }}>
              <span style={{ fontSize: '0.73rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>B.Tech</span>
              <p style={{ fontSize: '2rem', fontWeight: '800', color: '#60a5fa', marginTop: '8px', lineHeight: 1 }}>{stats.programs?.BTECH || 0}</p>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Engineering Cohort</span>
            </div>

            {/* PG */}
            <div className="glass-panel" style={{ padding: '20px 22px', borderRadius: '16px' }}>
              <span style={{ fontSize: '0.73rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>Postgraduate</span>
              <p style={{ fontSize: '2rem', fontWeight: '800', color: '#c084fc', marginTop: '8px', lineHeight: 1 }}>{stats.programs?.PG || 0}</p>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>MCA / M.Tech / M.Sc</span>
            </div>
          </div>
        )}

        {/* Tab 1: Applications Management */}
        {activeTab === 'applications' && (
          <div>
            {/* ── Search & Filter Bar ── */}
            <div className="glass-panel" style={{
              padding: '18px 20px', borderRadius: '18px', marginBottom: '16px',
              border: '1px solid rgba(255,255,255,0.07)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <SlidersHorizontal size={15} color="#7c3aed" />
                <span style={{ fontWeight: '700', fontSize: '0.88rem', color: 'var(--text-main)' }}>Search & Filters</span>
                {activeFilters && (
                  <span style={{ background: 'rgba(124,58,237,0.2)', color: '#a78bfa', fontSize: '0.72rem', padding: '2px 8px', borderRadius: '20px', fontWeight: '600' }}>
                    Active
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
                <form onSubmit={handleSearchSubmit} style={{ flex: '1 1 280px', display: 'flex', gap: '8px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={15} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input
                      type="text"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search name, college, email, transaction ID…"
                      className="form-input"
                      style={{ paddingLeft: '36px', height: '42px', fontSize: '0.875rem' }}
                    />
                  </div>
                  <button type="submit" className="btn-primary" style={{ padding: '0 18px', height: '42px', fontSize: '0.85rem', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Search size={14} /> Search
                  </button>
                </form>
                <div style={{ minWidth: '140px' }}>
                  <select value={filterProgram} onChange={e => setFilterProgram(e.target.value)} className="form-select" style={{ height: '42px', fontSize: '0.85rem' }}>
                    <option value="ALL">All Programs</option>
                    <option value="FYUGP">FYUGP</option>
                    <option value="BTECH">B.Tech</option>
                    <option value="PG">PG</option>
                  </select>
                </div>
                <div style={{ minWidth: '175px' }}>
                  <select value={filterDomain} onChange={e => setFilterDomain(e.target.value)} className="form-select" style={{ height: '42px', fontSize: '0.85rem' }}>
                    <option value="ALL">All Domains</option>
                    <option value="AI Data Science">AI Data Science</option>
                    <option value="AIML">AIML</option>
                    <option value="Full Stack">Full Stack</option>
                    <option value="Full Stack with AI">Full Stack with AI</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                  </select>
                </div>
                <div style={{ minWidth: '160px' }}>
                  <select value={filterPayment} onChange={e => setFilterPayment(e.target.value)} className="form-select" style={{ height: '42px', fontSize: '0.85rem' }}>
                    <option value="ALL">All Payment Status</option>
                    <option value="Pending">⏳ Pending Review</option>
                    <option value="Verified">✅ Verified / Approved</option>
                    <option value="Rejected">❌ Rejected</option>
                  </select>
                </div>
                {activeFilters && (
                  <button onClick={resetFilters} style={{
                    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
                    color: '#f87171', fontSize: '0.82rem', cursor: 'pointer',
                    padding: '8px 14px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px',
                  }}>
                    <X size={13} /> Reset
                  </button>
                )}
              </div>
            </div>

            {/* ── Summary Bar ── */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', padding: '0 4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-main)' }}>
                  {loading ? 'Loading…' : `${applications.length} Application${applications.length !== 1 ? 's' : ''} found`}
                </span>
                {activeFilters && <span style={{ fontSize: '0.78rem', color: '#a78bfa' }}>— filtered</span>}
              </div>
              <div style={{ display: 'flex', gap: '14px', fontSize: '0.78rem' }}>
                <span style={{ color: '#34d399' }}>✅ {applications.filter(a => a.payment_status === 'Verified').length} approved</span>
                <span style={{ color: '#fbbf24' }}>⏳ {applications.filter(a => a.payment_status === 'Pending').length} pending</span>
                <span style={{ color: '#f87171' }}>❌ {applications.filter(a => a.payment_status === 'Rejected').length} rejected</span>
              </div>
            </div>

            {/* Applications Table */}
            <div className="glass-panel" style={{ borderRadius: '18px', overflow: 'hidden' }}>


              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-glass)' }}>
                      {['App ID','Student & Contact','College & Dept','Domain & Track','Required Hours','Status','Quick Actions'].map(h => (
                        <th key={h} style={{ padding: '13px 16px', color: 'var(--text-dim)', fontWeight: '700', fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="7" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-dim)' }}>
                          <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 12px', display: 'block', opacity: 0.5 }} />
                          Loading applications…
                        </td>
                      </tr>
                    ) : applications.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-dim)' }}>
                          <Filter size={28} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.4 }} />
                          No applications match the current search or filters.
                        </td>
                      </tr>
                    ) : (
                      applications.map((app) => {
                        const ps = app.payment_status;
                        const isVerified = ps === 'Verified';
                        const isRejected = ps === 'Rejected';
                        const appLoading = actionLoading[app.application_id];

                        return (
                          <tr
                            key={app.application_id}
                            style={{ borderBottom: '1px solid rgba(255,255,255,0.035)', transition: 'background 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            {/* App ID */}
                            <td style={{ padding: '13px 16px', fontWeight: '700', color: '#60a5fa', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                              {app.application_id}
                            </td>

                            {/* Student */}
                            <td style={{ padding: '13px 16px', minWidth: '155px' }}>
                              <p style={{ fontWeight: '700', color: '#fff', marginBottom: '2px' }}>{app.student_name}</p>
                              <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>{app.email}</span>
                              <div style={{ fontSize: '0.73rem', color: '#64748b', marginTop: '1px' }}>{app.contact_number}</div>
                            </td>

                            {/* College */}
                            <td style={{ padding: '13px 16px', minWidth: '155px' }}>
                              <p style={{ color: '#e2e8f0', fontSize: '0.83rem', fontWeight: '600', marginBottom: '2px' }}>{app.college_name}</p>
                              <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>{app.department} ({app.academic_year})</span>
                              <div style={{ fontSize: '0.73rem', color: '#64748b', marginTop: '1px' }}>HOD: {app.hod_name}</div>
                            </td>

                            {/* Domain & Program */}
                            <td style={{ padding: '13px 16px' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'flex-start' }}>
                                <span className="badge badge-purple" style={{ fontSize: '0.71rem' }}>{app.domain}</span>
                                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                  <span className={`badge ${app.program_code === 'BTECH' ? 'badge-blue' : 'badge-green'}`} style={{ fontSize: '0.68rem' }}>
                                    {app.program_code}
                                  </span>
                                  <span style={{ fontSize: '0.7rem', color: '#93c5fd' }}>📅 {app.internship_month || 'May 2026'}</span>
                                </div>
                              </div>
                            </td>

                            {/* Required Internship Hours */}
                            <td style={{ padding: '13px 16px' }}>
                              <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '5px 10px',
                                borderRadius: '8px',
                                background: 'rgba(59, 130, 246, 0.12)',
                                border: '1px solid rgba(59, 130, 246, 0.3)',
                                color: '#93c5fd',
                                fontSize: '0.82rem',
                                fontWeight: '700',
                                whiteSpace: 'nowrap'
                              }}>
                                <Clock size={13} color="#60a5fa" />
                                <span>{app.internship_hours || '120 Hours'}</span>
                              </div>
                              {app.screenshot_url && (
                                <div style={{ marginTop: '4px' }}>
                                  <button onClick={() => setShowReceiptModal(app)} style={{
                                    background: 'transparent', border: 'none',
                                    color: '#94a3b8', padding: '2px 0',
                                    fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '3px', cursor: 'pointer',
                                  }}>
                                    <Eye size={10} /> View Document
                                  </button>
                                </div>
                              )}
                            </td>

                            {/* Payment Status Badge */}
                            <td style={{ padding: '13px 16px' }}>
                              <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                background: statusBg(ps), border: `1px solid ${statusBorder(ps)}`,
                                borderRadius: '20px', padding: '5px 10px',
                              }}>
                                {isVerified && <CheckCircle2 size={13} color="#34d399" />}
                                {ps === 'Pending' && <Clock size={13} color="#fbbf24" />}
                                {isRejected && <XCircle size={13} color="#f87171" />}
                                <span style={{ fontSize: '0.78rem', fontWeight: '700', color: statusColor(ps), whiteSpace: 'nowrap' }}>
                                  {isVerified ? 'Approved' : isRejected ? 'Rejected' : 'Pending'}
                                </span>
                              </div>
                            </td>

                            {/* Quick Actions */}
                            <td style={{ padding: '13px 16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'nowrap' }}>
                                {!isVerified && (
                                  <button
                                    onClick={() => handleUpdateStatus(app.application_id, { payment_status: 'Verified', application_status: 'Approved' })}
                                    disabled={appLoading}
                                    title="Approve Payment"
                                    style={{
                                      background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)',
                                      color: '#34d399', padding: '6px 10px', borderRadius: '8px',
                                      fontSize: '0.75rem', fontWeight: '700', cursor: appLoading ? 'not-allowed' : 'pointer',
                                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                                      opacity: appLoading ? 0.6 : 1, whiteSpace: 'nowrap',
                                    }}
                                  >
                                    <ThumbsUp size={13} /> Approve
                                  </button>
                                )}
                                {!isRejected && (
                                  <button
                                    onClick={() => handleUpdateStatus(app.application_id, { payment_status: 'Rejected' })}
                                    disabled={appLoading}
                                    title="Reject Payment"
                                    style={{
                                      background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                                      color: '#f87171', padding: '6px 10px', borderRadius: '8px',
                                      fontSize: '0.75rem', fontWeight: '700', cursor: appLoading ? 'not-allowed' : 'pointer',
                                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                                      opacity: appLoading ? 0.6 : 1, whiteSpace: 'nowrap',
                                    }}
                                  >
                                    <ThumbsDown size={13} /> Reject
                                  </button>
                                )}
                                <button onClick={() => setSelectedApp(app)} title="View Detail"
                                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', padding: '6px 8px', borderRadius: '8px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                                  <Eye size={14} />
                                </button>
                                <button onClick={() => handleDeleteApplication(app.application_id)} title="Delete"
                                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', padding: '6px 8px', borderRadius: '8px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              {!loading && applications.length > 0 && (
                <div style={{ padding: '11px 20px', borderTop: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.01)' }}>
                  <span style={{ fontSize: '0.77rem', color: 'var(--text-dim)' }}>Showing {applications.length} record{applications.length !== 1 ? 's' : ''}</span>
                  <span style={{ fontSize: '0.74rem', color: '#475569' }}>MongoDB · internship_applications</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Portal Settings (UPI & Fees) */}
        {activeTab === 'settings' && (
          <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px', maxWidth: '680px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '8px' }}>
              Portal Payment & Contact Settings
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '24px' }}>
              Configure your official UPI ID, QR instructions, and student support contact details.
            </p>

            {settingsMsg && (
              <div style={{
                padding: '12px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '8px',
                color: '#34d399',
                marginBottom: '20px',
                fontSize: '0.88rem'
              }}>
                {settingsMsg}
              </div>
            )}

            <form onSubmit={handleSaveSettings}>
              <div className="form-group">
                <label className="form-label">Portal Brand Name</label>
                <input
                  type="text"
                  value={settingsData.portal_name}
                  onChange={e => setSettingsData({ ...settingsData, portal_name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">UPI ID for Registration Payments</label>
                  <input
                    type="text"
                    value={settingsData.upi_id}
                    onChange={e => setSettingsData({ ...settingsData, upi_id: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Account Payee Name</label>
                  <input
                    type="text"
                    value={settingsData.upi_name}
                    onChange={e => setSettingsData({ ...settingsData, upi_name: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Default Registration Fee (INR)</label>
                <input
                  type="number"
                  value={settingsData.default_fee}
                  onChange={e => setSettingsData({ ...settingsData, default_fee: parseInt(e.target.value) || 0 })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Student Support Email</label>
                  <input
                    type="email"
                    value={settingsData.support_email}
                    onChange={e => setSettingsData({ ...settingsData, support_email: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Student Support Phone</label>
                  <input
                    type="text"
                    value={settingsData.support_phone}
                    onChange={e => setSettingsData({ ...settingsData, support_phone: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">QR Code Note / Instructions</label>
                <input
                  type="text"
                  value={settingsData.qr_code_note}
                  onChange={e => setSettingsData({ ...settingsData, qr_code_note: e.target.value })}
                  className="form-input"
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={savingSettings}
                style={{ marginTop: '10px' }}
              >
                <Save size={16} />
                {savingSettings ? 'Saving...' : 'Save Portal Settings'}
              </button>
            </form>
          </div>
        )}

        {/* Modal: Full Application Detail View */}
        {selectedApp && (
          <div className="modal-overlay" onClick={() => setSelectedApp(null)}>
            <div
              className="glass-panel"
              onClick={e => e.stopPropagation()}
              style={{ width: '100%', maxWidth: '660px', padding: '30px', borderRadius: '20px', background: 'rgba(9,14,26,0.98)', maxHeight: '90vh', overflowY: 'auto' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <span className="badge badge-blue">{selectedApp.program_code}</span>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: '800', marginTop: '6px', marginBottom: '2px' }}>{selectedApp.student_name}</h3>
                  <span style={{ fontSize: '0.8rem', color: '#60a5fa' }}>{selectedApp.application_id}</span>
                </div>
                <button onClick={() => setSelectedApp(null)}
                  style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                  <X size={16} />
                </button>
              </div>

              {/* Payment Status + Quick Actions */}
              <div style={{
                padding: '14px 18px', borderRadius: '12px', marginBottom: '20px',
                background: statusBg(selectedApp.payment_status), border: `1px solid ${statusBorder(selectedApp.payment_status)}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {selectedApp.payment_status === 'Verified' && <CheckCircle2 size={20} color="#34d399" />}
                  {selectedApp.payment_status === 'Pending'  && <Clock size={20} color="#fbbf24" />}
                  {selectedApp.payment_status === 'Rejected' && <XCircle size={20} color="#f87171" />}
                  <div>
                    <p style={{ fontWeight: '800', color: statusColor(selectedApp.payment_status), fontSize: '0.95rem' }}>Payment: {selectedApp.payment_status}</p>
                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>UTR / Txn: {selectedApp.transaction_id || 'N/A'}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {selectedApp.payment_status !== 'Verified' && (
                    <button onClick={() => handleUpdateStatus(selectedApp.application_id, { payment_status: 'Verified', application_status: 'Approved' })}
                      disabled={actionLoading[selectedApp.application_id]}
                      style={{ background: 'rgba(16,185,129,0.18)', border: '1px solid rgba(16,185,129,0.4)', color: '#34d399', padding: '7px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ThumbsUp size={14} /> Approve
                    </button>
                  )}
                  {selectedApp.payment_status !== 'Rejected' && (
                    <button onClick={() => handleUpdateStatus(selectedApp.application_id, { payment_status: 'Rejected' })}
                      disabled={actionLoading[selectedApp.application_id]}
                      style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)', color: '#f87171', padding: '7px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ThumbsDown size={14} /> Reject
                    </button>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.88rem', marginBottom: '20px' }}>
                {[
                  { label: 'Email', value: selectedApp.email },
                  { label: 'Phone', value: selectedApp.contact_number },
                  { label: 'College', value: selectedApp.college_name },
                  { label: 'Department & Year', value: `${selectedApp.department} (${selectedApp.academic_year})` },
                  { label: 'Specialization Domain', value: selectedApp.domain, color: '#a78bfa', bold: true },
                  { label: 'Required Internship Hours', value: `⏱️ ${selectedApp.internship_hours || '120 Hours'}`, color: '#38bdf8', bold: true },
                  { label: 'Internship Month & Duration', value: `📅 ${selectedApp.internship_month || 'May 2026'} (${selectedApp.duration_months || '1 Month'})`, color: '#60a5fa', bold: true },
                  { label: 'HOD Reference', value: `${selectedApp.hod_name} (${selectedApp.hod_contact || 'No contact'})` },
                  { label: 'Registration No.', value: selectedApp.registration_no || '—' },
                ].map(({ label, value, color, bold }) => (
                  <div key={label}>
                    <span style={{ color: 'var(--text-dim)', fontSize: '0.73rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
                    <p style={{ color: color || '#e2e8f0', fontWeight: bold ? '700' : '500', marginTop: '2px' }}>{value}</p>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label className="form-label">SuperAdmin Internal Note</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="text" defaultValue={selectedApp.admin_notes || ''} id="admin_note_input"
                    placeholder="e.g. Verified via GPay transaction history" className="form-input" />
                  <button
                    onClick={() => { const text = document.getElementById('admin_note_input').value; handleUpdateStatus(selectedApp.application_id, { admin_notes: text }); }}
                    className="btn-primary" style={{ padding: '0 14px', fontSize: '0.85rem', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Save size={14} /> Save
                  </button>
                </div>
              </div>

              {selectedApp.screenshot_url && (
                <div>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.78rem', display: 'block', marginBottom: '8px' }}>Payment Screenshot:</span>
                  <img src={selectedApp.screenshot_url} alt="Receipt"
                    style={{ width: '100%', maxHeight: '260px', objectFit: 'contain', background: '#000', borderRadius: '10px' }} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal: Receipt Lightbox */}
        {showReceiptModal && (
          <div className="modal-overlay" onClick={() => setShowReceiptModal(null)}>
            <div
              className="glass-panel"
              onClick={e => e.stopPropagation()}
              style={{ width: '100%', maxWidth: '720px', padding: '26px', borderRadius: '20px', background: 'rgba(9,14,26,0.98)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#fff', marginBottom: '3px' }}>Payment Receipt Verification</h3>
                  <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                    {showReceiptModal.student_name} &nbsp;·&nbsp; UTR: <strong style={{ color: '#34d399' }}>{showReceiptModal.transaction_id}</strong>
                  </span>
                </div>
                <button onClick={() => setShowReceiptModal(null)}
                  style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <X size={16} />
                </button>
              </div>

              {/* Current Status */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px',
                background: statusBg(showReceiptModal.payment_status), border: `1px solid ${statusBorder(showReceiptModal.payment_status)}`,
                borderRadius: '20px', padding: '5px 12px',
              }}>
                {showReceiptModal.payment_status === 'Verified' && <CheckCircle2 size={13} color="#34d399" />}
                {showReceiptModal.payment_status === 'Pending'  && <Clock size={13} color="#fbbf24" />}
                {showReceiptModal.payment_status === 'Rejected' && <XCircle size={13} color="#f87171" />}
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: statusColor(showReceiptModal.payment_status) }}>
                  Current Status: {showReceiptModal.payment_status}
                </span>
              </div>

              <div style={{ background: '#000', borderRadius: '12px', padding: '10px', marginBottom: '20px', maxHeight: '55vh', overflowY: 'auto' }}>
                <img src={showReceiptModal.screenshot_url} alt="Receipt Preview"
                  style={{ maxWidth: '100%', maxHeight: '52vh', objectFit: 'contain', display: 'block', margin: '0 auto' }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
                <button
                  onClick={() => { handleUpdateStatus(showReceiptModal.application_id, { payment_status: 'Verified', application_status: 'Approved' }); setShowReceiptModal(null); }}
                  className="btn-success"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', fontSize: '0.9rem', fontWeight: '700' }}>
                  <ThumbsUp size={16} /> Approve Payment
                </button>
                <button
                  onClick={() => { handleUpdateStatus(showReceiptModal.application_id, { payment_status: 'Rejected' }); setShowReceiptModal(null); }}
                  className="btn-danger"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', fontSize: '0.9rem', fontWeight: '700' }}>
                  <ThumbsDown size={16} /> Reject Payment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
