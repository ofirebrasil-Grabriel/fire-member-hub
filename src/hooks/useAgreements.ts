import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

import { Database } from '@/integrations/supabase/types';

export type Agreement = Database['public']['Tables']['agreements']['Row'];
export type AgreementInsert = Database['public']['Tables']['agreements']['Insert'];
export type AgreementUpdate = Database['public']['Tables']['agreements']['Update'];

export type AgreementInput = AgreementInsert;

export const useAgreements = () => {
    const { user } = useAuth();

    const fetchAll = async (): Promise<Agreement[]> => {
        if (!user) return [];

        const { data, error } = await supabase
            .from('agreements')
            .select('*')
            .eq('user_id', user.id)
            .order('start_date', { ascending: false });

        if (error) {
            console.error('Error fetching agreements:', error);
            return [];
        }

        return (data as Agreement[]) || [];
    };

    const fetchActive = async (): Promise<Agreement[]> => {
        if (!user) return [];

        const { data, error } = await supabase
            .from('agreements')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .order('next_payment_date', { ascending: true });

        if (error) {
            console.error('Error fetching active agreements:', error);
            return [];
        }

        return (data as Agreement[]) || [];
    };

    const create = async (input: AgreementInput): Promise<Agreement | null> => {
        if (!user) return null;

        const { data, error } = await supabase
            .from('agreements')
            .insert({
                user_id: user.id,
                ...input,
            } as AgreementInsert)
            .select()
            .single();

        if (error) {
            console.error('Error creating agreement:', error);
            return null;
        }

        // Se tiver debt_id, atualizar status da dívida
        if (input.debt_id) {
            await supabase
                .from('debts')
                .update({ status: 'negotiating' })
                .eq('id', input.debt_id);
        }

        return data as Agreement;
    };

    const update = async (id: string, input: Partial<AgreementInput>): Promise<Agreement | null> => {
        if (!user) return null;

        const { data, error } = await supabase
            .from('agreements')
            .update({
                ...input,
                updated_at: new Date().toISOString(),
            } as AgreementUpdate)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) {
            console.error('Error updating agreement:', error);
            return null;
        }

        return data as Agreement;
    };

    const registerPayment = async (id: string): Promise<boolean> => {
        if (!user) return false;

        const { data: agreement, error: fetchError } = await supabase
            .from('agreements')
            .select('*')
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (fetchError || !agreement) {
            console.error('Error fetching agreement for payment:', fetchError);
            return false;
        }

        const newPaidInstallments = agreement.paid_installments + 1;
        const isCompleted = newPaidInstallments >= agreement.installments;

        // Calcular próxima data de pagamento
        let nextPaymentDate = null;
        if (!isCompleted && agreement.next_payment_date) {
            const next = new Date(agreement.next_payment_date);
            next.setMonth(next.getMonth() + 1);
            nextPaymentDate = next.toISOString().split('T')[0];
        }

        const { error } = await supabase
            .from('agreements')
            .update({
                paid_installments: newPaidInstallments,
                status: isCompleted ? 'completed' : 'active',
                next_payment_date: nextPaymentDate,
                updated_at: new Date().toISOString(),
            } as AgreementUpdate)
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) {
            console.error('Error registering payment:', error);
            return false;
        }

        // Se completou e tem debt_id, marcar dívida como paga
        if (isCompleted && agreement.debt_id) {
            await supabase
                .from('debts')
                .update({ status: 'paid' })
                .eq('id', agreement.debt_id);
        }

        return true;
    };

    const remove = async (id: string): Promise<boolean> => {
        if (!user) return false;

        const { error } = await supabase
            .from('agreements')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) {
            console.error('Error deleting agreement:', error);
            return false;
        }

        return true;
    };

    const getTotalMonthlyPayments = async (): Promise<number> => {
        const agreements = await fetchActive();
        return agreements.reduce((sum, a) => sum + a.monthly_payment, 0);
    };

    const getTotalSavings = async (): Promise<number> => {
        const agreements = await fetchAll();
        return agreements.reduce((sum, a) => sum + (a.savings || 0), 0);
    };

    const getUpcomingPayments = async (days: number = 7): Promise<Agreement[]> => {
        if (!user) return [];

        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + days);

        const { data, error } = await supabase
            .from('agreements')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .gte('next_payment_date', today.toISOString().split('T')[0])
            .lte('next_payment_date', futureDate.toISOString().split('T')[0])
            .order('next_payment_date', { ascending: true });

        if (error) {
            console.error('Error fetching upcoming payments:', error);
            return [];
        }

        return (data as Agreement[]) || [];
    };

    return {
        fetchAll,
        fetchActive,
        create,
        update,
        registerPayment,
        remove,
        getTotalMonthlyPayments,
        getTotalSavings,
        getUpcomingPayments,
    };
};
