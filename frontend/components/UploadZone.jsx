import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, X, ChevronDown } from 'lucide-react';

export default function UploadZone({
  selectedFile,
  previewUrl,
  imageMeta,
  onFileSelect,
  onClear,
  patientInfo,
  setPatientInfo
}) {
  const fileInputRef = useRef(null);
  const [showPatientContext, setShowPatientContext] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="glass-panel" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
        <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
          Radiograph Acquisition
        </h3>
        {previewUrl && (
          <button
            onClick={onClear}
            className="tool-btn"
            style={{ color: 'var(--danger)', borderColor: 'var(--danger-border)' }}
          >
            <X size={13} /> Clear Scan
          </button>
        )}
      </div>

      {!previewUrl ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          style={{
            border: '2px dashed #cbd5e1',
            borderRadius: '12px',
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            cursor: 'pointer',
            background: '#f8fafc',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--primary)';
            e.currentTarget.style.background = 'var(--primary-light)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#cbd5e1';
            e.currentTarget.style.background = '#f8fafc';
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files && e.target.files[0] && onFileSelect(e.target.files[0])}
            accept="image/png, image/jpeg, image/jpg"
            style={{ display: 'none' }}
          />
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: 'var(--primary-light)',
            border: '1px solid var(--primary-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            color: 'var(--primary)'
          }}>
            <UploadCloud size={26} />
          </div>
          <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.3rem' }}>
            Drop Chest Radiograph Here or Click to Browse
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Supports standard PA / AP thoracic X-ray projections (PNG, JPEG, JPG up to 50MB)
          </p>
        </div>
      ) : (
        <div style={{
          background: '#f8fafc',
          borderRadius: '10px',
          border: '1px solid var(--border-main)',
          padding: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <CheckCircle2 size={16} color="var(--primary)" />
              <span style={{ fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: 600 }}>
                {imageMeta.name || 'Chest_XRay_Scan.png'}
              </span>
            </div>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              color: 'var(--success-text)',
              background: 'var(--success-light)',
              border: '1px solid var(--success-border)',
              padding: '0.2rem 0.6rem',
              borderRadius: '999px'
            }}>
              Active Radiograph
            </span>
          </div>
        </div>
      )}

      {/* Collapsible Patient Information Panel */}
      <div style={{
        marginTop: '1rem',
        background: '#f8fafc',
        border: '1px solid var(--border-main)',
        borderRadius: '10px',
        overflow: 'hidden',
        transition: 'all 0.2s ease'
      }}>
        <button
          type="button"
          onClick={() => setShowPatientContext(!showPatientContext)}
          style={{
            width: '100%',
            padding: '0.75rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: showPatientContext ? '#f1f5f9' : 'transparent',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Optional Patient Clinical Context
            </span>
            {(patientInfo?.id || patientInfo?.demographics || patientInfo?.symptoms) && (
              <span style={{
                fontSize: '0.65rem',
                padding: '0.12rem 0.45rem',
                borderRadius: '999px',
                background: 'rgba(37, 99, 235, 0.1)',
                color: 'var(--primary)',
                fontWeight: 600,
                fontFamily: 'var(--font-mono)'
              }}>
                {patientInfo.id ? `ID: ${patientInfo.id}` : 'Context Added'}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 500 }}>
            <span>{showPatientContext ? 'Hide' : 'Expand / Enter'}</span>
            <ChevronDown
              size={15}
              style={{
                transform: showPatientContext ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }}
            />
          </div>
        </button>

        {showPatientContext && (
          <div style={{
            padding: '0.85rem',
            borderTop: '1px solid var(--border-main)',
            background: '#ffffff'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.6rem' }}>
              <div>
                <label style={{ fontSize: '0.68rem', fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                  Patient ID
                </label>
                <input
                  type="text"
                  value={patientInfo.id}
                  onChange={(e) => setPatientInfo({ ...patientInfo, id: e.target.value })}
                  placeholder="e.g. PT-84920"
                  style={{
                    width: '100%',
                    background: '#ffffff',
                    border: '1px solid var(--border-main)',
                    borderRadius: '6px',
                    color: 'var(--text-main)',
                    padding: '0.35rem 0.5rem',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-mono)'
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.68rem', fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                  Age / Gender
                </label>
                <input
                  type="text"
                  value={patientInfo.demographics}
                  onChange={(e) => setPatientInfo({ ...patientInfo, demographics: e.target.value })}
                  placeholder="e.g. 54 / M"
                  style={{
                    width: '100%',
                    background: '#ffffff',
                    border: '1px solid var(--border-main)',
                    borderRadius: '6px',
                    color: 'var(--text-main)',
                    padding: '0.35rem 0.5rem',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-mono)'
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.68rem', fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                  Symptoms
                </label>
                <input
                  type="text"
                  value={patientInfo.symptoms}
                  onChange={(e) => setPatientInfo({ ...patientInfo, symptoms: e.target.value })}
                  placeholder="e.g. Fever, Cough"
                  style={{
                    width: '100%',
                    background: '#ffffff',
                    border: '1px solid var(--border-main)',
                    borderRadius: '6px',
                    color: 'var(--text-main)',
                    padding: '0.35rem 0.5rem',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-mono)'
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
