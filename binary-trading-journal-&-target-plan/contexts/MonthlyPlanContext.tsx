import React, { createContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { MonthlyPlan, DailyPlanTarget } from '../types';
import { useAuth } from '../hooks/useAuth';

interface MonthlyPlanContextType {
    activePlan: MonthlyPlan | null;
    historicalPlans: MonthlyPlan[];
    createPlan: (capital: number, profitGoal: number, days: number) => void;
    toggleDayCompletion: (planId: string, day: number) => void;
    loading: boolean;
}

export const MonthlyPlanContext = createContext<MonthlyPlanContextType | undefined>(undefined);

const calculateCompoundingPlan = (capital: number, profitGoal: number, days: number): DailyPlanTarget[] => {
    const dailyGrowthRate = Math.pow(1 + profitGoal / 100, 1 / days) - 1;
    let currentCapital = capital;
    const targets: DailyPlanTarget[] = [];
    
    for (let i = 1; i <= days; i++) {
        const targetProfit = currentCapital * dailyGrowthRate;
        const endingCapital = currentCapital + targetProfit;
        targets.push({
            day: i,
            date: `Day ${i}`,
            startingCapital: currentCapital,
            targetProfit: targetProfit,
            endingCapital: endingCapital,
            completed: false,
        });
        currentCapital = endingCapital;
    }
    return targets;
};

export const MonthlyPlanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [activePlan, setActivePlan] = useState<MonthlyPlan | null>(null);
    const [historicalPlans, setHistoricalPlans] = useState<MonthlyPlan[]>([]);
    const [loading, setLoading] = useState(true);

    const activeStorageKey = useMemo(() => user ? `monthlyPlan_active_${user.email}` : null, [user]);
    const historyStorageKey = useMemo(() => user ? `monthlyPlan_history_${user.email}` : null, [user]);

    useEffect(() => {
        if (isAuthenticated && activeStorageKey && historyStorageKey) {
            setLoading(true);
            try {
                const storedActive = localStorage.getItem(activeStorageKey);
                setActivePlan(storedActive ? JSON.parse(storedActive) : null);

                const storedHistory = localStorage.getItem(historyStorageKey);
                setHistoricalPlans(storedHistory ? JSON.parse(storedHistory) : []);
            } catch (e) {
                console.error("Failed to parse monthly plans from localStorage", e);
                setActivePlan(null);
                setHistoricalPlans([]);
            } finally {
                setLoading(false);
            }
        } else if (!isAuthenticated) {
            setActivePlan(null);
            setHistoricalPlans([]);
            setLoading(false);
        }
    }, [isAuthenticated, activeStorageKey, historyStorageKey]);

    const createPlan = useCallback((capital: number, profitGoal: number, days: number) => {
        if (!activeStorageKey || !historyStorageKey) return;

        // Archive the current active plan if it exists
        if (activePlan) {
            const updatedHistory = [activePlan, ...historicalPlans];
            setHistoricalPlans(updatedHistory);
            localStorage.setItem(historyStorageKey, JSON.stringify(updatedHistory));
        }

        // Create the new plan
        const newPlan: MonthlyPlan = {
            id: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            startingCapital: capital,
            monthlyProfitGoal: profitGoal,
            tradingDays: days,
            dailyTargets: calculateCompoundingPlan(capital, profitGoal, days),
        };

        setActivePlan(newPlan);
        localStorage.setItem(activeStorageKey, JSON.stringify(newPlan));

    }, [activePlan, historicalPlans, activeStorageKey, historyStorageKey]);

    const toggleDayCompletion = useCallback((planId: string, day: number) => {
        if (activePlan && activePlan.id === planId && activeStorageKey) {
            const updatedTargets = activePlan.dailyTargets.map(target =>
                target.day === day ? { ...target, completed: !target.completed } : target
            );
            const updatedPlan = { ...activePlan, dailyTargets: updatedTargets };
            setActivePlan(updatedPlan);
            localStorage.setItem(activeStorageKey, JSON.stringify(updatedPlan));
        }
    }, [activePlan, activeStorageKey]);


    const value = { activePlan, historicalPlans, createPlan, toggleDayCompletion, loading };

    return (
        <MonthlyPlanContext.Provider value={value}>
            {children}
        </MonthlyPlanContext.Provider>
    );
};
