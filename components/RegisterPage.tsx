'use client';

import { useState } from 'react';
import { Mail, Lock, User, BookOpen, Hash, AlertCircle, GraduationCap, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage({ onNavigate, onSuccess }: {
    onNavigate: (page: 'landing' | 'login') => void;
    onSuccess: () => void;
}) {
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        enrollmentNumber: '',
        course: '',
        role: 'student' as 'student' | 'admin',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.name || !formData.email || !formData.password) {
            setError('Please fill in all required fields');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        const success = await register({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            enrollmentNumber: formData.enrollmentNumber,
            course: formData.course,
            role: formData.role,
        });
        setLoading(false);

        if (success) {
            onSuccess();
        } else {
            setError('Email already exists. Please use a different email.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Back Button */}
                <button
                    onClick={() => onNavigate('landing')}
                    className="mb-6 text-white/80 hover:text-white transition-colors flex items-center gap-2"
                >
                    ← Back to Home
                </button>

                {/* Register Card */}
                <div className="glass-card p-8 rounded-2xl shadow-2xl">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-xl">
                            <GraduationCap className="w-9 h-9 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold mb-2">Create Account</h2>
                        <p className="text-slate-600">Join EduVerse Pro and start learning</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {/* Registration Type (Locked to Student) */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-3">Registration Type:</label>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="p-4 rounded-xl border-2 border-blue-500 bg-blue-50 flex items-center justify-center gap-4">
                                <GraduationCap className="w-8 h-8 text-blue-600" />
                                <div>
                                    <div className="font-semibold text-blue-900">Student Account</div>
                                    <div className="text-xs text-blue-700">Access all 12 study tools</div>
                                </div>
                            </div>
                        </div>
                        <p className="mt-3 text-xs text-slate-500 text-center">
                            * Admin registration is restricted. Please use provided credentials for admin access.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Full Name *</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="John Doe"
                                        className="input-field pl-11 w-full"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Email Address *</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="student@example.com"
                                        className="input-field pl-11 w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {formData.role === 'student' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Enrollment Number</label>
                                    <div className="relative">
                                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={formData.enrollmentNumber}
                                            onChange={(e) => setFormData({ ...formData, enrollmentNumber: e.target.value })}
                                            placeholder="ENR12345"
                                            className="input-field pl-11 w-full"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Course</label>
                                    <div className="relative">
                                        <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={formData.course}
                                            onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                                            placeholder="Computer Science"
                                            className="input-field pl-11 w-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Password *</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="At least 6 characters"
                                        className="input-field pl-11 w-full"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Confirm Password *</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        placeholder="Re-enter password"
                                        className="input-field pl-11 w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-600">
                            Already have an account?{' '}
                            <button
                                onClick={() => onNavigate('login')}
                                className="text-blue-600 font-semibold hover:underline"
                            >
                                Login here
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
