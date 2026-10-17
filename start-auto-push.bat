@echo off
REM ============================================================
REM CF-Company Auto Git Push Script
REM Run this to start watching for changes and auto-push
REM ============================================================
echo.
echo Starting Auto Git Push Watcher...
echo All changes will be automatically committed and pushed to GitHub
echo Press Ctrl+C to stop
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0auto-push.ps1"
pause
