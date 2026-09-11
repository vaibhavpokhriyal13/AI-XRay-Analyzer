"""
=============================================================================
NeuroScan AI — Dataset Benchmark & Clinical Evaluation Tool
=============================================================================
Usage:
    python training/evaluate_dataset.py [path_to_test_dataset] [path_to_model.h5]

Expects dataset directory to contain subdirectories by class:
    test_dir/
      NORMAL/
        *.jpeg
      PNEUMONIA/
        *.jpeg

If no dataset path is provided, you can specify one interactively or
download a sample test set via kagglehub / URL.
=============================================================================
"""

import sys
import os
import time
import glob
import numpy as np

def run_evaluation(dataset_dir, model_path="model.h5"):
    if not os.path.exists(model_path):
        print(f"[ERROR]: Model file '{model_path}' not found!")
        sys.exit(1)

    if not os.path.exists(dataset_dir):
        print(f"[ERROR]: Dataset directory '{dataset_dir}' not found!")
        print("Please provide a valid directory containing NORMAL and PNEUMONIA folders.")
        sys.exit(1)

    # Find class directories (case-insensitive)
    dirs = {d.upper(): os.path.join(dataset_dir, d) for d in os.listdir(dataset_dir) if os.path.isdir(os.path.join(dataset_dir, d))}
    
    normal_dir = dirs.get("NORMAL")
    pneumonia_dir = dirs.get("PNEUMONIA")

    if not normal_dir or not pneumonia_dir:
        print(f"[ERROR]: Dataset directory '{dataset_dir}' must contain 'NORMAL' and 'PNEUMONIA' subdirectories.")
        print(f"Found subdirectories: {list(dirs.keys())}")
        sys.exit(1)

    # Collect image files
    exts = ("*.jpg", "*.jpeg", "*.png", "*.bmp")
    normal_files = []
    pneumonia_files = []

    for ext in exts:
        normal_files.extend(glob.glob(os.path.join(normal_dir, ext)))
        normal_files.extend(glob.glob(os.path.join(normal_dir, ext.upper())))
        pneumonia_files.extend(glob.glob(os.path.join(pneumonia_dir, ext)))
        pneumonia_files.extend(glob.glob(os.path.join(pneumonia_dir, ext.upper())))

    # De-duplicate
    normal_files = sorted(list(set(normal_files)))
    pneumonia_files = sorted(list(set(pneumonia_files)))

    total_images = len(normal_files) + len(pneumonia_files)
    if total_images == 0:
        print(f"[ERROR]: No images (.jpg, .jpeg, .png) found in {dataset_dir}!")
        sys.exit(1)

    if hasattr(sys.stdout, 'reconfigure'):
        try:
            sys.stdout.reconfigure(encoding='utf-8')
        except Exception:
            pass

    print("\n" + "=" * 70)
    print(" NeuroScan AI - Model Dataset Benchmark & Clinical Evaluation")
    print("=" * 70)
    print(f"Target Model:      {os.path.abspath(model_path)}")
    print(f"Dataset Path:      {os.path.abspath(dataset_dir)}")
    print(f"Normal Samples:    {len(normal_files)}")
    print(f"Pneumonia Samples: {len(pneumonia_files)}")
    print(f"Total Cohort Size: {total_images} radiographs")
    print("=" * 70)

    print("\n[1/3] Loading TensorFlow & Pre-trained Neural Weights ...")
    import tensorflow as tf
    model = tf.keras.models.load_model(model_path)
    print("  [OK] Model loaded into memory successfully.")

    print("\n[2/3] Executing Neural Batch Inference with MobileNetV2 Zero-Centered Normalization...")
    start_time = time.time()

    y_true = []
    y_pred = []
    y_prob = []
    misclassified = []

    # Helper to evaluate an image list
    def evaluate_cohort(file_list, true_label, label_name):
        tp_cohort = 0
        total_cohort = len(file_list)
        for i, fpath in enumerate(file_list):
            try:
                raw = tf.io.read_file(fpath)
                img = tf.image.decode_image(raw, channels=3)
                img = tf.image.resize(img, (224, 224))
                arr = tf.cast(img, tf.float32)

                # MobileNetV2 zero-centered scaling [-1.0, +1.0]
                normalized = (arr / 127.5) - 1.0
                batched = tf.expand_dims(normalized, 0)

                prob = float(model.predict(batched, verbose=0)[0][0])
                pred = 1 if prob > 0.5 else 0

                y_true.append(true_label)
                y_pred.append(pred)
                y_prob.append(prob)

                if pred == true_label:
                    tp_cohort += 1
                else:
                    misclassified.append({
                        "file": os.path.basename(fpath),
                        "true_label": label_name,
                        "pred_label": "PNEUMONIA" if pred == 1 else "NORMAL",
                        "confidence": (prob if pred == 1 else (1.0 - prob)) * 100.0,
                        "raw_prob": prob
                    })

                # Print progress bar
                if (i + 1) % max(1, (total_cohort // 10)) == 0 or (i + 1) == total_cohort:
                    pct = int(((i + 1) / total_cohort) * 100)
                    sys.stdout.write(f"\r  * Processing {label_name:<10} [{i + 1}/{total_cohort}] ({pct}%)")
                    sys.stdout.flush()

            except Exception as e:
                print(f"\n  [WARN] Skipping corrupted image {os.path.basename(fpath)}: {e}")

        print(f" -> Accuracy: {(tp_cohort / max(1, total_cohort) * 100):.1f}%")

    # Evaluate Normal Cohort (Label 0)
    evaluate_cohort(normal_files, true_label=0, label_name="NORMAL")

    # Evaluate Pneumonia Cohort (Label 1)
    evaluate_cohort(pneumonia_files, true_label=1, label_name="PNEUMONIA")

    inference_duration = time.time() - start_time
    avg_latency = (inference_duration / max(1, total_images)) * 1000

    # Calculate Clinical Metrics
    y_true = np.array(y_true)
    y_pred = np.array(y_pred)

    tp = np.sum((y_true == 1) & (y_pred == 1))
    tn = np.sum((y_true == 0) & (y_pred == 0))
    fp = np.sum((y_true == 0) & (y_pred == 1))
    fn = np.sum((y_true == 1) & (y_pred == 0))

    accuracy = (tp + tn) / max(1, (tp + tn + fp + fn)) * 100.0
    sensitivity = (tp / max(1, (tp + fn))) * 100.0   # Recall for Pneumonia
    specificity = (tn / max(1, (tn + fp))) * 100.0   # True Negative rate for Normal
    precision = (tp / max(1, (tp + fp))) * 100.0 if (tp + fp) > 0 else 0.0
    f1_score = 2 * (precision * sensitivity) / max(1e-5, (precision + sensitivity))

    print("\n" + "=" * 70)
    print(" [3/3] CLINICAL DIAGNOSTIC BENCHMARK RESULTS")
    print("=" * 70)
    print(f"  Overall Accuracy:          {accuracy:.2f}%")
    print(f"  Pneumonia Sensitivity:     {sensitivity:.2f}%  (Recall - Detected Disease)")
    print(f"  Normal Specificity:        {specificity:.2f}%  (True Negative Rate - Benign)")
    print(f"  Positive Predictive Value: {precision:.2f}%  (Precision)")
    print(f"  Harmonic F1-Score:         {f1_score:.2f}")
    print(f"  Average Inference Latency: {avg_latency:.1f} ms per radiograph")
    print(f"  Total Benchmark Time:      {inference_duration:.1f} seconds")

    print("\n--- CONFUSION MATRIX ---")
    print("                      Actual Normal       Actual Pneumonia")
    print(f"  Predicted Normal    TN = {tn:<14} FN = {fn:<14}")
    print(f"  Predicted Pneumonia FP = {fp:<14} TP = {tp:<14}")
    print("-" * 70)

    if misclassified:
        print(f"\n--- MISCLASSIFIED CASES ({len(misclassified)} of {total_images}) ---")
        print(f"{'Filename':<35} {'True':<12} {'Predicted':<12} {'Certainty':<10}")
        print("-" * 70)
        for item in misclassified[:15]:
            print(f"{item['file']:<35} {item['true_label']:<12} {item['pred_label']:<12} {item['confidence']:.1f}%")
        if len(misclassified) > 15:
            print(f"... and {len(misclassified) - 15} more cases.")
    else:
        print("\n[PERFECT] Zero misclassifications detected across the evaluated cohort!")

    print("\n" + "=" * 70)
    print(f"Benchmark Verdict: {'PASSED (Clinically Sound)' if accuracy >= 90 else 'NEEDS FURTHER CALIBRATION'}")
    print("=" * 70 + "\n")

if __name__ == "__main__":
    model_path = sys.argv[2] if len(sys.argv) > 2 else "model.h5"

    if len(sys.argv) > 1 and sys.argv[1] not in ("--download", "--auto", "auto"):
        dataset_path = sys.argv[1]
        run_evaluation(dataset_path, model_path)
    else:
        print("\nChecking for Kaggle Chest X-Ray dataset via kagglehub...")
        try:
            import kagglehub
            print("Downloading/Locating official test set (zero setup required)...")
            kh_path = kagglehub.dataset_download("paultimothymooney/chest-xray-pneumonia")
            test_dir = None
            for root, dirs, files in os.walk(kh_path):
                if "test" in dirs:
                    test_dir = os.path.join(root, "test")
                    break
            if test_dir and os.path.exists(test_dir):
                print(f"Test dataset located at: {test_dir}")
                run_evaluation(test_dir, model_path)
            else:
                print("[ERROR]: Could not locate 'test' directory inside downloaded dataset.")
        except Exception as e:
            print(f"[ERROR]: Failed to auto-download dataset: {e}")
            print("\nUsage:")
            print("    python training/evaluate_dataset.py <path_to_test_folder> [model.h5]\n")
            print("Example:")
            print("    python training/evaluate_dataset.py \"C:/datasets/chest_xray/test\"\n")

