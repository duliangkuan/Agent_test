@echo off
echo Starting Agent Security Test Platform...

echo Starting Backend Server...
start cmd /k "cd backend && python run.py"

timeout /t 3

echo Starting Frontend Server...
start cmd /k "npm run dev"

echo Platform started!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
pause
