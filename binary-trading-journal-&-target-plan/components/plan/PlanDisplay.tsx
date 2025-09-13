import React, { useState } from 'react';
import { TradingPlan, CalculatedPlan } from '../../types';
import { Modal } from '../common/Modal';

interface PlanDisplayProps {
  plan: TradingPlan;
  calculatedPlan: CalculatedPlan;
  onReset: () => void;
}

const StatCard: React.FC<{ label: string; value: string; valueClassName?: string }> = ({ label, value, valueClassName }) => (
    <div className='bg-gray-700 p-4 rounded-lg text-center'>
        <p className="text-sm text-gray-400">{label}</p>
        <p className={`text-xl lg:text-2xl font-bold text-white ${valueClassName}`}>{value}</p>
    </div>
);

export const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan, calculatedPlan, onReset }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleConfirmReset = () => {
        onReset();
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-cyan-400">Today's Trading Plan</h3>
                    <button onClick={() => setIsModalOpen(true)} className="text-sm bg-gray-600 hover:bg-gray-500 text-white font-semibold py-1 px-3 rounded-md transition">
                        Reset Plan
                    </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard label="Capital" value={`₹${plan.initialCapital.toLocaleString()}`} />
                    <StatCard label="Profit Target" value={`₹${calculatedPlan.profitTargetAmount.toFixed(2)}`} valueClassName="text-green-400" />
                    <StatCard label="Stop Loss" value={`-₹${calculatedPlan.stopLossAmount.toFixed(2)}`} valueClassName="text-red-400" />
                    <StatCard label="Max Trades" value={calculatedPlan.maxTrades.toString()} />
                </div>
                <div className="mt-4 text-center bg-gray-700/50 p-3 rounded-md">
                    <p className="text-gray-300">
                        Investment per Trade (suggestion): <span className="font-bold text-white">₹{calculatedPlan.investmentPerTrade.toFixed(2)}</span> (Risking {plan.riskPerTrade}% of capital)
                    </p>
                </div>
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Confirm Plan Reset"
                footer={
                    <>
                        <button 
                            onClick={() => setIsModalOpen(false)} 
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-md transition"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleConfirmReset} 
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition"
                        >
                            Confirm Reset
                        </button>
                    </>
                }
            >
                <p className="text-gray-300">
                    Are you sure you want to reset your trading plan for today? This action cannot be undone.
                </p>
            </Modal>
        </>
    );
};
