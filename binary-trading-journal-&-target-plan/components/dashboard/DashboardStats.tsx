import React from 'react';
import { CalculatedPlan, Trade } from '../../types';

interface DashboardStatsProps {
    calculatedPlan: CalculatedPlan;
    trades: Trade[];
    totalPL: number;
}

const ProgressBar: React.FC<{ value: number; color: string }> = ({ value, color }) => {
    const clampedValue = Math.max(0, Math.min(100, value));
    return (
        <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div className={`${color} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${clampedValue}%` }}></div>
        </div>
    );
};


export const DashboardStats: React.FC<DashboardStatsProps> = ({ calculatedPlan, trades, totalPL }) => {
    const wins = trades.filter(t => t.result === 'Win').length;
    const winRate = trades.length > 0 ? (wins / trades.length) * 100 : 0;
    
    const progressToTarget = calculatedPlan.profitTargetAmount > 0 ? (totalPL / calculatedPlan.profitTargetAmount) * 100 : 0;
    const progressToStopLoss = calculatedPlan.stopLossAmount > 0 && totalPL < 0 ? (Math.abs(totalPL) / calculatedPlan.stopLossAmount) * 100 : 0;

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-white mb-4">Daily Progress</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-700 p-4 rounded-lg flex flex-col justify-center">
                    <div className="flex justify-between items-center text-sm mb-1 text-gray-400">
                        <span>Today's P/L</span>
                        <span className={`font-bold ${totalPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {totalPL >= 0 ? '+' : ''}₹{totalPL.toFixed(2)}
                        </span>
                    </div>
                    <ProgressBar value={totalPL >= 0 ? progressToTarget : progressToStopLoss} color={totalPL >= 0 ? 'bg-green-500' : 'bg-red-500'}/>
                     <div className="flex justify-between items-center text-xs mt-1 text-gray-500">
                        <span>{totalPL < 0 ? `-₹${calculatedPlan.stopLossAmount.toFixed(2)}` : '₹0'}</span>
                        <span>{totalPL >= 0 ? `+₹${calculatedPlan.profitTargetAmount.toFixed(2)}` : '₹0'}</span>
                    </div>
                </div>
                 <div className="bg-gray-700 p-4 rounded-lg text-center flex flex-col justify-center">
                    <p className="text-sm text-gray-400">Win Rate</p>
                    <p className="text-2xl font-bold text-white">{winRate.toFixed(1)}%</p>
                    <p className="text-xs text-gray-500">{wins}W / {trades.length - wins}L</p>
                </div>
                 <div className="bg-gray-700 p-4 rounded-lg text-center flex flex-col justify-center">
                    <p className="text-sm text-gray-400">Trades Taken</p>
                    <p className="text-2xl font-bold text-white">{trades.length} <span className="text-base font-normal text-gray-400">/ {calculatedPlan.maxTrades}</span></p>
                     <p className="text-xs text-gray-500">Max before stop loss</p>
                </div>
            </div>
        </div>
    );
};