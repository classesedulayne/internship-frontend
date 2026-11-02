import React from 'react';
import { GraduationCap, Cpu, Award, ArrowRight, ArrowLeft, Search, Users, CheckCircle2 } from 'lucide-react';

export default function HomePage({ 
  onSelectProgram, 
  onOpenTrackStatus,
  authUser,
  onGoToAdminDashboard
}) {
  const programs = [
    {
      code: 'FYUGP',
      title: 'FYUGP Internship',
      subtitle: 'Four Year Undergraduate Programme',
      badge: 'NEP 2020 Aligned',
      eligibility: '1st to 4th Year FYUGP Students',
      icon: GraduationCap,
      color: '#2563eb',
      badgeClass: 'badge-blue',
      iconBg: '#eff6ff',
      iconBorder: '#bfdbfe',
      features: [
        'University Credit Validation Certificate',
        'Direct Industry Mentorship',
        'Flexible College Shift Timings'
      ]
    },
    {
      code: 'BTECH',
      title: 'B.Tech / B.E Internship',
      subtitle: 'Engineering & Technology Cohort',
      badge: 'Engineering Track',
      eligibility: 'B.Tech / B.E (All Branches)',
      icon: Cpu,
      color: '#7c3aed',
      badgeClass: 'badge-purple',
      iconBg: '#f5f3ff',
      iconBorder: '#ddd6fe',
      features: [
        'Production Repo Contributions',
        'Industry Experience Credential',
        'Interview Preparation & Referrals'
      ]
    },
    {
      code: 'PG',
      title: 'PG Internship',
      subtitle: 'Postgraduate Advanced Cohort',
      badge: 'Advanced Track',
      eligibility: 'MCA, M.Tech, M.Sc Students',
      icon: Award,
      color: '#059669',
      badgeClass: 'badge-green',
      iconBg: '#ecfdf5',
      iconBorder: '#a7f3d0',
      features: [
        'Final Year Major Project Guidance',
        'Cloud-Native & Distributed Systems',
        'Direct Fast-Track Placement Pipeline'
      ]
    }
  ];

  return (
    <div style={{
      minHeight: '75vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px 20px',
      maxWidth: '1140px',
      margin: '0 auto'
    }}>


      {/* Left-side back arrow to Dashboard */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', marginBottom: '20px' }}>
        <button
          onClick={onGoToAdminDashboard}
          title="Back to Dashboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            background: '#ffffff',
            border: '1.5px solid #cbd5e1',
            borderRadius: '12px',
            color: '#1e293b',
            fontWeight: '600',
            fontSize: '0.95rem',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#2563eb';
            e.currentTarget.style.color = '#2563eb';
            e.currentTarget.style.transform = 'translateX(-3px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#cbd5e1';
            e.currentTarget.style.color = '#1e293b';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
          <span>Dashboard</span>
        </button>
      </div>
      {/* Clean Portal Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 3.5vw, 2.7rem)',
          fontWeight: '800',
          letterSpacing: '-0.02em',
          color: '#0f172a',
          marginBottom: '10px'
        }}>
          Select Your <span className="gradient-text">Internship Program</span>
        </h1>
        <p style={{
          color: '#475569',
          fontSize: '1.05rem',
          maxWidth: '580px',
          margin: '0 auto',
          fontWeight: '500'
        }}>
          Choose your academic qualification to begin your internship registration:
        </p>
      </div>

      {/* 3 High-Contrast Cards: FYUGP, B.Tech, PG */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
        gap: '26px',
        width: '100%',
        marginBottom: '36px'
      }}>
        {programs.map((p) => {
          const IconComponent = p.icon;
          return (
            <div
              key={p.code}
              style={{
                borderRadius: '20px',
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: '#ffffff',
                border: '1.5px solid rgba(37, 99, 235, 0.12)',
                boxShadow: '0 8px 30px rgba(37, 99, 235, 0.08)',
                transition: 'all 0.25s ease'
              }}
            >
              <div>
                {/* Header Icon & Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '14px',
                    background: p.iconBg,
                    border: `1.5px solid ${p.iconBorder}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}>
                    <IconComponent size={28} color={p.color} />
                  </div>
                  <span className={`badge ${p.badgeClass}`} style={{ fontSize: '0.78rem', fontWeight: '700' }}>
                    {p.badge}
                  </span>
                </div>

                {/* Title */}
                <h2 style={{ fontSize: '1.55rem', fontWeight: '800', marginBottom: '6px', color: '#0f172a', letterSpacing: '-0.01em' }}>
                  {p.title}
                </h2>
                <p style={{ color: '#475569', fontSize: '0.92rem', marginBottom: '20px', fontWeight: '500' }}>
                  {p.subtitle}
                </p>

                {/* Eligibility */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.85rem',
                  color: '#475569',
                  marginBottom: '20px',
                  fontWeight: '500'
                }}>
                  <Users size={16} color="#059669" style={{ flexShrink: 0 }} />
                  <span>{p.eligibility}</span>
                </div>

                {/* Feature bullets */}
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                  {p.features.map((feat, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#1e293b', fontWeight: '500' }}>
                      <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0 }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button - Directly opens the form */}
              <button
                onClick={() => onSelectProgram(p.code)}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '1rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  borderRadius: '12px',
                  letterSpacing: '0.01em'
                }}
              >
                <span>Apply for {p.code}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Bottom Track Application Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '12px 28px',
        background: '#ffffff',
        border: '1px solid rgba(37, 99, 235, 0.15)',
        borderRadius: '9999px',
        fontSize: '0.92rem',
        color: '#475569',
        boxShadow: '0 2px 10px rgba(37, 99, 235, 0.05)'
      }}>
        <span>Already submitted your application?</span>
        <button
          onClick={onOpenTrackStatus}
          style={{
            background: 'none',
            border: 'none',
            color: '#2563eb',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.92rem'
          }}
        >
          <Search size={15} />
          <span>Track Status</span>
        </button>
      </div>
    </div>
  );
}
