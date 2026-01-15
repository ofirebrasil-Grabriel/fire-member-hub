import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Database, Json } from '@/integrations/supabase/types';

export type TriggerType = 'anxiety' | 'boredom' | 'social_pressure' | 'tiredness' | 'family' | 'other';
export type DefaultAction = 'pause_24h' | 'open_dashboard' | 'call_someone' | 'walk_10min' | 'breathe' | 'other';

export interface LevelAction {
    action: string;
    description: string;
}

export type DecisionRules = Database['public']['Tables']['decision_rules']['Row'];
export type DecisionRulesInsert = Database['public']['Tables']['decision_rules']['Insert'];
export type DecisionRulesUpdate = Database['public']['Tables']['decision_rules']['Update'];

export interface DecisionRulesInput {
    primary_trigger?: TriggerType;
    default_action?: DefaultAction;
    level_1?: LevelAction[];
    level_2?: LevelAction[];
    level_3?: LevelAction[];
}

export const useDecisionRules = () => {
    const { user } = useAuth();

    const fetch = async (): Promise<DecisionRules | null> => {
        if (!user) return null;

        const { data, error } = await supabase
            .from('decision_rules')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching decision rules:', error);
            return null;
        }

        return (data as DecisionRules) || null;
    };

    const upsert = async (input: DecisionRulesInput): Promise<DecisionRules | null> => {
        if (!user) return null;

        const { data, error } = await supabase
            .from('decision_rules')
            .upsert({
                user_id: user.id,
                ...input,
                level_1: input.level_1 as unknown as Json,
                level_2: input.level_2 as unknown as Json,
                level_3: input.level_3 as unknown as Json,
                updated_at: new Date().toISOString(),
            } as DecisionRulesInsert, {
                onConflict: 'user_id',
            })
            .select()
            .single();

        if (error) {
            console.error('Error upserting decision rules:', error);
            return null;
        }

        return (data as DecisionRules);
    };

    const setTrigger = async (trigger: TriggerType): Promise<boolean> => {
        if (!user) return false;

        const { error } = await supabase
            .from('decision_rules')
            .upsert({
                user_id: user.id,
                primary_trigger: trigger,
                updated_at: new Date().toISOString(),
            } as DecisionRulesInsert, {
                onConflict: 'user_id',
            });

        if (error) {
            console.error('Error setting trigger:', error);
            return false;
        }

        return true;
    };

    const setDefaultAction = async (action: DefaultAction): Promise<boolean> => {
        if (!user) return false;

        const { error } = await supabase
            .from('decision_rules')
            .upsert({
                user_id: user.id,
                default_action: action,
                updated_at: new Date().toISOString(),
            } as DecisionRulesInsert, {
                onConflict: 'user_id',
            });

        if (error) {
            console.error('Error setting default action:', error);
            return false;
        }

        return true;
    };

    const updateLevel = async (level: 1 | 2 | 3, actions: LevelAction[]): Promise<boolean> => {
        if (!user) return false;

        const levelKey = `level_${level}`;

        const { error } = await supabase
            .from('decision_rules')
            .upsert({
                user_id: user.id,
                [levelKey]: actions as unknown as Json,
                updated_at: new Date().toISOString(),
            } as DecisionRulesInsert, {
                onConflict: 'user_id',
            });

        if (error) {
            console.error('Error updating level:', error);
            return false;
        }

        return true;
    };

    const getTriggerLabel = (trigger: TriggerType): string => {
        const labels: Record<TriggerType, string> = {
            anxiety: 'Ansiedade',
            boredom: 'Tédio',
            social_pressure: 'Pressão Social',
            tiredness: 'Cansaço',
            family: 'Família',
            other: 'Outro',
        };
        return labels[trigger] || trigger;
    };

    const getActionLabel = (action: DefaultAction): string => {
        const labels: Record<DefaultAction, string> = {
            pause_24h: 'Pausar 24h',
            open_dashboard: 'Abrir Dashboard',
            call_someone: 'Ligar para Alguém',
            walk_10min: 'Caminhar 10min',
            breathe: 'Respirar',
            other: 'Outro',
        };
        return labels[action] || action;
    };

    return {
        fetch,
        upsert,
        setTrigger,
        setDefaultAction,
        updateLevel,
        getTriggerLabel,
        getActionLabel,
    };
};
