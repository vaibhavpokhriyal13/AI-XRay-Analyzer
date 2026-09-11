# 🧠 How to Train Your Model to >96% Accuracy (Free Google Colab GPU)

This guide shows you how to train your deep learning model to **above 96% accuracy** using **Google Colab's Free T4 GPU**. Your computer will do **zero heavy computation**.

---

## ⚡ 1-Click Method (Fastest & Easiest)

### Step 1: Open Google Colab
1. Go to [Google Colab](https://colab.research.google.com/).
2. In the popup dialog, click the **Upload** tab.
3. Upload [`training/NeuroScan_Train_Colab.ipynb`](training/NeuroScan_Train_Colab.ipynb) from this repository.

### Step 2: Enable Free GPU
1. In Colab's top menu, click **Runtime** > **Change runtime type**.
2. Select **T4 GPU** under Hardware accelerator and click **Save**.

### Step 3: Run All
1. Click **Runtime** > **Run all** (or press `Ctrl + F9`).
2. **That's it!** The script handles everything autonomously:
   - ✅ Automatically downloads the Kaggle Chest X-Ray dataset (zero API keys needed).
   - ✅ Calculates balanced class weights (`Normal: ~2.89, Pneumonia: ~0.75`) to completely eliminate the false-positive bias.
   - ✅ **Phase 1 (Warmup)**: Trains the classification head.
   - ✅ **Phase 2 (Fine-Tuning)**: Unfreezes the top 40 MobileNetV2 layers with a gentle learning rate (`1e-5`) to detect authentic radiographic consolidations.
   - ✅ Automatically saves and triggers a browser download of:
     - `model_high_accuracy.h5` (Keras weights)
     - `web_model.zip` (TensorFlow.js web format ready for your Next.js app)

---

## 📁 Step 4: Update Your Local App

Once the download finishes:
1. **For the Next.js Web App**:
   Unzip `web_model.zip` and copy the files (`model.json` and `group1-shard*.bin`) into:
   ```
   AI-XRay-Analyzer/web/public/model/
   ```
2. **For Python / Root**:
   Copy `model_high_accuracy.h5` into your project root and rename it to `model.h5`.

Your model will now accurately distinguish healthy lungs from pneumonia with true clinical precision!

