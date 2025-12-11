import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface DayProgress {
  completed: boolean;
  completedTasks: string[];
  mood?: string;
  diaryEntry?: string;
  completedAt?: string;
}

interface UserProgress {
  currentDay: number;
  daysProgress: Record<number, DayProgress>;
  startedAt: string;
  userName: string;
}

interface UserProgressContextType {
  progress: UserProgress;
  updateDayProgress: (dayId: number, updates: Partial<DayProgress>) => void;
  toggleTask: (dayId: number, taskId: string) => void;
  completeDay: (dayId: number) => void;
  setUserName: (name: string) => void;
  getCompletedDaysCount: () => number;
  getProgressPercentage: () => number;
  canAccessDay: (dayId: number) => boolean;
  resetProgress: () => void;
}

const defaultProgress: UserProgress = {
  currentDay: 1,
  daysProgress: {},
  startedAt: new Date().toISOString(),
  userName: 'Participante',
};

const UserProgressContext = createContext<UserProgressContextType | undefined>(undefined);

export const UserProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('fire-challenge-progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultProgress;
      }
    }
    return defaultProgress;
  });

  useEffect(() => {
    localStorage.setItem('fire-challenge-progress', JSON.stringify(progress));
  }, [progress]);

  const updateDayProgress = (dayId: number, updates: Partial<DayProgress>) => {
    setProgress(prev => ({
      ...prev,
      daysProgress: {
        ...prev.daysProgress,
        [dayId]: {
          ...prev.daysProgress[dayId],
          completed: prev.daysProgress[dayId]?.completed || false,
          completedTasks: prev.daysProgress[dayId]?.completedTasks || [],
          ...updates,
        },
      },
    }));
  };

  const toggleTask = (dayId: number, taskId: string) => {
    setProgress(prev => {
      const dayProgress = prev.daysProgress[dayId] || { completed: false, completedTasks: [] };
      const completedTasks = dayProgress.completedTasks.includes(taskId)
        ? dayProgress.completedTasks.filter(id => id !== taskId)
        : [...dayProgress.completedTasks, taskId];
      
      return {
        ...prev,
        daysProgress: {
          ...prev.daysProgress,
          [dayId]: {
            ...dayProgress,
            completedTasks,
          },
        },
      };
    });
  };

  const completeDay = (dayId: number) => {
    setProgress(prev => ({
      ...prev,
      currentDay: Math.max(prev.currentDay, dayId + 1),
      daysProgress: {
        ...prev.daysProgress,
        [dayId]: {
          ...prev.daysProgress[dayId],
          completed: true,
          completedAt: new Date().toISOString(),
          completedTasks: prev.daysProgress[dayId]?.completedTasks || [],
        },
      },
    }));
  };

  const setUserName = (name: string) => {
    setProgress(prev => ({ ...prev, userName: name }));
  };

  const getCompletedDaysCount = () => {
    return Object.values(progress.daysProgress).filter(d => d.completed).length;
  };

  const getProgressPercentage = () => {
    return Math.round((getCompletedDaysCount() / 15) * 100);
  };

  const canAccessDay = (dayId: number) => {
    if (dayId === 1) return true;
    return progress.daysProgress[dayId - 1]?.completed || dayId <= progress.currentDay;
  };

  const resetProgress = () => {
    setProgress(defaultProgress);
    localStorage.removeItem('fire-challenge-progress');
  };

  return (
    <UserProgressContext.Provider
      value={{
        progress,
        updateDayProgress,
        toggleTask,
        completeDay,
        setUserName,
        getCompletedDaysCount,
        getProgressPercentage,
        canAccessDay,
        resetProgress,
      }}
    >
      {children}
    </UserProgressContext.Provider>
  );
};

export const useUserProgress = () => {
  const context = useContext(UserProgressContext);
  if (!context) {
    throw new Error('useUserProgress must be used within a UserProgressProvider');
  }
  return context;
};
