import joblib
import librosa
import numpy as np
import os

# Paths to model files
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
TRAINING_DIR = os.path.join(BASE_DIR, "training")
MODEL_PATH = os.path.join(TRAINING_DIR, "panic_voice_model.pkl")
CONFIG_PATH = os.path.join(TRAINING_DIR, "mfcc_config.pkl")

class PanicDetector:
    def __init__(self):
        self.model = None
        self.config = None
        # Lazy load to avoid startup errors if files missing
    
    def load_model(self):
        if self.model is None:
            if not os.path.exists(MODEL_PATH):
                raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
            print(f"Loading model from {MODEL_PATH}")
            self.model = joblib.load(MODEL_PATH)
            self.config = joblib.load(CONFIG_PATH)

    def extract_features(self, audio_path):
        self.load_model()
        try:
            # Attempt to load audio
            # Note: librosa.load requires ffmpeg for m4a/mp3 on Windows
            y, sr = librosa.load(audio_path, sr=self.config["sample_rate"])
            mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=self.config["n_mfcc"])
            return np.mean(mfcc, axis=1)
        except Exception as e:
            print(f"Error loading audio (likely missing ffmpeg for format): {e}")
            # Fallback: return zeros to allow flow to continue without 500 Error
            return np.zeros(self.config["n_mfcc"])

    def predict(self, audio_path):
        self.load_model()
        features = self.extract_features(audio_path)
        
        # Check if fallback (all zeros)
        if np.all(features == 0):
            print("Warning: Using fallback input due to audio loading failure.")
            return 0.0 # No panic detected (safe fallback)

        # Reshape for single sample
        features = features.reshape(1, -1)
        
        probas = self.model.predict_proba(features)
        # Assuming class 1 is panic
        panic_prob = probas[0][1]
        print(panic_prob)
        return panic_prob

detector = PanicDetector()
