import os
import numpy as np
import librosa
import joblib

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report

# -----------------------------
# 1. DATASET PATH
# -----------------------------
DATASET_PATH = r"C:\Users\paran\.cache\kagglehub\datasets\uwrfkaggler\ravdess-emotional-speech-audio\versions\1"

# -----------------------------
# 2. MFCC EXTRACTION
# -----------------------------
def extract_mfcc(audio_path, sr=16000, n_mfcc=13):
    audio, sr = librosa.load(audio_path, sr=sr)
    mfcc = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=n_mfcc)
    return np.mean(mfcc, axis=1)

# -----------------------------
# 3. LOAD & LABEL DATASET
# -----------------------------
X, y = [], []

for root, dirs, files in os.walk(DATASET_PATH):
    for file in files:
        if file.endswith(".wav"):
            parts = file.split("-")
            emotion_code = parts[2]

            # Panic → Angry(05), Fear(06)
            if emotion_code in ["05", "06"]:
                label = 1
            # Normal → Neutral(01), Calm(02)
            elif emotion_code in ["01", "02"]:
                label = 0
            else:
                continue

            file_path = os.path.join(root, file)

            try:
                features = extract_mfcc(file_path)
                X.append(features)
                y.append(label)
            except:
                print("Error processing:", file_path)

X = np.array(X)
y = np.array(y)

print("Total samples:", len(X))
print("Panic samples:", sum(y))
print("Normal samples:", len(y) - sum(y))

# -----------------------------
# 4. TRAIN–TEST SPLIT
# -----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# -----------------------------
# 5. TRAIN MODEL
# -----------------------------
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

print("\nModel training completed")

# -----------------------------
# 6. EVALUATE MODEL
# -----------------------------
y_pred = model.predict(X_test)

print("\nAccuracy:", accuracy_score(y_test, y_pred))
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# -----------------------------
# 7. SAVE MODEL & CONFIG
# -----------------------------
joblib.dump(model, "panic_voice_model.pkl")

mfcc_config = {
    "sample_rate": 16000,
    "n_mfcc": 13
}
joblib.dump(mfcc_config, "mfcc_config.pkl")

print("\nModel and MFCC config saved successfully")
