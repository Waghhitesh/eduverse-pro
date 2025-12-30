'use client';

import { useState } from 'react';
import { Mail, Lock, AlertCircle, GraduationCap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage({ onNavigate, onSuccess }: {
    onNavigate: (page: 'landing' | 'register') => void;
    onSuccess: () => void;
}) {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        const success = await login(email, password);
        setLoading(false);

        if (success) {
            onSuccess();
        } else {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Back Button */}
                <button
                    onClick={() => onNavigate('landing')}
                    className="mb-6 text-white/80 hover:text-white transition-colors flex items-center gap-2"
                >
                    ← Back to Home
                </button>

                {/* Login Card */}
                <div className="glass-card p-8 rounded-2xl shadow-2xl">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-xl">
                            <GraduationCap className="w-9 h-9 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
                        <p className="text-slate-600">Login to access your study tools</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {/* Admin Credentials */}
                    <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
                        <p className="text-sm font-semibold text-blue-900 mb-2">Admin Credentials:</p>
                        <div className="text-sm text-blue-800 space-y-1">
                            <p>
                                👤 <strong>Username:</strong> Kilogram
                            </p>
                            <p>
                                🔑 <strong>Password:</strong> Kohli@143
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium mb-2">Email or Username</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Kilogram or student@example.com"
                                    className="input-field pl-11 w-full"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="input-field pl-11 w-full"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-600">
                            Don't have an account?{' '}
                            <button
                                onClick={() => onNavigate('register')}
                                className="text-blue-600 font-semibold hover:underline"
                            >
                                Register here
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
