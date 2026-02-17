from fastapi import FastAPI
from utils import detect_panic
from fastapi.responses import JSONResponse

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Women Safety application"}

@app.post("/detect")
def detect(audio: bytes):
    return JSONResponse(content={"result": detect_panic(audio)})
