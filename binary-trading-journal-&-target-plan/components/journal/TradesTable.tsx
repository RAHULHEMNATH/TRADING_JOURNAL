import React from 'react';
import { Trade } from '../../types';

interface TradesTableProps {
  trades: Trade[];
}

export const TradesTable: React.FC<TradesTableProps> = ({ trades }) => {
  if (trades.length === 0) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg text-center shadow-lg">
        <h3 className="text-xl font-bold text-white mb-2">Today's Journal</h3>
        <p className="text-gray-400">Log your first trade using the form above.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <h3 className="text-xl font-bold text-white p-4 bg-gray-900/50">Today's Journal</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-3 font-semibold text-gray-300 tracking-wider">Asset</th>
              <th className="p-3 font-semibold text-gray-300 tracking-wider">Investment (₹)</th>
              <th className="p-3 font-semibold text-gray-300 tracking-wider">Direction</th>
              <th className="p-3 font-semibold text-gray-300 tracking-wider hidden lg:table-cell">Timing</th>
              <th className="p-3 font-semibold text-gray-300 tracking-wider hidden md:table-cell">Concept</th>
              <th className="p-3 font-semibold text-gray-300 tracking-wider">Result</th>
              <th className="p-3 font-semibold text-gray-300 tracking-wider text-right">P/L (₹)</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr key={trade.id} className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700/50 transition-colors">
                <td className="p-3 font-medium">{trade.asset}</td>
                <td className="p-3 font-mono">{trade.investment.toFixed(2)}</td>
                <td className="p-3">
                    <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                        trade.direction === 'Up' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                    }`}>
                        {trade.direction.toUpperCase()}
                    </span>
                </td>
                <td className="p-3 hidden lg:table-cell">{trade.timing}</td>
                <td className="p-3 max-w-[200px] truncate hidden md:table-cell" title={trade.concept}>{trade.concept}</td>
                <td className="p-3">
                     <span className={`font-semibold ${
                        trade.result === 'Win' ? 'text-green-400' : 'text-red-400'
                    }`}>
                        {trade.result}
                    </span>
                </td>
                <td className={`p-3 text-right font-mono font-semibold ${
                    trade.profitOrLoss >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                    {trade.profitOrLoss >= 0 ? '+' : ''}{trade.profitOrLoss.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};