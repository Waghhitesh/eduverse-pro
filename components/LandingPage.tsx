'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Mail, Lock, ArrowRight, Sparkles, BookOpen, Brain, Trophy } from 'lucide-react';

export default function LandingPage({ onNavigate }: { onNavigate: (page: 'login' | 'register') => void }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
            </div>

            {/* Content */}
            <div className="relative z-10">
                {/* Header */}
                <header className="py-6 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-2xl">
                                <GraduationCap className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">EduVerse Pro</h1>
                                <p className="text-xs text-white/80">Ultimate AI Study Platform</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => onNavigate('login')}
                                className="px-6 py-2 rounded-lg bg-white/20 backdrop-blur-xl text-white font-semibold hover:bg-white/30 transition-all"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => onNavigate('register')}
                                className="px-6 py-2 rounded-lg bg-white text-blue-600 font-semibold hover:shadow-xl transition-all"
                            >
                                Register
                            </button>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-block mb-6 px-4 py-2 rounded-full bg-white/20 backdrop-blur-xl text-white text-sm font-medium">
                            ✨ 12 Powerful Tools in One Platform
                        </div>

                        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                            Your Complete
                            <br />
                            <span className="bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
                                Study Companion
                            </span>
                        </h2>

                        <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
                            AI-powered tools for flashcards, quizzes, document generation, task management,
                            and everything you need to excel in your studies.
                        </p>

                        <button
                            onClick={() => onNavigate('register')}
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-blue-600 font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
                        >
                            Get Started Free
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="pb-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    icon: Brain,
                                    title: 'AI Chat Assistant',
                                    description: 'Get instant answers to any academic question',
                                    color: 'from-blue-400 to-blue-600',
                                },
                                {
                                    icon: BookOpen,
                                    title: 'Smart Flashcards',
                                    description: 'Auto-generate study cards from your notes',
                                    color: 'from-pink-400 to-pink-600',
                                },
                                {
                                    icon: Trophy,
                                    title: 'Practice Quizzes',
                                    description: 'Test yourself with instant feedback',
                                    color: 'from-yellow-400 to-yellow-600',
                                },
                                {
                                    icon: Sparkles,
                                    title: 'Document Generator',
                                    description: 'Create PDFs, Word docs, and presentations',
                                    color: 'from-purple-400 to-purple-600',
                                },
                            ].map((feature, index) => (
                                <div
                                    key={index}
                                    className="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all hover:scale-105"
                                >
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                                        <feature.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                                    <p className="text-sm text-white/80">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="pb-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                                <div>
                                    <div className="text-5xl font-bold text-white mb-2">12</div>
                                    <div className="text-white/80">Powerful Tools</div>
                                </div>
                                <div>
                                    <div className="text-5xl font-bold text-white mb-2">24/7</div>
                                    <div className="text-white/80">AI Assistance</div>
                                </div>
                                <div>
                                    <div className="text-5xl font-bold text-white mb-2">∞</div>
                                    <div className="text-white/80">Learning Potential</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="pb-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h3 className="text-4xl font-bold text-white mb-4">
                            Ready to Transform Your Studies?
                        </h3>
                        <p className="text-xl text-white/90 mb-8">
                            Join thousands of students already excelling with EduVerse Pro
                        </p>
                        <button
                            onClick={() => onNavigate('register')}
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-blue-600 font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
                        >
                            Start Learning Now
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}
