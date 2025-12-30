'use client';

import { useState } from 'react';
import { Calendar as CalendarIcon, Plus, Edit2, Trash2, X } from 'lucide-react';

interface Event {
    id: string;
    title: string;
    date: string;
    time: string;
    description: string;
    color: string;
}

export default function Calendar() {
    const [events, setEvents] = useState<Event[]>([
        {
            id: '1',
            title: 'Math Exam',
            date: '2025-01-15',
            time: '10:00',
            description: 'Calculus final exam',
            color: 'bg-red-500',
        },
    ]);
    const [showAddEvent, setShowAddEvent] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [newEvent, setNewEvent] = useState<Partial<Event>>({
        title: '',
        date: '',
        time: '',
        description: '',
        color: 'bg-blue-500',
    });

    const colors = [
        { name: 'Blue', class: 'bg-blue-500' },
        { name: 'Red', class: 'bg-red-500' },
        { name: 'Green', class: 'bg-green-500' },
        { name: 'Purple', class: 'bg-purple-500' },
        { name: 'Orange', class: 'bg-orange-500' },
        { name: 'Pink', class: 'bg-pink-500' },
    ];

    const addEvent = () => {
        if (newEvent.title && newEvent.date) {
            const event: Event = {
                id: Date.now().toString(),
                title: newEvent.title,
                date: newEvent.date,
                time: newEvent.time || '00:00',
                description: newEvent.description || '',
                color: newEvent.color || 'bg-blue-500',
            };
            setEvents([...events, event]);
            setNewEvent({ title: '', date: '', time: '', description: '', color: 'bg-blue-500' });
            setShowAddEvent(false);
        }
    };

    const deleteEvent = (id: string) => {
        setEvents(events.filter(e => e.id !== id));
    };

    const updateEvent = () => {
        if (editingEvent) {
            setEvents(events.map(e => e.id === editingEvent.id ? editingEvent : e));
            setEditingEvent(null);
        }
    };

    const sortedEvents = [...events].sort((a, b) =>
        new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime()
    );

    const upcomingEvents = sortedEvents.filter(e =>
        new Date(e.date) >= new Date(new Date().setHours(0, 0, 0, 0))
    );

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-3">
                    <CalendarIcon className="w-8 h-8 text-blue-600" />
                    <h2 className="text-3xl font-bold">Academic Calendar</h2>
                </div>
                <p className="text-slate-600">Track exams, assignments, and important events</p>
            </div>

            {/* Add Event Button */}
            <div className="mb-6">
                <button
                    onClick={() => setShowAddEvent(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add Event
                </button>
            </div>

            {/* Add/Edit Event Modal */}
            {(showAddEvent || editingEvent) && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="glass-card p-6 rounded-xl max-w-md w-full">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold">
                                {editingEvent ? 'Edit Event' : 'Add New Event'}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowAddEvent(false);
                                    setEditingEvent(null);
                                }}
                                className="p-1 hover:bg-slate-100 rounded"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Event Title *</label>
                                <input
                                    type="text"
                                    value={editingEvent ? editingEvent.title : newEvent.title}
                                    onChange={(e) => editingEvent
                                        ? setEditingEvent({ ...editingEvent, title: e.target.value })
                                        : setNewEvent({ ...newEvent, title: e.target.value })
                                    }
                                    placeholder="e.g., Physics Exam, Assignment Due"
                                    className="input-field w-full"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Date *</label>
                                    <input
                                        type="date"
                                        value={editingEvent ? editingEvent.date : newEvent.date}
                                        onChange={(e) => editingEvent
                                            ? setEditingEvent({ ...editingEvent, date: e.target.value })
                                            : setNewEvent({ ...newEvent, date: e.target.value })
                                        }
                                        className="input-field w-full"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Time</label>
                                    <input
                                        type="time"
                                        value={editingEvent ? editingEvent.time : newEvent.time}
                                        onChange={(e) => editingEvent
                                            ? setEditingEvent({ ...editingEvent, time: e.target.value })
                                            : setNewEvent({ ...newEvent, time: e.target.value })
                                        }
                                        className="input-field w-full"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Description</label>
                                <textarea
                                    value={editingEvent ? editingEvent.description : newEvent.description}
                                    onChange={(e) => editingEvent
                                        ? setEditingEvent({ ...editingEvent, description: e.target.value })
                                        : setNewEvent({ ...newEvent, description: e.target.value })
                                    }
                                    placeholder="Additional details..."
                                    className="input-field w-full min-h-[80px]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Color</label>
                                <div className="flex gap-2">
                                    {colors.map((color) => (
                                        <button
                                            key={color.class}
                                            onClick={() => editingEvent
                                                ? setEditingEvent({ ...editingEvent, color: color.class })
                                                : setNewEvent({ ...newEvent, color: color.class })
                                            }
                                            className={`w-10 h-10 rounded-full ${color.class} ${(editingEvent ? editingEvent.color : newEvent.color) === color.class
                                                    ? 'ring-4 ring-offset-2 ring-slate-400'
                                                    : ''
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={editingEvent ? updateEvent : addEvent}
                                className="btn-primary w-full"
                            >
                                {editingEvent ? 'Update Event' : 'Add Event'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Events List */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold mb-4">
                    Upcoming Events ({upcomingEvents.length})
                </h3>

                {upcomingEvents.length === 0 ? (
                    <div className="glass-card p-12 rounded-xl text-center">
                        <CalendarIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500">No upcoming events. Add one to get started!</p>
                    </div>
                ) : (
                    upcomingEvents.map((event) => {
                        const eventDate = new Date(event.date);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const daysUntil = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                        return (
                            <div key={event.id} className="glass-card p-4 rounded-xl hover:shadow-lg transition-shadow">
                                <div className="flex items-start gap-4">
                                    <div className={`w-3 h-3 rounded-full ${event.color} mt-2 flex-shrink-0`} />

                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-lg font-semibold mb-1">{event.title}</h4>
                                        <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                                            <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                                            <span>🕐 {event.time}</span>
                                            {daysUntil === 0 && <span className="text-red-600 font-semibold">Today!</span>}
                                            {daysUntil === 1 && <span className="text-orange-600 font-semibold">Tomorrow</span>}
                                            {daysUntil > 1 && <span className="text-blue-600">In {daysUntil} days</span>}
                                        </div>
                                        {event.description && (
                                            <p className="text-sm text-slate-700">{event.description}</p>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setEditingEvent(event)}
                                            className="p-2 hover:bg-blue-50 rounded"
                                        >
                                            <Edit2 className="w-4 h-4 text-blue-600" />
                                        </button>
                                        <button
                                            onClick={() => deleteEvent(event.id)}
                                            className="p-2 hover:bg-red-50 rounded"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
