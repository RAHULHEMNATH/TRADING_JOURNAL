import React, { useState, useRef } from 'react';
import { MonthlyPlan } from '../../types';
import { useMonthlyPlan } from '../../hooks/useMonthlyPlan';
import { MonthlyPlanGenerator } from './MonthlyPlanGenerator';

// These functions will be available on the window object from the CDN scripts
declare const htmlToImage: any;
declare const jspdf: any;
declare const XLSX: any;

interface MonthlyPlanDisplayProps {
    activePlan: MonthlyPlan;
    historicalPlans: MonthlyPlan[];
    onGenerateNew: () => void;
}

export const MonthlyPlanDisplay: React.FC<MonthlyPlanDisplayProps> = ({ activePlan }) => {
    const { toggleDayCompletion } = useMonthlyPlan();
    const [showGenerator, setShowGenerator] = useState(false);
    const planRef = useRef<HTMLDivElement>(null);

    const handleExport = async (format: 'jpeg' | 'png' | 'pdf' | 'xlsx') => {
        if (!planRef.current) return;
        
        const planElement = planRef.current;
        const title = `Monthly_Plan_${new Date().toISOString().split('T')[0]}`;

        switch(format) {
            case 'jpeg':
                htmlToImage.toJpeg(planElement, { quality: 0.95, backgroundColor: '#111827' })
                    .then((dataUrl: string) => {
                        const link = document.createElement('a');
                        link.download = `${title}.jpeg`;
                        link.href = dataUrl;
                        link.click();
                    });
                break;
            case 'png':
                 htmlToImage.toPng(planElement, { backgroundColor: '#111827' })
                    .then((dataUrl: string) => {
                        const link = document.createElement('a');
                        link.download = `${title}.png`;
                        link.href = dataUrl;
                        link.click();
                    });
                break;
            case 'pdf':
                const { jsPDF } = jspdf;
                const doc = new jsPDF('p', 'mm', 'a4');
                htmlToImage.toPng(planElement, { backgroundColor: '#1f2937' })
                    .then((dataUrl: string) => {
                        const imgProps= doc.getImageProperties(dataUrl);
                        const pdfWidth = doc.internal.pageSize.getWidth();
                        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                        doc.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
                        doc.save(`${title}.pdf`);
                    });
                break;
            case 'xlsx':
                 const tableData = activePlan.dailyTargets.map(d => ({
                    'Day': d.day,
                    'Starting Capital (₹)': d.startingCapital.toFixed(2),
                    'Target Profit (₹)': d.targetProfit.toFixed(2),
                    'Ending Capital (₹)': d.endingCapital.toFixed(2),
                    'Completed': d.completed ? 'Yes' : 'No'
                 }));
                 const worksheet = XLSX.utils.json_to_sheet(tableData);
                 const workbook = XLSX.utils.book_new();
                 XLSX.utils.book_append_sheet(workbook, worksheet, "Monthly Plan");
                 XLSX.writeFile(workbook, `${title}.xlsx`);
                break;
        }
    };
    
    if (showGenerator) {
        return <MonthlyPlanGenerator />;
    }

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
             <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
                <h2 className="text-2xl font-bold text-cyan-400">📅 Active Monthly Plan</h2>
                <button onClick={() => setShowGenerator(true)} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition">
                    Generate New Plan
                </button>
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
                <button onClick={() => handleExport('jpeg')} className="bg-gray-600 text-sm hover:bg-gray-500 text-white font-semibold py-1 px-3 rounded-md transition">Export JPEG</button>
                <button onClick={() => handleExport('png')} className="bg-gray-600 text-sm hover:bg-gray-500 text-white font-semibold py-1 px-3 rounded-md transition">Export PNG</button>
                <button onClick={() => handleExport('pdf')} className="bg-gray-600 text-sm hover:bg-gray-500 text-white font-semibold py-1 px-3 rounded-md transition">Export PDF</button>
                <button onClick={() => handleExport('xlsx')} className="bg-gray-600 text-sm hover:bg-gray-500 text-white font-semibold py-1 px-3 rounded-md transition">Export XLSX</button>
            </div>
            
            <div ref={planRef} className="bg-gray-900 p-4 rounded-lg">
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="p-3 font-semibold text-gray-300 tracking-wider">Day</th>
                                <th className="p-3 font-semibold text-gray-300 tracking-wider text-right">Start Capital (₹)</th>
                                <th className="p-3 font-semibold text-gray-300 tracking-wider text-right">Target Profit (₹)</th>
                                <th className="p-3 font-semibold text-gray-300 tracking-wider text-right">End Capital (₹)</th>
                                <th className="p-3 font-semibold text-gray-300 tracking-wider text-center">Completed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activePlan.dailyTargets.map(day => (
                                <tr key={day.day} className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700/50 transition-colors">
                                    <td className="p-3 font-medium">{day.day}</td>
                                    <td className="p-3 font-mono text-right">{day.startingCapital.toFixed(2)}</td>
                                    <td className="p-3 font-mono text-right text-green-400">+{day.targetProfit.toFixed(2)}</td>
                                    <td className="p-3 font-mono text-right font-semibold">{day.endingCapital.toFixed(2)}</td>
                                    <td className="p-3 text-center">
                                        <input 
                                            type="checkbox" 
                                            checked={day.completed} 
                                            onChange={() => toggleDayCompletion(activePlan.id, day.day)}
                                            className="w-5 h-5 bg-gray-600 border-gray-500 rounded text-cyan-500 focus:ring-cyan-600"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
