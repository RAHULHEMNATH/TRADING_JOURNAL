import React from 'react';

interface TradingLockMessageProps {
  status: 'profit' | 'loss';
}

export const TradingLockMessage: React.FC<TradingLockMessageProps> = ({ status }) => {
  const isProfit = status === 'profit';
  const config = {
    bgColor: isProfit ? 'bg-green-500/20' : 'bg-red-500/20',
    borderColor: isProfit ? 'border-green-500' : 'border-red-500',
    textColor: isProfit ? 'text-green-300' : 'text-red-300',
    icon: isProfit ? '🎉' : '⚠️',
    title: isProfit ? 'Congratulations! Target Achieved!' : 'Stop Loss Hit',
    message: 'Trading is locked for the remainder of the day to protect your capital.'
  };

  return (
    <div className={`p-4 rounded-lg border-l-4 ${config.borderColor} ${config.bgColor}`}>
      <div className="flex">
        <div className="py-1">
          <span className="text-2xl">{config.icon}</span>
        </div>
        <div className="ml-3">
          <p className={`font-bold text-lg ${config.textColor}`}>{config.title}</p>
          <p className="text-sm text-gray-300">{config.message}</p>
        </div>
      </div>
    </div>
  );
};