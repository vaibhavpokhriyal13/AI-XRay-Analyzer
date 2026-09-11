import React from 'react';
import { Activity, ShieldCheck, Cpu, FileCheck, Layers, Stethoscope } from 'lucide-react';

export default function WelcomeBoard() {
  const features = [
    {
      icon: <Activity size={18} color="var(--primary)" />,
      title: 'Thoracic Pathology Screening',
      desc: 'Deep learning classification for focal alveolar consolidations, interstitial infiltrates, and acute pneumonia.'
    },
    {
      icon: <Cpu size={18} color="#9333ea" />,
      title: 'Trained MobileNetV2 Tensor Engine',
      desc: 'Optimized convolutional architecture calibrated with balanced class weights for high sensitivity and specificity.'
    },
    {
      icon: <Layers size={18} color="var(--primary)" />,
      title: 'Granular Anatomical Mapping',
      desc: 'Automated regional analysis of Bilateral Lung Fields, Parenchymal Density, Cardiac Silhouette, and Costophrenic Sulci.'
    },
    {
      icon: <Stethoscope size={18} color="var(--success)" />,
      title: 'Clinical Recommendations & Pathways',
      desc: 'Actionable guidance on diagnostic workups, continuous SpO₂ vitals tracking, and pulmonary follow-up protocols.'
    }
  ];

  return (
    <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      {/* Banner Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-main)' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '10px',
          background: 'var(--primary-light)',
          border: '1px solid var(--primary-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--primary)',
          flexShrink: 0
        }}>
          <Activity size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            NeuroScan AI Clinical Intelligence
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Computer-Aided Diagnostic Workstation for Thoracic Radiography
          </p>
        </div>
      </div>

      {/* Overview Intro */}
      <div style={{
        background: '#f8fafc',
        border: '1px solid var(--border-main)',
        borderRadius: '10px',
        padding: '1rem',
        marginBottom: '1.25rem'
      }}>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.5, marginBottom: '0.5rem' }}>
          NeuroScan AI utilizes advanced deep learning to assist clinicians and radiologists in the rapid detection and stratification of pulmonary conditions from standard chest radiographs (PA/AP views).
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '0.68rem',
            fontWeight: 600,
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            padding: '2px 8px',
            borderRadius: '4px',
            border: '1px solid var(--primary-border)'
          }}>
            Zero-Centered Normalization
          </span>
          <span style={{
            fontSize: '0.68rem',
            fontWeight: 600,
            background: 'var(--success-light)',
            color: 'var(--success-text)',
            padding: '2px 8px',
            borderRadius: '4px',
            border: '1px solid var(--success-border)'
          }}>
            93.5% Benchmark Accuracy
          </span>
          <span style={{
            fontSize: '0.68rem',
            fontWeight: 600,
            background: '#f1f5f9',
            color: 'var(--text-muted)',
            padding: '2px 8px',
            borderRadius: '4px',
            border: '1px solid var(--border-main)'
          }}>
            Sub-50ms Inference
          </span>
        </div>
      </div>

      {/* Feature Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', flex: 1 }}>
        {features.map((item, idx) => (
          <div key={idx} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.85rem',
            padding: '0.75rem',
            borderRadius: '8px',
            background: '#ffffff',
            border: '1px solid var(--border-main)'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              background: '#f8fafc',
              border: '1px solid var(--border-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {item.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.15rem' }}>
                {item.title}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                {item.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Workflow Step Indicator */}
      <div style={{
        padding: '0.85rem 1rem',
        borderRadius: '10px',
        background: 'var(--primary-light)',
        border: '1px solid var(--primary-border)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <FileCheck size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.76rem', color: 'var(--primary)', lineHeight: 1.4 }}>
          <strong>Ready for Scan:</strong> Upload a chest radiograph on the left and click <strong>Execute Neural Diagnostic Scan</strong> to generate instant findings.
        </div>
      </div>

    </div>
  );
}
