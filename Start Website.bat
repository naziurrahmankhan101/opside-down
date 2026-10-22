@echo off
title Opside Down website
cd /d "%~dp0"

where npm >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Download it from https://nodejs.org ^(LTS^), install it, then run this again.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Installing packages ^(first run only^)...
  call npm install
)

echo Building the site...
call npm run build
if errorlevel 1 (
  echo Build failed. See the messages above.
  pause
  exit /b 1
)

echo.
echo Opening http://localhost:4173 ...  Keep this window open while you browse. Close it to stop the site.
start "" http://localhost:4173
call npx vite preview --port 4173
