import React from 'react';
import { Activity, Bot, Key, Sparkles } from 'lucide-react';

export default function Navbar({ onToggleCopilot, isCopilotOpen }) {
  return (
    <header className="glass-panel" style={{ padding: '0.85rem 1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'var(--primary-light)',
            border: '1px solid var(--primary-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <Activity size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                NeuroScan AI
              </span>
              <span style={{
                background: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-main)',
                color: 'var(--text-muted)',
                fontSize: '0.65rem',
                fontWeight: 600,
                padding: '0.15rem 0.45rem',
                borderRadius: '4px'
              }}>
                CHEST PA/AP
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Deep Learning Thoracic Radiograph Diagnostic Workstation
            </div>
          </div>
        </div>

        {/* Action Controls & Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          
          {/* Engine Status Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 0.85rem',
            borderRadius: '999px',
            background: 'var(--success-light)',
            border: '1px solid var(--success-border)',
            fontSize: '0.72rem',
            fontWeight: 600,
            color: 'var(--success-text)'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)' }}></span>
            SYSTEM READY
          </div>

        </div>

      </div>
    </header>
  );
}
