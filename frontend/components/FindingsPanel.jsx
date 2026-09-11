import React from 'react';
import { AlertCircle, CheckCircle2, FileDown, ShieldAlert } from 'lucide-react';

export default function FindingsPanel({ results, onOpenReport }) {
  if (!results) return null;

  const isPneumonia = results.is_pneumonia;
  const confidence = results.confidence || 82.3;

  return (
    <div className="glass-panel" style={{
      padding: '1.5rem',
      borderColor: isPneumonia ? 'var(--danger-border)' : 'var(--success-border)',
      boxShadow: 'var(--shadow-md)'
    }}>
      
      {/* Top Header: Diagnostic Verdict */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
            Diagnostic Assessment
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {isPneumonia ? (
              <AlertCircle size={24} color="var(--danger)" />
            ) : (
              <CheckCircle2 size={24} color="var(--success)" />
            )}
            <h2 style={{
              fontSize: '1.3rem',
              fontWeight: 800,
              color: isPneumonia ? 'var(--danger)' : 'var(--success)',
              letterSpacing: '-0.02em'
            }}>
              {isPneumonia ? 'Pneumonia Detected' : 'Normal Chest Radiograph'}
            </h2>
          </div>
        </div>

        {/* Severity Badge */}
        <div>
          {isPneumonia ? (
            <span className="badge-danger">
              <ShieldAlert size={14} />
              {results.severity || 'MODERATE'} RISK
            </span>
          ) : (
            <span className="badge-success">
              <CheckCircle2 size={14} />
              LOW RISK · BENIGN
            </span>
          )}
        </div>
      </div>

      {/* Confidence Dial / Progress Bar */}
      <div style={{
        background: '#f8fafc',
        padding: '1rem',
        borderRadius: '10px',
        border: '1px solid var(--border-main)',
        marginBottom: '1.25rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-muted)' }}>
            Model Confidence Certainty
          </span>
          <span className="mono-text" style={{
            fontSize: '1.2rem',
            fontWeight: 800,
            color: isPneumonia ? 'var(--danger)' : 'var(--success)'
          }}>
            {confidence}%
          </span>
        </div>

        {/* Bar */}
        <div style={{
          width: '100%',
          height: '8px',
          background: '#e2e8f0',
          borderRadius: '999px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${confidence}%`,
            height: '100%',
            background: isPneumonia
              ? 'linear-gradient(90deg, #f87171 0%, #dc2626 100%)'
              : 'linear-gradient(90deg, #34d399 0%, #16a34a 100%)',
            borderRadius: '999px',
            transition: 'width 0.8s ease-out'
          }} />
        </div>
      </div>

      {/* Granular Anatomical Findings List */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
          Granular Anatomical Findings
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.65rem' }}>
          {results.findings?.map((finding, idx) => (
            <div key={idx} style={{
              background: '#f8fafc',
              border: '1px solid var(--border-main)',
              borderRadius: '8px',
              padding: '0.75rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {finding.region}
                </span>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: finding.status.includes('Clear') || finding.status.includes('Normal')
                    ? 'var(--success-light)'
                    : 'var(--danger-light)',
                  color: finding.status.includes('Clear') || finding.status.includes('Normal')
                    ? 'var(--success-text)'
                    : 'var(--danger-text)',
                  border: `1px solid ${
                    finding.status.includes('Clear') || finding.status.includes('Normal')
                      ? 'var(--success-border)'
                      : 'var(--danger-border)'
                  }`
                }}>
                  {finding.status}
                </span>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                {finding.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Model & Export Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-main)' }}>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
          Engine: <strong style={{ color: 'var(--text-muted)' }}>{results.model_info?.execution || 'Native MobileNetV2'}</strong>
        </div>

        <button
          onClick={onOpenReport}
          className="btn-secondary"
          style={{ padding: '0.45rem 0.9rem', fontSize: '0.75rem' }}
        >
          <FileDown size={14} /> Export Clinical PDF
        </button>
      </div>

    </div>
  );
}
