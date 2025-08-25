@echo off
echo Starting SAWA Platform deployment to Vercel...
echo.

REM Activate virtual environment
call .\venv\Scripts\activate.bat

REM Check if logged in to Vercel
echo Checking Vercel authentication...
vercel whoami
if %ERRORLEVEL% NEQ 0 (
    echo Please log in to Vercel first:
    echo   vercel login
    echo Then run this script again.
    pause
    exit /b 1
)

REM Build frontend first
echo Building React frontend...
cd frontend
call npm install
call npm run build
cd ..

REM Deploy to Vercel
echo Deploying to Vercel...
vercel --prod

echo.
echo Deployment completed!
echo Check your Vercel dashboard for the deployment URL.
pause
