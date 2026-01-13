import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CalendarItem {
  id: string;
  user_id: string;
  title: string;
  value: number | null;
  due_date: string | null;
  is_fixed: boolean | null;
  is_critical: boolean | null;
  source_debt_id: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CalendarItemInput {
  title: string;
  value?: number | null;
  due_date?: string | null;
  is_fixed?: boolean | null;
  is_critical?: boolean | null;
  source_debt_id?: string | null;
}

export const useCalendarItems = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ['calendar_items', user?.id];

  const { data, isLoading, error } = useQuery({
    queryKey,
    enabled: !!user?.id,
    queryFn: async () => {
      const { data: items, error: fetchError } = await supabase
        .from('calendar_items')
        .select('*')
        .eq('user_id', user?.id || '')
        .order('due_date', { ascending: true });

      if (fetchError) throw fetchError;
      return (items || []) as CalendarItem[];
    },
  });

  const addItem = useMutation({
    mutationFn: async (payload: CalendarItemInput) => {
      if (!user?.id) throw new Error('Usuario nao autenticado');
      const { error: insertError } = await supabase
        .from('calendar_items')
        .insert({
          user_id: user.id,
          ...payload,
        });

      if (insertError) throw insertError;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const updateItem = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: CalendarItemInput }) => {
      if (!user?.id) throw new Error('Usuario nao autenticado');
      const { error: updateError } = await supabase
        .from('calendar_items')
        .update(payload)
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      if (!user?.id) throw new Error('Usuario nao autenticado');
      const { error: deleteError } = await supabase
        .from('calendar_items')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const totalValue = useMemo(
    () => (data || []).reduce((sum, item) => sum + (item.value || 0), 0),
    [data]
  );

  const fixedCount = useMemo(
    () => (data || []).filter((item) => item.is_fixed).length,
    [data]
  );

  return {
    items: data || [],
    isLoading,
    error,
    addItem,
    updateItem,
    deleteItem,
    totalValue,
    fixedCount,
  };
};
