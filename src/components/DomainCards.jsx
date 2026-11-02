import React from 'react';
import { Database, Brain, Globe, Bot, Shield, ChevronRight, Layers } from 'lucide-react';

export default function DomainCards({ domains = [], onSelectDomain }) {
  const getDomainIcon = (id) => {
    switch (id) {
      case 'ai_datascience':
        return <Database size={26} color="#3B82F6" />;
      case 'aiml':
        return <Brain size={26} color="#8B5CF6" />;
      case 'fullstack':
        return <Globe size={26} color="#10B981" />;
      case 'fullstack_ai':
        return <Bot size={26} color="#F59E0B" />;
      case 'cybersecurity':
        return <Shield size={26} color="#EC4899" />;
      default:
        return <Layers size={26} color="#60A5FA" />;
    }
  };

  return (
    <section id="domains-section" style={{ padding: '60px 0', background: 'rgba(15, 23, 42, 0.4)' }}>
      <div className="container">
        {/* Section Heading */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 45px auto' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: '800', marginBottom: '12px' }}>
            5 High-Impact <span className="gradient-text">Specialization Domains</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.6' }}>
            Choose the technology stack you wish to master. Each domain includes mentor guidance, live production code repositories, and capstone evaluations.
          </p>
        </div>

        {/* 5 Domains Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {domains.map((dom) => (
            <div
              key={dom.id}
              className="glass-panel glass-card-interactive"
              onClick={() => onSelectDomain(dom.name)}
              style={{
                padding: '28px 24px',
                borderRadius: '16px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-glass)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '18px'
                }}>
                  {getDomainIcon(dom.id)}
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '10px', color: '#fff' }}>
                  {dom.name}
                </h3>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '20px' }}>
                  {dom.description}
                </p>

                {/* Skill Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                  {(dom.skills || []).map((skill, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '0.75rem',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        color: 'var(--text-muted)'
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action link */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                color: '#60a5fa',
                fontSize: '0.88rem',
                fontWeight: '600'
              }}>
                <span>Choose this Domain</span>
                <ChevronRight size={18} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
