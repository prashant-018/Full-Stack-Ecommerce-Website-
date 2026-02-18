@echo off
echo ========================================
echo Starting E-Commerce Backend Server
echo ========================================
echo.

echo [1/4] Checking MongoDB...
net start | findstr MongoDB >nul
if %errorlevel% equ 0 (
    echo ✅ MongoDB is running
) else (
    echo ⚠️  MongoDB is not running
    echo Starting MongoDB service...
    net start MongoDB
    if %errorlevel% equ 0 (
        echo ✅ MongoDB started successfully
    ) else (
        echo ❌ Failed to start MongoDB
        echo Please start MongoDB manually or check if it's installed
        pause
        exit /b 1
    )
)
echo.

echo [2/4] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Node.js is installed
    node --version
) else (
    echo ❌ Node.js is not installed
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)
echo.

echo [3/4] Checking dependencies...
if exist node_modules (
    echo ✅ Dependencies are installed
) else (
    echo ⚠️  Dependencies not found
    echo Installing dependencies...
    call npm install
    if %errorlevel% equ 0 (
        echo ✅ Dependencies installed successfully
    ) else (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)
echo.

echo [4/4] Starting server...
echo.
echo ========================================
echo Server will start on http://localhost:5002
echo Press Ctrl+C to stop the server
echo ========================================
echo.

npm start
