import React, { useState } from 'react';
import { usePlan } from '../../hooks/usePlan';
import { TradingPlan } from '../../types';
import { FormField } from '../common/FormField';

export const PlanGenerator: React.FC = () => {
  const [initialCapital, setInitialCapital] = useState(10000);
  const [dailyProfitTarget, setDailyProfitTarget] = useState(5);
  const [stopLoss, setStopLoss] = useState(10);
  const [riskPerTrade, setRiskPerTrade] = useState(2);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { createPlan } = usePlan();

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (initialCapital <= 0) newErrors.initialCapital = "Value must be positive.";
    if (dailyProfitTarget <= 0) newErrors.dailyProfitTarget = "Value must be positive.";
    if (stopLoss <= 0) newErrors.stopLoss = "Value must be positive.";
    if (riskPerTrade <= 0) newErrors.riskPerTrade = "Value must be positive.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newPlan: TradingPlan = {
      initialCapital: parseFloat(initialCapital.toString()),
      dailyProfitTarget: parseFloat(dailyProfitTarget.toString()),
      stopLoss: parseFloat(stopLoss.toString()),
      riskPerTrade: parseFloat(riskPerTrade.toString()),
    };
    createPlan(newPlan);
  };
  
  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-cyan-400">Create Your Daily Plan</h2>
        <p className="text-gray-400 mt-2">Set your parameters to generate a disciplined trading plan for today.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {Object.keys(errors).length > 0 && <p className="bg-red-500/20 text-red-400 p-3 rounded-md text-sm text-center">Please correct the errors below.</p>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField id="initialCapital" label="Initial Capital (₹)" error={errors.initialCapital}>
            <input type="number" value={initialCapital} onChange={e => setInitialCapital(parseFloat(e.target.value) || 0)} required />
          </FormField>
          <FormField id="dailyProfitTarget" label="Daily Profit Target (%)" error={errors.dailyProfitTarget}>
            <input type="number" value={dailyProfitTarget} onChange={e => setDailyProfitTarget(parseFloat(e.target.value) || 0)} required />
          </FormField>
          <FormField id="stopLoss" label="Stop Loss (%)" error={errors.stopLoss}>
            <input type="number" value={stopLoss} onChange={e => setStopLoss(parseFloat(e.target.value) || 0)} required />
          </FormField>
          <FormField id="riskPerTrade" label="Risk per Trade (%)" error={errors.riskPerTrade}>
            <input type="number" value={riskPerTrade} onChange={e => setRiskPerTrade(parseFloat(e.target.value) || 0)} required />
          </FormField>
        </div>
        
        <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-md transition duration-300">
          Generate Plan
        </button>
      </form>
    </div>
  );
};