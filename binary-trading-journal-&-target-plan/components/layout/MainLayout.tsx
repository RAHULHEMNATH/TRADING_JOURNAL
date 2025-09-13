import React from 'react';
import { useDate } from '../../hooks/useDate';
import { Page } from '../../types';
import Navbar from './Navbar';

interface MainLayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const DateNavigator: React.FC = () => {
    const { selectedDate, goToPreviousDay, goToNextDay, isToday } = useDate();

    const formattedDate = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(selectedDate);

    return (
        <div className="flex items-center gap-4 bg-gray-800/50 p-2 rounded-lg">
            <button onClick={goToPreviousDay} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md transition text-lg">‹</button>
            <div className="text-center w-40">
                 <span className="font-semibold text-white">{isToday ? "Today" : formattedDate}</span>
            </div>
            <button onClick={goToNextDay} disabled={isToday} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md transition text-lg disabled:opacity-50 disabled:cursor-not-allowed">›</button>
        </div>
    )
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, currentPage, setCurrentPage }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      <main className="container mx-auto p-4 sm:p-6">
        {(currentPage === 'DASHBOARD' || currentPage === 'HISTORY') && (
            <div className="flex justify-center mb-6">
                <DateNavigator />
            </div>
        )}
        {children}
      </main>
    </div>
  );
};

export default MainLayout;