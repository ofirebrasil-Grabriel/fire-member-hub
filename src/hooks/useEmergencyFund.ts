import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/integrations/supabase/types';

export type AccountType = 'savings' | 'digital' | 'piggy_bank' | 'other';

export type EmergencyFund = Database['public']['Tables']['emergency_fund']['Row'];
export type EmergencyFundInsert = Database['public']['Tables']['emergency_fund']['Insert'];
export type EmergencyFundUpdate = Database['public']['Tables']['emergency_fund']['Update'];

export interface EmergencyFundInput {
    account_info?: string;
    account_type?: AccountType;
    monthly_contribution?: number;
    goal_amount?: number;
    current_balance?: number;
    auto_transfer?: boolean;
    transfer_day?: number;
}

export const useEmergencyFund = () => {
    const { user } = useAuth();

    const fetch = async (): Promise<EmergencyFund | null> => {
        if (!user) return null;

        const { data, error } = await supabase
            .from('emergency_fund')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching emergency fund:', error);
            return null;
        }

        return (data as EmergencyFund) || null;
    };

    const upsert = async (input: EmergencyFundInput): Promise<EmergencyFund | null> => {
        if (!user) return null;

        const { data, error } = await supabase
            .from('emergency_fund')
            .upsert({
                user_id: user.id,
                ...input,
                updated_at: new Date().toISOString(),
            } as EmergencyFundInsert, {
                onConflict: 'user_id',
            })
            .select()
            .single();

        if (error) {
            console.error('Error upserting emergency fund:', error);
            return null;
        }

        return (data as EmergencyFund);
    };

    const addDeposit = async (amount: number): Promise<boolean> => {
        if (!user) return false;

        const current = await fetch();
        const newBalance = (current?.current_balance || 0) + amount;

        const { error } = await supabase
            .from('emergency_fund')
            .upsert({
                user_id: user.id,
                current_balance: newBalance,
                updated_at: new Date().toISOString(),
            } as EmergencyFundInsert, {
                onConflict: 'user_id',
            });

        if (error) {
            console.error('Error adding deposit:', error);
            return false;
        }

        return true;
    };

    const withdraw = async (amount: number): Promise<boolean> => {
        if (!user) return false;

        const current = await fetch();
        const newBalance = Math.max(0, (current?.current_balance || 0) - amount);

        const { error } = await supabase
            .from('emergency_fund')
            .update({
                current_balance: newBalance,
                updated_at: new Date().toISOString(),
            } as EmergencyFundUpdate)
            .eq('user_id', user.id);

        if (error) {
            console.error('Error withdrawing:', error);
            return false;
        }

        return true;
    };

    const getProgress = async (): Promise<{ current: number; goal: number; percentage: number }> => {
        const fund = await fetch();
        const current = fund?.current_balance || 0;
        const goal = fund?.goal_amount || 0;
        const percentage = goal > 0 ? Math.round((current / goal) * 100) : 0;

        return { current, goal, percentage };
    };

    return {
        fetch,
        upsert,
        addDeposit,
        withdraw,
        getProgress,
    };
};
