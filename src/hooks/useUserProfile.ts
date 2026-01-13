import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserProfile {
  id: string;
  user_id: string;
  fixed_time: string | null;
  sources: string[] | null;
  anxiety_score: number | null;
  clarity_score: number | null;
  no_new_debt_commitment: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface UserProfileInput {
  fixed_time?: string | null;
  sources?: string[] | null;
  anxiety_score?: number | null;
  clarity_score?: number | null;
  no_new_debt_commitment?: boolean | null;
}

export const useUserProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ['user_profile', user?.id];

  const { data, isLoading, error } = useQuery({
    queryKey,
    enabled: !!user?.id,
    queryFn: async () => {
      const { data: profile, error: fetchError } = await supabase
        .from('user_profile')
        .select('*')
        .eq('user_id', user?.id || '')
        .maybeSingle();

      if (fetchError) throw fetchError;
      return profile as UserProfile | null;
    },
  });

  const saveProfile = useMutation({
    mutationFn: async (payload: UserProfileInput) => {
      if (!user?.id) throw new Error('Usuario nao autenticado');
      const { error: upsertError } = await supabase
        .from('user_profile')
        .upsert({
          user_id: user.id,
          ...payload,
        }, {
          onConflict: 'user_id',
        });

      if (upsertError) throw upsertError;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    profile: data,
    isLoading,
    error,
    saveProfile,
  };
};
