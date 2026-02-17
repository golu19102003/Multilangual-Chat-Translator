import React, { useState } from 'react';
import { 
  ChatBubbleLeftRightIcon, 
  LanguageIcon, 
  UserGroupIcon,
  StarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const ActivityFeed = () => {
  const [activities] = useState([
    {
      id: 1,
      type: 'translation',
      user: 'You',
      action: 'translated "Hello world" to Spanish',
      target: 'Hola mundo',
      timestamp: '2 minutes ago',
      icon: LanguageIcon,
      color: 'blue'
    },
    {
      id: 2,
      type: 'chat',
      user: 'John Doe',
      action: 'joined the global chat room',
      target: 'English-Spanish Room',
      timestamp: '5 minutes ago',
      icon: ChatBubbleLeftRightIcon,
      color: 'green'
    },
    {
      id: 3,
      type: 'achievement',
      user: 'You',
      action: 'earned achievement',
      target: '100 Translations',
      timestamp: '1 hour ago',
      icon: StarIcon,
      color: 'yellow'
    },
    {
      id: 4,
      type: 'group',
      user: 'Sarah Smith',
      action: 'created a new group',
      target: 'French Learners',
      timestamp: '2 hours ago',
      icon: UserGroupIcon,
      color: 'purple'
    },
    {
      id: 5,
      type: 'translation',
      user: 'Mike Johnson',
      action: 'translated "Thank you" to Hindi',
      target: 'धन्यवाद',
      timestamp: '3 hours ago',
      icon: LanguageIcon,
      color: 'blue'
    },
    {
      id: 6,
      type: 'chat',
      user: 'Emma Wilson',
      action: 'sent 50 messages in',
      target: 'German Chat Room',
      timestamp: '4 hours ago',
      icon: ChatBubbleLeftRightIcon,
      color: 'green'
    }
  ]);

  const getActivityColor = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600 border-blue-200',
      green: 'bg-green-100 text-green-600 border-green-200',
      yellow: 'bg-yellow-100 text-yellow-600 border-yellow-200',
      purple: 'bg-purple-100 text-purple-600 border-purple-200'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <ClockIcon className="h-5 w-5 mr-2 text-gray-500" />
          Activity Feed
        </h3>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors">
            All
          </button>
          <button className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            My Activity
          </button>
          <button className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            Following
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            {/* Activity Icon */}
            <div className={`flex-shrink-0 p-2 rounded-full border ${getActivityColor(activity.color)}`}>
              <activity.icon className="h-4 w-4" />
            </div>

            {/* Activity Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-gray-900 text-sm">
                  {activity.user}
                </span>
                <span className="text-gray-500 text-sm">
                  {activity.action}
                </span>
              </div>
              
              {activity.target && (
                <p className="text-sm font-medium text-blue-600 mb-1">
                  {activity.target}
                </p>
              )}
              
              <p className="text-xs text-gray-500">
                {activity.timestamp}
              </p>
            </div>

            {/* Action Button */}
            {activity.type === 'translation' && activity.user === 'You' && (
              <button className="flex-shrink-0 text-xs text-blue-600 hover:text-blue-700 font-medium">
                Use Again
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="w-full text-center text-sm text-gray-600 hover:text-gray-700 font-medium py-2 hover:bg-gray-50 rounded-lg transition-colors">
          Load More Activities
        </button>
      </div>
    </div>
  );
};

export default ActivityFeed;
