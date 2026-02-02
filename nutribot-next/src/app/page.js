'use client';

import React, { useState } from 'react';
import {
  MessageCircle, User, X, LogOut, Menu,
  Salad, Calculator, TrendingUp, Calendar,
  BookOpen, Home
} from 'lucide-react';

// Import components
import Articles from '@/components/Articles';
import BMICalculator from '@/components/BMICalculator';
import CalorieCounter from '@/components/CalorieCounter';
import MealPlanner from '@/components/MealPlanner';
import ChatSummarizer from '@/components/ChatSummarizer';

import { useRouter } from 'next/navigation';
import { api } from '@/services/api';

export default function App() {
  const router = useRouter();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check login status on mount
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(savedUser));
    }
  }, []);


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    try {
      // Assuming api.login takes { username, password } but form has email
      // If backend expects username, we might need to adjust or use email as username
      // Based on previous auth.py, backend expects 'username'. 
      // Let's assume user enters username in the email field for now, or we adjust UI label.

      // Adjusted: Backend login uses 'username', but UI shows 'Email'.
      // For simplicity, we will send the input as 'username' to the backend.
      const data = await api.login({ username: email, password });

      setIsLoggedIn(true);
      setUser(data.user);
      setIsLoginOpen(false);
    } catch (err) {
      setLoginError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    setIsLoggedIn(false);
    setUser(null);
    setCurrentPage('home');
  };

  // Render different pages based on currentPage
  const renderPage = () => {
    switch (currentPage) {
      case 'articles':
        return <Articles />;
      case 'bmi':
        return <BMICalculator />;
      case 'calories':
        return <CalorieCounter />;
      case 'meal-planner':
        return <MealPlanner />;
      case 'chat':
        return <ChatSummarizer />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} isLoggedIn={isLoggedIn} setIsLoginOpen={setIsLoginOpen} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button
              onClick={() => setCurrentPage('home')}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-sm">
                <Salad className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                NutriBot
              </span>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              <NavLink onClick={() => setCurrentPage('home')} active={currentPage === 'home'}>
                <Home className="w-4 h-4" />
                Home
              </NavLink>
              <NavLink onClick={() => setCurrentPage('articles')} active={currentPage === 'articles'}>
                <BookOpen className="w-4 h-4" />
                Articles
              </NavLink>
              <NavLink onClick={() => setCurrentPage('bmi')} active={currentPage === 'bmi'}>
                <Calculator className="w-4 h-4" />
                BMI Calculator
              </NavLink>
              <NavLink onClick={() => setCurrentPage('calories')} active={currentPage === 'calories'}>
                <TrendingUp className="w-4 h-4" />
                Calorie Counter
              </NavLink>
              <NavLink onClick={() => setCurrentPage('meal-planner')} active={currentPage === 'meal-planner'}>
                <Calendar className="w-4 h-4" />
                Meal Planner
              </NavLink>
              <NavLink onClick={() => router.push('/dashboard')}>
                <MessageCircle className="w-4 h-4" />
                Chatbot
              </NavLink>
            </nav>

            <div className="flex items-center gap-4">
              {!isLoggedIn ? (
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="hidden lg:flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg hover:shadow-md transition-all font-semibold text-sm"
                >
                  <User className="w-4 h-4" />
                  Sign In
                </button>
              ) : (
                <div className="hidden lg:flex items-center gap-4">
                  <button
                    onClick={() => router.push('/profile')}
                    className="flex items-center gap-2 px-3 py-2 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{user?.username || 'User'}</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              )}

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-700 hover:text-teal-600"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-100">
              <nav className="flex flex-col gap-3">
                <MobileNavLink onClick={() => { setCurrentPage('home'); setIsMobileMenuOpen(false); }}>
                  <Home className="w-5 h-5" />
                  Home
                </MobileNavLink>
                <MobileNavLink onClick={() => { setCurrentPage('articles'); setIsMobileMenuOpen(false); }}>
                  <BookOpen className="w-5 h-5" />
                  Articles
                </MobileNavLink>
                <MobileNavLink onClick={() => { setCurrentPage('bmi'); setIsMobileMenuOpen(false); }}>
                  <Calculator className="w-5 h-5" />
                  BMI Calculator
                </MobileNavLink>
                <MobileNavLink onClick={() => { setCurrentPage('calories'); setIsMobileMenuOpen(false); }}>
                  <TrendingUp className="w-5 h-5" />
                  Calorie Counter
                </MobileNavLink>
                <MobileNavLink onClick={() => { setCurrentPage('meal-planner'); setIsMobileMenuOpen(false); }}>
                  <Calendar className="w-5 h-5" />
                  Meal Planner
                </MobileNavLink>
                <MobileNavLink onClick={() => { router.push('/dashboard'); setIsMobileMenuOpen(false); }}>
                  <MessageCircle className="w-5 h-5" />
                  Chatbot
                </MobileNavLink>
                {!isLoggedIn && (
                  <button
                    onClick={() => { setIsLoginOpen(true); setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg hover:shadow-md transition-all font-semibold mt-2"
                  >
                    <User className="w-5 h-5" />
                    Sign In
                  </button>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Floating Chat Button */}
      {isLoggedIn && (
        <button
          onClick={() => router.push('/dashboard')}
          className="fixed right-6 bottom-6 group z-50"
        >
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
          </div>
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
            AI Assistant
          </div>
        </button>
      )}

      {/* Main Content */}
      <main>
        {renderPage()}
      </main>

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 relative shadow-2xl">
            <button
              onClick={() => setIsLoginOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
              <p className="text-gray-600">Sign in to access all features</p>
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-gray-600 text-sm mt-6">
              Don't have an account? <button onClick={() => router.push('/register')} className="text-teal-600 font-semibold hover:text-teal-700">Sign Up</button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Navigation Components
function NavLink({ children, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${active
        ? 'bg-teal-50 text-teal-700'
        : 'text-gray-600 hover:text-teal-600 hover:bg-gray-50'
        }`}
    >
      {children}
    </button>
  );
}

function MobileNavLink({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-700 rounded-lg font-semibold transition-all"
    >
      {children}
    </button>
  );
}

// HomePage Component
function HomePage({ setCurrentPage, isLoggedIn, setIsLoginOpen }) {
  const features = [
    {
      icon: Calculator,
      title: 'BMI Calculator',
      desc: 'Calculate your Body Mass Index and get personalized recommendations',
      color: 'from-blue-500 to-cyan-500',
      action: () => setCurrentPage('bmi')
    },
    {
      icon: TrendingUp,
      title: 'Calorie Counter',
      desc: 'Track your daily calorie intake and reach your fitness goals',
      color: 'from-orange-500 to-red-500',
      action: () => setCurrentPage('calories')
    },
    {
      icon: Calendar,
      title: 'Meal Planner',
      desc: 'Plan your weekly meals with personalized nutrition insights',
      color: 'from-teal-500 to-emerald-500',
      action: () => setCurrentPage('meal-planner')
    },
    {
      icon: BookOpen,
      title: 'Diet Articles',
      desc: 'Read evidence-based articles about nutrition and healthy eating',
      color: 'from-purple-500 to-pink-500',
      action: () => setCurrentPage('articles')
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-50 via-emerald-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-teal-700 font-semibold text-sm mb-6 shadow-sm">
              <Salad className="w-4 h-4" />
              Science-Based Nutrition Platform
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
              Your Journey to<br />
              <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                Healthy Living
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              Track calories, plan meals, and learn about nutrition with our comprehensive diet and health platform
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => isLoggedIn ? setCurrentPage('meal-planner') : setIsLoginOpen(true)}
                className="px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Start Planning Meals
              </button>
              <button
                onClick={() => setCurrentPage('articles')}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
              >
                Read Articles
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600">Powerful tools for your health journey</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <button
                key={idx}
                onClick={feature.action}
                className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-all text-left group"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
