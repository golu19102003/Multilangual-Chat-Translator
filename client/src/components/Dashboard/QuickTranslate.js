import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ArrowPathIcon, SpeakerWaveIcon } from '@heroicons/react/24/outline';
import { addNotification } from '../../store/slices/uiSlice';

const QuickTranslate = () => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  ];

  const handleQuickTranslate = async () => {
    if (!sourceText.trim()) return;

    setIsTranslating(true);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sourceText,
          from: 'en',
          to: user?.preferredLanguage || 'es'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setTranslatedText(data.translatedText);
      }
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Translate</h3>
      <div className="space-y-4">
        <textarea
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          placeholder="Enter text to translate..."
          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
        <div className="flex items-center space-x-2">
          <button
            onClick={handleQuickTranslate}
            disabled={!sourceText.trim() || isTranslating}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isTranslating ? (
              <div className="flex items-center justify-center">
                <ArrowPathIcon className="h-4 w-4 animate-spin mr-2" />
                Translating...
              </div>
            ) : (
              'Translate'
            )}
          </button>
          {translatedText && (
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <SpeakerWaveIcon className="h-5 w-5" />
            </button>
          )}
        </div>
        {translatedText && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">{translatedText}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickTranslate;
