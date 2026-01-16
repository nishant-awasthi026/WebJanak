@echo off
echo Starting WebJanak System...

echo Is starting Model Server...
start "WebJanak Model Server" cmd /k "call start_model.bat"

echo Is starting Backend Server...
start "WebJanak Backend" cmd /k "npm start"

echo Is starting Frontend Client...
start "WebJanak Frontend" cmd /k "cd client && npm run dev"

echo ===================================================
echo All services are starting in separate windows.
echo Please wait a moment for them to initialize.
echo ===================================================
timeout /t 5
