'use client';

import { useState } from 'react';
import { CheckSquare, Plus, Trash2, Circle, CheckCircle2 } from 'lucide-react';

interface Task {
    id: string;
    title: string;
    priority: 'low' | 'medium' | 'high';
    completed: boolean;
    dueDate?: string;
}

export default function TaskManager() {
    const [tasks, setTasks] = useState<Task[]>([
        { id: '1', title: 'Complete Math Assignment', priority: 'high', completed: false, dueDate: '2025-01-10' },
        { id: '2', title: 'Study for Physics Quiz', priority: 'medium', completed: false, dueDate: '2025-01-08' },
    ]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
    const [newTaskDate, setNewTaskDate] = useState('');

    const addTask = () => {
        if (newTaskTitle.trim()) {
            const task: Task = {
                id: Date.now().toString(),
                title: newTaskTitle,
                priority: newTaskPriority,
                completed: false,
                dueDate: newTaskDate || undefined,
            };
            setTasks([...tasks, task]);
            setNewTaskTitle('');
            setNewTaskDate('');
            setNewTaskPriority('medium');
        }
    };

    const toggleTask = (id: string) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    const deleteTask = (id: string) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const priorityColors = {
        low: 'border-green-500 bg-green-50',
        medium: 'border-yellow-500 bg-yellow-50',
        high: 'border-red-500 bg-red-50',
    };

    const priorityBadges = {
        low: 'bg-green-500 text-white',
        medium: 'bg-yellow-500 text-white',
        high: 'bg-red-500 text-white',
    };

    const pendingTasks = tasks.filter(t => !t.completed);
    const completedTasks = tasks.filter(t => t.completed);

    return (
        <div className="w-full max-w-3xl mx-auto">
            <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-3">
                    <CheckSquare className="w-8 h-8 text-blue-600" />
                    <h2 className="text-3xl font-bold">Task Manager</h2>
                </div>
                <p className="text-slate-600">Organize your assignments and studying tasks</p>
            </div>

            {/* Add Task Form */}
            <div className="glass-card p-6 rounded-xl mb-6">
                <h3 className="font-semibold mb-4">Add New Task</h3>
                <div className="space-y-4">
                    <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTask()}
                        placeholder="e.g., Complete Science Project, Review Chapter 5..."
                        className="input-field w-full"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Priority:</label>
                            <select
                                value={newTaskPriority}
                                onChange={(e) => setNewTaskPriority(e.target.value as any)}
                                className="input-field w-full"
                            >
                                <option value="low">🟢 Low</option>
                                <option value="medium">🟡 Medium</option>
                                <option value="high">🔴 High</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Due Date:</label>
                            <input
                                type="date"
                                value={newTaskDate}
                                onChange={(e) => setNewTaskDate(e.target.value)}
                                className="input-field w-full"
                            />
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={addTask}
                                disabled={!newTaskTitle.trim()}
                                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <Plus className="w-5 h-5" />
                                Add Task
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="glass-card p-4 rounded-xl text-center">
                    <div className="text-3xl font-bold text-blue-600">{tasks.length}</div>
                    <div className="text-sm text-slate-600">Total Tasks</div>
                </div>
                <div className="glass-card p-4 rounded-xl text-center">
                    <div className="text-3xl font-bold text-orange-600">{pendingTasks.length}</div>
                    <div className="text-sm text-slate-600">Pending</div>
                </div>
                <div className="glass-card p-4 rounded-xl text-center">
                    <div className="text-3xl font-bold text-green-600">{completedTasks.length}</div>
                    <div className="text-sm text-slate-600">Completed</div>
                </div>
            </div>

            {/* Pending Tasks */}
            {pendingTasks.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-xl font-bold mb-4">Pending Tasks ({pendingTasks.length})</h3>
                    <div className="space-y-3">
                        {pendingTasks.map((task) => (
                            <div
                                key={task.id}
                                className={`glass-card p-4 rounded-xl border-l-4 ${priorityColors[task.priority]} hover:shadow-md transition-shadow`}
                            >
                                <div className="flex items-start gap-3">
                                    <button
                                        onClick={() => toggleTask(task.id)}
                                        className="mt-1 flex-shrink-0"
                                    >
                                        <Circle className="w-6 h-6 text-slate-400 hover:text-blue-600 transition-colors" />
                                    </button>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-semibold">{task.title}</h4>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${priorityBadges[task.priority]}`}>
                                                {task.priority.toUpperCase()}
                                            </span>
                                        </div>
                                        {task.dueDate && (
                                            <p className="text-sm text-slate-600">
                                                📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => deleteTask(task.id)}
                                        className="p-2 hover:bg-red-50 rounded"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
                <div>
                    <h3 className="text-xl font-bold mb-4">Completed Tasks ({completedTasks.length})</h3>
                    <div className="space-y-3">
                        {completedTasks.map((task) => (
                            <div
                                key={task.id}
                                className="glass-card p-4 rounded-xl bg-slate-50 opacity-75"
                            >
                                <div className="flex items-start gap-3">
                                    <button
                                        onClick={() => toggleTask(task.id)}
                                        className="mt-1 flex-shrink-0"
                                    >
                                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                                    </button>

                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold line-through text-slate-500">{task.title}</h4>
                                    </div>

                                    <button
                                        onClick={() => deleteTask(task.id)}
                                        className="p-2 hover:bg-red-50 rounded"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {tasks.length === 0 && (
                <div className="glass-card p-12 rounded-xl text-center">
                    <CheckSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">No tasks yet. Add one to get started!</p>
                </div>
            )}
        </div>
    );
}
