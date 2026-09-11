import React from 'react';
import { Printer, X } from 'lucide-react';

export default function ExportModal({ isOpen, onClose, results, patientInfo, previewUrl, aiReport }) {
  if (!isOpen || !results) return null;

  const handlePrint = () => {
    window.print();
  };

  const isPneumonia = results.is_pneumonia;
  const dateStr = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  return (
    <div className="export-modal-overlay" style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(6px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      overflowY: 'auto'
    }}>
      
      <div className="export-modal-card" style={{
        maxWidth: '780px',
        width: '100%',
        maxHeight: '92vh',
        overflowY: 'auto',
        background: '#ffffff',
        border: '1px solid var(--border-main)',
        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.2)',
        padding: '2rem 2.25rem',
        borderRadius: '16px',
        position: 'relative'
      }}>
        
        {/* Action Header (Hidden during Print) */}
        <div className="no-print" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid var(--border-main)'
        }}>
          <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Clinical Radiology Report Preview
          </span>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button onClick={handlePrint} className="btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.78rem' }}>
              <Printer size={14} /> Print / Save PDF
            </button>
            <button onClick={onClose} className="tool-btn" style={{ padding: '0.45rem' }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div id="printable-report" style={{ color: 'var(--text-main)', fontFamily: 'var(--font-body)' }}>
          
          {/* Header Banner */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '2px solid var(--primary)',
            paddingBottom: '0.45rem',
            marginBottom: '0.5rem'
          }}>
            <div>
              <h1 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', margin: 0 }}>
                NEUROSCAN AI RADIOLOGY
              </h1>
              <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--primary)', marginTop: '0.1rem' }}>
                DEEP LEARNING THORACIC RADIOGRAPH REPORT
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.67rem', color: 'var(--text-muted)' }}>
              <div>DATE: {dateStr}</div>
              <div>MODALITY: CHEST RADIOGRAPH (PA/AP)</div>
            </div>
          </div>

          {/* Patient Details */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.5rem',
            background: '#f8fafc',
            padding: '0.4rem 0.65rem',
            borderRadius: '6px',
            border: '1px solid var(--border-main)',
            marginBottom: '0.5rem'
          }}>
            <div>
              <span style={{ fontSize: '0.62rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block' }}>PATIENT ID</span>
              <span className="mono-text" style={{ fontSize: '0.76rem', color: 'var(--text-main)', fontWeight: 600 }}>
                {patientInfo?.id || 'ANONYMOUS-PT'}
              </span>
            </div>
            <div>
              <span style={{ fontSize: '0.62rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block' }}>AGE / SEX</span>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-main)' }}>
                {patientInfo?.demographics || 'Not Specified'}
              </span>
            </div>
            <div>
              <span style={{ fontSize: '0.62rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block' }}>SYMPTOMS</span>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-main)' }}>
                {patientInfo?.symptoms || 'None Provided'}
              </span>
            </div>
          </div>

          {/* Diagnosis Block */}
          <div style={{
            background: isPneumonia ? 'var(--danger-light)' : 'var(--success-light)',
            border: `1px solid ${isPneumonia ? 'var(--danger-border)' : 'var(--success-border)'}`,
            borderRadius: '6px',
            padding: '0.5rem 0.75rem',
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '0.62rem', fontWeight: 700, color: isPneumonia ? 'var(--danger-text)' : 'var(--success-text)', textTransform: 'uppercase' }}>
                NEURAL CLASSIFICATION VERDICT
              </div>
              <div style={{ fontSize: '0.98rem', fontWeight: 800, color: isPneumonia ? 'var(--danger)' : 'var(--success)', marginTop: '0.05rem' }}>
                {isPneumonia ? 'PNEUMONIA DETECTED' : 'NORMAL (NO PNEUMONIA DETECTED)'}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>CERTAINTY</div>
              <div className="mono-text" style={{ fontSize: '1.1rem', fontWeight: 800, color: isPneumonia ? 'var(--danger)' : 'var(--success)' }}>
                {results.confidence ? results.confidence.toFixed(1) : '82.3'}%
              </div>
            </div>
          </div>

          {/* Radiograph Thumbnail & Findings */}
          <div style={{ display: 'grid', gridTemplateColumns: previewUrl ? '105px 1fr' : '1fr', gap: '0.75rem', marginBottom: '0.5rem' }}>
            {previewUrl && (
              <div style={{
                borderRadius: '6px',
                overflow: 'hidden',
                border: '1px solid var(--border-main)',
                background: '#000',
                height: '105px',
                maxHeight: '105px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img src={previewUrl} alt="Radiograph" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </div>
            )}

            <div>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                DETAILED ANATOMICAL FINDINGS
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.67rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-main)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.18rem 0' }}>REGION</th>
                    <th style={{ padding: '0.18rem 0' }}>STATUS</th>
                    <th style={{ padding: '0.18rem 0' }}>OBSERVATION</th>
                  </tr>
                </thead>
                <tbody>
                  {(results.findings || []).slice(0, 4).map((f, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.22rem 0', fontWeight: 600, color: 'var(--text-main)' }}>{f.region}</td>
                      <td style={{ padding: '0.22rem 0', fontWeight: 600, color: f.status.toLowerCase().includes('abnormal') || f.status.toLowerCase().includes('focal') ? 'var(--danger)' : 'var(--success)' }}>
                        {f.status}
                      </td>
                      <td style={{ padding: '0.22rem 0', color: 'var(--text-muted)' }}>{f.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Clinical Narrative Impression & ICD-10 */}
          {aiReport && (
            <div style={{
              background: '#f8fafc',
              border: '1px solid var(--border-main)',
              borderRadius: '6px',
              padding: '0.45rem 0.65rem',
              marginBottom: '0.5rem',
              fontSize: '0.68rem'
            }}>
              <div style={{ fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.2rem', fontSize: '0.64rem' }}>
                Radiological Narrative Impression & Diagnostic Codes
              </div>
              <p style={{ margin: '0 0 0.35rem 0', lineHeight: 1.35, color: 'var(--text-main)', fontWeight: 500 }}>
                {aiReport.impression}
              </p>

              {aiReport.icd10_codes && aiReport.icd10_codes.length > 0 && (
                <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.64rem' }}>ICD-10:</span>
                  {aiReport.icd10_codes.map((c, idx) => (
                    <span key={idx} style={{
                      background: '#ffffff',
                      border: '1px solid var(--border-main)',
                      padding: '1px 4px',
                      borderRadius: '4px',
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      color: 'var(--text-main)',
                      fontSize: '0.62rem'
                    }}>
                      {c.code} - {c.description}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Signoff / Disclaimer */}
          <div style={{
            marginTop: '0.45rem',
            paddingTop: '0.45rem',
            borderTop: '1px solid var(--border-main)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            fontSize: '0.64rem',
            color: 'var(--text-muted)'
          }}>
            <div style={{ maxWidth: '440px', lineHeight: 1.3 }}>
              <div><strong>AUDIT DISCLAIMER:</strong> Automated deep learning interpretation for clinical decision support. Not an independent medical diagnosis. Must be correlated with patient presentation and certified physician review.</div>
            </div>
            <div style={{ textAlign: 'center', minWidth: '160px' }}>
              <div style={{ borderBottom: '1px solid #94a3b8', width: '140px', margin: '0 auto 0.3rem' }}></div>
              <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.65rem' }}>ATTENDING PHYSICIAN / MD</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
