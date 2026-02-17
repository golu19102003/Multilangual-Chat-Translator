import React from 'react';
import QuickTranslateWidget from '../Widgets/QuickTranslateWidget';
import LiveStatsWidget from '../Widgets/LiveStatsWidget';
import FeaturedLanguagesWidget from '../Widgets/FeaturedLanguagesWidget';
import RecentActivityWidget from '../Widgets/RecentActivityWidget';

const LiveExperiencePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Live Experience
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Try our features right here, right now
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Translate Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Quick Translate
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <QuickTranslateWidget />
            <LiveStatsWidget />
          </div>
        </div>

        {/* Featured Languages & Activity */}
        <div className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FeaturedLanguagesWidget />
            <RecentActivityWidget />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveExperiencePage;
