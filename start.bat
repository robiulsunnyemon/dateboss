@echo off
TITLE The Date Inc - Full Stack Suite (Backend + Frontend + Dashboard)
COLOR 0A

echo ========================================================
echo    The Date Inc - All Services One-Click Starter
echo ========================================================
echo.
echo Starting Backend (5000), Frontend (3000), and Dashboard (3001)...
echo Your default web browser will open automatically!
echo.

cd /d "%~dp0"
node start-all.js

pause
