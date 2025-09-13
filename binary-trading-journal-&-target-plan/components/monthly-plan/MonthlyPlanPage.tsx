import React from 'react';
import { useMonthlyPlan } from '../../hooks/useMonthlyPlan';
import { MonthlyPlanGenerator } from './MonthlyPlanGenerator';
import { MonthlyPlanDisplay } from './MonthlyPlanDisplay';

export const MonthlyPlanPage: React.FC = () => {
    const { activePlan, historicalPlans, createPlan, loading } = useMonthlyPlan();

    if (loading) {
        return (
            <div className="text-center p-10">
                <div className="text-white text-lg animate-pulse">Loading monthly plan...</div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {activePlan ? (
                <MonthlyPlanDisplay 
                    activePlan={activePlan} 
                    historicalPlans={historicalPlans} 
                    onGenerateNew={() => createPlan(0,0,0)} // This will be handled inside Display to show Generator
                />
            ) : (
                <MonthlyPlanGenerator />
            )}
        </div>
    );
};