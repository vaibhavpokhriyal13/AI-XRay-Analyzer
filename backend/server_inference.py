import os
import sys
import json
import base64
from http.server import HTTPServer, BaseHTTPRequestHandler
import tensorflow as tf
import numpy as np

# Load real model.h5 into memory once at startup
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model.h5")
print(f"[NeuroScan Backend] Loading deep learning model from {MODEL_PATH} ...")
model = tf.keras.models.load_model(MODEL_PATH)
print("[NeuroScan Backend] Model loaded successfully into memory!")

# Warmup run
dummy = tf.zeros((1, 224, 224, 3), dtype=tf.float32)
_ = model.predict(dummy, verbose=0)
print("[NeuroScan Backend] Neural execution pipeline warmed up.")

class InferenceHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        if self.path != '/predict':
            self.send_response(404)
            self.end_headers()
            return

        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)

        try:
            req_json = json.loads(post_data.decode('utf-8'))
            img_b64 = req_json.get('imageBase64', '')
            
            if ',' in img_b64:
                img_b64 = img_b64.split(',', 1)[1]

            raw_bytes = base64.b64decode(img_b64)
            img = tf.image.decode_image(raw_bytes, channels=3)
            img = tf.image.resize(img, (224, 224))
            arr = tf.cast(img, tf.float32)
            
            # Zero-center normalization [-1.0, 1.0] for MobileNetV2
            normalized = (arr / 127.5) - 1.0
            batched = tf.expand_dims(normalized, 0)
            
            pneu_prob = float(model.predict(batched, verbose=0)[0][0])
            is_pneu = pneu_prob > 0.5
            confidence = (pneu_prob if is_pneu else (1.0 - pneu_prob)) * 100.0
            
            resp = {
                "success": True,
                "is_pneumonia": is_pneu,
                "probability": pneu_prob,
                "confidence": round(confidence, 1),
                "model": "Trained MobileNetV2 Checkpoint (Native Tensor Engine)"
            }
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(resp).encode('utf-8'))

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))

    def log_message(self, format, *args):
        # Clean logging
        sys.stdout.write(f"[Backend HTTP] {args[0]} - {args[1]}\n")
        sys.stdout.flush()

def run(port=None):
    if port is None:
        port = int(os.environ.get("PORT", 5005))
    server_address = ('0.0.0.0', port)
    httpd = HTTPServer(server_address, InferenceHandler)
    print(f"[NeuroScan Backend] Serving real neural inference on port {port} at http://0.0.0.0:{port}/predict")
    httpd.serve_forever()

if __name__ == '__main__':
    run()
