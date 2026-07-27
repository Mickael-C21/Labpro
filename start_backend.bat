@echo off
cd /d "c:\Users\User\Desktop\projet fin d'année"
call venv\Scripts\activate.bat
cd Call_center_API
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
if errorlevel 1 (
    echo Error starting backend!
    pause
)
