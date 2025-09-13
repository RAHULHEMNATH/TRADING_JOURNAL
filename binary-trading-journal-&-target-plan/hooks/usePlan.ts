import { useContext } from 'react';
import { PlanContext } from '../contexts/PlanContext';

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
};
