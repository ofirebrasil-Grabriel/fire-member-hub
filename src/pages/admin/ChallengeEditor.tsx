import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Save, ArrowLeft, Plus, Trash2, Upload, Loader2, FileText, Mic, Headphones, ArrowUp, ArrowDown
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

interface TaskStep {
  id: string;
  text: string;
}

interface DayData {
  id: number;
  title: string;
  subtitle: string;
  emoji: string;
  morning_message: string | null;
  morning_audio_url: string | null;
  concept: string | null;
  concept_title: string | null;
  concept_audio_url: string | null;
  task_title: string | null;
  task_steps: TaskStep[];
  tools: string[];
  reflection_questions: string[];
  commitment: string | null;
  next_day_preview: string | null;
  description: string | null;
  challenge_details: string | null;
}

export const ChallengeEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [day, setDay] = useState<DayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchDay(parseInt(id));
    }
  }, [id]);

  const fetchDay = async (dayId: number) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('days')
      .select('*')
      .eq('id', dayId)
      .single();

    if (error || !data) {
      toast({ title: 'Dia não encontrado', variant: 'destructive' });
      navigate('/admin/challenges');
      return;
    }

    setDay({
      ...data,
      task_steps: Array.isArray(data.task_steps) ? data.task_steps as TaskStep[] : [],
      tools: Array.isArray(data.tools) ? data.tools as string[] : [],
      reflection_questions: Array.isArray(data.reflection_questions) ? data.reflection_questions as string[] : [],
    });
    setLoading(false);
  };

  const handleChange = (field: keyof DayData, value: any) => {
    if (!day) return;
    setDay({ ...day, [field]: value });
  };

  const handleTaskChange = (index: number, value: string) => {
    if (!day) return;
    const newTasks = [...day.task_steps];
    newTasks[index] = { ...newTasks[index], text: value };
    setDay({ ...day, task_steps: newTasks });
  };

  const handleAddTask = () => {
    if (!day) return;
    const newTask: TaskStep = { id: `task-${Date.now()}`, text: 'Nova tarefa' };
    setDay({ ...day, task_steps: [...day.task_steps, newTask] });
  };

  const handleDeleteTask = (index: number) => {
    if (!day) return;
    const newTasks = day.task_steps.filter((_, i) => i !== index);
    setDay({ ...day, task_steps: newTasks });
  };

  const moveTask = (index: number, direction: 'up' | 'down') => {
    if (!day) return;
    const newTasks = [...day.task_steps];
    if (direction === 'up' && index > 0) {
      [newTasks[index], newTasks[index - 1]] = [newTasks[index - 1], newTasks[index]];
    } else if (direction === 'down' && index < newTasks.length - 1) {
      [newTasks[index], newTasks[index + 1]] = [newTasks[index + 1], newTasks[index]];
    }
    setDay({ ...day, task_steps: newTasks });
  };

  const handleToolChange = (index: number, value: string) => {
    if (!day) return;
    const newTools = [...day.tools];
    newTools[index] = value;
    setDay({ ...day, tools: newTools });
  };

  const handleAddTool = () => {
    if (!day) return;
    setDay({ ...day, tools: [...day.tools, 'Novo Material'] });
  };

  const handleDeleteTool = (index: number) => {
    if (!day) return;
    setDay({ ...day, tools: day.tools.filter((_, i) => i !== index) });
  };

  const handleQuestionChange = (index: number, value: string) => {
    if (!day) return;
    const newQuestions = [...day.reflection_questions];
    newQuestions[index] = value;
    setDay({ ...day, reflection_questions: newQuestions });
  };

  const handleAddQuestion = () => {
    if (!day) return;
    setDay({ ...day, reflection_questions: [...day.reflection_questions, 'Nova pergunta de reflexão?'] });
  };

  const handleDeleteQuestion = (index: number) => {
    if (!day) return;
    setDay({ ...day, reflection_questions: day.reflection_questions.filter((_, i) => i !== index) });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, field: 'morning_audio_url' | 'concept_audio_url') => {
    if (!event.target.files || !event.target.files[0] || !day) return;
    const file = event.target.files[0];

    if (file.size > 50 * 1024 * 1024) {
      toast({ title: 'Arquivo muito grande (máx 50MB)', variant: 'destructive' });
      return;
    }

    setUploading(field);
    try {
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `day-${day.id}/${Date.now()}-${sanitizedName}`;

      const { error: uploadError } = await supabase.storage
        .from('challenge-assets')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('challenge-assets')
        .getPublicUrl(filePath);

      handleChange(field, publicUrl);
      toast({ title: 'Áudio enviado!' });
    } catch (error: any) {
      toast({ title: 'Erro no upload: ' + error.message, variant: 'destructive' });
    } finally {
      setUploading(null);
      event.target.value = '';
    }
  };

  const handleSave = async () => {
    if (!day) return;
    setSaving(true);

    const { error } = await supabase
      .from('days')
      .update({
        title: day.title,
        subtitle: day.subtitle,
        emoji: day.emoji,
        morning_message: day.morning_message,
        morning_audio_url: day.morning_audio_url,
        concept: day.concept,
        concept_title: day.concept_title,
        concept_audio_url: day.concept_audio_url,
        task_title: day.task_title,
        task_steps: day.task_steps as any,
        tools: day.tools,
        reflection_questions: day.reflection_questions,
        commitment: day.commitment,
        next_day_preview: day.next_day_preview,
        description: day.description,
        challenge_details: day.challenge_details,
      })
      .eq('id', day.id);

    if (error) {
      toast({ title: 'Erro ao salvar: ' + error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Salvo com sucesso!' });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin mr-2" /> Carregando editor...
      </div>
    );
  }

  if (!day) return null;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/challenges')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <span className="text-primary text-xs font-bold uppercase">Editar Conteúdo</span>
            <h1 className="text-2xl font-bold">Dia {day.id}</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/admin/challenges')}>Cancelar</Button>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
            Salvar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          {/* Basic Info */}
          <section className="glass-card p-6 space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FileText size={20} className="text-primary" /> Dados do Dia
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Título</label>
                <Input
                  value={day.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Emoji</label>
                <Input
                  value={day.emoji}
                  onChange={(e) => handleChange('emoji', e.target.value)}
                  className="mt-1 w-20"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Subtítulo</label>
              <Input
                value={day.subtitle}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Descrição</label>
              <Textarea
                value={day.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={2}
                className="mt-1"
              />
            </div>
          </section>

          {/* Morning Message */}
          <section className="glass-card p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Mensagem Matinal</h2>
              <label className="cursor-pointer flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 bg-primary/10 px-3 py-1.5 rounded">
                {uploading === 'morning_audio_url' ? <Loader2 size={14} className="animate-spin" /> : <Mic size={14} />}
                {uploading === 'morning_audio_url' ? 'Enviando...' : 'Upload Áudio'}
                <input type="file" accept="audio/*" className="hidden" onChange={(e) => handleFileUpload(e, 'morning_audio_url')} />
              </label>
            </div>
            {day.morning_audio_url && (
              <div className="text-xs text-success flex items-center gap-1">
                <Headphones size={12} /> Áudio vinculado
              </div>
            )}
            <Textarea
              value={day.morning_message || ''}
              onChange={(e) => handleChange('morning_message', e.target.value)}
              rows={4}
              placeholder="Mensagem de bom dia para o participante..."
            />
          </section>

          {/* Fire Concept */}
          <section className="glass-card p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Conceito FIRE</h2>
              <label className="cursor-pointer flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 bg-primary/10 px-3 py-1.5 rounded">
                {uploading === 'concept_audio_url' ? <Loader2 size={14} className="animate-spin" /> : <Mic size={14} />}
                {uploading === 'concept_audio_url' ? 'Enviando...' : 'Upload Áudio'}
                <input type="file" accept="audio/*" className="hidden" onChange={(e) => handleFileUpload(e, 'concept_audio_url')} />
              </label>
            </div>
            {day.concept_audio_url && (
              <div className="text-xs text-success flex items-center gap-1">
                <Headphones size={12} /> Áudio vinculado
              </div>
            )}
            <Input
              value={day.concept_title || ''}
              onChange={(e) => handleChange('concept_title', e.target.value)}
              placeholder="Título do conceito"
            />
            <Textarea
              value={day.concept || ''}
              onChange={(e) => handleChange('concept', e.target.value)}
              rows={4}
              placeholder="Explicação do conceito FIRE do dia..."
            />
          </section>

          {/* Tasks */}
          <section className="glass-card p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Tarefas</h2>
              <Button size="sm" onClick={handleAddTask} className="gap-1">
                <Plus size={16} /> Adicionar
              </Button>
            </div>
            <Input
              value={day.task_title || ''}
              onChange={(e) => handleChange('task_title', e.target.value)}
              placeholder="Título da seção de tarefas"
              className="mb-2"
            />
            <div className="space-y-2">
              {day.task_steps.map((task, index) => (
                <div key={task.id || index} className="flex items-center gap-2 bg-surface p-2 rounded-lg">
                  <div className="flex flex-col gap-1">
                    <button onClick={() => moveTask(index, 'up')} disabled={index === 0} className="p-1 hover:bg-muted rounded disabled:opacity-30">
                      <ArrowUp size={12} />
                    </button>
                    <button onClick={() => moveTask(index, 'down')} disabled={index === day.task_steps.length - 1} className="p-1 hover:bg-muted rounded disabled:opacity-30">
                      <ArrowDown size={12} />
                    </button>
                  </div>
                  <Input
                    value={task.text}
                    onChange={(e) => handleTaskChange(index, e.target.value)}
                    className="flex-1"
                  />
                  <button onClick={() => handleDeleteTask(index)} className="p-2 text-destructive hover:bg-destructive/10 rounded">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Commitment & Next Day */}
          <section className="glass-card p-6 space-y-4">
            <h2 className="text-xl font-bold">Compromisso & Prévia</h2>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Compromisso do Dia</label>
              <Textarea
                value={day.commitment || ''}
                onChange={(e) => handleChange('commitment', e.target.value)}
                rows={2}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Prévia do Próximo Dia</label>
              <Input
                value={day.next_day_preview || ''}
                onChange={(e) => handleChange('next_day_preview', e.target.value)}
                className="mt-1"
              />
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Tools */}
          <section className="glass-card p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Materiais</h2>
              <Button size="sm" variant="outline" onClick={handleAddTool}>
                <Plus size={14} />
              </Button>
            </div>
            <div className="space-y-2">
              {day.tools.map((tool, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={tool}
                    onChange={(e) => handleToolChange(index, e.target.value)}
                    className="flex-1"
                  />
                  <button onClick={() => handleDeleteTool(index)} className="p-2 text-destructive hover:bg-destructive/10 rounded">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Reflection Questions */}
          <section className="glass-card p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Reflexões</h2>
              <Button size="sm" variant="outline" onClick={handleAddQuestion}>
                <Plus size={14} />
              </Button>
            </div>
            <div className="space-y-2">
              {day.reflection_questions.map((question, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Textarea
                    value={question}
                    onChange={(e) => handleQuestionChange(index, e.target.value)}
                    rows={2}
                    className="flex-1"
                  />
                  <button onClick={() => handleDeleteQuestion(index)} className="p-2 text-destructive hover:bg-destructive/10 rounded">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
