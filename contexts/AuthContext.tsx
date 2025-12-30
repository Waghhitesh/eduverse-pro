'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'admin';
    enrollmentNumber?: string;
    course?: string;
    activities: Activity[];
    createdAt: string;
}

interface Activity {
    id: string;
    action: string;
    feature: string;
    timestamp: string;
    details?: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    register: (data: RegisterData) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
    logActivity: (action: string, feature: string, details?: string) => void;
    getAllUsers: () => User[];
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
    enrollmentNumber?: string;
    course?: string;
    role?: 'student' | 'admin';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('currentUser');
        const savedUsers = localStorage.getItem('allUsers');

        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }

        if (savedUsers) {
            setUsers(JSON.parse(savedUsers));
        } else {
            // Create default admin if no users exist
            const defaultAdmin: User = {
                id: 'admin-1',
                name: 'Kilogram',
                email: 'kilogram', // Using 'kilogram' as identifier
                role: 'admin',
                activities: [],
                createdAt: new Date().toISOString(),
            };
            setUsers([defaultAdmin]);
            localStorage.setItem('allUsers', JSON.stringify([defaultAdmin]));
        }
    }, []);

    const login = async (emailOrUsername: string, password: string): Promise<boolean> => {
        // Simple authentication (in production, this would be API call)
        const foundUser = users.find(u =>
            u.email.toLowerCase() === emailOrUsername.toLowerCase() ||
            u.name.toLowerCase() === emailOrUsername.toLowerCase()
        );

        if (foundUser) {
            // Check for specific admin credentials requested by user
            if (foundUser.role === 'admin') {
                if (foundUser.name === 'Kilogram' && password === 'Kohli@143') {
                    // Success
                } else if (foundUser.email === emailOrUsername && password === 'Kohli@143') { // Support previous admin login if updated
                    // Success
                } else {
                    return false;
                }
            }

            setUser(foundUser);
            localStorage.setItem('currentUser', JSON.stringify(foundUser));

            logActivity('Login', 'Authentication', 'User logged in successfully');
            return true;
        }

        return false;
    };

    const register = async (data: RegisterData): Promise<boolean> => {
        // Check if user already exists
        if (users.some(u => u.email === data.email)) {
            return false;
        }

        const newUser: User = {
            id: `user-${Date.now()}`,
            name: data.name,
            email: data.email,
            role: data.role || 'student',
            enrollmentNumber: data.enrollmentNumber,
            course: data.course,
            activities: [{
                id: `activity-${Date.now()}`,
                action: 'Registration',
                feature: 'Authentication',
                timestamp: new Date().toISOString(),
                details: 'Account created',
            }],
            createdAt: new Date().toISOString(),
        };

        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        localStorage.setItem('allUsers', JSON.stringify(updatedUsers));

        // Auto-login after registration
        setUser(newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));

        return true;
    };

    const logout = () => {
        if (user) {
            logActivity('Logout', 'Authentication', 'User logged out');
        }
        setUser(null);
        localStorage.removeItem('currentUser');
    };

    const logActivity = (action: string, feature: string, details?: string) => {
        if (!user) return;

        const activity: Activity = {
            id: `activity-${Date.now()}`,
            action,
            feature,
            timestamp: new Date().toISOString(),
            details,
        };

        const updatedUser = {
            ...user,
            activities: [activity, ...user.activities],
        };

        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));

        // Update in users array
        const updatedUsers = users.map(u =>
            u.id === user.id ? updatedUser : u
        );
        setUsers(updatedUsers);
        localStorage.setItem('allUsers', JSON.stringify(updatedUsers));
    };

    const getAllUsers = () => users;

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                register,
                logout,
                isAuthenticated: !!user,
                isAdmin: user?.role === 'admin',
                logActivity,
                getAllUsers,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
