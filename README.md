# 🚀 TeenSpeak Translator

A modern React web app that translates teen slang into parent-friendly English with AI-powered context analysis.

## ✨ Features

- **🎤 Voice Recording**: Record teen language and convert to text
- **📚 Smart Dictionary**: 60+ slang terms with instant translations
- **🤖 AI Fallback**: OpenAI GPT-4o-mini for unknown slang
- **🎯 Context Awareness**: Tone detection (positive, negative, warning, casual)
- **📖 Translation History**: Local storage for past translations
- **📅 Word of the Day**: Daily random slang term showcase
- **📱 Responsive Design**: Works on desktop and mobile
- **🎨 Modern UI**: Clean, intuitive interface with TailwindCSS

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: TailwindCSS + PostCSS
- **AI Integration**: OpenAI API (GPT-4o-mini)
- **Voice**: Web Speech API + MediaRecorder
- **Storage**: LocalStorage for history
- **Build Tool**: Vite

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/teenagetranslate.git
   cd teenagetranslate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

## 📱 Usage

### Basic Translation
1. Type teen slang in the text area
2. Click "🚀 Translate" button
3. View parent-friendly translation and context

### Voice Recording
1. Click the 🎤 button to start recording
2. Speak your teen language
3. Click ⏹️ to stop recording
4. The app will convert speech to text automatically

### Features
- **Dictionary First**: App checks local slang database first
- **AI Enhancement**: Falls back to OpenAI for unknown terms
- **Smart Context**: Detects tone and provides situation explanation
- **History Tracking**: Saves all translations locally

## 🌐 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your GitHub repo to [Vercel](https://vercel.com)
3. Add environment variable `VITE_OPENAI_API_KEY` in Vercel dashboard
4. Deploy automatically on every push

### Other Platforms
- **Netlify**: Similar to Vercel, supports environment variables
- **GitHub Pages**: Static hosting (limited environment variable support)
- **AWS/GCP**: Full cloud deployment options

## 🔧 Configuration

### Environment Variables
- `VITE_OPENAI_API_KEY`: Your OpenAI API key (required for AI translations)

### Customization
- **Slang Dictionary**: Edit `src/slang.json` to add/modify slang terms
- **Styling**: Modify `src/index.css` for custom TailwindCSS components
- **AI Prompts**: Update the system prompt in `src/App.jsx`

## 📊 Slang Dictionary

The app includes 60+ common teen slang terms:
- **Basic**: bro, bruh, fr, ngl, lowkey, highkey
- **Positive**: lit, slay, fire, vibes, rizz, pulled
- **Negative**: sus, cap, salty, cringe, mid
- **Actions**: bounce, dipped, ghosted, flex, stan
- **Expressions**: periodt, no cap, fr fr, say less

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for GPT-4o-mini API
- React and Vite teams for amazing tools
- TailwindCSS for beautiful styling
- Web Speech API for voice features

## 📞 Support

If you have any questions or need help:
- Open an issue on GitHub
- Check the [Wiki](https://github.com/yourusername/teenagetranslate/wiki)
- Contact: your-email@example.com

---

**Made with ❤️ for parents trying to understand teen language!**
