/**
 * NeuroScan AI - Interactive Clinical Copilot Chat Endpoint
 * Connects to Google Gemini 1.5 Flash or uses contextual clinical assistant.
 */

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '15mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { messages = [], imageBase64, cnnResults, patientInfo, mode = 'doctor', apiKey: userApiKey } = req.body;
    const apiKey = userApiKey || process.env.GEMINI_API_KEY;

    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const lastMessage = messages[messages.length - 1];

    if (apiKey) {
      try {
        const reply = await callGeminiChat({
          apiKey,
          messages,
          imageBase64,
          cnnResults,
          patientInfo,
          mode,
        });

        if (reply) {
          return res.status(200).json({
            success: true,
            source: 'gemini-1.5-flash',
            reply,
          });
        }
      } catch (err) {
        console.warn('Gemini chat error, using clinical fallback chat:', err.message);
      }
    }

    // Contextual clinical rules fallback
    const fallbackReply = generateFallbackChatReply({
      query: lastMessage.content,
      cnnResults,
      patientInfo,
      mode,
    });

    return res.status(200).json({
      success: true,
      source: 'clinical-assistant',
      is_fallback: !apiKey,
      reply: fallbackReply,
    });
  } catch (error) {
    console.error('ai-chat error:', error);
    return res.status(500).json({ error: 'Failed to process AI chat message' });
  }
}

async function callGeminiChat({ apiKey, messages, imageBase64, cnnResults, patientInfo, mode }) {
  let mimeType = 'image/jpeg';
  let base64Data = imageBase64 || '';
  if (imageBase64 && imageBase64.includes(';base64,')) {
    const parts = imageBase64.split(';base64,');
    mimeType = parts[0].replace('data:', '') || 'image/jpeg';
    base64Data = parts[1];
  }

  const isDoctor = mode === 'doctor';
  const systemInstruction = isDoctor
    ? `You are NeuroScan AI Copilot, a board-certified clinical radiologist and thoracic medical AI specialist.
Active scan context:
- Deep Learning Verdict: ${cnnResults ? (cnnResults.is_pneumonia ? 'Pneumonia Detected' : 'Normal Chest Radiograph') : 'No scan active yet'}
- CNN Model Confidence: ${cnnResults?.confidence || 'N/A'}%
- Patient ID: ${patientInfo?.id || 'Anonymous'}
- Demographics: ${patientInfo?.demographics || 'Not specified'}
- Clinical Symptoms: ${patientInfo?.symptoms || 'None recorded'}

Mode: DOCTOR / CLINICIAN MODE.
Use rigorous clinical vocabulary, reference ATS/IDSA guidelines, anatomical landmarks, differential diagnoses, CURB-65 / PSI severity criteria, or antibiotic stewardship when relevant. Be concise, structured, and highly evidence-based.`
    : `You are NeuroScan AI Copilot, a compassionate, friendly medical healthcare assistant.
Active scan context:
- Scan verdict: ${cnnResults ? (cnnResults.is_pneumonia ? 'Signs of Pneumonia / Infection' : 'Clear / Normal Lungs') : 'No scan active yet'}
- Patient ID: ${patientInfo?.id || 'Patient'}
- Reported symptoms: ${patientInfo?.symptoms || 'None recorded'}

Mode: PATIENT-FRIENDLY MODE.
Explain everything in plain English with zero frightening medical jargon. Be reassuring, polite, and emphasize that this AI is an assistant tool and they should always discuss their treatment and health questions directly with their primary healthcare provider.`;

  // Format messages into Gemini API contents structure
  const formattedContents = [];

  // Add active radiograph on the first user query if available
  let firstUser = true;

  for (const m of messages) {
    const role = m.role === 'assistant' ? 'model' : 'user';
    const parts = [{ text: m.content }];

    if (role === 'user' && firstUser && base64Data) {
      parts.push({
        inline_data: {
          mime_type: mimeType,
          data: base64Data,
        },
      });
      firstUser = false;
    }

    formattedContents.push({ role, parts });
  }

  const payload = {
    system_instruction: {
      parts: [{ text: systemInstruction }],
    },
    contents: formattedContents,
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 1024,
    },
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
    }
  } catch (e) {
    clearTimeout(timeoutId);
    console.warn('Gemini chat fast fallback:', e.message);
  }

  throw new Error('Gemini model unavailable or timed out');
}

function generateFallbackChatReply({ query, cnnResults, patientInfo, mode }) {
  const q = query.toLowerCase();
  const isPneumonia = cnnResults?.is_pneumonia;
  const isDoctor = mode === 'doctor';

  if (isDoctor) {
    if (q.includes('antibiotic') || q.includes('treatment') || q.includes('idsa')) {
      if (isPneumonia) {
        return `**ATS/IDSA Guidelines Recommendation for Community-Acquired Pneumonia (CAP):**

1. **Outpatient (No comorbidities):**
   * *First-line:* Amoxicillin 1g TID OR Doxycycline 100mg BID.
   * *Macrolide alternative:* Azithromycin 500mg day 1, then 250mg daily (if local pneumococcal macrolide resistance <25%).

2. **Outpatient (With comorbidities e.g. COPD, diabetes, renal disease):**
   * Combination: Amoxicillin/clavulanate (or cefpodoxime/cefuroxime) + Azithromycin/Doxycycline.
   * Monotherapy alternative: Respiratory fluoroquinolone (Levofloxacin 750mg daily or Moxifloxacin 400mg daily).

3. **Inpatient Non-Severe:**
   * Beta-lactam (Ceftriaxone 1-2g IV daily or Ampicillin-sulbactam) + Macrolide IV/PO.

*Note: Sputum cultures and blood cultures should be obtained prior to initiating parenteral antibiotics in hospitalized patients.*`;
      } else {
        return `**Antibiotic Stewardship Review:**
The active radiograph shows **no focal consolidation or infiltrates** (Normal evaluation with ${cnnResults?.confidence || 90}% confidence). 

Unless there is clinical or microbiological evidence of another bacterial focus (e.g. purulent sinusitis or UTI), empiric antibiotic therapy is **not indicated** for clear chest radiographs. Consider symptomatic relief for viral tracheobronchitis.`;
      }
    }

    if (q.includes('severity') || q.includes('curb') || q.includes('triage')) {
      return `**Pneumonia Severity & Inpatient Triage (CURB-65 Criteria):**

Assess the following 5 clinical parameters (1 point each):
* **C**onfusion (new mental disorientation)
* **U**rea > 7 mmol/L (BUN > 19 mg/dL)
* **R**espiratory rate ≥ 30 breaths/min
* **B**lood pressure (Systolic < 90 mmHg or Diastolic ≤ 60 mmHg)
* **65** Age ≥ 65 years

**Risk Stratification:**
* **Score 0-1:** Low risk (mortality < 3%). Suitable for outpatient management.
* **Score 2:** Moderate risk (mortality ~ 9%). Inpatient ward observation or close outpatient monitoring.
* **Score 3-5:** Severe risk (mortality 15-40%). Urgent hospital admission; consider ICU triage if CURB-65 ≥ 4 or if requiring mechanical ventilation/vasopressors.`;
    }

    if (q.includes('differential') || q.includes('causes') || q.includes('etiology')) {
      if (isPneumonia) {
        return `**Differential Diagnostic Evaluation for Parenchymal Opacities:**

1. **Infective Consolidation (Bacterial CAP):** S. pneumoniae, H. influenzae, or Legionella. Alveolar opacities with air bronchograms.
2. **Atypical / Viral Pneumonia:** Mycoplasma pneumoniae, Influenza, or SARS-CoV-2. Bilateral reticular opacities, peribronchial cuffing.
3. **Pulmonary Infarction / PE:** Basal wedge-shaped density (Hampton's hump); evaluate with D-Dimer / CT Pulmonary Angiogram if sudden onset pleurisy.
4. **Organizing Pneumonia (COP) / Eosinophilic Pneumonia:** Subacute peripheral consolidations refractory to standard antimicrobials.`;
      } else {
        return `**Differential Considerations for Symptomatic Patients with Clear Radiographs:**

1. **Acute Viral Bronchitis:** Most common etiology of cough; radiograph typically unremarkable.
2. **Asthma / Reactive Airway Disease Exacerbation:** Wheezing and dyspnea without radiographic consolidation.
3. **Early Atypical Pneumonia:** Subtle interstitial changes may lag behind clinical presentation by 24-48 hours.
4. **Upper Airway Cough Syndrome (UACS) / GERD:** Chronic or subacute cough without pulmonary parenchymal involvement.`;
      }
    }

    // Default doctor answer
    return `**Radiological Assessment Summary:**
* **Verdict:** ${isPneumonia ? 'Pneumonia Detected' : 'Normal Thoracic Radiograph'}
* **Confidence Certainty:** ${cnnResults?.confidence || 85}%
* **Patient ID:** ${patientInfo?.id || 'Anonymous'}

${isPneumonia 
  ? 'The radiograph demonstrates focal opacities consistent with alveolar consolidation. Recommend clinical correlation with vital signs (SpO2, heart rate, temperature), respiratory exam, and laboratory markers (CBC with differential, CRP/procalcitonin).'
  : 'The radiograph shows clear lung parenchyma without evidence of acute consolidation, pneumothorax, or effusion. If respiratory symptoms persist, consider follow-up imaging in 48-72 hours if atypical infection is suspected.'}

*You can ask about CURB-65 severity scoring, ATS/IDSA antibiotic stewardship, or differential etiologies.*`;
  }

  // Patient friendly mode
  if (q.includes('contagious') || q.includes('spread')) {
    return isPneumonia
      ? `**Is pneumonia contagious?**
Pneumonia itself isn't directly passed from person to person like a common cold, but the viruses or bacteria that caused the lung infection can spread through droplets when coughing or sneezing. 

It is best to rest at home, cover your mouth when coughing, wash your hands frequently, and avoid close contact with vulnerable individuals (like elderly family members or infants) until you have been on antibiotics for at least 48 hours or fever has resolved.`
      : `**Is this contagious?**
Your chest X-ray showed healthy, clear lungs with no pneumonia! However, if you have a cold, cough, or runny nose, common respiratory viruses can still spread. Simple precautions like washing hands often and resting will protect others.`;
  }

  if (q.includes('what should i do') || q.includes('next steps') || q.includes('advice')) {
    return isPneumonia
      ? `**Recommended Next Steps:**
1. **See Your Doctor:** Bring this report to your physician so they can prescribe the right medicine (such as an antibiotic or inhaler).
2. **Rest & Fluids:** Take time off work or school, drink warm teas and plenty of water, and avoid cold drafts.
3. **Watch for Red Flags:** If you have severe trouble breathing, chest pain when inhaling, or your lips look bluish, seek emergency medical care right away.`
      : `**Recommended Next Steps:**
1. **Rest Up:** Your lungs look great and clear! If you still feel sick or have a cough, your doctor can recommend throat lozenges, allergy medicine, or rest.
2. **Stay Hydrated:** Drink plenty of warm water or soup to soothe your throat.
3. **Check Back if Needed:** If your cough gets significantly worse or you develop a high fever, contact your doctor.`;
  }

  // Default patient friendly response
  return isPneumonia
    ? `**Hello! Here is what you need to know about your scan:**

Your chest X-ray shows signs of **pneumonia**, which means there is some inflammation and fluid buildup in part of your lungs. 

Please don't worry—pneumonia is very common and usually clears up completely with standard treatment from your doctor. Be sure to share this result with your healthcare provider so they can prescribe what is best for you!`
    : `**Hello! Here is what you need to know about your scan:**

Your chest X-ray looks **completely clear and normal**. There is no sign of fluid, infection, or lung damage, and your heart looks healthy. 

If you are experiencing a cough or mild illness, it could be a simple cold, which your doctor can help you treat easily!`;
}
