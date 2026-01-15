import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Achievement {
    id: string;
    user_id: string;
    day_id: number;
    title: string;
    motivation_phrase: string | null;
    reward_label: string | null;
    xp_earned: number;
    claimed_at: string;
    card_theme: string;
    created_at: string;
}

export interface UserStats {
    xp_total: number;
    level: number;
    levelTitle: string;
    nextLevelXp: number;
    progress: number;
}

const LEVELS = [
    { level: 1, xp: 0, title: 'Iniciante' },
    { level: 2, xp: 300, title: 'Consciente' },
    { level: 3, xp: 700, title: 'Estrategista' },
    { level: 4, xp: 1200, title: 'Negociador' },
    { level: 5, xp: 2000, title: 'Mestre FIRE' },
];

export function calculateLevel(xp: number): { level: number; title: string; nextLevelXp: number; progress: number } {
    let currentLevel = LEVELS[0];
    let nextLevel = LEVELS[1];

    for (let i = LEVELS.length - 1; i >= 0; i--) {
        if (xp >= LEVELS[i].xp) {
            currentLevel = LEVELS[i];
            nextLevel = LEVELS[i + 1] || LEVELS[i];
            break;
        }
    }

    const xpInCurrentLevel = xp - currentLevel.xp;
    const xpNeededForNext = nextLevel.xp - currentLevel.xp;
    const progress = xpNeededForNext > 0 ? (xpInCurrentLevel / xpNeededForNext) * 100 : 100;

    return {
        level: currentLevel.level,
        title: currentLevel.title,
        nextLevelXp: nextLevel.xp,
        progress: Math.min(progress, 100),
    };
}

export function useAchievements() {
    const { user } = useAuth();
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [stats, setStats] = useState<UserStats>({
        xp_total: 0,
        level: 1,
        levelTitle: 'Iniciante',
        nextLevelXp: 300,
        progress: 0,
    });
    const [loading, setLoading] = useState(false);

    const fetchAchievements = useCallback(async () => {
        if (!user?.id) return;

        setLoading(true);
        try {
            // Using any cast since types.ts may not have achievements table yet
            const { data, error } = await (supabase as any)
                .from('achievements')
                .select('*')
                .eq('user_id', user.id)
                .order('day_id', { ascending: true });

            if (error) throw error;
            setAchievements((data as Achievement[]) || []);
        } catch (error) {
            console.error('Error fetching achievements:', error);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    const fetchUserStats = useCallback(async () => {
        if (!user?.id) return;

        try {
            // Using any cast since xp_total/level may not be in types yet
            const { data, error } = await (supabase as any)
                .from('profiles')
                .select('xp_total, level')
                .eq('id', user.id)
                .single();

            if (error) throw error;

            const xp = (data as any)?.xp_total || 0;
            const levelInfo = calculateLevel(xp);

            setStats({
                xp_total: xp,
                level: levelInfo.level,
                levelTitle: levelInfo.title,
                nextLevelXp: levelInfo.nextLevelXp,
                progress: levelInfo.progress,
            });
        } catch (error) {
            console.error('Error fetching user stats:', error);
        }
    }, [user?.id]);

    const claimAchievement = useCallback(async (
        dayId: number,
        title: string,
        motivationPhrase: string,
        rewardLabel: string,
        xpReward: number
    ): Promise<boolean> => {
        if (!user?.id) return false;

        try {
            // Insert achievement (using any cast for new table)
            const { error: achievementError } = await (supabase as any)
                .from('achievements')
                .insert({
                    user_id: user.id,
                    day_id: dayId,
                    title,
                    motivation_phrase: motivationPhrase,
                    reward_label: rewardLabel,
                    xp_earned: xpReward,
                    card_theme: 'fire',
                });

            if (achievementError) throw achievementError;

            // Update user XP (using any cast)
            const { data: profile } = await (supabase as any)
                .from('profiles')
                .select('xp_total')
                .eq('id', user.id)
                .single();

            const currentXp = (profile as any)?.xp_total || 0;
            const newXp = currentXp + xpReward;
            const newLevelInfo = calculateLevel(newXp);

            const { error: updateError } = await (supabase as any)
                .from('profiles')
                .update({
                    xp_total: newXp,
                    level: newLevelInfo.level,
                })
                .eq('id', user.id);

            if (updateError) throw updateError;

            // Refresh data
            await fetchAchievements();
            await fetchUserStats();

            return true;
        } catch (error) {
            console.error('Error claiming achievement:', error);
            return false;
        }
    }, [user?.id, fetchAchievements, fetchUserStats]);

    const hasAchievement = useCallback((dayId: number): boolean => {
        return achievements.some(a => a.day_id === dayId);
    }, [achievements]);

    return {
        achievements,
        stats,
        loading,
        fetchAchievements,
        fetchUserStats,
        claimAchievement,
        hasAchievement,
    };
}
