import { useEffect, useState } from 'react';
import { Settings, Plus, Edit, Trash2, Save, Copy, Check, ExternalLink, Webhook, AlertTriangle, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import type { Json } from '@/integrations/supabase/types';

interface Setting {
  id: string;
  key: string;
  value: Json;
  description: string | null;
}

export const AdminSettings = () => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  
  const [showModal, setShowModal] = useState(false);
  const [editingSetting, setEditingSetting] = useState<Setting | null>(null);
  const [formData, setFormData] = useState({ key: '', value: '', description: '' });
  const [aiBudgetInput, setAiBudgetInput] = useState('');
  const [aiEnabled, setAiEnabled] = useState(true);
  const [aiProvider, setAiProvider] = useState<'openai' | 'google'>('openai');
  const [aiModel, setAiModel] = useState('gpt-4o-mini');

  const aiBudgetSetting = settings.find((setting) => setting.key === 'ai_budget_brl');
  const aiEnabledSetting = settings.find((setting) => setting.key === 'ai_enabled');
  const aiProviderSetting = settings.find((setting) => setting.key === 'ai_provider');
  const aiModelSetting = settings.find((setting) => setting.key === 'ai_model');

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (!aiBudgetSetting) {
      setAiBudgetInput('');
      return;
    }
    const value = typeof aiBudgetSetting.value === 'number'
      ? String(aiBudgetSetting.value)
      : typeof aiBudgetSetting.value === 'string'
        ? aiBudgetSetting.value
        : JSON.stringify(aiBudgetSetting.value);
    setAiBudgetInput(value);
  }, [aiBudgetSetting]);

  useEffect(() => {
    setAiEnabled(typeof aiEnabledSetting?.value === 'boolean' ? aiEnabledSetting.value : true);

    const providerValue = typeof aiProviderSetting?.value === 'string'
      ? aiProviderSetting.value
      : 'openai';
    setAiProvider(providerValue === 'google' ? 'google' : 'openai');

    const modelValue = typeof aiModelSetting?.value === 'string'
      ? aiModelSetting.value
      : providerValue === 'google'
        ? 'gemini-1.5-flash'
        : 'gpt-4o-mini';
    setAiModel(modelValue);

  }, [aiEnabledSetting, aiProviderSetting, aiModelSetting]);

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .order('key');

    if (error) {
      console.error('Error fetching settings:', error);
    } else {
      setSettings(data || []);
    }
    setLoading(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    toast({ title: 'URL copiada!' });
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const openModal = (setting?: Setting) => {
    if (setting) {
      setEditingSetting(setting);
      setFormData({
        key: setting.key,
        value: typeof setting.value === 'string' ? setting.value : JSON.stringify(setting.value),
        description: setting.description || '',
      });
    } else {
      setEditingSetting(null);
      setFormData({ key: '', value: '', description: '' });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    let value = formData.value;
    try {
      value = JSON.parse(formData.value);
    } catch {
      // Mantem valor como string se nao for JSON valido
    }

    if (editingSetting) {
      const { error } = await supabase
        .from('settings')
        .update({ value, description: formData.description, updated_at: new Date().toISOString() })
        .eq('id', editingSetting.id);

      if (error) {
        toast({ title: 'Erro ao salvar', variant: 'destructive' });
      } else {
        toast({ title: 'Configuração atualizada!' });
        fetchSettings();
      }
    } else {
      const { error } = await supabase
        .from('settings')
        .insert({ key: formData.key, value, description: formData.description });

      if (error) {
        toast({ title: 'Erro ao criar', variant: 'destructive' });
      } else {
        toast({ title: 'Configuração criada!' });
        fetchSettings();
      }
    }
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta configuração?')) return;

    const { error } = await supabase.from('settings').delete().eq('id', id);

    if (error) {
      toast({ title: 'Erro ao excluir', variant: 'destructive' });
    } else {
      toast({ title: 'Configuração excluída!' });
      fetchSettings();
    }
  };

  const handleSaveAiBudget = async () => {
    const normalized = aiBudgetInput.replace(',', '.');
    const parsed = Number(normalized);
    if (!Number.isFinite(parsed) || parsed < 0) {
      toast({ title: 'Informe um valor valido em R$', variant: 'destructive' });
      return;
    }

    const description = 'Limite global de gasto com IA (R$)';
    if (aiBudgetSetting) {
      const { error } = await supabase
        .from('settings')
        .update({ value: parsed, description, updated_at: new Date().toISOString() })
        .eq('id', aiBudgetSetting.id);

      if (error) {
        toast({ title: 'Erro ao salvar limite', variant: 'destructive' });
        return;
      }
    } else {
      const { error } = await supabase
        .from('settings')
        .insert({ key: 'ai_budget_brl', value: parsed, description });

      if (error) {
        toast({ title: 'Erro ao criar limite', variant: 'destructive' });
        return;
      }
    }

    toast({ title: 'Limite de IA atualizado!' });
    fetchSettings();
  };

  const upsertSetting = async (key: string, value: Json, description: string) => {
    const existing = settings.find((setting) => setting.key === key);
    if (existing) {
      const { error } = await supabase
        .from('settings')
        .update({ value, description, updated_at: new Date().toISOString() })
        .eq('id', existing.id);
      return error;
    }
    const { error } = await supabase
      .from('settings')
      .insert({ key, value, description });
    return error;
  };

  const handleSaveAiConfig = async () => {
    const errors = await Promise.all([
      upsertSetting('ai_enabled', aiEnabled, 'Ativa/desativa a IA nos relatorios'),
      upsertSetting('ai_provider', aiProvider, 'Provider da IA (openai | google)'),
      upsertSetting('ai_model', aiModel, 'Modelo usado para gerar relatorios'),
    ]);

    if (errors.some((err) => err)) {
      toast({ title: 'Erro ao salvar configuracoes de IA', variant: 'destructive' });
      return;
    }

    toast({ title: 'Configuracoes de IA atualizadas!' });
    fetchSettings();
  };

  const hotmartWebhookUrl = 'https://gvjvygukvupjxadevduj.supabase.co/functions/v1/hotmart-webhook';
  const n8nWebhookUrl = 'https://gvjvygukvupjxadevduj.supabase.co/functions/v1/n8n-webhook';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Gerencie integrações e configurações do sistema.
        </p>
      </div>

      {/* Webhook URLs */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <img src="https://hotmart.com/favicon.ico" alt="" className="w-5 h-5" />
            Hotmart Webhook
          </h3>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-surface">
              <p className="text-xs text-muted-foreground mb-1">URL do Webhook</p>
              <div className="flex items-center gap-2">
                <code className="text-sm text-primary break-all flex-1">{hotmartWebhookUrl}</code>
                <button onClick={() => copyToClipboard(hotmartWebhookUrl)} className="p-2 rounded-lg hover:bg-muted transition-colors">
                  {copiedUrl === hotmartWebhookUrl ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                </button>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-success/10 border border-success/30 text-sm text-success space-y-1">
              <p>✓ Cria usuário automaticamente em compras aprovadas</p>
              <p>✓ Bloqueia acesso em cancelamentos/reembolsos</p>
            </div>
            <a 
              href="https://app.hotmart.com/tools/webhook" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-fire text-sm inline-flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Configurar na Hotmart
            </a>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Webhook className="w-5 h-5 text-primary" />
            n8n Webhook
          </h3>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-surface">
              <p className="text-xs text-muted-foreground mb-1">URL do Webhook</p>
              <div className="flex items-center gap-2">
                <code className="text-sm text-primary break-all flex-1">{n8nWebhookUrl}</code>
                <button onClick={() => copyToClipboard(n8nWebhookUrl)} className="p-2 rounded-lg hover:bg-muted transition-colors">
                  {copiedUrl === n8nWebhookUrl ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                </button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Eventos: send_welcome_email, send_milestone_email, get_user_progress, get_milestone_users
            </p>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              Limite global de IA
            </h3>
            <p className="text-sm text-muted-foreground">
              Define o teto mensal em R$ para uso de IA (Google/OpenAI).
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="0"
              step="1"
              value={aiBudgetInput}
              onChange={(e) => setAiBudgetInput(e.target.value)}
              placeholder="0"
              className="w-32"
            />
            <Button onClick={handleSaveAiBudget} className="gap-2">
              <Save className="w-4 h-4" />
              Salvar
            </Button>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              IA dos Relatórios
            </h3>
            <p className="text-sm text-muted-foreground">
              Define o provider, modelo e comportamento da IA no relatorio do dia.
            </p>
            <p className="text-xs text-muted-foreground">
              Chaves: configure no Supabase Secrets (OPENAI_API_KEY ou GOOGLE_API_KEY).
            </p>
          </div>
          <Button onClick={handleSaveAiConfig} className="gap-2">
            <Save className="w-4 h-4" />
            Salvar IA
          </Button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="flex items-center justify-between gap-4 rounded-lg border border-border/60 bg-surface/40 px-4 py-3">
            <div>
              <p className="text-sm font-medium">IA ativa</p>
              <p className="text-xs text-muted-foreground">
                Desative se quiser usar apenas o relatorio padrao.
              </p>
            </div>
            <Switch checked={aiEnabled} onCheckedChange={setAiEnabled} />
          </div>

          <div className="rounded-lg border border-border/60 bg-surface/40 px-4 py-3">
            <p className="text-sm font-medium mb-2">Provider</p>
            <Select value={aiProvider} onValueChange={(value) => setAiProvider(value as 'openai' | 'google')}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="google">Google</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border border-border/60 bg-surface/40 px-4 py-3">
            <p className="text-sm font-medium mb-2">Modelo</p>
            <Input
              value={aiModel}
              onChange={(e) => setAiModel(e.target.value)}
              placeholder={aiProvider === 'google' ? 'gemini-1.5-flash' : 'gpt-4o-mini'}
            />
          </div>

        </div>
      </div>

      {/* Settings List */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Settings size={18} /> Configurações do Sistema
          </h3>
          <Button size="sm" onClick={() => openModal()} className="gap-1">
            <Plus size={14} /> Nova
          </Button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Carregando...</div>
        ) : settings.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            Nenhuma configuração encontrada.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {settings.map((setting) => (
              <div key={setting.id} className="p-4 flex items-center justify-between gap-4 hover:bg-surface/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{setting.key}</p>
                  <p className="text-sm text-muted-foreground truncate">{setting.description}</p>
                  <code className="text-xs text-primary mt-1 block truncate">
                    {typeof setting.value === 'string' ? setting.value : JSON.stringify(setting.value)}
                  </code>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openModal(setting)}>
                    <Edit size={14} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(setting.id)} className="text-destructive">
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSetting ? 'Editar Configuração' : 'Nova Configuração'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Chave</label>
              <Input
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                disabled={!!editingSetting}
                placeholder="ex: n8n_webhook_url"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Valor</label>
              <Textarea
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                rows={3}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Descrição</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição da configuração"
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
