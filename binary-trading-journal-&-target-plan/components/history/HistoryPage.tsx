import React, { useMemo, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Trade } from '../../types';
import { TradesTable } from '../journal/TradesTable';

interface DailyTrades {
    date: string;
    trades: Trade[];
    totalPL: number;
    winRate: number;
}

const getAllTradesForUser = (email: string): Record<string, Trade[]> => {
    const allTrades: Record<string, Trade[]> = {};
    const prefix = `tradingJournalTrades_${email}_`;

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
            try {
                const date = key.substring(prefix.length);
                const trades = JSON.parse(localStorage.getItem(key) || '[]');
                if (Array.isArray(trades) && trades.length > 0) {
                    allTrades[date] = trades;
                }
            } catch (e) {
                console.error(`Failed to parse trades for key ${key}`, e);
            }
        }
    }
    return allTrades;
};

const DailySummary: React.FC<{ summary: DailyTrades }> = ({ summary }) => {
    return (
        <div className="bg-gray-800 rounded-lg shadow-lg mb-6">
            <header className="bg-gray-900/50 p-4 rounded-t-lg flex justify-between items-center flex-wrap gap-4">
                <h3 className="text-xl font-bold text-cyan-400">
                     {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(summary.date))}
                </h3>
                 <div className="flex items-center gap-6 text-center">
                    <div>
                         <p className="text-sm text-gray-400">Win Rate</p>
                         <p className="font-bold text-white">{summary.winRate.toFixed(1)}%</p>
                    </div>
                    <div>
                         <p className="text-sm text-gray-400">Daily P/L</p>
                         <p className={`font-bold ${summary.totalPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                           {summary.totalPL >= 0 ? '+' : ''}₹{summary.totalPL.toFixed(2)}
                         </p>
                    </div>
                     <div>
                         <p className="text-sm text-gray-400">Trades</p>
                         <p className="font-bold text-white">{summary.trades.length}</p>
                    </div>
                 </div>
            </header>
            <TradesTable trades={summary.trades} />
        </div>
    );
};


export const HistoryPage: React.FC = () => {
    const { user } = useAuth();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const dailySummaries: DailyTrades[] = useMemo(() => {
        if (!user) return [];
        const allTradesByDate = getAllTradesForUser(user.email);
        
        return Object.entries(allTradesByDate)
            .filter(([date]) => {
                if (startDate && date < startDate) return false;
                if (endDate && date > endDate) return false;
                return true;
            })
            .map(([date, trades]) => {
                const totalPL = trades.reduce((acc, t) => acc + t.profitOrLoss, 0);
                const wins = trades.filter(t => t.result === 'Win').length;
                const winRate = trades.length > 0 ? (wins / trades.length) * 100 : 0;
                // Add timezone offset to date string to ensure correct date parsing
                return { date: `${date}T00:00:00`, trades, totalPL, winRate };
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    }, [user, startDate, endDate]);

    const handleExportPDF = () => {
        // jsPDF and autoTable are loaded from CDN on window
        const { jsPDF } = (window as any).jspdf;
        const doc = new jsPDF();
        
        const dataToExport = dailySummaries; // Export filtered data

        dataToExport.forEach((summary, index) => {
            if (index > 0) {
                doc.addPage();
            }

            const formattedDate = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(summary.date));
            const summaryLine1 = `Date: ${formattedDate}  |  Trades: ${summary.trades.length}`;
            const summaryLine2 = `Daily P/L: ₹${summary.totalPL.toFixed(2)}  |  Win Rate: ${summary.winRate.toFixed(1)}%`;
            
            doc.setFontSize(14);
            doc.setTextColor(40);
            doc.text(summaryLine1, 14, 20);

            doc.setFontSize(12);
            doc.setTextColor(100);
            doc.text(summaryLine2, 14, 28);

            const tableColumn = ["#", "Asset", "Investment (₹)", "Direction", "Concept", "Result", "P/L (₹)"];
            const tableRows = summary.trades.map((trade, idx) => [
                idx + 1,
                trade.asset,
                trade.investment.toFixed(2),
                trade.direction,
                trade.concept,
                trade.result,
                trade.profitOrLoss >= 0 ? `+${trade.profitOrLoss.toFixed(2)}` : trade.profitOrLoss.toFixed(2),
            ]);

            (doc as any).autoTable({
                head: [tableColumn],
                body: tableRows,
                startY: 35,
                theme: 'grid',
                headStyles: { fillColor: [22, 163, 175] }, // cyan color from app
                styles: { fontSize: 8 },
                columnStyles: {
                     2: { halign: 'right' },
                     6: { halign: 'right' }
                },
                didParseCell: function(data: any) {
                    if (data.cell.section === 'body') {
                         if (data.column.index === 6) { // P/L column
                            const value = parseFloat((data.cell.raw as string).replace('+', ''));
                            if (value > 0) data.cell.styles.textColor = [0, 128, 0];
                            else if (value < 0) data.cell.styles.textColor = [255, 0, 0];
                        }
                        if (data.column.index === 5) { // Result column
                            if (data.cell.raw === 'Win') data.cell.styles.textColor = [0, 128, 0];
                            else if (data.cell.raw === 'Loss') data.cell.styles.textColor = [255, 0, 0];
                        }
                    }
                }
            });
        });

        const dateStr = new Date().toISOString().split('T')[0];
        doc.save(`Trade_History_${dateStr}.pdf`);
    };

    const clearFilters = () => {
        setStartDate('');
        setEndDate('');
    }

    if (!user) return null;

    return (
        <div className="space-y-8">
             <div className="flex justify-between items-center flex-wrap gap-4">
                <h1 className="text-3xl font-bold text-white">Trade History</h1>
                <button
                    onClick={handleExportPDF}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
                >
                    Export to PDF
                </button>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg flex flex-col sm:flex-row items-center gap-4 flex-wrap">
                <p className="font-semibold text-gray-300 mr-2">Filter by date:</p>
                <div className="flex items-center gap-2">
                    <label htmlFor="startDate" className="text-sm text-gray-400">From:</label>
                    <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white" />
                </div>
                <div className="flex items-center gap-2">
                    <label htmlFor="endDate" className="text-sm text-gray-400">To:</label>
                    <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-gray-700 border border-gray-600 rounded-md p-2 text-white" />
                </div>
                <button onClick={clearFilters} className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-md transition text-sm ml-auto">Clear</button>
            </div>

            {dailySummaries.length === 0 ? (
                <div className="bg-gray-800 p-8 rounded-lg text-center shadow-lg max-w-md mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-2">No History Found</h2>
                    <p className="text-gray-400">No trades were found for the selected date range, or you haven't traded yet.</p>
                </div>
            ) : (
                dailySummaries.map(summary => (
                    <DailySummary key={summary.date} summary={summary} />
                ))
            )}
        </div>
    );
};