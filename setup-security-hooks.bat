@echo off
REM TrimTax Security Hooks Setup for Windows
REM Run this script to install security pre-commit hooks
REM Usage: setup-security-hooks.bat

echo.
echo 🔐 TrimTax Security Hooks Setup (Windows)
echo ==========================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed. Please install Git first.
    pause
    exit /b 1
)

REM Check if we're in a git repository
if not exist ".git" (
    echo ❌ Not in a git repository. Run this from the project root.
    pause
    exit /b 1
)

set HOOKS_DIR=.git\hooks

echo Installing pre-commit hook...

REM Create hooks directory if it doesn't exist
if not exist "%HOOKS_DIR%" mkdir "%HOOKS_DIR%"

REM Copy pre-commit hook (bash script)
if exist "pre-commit" (
    copy "pre-commit" "%HOOKS_DIR%\pre-commit" >nul
    echo ✓ Pre-commit hook installed at %HOOKS_DIR%\pre-commit
) else (
    echo ⚠ pre-commit file not found in current directory
    echo   Make sure you're running this from the project root
    pause
    exit /b 1
)

REM Configure git to use hooks
git config core.hooksPath ".git/hooks"
echo ✓ Git configured to use hooks

echo.
echo ✅ Security hooks installed successfully!
echo.
echo What's now protected:
echo   • .env files cannot be committed
echo   • API keys and secrets cannot be committed
echo   • Database passwords cannot be committed
echo   • AWS credentials cannot be committed
echo   • Firebase configs cannot be committed
echo.
echo To test the hook:
echo   1. Try: git add .env.local
echo   2. Try: git commit -m "test"
echo   3. The commit should be blocked
echo   4. Clean up: git reset HEAD .env.local
echo.
echo To bypass (only in emergencies):
echo   git commit --no-verify
echo.
pause
