#!/bin/bash

echo "Starting Agent Security Test Platform..."

# 启动后端
echo "Starting Backend Server..."
cd backend
python run.py &
BACKEND_PID=$!
cd ..

# 等待后端启动
sleep 3

# 启动前端
echo "Starting Frontend Server..."
npm run dev &
FRONTEND_PID=$!

echo "Platform started!"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo "Press Ctrl+C to stop"

# 等待用户中断
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
