@echo off
setlocal enabledelayedexpansion
title MediConnect Healthcare Launcher

echo ============================================================
echo           Starting MediConnect Healthcare Platform
echo ============================================================
echo.

:: 1. Ensure Java 17 is available for Spring Boot 3
if exist "C:\Program Files\Eclipse Adoptium\jdk-17.0.20.101-hotspot" (
    set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.20.101-hotspot"
    set "PATH=C:\Program Files\Eclipse Adoptium\jdk-17.0.20.101-hotspot\bin;!PATH!"
)

:: 2. Check and start PostgreSQL if needed
echo [1/3] Checking PostgreSQL Database on port 5432...
netstat -ano | findstr ":5432" | findstr "LISTENING" >nul 2>&1
if not !errorlevel! equ 0 (
    echo       PostgreSQL is not active on port 5432. Starting service...
    net start postgresql-x64-18 >nul 2>&1
    ping -n 2 127.0.0.1 >nul
)
netstat -ano | findstr ":5432" | findstr "LISTENING" >nul 2>&1
if !errorlevel! equ 0 (
    echo       [OK] PostgreSQL is active and listening on port 5432.
) else (
    echo       [WARNING] PostgreSQL service could not be started automatically.
    echo                 Please ensure PostgreSQL is running before accessing the platform.
)
echo.

:: 3. Check and start Backend (Spring Boot on 8080)
echo [2/3] Checking Spring Boot Backend on port 8080...
netstat -ano | findstr ":8080" | findstr "LISTENING" >nul 2>&1
if !errorlevel! equ 0 (
    echo       [OK] Spring Boot is already running on http://localhost:8080 - reusing active server.
) else (
    echo       Starting Spring Boot Backend on http://localhost:8080...
    start "MediConnect Backend (Spring Boot)" /D "%~dp0backend" cmd /k "mvnw.cmd spring-boot:run"
)
echo.

:: 4. Check and start Frontend (React Vite on 5173)
echo [3/3] Checking React Vite Frontend on port 5173...
netstat -ano | findstr ":5173" | findstr "LISTENING" >nul 2>&1
if !errorlevel! equ 0 (
    echo       [OK] React Vite is already running on http://localhost:5173 - reusing active server.
) else (
    echo       Starting React Vite Frontend on http://localhost:5173...
    start "MediConnect Frontend (React)" /D "%~dp0frontend" cmd /k "npm run dev"
)
echo.

:: 5. Wait for servers to become ready before opening browser
echo Waiting for servers to initialize...
set /a attempts=0

:WAIT_LOOP
set /a attempts+=1
netstat -ano | findstr ":5173" | findstr "LISTENING" >nul 2>&1
set FE_UP=!errorlevel!
netstat -ano | findstr ":8080" | findstr "LISTENING" >nul 2>&1
set BE_UP=!errorlevel!

if !FE_UP! equ 0 (
    if !BE_UP! equ 0 (
        goto READY
    )
)

if !attempts! geq 35 (
    echo.
    echo [NOTE] Servers took longer than expected to report ready. Opening browser now...
    goto OPEN_BROWSER
)

<nul set /p =.
ping -n 2 127.0.0.1 >nul
goto WAIT_LOOP

:READY
echo.
echo [OK] Both Backend and Frontend are online and responsive!

:OPEN_BROWSER
echo.
echo ============================================================
echo   MediConnect Healthcare Platform is LIVE!
echo ============================================================
echo   Frontend : http://localhost:5173/
echo   Backend  : http://localhost:8080/api
echo.
echo   Demo Login Accounts:
echo     Admin   : admin@mediconnect.com   / admin123
echo     Doctor  : dr.sarah@mediconnect.com / doctor123
echo     Patient : john.doe@mediconnect.com / patient123
echo ============================================================
echo.
echo Opening browser at http://localhost:5173/ ...
start http://localhost:5173/
echo.
echo Note: Keep the Backend and Frontend console windows open.
echo To shut down MediConnect, double-click stop-mediconnect.bat.
echo.
pause
