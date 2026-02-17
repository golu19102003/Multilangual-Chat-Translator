import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowPathIcon, MicrophoneIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { addNotification } from '../../store/slices/uiSlice';

const QuickTranslateWidget = () => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [isListening, setIsListening] = useState(false);
  
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  ];

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;

    setIsTranslating(true);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sourceText,
          from: sourceLang,
          to: targetLang
        })
      });

      if (response.ok) {
        const data = await response.json();
        setTranslatedText(data.translatedText);
        dispatch(addNotification({
          type: 'success',
          message: 'Translation completed!'
        }));
      }
    } catch (error) {
      console.error('Translation error:', error);
      dispatch(addNotification({
        type: 'error',
        message: 'Translation failed. Please try again.'
      }));
    } finally {
      setIsTranslating(false);
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      dispatch(addNotification({
        type: 'error',
        message: 'Voice recognition is not supported in your browser'
      }));
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = sourceLang === 'en' ? 'en-US' : 'es-ES';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSourceText(transcript);
    };

    recognition.start();
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Quick Translate</h3>
            <p className="text-blue-100 text-sm">Try it right now</p>
          </div>
          <GlobeAltIcon className="h-8 w-8 text-blue-200" />
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Language Selector */}
        <div className="flex items-center space-x-4">
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
          
          <button
            onClick={swapLanguages}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ArrowPathIcon className="h-5 w-5" />
          </button>
          
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Source Text */}
        <div>
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Enter text to translate..."
            className="w-full p-4 border border-gray-300 dark:border-slate-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
            rows={4}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {sourceText.length} characters
            </span>
            <button
              onClick={handleVoiceInput}
              className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                isListening 
                  ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-400 dark:hover:bg-slate-600'
              }`}
            >
              <MicrophoneIcon className="h-4 w-4" />
              {isListening ? 'Listening...' : 'Voice Input'}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleTranslate}
            disabled={!sourceText.trim() || isTranslating}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
          >
            {isTranslating ? (
              <div className="flex items-center justify-center">
                <ArrowPathIcon className="h-5 w-5 animate-spin mr-2" />
                Translating...
              </div>
            ) : (
              'Translate Now'
            )}
          </button>
        </div>

        {/* Translated Text */}
        {translatedText && (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Translation</span>
              <button
                onClick={() => navigator.clipboard.writeText(translatedText)}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Copy
              </button>
            </div>
            <p className="text-gray-900 dark:text-white">{translatedText}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickTranslateWidget;
