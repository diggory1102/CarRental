@echo off
echo Compiling CarRentalManager C++ Backend...
g++ -std=c++17 -Iinclude src/main.cpp -o server.exe -lws2_32

if %ERRORLEVEL% NEQ 0 (
    echo Compilation FAILED!
    pause
    exit /b %ERRORLEVEL%
)

echo Compilation SUCCESSFUL. Running C++ backend server...
chcp 65001 > nul
server.exe
