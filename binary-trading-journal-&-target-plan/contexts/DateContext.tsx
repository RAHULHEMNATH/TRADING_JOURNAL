import React, { createContext, useState, ReactNode, useCallback } from 'react';

interface DateContextType {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  goToPreviousDay: () => void;
  goToNextDay: () => void;
  isToday: boolean;
}

export const DateContext = createContext<DateContextType | undefined>(undefined);

// Helper to get date as YYYY-MM-DD string
export const toDateString = (date: Date) => date.toISOString().split('T')[0];

// Helper to check if a date is today
const isSameDay = (d1: Date, d2: Date) => toDateString(d1) === toDateString(d2);


export const DateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const goToPreviousDay = useCallback(() => {
    setSelectedDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  }, []);

  const goToNextDay = useCallback(() => {
    setSelectedDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + 1);
      // Prevent navigating to the future
      if (newDate > new Date()) {
        return prevDate;
      }
      return newDate;
    });
  }, []);

  const value = {
    selectedDate,
    setSelectedDate,
    goToPreviousDay,
    goToNextDay,
    isToday: isSameDay(selectedDate, new Date()),
  };

  return <DateContext.Provider value={value}>{children}</DateContext.Provider>;
};