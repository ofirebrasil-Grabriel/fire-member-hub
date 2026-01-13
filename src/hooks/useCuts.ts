import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Cut {
  id: string;
  user_id: string;
  item: string;
  estimated_value: number | null;
  category: string | null;
  status: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface CutInput {
  item: string;
  estimated_value?: number | null;
  category?: string | null;
  status?: string;
}

export const useCuts = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ['cuts', user?.id];

  const { data, isLoading, error } = useQuery({
    queryKey,
    enabled: !!user?.id,
    queryFn: async () => {
      const { data: cuts, error: fetchError } = await supabase
        .from('cuts')
        .select('*')
        .eq('user_id', user?.id || '')
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;
      return (cuts || []) as Cut[];
    },
  });

  const addCut = useMutation({
    mutationFn: async (payload: CutInput) => {
      if (!user?.id) throw new Error('Usuario nao autenticado');
      const { error: insertError } = await supabase
        .from('cuts')
        .insert({
          user_id: user.id,
          ...payload,
        });

      if (insertError) throw insertError;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const updateCut = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: CutInput }) => {
      if (!user?.id) throw new Error('Usuario nao autenticado');
      const { error: updateError } = await supabase
        .from('cuts')
        .update(payload)
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const deleteCut = useMutation({
    mutationFn: async (id: string) => {
      if (!user?.id) throw new Error('Usuario nao autenticado');
      const { error: deleteError } = await supabase
        .from('cuts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const totalSavings = useMemo(
    () => (data || []).reduce((sum, item) => sum + (item.estimated_value || 0), 0),
    [data]
  );

  return {
    cuts: data || [],
    isLoading,
    error,
    addCut,
    updateCut,
    deleteCut,
    totalSavings,
  };
};
