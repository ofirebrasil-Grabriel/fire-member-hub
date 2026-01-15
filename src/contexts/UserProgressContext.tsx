/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Json } from '@/integrations/supabase/types';

interface DayProgress {
  completed: boolean;
  completedTasks: string[];
  mood?: string;
  diaryEntry?: string;
  completedAt?: string;
  form_data?: Record<string, unknown>;
  rewardClaimed?: boolean;
  rewardTimestamp?: string;
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
  completeDay: (dayId: number, form_data?: Record<string, unknown>) => void;
  claimReward: (dayId: number) => Promise<void>;
  setUserName: (name: string) => void;
  getCompletedDaysCount: () => number;
  getProgressPercentage: () => number;
  canAccessDay: (dayId: number) => boolean;
  isRewardClaimed: (dayId: number) => boolean;
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
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);

  useEffect(() => {
    if (!user?.id) {
      setProgress(defaultProgress);
      return;
    }

    let isActive = true;

    const loadProgress = async () => {
      const [profileResult, progressResult] = await Promise.all([
        supabase
          .from('profiles')
          .select('full_name, created_at')
          .eq('id', user.id)
          .maybeSingle(),
        supabase
          .from('day_progress')
          .select('*')
          .eq('user_id', user.id),
      ]);

      if (!isActive) return;

      const profile = profileResult.data;
      const rows = progressResult.data || [];

      const daysProgress = rows.reduce<Record<number, DayProgress>>((acc, row) => {
        acc[row.day_id] = {
          completed: row.completed ?? false,
          completedTasks: row.completed_tasks || [],
          mood: row.mood || undefined,
          diaryEntry: row.diary_entry || undefined,
          completedAt: row.completed_at || undefined,
          form_data: (row.form_data as Record<string, unknown>) || {},
          rewardClaimed: row.reward_claimed ?? false,
          rewardTimestamp: row.reward_timestamp || undefined,
        };
        return acc;
      }, {});

      const completedDayIds = rows.filter((row) => row.completed).map((row) => row.day_id);
      const maxCompleted = completedDayIds.length ? Math.max(...completedDayIds) : 0;
      const currentDay = Math.min(Math.max(1, maxCompleted + 1), 15);

      setProgress({
        currentDay,
        daysProgress,
        startedAt: profile?.created_at || new Date().toISOString(),
        userName: profile?.full_name || 'Participante',
      });
    };

    loadProgress();

    return () => {
      isActive = false;
    };
  }, [user?.id]);

  const syncDayProgress = async (dayId: number, dayProgress: DayProgress) => {
    if (!user?.id) return;
    const { error } = await supabase.from('day_progress').upsert(
      {
        user_id: user.id,
        day_id: dayId,
        completed: dayProgress.completed,
        completed_tasks: dayProgress.completedTasks || [],
        mood: dayProgress.mood ?? null,
        diary_entry: dayProgress.diaryEntry ?? null,
        completed_at: dayProgress.completedAt ?? null,
        form_data: (dayProgress.form_data ?? {}) as Json,
        reward_claimed: dayProgress.rewardClaimed ?? false,
        reward_timestamp: dayProgress.rewardTimestamp ?? null,
      },
      { onConflict: 'user_id,day_id' }
    );

    if (error) {
      console.error('Erro ao sincronizar progresso:', error.message);
    }
  };

  const updateDayProgress = (dayId: number, updates: Partial<DayProgress>) => {
    setProgress((prev) => {
      const current = prev.daysProgress[dayId] || {
        completed: false,
        completedTasks: [],
        form_data: {},
      };

      const nextDayProgress: DayProgress = {
        ...current,
        ...updates,
        completedTasks: updates.completedTasks ?? current.completedTasks ?? [],
        form_data: updates.form_data ?? current.form_data ?? {},
      };

      const nextProgress = {
        ...prev,
        daysProgress: {
          ...prev.daysProgress,
          [dayId]: nextDayProgress,
        },
      };

      void syncDayProgress(dayId, nextDayProgress);
      return nextProgress;
    });
  };

  const toggleTask = (dayId: number, taskId: string) => {
    setProgress((prev) => {
      const current = prev.daysProgress[dayId] || { completed: false, completedTasks: [], form_data: {} };
      const completedTasks = current.completedTasks.includes(taskId)
        ? current.completedTasks.filter((id) => id !== taskId)
        : [...current.completedTasks, taskId];

      const nextDayProgress = {
        ...current,
        completedTasks,
      };

      const nextProgress = {
        ...prev,
        daysProgress: {
          ...prev.daysProgress,
          [dayId]: nextDayProgress,
        },
      };

      void syncDayProgress(dayId, nextDayProgress);
      return nextProgress;
    });
  };

  const completeDay = (dayId: number, form_data?: Record<string, unknown>) => {
    setProgress((prev) => {
      const current = prev.daysProgress[dayId] || { completed: false, completedTasks: [], form_data: {} };
      const completedAt = new Date().toISOString();
      const nextDayProgress = {
        ...current,
        completed: true,
        completedAt,
        form_data: form_data ?? current.form_data ?? {},
        completedTasks: current.completedTasks || [],
      };

      const nextCurrentDay = Math.min(Math.max(prev.currentDay, dayId + 1), 15);

      const nextProgress = {
        ...prev,
        currentDay: nextCurrentDay,
        daysProgress: {
          ...prev.daysProgress,
          [dayId]: nextDayProgress,
        },
      };

      void syncDayProgress(dayId, nextDayProgress);
      return nextProgress;
    });
  };

  const setUserName = (name: string) => {
    setProgress((prev) => ({ ...prev, userName: name }));
    if (user?.id) {
      supabase
        .from('profiles')
        .update({ full_name: name })
        .eq('id', user.id)
        .then(({ error }) => {
          if (error) {
            console.error('Erro ao atualizar nome:', error.message);
          }
        });
    }
  };

  const getCompletedDaysCount = () => {
    return Object.values(progress.daysProgress).filter((day) => day.completed).length;
  };

  const getProgressPercentage = () => {
    return Math.round((getCompletedDaysCount() / 15) * 100);
  };

  const canAccessDay = (dayId: number) => {
    if (dayId === 1) return true;
    return progress.daysProgress[dayId - 1]?.completed || dayId <= progress.currentDay;
  };

  const resetProgress = () => {
    if (!user?.id) {
      setProgress(defaultProgress);
      return;
    }

    supabase
      .from('day_progress')
      .update({
        completed: false,
        completed_tasks: [],
        mood: null,
        diary_entry: null,
        completed_at: null,
        form_data: {} as Json,
        reward_claimed: false,
        reward_timestamp: null,
      })
      .eq('user_id', user.id)
      .then(({ error }) => {
        if (error) {
          console.error('Erro ao resetar progresso:', error.message);
          return;
        }
        setProgress((prev) => ({
          ...defaultProgress,
          userName: prev.userName,
          startedAt: prev.startedAt,
        }));
      });
  };

  const claimReward = async (dayId: number): Promise<void> => {
    if (!user?.id) return;

    const rewardTimestamp = new Date().toISOString();

    setProgress((prev) => {
      const current = prev.daysProgress[dayId] || { completed: false, completedTasks: [], form_data: {} };
      return {
        ...prev,
        daysProgress: {
          ...prev.daysProgress,
          [dayId]: {
            ...current,
            rewardClaimed: true,
            rewardTimestamp,
          },
        },
      };
    });

    const { error } = await supabase
      .from('day_progress')
      .update({
        reward_claimed: true,
        reward_timestamp: rewardTimestamp,
      })
      .eq('user_id', user.id)
      .eq('day_id', dayId);

    if (error) {
      console.error('Erro ao registrar recompensa:', error.message);
    }
  };

  const isRewardClaimed = (dayId: number): boolean => {
    return progress.daysProgress[dayId]?.rewardClaimed || false;
  };

  return (
    <UserProgressContext.Provider
      value={{
        progress,
        updateDayProgress,
        toggleTask,
        completeDay,
        claimReward,
        setUserName,
        getCompletedDaysCount,
        getProgressPercentage,
        canAccessDay,
        isRewardClaimed,
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
