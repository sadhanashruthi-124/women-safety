from fastapi import APIRouter, UploadFile, File, HTTPException
from app import schemas
from app.services.panic_detection import detector
import shutil
import os
import tempfile

router = APIRouter(tags=["Panic Detection"])

@router.post("/panic-detected", response_model=schemas.PanicResponse)
async def detect_panic(audio: UploadFile = File(...)):
    # Save temp file
    # Ensure temp directory exists
    temp_dir = tempfile.gettempdir()
    temp_path = os.path.join(temp_dir, f"temp_{audio.filename}")
    
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(audio.file, buffer)
            
        # Predict
        panic_prob = detector.predict(temp_path)
        is_panic = panic_prob > 0.6  # Threshold
        
        return {
            "message": "Audio analyzed",
            "panic_probability": float(panic_prob),
            "is_panic": is_panic
        }
    except Exception as e:
        print(f"Error processing audio: {e}")
        # In case of missing librosa/ffmpeg or other errors, return a fallback or 500
        # For MVP stability, we might want to return a default if it acts up
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)
