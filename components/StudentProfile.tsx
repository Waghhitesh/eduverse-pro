'use client';

import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Hash, BookOpen, Calendar, Activity, LogOut } from 'lucide-react';

export default function StudentProfile({ onLogout }: { onLogout: () => void }) {
    const { user } = useAuth();

    if (!user) return null;

    // Get recent activities (last 10)
    const recentActivities = user.activities.slice(0, 10);

    // Calculate feature usage stats
    const featureUsage: Record<string, number> = {};
    user.activities.forEach((activity) => {
        featureUsage[activity.feature] = (featureUsage[activity.feature] || 0) + 1;
    });

    const topFeatures = Object.entries(featureUsage)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold mb-2">My Profile</h2>
                    <p className="text-slate-600">View your account details and activity</p>
                </div>
                <button
                    onClick={onLogout}
                    className="btn-secondary flex items-center gap-2"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>

            {/* Profile Card */}
            <div className="glass-card p-8 rounded-xl mb-6">
                <div className="flex items-start gap-6">
                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-4xl flex-shrink-0 shadow-xl">
                        {user.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-4">{user.name}</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="text-xs text-slate-500">Email</p>
                                    <p className="font-medium">{user.email}</p>
                                </div>
                            </div>

                            {user.enrollmentNumber && (
                                <div className="flex items-center gap-3">
                                    <Hash className="w-5 h-5 text-slate-400" />
                                    <div>
                                        <p className="text-xs text-slate-500">Enrollment Number</p>
                                        <p className="font-medium">{user.enrollmentNumber}</p>
                                    </div>
                                </div>
                            )}

                            {user.course && (
                                <div className="flex items-center gap-3">
                                    <BookOpen className="w-5 h-5 text-slate-400" />
                                    <div>
                                        <p className="text-xs text-slate-500">Course</p>
                                        <p className="font-medium">{user.course}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="text-xs text-slate-500">Member Since</p>
                                    <p className="font-medium">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="glass-card p-6 rounded-xl text-center">
                    <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                        {user.activities.length}
                    </div>
                    <div className="text-sm text-slate-600">Total Activities</div>
                </div>

                <div className="glass-card p-6 rounded-xl text-center">
                    <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-green-600 mb-1">
                        {Math.ceil((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                    </div>
                    <div className="text-sm text-slate-600">Days Active</div>
                </div>

                <div className="glass-card p-6 rounded-xl text-center">
                    <BookOpen className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-purple-600 mb-1">
                        {topFeatures.length}
                    </div>
                    <div className="text-sm text-slate-600">Features Used</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Features */}
                <div className="glass-card p-6 rounded-xl">
                    <h3 className="text-lg font-bold mb-4">Most Used Features</h3>
                    {topFeatures.length === 0 ? (
                        <p className="text-center text-slate-500 py-8">Start using features to see stats</p>
                    ) : (
                        <div className="space-y-3">
                            {topFeatures.map(([feature, count], index) => (
                                <div key={feature} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-semibold">{feature}</span>
                                            <span className="text-sm text-slate-600">{count} uses</span>
                                        </div>
                                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                                                style={{ width: `${(count / topFeatures[0][1]) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Activities */}
                <div className="glass-card p-6 rounded-xl">
                    <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                        {recentActivities.length === 0 ? (
                            <p className="text-center text-slate-500 py-8">No activities yet</p>
                        ) : (
                            recentActivities.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="p-3 rounded-lg bg-slate-50 border border-slate-200"
                                >
                                    <div className="flex items-start justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-medium">
                                                {activity.feature}
                                            </span>
                                            <span className="text-sm font-semibold">{activity.action}</span>
                                        </div>
                                        <span className="text-xs text-slate-500 whitespace-nowrap">
                                            {new Date(activity.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    {activity.details && (
                                        <p className="text-sm text-slate-600 ml-1">{activity.details}</p>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
