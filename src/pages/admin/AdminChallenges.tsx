import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, CheckSquare, Paperclip, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ChallengeDay {
  id: number;
  title: string;
  subtitle: string;
  emoji: string;
  task_steps: any[];
  tools: string[];
}

export const AdminChallenges = () => {
  const [days, setDays] = useState<ChallengeDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDays();
  }, []);

  const fetchDays = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('days')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching days:', error);
    } else {
      setDays((data || []).map((d: any) => ({
        ...d,
        task_steps: Array.isArray(d.task_steps) ? d.task_steps : [],
        tools: Array.isArray(d.tools) ? d.tools : [],
      })));
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Excluir este dia? Esta ação não pode ser desfeita.')) return;

    setDeleteLoading(id);
    const { error } = await supabase.from('days').delete().eq('id', id);

    if (error) {
      toast({ title: 'Erro ao excluir', variant: 'destructive' });
    } else {
      setDays(prev => prev.filter(d => d.id !== id));
      toast({ title: 'Dia excluído!' });
    }
    setDeleteLoading(null);
  };

  const handleCreate = async () => {
    const nextId = days.length > 0 ? Math.max(...days.map(d => d.id)) + 1 : 1;
    
    const { error } = await supabase.from('days').insert({
      id: nextId,
      title: `Dia ${nextId}`,
      subtitle: 'Novo dia do desafio',
      emoji: '📅',
      task_steps: [],
      tools: [],
      reflection_questions: [],
    });

    if (error) {
      toast({ title: 'Erro ao criar', variant: 'destructive' });
    } else {
      toast({ title: 'Dia criado!' });
      navigate(`/admin/challenges/${nextId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin mr-2" /> Carregando desafios...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Desafios</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Crie e edite o conteúdo dos 15 dias do desafio.
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus size={18} /> Novo Dia
        </Button>
      </div>

      {days.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-bold mb-2">Nenhum dia cadastrado</h3>
          <p className="text-muted-foreground mb-4">
            Clique em "Novo Dia" para começar a criar o conteúdo do desafio.
          </p>
          <Button onClick={handleCreate} className="gap-2">
            <Plus size={18} /> Criar Primeiro Dia
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {days.map((day) => (
            <div
              key={day.id}
              className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:scale-[1.01] transition-transform"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">{day.emoji}</div>
                <div>
                  <h3 className="text-lg font-bold">
                    Dia {day.id}: {day.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{day.subtitle}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CheckSquare size={14} />
                      {Array.isArray(day.task_steps) ? day.task_steps.length : 0} tarefas
                    </span>
                    <span className="flex items-center gap-1">
                      <Paperclip size={14} />
                      {Array.isArray(day.tools) ? day.tools.length : 0} materiais
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/admin/challenges/${day.id}`)}
                  className="gap-2"
                >
                  <Edit2 size={16} /> Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(day.id)}
                  disabled={deleteLoading === day.id}
                  className="gap-2 text-destructive hover:text-destructive"
                >
                  {deleteLoading === day.id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
