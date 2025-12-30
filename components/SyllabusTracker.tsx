'use client';

import { useState } from 'react';
import { BookOpen, Plus, Check, Circle } from 'lucide-react';

interface Chapter {
    id: string;
    title: string;
    completed: boolean;
}

interface Subject {
    id: string;
    name: string;
    totalChapters: number;
    completedChapters: number;
    chapters: Chapter[];
}

export default function SyllabusTracker() {
    const [subjects, setSubjects] = useState<Subject[]>([
        {
            id: '1',
            name: 'Mathematics',
            totalChapters: 12,
            completedChapters: 7,
            chapters: [
                { id: '1', title: 'Sets and Functions', completed: true },
                { id: '2', title: 'Algebra', completed: true },
                { id: '3', title: 'Coordinate Geometry', completed: false },
                { id: '4', title: 'Calculus', completed: false },
                { id: '5', title: 'Statistics', completed: true },
            ],
        },
    ]);

    const [showAddSubject, setShowAddSubject] = useState(false);
    const [newSubject, setNewSubject] = useState('');
    const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

    const addSubject = () => {
        if (newSubject.trim()) {
            setSubjects([
                ...subjects,
                {
                    id: Date.now().toString(),
                    name: newSubject,
                    totalChapters: 0,
                    completedChapters: 0,
                    chapters: [],
                },
            ]);
            setNewSubject('');
            setShowAddSubject(false);
        }
    };

    const toggleChapter = (subjectId: string, chapterId: string) => {
        setSubjects(subjects.map(subject => {
            if (subject.id === subjectId) {
                const chapters = subject.chapters.map(chapter =>
                    chapter.id === chapterId ? { ...chapter, completed: !chapter.completed } : chapter
                );
                const completedChapters = chapters.filter(c => c.completed).length;
                return { ...subject, chapters, completedChapters };
            }
            return subject;
        }));
    };

    const getProgressPercentage = (subject: Subject) => {
        if (subject.chapters.length === 0) return 0;
        return (subject.completedChapters / subject.chapters.length) * 100;
    };

    const totalProgress = subjects.reduce((acc, s) => acc + getProgressPercentage(s), 0) / Math.max(subjects.length, 1);

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-3">
                    <BookOpen className="w-8 h-8 text-blue-600" />
                    <h2 className="text-3xl font-bold">Syllabus Tracker</h2>
                </div>
                <p className="text-slate-600">Track your course progress and stay organized</p>
            </div>

            {/* Overall Progress */}
            <div className="glass-card p-6 rounded-xl mb-6">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">Overall Progress</h3>
                    <span className="text-2xl font-bold text-blue-600">{totalProgress.toFixed(0)}%</span>
                </div>
                <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                        style={{ width: `${totalProgress}%` }}
                    />
                </div>
            </div>

            {/* Add Subject */}
            <div className="mb-6">
                {showAddSubject ? (
                    <div className="glass-card p-4 rounded-xl">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newSubject}
                                onChange={(e) => setNewSubject(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addSubject()}
                                placeholder="Subject name (e.g., Physics, Chemistry)"
                                className="input-field flex-1"
                                autoFocus
                            />
                            <button onClick={addSubject} className="btn-primary px-6">Add</button>
                            <button onClick={() => setShowAddSubject(false)} className="btn-secondary px-6">Cancel</button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowAddSubject(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Add Subject
                    </button>
                )}
            </div>

            {/* Subjects List */}
            <div className="space-y-4">
                {subjects.length === 0 ? (
                    <div className="glass-card p-12 rounded-xl text-center">
                        <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500">No subjects added yet. Add one to start tracking!</p>
                    </div>
                ) : (
                    subjects.map((subject) => {
                        const progress = getProgressPercentage(subject);
                        const isExpanded = expandedSubject === subject.id;

                        return (
                            <div key={subject.id} className="glass-card rounded-xl overflow-hidden">
                                {/* Subject Header */}
                                <button
                                    onClick={() => setExpandedSubject(isExpanded ? null : subject.id)}
                                    className="w-full p-6 text-left hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-xl font-bold">{subject.name}</h3>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm text-slate-600">
                                                {subject.completedChapters}/{subject.chapters.length} chapters
                                            </span>
                                            <span className="text-lg font-bold text-blue-600">{progress.toFixed(0)}%</span>
                                        </div>
                                    </div>
                                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </button>

                                {/* Chapters List */}
                                {isExpanded && subject.chapters.length > 0 && (
                                    <div className="border-t border-slate-200 p-4 bg-slate-50">
                                        <h4 className="font-semibold mb-3">Chapters:</h4>
                                        <div className="space-y-2">
                                            {subject.chapters.map((chapter) => (
                                                <button
                                                    key={chapter.id}
                                                    onClick={() => toggleChapter(subject.id, chapter.id)}
                                                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${chapter.completed
                                                            ? 'bg-green-50 border-2 border-green-500'
                                                            : 'bg-white border-2 border-slate-200 hover:border-blue-400'
                                                        }`}
                                                >
                                                    {chapter.completed ? (
                                                        <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                                                    ) : (
                                                        <Circle className="w-5 h-5 text-slate-400 flex-shrink-0" />
                                                    )}
                                                    <span className={chapter.completed ? 'text-green-700 font-medium' : ''}>
                                                        {chapter.title}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Tips */}
            <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
                <h3 className="font-semibold mb-2 text-blue-900">📚 Tracking Tips:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Click on a subject to expand and view chapters</li>
                    <li>• Click on chapters to mark them as complete</li>
                    <li>• Track your overall progress across all subjects</li>
                    <li>• Stay motivated by watching your progress grow!</li>
                </ul>
            </div>
        </div>
    );
}
