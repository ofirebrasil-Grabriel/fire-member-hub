import { useEffect, useMemo, useState } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

type LibraryCategory = 'scripts' | 'anti' | 'cuts';

interface LibraryItem {
  id: string;
  category: LibraryCategory;
  group_label: string | null;
  label: string;
  description: string | null;
  sort_order: number | null;
}

const categoryLabels: Record<LibraryCategory, string> = {
  scripts: 'Scripts',
  anti: 'Anti-golpe',
  cuts: 'Cortes',
};

const emptyNewItem = (): Omit<LibraryItem, 'id'> => ({
  category: 'scripts',
  group_label: '',
  label: '',
  description: '',
  sort_order: 0,
});

export const AdminLibrary = () => {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [drafts, setDrafts] = useState<Record<string, LibraryItem>>({});
  const [newItem, setNewItem] = useState(emptyNewItem());
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | LibraryCategory>('all');

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('library_items')
      .select('*')
      .order('category', { ascending: true })
      .order('group_label', { ascending: true })
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      toast({ title: 'Erro ao carregar biblioteca', description: error.message, variant: 'destructive' });
      setLoading(false);
      return;
    }

    const typed = (data || []) as LibraryItem[];
    setItems(typed);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    const nextDrafts: Record<string, LibraryItem> = {};
    items.forEach((item) => {
      nextDrafts[item.id] = { ...item };
    });
    setDrafts(nextDrafts);
  }, [items]);

  const visibleItems = useMemo(() => {
    if (filter === 'all') return items;
    return items.filter((item) => item.category === filter);
  }, [items, filter]);

  const handleDraftChange = (id: string, field: keyof LibraryItem, value: string) => {
    setDrafts((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: field === 'sort_order' ? Number(value) : value,
      },
    }));
  };

  const handleSave = async (id: string) => {
    const draft = drafts[id];
    if (!draft) return;
    setSavingId(id);

    const payload = {
      category: draft.category,
      group_label: draft.group_label || null,
      label: draft.label,
      description: draft.description || null,
      sort_order: draft.sort_order ?? 0,
    };

    const { error } = await supabase
      .from('library_items')
      .update(payload)
      .eq('id', id);

    if (error) {
      toast({ title: 'Erro ao salvar item', description: error.message, variant: 'destructive' });
      setSavingId(null);
      return;
    }

    toast({ title: 'Item atualizado' });
    setSavingId(null);
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('library_items')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Erro ao remover item', description: error.message, variant: 'destructive' });
      return;
    }

    toast({ title: 'Item removido' });
    fetchItems();
  };

  const handleCreate = async () => {
    if (!newItem.label.trim()) {
      toast({ title: 'Informe o titulo do item', variant: 'destructive' });
      return;
    }

    const payload = {
      category: newItem.category,
      group_label: newItem.group_label?.trim() || null,
      label: newItem.label.trim(),
      description: newItem.description?.trim() || null,
      sort_order: newItem.sort_order ?? 0,
    };

    const { error } = await supabase.from('library_items').insert(payload);

    if (error) {
      toast({ title: 'Erro ao criar item', description: error.message, variant: 'destructive' });
      return;
    }

    toast({ title: 'Item criado' });
    setNewItem(emptyNewItem());
    fetchItems();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Biblioteca</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie scripts, checklist anti-golpe e listas de cortes.
        </p>
      </div>

      <div className="glass-card p-6 space-y-4">
        <h2 className="text-lg font-semibold">Novo item</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-xs text-muted-foreground">Categoria</label>
            <select
              value={newItem.category}
              onChange={(e) => setNewItem((prev) => ({ ...prev, category: e.target.value as LibraryCategory }))}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              {Object.entries(categoryLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Grupo (opcional)</label>
            <Input
              value={newItem.group_label || ''}
              onChange={(e) => setNewItem((prev) => ({ ...prev, group_label: e.target.value }))}
              placeholder="WhatsApp, Telefone, Assinaturas..."
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Titulo</label>
            <Input
              value={newItem.label}
              onChange={(e) => setNewItem((prev) => ({ ...prev, label: e.target.value }))}
              placeholder="Nome do item"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Ordem</label>
            <Input
              type="number"
              value={newItem.sort_order ?? 0}
              onChange={(e) => setNewItem((prev) => ({ ...prev, sort_order: Number(e.target.value) }))}
              className="mt-1"
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Descricao (opcional)</label>
          <Textarea
            value={newItem.description || ''}
            onChange={(e) => setNewItem((prev) => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="mt-1"
          />
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Adicionar item
        </Button>
      </div>

      <div className="glass-card p-6">
        <Tabs value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
          <TabsList className="grid grid-cols-2 gap-2 md:grid-cols-4">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="scripts">Scripts</TabsTrigger>
            <TabsTrigger value="anti">Anti-golpe</TabsTrigger>
            <TabsTrigger value="cuts">Cortes</TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="mt-4 space-y-3">
            {loading ? (
              <div className="text-sm text-muted-foreground">Carregando itens...</div>
            ) : visibleItems.length === 0 ? (
              <div className="text-sm text-muted-foreground">Nenhum item encontrado.</div>
            ) : (
              visibleItems.map((item) => (
                <div key={item.id} className="rounded-lg border border-border/60 bg-surface/40 p-4 space-y-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="text-xs text-muted-foreground">Categoria</label>
                      <select
                        value={drafts[item.id]?.category || item.category}
                        onChange={(e) => handleDraftChange(item.id, 'category', e.target.value)}
                        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                      >
                        {Object.entries(categoryLabels).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Grupo</label>
                      <Input
                        value={drafts[item.id]?.group_label || ''}
                        onChange={(e) => handleDraftChange(item.id, 'group_label', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Titulo</label>
                      <Input
                        value={drafts[item.id]?.label || ''}
                        onChange={(e) => handleDraftChange(item.id, 'label', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Ordem</label>
                      <Input
                        type="number"
                        value={drafts[item.id]?.sort_order ?? 0}
                        onChange={(e) => handleDraftChange(item.id, 'sort_order', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Descricao</label>
                    <Textarea
                      value={drafts[item.id]?.description || ''}
                      onChange={(e) => handleDraftChange(item.id, 'description', e.target.value)}
                      rows={2}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSave(item.id)}
                      disabled={savingId === item.id}
                    >
                      <Save className="h-4 w-4" />
                      Salvar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Remover
                    </Button>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
