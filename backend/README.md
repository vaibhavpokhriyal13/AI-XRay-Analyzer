# NeuroScan AI - Deep Learning Inference Backend

Native Python neural inference server hosting the fine-tuned MobileNetV2 chest radiograph diagnostic model (`model.h5`).

## Structure
- `server_inference.py`: High-throughput HTTP server with CORS support serving predictions on `http://127.0.0.1:5005/predict`.
- `model.h5`: Trained Keras/TensorFlow model weights for binary thoracic classification (Normal vs Pneumonia).
- `requirements.txt`: Python package requirements (TensorFlow, NumPy, Pillow, h5py).

## Running the Backend

Ensure you have installed dependencies:
```bash
pip install -r backend/requirements.txt
```

Start the inference server:
```bash
python backend/server_inference.py
```
or from the root via npm:
```bash
npm run backend
```
The server will warm up the neural pipeline and listen on `http://127.0.0.1:5005/predict`.
