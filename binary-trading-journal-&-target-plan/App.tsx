import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { AuthPage } from './components/auth/AuthPage';
import DashboardPage from './components/dashboard/DashboardPage';
import MainLayout from './components/layout/MainLayout';
import { PlanProvider } from './contexts/PlanContext';
import { JournalProvider } from './contexts/JournalContext';
import { DateProvider } from './contexts/DateContext';
import { HistoryPage } from './components/history/HistoryPage';
import { MonthlyPlanProvider } from './contexts/MonthlyPlanContext';
import { MonthlyPlanPage } from './components/monthly-plan/MonthlyPlanPage';
import { Page } from './types';

const AppContent: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('DASHBOARD');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Loading Journal...</div>
      </div>
    );
  }

  return isAuthenticated ? (
    <MainLayout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {currentPage === 'DASHBOARD' && <DashboardPage />}
      {currentPage === 'HISTORY' && <HistoryPage />}
      {currentPage === 'MONTHLY_PLAN' && <MonthlyPlanPage />}
    </MainLayout>
  ) : (
    <AuthPage />
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DateProvider>
        <PlanProvider>
          <JournalProvider>
            <MonthlyPlanProvider>
              <AppContent />
            </MonthlyPlanProvider>
          </JournalProvider>
        </PlanProvider>
      </DateProvider>
    </AuthProvider>
  );
};

export default App;