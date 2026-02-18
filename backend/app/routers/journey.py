from fastapi import APIRouter, Depends, HTTPException
from app import schemas

router = APIRouter(tags=["Journey & Safety"])

@router.post("/start-journey")
def start_journey():
    print("Journey Started")
    return {"message": "Journey started"}

@router.post("/stop-journey")
def stop_journey():
    print("Journey Stopped")
    return {"message": "Journey stopped"}

@router.post("/location-update")
def location_update(location: schemas.LocationUpdate):
    print(f"Location Update: Lat={location.latitude}, Lng={location.longitude}, Speed={location.speed}")
    return {"message": "Location received"}

@router.post("/timer-expired")
def timer_expired():
    print("ALARM: Timer Expired! notify contacts via SMS (Pending)")
    return {"message": "Timer expired alert received"}

@router.post("/trigger-sos")
def trigger_sos(location: schemas.LocationUpdate):
    print(f"SOS TRIGGERED at {location.latitude}, {location.longitude}")
    # In real app: Send SMS to contacts, Notify Police
    return {"message": "SOS Alert Sent"}
