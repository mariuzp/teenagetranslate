Write-Host "🚀 Building TeenSpeak Translator APK..." -ForegroundColor Green
Write-Host ""

Write-Host "📱 Building web assets..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    Read-Host "Press Enter to continue"
    exit 1
}

Write-Host "🔄 Syncing with Android..." -ForegroundColor Yellow
npx cap sync android
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Sync failed!" -ForegroundColor Red
    Read-Host "Press Enter to continue"
    exit 1
}

Write-Host "🏗️ Building Android APK..." -ForegroundColor Yellow
Set-Location android
.\gradlew assembleDebug
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ APK build failed!" -ForegroundColor Red
    Set-Location ..
    Read-Host "Press Enter to continue"
    exit 1
}

Set-Location ..
Write-Host ""
Write-Host "✅ APK Build Complete!" -ForegroundColor Green
Write-Host "📱 Your APK is located at:" -ForegroundColor Cyan
Write-Host "   android\app\build\outputs\apk\debug\app-debug.apk" -ForegroundColor White
Write-Host ""
Write-Host "🎯 To install on your phone:" -ForegroundColor Cyan
Write-Host "   1. Copy the APK to your phone" -ForegroundColor White
Write-Host "   2. Enable 'Install from unknown sources' in settings" -ForegroundColor White
Write-Host "   3. Tap the APK file to install" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to continue"
