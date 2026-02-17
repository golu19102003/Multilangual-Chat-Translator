import React, { useState } from 'react';
import { ClockIcon, ArrowRightIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const RecentTranslations = () => {
  const [translations] = useState([
    {
      id: 1,
      sourceText: 'Hello, how are you?',
      translatedText: 'Hola, ¿cómo estás?',
      sourceLang: 'English',
      targetLang: 'Spanish',
      timestamp: '2 minutes ago',
      flag: '🇪🇸'
    },
    {
      id: 2,
      sourceText: 'Thank you very much',
      translatedText: 'धन्यवाद बहुत',
      sourceLang: 'English',
      targetLang: 'Hindi',
      timestamp: '5 minutes ago',
      flag: '🇮🇳'
    },
    {
      id: 3,
      sourceText: 'Good morning',
      translatedText: 'Bonjour',
      sourceLang: 'English',
      targetLang: 'French',
      timestamp: '10 minutes ago',
      flag: '🇫🇷'
    },
    {
      id: 4,
      sourceText: 'See you later',
      translatedText: 'À plus tard',
      sourceLang: 'English',
      targetLang: 'French',
      timestamp: '15 minutes ago',
      flag: '🇫🇷'
    }
  ]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <ClockIcon className="h-5 w-5 mr-2 text-gray-500" />
          Recent Translations
        </h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {translations.map((translation) => (
          <div
            key={translation.id}
            className="group p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">English</span>
                <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900 flex items-center">
                  {translation.flag} {translation.targetLang}
                </span>
              </div>
              <span className="text-xs text-gray-500">{translation.timestamp}</span>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-700">{translation.sourceText}</p>
              <div className="flex items-center space-x-2">
                <div className="h-px bg-gray-300 flex-1"></div>
                <GlobeAltIcon className="h-3 w-3 text-gray-400" />
                <div className="h-px bg-gray-300 flex-1"></div>
              </div>
              <p className="text-sm font-medium text-blue-600">{translation.translatedText}</p>
            </div>
            
            <div className="mt-3 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                Use Again
              </button>
              <span className="text-gray-300">•</span>
              <button className="text-xs text-gray-600 hover:text-gray-700">
                Copy
              </button>
              <span className="text-gray-300">•</span>
              <button className="text-xs text-gray-600 hover:text-gray-700">
                Save
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {translations.length === 0 && (
        <div className="text-center py-8">
          <GlobeAltIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No recent translations</p>
          <p className="text-sm text-gray-400 mt-1">Start translating to see your history here</p>
        </div>
      )}
    </div>
  );
};

export default RecentTranslations;
