@echo off
title Classic Fashions - Push to GitHub
echo ======================================================
echo  CLASSIC FASHIONS - Pushing to GitHub (origin/main)
echo ======================================================
echo.
echo Current git status:
git status --short
echo.
echo ------------------------------------------------------
echo Pushing commits to GitHub...
echo (If a GitHub login window pops up, please sign in)
echo ------------------------------------------------------
echo.
git push origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ======================================================
    echo  SUCCESS: All files pushed to GitHub successfully!
    echo ======================================================
) else (
    echo ======================================================
    echo  Push failed or cancelled. Please check your login.
    echo ======================================================
)
echo.
pause
