import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/integrations/supabase/types';

export type PlanCycleType = '30' | '90';
export type PlanMode = 'emergency' | 'balance' | 'traction';
export type PlanStatus = 'active' | 'completed' | 'abandoned';

export type Plan = Database['public']['Tables']['plans']['Row'];
export type PlanInsert = Database['public']['Tables']['plans']['Insert'];
export type PlanUpdate = Database['public']['Tables']['plans']['Update'];

export interface PlanInput {
    cycle_type: PlanCycleType;
    mode?: PlanMode;
    start_date: string;
    end_date?: string;
    commitment_phrase?: string;
}

export const usePlans = () => {
    const { user } = useAuth();

    const fetchAll = async (): Promise<Plan[]> => {
        if (!user) return [];

        const { data, error } = await supabase
            .from('plans')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching plans:', error);
            return [];
        }

        return (data as Plan[]) || [];
    };

    const fetchActive = async (): Promise<Plan | null> => {
        if (!user) return null;

        const { data, error } = await supabase
            .from('plans')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching active plan:', error);
            return null;
        }

        return (data as Plan) || null;
    };

    const create = async (input: PlanInput): Promise<Plan | null> => {
        if (!user) return null;

        const { data, error } = await supabase
            .from('plans')
            .insert({
                user_id: user.id,
                cycle_type: input.cycle_type,
                mode: input.mode || null,
                start_date: input.start_date,
                end_date: input.end_date || null,
                commitment_phrase: input.commitment_phrase || null,
                status: 'active'
            } as PlanInsert)
            .select()
            .single();

        if (error) {
            console.error('Error creating plan:', error);
            return null;
        }

        return (data as Plan);
    };

    const update = async (id: string, input: Partial<PlanInput & { status?: PlanStatus }>): Promise<Plan | null> => {
        if (!user) return null;

        const updateData: PlanUpdate = {
            ...input,
            updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
            .from('plans')
            .update(updateData)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) {
            console.error('Error updating plan:', error);
            return null;
        }

        return (data as Plan);
    };

    const complete = async (id: string): Promise<boolean> => {
        if (!user) return false;

        const { error } = await supabase
            .from('plans')
            .update({
                status: 'completed',
                end_date: new Date().toISOString().split('T')[0],
                updated_at: new Date().toISOString()
            } as PlanUpdate)
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) {
            console.error('Error completing plan:', error);
            return false;
        }

        return true;
    };

    const abandon = async (id: string): Promise<boolean> => {
        if (!user) return false;

        const { error } = await supabase
            .from('plans')
            .update({
                status: 'abandoned',
                updated_at: new Date().toISOString()
            } as PlanUpdate)
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) {
            console.error('Error abandoning plan:', error);
            return false;
        }

        return true;
    };

    const remove = async (id: string): Promise<boolean> => {
        if (!user) return false;

        const { error } = await supabase
            .from('plans')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) {
            console.error('Error deleting plan:', error);
            return false;
        }

        return true;
    };

    return {
        fetchAll,
        fetchActive,
        create,
        update,
        complete,
        abandon,
        remove,
    };
};
