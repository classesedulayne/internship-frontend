import React, { useState } from 'react';
import { GraduationCap, Cpu, Award, CheckCircle2, ArrowRight, Clock, Users, Sparkles, CreditCard } from 'lucide-react';

export default function ProgramSelector({ programs = [], onSelectProgram }) {
  const [activeCategory, setActiveCategory] = useState('ALL'); // 'ALL' | 'FYUGP' | 'BTECH' | 'PG'

  // Fallback defaults if api is loading
  const defaultPrograms = [
    {
      code: 'FYUGP',
      title: 'Four Year Undergraduate Programme (FYUGP)',
      subtitle: 'NEP 2020 Aligned Industry Immersion',
      badge: 'NEP 2020 Aligned',
      duration: '1 - 6 Months',
      fee: 999,
      eligibility: '1st to 4th Year FYUGP Students',
      icon: 'GraduationCap',
      description: 'Structured internship tailored for FYUGP undergraduate students. Satisfies academic credit requirements with live industrial capstones and university letter of recommendation.',
      perks: [
        'University Credit Transfer Certificate',
        'Direct Mentorship from Industry Tech Leads',
        'Flexible Hours Aligned with College Timings',
        'Capstone Project Verification for HOD & College'
      ],
      popular: false
    },
    {
      code: 'BTECH',
      title: 'B.Tech / B.E Engineering Internship',
      subtitle: 'Core Engineering Production Cohort',
      badge: 'Most Popular',
      duration: '1 - 6 Months',
      fee: 999,
      eligibility: 'B.Tech / B.E (CSE, IT, ECE, EEE & Allied)',
      icon: 'Cpu',
      description: 'Intensive engineering development track. Build scalable microservices, AI pipelines, modern web applications, and cyber protection architectures with production Git workflows.',
      perks: [
        'Hands-on Real Production Repo Contributions',
        'Internship Experience Certificate & Verified Credential',
        'Direct Referrals to Hiring Partner Companies',
        'Technical Mock Interviews & Resume Revamp'
      ],
      popular: true
    },
    {
      code: 'PG',
      title: 'Postgraduate Advanced Internship (PG)',
      subtitle: 'Masters & Specialized Research Cohort',
      badge: 'Advanced Track',
      duration: '3 - 6 Months',
      fee: 1299,
      eligibility: 'MCA, M.Tech, M.Sc CS/IT/Data Science',
      icon: 'Award',
      description: 'Designed specifically for master’s degree candidates seeking enterprise-grade problem statements, distributed architectures, and AI/ML model deployment systems.',
      perks: [
        'Master’s Final Year Major Project Proof & Docs',
        'Deep-Dive Cloud-Native & High-Concurrency Systems',
        'Executive Recommendation Letter from Head of Tech',
        'Fast-Track Placement Pipeline for Senior Roles'
      ],
      popular: false
    }
  ];

  const fullList = programs && programs.length > 0 ? programs : defaultPrograms;
  const list = activeCategory === 'ALL' ? fullList : fullList.filter(p => p.code === activeCategory);

  const renderIcon = (iconName, isPopular) => {
    const props = { size: 28, color: isPopular ? '#60a5fa' : '#a78bfa' };
    if (iconName === 'GraduationCap') return <GraduationCap {...props} />;
    if (iconName === 'Cpu') return <Cpu {...props} />;
    return <Award {...props} />;
  };

  return (
    <section id="programs-section" style={{ padding: '60px 0 40px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 40px auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            borderRadius: '9999px',
            marginBottom: '18px'
          }}>
            <Sparkles size={16} color="#60a5fa" />
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#93c5fd' }}>
              Official Internship Categories • FYUGP, B.Tech & PG
            </span>
          </div>

          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '16px' }}>
            Choose Your <span className="gradient-text">Internship Category</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '28px' }}>
            താഴെ നൽകിയിട്ടുള്ള 3 കാറ്റഗറികളിൽ നിങ്ങളുടെ യോഗ്യതയ്ക്കനുയോജ്യമായ കോഴ്സ് തിരഞ്ഞെടുത്ത് ഇപ്പോൾ തന്നെ അപേക്ഷിക്കൂ:
          </p>

          {/* Category Filter Tabs */}
          <div style={{
            display: 'inline-flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '10px',
            background: 'rgba(15, 23, 42, 0.8)',
            padding: '6px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {[
              { id: 'ALL', label: 'All 3 Categories' },
              { id: 'FYUGP', label: '🎓 FYUGP Track' },
              { id: 'BTECH', label: '⚙️ B.Tech / B.E Track' },
              { id: 'PG', label: '🏆 PG (MCA / M.Tech / M.Sc)' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                style={{
                  padding: '9px 18px',
                  borderRadius: '12px',
                  border: 'none',
                  background: activeCategory === tab.id ? 'linear-gradient(135deg, #2563eb, #7c3aed)' : 'transparent',
                  color: activeCategory === tab.id ? '#ffffff' : 'var(--text-muted)',
                  fontWeight: activeCategory === tab.id ? '700' : '500',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: activeCategory === tab.id ? '0 4px 14px rgba(37, 99, 235, 0.35)' : 'none'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3 Programs Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: list.length === 1 ? 'minmax(320px, 560px)' : 'repeat(auto-fit, minmax(320px, 1fr))',
          justifyContent: 'center',
          gap: '30px',
          alignItems: 'stretch'
        }}>
          {list.map((prog) => {
            const isBtech = prog.code === 'BTECH' || prog.popular;

            return (
              <div
                key={prog.code}
                className="glass-panel glass-card-interactive"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '36px 30px',
                  borderRadius: '20px',
                  border: isBtech ? '2px solid rgba(59, 130, 246, 0.45)' : '1px solid var(--border-glass)',
                  background: isBtech ? 'rgba(15, 23, 42, 0.85)' : 'rgba(15, 23, 42, 0.65)',
                  boxShadow: isBtech ? '0 12px 35px -8px rgba(37, 99, 235, 0.25)' : 'var(--shadow-card)',
                  position: 'relative'
                }}
              >
                {/* Popular / Feature Pill */}
                {isBtech && (
                  <div style={{
                    position: 'absolute',
                    top: '-13px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                    color: '#fff',
                    padding: '4px 14px',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    letterSpacing: '0.04em',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)'
                  }}>
                    MOST POPULAR COHORT
                  </div>
                )}

                {/* Top icon & badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '14px',
                    background: isBtech ? 'rgba(59, 130, 246, 0.15)' : 'rgba(139, 92, 246, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${isBtech ? 'rgba(59, 130, 246, 0.3)' : 'rgba(139, 92, 246, 0.3)'}`
                  }}>
                    {renderIcon(prog.icon, isBtech)}
                  </div>
                  <span className={`badge ${isBtech ? 'badge-blue' : prog.code === 'PG' ? 'badge-purple' : 'badge-green'}`}>
                    {prog.badge || prog.code}
                  </span>
                </div>

                {/* Title */}
                <h3 style={{ fontSize: '1.45rem', fontWeight: '700', marginBottom: '8px', lineHeight: '1.3' }}>
                  {prog.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px', lineHeight: '1.5' }}>
                  {prog.description}
                </p>

                {/* Meta details */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  padding: '14px 16px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '12px',
                  marginBottom: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <Clock size={16} color="#60a5fa" />
                    <span>Duration: <strong style={{ color: '#fff' }}>{prog.duration}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <Users size={16} color="#34d399" />
                    <span>Eligibility: <strong style={{ color: '#fff' }}>{prog.eligibility}</strong></span>
                  </div>
                </div>

                {/* Perks list */}
                <div style={{ marginBottom: '30px', flex: 1 }}>
                  <p style={{ fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.05em', marginBottom: '12px' }}>
                    Program Inclusions
                  </p>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {(prog.perks || []).map((perk, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
                        <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Fee and Action button */}
                {/* Internship Hours Highlight */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: 'rgba(59, 130, 246, 0.08)',
                  borderRadius: '10px',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={15} color="#60a5fa" />
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Required Hours:</span>
                  </div>
                  <span style={{ fontSize: '0.92rem', fontWeight: '800', color: '#60a5fa' }}>
                    120 / 240+ Hours
                  </span>
                </div>

                <button
                  onClick={() => onSelectProgram(prog.code)}
                  className={isBtech ? 'btn-primary' : 'btn-secondary'}
                  style={{
                    width: '100%',
                    padding: '14px',
                    fontSize: '0.98rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                >
                  <span>Open {prog.code} Application Form</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
