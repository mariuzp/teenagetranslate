# TeenSpeak Translator 🗣️📱

A React.js web app that translates teen slang into parent-friendly English with AI integration, now available as **native Android and iOS apps** using Capacitor!

## ✨ Features

- **🗣️ Smart Translation**: Local slang dictionary + OpenAI AI fallback
- **🎤 Voice Recording**: Record teen language and convert to text
- **📱 Mobile Apps**: Native Android and iOS apps (Capacitor)
- **🎯 Context Awareness**: Tone detection and situation explanation
- **📖 Translation History**: Stores past translations locally
- **🌅 Word of the Day**: Daily trending slang term
- **🎨 Beautiful UI**: Modern design with TailwindCSS

## 🚀 Quick Start

### Web App
```bash
npm install
npm run dev
```

### Mobile Apps (Android/iOS)
```bash
# Build and sync with mobile platforms
npm run mobile:build

# Open in Android Studio
npm run mobile:android

# Open in Xcode (macOS only)
npm run mobile:ios

# Run directly on device/emulator
npm run mobile:run:android
npm run mobile:run:ios
```

## 📱 Mobile Development

### Prerequisites

#### Android
- [Android Studio](https://developer.android.com/studio) installed
- Android SDK (API level 24+)
- Java Development Kit (JDK) 11+

#### iOS (macOS only)
- [Xcode](https://developer.apple.com/xcode/) installed
- iOS 13+ deployment target
- CocoaPods installed (`sudo gem install cocoapods`)

### Building Mobile Apps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Build Web App**
   ```bash
   npm run build
   ```

3. **Sync with Mobile Platforms**
   ```bash
   npx cap sync
   ```

4. **Open in Native IDEs**
   ```bash
   # Android
   npx cap open android
   
   # iOS
   npx cap open ios
   ```

### Mobile-Specific Features

- **🎤 Native Microphone Access**: Better voice recording quality
- **📱 Mobile-Optimized UI**: Touch-friendly interface
- **🔔 Haptic Feedback**: Tactile responses for actions
- **📱 Splash Screen**: Professional app launch experience
- **📊 Status Bar**: Integrated with system status bar
- **📁 File System Access**: Local storage for offline use

## 🔧 Development

### Project Structure
```
teenagetranslate/
├── src/                    # React source code
├── android/               # Android native project
├── ios/                   # iOS native project
├── dist/                  # Built web assets
├── capacitor.config.json  # Capacitor configuration
└── package.json          # Dependencies and scripts
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run mobile:build` - Build and sync with mobile
- `npm run mobile:android` - Open in Android Studio
- `npm run mobile:ios` - Open in Xcode
- `npm run mobile:sync` - Sync web assets with mobile
- `npm run mobile:run:android` - Run on Android device/emulator
- `npm run mobile:run:ios` - Run on iOS device/simulator

## 🌐 Deployment

### Web App
- **Vercel**: `npm run build` then deploy `dist/` folder
- **Netlify**: Drag and drop `dist/` folder
- **GitHub Pages**: Use GitHub Actions to build and deploy

### Mobile Apps
- **Android**: Build APK/AAB in Android Studio, upload to Google Play
- **iOS**: Archive in Xcode, upload to App Store Connect

## 🔑 Environment Variables

Create a `.env` file in the root directory:
```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

## 📱 Mobile App Permissions

### Android
- `RECORD_AUDIO` - Voice recording
- `INTERNET` - AI translation
- `VIBRATE` - Haptic feedback
- `WRITE_EXTERNAL_STORAGE` - Local file storage

### iOS
- `NSMicrophoneUsageDescription` - Voice recording
- `NSCameraUsageDescription` - Camera access (if needed)

## 🎯 Testing

### Web Testing
```bash
npm run dev
# Open http://localhost:5173
```

### Mobile Testing
```bash
# Android
npm run mobile:run:android

# iOS
npm run mobile:run:ios
```

## 🚀 Production Build

### Web
```bash
npm run build
# Deploy dist/ folder
```

### Mobile
```bash
npm run mobile:build
# Open in native IDEs for final builds
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on both web and mobile
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

**Build fails on mobile sync**
```bash
npm run build
npx cap sync
```

**Android Studio won't open**
```bash
npx cap sync android
npx cap open android
```

**iOS build fails**
```bash
cd ios/App
pod install
cd ../..
npx cap sync ios
```

**Voice recording not working**
- Check microphone permissions in device settings
- Ensure `RECORD_AUDIO` permission is granted

### Getting Help

- Check the [Capacitor documentation](https://capacitorjs.com/docs)
- Review Android/iOS specific error messages
- Ensure all prerequisites are installed

---

**Your TeenSpeak Translator is now a full-stack mobile app!** 🎉📱

Build once, deploy everywhere - web, Android, and iOS! 🚀
