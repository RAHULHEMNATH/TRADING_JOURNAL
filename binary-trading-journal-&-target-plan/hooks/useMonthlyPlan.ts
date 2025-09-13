import { useContext } from 'react';
import { MonthlyPlanContext } from '../contexts/MonthlyPlanContext';

export const useMonthlyPlan = () => {
  const context = useContext(MonthlyPlanContext);
  if (context === undefined) {
    throw new Error('useMonthlyPlan must be used within a MonthlyPlanProvider');
  }
  return context;
};
