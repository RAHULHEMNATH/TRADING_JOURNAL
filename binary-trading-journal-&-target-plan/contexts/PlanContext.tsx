import React, { createContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { TradingPlan, CalculatedPlan } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useDate } from '../hooks/useDate';
import { toDateString } from './DateContext';

interface PlanContextType {
  plan: TradingPlan | null;
  calculatedPlan: CalculatedPlan | null;
  createPlan: (plan: TradingPlan) => void;
  clearPlan: () => void;
  loading: boolean;
}

export const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const PlanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { selectedDate } = useDate();
  const [plan, setPlan] = useState<TradingPlan | null>(null);
  const [loading, setLoading] = useState(true);

  const storageKey = useMemo(() => {
    if (!user) return null;
    const dateStr = toDateString(selectedDate);
    return `tradingJournalPlan_${user.email}_${dateStr}`;
  }, [user, selectedDate]);

  useEffect(() => {
    if (isAuthenticated && storageKey) {
      setLoading(true);
      try {
        const storedPlan = localStorage.getItem(storageKey);
        if (storedPlan) {
          setPlan(JSON.parse(storedPlan));
        } else {
          setPlan(null);
        }
      } catch (error) {
        console.error("Failed to parse plan from localStorage", error);
        setPlan(null);
      } finally {
        setLoading(false);
      }
    } else if (!isAuthenticated) {
        setPlan(null);
        setLoading(false);
    }
  }, [isAuthenticated, storageKey]);

  const createPlan = useCallback((newPlan: TradingPlan) => {
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(newPlan));
      setPlan(newPlan);
    }
  }, [storageKey]);

  const clearPlan = useCallback(() => {
    if (storageKey) {
      localStorage.removeItem(storageKey);
      setPlan(null);
    }
  }, [storageKey]);

  const calculatedPlan = useMemo((): CalculatedPlan | null => {
    if (!plan) return null;

    const investmentPerTrade = plan.initialCapital * (plan.riskPerTrade / 100);
    const stopLossAmount = plan.initialCapital * (plan.stopLoss / 100);
    const profitTargetAmount = plan.initialCapital * (plan.dailyProfitTarget / 100);
    const maxTrades = investmentPerTrade > 0 ? Math.floor(stopLossAmount / investmentPerTrade) : 0;
    
    return { investmentPerTrade, maxTrades, profitTargetAmount, stopLossAmount };
  }, [plan]);

  const value = { plan, calculatedPlan, createPlan, clearPlan, loading };

  return (
    <PlanContext.Provider value={value}>
      {children}
    </PlanContext.Provider>
  );
};