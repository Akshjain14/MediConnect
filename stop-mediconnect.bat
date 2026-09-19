@echo off
setlocal enabledelayedexpansion
title Stop MediConnect Services

echo ============================================================
echo           Stopping MediConnect Platform Services
echo ============================================================
echo.

:: Stop backend process on port 8080
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8080" ^| findstr "LISTENING"') do (
    echo Stopping Backend process (PID %%a)...
    taskkill /F /PID %%a >nul 2>&1
)

:: Stop frontend process on port 5173
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"') do (
    echo Stopping Frontend process (PID %%a)...
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo All MediConnect services have been stopped.
echo ============================================================
echo.
pause
