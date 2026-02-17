import React, { useState, useEffect } from 'react';
import { 
  ChatBubbleLeftRightIcon, 
  LanguageIcon, 
  UserGroupIcon,
  StarIcon,
  ClockIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const RecentActivityWidget = () => {
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Simulate recent activities
    const sampleActivities = [
      {
        id: 1,
        type: 'translation',
        user: 'You',
        action: 'translated',
        details: '"Hello world" to Spanish',
        result: 'Hola mundo',
        timestamp: '2 minutes ago',
        icon: LanguageIcon,
        color: 'blue'
      },
      {
        id: 2,
        type: 'chat',
        user: 'Sarah Chen',
        action: 'joined',
        details: 'Spanish-English room',
        result: 'Active now',
        timestamp: '5 minutes ago',
        icon: ChatBubbleLeftRightIcon,
        color: 'green'
      },
      {
        id: 3,
        type: 'achievement',
        user: 'You',
        action: 'earned',
        details: 'Polyglot Badge',
        result: '100+ translations',
        timestamp: '1 hour ago',
        icon: StarIcon,
        color: 'yellow'
      },
      {
        id: 4,
        type: 'community',
        user: 'Mike Johnson',
        action: 'created',
        details: 'French Learners Group',
        result: '25 members',
        timestamp: '2 hours ago',
        icon: UserGroupIcon,
        color: 'purple'
      },
      {
        id: 5,
        type: 'translation',
        user: 'Emma Wilson',
        action: 'translated',
        details: '"Thank you" to Japanese',
        result: 'ありがとう',
        timestamp: '3 hours ago',
        icon: LanguageIcon,
        color: 'blue'
      }
    ];

    setActivities(sampleActivities);

    // Simulate new activities
    const interval = setInterval(() => {
      const newActivity = sampleActivities[Math.floor(Math.random() * sampleActivities.length)];
      setActivities(prev => [
        { ...newActivity, id: Date.now(), timestamp: 'Just now' },
        ...prev.slice(0, 9)
      ]);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === filter);

  const getActivityIcon = (activity) => {
    const IconComponent = activity.icon;
    return (
      <div className={`p-2 rounded-lg bg-${activity.color}-100 dark:bg-${activity.color}-900/20`}>
        <IconComponent className={`h-4 w-4 text-${activity.color}-600 dark:text-${activity.color}-400`} />
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden">
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Recent Activity</h3>
            <p className="text-orange-100 text-sm">What's happening now</p>
          </div>
          <ClockIcon className="h-8 w-8 text-orange-200" />
        </div>
      </div>

      <div className="p-6">
        {/* Filter Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-slate-700 p-1 rounded-lg">
          {[
            { id: 'all', name: 'All' },
            { id: 'translation', name: 'Translations' },
            { id: 'chat', name: 'Chat' },
            { id: 'community', name: 'Community' }
          ].map((filterOption) => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id)}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === filterOption.id
                  ? 'bg-white dark:bg-slate-600 text-orange-600 dark:text-orange-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {filterOption.name}
            </button>
          ))}
        </div>

        {/* Activities List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-8">
              <ClockIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
            </div>
          ) : (
            filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200 group"
              >
                {getActivityIcon(activity)}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-900 dark:text-white text-sm">
                      {activity.user}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      {activity.action}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                    {activity.details}
                  </div>
                  
                  {activity.result && (
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      {activity.result}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.timestamp}
                    </span>
                    
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {activity.type === 'translation' && (
                        <button className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                          Use
                        </button>
                      )}
                      <button className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                        <HeartIcon className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* View More */}
        {filteredActivities.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-700">
            <button className="w-full text-center text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium py-2 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors">
              View All Activity
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivityWidget;
