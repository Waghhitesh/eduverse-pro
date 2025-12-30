'use client';

import { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Edit2 } from 'lucide-react';

interface Exam {
    id: string;
    name: string;
    date: string;
    subject: string;
}

export default function ExamCountdown() {
    const [exams, setExams] = useState<Exam[]>([
        { id: '1', name: 'Final Mathematics Exam', date: '2025-01-25', subject: 'Math' },
    ]);
    const [showAdd, setShowAdd] = useState(false);
    const [newExam, setNewExam] = useState({ name: '', date: '', subject: '' });
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const addExam = () => {
        if (newExam.name && newExam.date) {
            setExams([...exams, { ...newExam, id: Date.now().toString() }]);
            setNewExam({ name: '', date: '', subject: '' });
            setShowAdd(false);
        }
    };

    const deleteExam = (id: string) => {
        setExams(exams.filter(e => e.id !== id));
    };

    const getCountdown = (examDate: string) => {
        const now = currentTime.getTime();
        const exam = new Date(examDate + 'T00:00:00').getTime();
        const diff = exam - now;

        if (diff < 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0, passed: true };
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds, passed: false };
    };

    const sortedExams = [...exams].sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-3">
                    <Clock className="w-8 h-8 text-blue-600" />
                    <h2 className="text-3xl font-bold">Exam Countdown</h2>
                </div>
                <p className="text-slate-600">Track time remaining until your exams</p>
            </div>

            {/* Add Exam Button */}
            <div className="mb-6">
                <button
                    onClick={() => setShowAdd(!showAdd)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add Exam
                </button>
            </div>

            {/* Add Exam Form */}
            {showAdd && (
                <div className="glass-card p-6 rounded-xl mb-6">
                    <h3 className="font-semibold mb-4">Add New Exam</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <input
                            type="text"
                            value={newExam.name}
                            onChange={(e) => setNewExam({ ...newExam, name: e.target.value })}
                            placeholder="Exam Name"
                            className="input-field"
                        />
                        <input
                            type="text"
                            value={newExam.subject}
                            onChange={(e) => setNewExam({ ...newExam, subject: e.target.value })}
                            placeholder="Subject"
                            className="input-field"
                        />
                        <input
                            type="date"
                            value={newExam.date}
                            onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
                            className="input-field"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button onClick={addExam} className="btn-primary">Add Exam</button>
                        <button onClick={() => setShowAdd(false)} className="btn-secondary">Cancel</button>
                    </div>
                </div>
            )}

            {/* Exams List */}
            <div className="space-y-6">
                {sortedExams.length === 0 ? (
                    <div className="glass-card p-12 rounded-xl text-center">
                        <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500">No exams scheduled. Add one to start tracking!</p>
                    </div>
                ) : (
                    sortedExams.map((exam) => {
                        const countdown = getCountdown(exam.date);
                        const isUrgent = !countdown.passed && countdown.days <= 3;
                        const isToday = countdown.days === 0 && !countdown.passed;

                        return (
                            <div
                                key={exam.id}
                                className={`glass-card p-6 rounded-xl ${isToday ? 'border-4 border-red-500 animate-pulse' :
                                        isUrgent ? 'border-2 border-orange-500' : ''
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-2xl font-bold mb-1">{exam.name}</h3>
                                        <div className="flex items-center gap-4 text-sm text-slate-600">
                                            <span>📚 {exam.subject}</span>
                                            <span>📅 {new Date(exam.date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteExam(exam.id)}
                                        className="p-2 hover:bg-red-50 rounded"
                                    >
                                        <Trash2 className="w-5 h-5 text-red-600" />
                                    </button>
                                </div>

                                {countdown.passed ? (
                                    <div className="text-center p-8 bg-slate-100 rounded-lg">
                                        <p className="text-xl font-semibold text-slate-500">Exam has passed</p>
                                    </div>
                                ) : isToday ? (
                                    <div className="text-center p-8 bg-red-50 rounded-lg">
                                        <p className="text-3xl font-bold text-red-600 mb-2">EXAM TODAY!</p>
                                        <p className="text-lg text-red-700">Good luck! 🍀</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-4 gap-4">
                                        {[
                                            { label: 'Days', value: countdown.days },
                                            { label: 'Hours', value: countdown.hours },
                                            { label: 'Minutes', value: countdown.minutes },
                                            { label: 'Seconds', value: countdown.seconds },
                                        ].map((unit) => (
                                            <div key={unit.label} className="text-center p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white">
                                                <div className="text-4xl font-bold mb-1 tabular-nums">
                                                    {unit.value.toString().padStart(2, '0')}
                                                </div>
                                                <div className="text-sm opacity-90">{unit.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {isUrgent && !isToday && !countdown.passed && (
                                    <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg text-center">
                                        <p className="text-orange-700 font-semibold">
                                            ⚠️ Exam is coming soon! Time to focus on preparation!
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
