import React, { useState } from 'react';
import { useMonthlyPlan } from '../../hooks/useMonthlyPlan';
import { FormField } from '../common/FormField';

export const MonthlyPlanGenerator: React.FC = () => {
    const { createPlan } = useMonthlyPlan();
    const [capital, setCapital] = useState(10000);
    const [profitGoal, setProfitGoal] = useState(50);
    const [tradingDays, setTradingDays] = useState(20);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (capital <= 0) newErrors.capital = "Must be a positive number.";
        if (profitGoal <= 0) newErrors.profitGoal = "Must be a positive number.";
        if (tradingDays <= 0 || !Number.isInteger(tradingDays)) newErrors.tradingDays = "Must be a positive integer.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        createPlan(capital, profitGoal, tradingDays);
    };

    return (
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-cyan-400">📅 Generate Your Monthly Plan</h2>
                <p className="text-gray-400 mt-2">Define your goals to create a disciplined, compounding growth plan.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <FormField id="monthlyCapital" label="Starting Capital (₹)" error={errors.capital}>
                        <input type="number" value={capital} onChange={e => setCapital(parseFloat(e.target.value) || 0)} />
                    </FormField>
                    <FormField id="monthlyProfitGoal" label="Monthly Profit Goal (%)" error={errors.profitGoal}>
                        <input type="number" value={profitGoal} onChange={e => setProfitGoal(parseFloat(e.target.value) || 0)} />
                    </FormField>
                    <div className="md:col-span-2">
                        <FormField id="tradingDays" label="Number of Trading Days" error={errors.tradingDays}>
                            <input type="number" value={tradingDays} onChange={e => setTradingDays(parseInt(e.target.value, 10) || 0)} />
                        </FormField>
                    </div>
                </div>
                <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-md transition duration-300">
                    Generate My Plan
                </button>
            </form>
        </div>
    );
};
