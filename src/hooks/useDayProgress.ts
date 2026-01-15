import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

import { Database } from '@/integrations/supabase/types';

export type DayProgress = Database['public']['Tables']['day_progress']['Row'];
export type DayProgressInsert = Database['public']['Tables']['day_progress']['Insert'];
export type DayProgressUpdate = Database['public']['Tables']['day_progress']['Update'];

export interface DayProgressInput {
    day_id: number;
    completed?: boolean;
    completed_tasks?: string[];
    form_data?: Record<string, unknown>;
    mood?: string;
    diary_entry?: string;
}

export const useDayProgress = () => {
    const { user } = useAuth();

    const fetchAll = async (): Promise<DayProgress[]> => {
        if (!user) return [];

        const { data, error } = await supabase
            .from('day_progress')
            .select('*')
            .eq('user_id', user.id)
            .order('day_id', { ascending: true });

        if (error) {
            console.error('Error fetching day progress:', error);
            return [];
        }

        return (data as DayProgress[]) || [];
    };

    const fetchByDay = async (dayId: number): Promise<DayProgress | null> => {
        if (!user) return null;

        const { data, error } = await supabase
            .from('day_progress')
            .select('*')
            .eq('user_id', user.id)
            .eq('day_id', dayId)
            .maybeSingle();

        if (error) {
            console.error('Error fetching day progress:', error);
            return null;
        }

        return data as DayProgress;
    };

    const upsert = async (input: DayProgressInput): Promise<DayProgress | null> => {
        if (!user) return null;

        const { data, error } = await supabase
            .from('day_progress')
            .upsert({
                user_id: user.id,
                ...input,
                updated_at: new Date().toISOString(),
            } as DayProgressInsert, {
                onConflict: 'user_id,day_id',
            })
            .select()
            .single();

        if (error) {
            console.error('Error upserting day progress:', error);
            return null;
        }

        return data as DayProgress;
    };

    const completeDay = async (dayId: number, formData?: Record<string, unknown>): Promise<DayProgress | null> => {
        if (!user) return null;

        const { data, error } = await supabase
            .from('day_progress')
            .upsert({
                user_id: user.id,
                day_id: dayId,
                completed: true,
                completed_at: new Date().toISOString(),
                form_data: (formData || {}) as any,
                updated_at: new Date().toISOString(),
            } as DayProgressInsert, {
                onConflict: 'user_id,day_id',
            })
            .select()
            .single();

        if (error) {
            console.error('Error completing day:', error);
            return null;
        }

        return data as DayProgress;
    };

    const updateFormData = async (dayId: number, formData: Record<string, unknown>): Promise<boolean> => {
        if (!user) return false;

        const existing = await fetchByDay(dayId);

        const mergedFormData = {
            ...((existing?.form_data as Record<string, unknown>) || {}),
            ...formData,
        };

        const { error } = await supabase
            .from('day_progress')
            .upsert({
                user_id: user.id,
                day_id: dayId,
                form_data: mergedFormData as any,
                updated_at: new Date().toISOString(),
            } as DayProgressInsert, {
                onConflict: 'user_id,day_id',
            });

        if (error) {
            console.error('Error updating form data:', error);
            return false;
        }

        return true;
    };

    const updateMood = async (dayId: number, mood: string, diaryEntry?: string): Promise<boolean> => {
        if (!user) return false;

        const { error } = await supabase
            .from('day_progress')
            .upsert({
                user_id: user.id,
                day_id: dayId,
                mood,
                diary_entry: diaryEntry || null,
                updated_at: new Date().toISOString(),
            } as DayProgressInsert, {
                onConflict: 'user_id,day_id',
            });

        if (error) {
            console.error('Error updating mood:', error);
            return false;
        }

        return true;
    };

    const claimReward = async (dayId: number): Promise<boolean> => {
        if (!user) return false;

        const { error } = await supabase
            .from('day_progress')
            .update({
                reward_claimed: true,
                reward_timestamp: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', user.id)
            .eq('day_id', dayId);

        if (error) {
            console.error('Error claiming reward:', error);
            return false;
        }

        return true;
    };

    const getCompletedDays = async (): Promise<number[]> => {
        if (!user) return [];

        const { data, error } = await supabase
            .from('day_progress')
            .select('day_id')
            .eq('user_id', user.id)
            .eq('completed', true);

        if (error) {
            console.error('Error fetching completed days:', error);
            return [];
        }

        return data?.map(d => d.day_id) || [];
    };

    const canAccessDay = async (dayId: number): Promise<boolean> => {
        if (dayId === 1) return true;

        const completedDays = await getCompletedDays();
        return completedDays.includes(dayId - 1);
    };

    return {
        fetchAll,
        fetchByDay,
        upsert,
        completeDay,
        updateFormData,
        updateMood,
        claimReward,
        getCompletedDays,
        canAccessDay,
    };
};
