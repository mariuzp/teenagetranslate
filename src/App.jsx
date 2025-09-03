import { useState, useEffect, useRef } from 'react'
import './index.css'



function App() {
  const [inputText, setInputText] = useState('')
  const [translation, setTranslation] = useState('')
  const [context, setContext] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [wordOfTheDay, setWordOfTheDay] = useState(null)
  const [translationSource, setTranslationSource] = useState('')
  const [translationExample, setTranslationExample] = useState('')
  
  // Voice recording states
  const [isRecording, setIsRecording] = useState(false)
  const [audioURL, setAudioURL] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  
  // Refs for recording
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const recordingIntervalRef = useRef(null)

  // Load history from localStorage on component mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('teenSpeakHistory')
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory))
      }
    } catch (error) {
      console.warn('Could not load history:', error)
    }
    
    // Set word of the day (simple example for now)
    setWordOfTheDay({
      term: 'rizz',
      translation: 'Charisma or charm, especially with romantic appeal',
      context: 'positive',
      example: 'He has mad rizz!'
    })
  }, [])

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('teenSpeakHistory', JSON.stringify(history))
    } catch (error) {
      console.warn('Could not save history:', error)
    }
  }, [history])

  // Cleanup recording interval on unmount
  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
    }
  }, [])



  const translateWithAI = async (text) => {
    try {
      // Debug shortened; core auth remains
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY
      console.log('AI Translation Debug - API Key exists:', !!apiKey)
      console.log('AI Translation Debug - API Key length:', apiKey ? apiKey.length : 0)
      
      if (!apiKey) {
        console.error('AI Translation Debug - No API key found in environment variables')
        throw new Error('No API key found in environment variables')
      }
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful translator that converts teen slang into clear, parent-friendly English. Format your response exactly like this:\n\nTeen phrase: [original phrase]\nParent translation: [clear parent-friendly translation]\nContext: [brief explanation of the situation/tone]\nExample in use:\nTeen: "[example with teen phrase]"\nParent: "[example with parent translation]"\n\nKeep translations natural, positive, and easy for parents to understand.'
            },
            {
              role: 'user',
              content: `Translate this teen language: "${text}"`
            }
          ],
          max_tokens: 200,
          temperature: 0.7
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('AI Translation Debug - API Response error:', response.status, errorText)
        console.error('AI Translation Debug - Response headers:', response.headers)
        throw new Error(`AI translation failed: ${response.status}`)
      }

      const data = await response.json()
      const aiResponse = data.choices[0].message.content
      
      // Parse AI response to extract structured information
      const lines = aiResponse.split('\n').filter(line => line.trim())
      let translation = ''
      let context = ''
      let example = ''
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        if (line.startsWith('Parent translation:')) {
          translation = line.replace('Parent translation:', '').trim()
        } else if (line.startsWith('Context:')) {
          context = line.replace('Context:', '').trim()
        } else if (line.startsWith('Parent:') && example === '') {
          example = line.replace('Parent:', '').trim().replace(/"/g, '')
        }
      }
      
      // Fallback parsing if structured format isn't followed
      if (!translation) {
        translation = lines.find(line => line.includes('translation:') || line.includes('means:')) || lines[0] || aiResponse
        translation = translation.replace(/.*translation:\s*/i, '').replace(/.*means:\s*/i, '').trim()
      }
      
      if (!context) {
        context = lines.find(line => line.includes('Context:') || line.includes('Used to')) || 'AI translation provided'
        context = context.replace(/.*Context:\s*/i, '').replace(/.*Used to\s*/i, 'Used to ').trim()
      }
      
      return { translation, context, example }
    } catch (error) {
      console.error('AI translation error:', error)
      throw new Error(`AI translation unavailable: ${error.message}`)
    }
  }

  const handleTranslate = async () => {
    if (!inputText.trim()) return
    
    setIsLoading(true)
    
    // Clear previous translation details
    setTranslationSource('')
    setTranslationExample('')
    
    try {
      // Use AI translation only
      console.log('Translation Debug - Attempting AI translation for:', inputText)
      const aiResult = await translateWithAI(inputText)
      console.log('Translation Debug - AI translation successful:', aiResult)
      
      setTranslation(aiResult.translation)
      setContext(aiResult.context)
      setTranslationSource('OpenAI AI')
      setTranslationExample(aiResult.example || '')
      
      // Add to history
      const newHistoryItem = {
        id: Date.now(),
        original: inputText,
        translation: aiResult.translation,
        context: aiResult.context,
        timestamp: new Date().toLocaleString()
      }
      
      setHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]) // Keep last 10 items
      
    } catch (aiError) {
      // Better error handling with specific messages
      console.error('AI translation failed:', aiError.message)
      console.log('Translation Debug - AI Error details:', aiError)
      
      let errorMessage = 'AI translation unavailable'
      let contextMessage = 'Please check your API key and try again'
      
      if (aiError.message.includes('429')) {
        errorMessage = 'AI quota exceeded - please check your OpenAI account billing'
        contextMessage = 'OpenAI account needs credits to process requests'
      } else if (aiError.message.includes('401')) {
        errorMessage = 'AI authentication failed - please check your API key'
        contextMessage = 'Invalid or expired OpenAI API key'
      } else if (aiError.message.includes('insufficient_quota')) {
        errorMessage = 'AI quota exceeded - please add credits to your OpenAI account'
        contextMessage = 'OpenAI account has no remaining credits'
      } else if (aiError.message.includes('No API key')) {
        errorMessage = 'No OpenAI API key found'
        contextMessage = 'Please check your .env file configuration'
      }
      
      setTranslation(`❌ ${errorMessage}`)
      setContext(contextMessage)
      setTranslationSource('Error')
      setTranslationExample('')
    } finally {
      setIsLoading(false)
    }
  }

  // Voice recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        const audioUrl = URL.createObjectURL(audioBlob)
        setAudioURL(audioUrl)
        
        // Convert speech to text
        convertSpeechToText(audioBlob)
      }
      
      mediaRecorderRef.current.start()
      setIsRecording(true)
      setRecordingTime(0)
      
      // Start recording timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
      
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Could not access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      
      // Stop recording timer
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
      
      // Stop all tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    }
  }

  const convertSpeechToText = async (audioBlob) => {
    try {
      // Use Web Speech API for speech recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        const recognition = new SpeechRecognition()
        
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = 'en-US'
        
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript
          setInputText(transcript)
        }
        
        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error)
          alert('Speech recognition failed. Please type your message instead.')
        }
        
        // Convert audio blob to audio element for recognition
        const audio = new Audio(URL.createObjectURL(audioBlob))
        audio.play()
        recognition.start()
      } else {
        alert('Speech recognition not supported in this browser. Please type your message.')
      }
    } catch (error) {
      console.error('Error converting speech to text:', error)
      alert('Could not convert speech to text. Please type your message.')
    }
  }

  const playRecording = () => {
    if (audioURL) {
      const audio = new Audio(audioURL)
      audio.play()
      setIsPlaying(true)
      audio.onended = () => setIsPlaying(false)
    }
  }

  const clearRecording = () => {
    setAudioURL('')
    setRecordingTime(0)
    if (audioURL) {
      URL.revokeObjectURL(audioURL)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const clearHistory = () => {
    setHistory([])
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Translate Teen Language
        </h1>
        
        {/* Voice Recording Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
            Voice Recording
          </h2>
          <div className="flex items-center space-x-3">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full transition-colors duration-200"
                title="Start Recording"
              >
                🎤
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-full transition-colors duration-200"
                title="Stop Recording"
              >
                ⏹️
              </button>
            )}
            
            {audioURL && (
              <>
                <button
                  onClick={playRecording}
                  disabled={isPlaying}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full transition-colors duration-200 disabled:opacity-50"
                  title="Play Recording"
                >
                  {isPlaying ? '⏸️' : '▶️'}
                </button>
                <button
                  onClick={clearRecording}
                  className="bg-gray-400 hover:bg-gray-500 text-white p-2 rounded-full transition-colors duration-200"
                  title="Clear Recording"
                >
                  🗑️
                </button>
              </>
            )}
            
            <span className="text-sm text-gray-600">
              {isRecording ? 'Recording...' : audioURL ? 'Recording saved' : 'Click to record'}
            </span>
          </div>
        </div>

        {/* Text Input Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Or type teen language here:
          </label>
          <textarea
            className="input-field resize-none"
            rows="4"
            placeholder="e.g., 'That party was lit, we bounced tho'"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>
        
        <button
          onClick={handleTranslate}
          disabled={isLoading || !inputText.trim()}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Translating...' : '🚀 Translate'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Main Translation Result */}
        <div className="lg:col-span-2">
          {/* Translation Result */}
          {translation && (
            <div className="card">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Translation Result
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent-friendly version:
                  </label>
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <p className="text-gray-800">{translation}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(translation)}
                    className="btn-secondary mt-2 text-sm"
                  >
                    📋 Copy
                  </button>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Context & Tone:
                  </label>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-blue-800">{context}</p>
                  </div>
                </div>
                
                {/* Translation Source */}
                {translationSource && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Source:
                    </label>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <p className="text-green-800 text-sm">
                        📚 {translationSource}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Translation Example */}
                {translationExample && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Example Usage:
                    </label>
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                      <p className="text-purple-800 text-sm italic">
                        "{translationExample}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Word of the Day */}
          {wordOfTheDay && (
            <div className="card">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                📚 Word of the Day
              </h3>
              <div className="space-y-2">
                <p className="font-medium text-blue-600">
                  {wordOfTheDay.term}
                </p>
                <p className="text-sm text-gray-700">
                  {wordOfTheDay.translation}
                </p>
                <p className="text-xs text-gray-500">
                  {wordOfTheDay.context}
                </p>
              </div>
            </div>
          )}

          {/* History */}
          <div className="card">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-800">
                📖 Translation History
              </h3>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Clear
                </button>
              )}
            </div>
            
            {history.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No translations yet. Start translating to see your history!
              </p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {history.map((item) => (
                  <div key={item.id} className="border-l-4 border-blue-200 pl-3 py-2">
                    <p className="text-xs text-gray-500 mb-1">
                      {item.timestamp}
                    </p>
                    <p className="text-sm font-medium text-gray-800 mb-1">
                      {item.original}
                    </p>
                    <p className="text-sm text-gray-700 mb-1">
                      → {item.translation}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.context}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-12 text-gray-500 text-sm">
        <p>
          💡 Tip: Use voice recording for quick capture, or type manually. The app uses AI-powered translations for high-quality, parent-friendly explanations.
        </p>
        <p className="mt-1">
          🚀 Powered by OpenAI for accurate teen slang translation with context and examples.
        </p>
      </div>
    </div>
  )
}

export default App
