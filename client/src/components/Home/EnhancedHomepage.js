import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  SparklesIcon,
  GlobeAltIcon,
  ChatBubbleLeftRightIcon,
  MicrophoneIcon,
  ArrowRightIcon,
  PlayIcon,
  StarIcon,
  UsersIcon,
  LanguageIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  BoltIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';
import { addNotification } from '../../store/slices/uiSlice';

const EnhancedHomepage = () => {
  const [activeDemo, setActiveDemo] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalTranslations: 0,
    activeUsers: 0,
    languagesSupported: 25,
    uptime: '99.9%'
  });

  const features = [
    {
      icon: GlobeAltIcon,
      title: 'Universal Translation',
      description: 'Translate between 25+ languages with instant accuracy',
      color: 'blue',
      demo: 'translation'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Real-time Chat',
      description: 'Connect with people globally in multilingual chat rooms',
      color: 'green',
      demo: 'chat'
    },
    {
      icon: MicrophoneIcon,
      title: 'Voice Translation',
      description: 'Speak naturally and get instant voice translations',
      color: 'purple',
      demo: 'voice'
    },
    {
      icon: UsersIcon,
      title: 'Community Hub',
      description: 'Join language learning communities and practice together',
      color: 'orange',
      demo: 'community'
    }
  ];

  const statsCards = [
    { label: 'Translations Today', value: '12.5K', change: '+18%', icon: LanguageIcon },
    { label: 'Active Users', value: '3.2K', change: '+25%', icon: UsersIcon },
    { label: 'Languages', value: '25+', change: '+2', icon: GlobeAltIcon },
    { label: 'Success Rate', value: '99.9%', change: '+0.1%', icon: ArrowTrendingUpIcon }
  ];

  useEffect(() => {
    // Animate stats on mount
    const timer = setTimeout(() => setIsAnimating(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleFeatureClick = (feature) => {
    setActiveDemo(feature.demo);
    setTimeout(() => {
      switch(feature.demo) {
        case 'translation':
          navigate('/translate');
          break;
        case 'chat':
          navigate('/chat');
          break;
        case 'voice':
          dispatch(addNotification({
            type: 'info',
            message: 'Voice translation coming soon!'
          }));
          break;
        case 'community':
          navigate('/community');
          break;
        default:
          break;
      }
      setActiveDemo(null);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className={`transform transition-all duration-1000 ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="flex justify-center mb-6">
                <div className="p-3 bg-white/20 backdrop-blur-lg rounded-2xl">
                  <SparklesIcon className="h-12 w-12 text-white" />
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                Universal Translator
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Break language barriers with AI-powered translation, real-time chat, and global community
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/translate')}
                  className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  Start Translating
                  <ArrowRightIcon className="inline h-5 w-5 ml-2" />
                </button>
                <button
                  onClick={() => navigate('/chat')}
                  className="px-8 py-4 bg-blue-500/20 backdrop-blur-lg text-white rounded-xl font-semibold hover:bg-blue-500/30 transform hover:scale-105 transition-all duration-200 border border-white/30"
                >
                  Join Chat Rooms
                  <ChatBubbleLeftRightIcon className="inline h-5 w-5 ml-2" />
                </button>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-blue-500/10 rounded-full blur-lg animate-bounce"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCards.map((stat, index) => (
              <div
                key={stat.label}
                className={`bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-700 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-600 transform transition-all duration-500 hover:scale-105 hover:shadow-xl ${
                  isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className="h-8 w-8 text-blue-500" />
                  <span className={`text-sm font-semibold ${stat.change.startsWith('+') ? 'text-green-600' : 'text-gray-600'}`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need for seamless multilingual communication
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                onClick={() => handleFeatureClick(feature)}
                className={`group cursor-pointer bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-blue-200 ${
                  activeDemo === feature.demo ? 'ring-2 ring-blue-500 scale-105' : ''
                } ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className={`inline-flex p-3 rounded-xl bg-${feature.color}-100 dark:bg-${feature.color}-900/20 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-8 w-8 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {feature.description}
                </p>
                <div className={`flex items-center text-${feature.color}-600 dark:text-${feature.color}-400 font-medium group-hover:translate-x-2 transition-transform duration-300`}>
                  Try Now
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted by Millions
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Join thousands of users who break language barriers every day
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex p-4 bg-blue-100 dark:bg-blue-900/20 rounded-2xl mb-4">
                <ShieldCheckIcon className="h-12 w-12 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Secure & Private</h3>
              <p className="text-gray-600 dark:text-gray-400">
                End-to-end encryption keeps your conversations safe
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex p-4 bg-green-100 dark:bg-green-900/20 rounded-2xl mb-4">
                <BoltIcon className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Instant translations with less than 100ms latency
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex p-4 bg-purple-100 dark:bg-purple-900/20 rounded-2xl mb-4">
                <RocketLaunchIcon className="h-12 w-12 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Always Improving</h3>
              <p className="text-gray-600 dark:text-gray-400">
                AI-powered translations get better every day
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Break Language Barriers?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join millions of users translating seamlessly every day
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/translate')}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Start Free Today
              <RocketLaunchIcon className="inline h-5 w-5 ml-2" />
            </button>
            <button
              onClick={() => navigate('/chat')}
              className="px-8 py-4 bg-blue-500/20 backdrop-blur-lg text-white rounded-xl font-semibold hover:bg-blue-500/30 transform hover:scale-105 transition-all duration-200 border border-white/30"
            >
              View Demo
              <PlayIcon className="inline h-5 w-5 ml-2" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EnhancedHomepage;
