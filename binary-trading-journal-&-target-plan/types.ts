export interface User {
  email: string;
}

export interface TradingPlan {
  initialCapital: number;
  dailyProfitTarget: number; // as percentage
  stopLoss: number; // as percentage
  riskPerTrade: number; // as percentage
}

export interface CalculatedPlan {
  investmentPerTrade: number;
  maxTrades: number;
  profitTargetAmount: number;
  stopLossAmount: number;
}

export type TradeDirection = 'Up' | 'Down';
export type TradeResult = 'Win' | 'Loss';

export interface Trade {
  id: string;
  asset: string;
  investment: number;
  // Entry and Expiry are kept for future use, but not in the simple form
  entry: number; 
  expiry: number;
  direction: TradeDirection;
  timing: string;
  concept: string;
  result: TradeResult;
  profitOrLoss: number;
}

export interface DailyPlanTarget {
  day: number;
  date: string;
  startingCapital: number;
  targetProfit: number;
  endingCapital: number;
  completed: boolean;
}

export interface MonthlyPlan {
  id: string;
  createdAt: string;
  startingCapital: number;
  monthlyProfitGoal: number; // percentage
  tradingDays: number;
  dailyTargets: DailyPlanTarget[];
}


export type Page = 'DASHBOARD' | 'HISTORY' | 'MONTHLY_PLAN';