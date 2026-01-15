import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/integrations/supabase/types';

export type NegotiationSession = Database['public']['Tables']['negotiation_sessions']['Row'];
export type NegotiationSessionInsert = Database['public']['Tables']['negotiation_sessions']['Insert'];
export type NegotiationSessionUpdate = Database['public']['Tables']['negotiation_sessions']['Update'];

export interface NegotiationSessionInput {
    negotiation_plan_id: string;
    session_date: string;
    channel?: string;
    response_type?: string;
    notes?: string;
}

export const useNegotiationSessions = () => {
    const { user } = useAuth();

    const fetchByPlan = async (planId: string): Promise<NegotiationSession[]> => {
        if (!user) return [];

        const { data, error } = await supabase
            .from('negotiation_sessions')
            .select('*')
            .eq('negotiation_plan_id', planId)
            .order('session_date', { ascending: false });

        if (error) {
            console.error('Error fetching negotiation sessions:', error);
            return [];
        }

        return (data as NegotiationSession[]) || [];
    };

    const create = async (input: NegotiationSessionInput): Promise<NegotiationSession | null> => {
        if (!user) return null;

        const { data, error } = await supabase
            .from('negotiation_sessions')
            .insert({
                user_id: user.id,
                ...input,
            } as NegotiationSessionInsert)
            .select()
            .single();

        if (error) {
            console.error('Error creating negotiation session:', error);
            return null;
        }

        return (data as NegotiationSession);
    };

    const update = async (id: string, input: Partial<NegotiationSessionInput>): Promise<NegotiationSession | null> => {
        if (!user) return null;

        const { data, error } = await supabase
            .from('negotiation_sessions')
            .update({
                ...input,
                updated_at: new Date().toISOString(),
            } as NegotiationSessionUpdate)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating negotiation session:', error);
            return null;
        }

        return (data as NegotiationSession);
    };

    const remove = async (id: string): Promise<boolean> => {
        if (!user) return false;

        const { error } = await supabase
            .from('negotiation_sessions')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting negotiation session:', error);
            return false;
        }

        return true;
    };

    return {
        fetchByPlan,
        create,
        update,
        remove,
    };
};
