import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/integrations/supabase/types';

export type NegotiationObjective = 'reduce_interest' | 'extend_term' | 'discount_cash' | 'suspend_temporarily' | 'other';
export type NegotiationPriority = 'high' | 'medium' | 'low';
export type NegotiationStatus = 'planning' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export type NegotiationPlan = Database['public']['Tables']['negotiation_plans']['Row'];
export type NegotiationPlanInsert = Database['public']['Tables']['negotiation_plans']['Insert'];
export type NegotiationPlanUpdate = Database['public']['Tables']['negotiation_plans']['Update'];

export interface NegotiationPlanInput {
    debt_id?: string;
    objective?: NegotiationObjective;
    max_monthly_payment?: number;
    ideal_monthly_payment?: number;
    priority?: NegotiationPriority;
    contact_phone?: string;
    contact_email?: string;
    contact_hours?: string;
    documents_needed?: string;
    scripts?: string;
    key_arguments?: string;
    scheduled_at?: string;
    status?: NegotiationStatus;
    creditor_name?: string;
    notes?: string;
}

export const useNegotiationPlans = () => {
    const { user } = useAuth();

    const fetchAll = async (): Promise<NegotiationPlan[]> => {
        if (!user) return [];

        const { data, error } = await supabase
            .from('negotiation_plans')
            .select('*')
            .eq('user_id', user.id)
            .order('priority', { ascending: true });

        if (error) {
            console.error('Error fetching negotiation plans:', error);
            return [];
        }

        return (data as NegotiationPlan[]) || [];
    };

    const fetchByDebt = async (debtId: string): Promise<NegotiationPlan | null> => {
        if (!user) return null;

        const { data, error } = await supabase
            .from('negotiation_plans')
            .select('*')
            .eq('user_id', user.id)
            .eq('debt_id', debtId)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching negotiation plan:', error);
            return null;
        }

        return (data as NegotiationPlan) || null;
    };

    const create = async (input: NegotiationPlanInput): Promise<NegotiationPlan | null> => {
        if (!user) return null;

        const { data, error } = await supabase
            .from('negotiation_plans')
            .insert({
                user_id: user.id,
                ...input,
                status: input.status || 'planning'
            } as NegotiationPlanInsert)
            .select()
            .single();

        if (error) {
            console.error('Error creating negotiation plan:', error);
            return null;
        }

        return (data as NegotiationPlan);
    };

    const update = async (id: string, input: Partial<NegotiationPlanInput>): Promise<NegotiationPlan | null> => {
        if (!user) return null;

        const { data, error } = await supabase
            .from('negotiation_plans')
            .update({
                ...input,
                updated_at: new Date().toISOString(),
            } as NegotiationPlanUpdate)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) {
            console.error('Error updating negotiation plan:', error);
            return null;
        }

        return (data as NegotiationPlan);
    };

    const updateStatus = async (id: string, status: NegotiationStatus): Promise<boolean> => {
        if (!user) return false;

        const { error } = await supabase
            .from('negotiation_plans')
            .update({ status, updated_at: new Date().toISOString() } as NegotiationPlanUpdate)
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) {
            console.error('Error updating status:', error);
            return false;
        }

        return true;
    };

    const remove = async (id: string): Promise<boolean> => {
        if (!user) return false;

        const { error } = await supabase
            .from('negotiation_plans')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) {
            console.error('Error deleting negotiation plan:', error);
            return false;
        }

        return true;
    };

    const getByStatus = async (status: NegotiationStatus): Promise<NegotiationPlan[]> => {
        if (!user) return [];

        const { data, error } = await supabase
            .from('negotiation_plans')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', status);

        if (error) {
            console.error('Error fetching by status:', error);
            return [];
        }

        return (data as NegotiationPlan[]) || [];
    };

    return {
        fetchAll,
        fetchByDebt,
        create,
        update,
        updateStatus,
        remove,
        getByStatus,
    };
};
