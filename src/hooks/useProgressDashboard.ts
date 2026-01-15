import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Database, Json } from '@/integrations/supabase/types';

export interface ProgressIndicator {
    key: string;
    name: string;
    target: number | null;
    current?: number;
    unit?: string;
}

export type ProgressDashboard = Database['public']['Tables']['progress_dashboard']['Row'];
export type ProgressDashboardInsert = Database['public']['Tables']['progress_dashboard']['Insert'];
export type ProgressDashboardUpdate = Database['public']['Tables']['progress_dashboard']['Update'];

export interface ProgressDashboardInput {
    indicators?: ProgressIndicator[];
    commitment_phrase?: string;
    certificate_generated_at?: string;
    certificate_url?: string;
}

const DEFAULT_INDICATORS: ProgressIndicator[] = [
    { key: 'essentials_on_time', name: 'Essenciais em dia', target: null },
    { key: 'budget_balance', name: 'Sobra do orçamento', target: null, unit: 'R$' },
    { key: 'card_control', name: 'Cartão sob controle', target: null },
    { key: 'emergency_fund', name: 'Caixinha', target: null, unit: 'R$' },
];

export const useProgressDashboard = () => {
    const { user } = useAuth();

    const fetch = async (): Promise<ProgressDashboard | null> => {
        if (!user) return null;

        const { data, error } = await supabase
            .from('progress_dashboard')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching progress dashboard:', error);
            return null;
        }

        return (data as ProgressDashboard) || null;
    };

    const upsert = async (input: ProgressDashboardInput): Promise<ProgressDashboard | null> => {
        if (!user) return null;

        const { data, error } = await supabase
            .from('progress_dashboard')
            .upsert({
                user_id: user.id,
                ...input,
                indicators: input.indicators as unknown as Json,
                updated_at: new Date().toISOString(),
            } as ProgressDashboardInsert, {
                onConflict: 'user_id',
            })
            .select()
            .single();

        if (error) {
            console.error('Error upserting progress dashboard:', error);
            return null;
        }

        return (data as ProgressDashboard);
    };

    const initialize = async (): Promise<ProgressDashboard | null> => {
        return upsert({ indicators: DEFAULT_INDICATORS });
    };

    const updateIndicator = async (key: string, updates: Partial<ProgressIndicator>): Promise<boolean> => {
        if (!user) return false;

        const dashboard = await fetch();
        if (!dashboard || !dashboard.indicators) return false;

        const updatedIndicators = (dashboard.indicators as unknown as ProgressIndicator[]).map(ind =>
            ind.key === key ? { ...ind, ...updates } : ind
        );

        const { error } = await supabase
            .from('progress_dashboard')
            .update({
                indicators: updatedIndicators as unknown as Json,
                updated_at: new Date().toISOString(),
            } as ProgressDashboardUpdate)
            .eq('user_id', user.id);

        if (error) {
            console.error('Error updating indicator:', error);
            return false;
        }

        return true;
    };

    const setCommitmentPhrase = async (phrase: string): Promise<boolean> => {
        if (!user) return false;

        const { error } = await supabase
            .from('progress_dashboard')
            .upsert({
                user_id: user.id,
                commitment_phrase: phrase,
                updated_at: new Date().toISOString(),
            } as ProgressDashboardInsert, {
                onConflict: 'user_id',
            });

        if (error) {
            console.error('Error setting commitment phrase:', error);
            return false;
        }

        return true;
    };

    const setCertificate = async (url: string): Promise<boolean> => {
        if (!user) return false;

        const { error } = await supabase
            .from('progress_dashboard')
            .upsert({
                user_id: user.id,
                certificate_url: url,
                certificate_generated_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            } as ProgressDashboardInsert, {
                onConflict: 'user_id',
            });

        if (error) {
            console.error('Error setting certificate:', error);
            return false;
        }

        return true;
    };

    const getOverallProgress = async (): Promise<number> => {
        const dashboard = await fetch();
        if (!dashboard || !dashboard.indicators) return 0;

        const indicators = dashboard.indicators as unknown as ProgressIndicator[];
        const completedIndicators = indicators.filter(
            ind => ind.current !== undefined && ind.target !== null && ind.current >= ind.target
        ).length;

        return Math.round((completedIndicators / indicators.length) * 100);
    };

    return {
        fetch,
        upsert,
        initialize,
        updateIndicator,
        setCommitmentPhrase,
        setCertificate,
        getOverallProgress,
        DEFAULT_INDICATORS,
    };
};
