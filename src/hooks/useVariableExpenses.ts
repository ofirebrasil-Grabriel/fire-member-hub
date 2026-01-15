import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

import { Database } from '@/integrations/supabase/types';

export type VariableCategory = string;

export type VariableExpense = Database['public']['Tables']['variable_expenses']['Row'];
export type VariableExpenseInsert = Database['public']['Tables']['variable_expenses']['Insert'];
export type VariableExpenseUpdate = Database['public']['Tables']['variable_expenses']['Update'];

export interface VariableExpenseInput {
    name: string;
    category?: string;
    amount: number;
    spent_on: string;
    is_essential?: boolean;
    notes?: string;
}

export const useVariableExpenses = () => {
    const { user } = useAuth();

    const fetchAll = async (): Promise<VariableExpense[]> => {
        if (!user) return [];

        const { data, error } = await supabase
            .from('variable_expenses')
            .select('*')
            .eq('user_id', user.id)
            .order('spent_on', { ascending: false });

        if (error) {
            console.error('Error fetching variable expenses:', error);
            return [];
        }

        return (data as VariableExpense[]) || [];
    };

    const fetchByDateRange = async (startDate: string, endDate: string): Promise<VariableExpense[]> => {
        if (!user) return [];

        const { data, error } = await supabase
            .from('variable_expenses')
            .select('*')
            .eq('user_id', user.id)
            .gte('spent_on', startDate)
            .lte('spent_on', endDate)
            .order('spent_on', { ascending: false });

        if (error) {
            console.error('Error fetching variable expenses by date range:', error);
            return [];
        }

        return (data as VariableExpense[]) || [];
    };

    const fetchByCategory = async (category: string): Promise<VariableExpense[]> => {
        if (!user) return [];

        const { data, error } = await supabase
            .from('variable_expenses')
            .select('*')
            .eq('user_id', user.id)
            .eq('category', category)
            .order('spent_on', { ascending: false });

        if (error) {
            console.error('Error fetching variable expenses by category:', error);
            return [];
        }

        return (data as VariableExpense[]) || [];
    };

    const create = async (input: VariableExpenseInput): Promise<VariableExpense | null> => {
        if (!user) return null;

        const { data, error } = await supabase
            .from('variable_expenses')
            .insert({
                user_id: user.id,
                ...input,
            } as VariableExpenseInsert)
            .select()
            .single();

        if (error) {
            console.error('Error creating variable expense:', error);
            return null;
        }

        return data as VariableExpense;
    };

    const update = async (id: string, input: Partial<VariableExpenseInput>): Promise<VariableExpense | null> => {
        if (!user) return null;

        const { data, error } = await supabase
            .from('variable_expenses')
            .update({
                ...input,
                updated_at: new Date().toISOString(),
            } as VariableExpenseUpdate)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) {
            console.error('Error updating variable expense:', error);
            return null;
        }

        return data as VariableExpense;
    };

    const remove = async (id: string): Promise<boolean> => {
        if (!user) return false;

        const { error } = await supabase
            .from('variable_expenses')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) {
            console.error('Error deleting variable expense:', error);
            return false;
        }

        return true;
    };

    const getTotalByCategory = async (): Promise<Record<string, number>> => {
        const items = await fetchAll();
        return items.reduce((acc, item) => {
            const cat = item.category || 'other';
            acc[cat] = (acc[cat] || 0) + item.amount;
            return acc;
        }, {} as Record<string, number>);
    };

    const getMonthlyTotal = async (year: number, month: number): Promise<number> => {
        const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
        const endDate = `${year}-${String(month).padStart(2, '0')}-31`;
        const items = await fetchByDateRange(startDate, endDate);
        return items.reduce((sum, item) => sum + item.amount, 0);
    };

    const getTop5Expenses = async (): Promise<VariableExpense[]> => {
        const items = await fetchAll();
        return items.sort((a, b) => b.amount - a.amount).slice(0, 5);
    };

    return {
        fetchAll,
        fetchByDateRange,
        fetchByCategory,
        create,
        update,
        remove,
        getTotalByCategory,
        getMonthlyTotal,
        getTop5Expenses,
    };
};
