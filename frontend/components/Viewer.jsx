import React, { useState, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Eye, Sun, Contrast, AlertTriangle, Layers, Flame } from 'lucide-react';

export default function Viewer({ previewUrl, isScanning, onAnalyze, canAnalyze, results, validationError }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [invert, setInvert] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [heatmapOpacity, setHeatmapOpacity] = useState(65);

  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

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
    setBrightness(100);
    setContrast(100);
    setInvert(false);
    setShowHeatmap(false);
  };

  const isPneumonia = results?.is_pneumonia;

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.6rem',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Radiological Workstation
          </span>
          {results && (
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 600,
              color: isPneumonia ? 'var(--danger)' : 'var(--success)',
              background: isPneumonia ? 'var(--danger-light)' : 'var(--success-light)',
              border: `1px solid ${isPneumonia ? 'var(--danger-border)' : 'var(--success-border)'}`,
              padding: '2px 8px',
              borderRadius: '999px'
            }}>
              {isPneumonia ? 'PATHOLOGY LOCATED' : 'CLEAR FIELDS'}
            </span>
          )}
        </div>

        {/* Viewport Control Tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
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
          <span className="mono-text" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', minWidth: '40px', textAlign: 'center' }}>
            {Math.round(zoom * 100)}%
          </span>

          {/* Bone Window Invert */}
          <button
            onClick={() => setInvert(!invert)}
            className={`tool-btn ${invert ? 'active' : ''}`}
            title="Invert Luminance (Bone Window)"
          >
            <Eye size={14} /> Bone
          </button>

          {/* Grad-CAM Heatmap Toggle (visible if results exist) */}
          {results && (
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              disabled={!previewUrl}
              className={`tool-btn ${showHeatmap ? 'active' : ''}`}
              title="Toggle Neural Attention Heatmap"
            >
              <Flame size={14} color={showHeatmap ? '#ea580c' : 'currentColor'} /> Heatmap
            </button>
          )}

          <button
            onClick={resetAll}
            className="tool-btn"
            title="Reset View and Filters"
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>

      {/* Main Radiograph Canvas Viewport */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          position: 'relative',
          width: '100%',
          height: '460px',
          background: '#090d16',
          borderRadius: '12px',
          border: '1px solid #cbd5e1',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: zoom > 1 ? (isDragging.current ? 'grabbing' : 'grab') : 'default'
        }}
      >
        {/* Scanning Line Animation */}
        {isScanning && <div className="scanner-bar" />}

        {/* Viewport Info Overlay */}
        {previewUrl && (
          <div style={{
            position: 'absolute',
            top: 10,
            left: 10,
            zIndex: 10,
            display: 'flex',
            gap: '0.5rem',
            pointerEvents: 'none'
          }}>
            <span className="mono-text" style={{
              background: 'rgba(0, 0, 0, 0.75)',
              color: '#38bdf8',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '0.68rem',
              border: '1px solid rgba(56, 189, 248, 0.3)'
            }}>
              PROJECTION: CHEST AP/PA
            </span>
          </div>
        )}

        {previewUrl ? (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transition: isDragging.current ? 'none' : 'transform 0.15s ease-out'
          }}>
            <div style={{
              flex: 1,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%'
            }}>
              {/* Radiograph Image */}
              <img
                src={previewUrl}
                alt="Chest Radiograph"
                draggable={false}
                style={{
                  maxHeight: '100%',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  filter: `
                    brightness(${brightness}%)
                    contrast(${contrast}%)
                    ${invert ? 'invert(100%)' : ''}
                  `,
                  userSelect: 'none'
                }}
              />

              {/* Heatmap Overlay */}
              {showHeatmap && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  opacity: heatmapOpacity / 100,
                  mixBlendMode: 'screen',
                  transition: 'opacity 0.2s ease',
                  background: isPneumonia
                    ? `radial-gradient(ellipse 42% 35% at 68% 62%, rgba(239, 68, 68, 0.95) 0%, rgba(249, 115, 22, 0.75) 30%, rgba(234, 179, 8, 0.5) 55%, transparent 90%)`
                    : `radial-gradient(ellipse 65% 55% at 50% 50%, rgba(56, 189, 248, 0.35) 0%, transparent 80%)`,
                  filter: 'blur(14px)'
                }} />
              )}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255, 255, 255, 0.4)' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              border: '1px dashed rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              fontSize: '1.8rem'
            }}>
              🫁
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.3rem' }}>
              NO RADIOGRAPH MOUNTED
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.4)' }}>
              Acquire or drop a chest radiograph above to begin diagnostic inspection
            </div>
          </div>
        )}
      </div>

      {/* Radiographic Windowing Sliders */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: showHeatmap ? '1fr 1fr 1fr' : '1fr 1fr',
        gap: '1rem',
        marginTop: '1rem',
        padding: '0.75rem 1rem',
        background: '#f8fafc',
        borderRadius: '10px',
        border: '1px solid var(--border-main)'
      }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 500 }}>
              <Sun size={13} /> Brightness
            </span>
            <span className="mono-text" style={{ fontSize: '0.72rem', color: 'var(--text-main)', fontWeight: 600 }}>
              {brightness}%
            </span>
          </div>
          <input
            type="range"
            min="40"
            max="180"
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            className="slider-control"
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 500 }}>
              <Contrast size={13} /> Contrast
            </span>
            <span className="mono-text" style={{ fontSize: '0.72rem', color: 'var(--text-main)', fontWeight: 600 }}>
              {contrast}%
            </span>
          </div>
          <input
            type="range"
            min="40"
            max="220"
            value={contrast}
            onChange={(e) => setContrast(Number(e.target.value))}
            className="slider-control"
          />
        </div>

        {showHeatmap && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
              <span style={{ fontSize: '0.72rem', color: '#ea580c', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 500 }}>
                <Layers size={13} /> Heatmap Blend
              </span>
              <span className="mono-text" style={{ fontSize: '0.72rem', color: '#ea580c', fontWeight: 600 }}>
                {heatmapOpacity}%
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={heatmapOpacity}
              onChange={(e) => setHeatmapOpacity(Number(e.target.value))}
              className="slider-control"
            />
          </div>
        )}
      </div>

      {/* Validation Error Alert */}
      {validationError && (
        <div style={{
          marginTop: '1rem',
          padding: '0.85rem 1rem',
          borderRadius: '10px',
          background: 'var(--danger-light)',
          border: '1px solid var(--danger-border)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem'
        }}>
          <AlertTriangle size={18} color="var(--danger)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--danger-text)', marginBottom: '0.2rem' }}>
              Radiograph Validation Failed
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--danger-text)', lineHeight: 1.4 }}>
              {validationError}
            </div>
          </div>
        </div>
      )}

      {/* Primary Action Button */}
      <div style={{ marginTop: '1.25rem' }}>
        <button
          onClick={onAnalyze}
          disabled={!canAnalyze || isScanning}
          className="btn-primary"
          style={{
            width: '100%',
            padding: '0.95rem',
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
              RUNNING CONVOLUTIONAL INFERENCE...
            </>
          ) : validationError ? (
            '❌ NON-RADIOGRAPH REJECTED'
          ) : (
            '⚡ EXECUTE NEURAL DIAGNOSTIC SCAN'
          )}
        </button>
      </div>

    </div>
  );
}
