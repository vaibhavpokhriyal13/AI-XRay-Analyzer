import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Stethoscope,
  UserCheck,
  ChevronRight,
  RefreshCw,
  HelpCircle
} from 'lucide-react';

export default function AICopilot({ isOpen, onClose, previewUrl, results, patientInfo }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [mode, setMode] = useState('doctor'); // 'doctor' or 'patient'
  const messagesEndRef = useRef(null);

  // Initialize initial greeting when scan changes or copilot opens
  useEffect(() => {
    if (messages.length === 0) {
      if (results) {
        const isPneu = results.is_pneumonia;
        setMessages([
          {
            role: 'assistant',
            content: mode === 'doctor'
              ? `I've reviewed the scan for patient ${patientInfo?.id || 'Anonymous'}: ${isPneu ? 'Pneumonia Detected' : 'Normal Chest Radiograph'} (${results.confidence}% confidence).

How can I help you? You can ask about antibiotic guidelines, CURB-65 triage, or differential diagnoses.`
              : `Hello! I've reviewed your chest X-ray. ${isPneu ? 'It shows signs of a lung infection (pneumonia).' : 'Good news—your lungs look clear and healthy!'}

Feel free to ask any questions about what this means or what to ask your doctor.`
          }
        ]);
      } else {
        setMessages([
          {
            role: 'assistant',
            content: `Upload a chest radiograph to ask questions about diagnosis, clinical protocols, or patient guidance.`
          }
        ]);
      }
    }
  }, [results, isOpen, mode]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSend = async (customPrompt) => {
    const text = (customPrompt || inputValue).trim();
    if (!text || isSending) return;

    const userMessage = { role: 'user', content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setIsSending(true);

    try {
      const apiKey = typeof window !== 'undefined' ? localStorage.getItem('neuroscan_gemini_key') || '' : '';

      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          imageBase64: previewUrl,
          cnnResults: results,
          patientInfo,
          mode,
          apiKey
        })
      });

      const data = await res.json();
      if (data && data.reply) {
        setMessages([...updatedMessages, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages([...updatedMessages, { role: 'assistant', content: 'Could not process query. Please try again.' }]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages([...updatedMessages, { role: 'assistant', content: 'Connection error while communicating with AI copilot.' }]);
    } finally {
      setIsSending(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([]);
  };

  const doctorChips = [
    'ATS/IDSA antibiotic recommendations',
    'Evaluate CURB-65 pneumonia severity score',
    'Differential diagnosis considerations',
    'Consultation note draft'
  ];

  const patientChips = [
    'Is pneumonia contagious?',
    'What should I do next?',
    'How long does recovery take?'
  ];

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      width: '420px',
      maxWidth: 'calc(100vw - 3rem)',
      height: '580px',
      maxHeight: 'calc(100vh - 6rem)',
      background: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0,0,0,0.08)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 9000,
      overflow: 'hidden',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      
      {/* Header */}
      <div style={{
        padding: '0.85rem 1rem',
        background: 'linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%)',
        borderBottom: '1px solid var(--border-main)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'var(--primary)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Bot size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Ask AI
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {results ? `${results.is_pneumonia ? 'Pneumonia Case' : 'Normal Case'} (${results.confidence}%)` : 'Radiology Assistant'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button
            onClick={handleClearHistory}
            title="Reset Chat"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px'
            }}
          >
            <RefreshCw size={15} />
          </button>
          <button
            onClick={onClose}
            title="Close Assistant"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px'
            }}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Mode Switcher Banner */}
      <div style={{
        padding: '0.45rem 0.85rem',
        background: '#f1f5f9',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#475569' }}>
          Conversation Persona:
        </span>
        <div style={{ display: 'flex', background: '#ffffff', padding: '2px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
          <button
            onClick={() => setMode('doctor')}
            style={{
              border: 'none',
              background: mode === 'doctor' ? 'var(--primary)' : 'transparent',
              color: mode === 'doctor' ? '#ffffff' : '#64748b',
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.68rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <Stethoscope size={11} /> Clinician
          </button>
          <button
            onClick={() => setMode('patient')}
            style={{
              border: 'none',
              background: mode === 'patient' ? 'var(--primary)' : 'transparent',
              color: mode === 'patient' ? '#ffffff' : '#64748b',
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.68rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <UserCheck size={11} /> Patient
          </button>
        </div>
      </div>

      {/* Message Stream */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        background: '#f8fafc'
      }}>
        {messages.map((m, idx) => {
          const isUser = m.role === 'user';
          return (
            <div key={idx} style={{
              display: 'flex',
              justifyContent: isUser ? 'flex-end' : 'flex-start',
              gap: '0.5rem',
              alignItems: 'flex-start'
            }}>
              {!isUser && (
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  <Bot size={13} />
                </div>
              )}
              <div style={{
                maxWidth: '82%',
                padding: '0.7rem 0.9rem',
                borderRadius: '12px',
                fontSize: '0.78rem',
                lineHeight: 1.5,
                background: isUser ? 'var(--primary)' : '#ffffff',
                color: isUser ? '#ffffff' : 'var(--text-main)',
                border: isUser ? 'none' : '1px solid var(--border-main)',
                boxShadow: isUser ? '0 2px 4px rgba(37, 99, 235, 0.2)' : '0 1px 2px rgba(0,0,0,0.04)',
                whiteSpace: 'pre-wrap'
              }}>
                {m.content}
              </div>
              {isUser && (
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#64748b',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  <User size={13} />
                </div>
              )}
            </div>
          );
        })}

        {isSending && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'var(--primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bot size={13} />
            </div>
            <div style={{
              background: '#ffffff',
              border: '1px solid var(--border-main)',
              borderRadius: '12px',
              padding: '0.5rem 0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.72rem',
              color: 'var(--text-muted)'
            }}>
              <RefreshCw size={12} className="animate-spin" /> Thinking...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div style={{
        padding: '0.5rem 0.75rem',
        background: '#ffffff',
        borderTop: '1px solid var(--border-main)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        overflowX: 'auto',
        whiteSpace: 'nowrap'
      }}>
        {(mode === 'doctor' ? doctorChips : patientChips).map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            disabled={isSending}
            style={{
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              borderRadius: '999px',
              padding: '0.25rem 0.6rem',
              fontSize: '0.68rem',
              fontWeight: 500,
              color: 'var(--text-main)',
              cursor: isSending ? 'not-allowed' : 'pointer',
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <Sparkles size={10} color="var(--primary)" /> {chip}
          </button>
        ))}
      </div>

      {/* Message Input Box */}
      <div style={{
        padding: '0.75rem',
        background: '#ffffff',
        borderTop: '1px solid var(--border-main)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <input
          type="text"
          placeholder={mode === 'doctor' ? 'Ask a clinical question about this scan...' : 'Ask any question in plain English...'}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={isSending}
          style={{
            flex: 1,
            padding: '0.55rem 0.75rem',
            borderRadius: '8px',
            border: '1px solid var(--border-main)',
            fontSize: '0.78rem',
            outline: 'none',
            background: '#f8fafc'
          }}
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputValue.trim() || isSending}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: inputValue.trim() && !isSending ? 'var(--primary)' : '#e2e8f0',
            color: inputValue.trim() && !isSending ? '#ffffff' : '#94a3b8',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: inputValue.trim() && !isSending ? 'pointer' : 'not-allowed',
            flexShrink: 0
          }}
        >
          <Send size={15} />
        </button>
      </div>

    </div>
  );
}
