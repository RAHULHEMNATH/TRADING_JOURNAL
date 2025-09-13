import React, { useState } from 'react';
import { useJournal } from '../../hooks/useJournal';
import { TradeDirection, TradeResult } from '../../types';
import { FormField } from '../common/FormField';

interface TradeFormProps {
    isLocked: boolean;
    isToday: boolean;
}

const TIMING_OPTIONS = ['1 Min', '3 Mins', '5 Mins', '15 Mins'];

export const TradeForm: React.FC<TradeFormProps> = ({ isLocked, isToday }) => {
  const { addTrade } = useJournal();
  
  const [asset, setAsset] = useState('');
  const [investment, setInvestment] = useState('');
  const [profitOrLoss, setProfitOrLoss] = useState('');
  const [direction, setDirection] = useState<TradeDirection>('Up');
  const [timing, setTiming] = useState(TIMING_OPTIONS[0]);
  const [concept, setConcept] = useState('');
  const [result, setResult] = useState<TradeResult>('Win');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!asset.trim()) newErrors.asset = "Asset is required.";
    if (!investment || parseFloat(investment) <= 0) newErrors.investment = "Must be a positive number.";
    if (!profitOrLoss) newErrors.profitOrLoss = "Profit/Loss is required.";
    else if (parseFloat(profitOrLoss) <= 0) newErrors.profitOrLoss = "Must be a positive number.";
    if (!concept.trim()) newErrors.concept = "Concept is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked || !isToday || !validate()) return;

    const profitValue = result === 'Win' 
        ? Math.abs(parseFloat(profitOrLoss))
        : -Math.abs(parseFloat(profitOrLoss));

    addTrade({
      asset,
      investment: parseFloat(investment),
      entry: 0, // Dummy value for now
      expiry: 0, // Dummy value for now
      direction,
      timing,
      concept,
      result,
      profitOrLoss: profitValue
    });
    
    // Reset form fields
    setAsset('');
    setInvestment('');
    setProfitOrLoss('');
    setDirection('Up');
    setTiming(TIMING_OPTIONS[0]);
    setConcept('');
    setResult('Win');
    setErrors({});
  };
  
  const isDisabled = isLocked || !isToday;
  
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg relative">
       {isDisabled && (
         <div className="absolute inset-0 bg-gray-800/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
            {!isToday && <p className="text-white font-semibold">You can only log trades for the current day.</p>}
         </div>
       )}
      <h3 className="text-xl font-bold text-white mb-6">Log New Trade</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField id="asset" label="Asset" error={errors.asset}>
              <input type="text" value={asset} onChange={e => setAsset(e.target.value)} placeholder="e.g., EUR/USD" disabled={isDisabled} />
            </FormField>
            <FormField id="investment" label="Investment (₹)" error={errors.investment}>
              <input type="number" value={investment} onChange={e => setInvestment(e.target.value)} placeholder="e.g., 1000" disabled={isDisabled} />
            </FormField>
            <FormField id="profitOrLoss" label="Profit/Loss (₹)" error={errors.profitOrLoss}>
              <input type="number" value={profitOrLoss} onChange={e => setProfitOrLoss(e.target.value)} placeholder="e.g., 850" disabled={isDisabled} />
            </FormField>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField id="direction" label="Direction">
                <select value={direction} onChange={e => setDirection(e.target.value as TradeDirection)} disabled={isDisabled}>
                    <option>Up</option>
                    <option>Down</option>
                </select>
            </FormField>
            <FormField id="timing" label="Timing">
                <select value={timing} onChange={e => setTiming(e.target.value)} disabled={isDisabled}>
                    {TIMING_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
                </select>
            </FormField>
            <FormField id="result" label="Result">
                  <select value={result} onChange={e => setResult(e.target.value as TradeResult)} disabled={isDisabled}>
                      <option>Win</option>
                      <option>Loss</option>
                  </select>
            </FormField>
        </div>
        <div>
            <FormField id="concept" label="Which Concept" error={errors.concept}>
              <input type="text" value={concept} onChange={e => setConcept(e.target.value)} placeholder="e.g., Support bounce, RSI divergence" disabled={isDisabled} />
            </FormField>
        </div>
         <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed" disabled={isDisabled}>
            Add Trade
        </button>
      </form>
    </div>
  );
};