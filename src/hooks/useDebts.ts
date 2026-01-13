import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Debt {
  id: string;
  user_id: string;
  creditor: string;
  type: string | null;
  installment_value: number | null;
  total_balance: number | null;
  due_day: number | null;
  status: string;
  is_critical: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface DebtInput {
  creditor: string;
  type?: string | null;
  installment_value?: number | null;
  total_balance?: number | null;
  due_day?: number | null;
  status?: string;
  is_critical?: boolean | null;
}

export const useDebts = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ['debts', user?.id];

  const { data, isLoading, error } = useQuery({
    queryKey,
    enabled: !!user?.id,
    queryFn: async () => {
      const { data: debts, error: fetchError } = await supabase
        .from('debts')
        .select('*')
        .eq('user_id', user?.id || '')
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;
      return (debts || []) as Debt[];
    },
  });

  const addDebt = useMutation({
    mutationFn: async (payload: DebtInput) => {
      if (!user?.id) throw new Error('Usuario nao autenticado');
      const { error: insertError } = await supabase
        .from('debts')
        .insert({
          user_id: user.id,
          ...payload,
        });

      if (insertError) throw insertError;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const updateDebt = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: DebtInput }) => {
      if (!user?.id) throw new Error('Usuario nao autenticado');
      const { error: updateError } = await supabase
        .from('debts')
        .update(payload)
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const deleteDebt = useMutation({
    mutationFn: async (id: string) => {
      if (!user?.id) throw new Error('Usuario nao autenticado');
      const { error: deleteError } = await supabase
        .from('debts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const totalValue = useMemo(
    () => (data || []).reduce((sum, item) => sum + (item.total_balance || 0), 0),
    [data]
  );

  const criticalCount = useMemo(
    () => (data || []).filter((item) => item.is_critical).length,
    [data]
  );

  return {
    debts: data || [],
    isLoading,
    error,
    addDebt,
    updateDebt,
    deleteDebt,
    totalValue,
    criticalCount,
  };
};
