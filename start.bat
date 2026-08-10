@echo off
echo ==========================================
echo Khoi dong he thong CarRentalManager...
echo ==========================================

:: Chạy Backend C++
start cmd /k "cd backend && run.bat"

:: Chạy Frontend React
start cmd /k "cd frontend && npm run dev"

echo Da gui lenh khoi dong ca backend va frontend!
echo [Backend C++] dang chay tai: http://localhost:18080
echo [Frontend React] dang chay tai: http://localhost:5173
echo ==========================================
pause
