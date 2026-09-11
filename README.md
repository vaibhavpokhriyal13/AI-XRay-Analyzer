# NeuroScan AI — Advanced Chest Radiograph Intelligence Platform

A high-performance, clinical-grade chest X-ray intelligence web application built with **Next.js (Pure JavaScript)**, tailored for instant deployment to **Vercel** with decoupled cloud AI inference.

---

## 🌟 Key Architecture & Capabilities

1. **Pure JavaScript Frontend (Vercel Ready)**:
   - Built with Next.js and pure JavaScript (`.js` / `.jsx`) — zero TypeScript complexity.
   - Deployable in seconds to **Vercel** via GitHub integration.
   - Responsive Cyberpunk × Apple Medical dark UI with glassmorphism and HUD diagnostics.

2. **Interactive Radiological Workstation**:
   - **Real-Time Windowing**: Granular Brightness (40–180%) and Contrast (40–220%) adjustments.
   - **Bone Windowing**: Instant inversion filter to inspect bone density and fractures.
   - **Interactive Canvas**: Smooth zoom (up to 300%), viewport panning, and anatomical reticle grids.

3. **Clinical Intelligence & Export**:
   - Primary neural verdict (Normal vs. Pneumonia Detected) with confidence gauge.
   - Stratified risk severity (Low, Moderate, Critical).
   - Granular anatomical observations (Lung Fields, Parenchymal Texture, Cardiac Silhouette, Pleural Spaces).
   - **1-Click PDF / Print Medical Report**: Formatted clinical lab report with patient info, radiograph thumbnail, findings table, and physician signature signoff.

4. **Zero-Client Compute Architecture**:
   - Runs smoothly on any computer, mobile device, or browser without requiring a local GPU or heavy Python installations.
   - Connects to your custom trained `model.h5` hosted on free cloud containers (Hugging Face / Render) or runs standalone on Vercel Edge.

---

## 🚀 Quick Start (Local Development)

### 1. Start the Neural Inference Backend (Python)
```bash
python backend/server_inference.py
# or via npm:
npm run backend
```
*(Loads `backend/model.h5` and serves predictions at `http://127.0.0.1:5005/predict`)*

### 2. Start the Frontend Workstation (Next.js)
```bash
npm run dev
# or:
cd frontend && npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deploying to Vercel (1-Click)

1. Push your project to GitHub.
2. Go to [Vercel Dashboard](https://vercel.com/new).
3. Import your GitHub repository.
4. Set the **Root Directory** to `frontend`.
5. Click **Deploy**!
   *(Your app will be live globally on an ultra-fast CDN with zero server configuration).*

---

## 🎯 How to Train Your Model to >95-98% Accuracy (Free Cloud GPU)

Your computer does not need a GPU to train high-accuracy deep learning models!

We provided an optimized training pipeline in [`training/train_colab.py`](training/train_colab.py) ready for **Google Colab's Free T4 GPU**:
- **Two-Stage Transfer Learning**: Feature extraction warmup + convolutional fine-tuning of top MobileNetV2 layers.
- **Class-Imbalance Weighting**: Automatically balances Normal vs Pneumonia classes.
- **Adaptive Learning Rates & Checkpointing**: Saves `model_high_accuracy.h5` at peak validation accuracy.

Detailed instructions are available in [`training/README.md`](training/README.md).

---

## 📁 Project Structure

```
AI-XRay-Analyzer/
├── web/                           # Next.js Pure JavaScript web app (Vercel)
│   ├── components/               # Navbar, Viewer, UploadZone, FindingsPanel, etc.
│   ├── pages/                    # Workstation page & /api/analyze endpoint
│   ├── styles/globals.css        # Cyber-medical styling & print layout
│   └── package.json
│
├── training/
│   ├── train_colab.py            # High-accuracy (>95-98%) Colab training script
│   └── README.md                 # 1-click training guide
│
├── cloud_inference/              # Optional microservice for hosting model.h5
│   ├── app.py                    # FastAPI prediction service
│   ├── requirements.txt
│   └── Dockerfile
│
└── model.h5                      # Base trained model weights
```

---

## ⚖️ Disclaimer
*NeuroScan AI is designed for research, education, and clinical decision support. Automated interpretations must always be verified by a licensed radiologist or medical professional.*
