import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/integrations/supabase/types';

export type WeeklyChecklistItem = {
    id: string;
    text: string;
    completed: boolean;
};

export type WeeklyRitual = Database['public']['Tables']['weekly_ritual']['Row'];
export type WeeklyRitualInsert = Database['public']['Tables']['weekly_ritual']['Insert'];
export type WeeklyRitualUpdate = Database['public']['Tables']['weekly_ritual']['Update'];

export interface WeeklyProtocolInput {
    day_of_week?: number;
    checklist?: WeeklyChecklistItem[];
}

export const useWeeklyProtocol = () => {
    const { user } = useAuth();

    const fetch = async (): Promise<WeeklyRitual | null> => {
        if (!user) return null;

        const { data, error } = await supabase
            .from('weekly_ritual')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching weekly ritual:', error);
            return null;
        }

        return (data as WeeklyRitual) || null;
    };

    const upsert = async (input: WeeklyProtocolInput): Promise<WeeklyRitual | null> => {
        if (!user) return null;

        const { data, error } = await supabase
            .from('weekly_ritual')
            .upsert({
                user_id: user.id,
                ...input,
                checklist: input.checklist as any,
                updated_at: new Date().toISOString(),
            } as any, {
                onConflict: 'user_id',
            })
            .select()
            .single();

        if (error) {
            console.error('Error upserting weekly ritual:', error);
            return null;
        }

        return (data as WeeklyRitual);
    };

    const updateChecklist = async (checklist: WeeklyChecklistItem[]): Promise<boolean> => {
        if (!user) return false;

        const { error } = await supabase
            .from('weekly_ritual')
            .upsert({
                user_id: user.id,
                checklist: checklist as any,
                updated_at: new Date().toISOString(),
            } as any, {
                onConflict: 'user_id',
            });

        if (error) {
            console.error('Error updating checklist:', error);
            return false;
        }

        return true;
    };

    const toggleChecklistItem = async (itemId: string): Promise<boolean> => {
        if (!user) return false;

        const ritual = await fetch();
        if (!ritual || !ritual.checklist) return false;

        const checklist = (ritual.checklist as unknown as WeeklyChecklistItem[]).map(item =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
        );

        return updateChecklist(checklist);
    };

    const getDayName = (dayOfWeek: number): string => {
        const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        return days[dayOfWeek] || '';
    };

    return {
        fetch,
        upsert,
        updateChecklist,
        toggleChecklistItem,
        getDayName,
    };
};
