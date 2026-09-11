import React, { useState, useEffect } from 'react';
import { Key, X, Check, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';

export default function APIKeyModal({ isOpen, onClose, onKeySaved }) {
  const [keyInput, setKeyInput] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('neuroscan_gemini_key') || '';
      setKeyInput(stored);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      const trimmed = keyInput.trim();
      if (trimmed) {
        localStorage.setItem('neuroscan_gemini_key', trimmed);
      } else {
        localStorage.removeItem('neuroscan_gemini_key');
      }
      setSavedSuccess(true);
      if (onKeySaved) onKeySaved(trimmed);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 700);
    }
  };

  const handleClear = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('neuroscan_gemini_key');
      setKeyInput('');
      if (onKeySaved) onKeySaved('');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.45)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '480px',
        width: '100%',
        background: '#ffffff',
        borderRadius: '16px',
        padding: '1.75rem',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border-main)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
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
              <Key size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                Google Gemini Vision AI Setup
              </h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
                Power multimodal second opinions & clinical copilot
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Info card */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid var(--border-main)',
          borderRadius: '10px',
          padding: '0.85rem',
          marginBottom: '1.25rem',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          lineHeight: 1.5
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.25rem' }}>
            <Sparkles size={14} /> Optional Direct API Access
          </div>
          Entering your key enables live <strong>Gemini 1.5 Flash Vision</strong> multimodal evaluation directly from your browser. Your key is stored securely in your local browser storage and never logged.
        </div>

        {/* Input */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
            Google Gemini API Key
          </label>
          <input
            type="password"
            placeholder="AIzaSy..."
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid var(--border-main)',
              fontSize: '0.82rem',
              fontFamily: 'monospace',
              background: '#ffffff',
              color: 'var(--text-main)',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem' }}>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: '0.72rem',
                color: 'var(--primary)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontWeight: 600
              }}
            >
              Get a free API key from Google AI Studio <ExternalLink size={12} />
            </a>
            {keyInput && (
              <button
                type="button"
                onClick={handleClear}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--danger)',
                  fontSize: '0.7rem',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn-primary"
            style={{
              padding: '0.5rem 1.25rem',
              fontSize: '0.8rem',
              background: savedSuccess ? 'var(--success)' : 'var(--primary)',
              borderColor: savedSuccess ? 'var(--success)' : 'var(--primary)'
            }}
          >
            {savedSuccess ? (
              <>
                <Check size={14} /> Saved!
              </>
            ) : (
              'Save Key'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
