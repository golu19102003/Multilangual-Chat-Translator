import React, { useState, useEffect } from 'react';
import { ArrowPathIcon, SparklesIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const LiveTranslationCard = () => {
  const [isLive, setIsLive] = useState(false);
  const [currentTranslation, setCurrentTranslation] = useState(null);
  const [recentLiveTranslations, setRecentLiveTranslations] = useState([]);

  // Simulate live translations
  useEffect(() => {
    if (!isLive) return;

    const sampleTranslations = [
      { from: 'Hello', to: 'Hola', fromLang: 'English', toLang: 'Spanish', flag: '🇪🇸' },
      { from: 'Thank you', to: 'धन्यवाद', fromLang: 'English', toLang: 'Hindi', flag: '🇮🇳' },
      { from: 'Good morning', to: 'Bonjour', fromLang: 'English', toLang: 'French', flag: '🇫🇷' },
      { from: 'How are you?', to: '¿Cómo estás?', fromLang: 'English', toLang: 'Spanish', flag: '🇪🇸' },
      { from: 'Welcome', to: '欢迎', fromLang: 'English', toLang: 'Chinese', flag: '🇨🇳' },
    ];

    const interval = setInterval(() => {
      const randomTranslation = sampleTranslations[Math.floor(Math.random() * sampleTranslations.length)];
      
      setCurrentTranslation(randomTranslation);
      
      setRecentLiveTranslations(prev => [
        { ...randomTranslation, id: Date.now(), timestamp: 'Just now' },
        ...prev.slice(0, 4)
      ]);

      // Clear current translation after 3 seconds
      setTimeout(() => {
        setCurrentTranslation(null);
      }, 3000);
    }, 4000);

    return () => clearInterval(interval);
  }, [isLive]);

  const toggleLive = () => {
    setIsLive(!isLive);
    if (!isLive) {
      setCurrentTranslation(null);
      setRecentLiveTranslations([]);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-lg p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <SparklesIcon className="h-6 w-6 mr-2" />
          <h3 className="text-lg font-semibold">Live Translations</h3>
        </div>
        <button
          onClick={toggleLive}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            isLive 
              ? 'bg-white/20 hover:bg-white/30' 
              : 'bg-white/10 hover:bg-white/20'
          }`}
        >
          {isLive ? (
            <>
              <div className="h-2 w-2 bg-red-400 rounded-full animate-pulse"></div>
              <span>Live</span>
            </>
          ) : (
            <>
              <ArrowPathIcon className="h-4 w-4" />
              <span>Start Live</span>
            </>
          )}
        </button>
      </div>

      {/* Current Translation */}
      {currentTranslation && (
        <div className="mb-6 p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20 animate-pulse">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-white/80">Now Translating</span>
            <GlobeAltIcon className="h-4 w-4 text-white/60" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm">{currentTranslation.from}</span>
              <ArrowPathIcon className="h-3 w-3 text-white/60" />
              <span className="text-sm font-medium">{currentTranslation.to}</span>
              <span className="text-xs ml-2">{currentTranslation.flag}</span>
            </div>
            <div className="text-xs text-white/60">
              {currentTranslation.fromLang} → {currentTranslation.toLang}
            </div>
          </div>
        </div>
      )}

      {/* Recent Live Translations */}
      {recentLiveTranslations.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-white/80 mb-3">Recent Live</h4>
          <div className="space-y-2">
            {recentLiveTranslations.map((translation) => (
              <div
                key={translation.id}
                className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xs">{translation.from}</span>
                  <span className="text-white/60">→</span>
                  <span className="text-xs font-medium">{translation.to}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs">{translation.flag}</span>
                  <span className="text-xs text-white/60">{translation.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLive && recentLiveTranslations.length === 0 && (
        <div className="text-center py-8">
          <GlobeAltIcon className="h-12 w-12 text-white/30 mx-auto mb-4" />
          <p className="text-white/80 mb-2">Start Live Translations</p>
          <p className="text-sm text-white/60">See real-time translations from around the world</p>
        </div>
      )}
    </div>
  );
};

export default LiveTranslationCard;
