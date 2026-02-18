import requests
import json
import time
import subprocess
import sys
import os
import wave
import struct
import random

import logging

# Configure logging
logging.basicConfig(filename='test_debug.log', level=logging.INFO, format='%(asctime)s - %(message)s')

def log(msg):
    print(msg)
    logging.info(msg)

BASE_URL = "http://127.0.0.1:8000"

def create_dummy_wav(filename):
    # Create a 1-second dummy silent wav file
    with wave.open(filename, 'w') as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(44100)
        f.writeframes(struct.pack('<h', 0) * 44100)

def wait_for_server():
    for _ in range(10):
        try:
            requests.get(f"{BASE_URL}/")
            return True
        except requests.exceptions.ConnectionError:
            time.sleep(1)
    return False

def test_endpoints():
    log("--- Starting Backend API Tests ---")
    
    # 1. Register
    log("\n1. Testing /register")
    phone = f"999{random.randint(1000000,9999999)}"
    register_data = {
        "name": "Test User",
        "phone": phone,
        "password": "password123",
        "preferences": {"shareLocation": True}
    }
    try:
        res = requests.post(f"{BASE_URL}/register", json=register_data)
        if res.status_code == 200:
            log("   [SUCCESS] Register Success")
            user_data = res.json()
            # print(user_data)
        else:
            log(f"   [FAIL] Register Failed: {res.status_code} {res.text}")
            return
    except Exception as e:
        log(f"   [FAIL] Register Exception: {e}")
        return

    # 2. Login
    log("\n2. Testing /login")
    login_data = {
        "phone": phone,
        "password": "password123"
    }
    res = requests.post(f"{BASE_URL}/login", json=login_data)
    if res.status_code == 200:
        log("   [SUCCESS] Login Success")
    else:
        log(f"   [FAIL] Login Failed: {res.status_code} {res.text}")

    # 3. Verify OTP
    # For testing, we need to know the OTP. logic prints it.
    # We can't easily grab stdout of the server process here if it's already running.
    # But we can verify 400 invalid OTP, or we can check DB if we wanted to be thorough.
    # For now, let's skip positive verified-otp test unless we mock the OTP to a known value.
    # Let's try to verify with WRONG otp to ensure endpoint exists and works.
    log("\n3. Testing /verify-otp (Invalid case)")
    otp_data = {"phone": phone, "otp": "0000"}
    res = requests.post(f"{BASE_URL}/verify-otp", json=otp_data)
    if res.status_code == 400 and "Invalid OTP" in res.text:
        log("   [SUCCESS] Verify OTP (Invalid) Handled Correctly")
    else:
        log(f"   [WARN] Verify OTP Response: {res.status_code} {res.text}")

    # 4. Emergency Contacts
    log("\n4. Testing /emergency-contacts")
    contacts_data = {
        "contacts": [
            {"name": "Mom", "phone": "1234567890", "id": "1"},
            {"name": "Dad", "phone": "0987654321", "id": "2"}
        ]
    }
    res = requests.post(f"{BASE_URL}/emergency-contacts", json=contacts_data)
    if res.status_code == 200:
        log("   [SUCCESS] Contacts Saved")
    else:
        log(f"   [FAIL] Contacts Failed: {res.status_code} {res.text}")

    # 5. Journey
    log("\n5. Testing /start-journey")
    res = requests.post(f"{BASE_URL}/start-journey")
    if res.status_code == 200:
        log("   [SUCCESS] Journey Started")
    else:
        log(f"   [FAIL] Start Journey Failed: {res.status_code} {res.text}")

    log("\n6. Testing /location-update")
    loc_data = {"latitude": 12.9716, "longitude": 77.5946, "speed": 10.5, "timestamp": time.time()}
    res = requests.post(f"{BASE_URL}/location-update", json=loc_data)
    if res.status_code == 200:
        log("   [SUCCESS] Location Updated")
    else:
        log(f"   [FAIL] Location Update Failed: {res.status_code} {res.text}")

    log("\n7. Testing /stop-journey")
    res = requests.post(f"{BASE_URL}/stop-journey")
    if res.status_code == 200:
        log("   [SUCCESS] Journey Stopped")
    else:
        log(f"   [FAIL] Stop Journey Failed: {res.status_code} {res.text}")
    
    # 8. Panic
    log("\n8. Testing /panic-detected")
    dummy_wav = "test_audio_gen.wav"
    create_dummy_wav(dummy_wav)
    try:
        with open(dummy_wav, 'rb') as f:
            files = {'audio': (dummy_wav, f, 'audio/wav')}
            # Note: Do not set Content-Type header manually with requests, let it handle boundary
            res = requests.post(f"{BASE_URL}/panic-detected", files=files)
        
        if res.status_code == 200:
            log("   [SUCCESS] Panic Detected")
            log(f"   Response: {res.json()}")
        else:
            log(f"   [FAIL] Panic Failed: {res.status_code} {res.text}")
    except Exception as e:
        log(f"   [FAIL] Panic Exception: {e}")
    finally:
        if os.path.exists(dummy_wav):
            os.remove(dummy_wav)

if __name__ == "__main__":
    # Check if server matches
    server_process = None
    if not wait_for_server():
        print("Server not running. Starting uvicorn...")
        # Start server
        try:
            # Assumes running from project root and 'backend' is clear
            server_process = subprocess.Popen(
                [sys.executable, "-m", "uvicorn", "backend.app.main:app", "--host", "127.0.0.1", "--port", "8000"],
                cwd=os.getcwd(),
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            print("Waiting for server to start...")
            if wait_for_server():
                print("Server started.")
            else:
                print("Failed to start server.")
                if server_process:
                    server_process.kill()
                sys.exit(1)
        except Exception as e:
            print(f"Error starting server: {e}")
            sys.exit(1)
    
    try:
        test_endpoints()
    finally:
        if server_process:
            print("Stopping test server...")
            server_process.kill()
