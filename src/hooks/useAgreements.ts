import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Define Agreement types locally since the table might not be in generated types yet
export interface Agreement {
  id: string;
  user_id: string;
  debt_id: string | null;
  negotiation_plan_id: string | null;
  creditor_name: string;
  original_value: number | null;
  total_amount: number;
  entry_amount: number | null;
  monthly_payment: number;
  interest_rate: number | null;
  installments: number;
  start_date: string;
  end_date: string | null;
  next_payment_date: string | null;
  contract_path: string | null;
  boleto_path: string | null;
  status: string | null;
  paid_installments: number | null;
  savings: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface AgreementInsert {
  user_id: string;
  debt_id?: string | null;
  negotiation_plan_id?: string | null;
  creditor_name: string;
  original_value?: number | null;
  total_amount: number;
  entry_amount?: number | null;
  monthly_payment: number;
  interest_rate?: number | null;
  installments: number;
  start_date: string;
  end_date?: string | null;
  next_payment_date?: string | null;
  contract_path?: string | null;
  boleto_path?: string | null;
  status?: string | null;
  paid_installments?: number | null;
  savings?: number | null;
}

export type AgreementUpdate = Partial<AgreementInsert>;
export type AgreementInput = Omit<AgreementInsert, 'user_id'>;

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
            })
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
            })
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

        const typedAgreement = agreement as Agreement;
        const newPaidInstallments = (typedAgreement.paid_installments || 0) + 1;
        const isCompleted = newPaidInstallments >= typedAgreement.installments;

        // Calcular próxima data de pagamento
        let nextPaymentDate: string | null = null;
        if (!isCompleted && typedAgreement.next_payment_date) {
            const next = new Date(typedAgreement.next_payment_date);
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
            })
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) {
            console.error('Error registering payment:', error);
            return false;
        }

        // Se completou e tem debt_id, marcar dívida como paga
        if (isCompleted && typedAgreement.debt_id) {
            await supabase
                .from('debts')
                .update({ status: 'paid' })
                .eq('id', typedAgreement.debt_id);
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
