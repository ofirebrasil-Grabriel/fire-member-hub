import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type LibraryCategory = 'scripts' | 'anti' | 'cuts';

export interface LibraryItem {
  id: string;
  category: LibraryCategory;
  group_label: string | null;
  label: string;
  description: string | null;
  sort_order: number | null;
  created_at?: string;
  updated_at?: string;
}

export const useLibraryItems = () => {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('library_items')
      .select('*')
      .order('category', { ascending: true })
      .order('group_label', { ascending: true })
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    setItems((data || []) as LibraryItem[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return { items, loading, error, refetch: fetchItems };
};
