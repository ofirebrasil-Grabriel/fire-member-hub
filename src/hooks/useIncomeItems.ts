import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/integrations/supabase/types';

export type IncomeItem = Database['public']['Tables']['income_items']['Row'];
export type IncomeItemInsert = Database['public']['Tables']['income_items']['Insert'];
export type IncomeItemUpdate = Database['public']['Tables']['income_items']['Update'];

export interface IncomeItemInput {
    source: string;
    amount: number;
    received_on?: number | null;
    recurrence?: 'monthly' | 'weekly' | 'biweekly' | 'one_time';
    notes?: string | null;
}

export const useIncomeItems = () => {
    const { user } = useAuth();

    const fetchAll = async (): Promise<IncomeItem[]> => {
        if (!user) return [];

        const { data, error } = await supabase
            .from('income_items')
            .select('*')
            .eq('user_id', user.id)
            .order('received_on', { ascending: true });

        if (error) {
            console.error('Error fetching income items:', error);
            return [];
        }

        return (data as IncomeItem[]) || [];
    };

    const create = async (input: IncomeItemInput): Promise<IncomeItem | null> => {
        if (!user) return null;

        const { data, error } = await supabase
            .from('income_items')
            .insert({
                user_id: user.id,
                ...input,
            } as IncomeItemInsert)
            .select()
            .single();

        if (error) {
            console.error('Error creating income item:', error);
            return null;
        }

        return (data as IncomeItem);
    };

    const update = async (id: string, input: Partial<IncomeItemInput>): Promise<IncomeItem | null> => {
        if (!user) return null;

        const { data, error } = await supabase
            .from('income_items')
            .update({
                ...input,
                updated_at: new Date().toISOString(),
            } as IncomeItemUpdate)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) {
            console.error('Error updating income item:', error);
            return null;
        }

        return (data as IncomeItem);
    };

    const remove = async (id: string): Promise<boolean> => {
        if (!user) return false;

        const { error } = await supabase
            .from('income_items')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) {
            console.error('Error deleting income item:', error);
            return false;
        }

        return true;
    };

    const getTotalMonthlyIncome = async (): Promise<number> => {
        const items = await fetchAll();
        return items.reduce((sum, item) => {
            let monthlyAmount = item.amount || 0;
            if (item.recurrence === 'weekly') monthlyAmount *= 4;
            if (item.recurrence === 'biweekly') monthlyAmount *= 2;
            if (item.recurrence === 'one_time') monthlyAmount = 0; // Não conta como renda mensal recorrente
            return sum + monthlyAmount;
        }, 0);
    };

    return {
        fetchAll,
        create,
        update,
        remove,
        getTotalMonthlyIncome,
    };
};
