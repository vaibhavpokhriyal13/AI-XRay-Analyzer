import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, X, ZoomIn, ZoomOut, RotateCcw, Eye, AlertTriangle, ChevronDown } from 'lucide-react';

export default function Workstation({
  selectedFile,
  previewUrl,
  imageMeta,
  onFileSelect,
  onClear,
  patientInfo,
  setPatientInfo,
  isScanning,
  onAnalyze,
  canAnalyze,
  results,
  validationError
}) {
  const fileInputRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [invert, setInvert] = useState(false);
  const [showPatientContext, setShowPatientContext] = useState(false);

  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleMouseDown = (e) => {
    if (zoom > 1) {
      isDragging.current = true;
      dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging.current && zoom > 1) {
      setPan({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y
      });
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const resetAll = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setInvert(false);
  };

  const hasPatientData = Boolean(
    patientInfo?.id?.trim() || 
    patientInfo?.demographics?.trim() || 
    patientInfo?.symptoms?.trim()
  );

  const renderPatientContext = () => (
    <div style={{
      background: '#f8fafc',
      border: '1px solid var(--border-main)',
      borderRadius: '10px',
      overflow: 'hidden',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
    }}>
      <button
        type="button"
        onClick={() => setShowPatientContext((prev) => !prev)}
        style={{
          width: '100%',
          padding: '0.75rem 0.9rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: showPatientContext ? '#f1f5f9' : 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          userSelect: 'none',
          transition: 'background 0.15s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Optional Patient Clinical Context
          </span>
          {hasPatientData && (
            <span style={{
              fontSize: '0.66rem',
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
                  padding: '0.4rem 0.55rem',
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
                  padding: '0.4rem 0.55rem',
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
                  padding: '0.4rem 0.55rem',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-mono)'
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
      
      {/* Card Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.6rem',
        marginBottom: '1rem',
        paddingBottom: '0.85rem',
        borderBottom: '1px solid var(--border-main)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {previewUrl ? 'Radiological Workstation' : 'Radiograph Acquisition'}
          </h3>
          {previewUrl && (
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              color: 'var(--primary)',
              background: 'var(--primary-light)',
              border: '1px solid var(--primary-border)',
              padding: '2px 8px',
              borderRadius: '999px',
              maxWidth: '220px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {imageMeta.name || 'Chest_XRay_Scan.png'}
            </span>
          )}
        </div>

        {/* Action / Clear Button */}
        {previewUrl && (
          <button
            onClick={onClear}
            className="tool-btn"
            style={{ color: 'var(--danger)', borderColor: 'var(--danger-border)', fontSize: '0.75rem' }}
            title="Remove current scan and upload another"
          >
            <X size={13} /> Clear Photo
          </button>
        )}
      </div>

      {/* STATE 1: No Image Uploaded (Dropzone + Patient Context) */}
      {!previewUrl ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            style={{
              border: '2px dashed #cbd5e1',
              borderRadius: '12px',
              padding: '3rem 1.5rem',
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
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--primary-light)',
              border: '1px solid var(--primary-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: 'var(--primary)'
            }}>
              <UploadCloud size={28} />
            </div>
            <div style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              Drop Chest Radiograph Here or Click to Browse
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Supports standard PA / AP thoracic X-ray projections (PNG, JPEG, JPG up to 50MB)
            </p>
          </div>

          {/* Collapsible Patient Clinical Context */}
          {renderPatientContext()}
        </div>
      ) : (
        /* STATE 2: Image Uploaded (Workstation Viewport + Controls + Scan Button) */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Viewport Control Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button
                onClick={() => setZoom(Math.min(zoom + 0.25, 3))}
                className="tool-btn"
                title="Zoom In"
              >
                <ZoomIn size={14} />
              </button>
              <button
                onClick={() => setZoom(Math.max(zoom - 0.25, 0.75))}
                className="tool-btn"
                title="Zoom Out"
              >
                <ZoomOut size={14} />
              </button>
              <span className="mono-text" style={{ fontSize: '0.74rem', color: 'var(--text-muted)', minWidth: '42px', textAlign: 'center' }}>
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setInvert(!invert)}
                className={`tool-btn ${invert ? 'active' : ''}`}
                title="Invert Luminance (Bone Window)"
              >
                <Eye size={14} /> Bone Window
              </button>
            </div>

            <button
              onClick={resetAll}
              className="tool-btn"
              title="Reset View"
            >
              <RotateCcw size={14} /> Reset
            </button>
          </div>

          {/* Radiological Image Viewport Canvas */}
          <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              position: 'relative',
              width: '100%',
              height: '420px',
              background: '#090d16',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: zoom > 1 ? (isDragging.current ? 'grabbing' : 'grab') : 'default'
            }}
          >
            {/* Scanline Animation */}
            {isScanning && <div className="scanner-bar" />}

            {/* Radiograph Image */}
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
              transition: isDragging.current ? 'none' : 'transform 0.15s ease-out'
            }}>
              <img
                src={previewUrl}
                alt="Chest Radiograph"
                draggable={false}
                style={{
                  maxHeight: '100%',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  filter: invert ? 'invert(100%)' : 'none',
                  userSelect: 'none'
                }}
              />
            </div>
          </div>

          {/* Validation Error Alert (if selfie or color photo) */}
          {validationError && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              background: 'var(--danger-light)',
              border: '1px solid var(--danger-border)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.65rem'
            }}>
              <AlertTriangle size={17} color="var(--danger)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--danger-text)', marginBottom: '0.15rem' }}>
                  Radiograph Validation Failed
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--danger-text)', lineHeight: 1.4 }}>
                  {validationError}
                </div>
              </div>
            </div>
          )}

          {/* Optional Patient Clinical Context */}
          {renderPatientContext()}

          {/* Primary Action Button */}
          <div>
            <button
              onClick={onAnalyze}
              disabled={!canAnalyze || isScanning}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '0.9rem',
                background: validationError ? 'var(--danger-light)' : undefined,
                color: validationError ? 'var(--danger)' : undefined,
                borderColor: validationError ? 'var(--danger-border)' : undefined
              }}
            >
              {isScanning ? (
                <>
                  <span style={{
                    display: 'inline-block',
                    width: '14px',
                    height: '14px',
                    border: '2px solid #ffffff',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  RUNNING NEURAL INFERENCE...
                </>
              ) : validationError ? (
                '❌ NON-RADIOGRAPH REJECTED'
              ) : (
                '⚡ EXECUTE NEURAL DIAGNOSTIC SCAN'
              )}
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
