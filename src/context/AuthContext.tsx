import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (data: { email: string; password: string }) => Promise<void>;
    signup: (data: { name: string; email: string; password: string }) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Failed to parse stored user:', error);
                localStorage.removeItem('user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (data: { email: string; password: string }) => {
        // Mock login - in real app, this would call an API
        const mockUser: User = {
            _id: 'mock-user-id',
            name: data.email.split('@')[0],
            email: data.email,
            role: 'user'
        };
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
    };

    const signup = async (data: { name: string; email: string; password: string }) => {
        // Mock signup - in real app, this would call an API
        const mockUser: User = {
            _id: 'mock-user-id-' + Date.now(),
            name: data.name,
            email: data.email,
            role: 'user'
        };
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
