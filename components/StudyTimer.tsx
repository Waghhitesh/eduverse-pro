'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Clock, Coffee, Target } from 'lucide-react';

export default function StudyTimer() {
    const [mode, setMode] = useState<'focus' | 'break' | 'longBreak'>('focus');
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
    const [isRunning, setIsRunning] = useState(false);
    const [sessions, setSessions] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const durations = {
        focus: 25 * 60,
        break: 5 * 60,
        longBreak: 15 * 60,
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            handleTimerComplete();
        }

        return () => clearInterval(interval);
    }, [isRunning, timeLeft]);

    const handleTimerComplete = () => {
        setIsRunning(false);
        playNotification();

        if (mode === 'focus') {
            const newSessions = sessions + 1;
            setSessions(newSessions);

            if (newSessions % 4 === 0) {
                setMode('longBreak');
                setTimeLeft(durations.longBreak);
            } else {
                setMode('break');
                setTimeLeft(durations.break);
            }
        } else {
            setMode('focus');
            setTimeLeft(durations.focus);
        }
    };

    const playNotification = () => {
        if (typeof Audio !== 'undefined') {
            const beep = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaJ0fPTgjMGHm7A7+OZURE=');
            beep.play().catch(() => { });
        }
    };

    const toggleTimer = () => {
        setIsRunning(!isRunning);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(durations[mode]);
    };

    const switchMode = (newMode: 'focus' | 'break' | 'longBreak') => {
        setMode(newMode);
        setTimeLeft(durations[newMode]);
        setIsRunning(false);
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = ((durations[mode] - timeLeft) / durations[mode]) * 100;

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-3">
                    <Clock className="w-8 h-8 text-blue-600" />
                    <h2 className="text-3xl font-bold">Study Timer</h2>
                </div>
                <p className="text-slate-600">Pomodoro Technique - Focus in 25-minute intervals</p>
            </div>

            {/* Mode Selector */}
            <div className="flex gap-2 mb-8">
                <button
                    onClick={() => switchMode('focus')}
                    className={`flex-1 py-3 rounded-lg font-semibold transition-all ${mode === 'focus'
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                >
                    <Target className="w-5 h-5 inline mr-2" />
                    Focus (25min)
                </button>
                <button
                    onClick={() => switchMode('break')}
                    className={`flex-1 py-3 rounded-lg font-semibold transition-all ${mode === 'break'
                            ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg scale-105'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                >
                    <Coffee className="w-5 h-5 inline mr-2" />
                    Break (5min)
                </button>
                <button
                    onClick={() => switchMode('longBreak')}
                    className={`flex-1 py-3 rounded-lg font-semibold transition-all ${mode === 'longBreak'
                            ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg scale-105'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                >
                    <Coffee className="w-5 h-5 inline mr-2" />
                    Long Break (15min)
                </button>
            </div>

            {/* Timer Display */}
            <div className="glass-card p-12 rounded-3xl mb-8 relative overflow-hidden">
                {/* Progress Ring Background */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="8"
                            strokeDasharray={`${progress * 2.827} ${282.7 - progress * 2.827}`}
                            strokeDashoffset="70.675"
                            transform="rotate(-90 50 50)"
                            className="transition-all duration-1000"
                        />
                    </svg>
                </div>

                {/* Timer */}
                <div className="relative text-center">
                    <div className="text-8xl font-bold mb-6 tabular-nums">
                        {formatTime(timeLeft)}
                    </div>

                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={toggleTimer}
                            className="btn-primary px-8 py-4 text-lg flex items-center gap-2"
                        >
                            {isRunning ? (
                                <>
                                    <Pause className="w-6 h-6" />
                                    Pause
                                </>
                            ) : (
                                <>
                                    <Play className="w-6 h-6" />
                                    Start
                                </>
                            )}
                        </button>
                        <button
                            onClick={resetTimer}
                            className="btn-secondary px-8 py-4 text-lg flex items-center gap-2"
                        >
                            <RotateCcw className="w-6 h-6" />
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="glass-card p-6 rounded-xl text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">{sessions}</div>
                    <div className="text-sm text-slate-600">Sessions Completed</div>
                </div>
                <div className="glass-card p-6 rounded-xl text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                        {Math.floor(sessions * 25 / 60)}h {(sessions * 25) % 60}m
                    </div>
                    <div className="text-sm text-slate-600">Time Focused</div>
                </div>
                <div className="glass-card p-6 rounded-xl text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-1">
                        {Math.floor(sessions / 4)}
                    </div>
                    <div className="text-sm text-slate-600">Long Breaks Earned</div>
                </div>
            </div>

            {/* Tips */}
            <div className="mt-8 p-6 rounded-lg bg-blue-50 border border-blue-200">
                <h3 className="font-semibold mb-2 text-blue-900">📚 Pomodoro Technique Tips:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Focus for 25 minutes without distractions</li>
                    <li>• Take a 5-minute break after each session</li>
                    <li>• After 4 sessions, take a longer 15-minute break</li>
                    <li>• Use breaks to stretch, hydrate, or rest your eyes</li>
                </ul>
            </div>
        </div>
    );
}
