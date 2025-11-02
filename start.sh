#!/bin/bash

echo "Starting Agent Security Test Platform..."

# Start backend
echo "Starting Backend Server..."
cd backend
python run.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend
echo "Starting Frontend Server..."
npm run dev &
FRONTEND_PID=$!

echo "Platform started!"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo "Press Ctrl+C to stop"

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
