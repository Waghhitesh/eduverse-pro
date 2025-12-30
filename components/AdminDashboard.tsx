'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Activity, TrendingUp, Search, Eye, Calendar, BookOpen } from 'lucide-react';

export default function AdminDashboard() {
    const { getAllUsers } = useAuth();
    const users = getAllUsers().filter(u => u.role === 'student');
    const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.enrollmentNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedUser = users.find(u => u.id === selectedStudent);

    const totalActivities = users.reduce((sum, u) => sum + u.activities.length, 0);
    const avgActivitiesPerStudent = users.length > 0 ? (totalActivities / users.length).toFixed(1) : 0;

    return (
        <div className="w-full max-w-7xl mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Admin Dashboard</h2>
                <p className="text-slate-600">Monitor student activities and platform usage</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass-card p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600 mb-1">Total Students</p>
                            <p className="text-4xl font-bold text-blue-600">{users.length}</p>
                        </div>
                        <Users className="w-12 h-12 text-blue-500 opacity-20" />
                    </div>
                </div>

                <div className="glass-card p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600 mb-1">Total Activities</p>
                            <p className="text-4xl font-bold text-green-600">{totalActivities}</p>
                        </div>
                        <Activity className="w-12 h-12 text-green-500 opacity-20" />
                    </div>
                </div>

                <div className="glass-card p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600 mb-1">Avg Activities/Student</p>
                            <p className="text-4xl font-bold text-purple-600">{avgActivitiesPerStudent}</p>
                        </div>
                        <TrendingUp className="w-12 h-12 text-purple-500 opacity-20" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Students List */}
                <div className="glass-card p-6 rounded-xl">
                    <h3 className="text-xl font-bold mb-4">Students</h3>

                    {/* Search */}
                    <div className="mb-4 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search students..."
                            className="input-field pl-11 w-full"
                        />
                    </div>

                    {/* Students List */}
                    <div className="space-y-3 max-h-[500px] overflow-y-auto">
                        {filteredUsers.length === 0 ? (
                            <p className="text-center text-slate-500 py-8">No students found</p>
                        ) : (
                            filteredUsers.map((user) => (
                                <button
                                    key={user.id}
                                    onClick={() => setSelectedStudent(user.id)}
                                    className={`w-full p-4 rounded-lg text-left transition-all ${selectedStudent === user.id
                                            ? 'bg-blue-50 border-2 border-blue-500'
                                            : 'bg-slate-50 border-2 border-slate-200 hover:border-blue-300'
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-semibold mb-1">{user.name}</h4>
                                            <p className="text-sm text-slate-600">{user.email}</p>
                                            {user.enrollmentNumber && (
                                                <p className="text-sm text-slate-500">
                                                    📝 {user.enrollmentNumber}
                                                </p>
                                            )}
                                            {user.course && (
                                                <p className="text-sm text-slate-500">
                                                    📚 {user.course}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-semibold text-blue-600">
                                                {user.activities.length} activities
                                            </div>
                                            <button className="mt-2 text-xs text-blue-600 hover:underline flex items-center gap-1">
                                                <Eye className="w-3 h-3" />
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Student Activity Details */}
                <div className="glass-card p-6 rounded-xl">
                    {selectedUser ? (
                        <>
                            <div className="mb-6">
                                <h3 className="text-xl font-bold mb-2">Activity Details</h3>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                        {selectedUser.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">{selectedUser.name}</h4>
                                        <p className="text-sm text-slate-600">{selectedUser.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Activity Stats */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                                    <Calendar className="w-5 h-5 text-blue-600 mb-2" />
                                    <p className="text-sm text-slate-600">Joined</p>
                                    <p className="font-semibold">
                                        {new Date(selectedUser.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                                    <BookOpen className="w-5 h-5 text-green-600 mb-2" />
                                    <p className="text-sm text-slate-600">Total Activities</p>
                                    <p className="font-semibold">{selectedUser.activities.length}</p>
                                </div>
                            </div>

                            {/* Activity Timeline */}
                            <h4 className="font-semibold mb-4">Recent Activities</h4>
                            <div className="space-y-3 max-h-[350px] overflow-y-auto">
                                {selectedUser.activities.length === 0 ? (
                                    <p className="text-center text-slate-500 py-8">No activities yet</p>
                                ) : (
                                    selectedUser.activities.map((activity) => (
                                        <div
                                            key={activity.id}
                                            className="p-3 rounded-lg bg-slate-50 border border-slate-200"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-medium">
                                                            {activity.feature}
                                                        </span>
                                                        <span className="text-sm font-semibold text-slate-800">
                                                            {activity.action}
                                                        </span>
                                                    </div>
                                                    {activity.details && (
                                                        <p className="text-sm text-slate-600">{activity.details}</p>
                                                    )}
                                                </div>
                                                <span className="text-xs text-slate-500 whitespace-nowrap ml-2">
                                                    {new Date(activity.timestamp).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <Eye className="w-16 h-16 text-slate-300 mb-4" />
                            <p className="text-slate-500">Select a student to view their activity details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
