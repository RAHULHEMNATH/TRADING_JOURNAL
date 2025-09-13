import React, { createContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { Trade } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useDate } from '../hooks/useDate';
import { toDateString } from './DateContext';

interface JournalContextType {
  trades: Trade[];
  addTrade: (trade: Omit<Trade, 'id'>) => void;
  loading: boolean;
}

export const JournalContext = createContext<JournalContextType | undefined>(undefined);

export const JournalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { selectedDate } = useDate();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  const storageKey = useMemo(() => {
    if (!user) return null;
    const dateStr = toDateString(selectedDate);
    return `tradingJournalTrades_${user.email}_${dateStr}`;
  }, [user, selectedDate]);

  useEffect(() => {
    if (isAuthenticated && storageKey) {
      setLoading(true);
      try {
        const storedTrades = localStorage.getItem(storageKey);
        if (storedTrades) {
          setTrades(JSON.parse(storedTrades));
        } else {
          setTrades([]);
        }
      } catch (error) {
        console.error("Failed to parse trades from localStorage", error);
        setTrades([]);
      } finally {
        setLoading(false);
      }
    } else if (!isAuthenticated) {
      setTrades([]);
      setLoading(false);
    }
  }, [isAuthenticated, storageKey]);

  const addTrade = useCallback((newTradeData: Omit<Trade, 'id'>) => {
    if (storageKey) {
      const newTrade: Trade = { ...newTradeData, id: new Date().toISOString() };
      const updatedTrades = [newTrade, ...trades];
      localStorage.setItem(storageKey, JSON.stringify(updatedTrades));
      setTrades(updatedTrades);
    }
  }, [trades, storageKey]);

  const value = { trades, addTrade, loading };

  return (
    <JournalContext.Provider value={value}>
      {children}
    </JournalContext.Provider>
  );
};