import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

import { Database } from '@/integrations/supabase/types';

export type ExpenseCategory = string;
export type ExpensePriority = string;

export type FixedExpense = Database['public']['Tables']['fixed_expenses']['Row'];
export type FixedExpenseInsert = Database['public']['Tables']['fixed_expenses']['Insert'];
export type FixedExpenseUpdate = Database['public']['Tables']['fixed_expenses']['Update'];

export interface FixedExpenseInput {
    name: string;
    category?: string;
    amount: number;
    due_date?: number;
    payment_method?: string;
    priority?: string;
    auto_debit?: boolean;
    notes?: string;
}

export const useFixedExpenses = () => {
    const { user } = useAuth();

    const fetchAll = async (): Promise<FixedExpense[]> => {
        if (!user) return [];

        const { data, error } = await supabase
            .from('fixed_expenses')
            .select('*')
            .eq('user_id', user.id)
            .order('due_date', { ascending: true });

        if (error) {
            console.error('Error fetching fixed expenses:', error);
            return [];
        }

        return (data as FixedExpense[]) || [];
    };

    const fetchByCategory = async (category: string): Promise<FixedExpense[]> => {
        if (!user) return [];

        const { data, error } = await supabase
            .from('fixed_expenses')
            .select('*')
            .eq('user_id', user.id)
            .eq('category', category)
            .order('due_date', { ascending: true });

        if (error) {
            console.error('Error fetching fixed expenses by category:', error);
            return [];
        }

        return (data as FixedExpense[]) || [];
    };

    const fetchByPriority = async (priority: string): Promise<FixedExpense[]> => {
        if (!user) return [];

        const { data, error } = await supabase
            .from('fixed_expenses')
            .select('*')
            .eq('user_id', user.id)
            .eq('priority', priority)
            .order('due_date', { ascending: true });

        if (error) {
            console.error('Error fetching fixed expenses by priority:', error);
            return [];
        }

        return (data as FixedExpense[]) || [];
    };

    const create = async (input: FixedExpenseInput): Promise<FixedExpense | null> => {
        if (!user) return null;

        const { data, error } = await supabase
            .from('fixed_expenses')
            .insert({
                user_id: user.id,
                ...input,
            } as FixedExpenseInsert)
            .select()
            .single();

        if (error) {
            console.error('Error creating fixed expense:', error);
            return null;
        }

        return data as FixedExpense;
    };

    const update = async (id: string, input: Partial<FixedExpenseInput>): Promise<FixedExpense | null> => {
        if (!user) return null;

        const { data, error } = await supabase
            .from('fixed_expenses')
            .update({
                ...input,
                updated_at: new Date().toISOString(),
            } as FixedExpenseUpdate)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) {
            console.error('Error updating fixed expense:', error);
            return null;
        }

        return data as FixedExpense;
    };

    const remove = async (id: string): Promise<boolean> => {
        if (!user) return false;

        const { error } = await supabase
            .from('fixed_expenses')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) {
            console.error('Error deleting fixed expense:', error);
            return false;
        }

        return true;
    };

    const getTotalByPriority = async (): Promise<Record<string, number>> => {
        const items = await fetchAll();
        return items.reduce((acc, item) => {
            const priority = item.priority || 'other';
            acc[priority] = (acc[priority] || 0) + item.amount;
            return acc;
        }, {} as Record<string, number>);
    };

    const getTotalMonthlyExpenses = async (): Promise<number> => {
        const items = await fetchAll();
        return items.reduce((sum, item) => sum + item.amount, 0);
    };

    const getEssentialsTotal = async (): Promise<number> => {
        const items = await fetchByPriority('essential');
        return items.reduce((sum, item) => sum + item.amount, 0);
    };

    return {
        fetchAll,
        fetchByCategory,
        fetchByPriority,
        create,
        update,
        remove,
        getTotalByPriority,
        getTotalMonthlyExpenses,
        getEssentialsTotal,
    };
};
