import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Negotiation {
  id: string;
  user_id: string;
  debt_id: string | null;
  creditor: string;
  channel: string | null;
  script_used: boolean | null;
  status: string;
  max_entry: number | null;
  max_installment: number | null;
  notes: string | null;
  response: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface NegotiationInput {
  debt_id?: string | null;
  creditor: string;
  channel?: string | null;
  script_used?: boolean | null;
  status?: string;
  max_entry?: number | null;
  max_installment?: number | null;
  notes?: string | null;
  response?: string | null;
}

export const useNegotiations = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ['negotiations', user?.id];

  const { data, isLoading, error } = useQuery({
    queryKey,
    enabled: !!user?.id,
    queryFn: async () => {
      const { data: negotiations, error: fetchError } = await supabase
        .from('negotiations')
        .select('*')
        .eq('user_id', user?.id || '')
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;
      return (negotiations || []) as Negotiation[];
    },
  });

  const addNegotiation = useMutation({
    mutationFn: async (payload: NegotiationInput) => {
      if (!user?.id) throw new Error('Usuario nao autenticado');
      const { error: insertError } = await supabase
        .from('negotiations')
        .insert({
          user_id: user.id,
          ...payload,
        });

      if (insertError) throw insertError;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const updateNegotiation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: NegotiationInput }) => {
      if (!user?.id) throw new Error('Usuario nao autenticado');
      const { error: updateError } = await supabase
        .from('negotiations')
        .update(payload)
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const deleteNegotiation = useMutation({
    mutationFn: async (id: string) => {
      if (!user?.id) throw new Error('Usuario nao autenticado');
      const { error: deleteError } = await supabase
        .from('negotiations')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const acceptedCount = useMemo(
    () => (data || []).filter((item) => item.status === 'accepted').length,
    [data]
  );

  const pendingCount = useMemo(
    () => (data || []).filter((item) => item.status === 'pending').length,
    [data]
  );

  return {
    negotiations: data || [],
    isLoading,
    error,
    addNegotiation,
    updateNegotiation,
    deleteNegotiation,
    acceptedCount,
    pendingCount,
  };
};
