@echo off
REM BP_WB Deployment Script
REM Deploys the Website Builder app to BOSA apps directory

setlocal enabledelayedexpansion

REM Configuration
REM Get script directory and go up one level to project root
set "SCRIPT_DIR=%~dp0"
for %%I in ("%SCRIPT_DIR%..") do set "SOURCE_DIR=%%~fI"
set "TARGET_DIR=D:\dev\projects\BOSA\apps\bp_wb"
set "BOSA_DIR=D:\dev\projects\BOSA"

echo ========================================
echo BP_WB Deployment Script
echo ========================================
echo.

REM Check if source directory exists
if not exist "%SOURCE_DIR%" (
    echo [ERROR] Source directory not found: %SOURCE_DIR%
    echo Please update SOURCE_DIR in this script.
    pause
    exit /b 1
)

REM Check if BOSA directory exists
if not exist "%BOSA_DIR%" (
    echo [ERROR] BOSA directory not found: %BOSA_DIR%
    echo Please update BOSA_DIR in this script.
    pause
    exit /b 1
)

REM Create apps directory if it doesn't exist
if not exist "%BOSA_DIR%\apps" (
    echo [INFO] Creating apps directory...
    mkdir "%BOSA_DIR%\apps"
)

REM Create target directory if it doesn't exist
if not exist "%TARGET_DIR%" (
    echo [INFO] Creating target directory: %TARGET_DIR%
    mkdir "%TARGET_DIR%"
)

echo [INFO] Source: %SOURCE_DIR%
echo [INFO] Target: %TARGET_DIR%
echo.

REM Build the frontend first
echo [INFO] Building frontend...
cd /d "%SOURCE_DIR%"
call npm run build:frontend
if errorlevel 1 (
    echo [ERROR] Frontend build failed!
    pause
    exit /b 1
)
echo [OK] Frontend build completed
echo.

REM Copy files (excluding development files)
echo [INFO] Copying files...
echo.

REM Copy manifest
if exist "%SOURCE_DIR%\manifest.yaml" (
    copy /Y "%SOURCE_DIR%\manifest.yaml" "%TARGET_DIR%\manifest.yaml" >nul
    echo [OK] Copied manifest.yaml
)

REM Copy server.js
if exist "%SOURCE_DIR%\server.js" (
    copy /Y "%SOURCE_DIR%\server.js" "%TARGET_DIR%\server.js" >nul
    echo [OK] Copied server.js
)

REM Copy package.json
if exist "%SOURCE_DIR%\package.json" (
    copy /Y "%SOURCE_DIR%\package.json" "%TARGET_DIR%\package.json" >nul
    echo [OK] Copied package.json
)

REM Copy backend directory
if exist "%SOURCE_DIR%\backend" (
    xcopy /E /I /Y "%SOURCE_DIR%\backend" "%TARGET_DIR%\backend" >nul
    echo [OK] Copied backend directory
)

REM Copy migrations directory
if exist "%SOURCE_DIR%\migrations" (
    xcopy /E /I /Y "%SOURCE_DIR%\migrations" "%TARGET_DIR%\migrations" >nul
    echo [OK] Copied migrations directory
)

REM Copy dist directory (built frontend)
if exist "%SOURCE_DIR%\dist" (
    xcopy /E /I /Y "%SOURCE_DIR%\dist" "%TARGET_DIR%\dist" >nul
    echo [OK] Copied dist directory (frontend build)
)

REM Copy docs directory (optional, for documentation)
if exist "%SOURCE_DIR%\docs" (
    xcopy /E /I /Y "%SOURCE_DIR%\docs" "%TARGET_DIR%\docs" >nul
    echo [OK] Copied docs directory
)

REM Copy version.txt
if exist "%SOURCE_DIR%\version.txt" (
    copy /Y "%SOURCE_DIR%\version.txt" "%TARGET_DIR%\version.txt" >nul
    echo [OK] Copied version.txt
)

REM Create sidebar config file for Super Admin link
echo [INFO] Creating sidebar configuration...
(
echo {
echo   "sidebar": {
echo     "links": [
echo       {
echo         "label": "Theme Builder",
echo         "url": "/bp_wb/",
echo         "icon": "pencil-square",
echo         "role": "super_admin",
echo         "position": "after",
echo         "after": "themes"
echo       }
echo     ]
echo   }
echo }
) > "%TARGET_DIR%\sidebar.json"
echo [OK] Created sidebar.json configuration
echo.

REM Install dependencies in target directory
echo [INFO] Installing dependencies in target directory...
cd /d "%TARGET_DIR%"
call npm install --production
if errorlevel 1 (
    echo [WARNING] npm install failed, but continuing...
) else (
    echo [OK] Dependencies installed
)
echo.

echo ========================================
echo Deployment completed successfully!
echo ========================================
echo.
echo The app has been deployed to: %TARGET_DIR%
echo.
echo Next steps:
echo 1. Restart BOSA server to load the app
echo 2. Access the app at: http://localhost:3000/bp_wb/
echo 3. The sidebar link will appear for Super Admin users
echo.
pause

