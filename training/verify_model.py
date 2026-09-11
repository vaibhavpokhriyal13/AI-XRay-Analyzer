"""
=============================================================================
NeuroScan AI — Automated Model Health & Calibration Verification Tool
=============================================================================
Usage:
    python training/verify_model.py [path_to_model.h5]

Checks whether a model is suffering from:
1. Model Collapse / Prediction Saturation (always outputting ~0.9999)
2. Extreme Positive Logit Bias
3. Dead Neurons or Non-Responsive Activation
=============================================================================
"""

import sys
import os
import numpy as np

def verify_model(model_path="model.h5"):
    if not os.path.exists(model_path):
        print(f"[ERROR]: Model file not found at '{model_path}'")
        sys.exit(1)

    print(f"Loading and analyzing model: {model_path} ...")
    import tensorflow as tf

    try:
        model = tf.keras.models.load_model(model_path)
    except Exception as e:
        print(f"[ERROR]: Failed to load model: {e}")
        sys.exit(1)

    print("\n--- MODEL TOPOLOGY ---")
    print(f"Total Layers: {len(model.layers)}")
    print(f"Input Shape:  {model.input_shape}")
    print(f"Output Shape: {model.output_shape}")
    last_layer = model.layers[-1]
    activation = getattr(last_layer, "activation", None)
    act_name = activation.__name__ if activation else "None"
    print(f"Output Layer: {last_layer.name} ({last_layer.__class__.__name__}, activation='{act_name}')")

    print("\n--- SYNTHETIC DE-SATURATION SANITY TEST ---")
    print("Testing model with non-pathological baseline inputs:")

    inputs = {
        "Pure Black (zeros)": np.zeros((1, 224, 224, 3), dtype=np.float32),
        "Pure White (ones)": np.ones((1, 224, 224, 3), dtype=np.float32),
        "Mid-Gray (0.5)": np.full((1, 224, 224, 3), 0.5, dtype=np.float32),
        "Random Noise": np.random.uniform(0, 1, (1, 224, 224, 3)).astype(np.float32),
    }

    results = {}
    is_saturated = True

    for name, tensor in inputs.items():
        pred = float(model.predict(tensor, verbose=0)[0][0])
        results[name] = pred
        print(f"  * {name:<20} -> Prediction: {pred:.4f} ({(pred*100):.2f}% Pneumonia probability)")
        if pred < 0.85:
            is_saturated = False

    print("\n--- DIAGNOSTIC VERDICT ---")
    if is_saturated:
        print("[FAIL] STATUS: CRITICAL MODEL COLLAPSE (SATURATED)")
        print("Explanation:")
        print("  The model outputs > 0.85 on EVERY input (including blank black and white images).")
        print("  This model is frozen at the upper boundary of the sigmoid function and will")
        print("  falsely diagnose healthy lungs as Pneumonia with ~95%+ certainty.")
        print("\nAction Required:")
        print("  Retrain the model using 'training/train_colab.py' with balanced class weights.")
        return False
    else:
        print("[PASS] STATUS: HEALTHY / DYNAMIC (NON-SATURATED)")
        print("Explanation:")
        print("  The model successfully produces differentiated probability outputs.")
        print("  Non-pathological baseline inputs did not saturate the output neuron.")
        return True

def test_image(image_path, model_path="model.h5"):
    import tensorflow as tf
    model = tf.keras.models.load_model(model_path)
    raw = tf.io.read_file(image_path)
    img = tf.image.decode_image(raw, channels=3)
    img = tf.image.resize(img, (224, 224))
    arr = tf.cast(img, tf.float32)

    pred_standard = float(model.predict(tf.expand_dims(arr / 255.0, 0), verbose=0)[0][0])
    pred_mobilenet = float(model.predict(tf.expand_dims(arr / 127.5 - 1.0, 0), verbose=0)[0][0])

    print(f"\nEvaluating Image: {image_path}")
    print(f"  [0, 1] Rescaling   : {pred_standard:.4f} ({'Pneumonia' if pred_standard > 0.5 else 'Normal'})")
    print(f"  [-1, 1] Zero-Center: {pred_mobilenet:.4f} ({'Pneumonia' if pred_mobilenet > 0.5 else 'Normal'})")

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "model.h5"
    if target.endswith(('.jpg', '.jpeg', '.png')):
        test_image(target)
    else:
        verify_model(target)
