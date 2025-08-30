@echo off
echo 🚀 Building TeenSpeak Translator APK...
echo.

echo 📱 Building web assets...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo 🔄 Syncing with Android...
call npx cap sync android
if %errorlevel% neq 0 (
    echo ❌ Sync failed!
    pause
    exit /b 1
)

echo 🏗️ Building Android APK...
cd android
call .\gradlew assembleDebug
if %errorlevel% neq 0 (
    echo ❌ APK build failed!
    cd ..
    pause
    exit /b 1
)

cd ..
echo.
echo ✅ APK Build Complete!
echo 📱 Your APK is located at:
echo    android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo 🎯 To install on your phone:
echo    1. Copy the APK to your phone
echo    2. Enable "Install from unknown sources" in settings
echo    3. Tap the APK file to install
echo.
pause
