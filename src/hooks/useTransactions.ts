import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

import { Database } from '@/integrations/supabase/types';

export type TransactionStatus = string;

export type Transaction = Database['public']['Tables']['transactions']['Row'];
export type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];
export type TransactionUpdate = Database['public']['Tables']['transactions']['Update'];

export interface TransactionInput {
    date: string;
    description: string;
    amount: number;
    category?: string;
    is_shadow?: boolean;
    status?: string;
    source?: string;
}

export const useTransactions = () => {
    const { user } = useAuth();

    const fetchAll = async (): Promise<Transaction[]> => {
        if (!user) return [];

        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id)
            .order('date', { ascending: false });

        if (error) {
            console.error('Error fetching transactions:', error);
            return [];
        }

        return (data as Transaction[]) || [];
    };

    const fetchByDateRange = async (startDate: string, endDate: string): Promise<Transaction[]> => {
        if (!user) return [];

        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id)
            .gte('date', startDate)
            .lte('date', endDate)
            .order('date', { ascending: false });

        if (error) {
            console.error('Error fetching transactions by date range:', error);
            return [];
        }

        return (data as Transaction[]) || [];
    };

    const fetchShadowExpenses = async (): Promise<Transaction[]> => {
        if (!user) return [];

        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_shadow', true)
            .order('date', { ascending: false });

        if (error) {
            console.error('Error fetching shadow expenses:', error);
            return [];
        }

        return (data as Transaction[]) || [];
    };

    const create = async (input: TransactionInput): Promise<Transaction | null> => {
        if (!user) return null;

        const { data, error } = await supabase
            .from('transactions')
            .insert({
                user_id: user.id,
                ...input,
            } as TransactionInsert)
            .select()
            .single();

        if (error) {
            console.error('Error creating transaction:', error);
            return null;
        }

        return data as Transaction;
    };

    const bulkCreate = async (inputs: TransactionInput[]): Promise<Transaction[]> => {
        if (!user) return [];

        const { data, error } = await supabase
            .from('transactions')
            .insert(inputs.map(input => ({ user_id: user.id, ...input } as TransactionInsert)))
            .select();

        if (error) {
            console.error('Error bulk creating transactions:', error);
            return [];
        }

        return (data as Transaction[]) || [];
    };

    const update = async (id: string, input: Partial<TransactionInput>): Promise<Transaction | null> => {
        if (!user) return null;

        const { data, error } = await supabase
            .from('transactions')
            .update({
                ...input,
                updated_at: new Date().toISOString(),
            } as TransactionUpdate)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) {
            console.error('Error updating transaction:', error);
            return null;
        }

        return data as Transaction;
    };

    const markAsShadow = async (id: string, isShadow: boolean): Promise<boolean> => {
        if (!user) return false;

        const { error } = await supabase
            .from('transactions')
            .update({
                is_shadow: isShadow,
                status: isShadow ? 'shadow' : 'uncategorized',
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) {
            console.error('Error marking transaction as shadow:', error);
            return false;
        }

        return true;
    };

    const categorize = async (id: string, category: string, status: TransactionStatus): Promise<boolean> => {
        if (!user) return false;

        const { error } = await supabase
            .from('transactions')
            .update({
                category,
                status,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) {
            console.error('Error categorizing transaction:', error);
            return false;
        }

        return true;
    };

    const remove = async (id: string): Promise<boolean> => {
        if (!user) return false;

        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) {
            console.error('Error deleting transaction:', error);
            return false;
        }

        return true;
    };

    const getTop5ByAmount = async (): Promise<Transaction[]> => {
        const items = await fetchAll();
        return items
            .filter(t => t.amount > 0)
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5);
    };

    const getTotalByCategory = async (): Promise<Record<string, number>> => {
        const items = await fetchAll();
        return items.reduce((acc, item) => {
            const cat = item.category || 'uncategorized';
            acc[cat] = (acc[cat] || 0) + item.amount;
            return acc;
        }, {} as Record<string, number>);
    };

    const getShadowTotal = async (): Promise<number> => {
        const items = await fetchShadowExpenses();
        return items.reduce((sum, item) => sum + item.amount, 0);
    };

    return {
        fetchAll,
        fetchByDateRange,
        fetchShadowExpenses,
        create,
        bulkCreate,
        update,
        markAsShadow,
        categorize,
        remove,
        getTop5ByAmount,
        getTotalByCategory,
        getShadowTotal,
    };
};
