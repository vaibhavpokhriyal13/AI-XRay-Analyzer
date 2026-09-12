import React, { useState } from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Workstation from '@/components/Workstation';
import WelcomeBoard from '@/components/WelcomeBoard';
import FindingsPanel from '@/components/FindingsPanel';
import Recommendations from '@/components/Recommendations';
import ExportModal from '@/components/ExportModal';
import AIReportCard from '@/components/AIReportCard';
import AICopilot from '@/components/AICopilot';
import { Bot } from 'lucide-react';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageMeta, setImageMeta] = useState({ width: 0, height: 0, size: '', name: '' });
  const [patientInfo, setPatientInfo] = useState({ id: '', demographics: '', symptoms: '' });
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [validationError, setValidationError] = useState(null);

  // Generative AI states
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [aiReportData, setAiReportData] = useState(null);
  const [isAiReportLoading, setIsAiReportLoading] = useState(false);

  // File selection handler with radiographic validation
  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setResults(null);
    setAiReportData(null);
    setValidationError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target.result;
      setPreviewUrl(url);

      const img = new Image();
      img.onload = () => {
        setImageMeta({
          width: img.naturalWidth || 1024,
          height: img.naturalHeight || 1024,
          size: `${Math.round(file.size / 1024)} KB`,
          name: file.name
        });

        // Radiographic Grayscale & Signature Validation
        try {
          const testCanvas = document.createElement('canvas');
          testCanvas.width = 128;
          testCanvas.height = 128;
          const tCtx = testCanvas.getContext('2d');
          tCtx.drawImage(img, 0, 0, 128, 128);
          const pData = tCtx.getImageData(0, 0, 128, 128).data;
          
          let coloredPixelCount = 0;
          let skinToneCount = 0;
          let brightnessSum = 0;
          const pixelCount = 128 * 128;

          for (let i = 0; i < pData.length; i += 4) {
            const r = pData[i];
            const g = pData[i + 1];
            const b = pData[i + 2];
            
            const maxDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
            if (maxDiff > 7) {
              coloredPixelCount++;
            }

            if (r > 70 && g > 35 && b > 20 && r > g && g > b && (r - b) > 12) {
              skinToneCount++;
            }

            brightnessSum += (r + g + b) / 3;
          }

          const coloredRatio = coloredPixelCount / pixelCount;
          const skinRatio = skinToneCount / pixelCount;
          const avgBrightness = brightnessSum / pixelCount;

          if (skinRatio > 0.015 || coloredRatio > 0.035) {
            setValidationError('Non-radiographic image detected (Human portrait / Color photo). NeuroScan AI requires authentic thoracic PA/AP chest radiographs.');
          } else if (avgBrightness > 230 || avgBrightness < 10) {
            setValidationError('Invalid radiographic exposure or blank image. Please upload a standard chest radiograph.');
          } else {
            setValidationError(null);
          }
        } catch (e) {
          setValidationError(null);
        }
      };
      img.src = url;
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResults(null);
    setAiReportData(null);
    setValidationError(null);
    setImageMeta({ width: 0, height: 0, size: '', name: '' });
  };

  // Generate multimodal report from backend endpoint
  const generateAiReport = async (cnnData, targetUrl) => {
    setIsAiReportLoading(true);
    try {
      const res = await fetch('/api/ai-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: targetUrl || previewUrl,
          cnnResults: cnnData,
          patientInfo
        })
      });

      const data = await res.json();
      if (data && data.report) {
        setAiReportData(data.report);
      }
    } catch (err) {
      console.error('Failed to generate AI report:', err);
    } finally {
      setIsAiReportLoading(false);
    }
  };

  // Run neural analysis via native TensorFlow engine API
  const runInference = async (urlToAnalyze) => {
    setIsScanning(true);
    setResults(null);
    setAiReportData(null);

    const targetUrl = urlToAnalyze || previewUrl;

    try {
      const startTime = performance.now();
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: targetUrl,
          patientInfo
        })
      });

      const data = await res.json();
      const latency = Math.round(performance.now() - startTime);
      if (data && data.model_info) {
        data.model_info.inference_latency_ms = latency;
      }
      setResults(data);

      // Automatically synthesize generative report and second opinion
      generateAiReport(data, targetUrl);
    } catch (err) {
      console.error('Inference error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <>
      <Head>
        <title>NeuroScan AI — Thoracic Radiograph Diagnostic Workstation</title>
        <meta name="description" content="State of the art chest X-ray deep learning clinical intelligence platform." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=2" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico?v=2" />
        <link rel="shortcut icon" href="/favicon.ico?v=2" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>

      <div className="ambient-background" />

      <main className="app-container" style={{ position: 'relative' }}>
        {/* Navigation Bar */}
        <Navbar />

        {/* 2-Column Clinical Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(340px, 1.05fr) minmax(340px, 1.15fr)',
          gap: '1.5rem',
          alignItems: 'start'
        }}>
          {/* Left Column: Merged Acquisition & Radiological Workstation */}
          <div>
            <Workstation
              selectedFile={selectedFile}
              previewUrl={previewUrl}
              imageMeta={imageMeta}
              onFileSelect={handleFileSelect}
              onClear={handleClear}
              patientInfo={patientInfo}
              setPatientInfo={setPatientInfo}
              isScanning={isScanning}
              onAnalyze={() => runInference(previewUrl)}
              canAnalyze={Boolean(previewUrl) && !validationError}
              results={results}
              validationError={validationError}
            />
          </div>

          {/* Right Column: Pre-Scan Welcome Board OR Post-Scan Clinical Reports */}
          <div>
            {!results ? (
              <WelcomeBoard />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* 1. Primary CNN Classifier Assessment */}
                <FindingsPanel
                  results={results}
                  onOpenReport={() => setIsReportOpen(true)}
                />

                {/* 2. Multimodal Generative Clinical Report & ICD-10 */}
                <AIReportCard
                  reportData={aiReportData}
                  isLoading={isAiReportLoading}
                  onRegenerate={() => generateAiReport(results, previewUrl)}
                />

                {/* 3. Clinical Guidelines & Pathways */}
                <Recommendations
                  isPneumonia={results.is_pneumonia || false}
                />
              </div>
            )}
          </div>
        </div>

        {/* Floating Quick Action Button for AI Copilot (when closed) */}
        {!isCopilotOpen && (
          <button
            onClick={() => setIsCopilotOpen(true)}
            style={{
              position: 'fixed',
              bottom: '1.75rem',
              right: '1.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.7rem 1.25rem',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#ffffff',
              border: 'none',
              boxShadow: '0 8px 25px -5px rgba(37, 99, 235, 0.4)',
              cursor: 'pointer',
              zIndex: 8000,
              fontSize: '0.82rem',
              fontWeight: 700,
              transition: 'transform 0.15s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Bot size={17} />
            <span>Ask AI</span>
          </button>
        )}

        {/* Medical Print / PDF Export Modal */}
        <ExportModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          results={results}
          patientInfo={patientInfo}
          previewUrl={previewUrl}
          aiReport={aiReportData}
        />

        {/* Interactive AI Copilot Drawer */}
        <AICopilot
          isOpen={isCopilotOpen}
          onClose={() => setIsCopilotOpen(false)}
          previewUrl={previewUrl}
          results={results}
          patientInfo={patientInfo}
        />
      </main>
    </>
  );
}
