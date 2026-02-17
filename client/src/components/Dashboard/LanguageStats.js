import React, { useState } from 'react';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

const LanguageStats = () => {
  const [languageData] = useState([
    { language: 'Spanish', flag: '🇪🇸', count: 145, change: 12, color: 'blue' },
    { language: 'Hindi', flag: '🇮🇳', count: 98, change: -5, color: 'orange' },
    { language: 'French', flag: '🇫🇷', count: 76, change: 8, color: 'green' },
    { language: 'Chinese', flag: '🇨🇳', count: 54, change: 15, color: 'purple' },
    { language: 'German', flag: '🇩🇪', count: 43, change: 3, color: 'red' },
  ]);

  const totalTranslations = languageData.reduce((sum, lang) => sum + lang.count, 0);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <ArrowTrendingUpIcon className="h-5 w-5 mr-2 text-green-500" />
          Language Statistics
        </h3>
        <span className="text-sm text-gray-500">Last 7 days</span>
      </div>

      {/* Total Count */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Translations</p>
            <p className="text-2xl font-bold text-gray-900">{totalTranslations.toLocaleString()}</p>
          </div>
          <div className="flex items-center text-green-600">
            <ArrowTrendingUpIcon className="h-5 w-5 mr-1" />
            <span className="text-sm font-medium">+18%</span>
          </div>
        </div>
      </div>

      {/* Language List */}
      <div className="space-y-3">
        {languageData.map((lang, index) => (
          <div
            key={lang.language}
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-medium">
                {lang.flag}
              </div>
              <div>
                <p className="font-medium text-gray-900">{lang.language}</p>
                <p className="text-xs text-gray-500">{lang.count} translations</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="flex items-center">
                  {lang.change > 0 ? (
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${lang.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {lang.change > 0 ? '+' : ''}{lang.change}%
                  </span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div
                  className={`bg-${lang.color}-500 h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${(lang.count / totalTranslations) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* More Languages Link */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2 hover:bg-blue-50 rounded-lg transition-colors">
          View All Languages
        </button>
      </div>
    </div>
  );
};

export default LanguageStats;
