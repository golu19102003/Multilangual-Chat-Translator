import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  ChatBubbleLeftRightIcon,
  LanguageIcon,
  GlobeAltIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  StarIcon,
  SparklesIcon,
  MicrophoneIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ArrowRightIcon,
  PlayIcon,
  PauseIcon,
  ChartBarIcon,
  AcademicCapIcon,
  FireIcon,
  TrophyIcon,
  BookOpenIcon,
  VideoCameraIcon,
  PhotoIcon,
  SpeakerWaveIcon,
  BookmarkIcon,
  ShareIcon,
  DownloadIcon,
  HeartIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  BoltIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  BellIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { addNotification } from '../../store/slices/uiSlice';
import TranslationInterface from '../Translation/TranslationInterface';
import QuickTranslate from './QuickTranslate';
import RecentTranslations from './RecentTranslations';
import LanguageStats from './LanguageStats';
import ActivityFeed from './ActivityFeed';
import LiveTranslationCard from './LiveTranslationCard';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAnimating, setIsAnimating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [userStats, setUserStats] = useState({
    totalTranslations: 0,
    accuracy: 0,
    languagesLearned: 0,
    streakDays: 0,
    points: 0,
    rank: 'Beginner'
  });
  const [liveStats, setLiveStats] = useState({
    translationsToday: 0,
    activeUsers: 0,
    messagesExchanged: 0,
    languagesUsed: 0,
    accuracyRate: 0,
    responseTime: 0
  });
  const [recentAchievements, setRecentAchievements] = useState([]);
  const [learningProgress, setLearningProgress] = useState([]);
  const [trendingLanguages, setTrendingLanguages] = useState([]);
  
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate live stats updates
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        translationsToday: prev.translationsToday + Math.floor(Math.random() * 3),
        activeUsers: Math.max(1, prev.activeUsers + (Math.random() > 0.7 ? 1 : -1)),
        messagesExchanged: prev.messagesExchanged + Math.floor(Math.random() * 5),
        languagesUsed: Math.min(20, prev.languagesUsed + (Math.random() > 0.8 ? 1 : 0)),
        accuracyRate: Math.min(100, Math.max(85, prev.accuracyRate + (Math.random() - 0.5) * 2)),
        responseTime: Math.max(100, Math.min(500, prev.responseTime + (Math.random() - 0.5) * 50))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Initialize user stats
    setUserStats({
      totalTranslations: Math.floor(Math.random() * 1000) + 100,
      accuracy: Math.floor(Math.random() * 15) + 85,
      languagesLearned: Math.floor(Math.random() * 8) + 3,
      streakDays: Math.floor(Math.random() * 30) + 1,
      points: Math.floor(Math.random() * 5000) + 500,
      rank: ['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'][Math.floor(Math.random() * 5)]
    });

    // Initialize achievements
    setRecentAchievements([
      { id: 1, title: 'First Translation', description: 'Completed your first translation', icon: CheckCircleIcon, color: 'green', unlocked: true },
      { id: 2, title: 'Language Explorer', description: 'Used 5 different languages', icon: GlobeAltIcon, color: 'blue', unlocked: true },
      { id: 3, title: 'Accuracy Master', description: 'Achieved 95% accuracy', icon: StarIcon, color: 'yellow', unlocked: false }
    ]);

    // Initialize learning progress
    setLearningProgress([
      { language: 'Spanish', progress: 75, lessons: 12, totalLessons: 16, flag: '🇪🇸' },
      { language: 'French', progress: 60, lessons: 9, totalLessons: 15, flag: '🇫🇷' },
      { language: 'German', progress: 45, lessons: 6, totalLessons: 14, flag: '🇩🇪' }
    ]);

    // Initialize trending languages
    setTrendingLanguages([
      { name: 'Spanish', users: 12500, growth: '+12%', flag: '🇪🇸' },
      { name: 'French', users: 8900, growth: '+8%', flag: '🇫🇷' },
      { name: 'German', users: 6700, growth: '+15%', flag: '🇩🇪' },
      { name: 'Japanese', users: 5400, growth: '+20%', flag: '🇯🇵' }
    ]);
  }, []);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleQuickAction = (action) => {
    switch(action) {
      case 'translate':
        setActiveTab('translate');
        break;
      case 'chat':
        navigate('/chat');
        break;
      case 'voice':
        dispatch(addNotification({
          type: 'info',
          message: 'Voice translation feature coming soon!'
        }));
        break;
      case 'learn':
        setActiveTab('learning');
        break;
      case 'practice':
        navigate('/practice');
        break;
      case 'community':
        navigate('/community');
        break;
      default:
        break;
    }
  };

  const StatCard = ({ icon: Icon, title, value, change, color = 'blue', subtitle, trend }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-${color}-500 transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className={`text-2xl font-bold text-gray-900 dark:text-${color}-400 mt-1`}>{value.toLocaleString()}</p>
          {subtitle && <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>}
          {change && (
            <div className="flex items-center mt-2">
              <ArrowTrendingUpIcon className={`h-4 w-4 mr-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`} />
              <p className={`text-sm ${change > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {change > 0 ? '+' : ''}{change}% from yesterday
              </p>
            </div>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-xs px-2 py-1 rounded-full ${
                trend === 'up' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                trend === 'down' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
              }`}>
                {trend === 'up' ? '↑ Rising' : trend === 'down' ? '↓ Falling' : '→ Stable'}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 bg-${color}-100 dark:bg-${color}-900/20 rounded-lg ml-4`}>
          <Icon className={`h-6 w-6 text-${color}-600 dark:text-${color}-400`} />
        </div>
      </div>
    </div>
  );

  const QuickActionCard = ({ icon: Icon, title, description, action, color = 'blue', badge, featured }) => (
    <button
      onClick={() => handleQuickAction(action)}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-left transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-transparent hover:border-${color}-300 focus:outline-none focus:ring-2 focus:ring-${color}-500 focus:ring-offset-2 relative ${featured ? 'ring-2 ring-' + color + '-500 ring-offset-2' : ''}`}
    >
      {featured && (
        <div className={`absolute -top-2 -right-2 bg-${color}-500 text-white text-xs px-2 py-1 rounded-full font-semibold`}>
          Featured
        </div>
      )}
      {badge && (
        <div className={`absolute top-4 right-4 bg-${color}-100 text-${color}-800 dark:bg-${color}-900/20 dark:text-${color}-400 text-xs px-2 py-1 rounded-full font-semibold`}>
          {badge}
        </div>
      )}
      <div className={`inline-flex p-3 bg-${color}-100 dark:bg-${color}-900/20 rounded-lg mb-4`}>
        <Icon className={`h-6 w-6 text-${color}-600 dark:text-${color}-400`} />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>
      <div className={`flex items-center text-${color}-600 font-medium text-sm`}>
        Get Started
        <ArrowRightIcon className="h-4 w-4 ml-1" />
      </div>
    </button>
  );

  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* User Stats Overview */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.displayName || 'User'}!</h2>
                  <p className="text-blue-100 mb-4">Your translation journey continues</p>
                  <div className="flex items-center space-x-6">
                    <div>
                      <p className="text-3xl font-bold">{userStats.points.toLocaleString()}</p>
                      <p className="text-sm text-blue-100">Total Points</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold">{userStats.streakDays}</p>
                      <p className="text-sm text-blue-100">Day Streak</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold">{userStats.rank}</p>
                      <p className="text-sm text-blue-100">Current Rank</p>
                    </div>
                  </div>
                </div>
                <TrophyIcon className="h-16 w-16 text-yellow-300" />
              </div>
            </div>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={LanguageIcon}
                title="Translations Today"
                value={liveStats.translationsToday}
                change={12}
                color="blue"
                subtitle="Real-time updates"
                trend="up"
              />
              <StatCard
                icon={UserGroupIcon}
                title="Active Users"
                value={liveStats.activeUsers}
                change={8}
                color="green"
                subtitle="Online now"
                trend="up"
              />
              <StatCard
                icon={ChartBarIcon}
                title="Accuracy Rate"
                value={`${liveStats.accuracyRate}%`}
                change={3}
                color="purple"
                subtitle="Average quality"
                trend="up"
              />
              <StatCard
                icon={BoltIcon}
                title="Response Time"
                value={`${liveStats.responseTime}ms`}
                change={-5}
                color="orange"
                subtitle="Processing speed"
                trend="down"
              />
            </div>

            {/* Enhanced Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <RocketLaunchIcon className="h-5 w-5 mr-2 text-purple-500" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <QuickActionCard
                  icon={LanguageIcon}
                  title="Start Translating"
                  description="Translate text between 20+ languages instantly"
                  action="translate"
                  color="blue"
                  badge="Popular"
                  featured
                />
                <QuickActionCard
                  icon={ChatBubbleLeftRightIcon}
                  title="Join Chat Room"
                  description="Connect with people globally in real-time"
                  action="chat"
                  color="green"
                  badge="New"
                />
                <QuickActionCard
                  icon={MicrophoneIcon}
                  title="Voice Translation"
                  description="Speak and translate in real-time"
                  action="voice"
                  color="purple"
                />
                <QuickActionCard
                  icon={AcademicCapIcon}
                  title="Learn Languages"
                  description="Interactive lessons and quizzes"
                  action="learn"
                  color="indigo"
                />
                <QuickActionCard
                  icon={BookOpenIcon}
                  title="Practice Mode"
                  description="Improve your translation skills"
                  action="practice"
                  color="yellow"
                />
                <QuickActionCard
                  icon={UserGroupIcon}
                  title="Community"
                  description="Join discussions and forums"
                  action="community"
                  color="pink"
                />
              </div>
            </div>

            {/* Enhanced Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <RecentTranslations />
                <LiveTranslationCard />
              </div>
              <div className="space-y-6">
                <LanguageStats />
                {/* Recent Achievements */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <TrophyIcon className="h-5 w-5 mr-2 text-yellow-500" />
                    Recent Achievements
                  </h3>
                  <div className="space-y-3">
                    {recentAchievements.map(achievement => (
                      <div key={achievement.id} className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border-2 ${
                        achievement.unlocked ? 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10' : 'border-gray-200 dark:border-gray-700 opacity-60'
                      }`}>
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            achievement.unlocked ? `bg-${achievement.color}-100 dark:bg-${achievement.color}-900/20` : 'bg-gray-100 dark:bg-gray-700'
                          }`}>
                            <achievement.icon className={`h-5 w-5 ${
                              achievement.unlocked ? `text-${achievement.color}-600 dark:text-${achievement.color}-400` : 'text-gray-400'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-semibold text-sm ${
                              achievement.unlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                            }`}>{achievement.title}</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{achievement.description}</p>
                          </div>
                          {achievement.unlocked && (
                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'learning':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <AcademicCapIcon className="h-5 w-5 mr-2 text-indigo-500" />
                Learning Progress
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {learningProgress.map((language, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{language.flag}</span>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{language.language}</h4>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{language.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${language.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                      <span>{language.lessons} lessons</span>
                      <span>{language.totalLessons} total</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <FireIcon className="h-5 w-5 mr-2 text-orange-500" />
                Trending Languages
              </h3>
              <div className="space-y-3">
                {trendingLanguages.map((language, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{language.flag}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{language.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{language.users.toLocaleString()} users</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-green-600 font-semibold text-sm">{language.growth}</span>
                      <ArrowTrendingUpIcon className="h-4 w-4 text-green-600 ml-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'activity':
        return <ActivityFeed />;

      case 'settings':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Cog6ToothIcon className="h-5 w-5 mr-2" />
              Settings
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Default Language</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Your preferred translation language</p>
                    </div>
                    <select className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>Hindi</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Auto-detect Language</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Automatically detect source language</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <GlobeAltIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Welcome to UniTranslate</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back, {user?.displayName || 'User'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search translations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Notifications */}
              <button className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <BellIcon className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              {/* Settings */}
              <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Cog6ToothIcon className="h-5 w-5" />
              </button>
              {/* User Profile */}
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.displayName?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: GlobeAltIcon },
              { id: 'learning', label: 'Learning', icon: AcademicCapIcon },
              { id: 'translate', label: 'Translate', icon: LanguageIcon },
              { id: 'activity', label: 'Activity', icon: ClockIcon },
              { id: 'settings', label: 'Settings', icon: Cog6ToothIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-1 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`transition-all duration-500 ${isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
