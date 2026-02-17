class SpeechService {
  constructor() {
    this.synthesis = window.speechSynthesis;
    this.recognition = null;
    this.isRecording = false;
    this.isSpeaking = false;
    
    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.setupRecognition();
    }
  }

  setupRecognition() {
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onstart = () => {
      this.isRecording = true;
    };

    this.recognition.onend = () => {
      this.isRecording = false;
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      this.isRecording = false;
    };
  }

  // Speech to Text
  startSpeechToText(language = 'en-US', onResult, onError) {
    if (!this.recognition) {
      onError(new Error('Speech recognition not supported'));
      return;
    }

    if (this.isRecording) {
      this.stopSpeechToText();
    }

    this.recognition.lang = language;
    this.recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      onResult({
        final: finalTranscript,
        interim: interimTranscript,
        isFinal: event.results[event.results.length - 1].isFinal
      });
    };

    this.recognition.onerror = (event) => {
      onError(new Error(event.error));
    };

    this.recognition.start();
  }

  stopSpeechToText() {
    if (this.recognition && this.isRecording) {
      this.recognition.stop();
    }
  }

  // Text to Speech
  speak(text, language = 'en-US', options = {}) {
    if (!this.synthesis) {
      return Promise.reject(new Error('Speech synthesis not supported'));
    }

    // Cancel any ongoing speech
    this.stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = options.rate || 1;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;

    return new Promise((resolve, reject) => {
      utterance.onend = () => {
        this.isSpeaking = false;
        resolve();
      };

      utterance.onerror = (event) => {
        this.isSpeaking = false;
        reject(new Error(event.error));
      };

      utterance.onstart = () => {
        this.isSpeaking = true;
      };

      this.synthesis.speak(utterance);
    });
  }

  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.isSpeaking = false;
    }
  }

  // Get available voices
  getVoices() {
    if (!this.synthesis) return [];
    return this.synthesis.getVoices();
  }

  // Get voice for specific language
  getVoiceForLanguage(language) {
    const voices = this.getVoices();
    return voices.find(voice => voice.lang.startsWith(language)) || voices[0];
  }

  // Check if speech recognition is available
  isSpeechRecognitionAvailable() {
    return !!(this.recognition);
  }

  // Check if speech synthesis is available
  isSpeechSynthesisAvailable() {
    return !!(this.synthesis);
  }

  // Get supported languages for speech recognition
  getSupportedRecognitionLanguages() {
    return [
      { code: 'en-US', name: 'English (US)' },
      { code: 'en-GB', name: 'English (UK)' },
      { code: 'es-ES', name: 'Spanish' },
      { code: 'fr-FR', name: 'French' },
      { code: 'de-DE', name: 'German' },
      { code: 'it-IT', name: 'Italian' },
      { code: 'pt-BR', name: 'Portuguese (Brazil)' },
      { code: 'ru-RU', name: 'Russian' },
      { code: 'zh-CN', name: 'Chinese (Mandarin)' },
      { code: 'ja-JP', name: 'Japanese' },
      { code: 'ko-KR', name: 'Korean' },
      { code: 'ar-SA', name: 'Arabic' },
      { code: 'hi-IN', name: 'Hindi' },
      { code: 'bn-IN', name: 'Bengali' },
      { code: 'ta-IN', name: 'Tamil' },
      { code: 'te-IN', name: 'Telugu' },
      { code: 'mr-IN', name: 'Marathi' },
      { code: 'gu-IN', name: 'Gujarati' },
      { code: 'kn-IN', name: 'Kannada' },
      { code: 'ml-IN', name: 'Malayalam' },
      { code: 'pa-IN', name: 'Punjabi' },
      { code: 'ur-PK', name: 'Urdu' }
    ];
  }

  // Get supported languages for speech synthesis
  getSupportedSynthesisLanguages() {
    const voices = this.getVoices();
    const languages = new Set();
    
    voices.forEach(voice => {
      languages.add(voice.lang);
    });

    return Array.from(languages).map(lang => ({
      code: lang,
      name: new Intl.DisplayNames([], { type: 'language' }).of(lang) || lang
    }));
  }
}

export default new SpeechService();
