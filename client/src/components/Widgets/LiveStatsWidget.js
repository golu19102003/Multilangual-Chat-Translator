import React, { useState, useEffect } from 'react';
import { ArrowTrendingUpIcon, GlobeAltIcon, UsersIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

const LiveStatsWidget = () => {
  const [stats, setStats] = useState({
    translationsToday: 0,
    activeNow: 0,
    languagesActive: 0,
    messagesThisMinute: 0
  });

  const [liveTranslations, setLiveTranslations] = useState([]);

  useEffect(() => {
    // Simulate live stats updates
    const statsInterval = setInterval(() => {
      setStats(prev => ({
        translationsToday: prev.translationsToday + Math.floor(Math.random() * 5),
        activeNow: Math.max(10, prev.activeNow + (Math.random() > 0.6 ? 1 : -1)),
        languagesActive: Math.min(25, prev.languagesActive + (Math.random() > 0.8 ? 1 : 0)),
        messagesThisMinute: Math.floor(Math.random() * 20)
      }));
    }, 2000);

    // Simulate live translations
    const sampleTranslations = [
      { from: 'Hello', to: 'Hola', flag: '🇪🇸', timestamp: 'Just now' },
      { from: 'Thank you', to: 'Merci', flag: '🇫🇷', timestamp: '2s ago' },
      { from: 'Good morning', to: 'おはよう', flag: '🇯🇵', timestamp: '5s ago' },
      { from: 'How are you?', to: '¿Cómo estás?', flag: '🇪🇸', timestamp: '8s ago' },
    ];

    const translationInterval = setInterval(() => {
      const newTranslation = sampleTranslations[Math.floor(Math.random() * sampleTranslations.length)];
      setLiveTranslations(prev => [
        { ...newTranslation, id: Date.now() },
        ...prev.slice(0, 4)
      ]);
    }, 3000);

    return () => {
      clearInterval(statsInterval);
      clearInterval(translationInterval);
    };
  }, []);

  const StatCard = ({ icon: Icon, label, value, change, color = 'blue' }) => (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700">
      <div className="flex items-center justify-between mb-2">
        <Icon className={`h-5 w-5 text-${color}-500`} />
        <span className={`text-xs font-medium ${change > 0 ? 'text-green-600' : 'text-gray-500'}`}>
          {change > 0 ? `+${change}%` : '0%'}
        </span>
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {value.toLocaleString()}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {label}
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Live Statistics</h3>
            <p className="text-green-100 text-sm">Real-time activity</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">LIVE</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            icon={GlobeAltIcon}
            label="Translations Today"
            value={stats.translationsToday}
            change={18}
            color="blue"
          />
          <StatCard
            icon={UsersIcon}
            label="Active Now"
            value={stats.activeNow}
            change={12}
            color="green"
          />
          <StatCard
            icon={ChatBubbleLeftRightIcon}
            label="Messages/Min"
            value={stats.messagesThisMinute}
            change={25}
            color="purple"
          />
          <StatCard
            icon={GlobeAltIcon}
            label="Languages Active"
            value={stats.languagesActive}
            change={8}
            color="orange"
          />
        </div>

        {/* Live Translations Feed */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
            <div className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Live Translations
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {liveTranslations.length === 0 ? (
              <div className="text-center py-4">
                <GlobeAltIcon className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Waiting for translations...</p>
              </div>
            ) : (
              liveTranslations.map((translation) => (
                <div
                  key={translation.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg animate-pulse"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-900 dark:text-white">{translation.from}</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{translation.to}</span>
                    <span className="text-xs">{translation.flag}</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{translation.timestamp}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStatsWidget;
