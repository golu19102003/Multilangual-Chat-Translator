import React, { useState } from 'react';
import { StarIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

const FeaturedLanguagesWidget = () => {
  const [selectedCategory, setSelectedCategory] = useState('popular');

  const categories = [
    { id: 'popular', name: 'Popular' },
    { id: 'trending', name: 'Trending' },
    { id: 'regional', name: 'Regional' }
  ];

  const languages = {
    popular: [
      { code: 'es', name: 'Spanish', flag: '🇪🇸', speakers: '559M', usage: '23%' },
      { code: 'fr', name: 'French', flag: '🇫🇷', speakers: '280M', usage: '18%' },
      { code: 'de', name: 'German', flag: '🇩🇪', speakers: '132M', usage: '15%' },
      { code: 'hi', name: 'Hindi', flag: '🇮🇳', speakers: '600M', usage: '12%' },
    ],
    trending: [
      { code: 'ja', name: 'Japanese', flag: '🇯🇵', speakers: '128M', trend: '+45%' },
      { code: 'ko', name: 'Korean', flag: '🇰🇷', speakers: '77M', trend: '+38%' },
      { code: 'ar', name: 'Arabic', flag: '🇸🇦', speakers: '422M', trend: '+32%' },
      { code: 'pt', name: 'Portuguese', flag: '🇵🇹', speakers: '260M', trend: '+28%' },
    ],
    regional: [
      { code: 'mr', name: 'Marathi', flag: '🇮🇳', speakers: '83M', region: 'India' },
      { code: 'te', name: 'Telugu', flag: '🇮🇳', speakers: '82M', region: 'India' },
      { code: 'ta', name: 'Tamil', flag: '🇱🇰', speakers: '78M', region: 'South Asia' },
      { code: 'bn', name: 'Bengali', flag: '🇧🇩', speakers: '230M', region: 'South Asia' },
    ]
  };

  const currentLanguages = languages[selectedCategory] || languages.popular;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Featured Languages</h3>
            <p className="text-purple-100 text-sm">Explore world languages</p>
          </div>
          <StarIcon className="h-8 w-8 text-purple-200" />
        </div>
      </div>

      <div className="p-6">
        {/* Category Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-slate-700 p-1 rounded-lg">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                selectedCategory === category.id
                  ? 'bg-white dark:bg-slate-600 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Languages List */}
        <div className="space-y-3">
          {currentLanguages.map((language, index) => (
            <div
              key={language.code}
              className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-slate-700 hover:border-purple-200 dark:hover:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{language.flag}</div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                      {language.name}
                    </h4>
                    {language.trend && (
                      <div className="flex items-center text-green-600 text-sm">
                        <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                        {language.trend}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {language.speakers} speakers
                    {language.region && ` • ${language.region}`}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {language.usage || `${Math.floor(Math.random() * 20 + 5)}%`}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  usage today
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Explore More */}
        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-700">
          <button className="w-full text-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium py-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors">
            Explore All 25+ Languages
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedLanguagesWidget;
