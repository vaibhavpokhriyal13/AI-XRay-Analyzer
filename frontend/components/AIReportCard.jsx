import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  Stethoscope,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Tag,
  Scale,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';

export default function AIReportCard({ reportData, isLoading, onRegenerate, isFallback }) {
  const [copiedSection, setCopiedSection] = useState(null);
  const [viewMode, setViewMode] = useState('doctor'); // 'doctor' or 'patient'
  const [isExpanded, setIsExpanded] = useState(true);

  if (!reportData && !isLoading) return null;

  const handleCopy = (text, sectionName) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedSection(sectionName);
      setTimeout(() => setCopiedSection(null), 1800);
    }
  };

  return (
    <div className="glass-panel" style={{
      padding: '1.35rem',
      borderRadius: '12px',
      border: '1px solid var(--border-main)',
      background: '#ffffff',
      boxShadow: 'var(--shadow-sm)',
      position: 'relative'
    }}>
      {/* Header bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'var(--primary-light)',
            border: '1px solid var(--primary-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <FileText size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
              Clinical Report & Impression
            </h3>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0.15rem 0 0 0' }}>
              Differential diagnoses, narrative impression & ICD-10 coding
            </p>
          </div>
        </div>

        {/* Mode switcher & regenerate */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            display: 'flex',
            background: '#e2e8f0',
            padding: '2px',
            borderRadius: '6px'
          }}>
            <button
              onClick={() => setViewMode('doctor')}
              style={{
                border: 'none',
                background: viewMode === 'doctor' ? '#ffffff' : 'transparent',
                color: viewMode === 'doctor' ? '#1e293b' : '#64748b',
                padding: '0.3rem 0.65rem',
                borderRadius: '5px',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                boxShadow: viewMode === 'doctor' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <Stethoscope size={13} /> Doctor Mode
            </button>
            <button
              onClick={() => setViewMode('patient')}
              style={{
                border: 'none',
                background: viewMode === 'patient' ? '#ffffff' : 'transparent',
                color: viewMode === 'patient' ? '#1e293b' : '#64748b',
                padding: '0.3rem 0.65rem',
                borderRadius: '5px',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                boxShadow: viewMode === 'patient' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <UserCheck size={13} /> Patient Mode
            </button>
          </div>

          <button
            onClick={onRegenerate}
            disabled={isLoading}
            title="Regenerate Report"
            style={{
              background: '#ffffff',
              border: '1px solid var(--border-main)',
              borderRadius: '6px',
              padding: '0.35rem 0.5rem',
              color: 'var(--text-muted)',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div style={{
          padding: '2rem 1rem',
          textAlign: 'center',
          background: '#ffffff',
          borderRadius: '8px',
          border: '1px dashed #cbd5e1'
        }}>
          <RefreshCw size={24} className="animate-spin" style={{ color: 'var(--primary)', margin: '0 auto 0.75rem' }} />
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Generating Multimodal Clinical Report...
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Synthesizing radiograph features, anatomical landmarks & ICD-10 diagnostic codes
          </div>
        </div>
      )}

      {/* Report Content */}
      {!isLoading && reportData && (
        <div>
          {/* PATIENT MODE VIEW */}
          {viewMode === 'patient' && (
            <div style={{
              background: '#ffffff',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              padding: '1.25rem'
            }}>
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '8px',
                padding: '0.85rem',
                marginBottom: '1rem'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534', marginBottom: '0.35rem' }}>
                  What Your X-Ray Shows (Plain English)
                </div>
                <p style={{ fontSize: '0.82rem', color: '#14532d', lineHeight: 1.5, margin: 0 }}>
                  {reportData.patient_friendly_summary || 'Your lungs and chest structures were analyzed.'}
                </p>
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                  Recommended Next Steps:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {reportData.patient_next_steps?.map((step, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.5rem',
                      fontSize: '0.78rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.4
                    }}>
                      <span style={{
                        background: '#e0e7ff',
                        color: '#3730a3',
                        fontWeight: 700,
                        fontSize: '0.68rem',
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '1px'
                      }}>
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* DOCTOR / CLINICIAN MODE VIEW */}
          {viewMode === 'doctor' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              
              {/* Radiologist Narrative Impression */}
              <div style={{
                background: '#ffffff',
                border: '1px solid var(--border-main)',
                borderRadius: '10px',
                padding: '1rem',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Radiological Narrative Impression
                  </span>
                  <button
                    onClick={() => handleCopy(reportData.impression, 'impression')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      fontSize: '0.7rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    {copiedSection === 'impression' ? <Check size={12} color="var(--success)" /> : <Copy size={12} />}
                    {copiedSection === 'impression' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <p style={{
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  lineHeight: 1.5,
                  margin: 0
                }}>
                  {reportData.impression}
                </p>
              </div>

              {/* Second Opinion & Concordance Badge */}
              {reportData.second_opinion && (
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '0.85rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Scale size={14} color="#475569" />
                      <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#334155' }}>
                        Diagnostic Second Opinion
                      </span>
                    </div>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: reportData.second_opinion.concordance === 'Concordant' ? '#dcfce7' : '#fef9c3',
                      color: reportData.second_opinion.concordance === 'Concordant' ? '#15803d' : '#854d0e',
                      border: `1px solid ${reportData.second_opinion.concordance === 'Concordant' ? '#bbf7d0' : '#fef08a'}`
                    }}>
                      {reportData.second_opinion.concordance} with Model
                    </span>
                  </div>
                  <p style={{ fontSize: '0.74rem', color: '#475569', lineHeight: 1.4, margin: 0 }}>
                    {reportData.second_opinion.summary}
                  </p>
                </div>
              )}

              {/* Differential Diagnoses */}
              {reportData.differential_diagnoses && reportData.differential_diagnoses.length > 0 && (
                <div style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-main)',
                  borderRadius: '10px',
                  padding: '0.85rem'
                }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Differential Diagnoses
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {reportData.differential_diagnoses.map((diff, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.4rem 0.6rem',
                        borderRadius: '6px',
                        background: '#f8fafc',
                        border: '1px solid #f1f5f9'
                      }}>
                        <div>
                          <span style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-main)' }}>
                            {diff.condition}
                          </span>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                            {diff.rationale}
                          </div>
                        </div>
                        <span style={{
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: diff.probability === 'High' ? '#fee2e2' : diff.probability === 'Moderate' ? '#fef3c7' : '#f1f5f9',
                          color: diff.probability === 'High' ? '#b91c1c' : diff.probability === 'Moderate' ? '#b45309' : '#64748b'
                        }}>
                          {diff.probability} Probability
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ICD-10 Diagnostic Codes */}
              {reportData.icd10_codes && reportData.icd10_codes.length > 0 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.45rem',
                  padding: '0.75rem 0.85rem',
                  background: '#ffffff',
                  borderRadius: '10px',
                  border: '1px solid var(--border-main)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginRight: '0.25rem' }}>
                    <Tag size={13} /> ICD-10:
                  </div>
                  {reportData.icd10_codes.map((item, idx) => (
                    <div key={idx} style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      background: '#f1f5f9',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      padding: '0.2rem 0.5rem',
                      fontSize: '0.7rem'
                    }}>
                      <span className="mono-text" style={{ fontWeight: 700, color: 'var(--primary)' }}>
                        {item.code}
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>
                        {item.description}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Anatomical Details Accordion */}
              <div style={{
                background: '#ffffff',
                borderRadius: '10px',
                border: '1px solid var(--border-main)',
                overflow: 'hidden'
              }}>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    background: '#f8fafc',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--text-main)'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <FileText size={14} color="var(--primary)" /> Detailed Radiologic Technique & Findings
                  </span>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {isExpanded && (
                  <div style={{ padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.74rem' }}>
                    <div>
                      <strong style={{ color: 'var(--text-main)' }}>Technique & Projection: </strong>
                      <span style={{ color: 'var(--text-muted)' }}>{reportData.technique}</span>
                    </div>
                    <div>
                      <strong style={{ color: 'var(--text-main)' }}>Lungs & Pleural Spaces: </strong>
                      <span style={{ color: 'var(--text-muted)' }}>{reportData.lungs_and_pleura}</span>
                    </div>
                    <div>
                      <strong style={{ color: 'var(--text-main)' }}>Cardiomediastinal Contour: </strong>
                      <span style={{ color: 'var(--text-muted)' }}>{reportData.cardiac_silhouette}</span>
                    </div>
                    {reportData.bony_thorax && (
                      <div>
                        <strong style={{ color: 'var(--text-main)' }}>Bony Thorax & Soft Tissues: </strong>
                        <span style={{ color: 'var(--text-muted)' }}>{reportData.bony_thorax}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      )}
    </div>
  );
}
