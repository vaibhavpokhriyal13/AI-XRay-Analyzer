import React from 'react';
import { Stethoscope, FlaskConical, Activity, ShieldCheck, AlertCircle } from 'lucide-react';

export default function Recommendations({ isPneumonia }) {
  const pneumoniaRecs = [
    {
      icon: <Stethoscope size={18} color="var(--primary)" />,
      title: 'Pulmonology / Attending Physician Review',
      desc: 'Immediate clinical correlation by an attending physician or radiologist is advised to evaluate acute presentation.'
    },
    {
      icon: <FlaskConical size={18} color="#9333ea" />,
      title: 'Diagnostic Laboratory Workup',
      desc: 'Consider Complete Blood Count (CBC) with differential, CRP/ESR inflammatory markers, and microbiological sputum evaluation.'
    },
    {
      icon: <Activity size={18} color="var(--danger)" />,
      title: 'Vital Signs & SpO₂ Monitoring',
      desc: 'Track pulse oximetry and respiratory rate continuously; escalate promptly if SpO₂ drops below 94% on room air.'
    }
  ];

  const normalRecs = [
    {
      icon: <ShieldCheck size={18} color="var(--success)" />,
      title: 'Routine Preventative Care',
      desc: 'No acute parenchymal infiltrates or consolidation observed. Maintain standard preventative health schedules.'
    },
    {
      icon: <Activity size={18} color="var(--primary)" />,
      title: 'Symptom-Triggered Re-Evaluation',
      desc: 'If patient continues to experience progressive productive cough, dyspnea, or persistent fever, consider follow-up imaging in 7–10 days.'
    },
    {
      icon: <Stethoscope size={18} color="#9333ea" />,
      title: 'Respiratory Wellness Maintenance',
      desc: 'Encourage smoking cessation, seasonal influenza and pneumococcal immunizations as indicated for demographic risk.'
    }
  ];

  const items = isPneumonia ? pneumoniaRecs : normalRecs;

  return (
    <div className="glass-panel" style={{ padding: '1.25rem' }}>
      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.85rem' }}>
        Clinical Recommendations & Pathways
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {items.map((rec, idx) => (
          <div key={idx} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.85rem',
            background: '#f8fafc',
            border: '1px solid var(--border-main)',
            borderRadius: '8px',
            padding: '0.75rem'
          }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: '#ffffff',
              border: '1px solid var(--border-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {rec.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.15rem' }}>
                {rec.title}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                {rec.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '0.85rem',
        padding: '0.65rem 0.85rem',
        borderRadius: '8px',
        background: 'var(--warning-light)',
        border: '1px solid var(--warning-border)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem'
      }}>
        <AlertCircle size={15} color="var(--warning)" style={{ flexShrink: 0 }} />
        <span style={{ fontSize: '0.68rem', color: '#92400e', lineHeight: 1.3 }}>
          AI diagnostic assistance is intended as a supportive clinical screening aid. All automated findings require verification by a licensed physician.
        </span>
      </div>
    </div>
  );
}
