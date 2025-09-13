import React, { useMemo } from 'react';
import { usePlan } from '../../hooks/usePlan';
import { useJournal } from '../../hooks/useJournal';
import { useDate } from '../../hooks/useDate';
import { PlanGenerator } from '../plan/PlanGenerator';
import { PlanDisplay } from '../plan/PlanDisplay';
import { DashboardStats } from './DashboardStats';
import { TradeForm } from '../journal/TradeForm';
import { TradesTable } from '../journal/TradesTable';
import { TradingLockMessage } from './TradingLockMessage';


const DashboardPage: React.FC = () => {
  const { plan, calculatedPlan, clearPlan, loading: planLoading } = usePlan();
  const { trades, loading: journalLoading } = useJournal();
  const { isToday } = useDate();

  const totalPL = useMemo(() => trades.reduce((acc, trade) => acc + trade.profitOrLoss, 0), [trades]);

  const lockStatus: 'profit' | 'loss' | null = useMemo(() => {
    if (!calculatedPlan) return null;
    if (totalPL >= calculatedPlan.profitTargetAmount) return 'profit';
    if (totalPL <= -calculatedPlan.stopLossAmount) return 'loss';
    return null;
  }, [totalPL, calculatedPlan]);

  if (planLoading || journalLoading) {
     return (
        <div className="text-center p-10">
            <div className="text-white text-lg animate-pulse">Loading daily setup...</div>
        </div>
     )
  }

  if (!plan || !calculatedPlan) {
    return <PlanGenerator />;
  }
  
  const isTradingLocked = !!lockStatus || !isToday;

  return (
    <div className="space-y-6">
      <PlanDisplay plan={plan} calculatedPlan={calculatedPlan} onReset={clearPlan} />
      {lockStatus && <TradingLockMessage status={lockStatus} />}
      <DashboardStats calculatedPlan={calculatedPlan} trades={trades} totalPL={totalPL} />
      <TradeForm 
        isLocked={isTradingLocked}
        isToday={isToday}
      />
      <TradesTable trades={trades} />
    </div>
  );
};

export default DashboardPage;