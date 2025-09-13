import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Simulate checking for an active session
      const storedUser = localStorage.getItem('tradingJournalUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      // Ensure user is null if parsing fails
      setUser(null);
      localStorage.removeItem('tradingJournalUser');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, pass: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => { // Simulate API call latency
        const storedUsers = JSON.parse(localStorage.getItem('tradingJournalUsers') || '{}');
        if (storedUsers[email] && storedUsers[email] === pass) {
          const loggedInUser: User = { email };
          localStorage.setItem('tradingJournalUser', JSON.stringify(loggedInUser));
          setUser(loggedInUser);
          resolve();
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 500);
    });
  }, []);

  const signup = useCallback(async (email: string, pass: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => { // Simulate API call latency
        const storedUsers = JSON.parse(localStorage.getItem('tradingJournalUsers') || '{}');
        if (storedUsers[email]) {
          reject(new Error('User with this email already exists'));
        } else {
          const newUsers = { ...storedUsers, [email]: pass };
          localStorage.setItem('tradingJournalUsers', JSON.stringify(newUsers));
          const newUser: User = { email };
          localStorage.setItem('tradingJournalUser', JSON.stringify(newUser));
          setUser(newUser);
          resolve();
        }
      }, 500);
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('tradingJournalUser');
    setUser(null);
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
