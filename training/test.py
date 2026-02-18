import librosa
import numpy as np
import joblib

# -----------------------------
# 1. LOAD SAVED MODEL & CONFIG
# -----------------------------
model = joblib.load("panic_voice_model.pkl")
mfcc_config = joblib.load("mfcc_config.pkl")

# -----------------------------
# 2. MFCC EXTRACTION
# -----------------------------
def extract_mfcc(audio_path):
    audio, sr = librosa.load(
        audio_path, 
        sr=mfcc_config["sample_rate"]
    )

    mfcc = librosa.feature.mfcc(
        y=audio,
        sr=sr,
        n_mfcc=mfcc_config["n_mfcc"]
    )

    return np.mean(mfcc, axis=1)

# -----------------------------
# 3. PANIC DETECTION FUNCTION
# -----------------------------
def detect_panic(audio_path, threshold=0.75):
    features = extract_mfcc(audio_path)

    panic_prob = model.predict_proba([features])[0][1]

    print(f"Panic Probability: {panic_prob:.2f}")

    if panic_prob >= threshold:
        print("🚨 PANIC DETECTED")
    else:
        print("✅ NORMAL VOICE")

# -----------------------------
# 4. TEST WITH AUDIO FILE
# -----------------------------
# Replace with your test audio file
detect_panic("test_audio.wav")
