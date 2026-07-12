@echo off
chcp 65001 >nul
cd /d %~dp0
echo Installing project dependencies...
call npm install
call npm run install:all
if errorlevel 1 (
  echo Installation failed. Make sure Node.js 20 or newer is installed.
  pause
  exit /b 1
)
echo Starting First House website...
call npm run dev
pause
