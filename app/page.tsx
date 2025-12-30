'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LandingPage from '@/components/LandingPage';
import LoginPage from '@/components/LoginPage';
import RegisterPage from '@/components/RegisterPage';
import AdminDashboard from '@/components/AdminDashboard';
import StudentProfile from '@/components/StudentProfile';
import ChatInterface from '@/components/ChatInterface';
import DocumentBuilder from '@/components/DocumentBuilder';
import ResourceUploader from '@/components/ResourceUploader';
import FlashcardGenerator from '@/components/FlashcardGenerator';
import QuizGenerator from '@/components/QuizGenerator';
import StudyTimer from '@/components/StudyTimer';
import CitationGenerator from '@/components/CitationGenerator';
import Calculator from '@/components/Calculator';
import CalendarManager from '@/components/CalendarManager';
import TaskManager from '@/components/TaskManager';
import ExamCountdown from '@/components/ExamCountdown';
import SyllabusTracker from '@/components/SyllabusTracker';
import {
  MessageCircle,
  FileText,
  Upload,
  Sparkles,
  GraduationCap,
  Menu,
  X,
  Brain,
  Trophy,
  Clock,
  BookMarked,
  Calculator as CalcIcon,
  Calendar as CalIcon,
  CheckSquare,
  AlertCircle,
  BookOpen,
  User,
  Shield,
  LogOut,
} from 'lucide-react';

type Page = 'landing' | 'login' | 'register' | 'app';
type View = 'chat' | 'documents' | 'resources' | 'flashcards' | 'quiz' | 'timer' | 'citations' |
  'calculator' | 'calendar' | 'tasks' | 'exams' | 'syllabus' | 'profile' | 'admin';

export default function Home() {
  const { user, isAuthenticated, isAdmin, logout, logActivity } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [currentView, setCurrentView] = useState<View>('chat');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setCurrentPage('app');
    } else {
      setCurrentPage('landing');
    }
  }, [isAuthenticated]);

  const handleViewChange = (view: View) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    logActivity('Navigation', 'App', `Switched to ${view}`);
  };

  const handleLogout = () => {
    logout();
    setCurrentPage('landing');
    setCurrentView('chat');
  };

  // Show auth pages if not authenticated
  if (!isAuthenticated) {
    if (currentPage === 'login') {
      return (
        <LoginPage
          onNavigate={setCurrentPage}
          onSuccess={() => setCurrentPage('app')}
        />
      );
    }
    if (currentPage === 'register') {
      return (
        <RegisterPage
          onNavigate={setCurrentPage}
          onSuccess={() => setCurrentPage('app')}
        />
      );
    }
    return <LandingPage onNavigate={setCurrentPage} />;
  }

  // Show app content for authenticated users
  const navigation = [
    { id: 'chat' as View, label: 'AI Chat', icon: MessageCircle, color: 'text-blue-600' },
    { id: 'flashcards' as View, label: 'Flashcards', icon: Brain, color: 'text-pink-600' },
    { id: 'quiz' as View, label: 'Quiz', icon: Trophy, color: 'text-yellow-600' },
    { id: 'timer' as View, label: 'Study Timer', icon: Clock, color: 'text-green-600' },
    { id: 'exams' as View, label: 'Exam Countdown', icon: AlertCircle, color: 'text-red-600' },
    { id: 'tasks' as View, label: 'Tasks', icon: CheckSquare, color: 'text-purple-600' },
    { id: 'calendar' as View, label: 'Calendar', icon: CalIcon, color: 'text-blue-500' },
    { id: 'syllabus' as View, label: 'Syllabus', icon: BookOpen, color: 'text-indigo-600' },
    { id: 'calculator' as View, label: 'Calculator', icon: CalcIcon, color: 'text-teal-600' },
    { id: 'documents' as View, label: 'Documents', icon: FileText, color: 'text-purple-700' },
    { id: 'citations' as View, label: 'Citations', icon: BookMarked, color: 'text-indigo-700' },
    { id: 'resources' as View, label: 'Resources', icon: Upload, color: 'text-orange-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-academic flex items-center justify-center shadow-lg animate-glow">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  EduVerse Pro
                </h1>
                <p className="text-xs text-slate-500 hidden sm:block">
                  Welcome, {user?.name}!
                </p>
              </div>
            </div>

            {/* Desktop Navigation (scrollable) */}
            <nav className="hidden lg:flex items-center gap-1 overflow-x-auto max-w-3xl">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleViewChange(item.id)}
                    title={item.label}
                    className={`
                      flex items-center gap-1 px-2 py-2 rounded-lg font-medium transition-all duration-200 text-xs whitespace-nowrap
                      ${currentView === item.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md scale-105'
                        : 'text-slate-700 hover:bg-slate-100'
                      }
                    `}
                  >
                    <Icon className={`w-4 h-4 ${currentView === item.id ? 'text-white' : item.color}`} />
                    <span className="hidden xl:inline">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* User Menu */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => handleViewChange('profile')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${currentView === 'profile' ? 'bg-blue-100 text-blue-700' : 'hover:bg-slate-100'
                  }`}
              >
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">Profile</span>
              </button>

              {isAdmin && (
                <button
                  onClick={() => handleViewChange('admin')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${currentView === 'admin' ? 'bg-purple-100 text-purple-700' : 'hover:bg-slate-100'
                    }`}
                >
                  <Shield className="w-5 h-5" />
                  <span className="text-sm font-medium">Admin</span>
                </button>
              )}

              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 space-y-1 max-h-[70vh] overflow-y-auto">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleViewChange(item.id)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all text-sm
                      ${currentView === item.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                        : 'text-slate-700 hover:bg-slate-100'
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 ${currentView === item.id ? 'text-white' : item.color}`} />
                    {item.label}
                  </button>
                );
              })}

              <hr className="my-2" />

              <button
                onClick={() => handleViewChange('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all text-sm ${currentView === 'profile' ? 'bg-blue-100 text-blue-700' : 'hover:bg-slate-100'
                  }`}
              >
                <User className="w-5 h-5" />
                My Profile
              </button>

              {isAdmin && (
                <button
                  onClick={() => handleViewChange('admin')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all text-sm ${currentView === 'admin' ? 'bg-purple-100 text-purple-700' : 'hover:bg-slate-100'
                    }`}
                >
                  <Shield className="w-5 h-5" />
                  Admin Dashboard
                </button>
              )}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-4rem)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="glass-card rounded-2xl shadow-2xl overflow-hidden min-h-[calc(100vh-8rem)]">
            <div className="p-4 sm:p-8">
              {currentView === 'profile' && <StudentProfile onLogout={handleLogout} />}
              {currentView === 'admin' && isAdmin && <AdminDashboard />}
              {currentView === 'chat' && <ChatInterface />}
              {currentView === 'flashcards' && <FlashcardGenerator />}
              {currentView === 'quiz' && <QuizGenerator />}
              {currentView === 'timer' && <StudyTimer />}
              {currentView === 'exams' && <ExamCountdown />}
              {currentView === 'tasks' && <TaskManager />}
              {currentView === 'calendar' && <CalendarManager />}
              {currentView === 'syllabus' && <SyllabusTracker />}
              {currentView === 'calculator' && <Calculator />}
              {currentView === 'documents' && <DocumentBuilder />}
              {currentView === 'citations' && <CitationGenerator />}
              {currentView === 'resources' && (
                <div className="max-w-3xl mx-auto">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
                      <Sparkles className="w-8 h-8 text-blue-600" />
                      Upload Your Resources
                    </h2>
                    <p className="text-slate-600">
                      Upload notes, PDFs, images for AI-powered analysis
                    </p>
                  </div>
                  <ResourceUploader />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Floating Quick Access */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <button
          onClick={() => handleViewChange('chat')}
          className="w-14 h-14 rounded-full gradient-academic shadow-2xl flex items-center justify-center hover:scale-110 transition-transform animate-float"
          title="Open AI Chat"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
}
