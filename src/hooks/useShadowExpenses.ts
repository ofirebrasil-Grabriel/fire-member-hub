import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

import { Database } from '@/integrations/supabase/types';

export type ShadowStatus = Database['public']['Tables']['shadow_expenses']['Row']['status'];
export type ShadowFrequency = Database['public']['Tables']['shadow_expenses']['Row']['frequency'];

export type ShadowExpense = Database['public']['Tables']['shadow_expenses']['Row'];
export type ShadowExpenseInsert = Database['public']['Tables']['shadow_expenses']['Insert'];
export type ShadowExpenseUpdate = Database['public']['Tables']['shadow_expenses']['Update'];

export interface ShadowExpenseInput {
    name: string;
    estimated_amount?: number;
    frequency?: string;
    status?: string;
    monthly_limit?: number;
    comment?: string;
}

export const useShadowExpenses = () => {
    const { user } = useAuth();

    const fetchAll = async (): Promise<ShadowExpense[]> => {
        if (!user) return [];

        const { data, error } = await supabase
            .from('shadow_expenses')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching shadow expenses:', error);
            return [];
        }

        return (data as ShadowExpense[]) || [];
    };

    const fetchByStatus = async (status: string): Promise<ShadowExpense[]> => {
        if (!user) return [];

        const { data, error } = await supabase
            .from('shadow_expenses')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', status)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching shadow expenses by status:', error);
            return [];
        }

        return (data as ShadowExpense[]) || [];
    };

    const create = async (input: ShadowExpenseInput): Promise<ShadowExpense | null> => {
        if (!user) return null;

        const { data, error } = await supabase
            .from('shadow_expenses')
            .insert({
                user_id: user.id,
                ...input,
            } as ShadowExpenseInsert)
            .select()
            .single();

        if (error) {
            console.error('Error creating shadow expense:', error);
            return null;
        }

        return data as ShadowExpense;
    };

    const update = async (id: string, input: Partial<ShadowExpenseInput>): Promise<ShadowExpense | null> => {
        if (!user) return null;

        const { data, error } = await supabase
            .from('shadow_expenses')
            .update({
                ...input,
                updated_at: new Date().toISOString(),
            } as ShadowExpenseUpdate)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) {
            console.error('Error updating shadow expense:', error);
            return null;
        }

        return data as ShadowExpense;
    };

    const setStatus = async (id: string, status: ShadowStatus, monthlyLimit?: number): Promise<boolean> => {
        if (!user) return false;

        const { error } = await supabase
            .from('shadow_expenses')
            .update({
                status,
                monthly_limit: status === 'keep' ? monthlyLimit : null,
                action_taken_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) {
            console.error('Error setting shadow expense status:', error);
            return false;
        }

        return true;
    };

    const remove = async (id: string): Promise<boolean> => {
        if (!user) return false;

        const { error } = await supabase
            .from('shadow_expenses')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) {
            console.error('Error deleting shadow expense:', error);
            return false;
        }

        return true;
    };

    const getEstimatedMonthlySavings = async (): Promise<number> => {
        const items = await fetchAll();
        return items
            .filter(item => item.status === 'cut' || item.status === 'pause')
            .reduce((sum, item) => {
                let monthly = item.estimated_amount || 0;
                if (item.frequency === 'daily') monthly *= 30;
                if (item.frequency === 'weekly') monthly *= 4;
                return sum + monthly;
            }, 0);
    };

    const getPendingCount = async (): Promise<number> => {
        const items = await fetchByStatus('pending');
        return items.length;
    };

    return {
        fetchAll,
        fetchByStatus,
        create,
        update,
        setStatus,
        remove,
        getEstimatedMonthlySavings,
        getPendingCount,
    };
};
