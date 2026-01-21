import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAdmin, DayContent, Setting, UserWithProgress } from '@/hooks/useAdmin';
import { 
  Users, 
  Calendar, 
  Settings, 
  Webhook,
  BarChart3,
  Search,
  Edit,
  Trash,
  Shield,
  RefreshCw,
  Copy,
  Check,
  AlertTriangle,
  Save,
  ExternalLink,
  Plus,
  X
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { Navigate } from 'react-router-dom';

const Admin = () => {
  const { 
    isAdmin, 
    loading, 
    users, 
    webhookLogs, 
    settings, 
    stats,
    days,
    createUser,
    updateUser,
    updateUserStatus,
    updateSetting,
    createSetting,
    deleteSetting,
    deleteUser,
    createDay,
    updateDay,
    deleteDay,
    refetch 
  } = useAdmin();

  const [searchUsers, setSearchUsers] = useState('');
  const [selectedTab, setSelectedTab] = useState('users');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  
  // User dialogs
  const [editingUser, setEditingUser] = useState<UserWithProgress | null>(null);
  const [newUserDialog, setNewUserDialog] = useState(false);
  const [newUserData, setNewUserData] = useState({ email: '', password: '', full_name: '' });
  
  // Day dialogs
  const [editingDay, setEditingDay] = useState<DayContent | null>(null);
  const [newDayDialog, setNewDayDialog] = useState(false);
  
  // Setting dialogs
  type EditableSetting = Omit<Setting, 'value'> & { value: string };
  const [editingSetting, setEditingSetting] = useState<EditableSetting | null>(null);
  const [newSettingDialog, setNewSettingDialog] = useState(false);
  const [newSettingData, setNewSettingData] = useState({ key: '', value: '', description: '' });
  const [aiBudgetInput, setAiBudgetInput] = useState('');

  const aiBudgetSetting = settings.find((setting) => setting.key === 'ai_budget_brl');

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

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchUsers.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchUsers.toLowerCase())
  );

  const getStatusBadge = (status: string | null) => {
    const styles: Record<string, string> = {
      active: 'bg-success/15 text-success',
      canceled: 'bg-destructive/15 text-destructive',
      overdue: 'bg-warning/15 text-warning',
      refunded: 'bg-muted text-muted-foreground',
    };
    const labels: Record<string, string> = {
      active: 'Ativo',
      canceled: 'Cancelado',
      overdue: 'Vencido',
      refunded: 'Reembolsado',
    };
    const statusKey = status || 'none';
    return (
      <span className={cn('px-2 py-1 rounded-full text-xs font-medium', styles[statusKey] || 'bg-muted text-muted-foreground')}>
        {labels[statusKey] || 'Sem assinatura'}
      </span>
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    toast({ title: 'URL copiada!' });
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  // User handlers
  const handleCreateUser = async () => {
    if (!newUserData.email || !newUserData.password) {
      toast({ title: 'Preencha email e senha', variant: 'destructive' });
      return;
    }
    const success = await createUser(newUserData.email, newUserData.password, newUserData.full_name || 'Participante');
    if (success) {
      toast({ title: 'Usuário criado!' });
      setNewUserDialog(false);
      setNewUserData({ email: '', password: '', full_name: '' });
    } else {
      toast({ title: 'Erro ao criar usuário', variant: 'destructive' });
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    const success = await updateUser(editingUser.id, { 
      full_name: editingUser.full_name 
    });
    if (success) {
      toast({ title: 'Usuário atualizado!' });
      setEditingUser(null);
    } else {
      toast({ title: 'Erro ao atualizar', variant: 'destructive' });
    }
  };

  const handleUpdateUserStatus = async (userId: string, status: string) => {
    const success = await updateUserStatus(userId, status);
    if (success) {
      toast({ title: 'Status atualizado!' });
    } else {
      toast({ title: 'Erro ao atualizar', variant: 'destructive' });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;
    const success = await deleteUser(userId);
    if (success) {
      toast({ title: 'Usuário excluído!' });
    } else {
      toast({ title: 'Erro ao excluir', variant: 'destructive' });
    }
  };

  // Day handlers
  const handleSaveDay = async () => {
    if (!editingDay) return;
    const success = await updateDay(editingDay.id, editingDay);
    if (success) {
      toast({ title: 'Dia atualizado!' });
      setEditingDay(null);
    } else {
      toast({ title: 'Erro ao atualizar', variant: 'destructive' });
    }
  };

  const handleCreateDay = async () => {
    const newId = days.length > 0 ? Math.max(...days.map(d => d.id)) + 1 : 1;
    const success = await createDay({
      id: newId,
      title: `Dia ${newId}`,
      subtitle: 'Novo dia do desafio',
      emoji: '📅',
      morning_message: '',
      concept: '',
      concept_title: '',
      task_title: '',
      task_steps: [],
      tools: [],
      reflection_questions: [],
      commitment: '',
      next_day_preview: '',
    });
    if (success) {
      toast({ title: 'Dia criado!' });
      setNewDayDialog(false);
    } else {
      toast({ title: 'Erro ao criar', variant: 'destructive' });
    }
  };

  const handleDeleteDay = async (dayId: number) => {
    if (!confirm('Tem certeza que deseja excluir este dia?')) return;
    const success = await deleteDay(dayId);
    if (success) {
      toast({ title: 'Dia excluído!' });
    } else {
      toast({ title: 'Erro ao excluir', variant: 'destructive' });
    }
  };

  // Setting handlers
  const handleSaveSetting = async () => {
    if (!editingSetting) return;
    let value = editingSetting.value;
    try {
      value = JSON.parse(editingSetting.value);
    } catch {
      // Valor permanece como string caso o JSON seja invalido
    }
    
    const success = await updateSetting(editingSetting.key, value);
    if (success) {
      toast({ title: 'Configuração salva!' });
      setEditingSetting(null);
    } else {
      toast({ title: 'Erro ao salvar', variant: 'destructive' });
    }
  };

  const handleCreateSetting = async () => {
    if (!newSettingData.key) {
      toast({ title: 'Preencha a chave', variant: 'destructive' });
      return;
    }
    let value = newSettingData.value;
    try {
      value = JSON.parse(newSettingData.value);
    } catch {
      // Valor permanece como string caso o JSON seja invalido
    }
    
    const success = await createSetting(newSettingData.key, value, newSettingData.description);
    if (success) {
      toast({ title: 'Configuração criada!' });
      setNewSettingDialog(false);
      setNewSettingData({ key: '', value: '', description: '' });
    } else {
      toast({ title: 'Erro ao criar', variant: 'destructive' });
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
    const success = aiBudgetSetting
      ? await updateSetting('ai_budget_brl', parsed)
      : await createSetting('ai_budget_brl', parsed, description);

    if (success) {
      toast({ title: 'Limite de IA atualizado!' });
    } else {
      toast({ title: 'Erro ao salvar limite de IA', variant: 'destructive' });
    }
  };

  const hotmartWebhookUrl = `https://gvjvygukvupjxadevduj.supabase.co/functions/v1/hotmart-webhook`;
  const n8nWebhookUrl = `https://gvjvygukvupjxadevduj.supabase.co/functions/v1/n8n-webhook`;

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              Administração
            </h1>
            <p className="text-muted-foreground">
              Gerencie usuários, conteúdo e integrações
            </p>
          </div>
          <Button onClick={refetch} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Users, label: 'Total Usuários', value: stats.totalUsers.toString(), color: 'text-primary' },
            { icon: Calendar, label: 'Ativos Hoje', value: stats.activeToday.toString(), color: 'text-success' },
            { icon: BarChart3, label: 'Taxa Conclusão', value: `${stats.completionRate}%`, color: 'text-warning' },
            { icon: Webhook, label: 'Webhooks/24h', value: stats.webhooks24h.toString(), color: 'text-fire' },
          ].map((stat, index) => (
            <div key={index} className="glass-card p-4">
              <stat.icon className={cn('w-6 h-6 mb-2', stat.color)} />
              <p className={cn('text-2xl font-bold', stat.color)}>{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="bg-surface border border-border">
            <TabsTrigger value="users" className="data-[state=active]:bg-primary/15 data-[state=active]:text-primary">
              <Users className="w-4 h-4 mr-2" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-primary/15 data-[state=active]:text-primary">
              <Calendar className="w-4 h-4 mr-2" />
              Conteúdo
            </TabsTrigger>
            <TabsTrigger value="webhooks" className="data-[state=active]:bg-primary/15 data-[state=active]:text-primary">
              <Webhook className="w-4 h-4 mr-2" />
              Webhooks
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary/15 data-[state=active]:text-primary">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <div className="flex gap-4 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  value={searchUsers}
                  onChange={(e) => setSearchUsers(e.target.value)}
                  placeholder="Buscar usuários..."
                  className="pl-10 bg-surface border-border"
                />
              </div>
              <Button onClick={() => setNewUserDialog(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Novo Usuário
              </Button>
            </div>

            {users.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum usuário encontrado</p>
              </div>
            ) : (
              <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Usuário</th>
                        <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Status</th>
                        <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Progresso</th>
                        <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Início</th>
                        <th className="text-right p-4 text-sm font-semibold text-muted-foreground">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b border-border/50 hover:bg-surface/50">
                          <td className="p-4">
                            <div>
                              <p className="font-medium">{user.full_name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <Select 
                              value={user.subscription_status || 'none'} 
                              onValueChange={(value) => handleUpdateUserStatus(user.id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Ativo</SelectItem>
                                <SelectItem value="canceled">Cancelado</SelectItem>
                                <SelectItem value="overdue">Vencido</SelectItem>
                                <SelectItem value="refunded">Reembolsado</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-20 bg-surface rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-fire rounded-full"
                                  style={{ width: `${(user.current_day / 15) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {user.current_day}/15
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {new Date(user.created_at).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => setEditingUser({...user})}
                                className="p-2 rounded-lg hover:bg-surface transition-colors"
                              >
                                <Edit className="w-4 h-4 text-muted-foreground" />
                              </button>
                              <button 
                                onClick={() => handleDeleteUser(user.id)}
                                className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                              >
                                <Trash className="w-4 h-4 text-destructive" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Dias do Desafio ({days.length})</h3>
              <Button onClick={() => setNewDayDialog(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Novo Dia
              </Button>
            </div>

            <div className="grid gap-4">
              {days.map((day) => (
                <div key={day.id} className="glass-card p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{day.emoji}</span>
                    <div>
                      <p className="font-semibold">Dia {day.id}: {day.title}</p>
                      <p className="text-sm text-muted-foreground">{day.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingDay({...day})}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteDay(day.id)}>
                      <Trash className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Webhooks Tab */}
          <TabsContent value="webhooks" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="glass-card p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <img src="https://hotmart.com/favicon.ico" alt="" className="w-5 h-5" />
                  Hotmart Webhook
                </h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-surface/50">
                    <p className="text-xs text-muted-foreground mb-1">URL do Webhook</p>
                    <div className="flex items-center gap-2">
                      <code className="text-sm text-primary break-all flex-1">
                        {hotmartWebhookUrl}
                      </code>
                      <button
                        onClick={() => copyToClipboard(hotmartWebhookUrl)}
                        className="p-2 rounded-lg hover:bg-surface transition-colors"
                      >
                        {copiedUrl === hotmartWebhookUrl ? (
                          <Check className="w-4 h-4 text-success" />
                        ) : (
                          <Copy className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-success/10 border border-success/30">
                    <p className="text-sm text-success">
                      ✓ Cria usuário automaticamente em compras aprovadas
                    </p>
                    <p className="text-sm text-success">
                      ✓ Bloqueia acesso em cancelamentos/reembolsos
                    </p>
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
                <h3 className="font-semibold mb-4">n8n Webhook</h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-surface/50">
                    <p className="text-xs text-muted-foreground mb-1">URL do Webhook</p>
                    <div className="flex items-center gap-2">
                      <code className="text-sm text-primary break-all flex-1">
                        {n8nWebhookUrl}
                      </code>
                      <button
                        onClick={() => copyToClipboard(n8nWebhookUrl)}
                        className="p-2 rounded-lg hover:bg-surface transition-colors"
                      >
                        {copiedUrl === n8nWebhookUrl ? (
                          <Check className="w-4 h-4 text-success" />
                        ) : (
                          <Copy className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Eventos disponíveis: send_welcome_email, send_milestone_email, get_user_progress, get_milestone_users
                  </p>
                </div>
              </div>
            </div>

            {/* Webhook Logs */}
            <div className="glass-card overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold">Logs Recentes ({webhookLogs.length})</h3>
              </div>
              {webhookLogs.length === 0 ? (
                <div className="p-8 text-center">
                  <Webhook className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhum webhook recebido ainda</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Fonte</th>
                        <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Evento</th>
                        <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Status</th>
                        <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {webhookLogs.map((log) => (
                        <tr key={log.id} className="border-b border-border/50 hover:bg-surface/50">
                          <td className="p-4">
                            <span className={cn(
                              'px-2 py-1 rounded-full text-xs font-medium',
                              log.source === 'hotmart' ? 'bg-fire/15 text-fire' : 'bg-primary/15 text-primary'
                            )}>
                              {log.source}
                            </span>
                          </td>
                          <td className="p-4 text-sm">{log.event}</td>
                          <td className="p-4">
                            <span className={cn(
                              'px-2 py-1 rounded-full text-xs font-medium',
                              log.status_code === 200 ? 'bg-success/15 text-success' : 'bg-destructive/15 text-destructive'
                            )}>
                              {log.status_code || 'pending'}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {new Date(log.received_at).toLocaleString('pt-BR')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Configurações do Sistema</h3>
              <Button onClick={() => setNewSettingDialog(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Nova Configuração
              </Button>
            </div>

            <div className="glass-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-medium">Limite global de IA</p>
                  <p className="text-sm text-muted-foreground">Define o teto mensal em R$ para uso de IA.</p>
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
            
            <div className="glass-card overflow-hidden">
              {settings.length === 0 ? (
                <div className="p-8 text-center">
                  <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhuma configuração encontrada</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {settings.map((setting) => (
                    <div key={setting.id} className="p-4 flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-medium">{setting.key}</p>
                        <p className="text-sm text-muted-foreground">{setting.description}</p>
                        <code className="text-xs text-primary mt-1 block break-all">
                          {typeof setting.value === 'string' ? setting.value : JSON.stringify(setting.value)}
                        </code>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditingSetting({
                            ...setting,
                            value: typeof setting.value === 'string' ? setting.value : JSON.stringify(setting.value)
                          })}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={async () => {
                            if (confirm('Excluir esta configuração?')) {
                              await deleteSetting(setting.key);
                              toast({ title: 'Configuração excluída!' });
                            }
                          }}
                        >
                          <Trash className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* New User Dialog */}
      <Dialog open={newUserDialog} onOpenChange={setNewUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Novo Usuário</DialogTitle>
            <DialogDescription>Adicione um novo usuário ao sistema</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Email"
              value={newUserData.email}
              onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
            />
            <Input
              placeholder="Senha"
              type="password"
              value={newUserData.password}
              onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
            />
            <Input
              placeholder="Nome completo"
              value={newUserData.full_name}
              onChange={(e) => setNewUserData({...newUserData, full_name: e.target.value})}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewUserDialog(false)}>Cancelar</Button>
            <Button onClick={handleCreateUser}>Criar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4">
              <Input
                placeholder="Nome"
                value={editingUser.full_name}
                onChange={(e) => setEditingUser({...editingUser, full_name: e.target.value})}
              />
              <Input
                placeholder="Email"
                value={editingUser.email}
                disabled
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingUser(null)}>Cancelar</Button>
            <Button onClick={handleUpdateUser}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Day Dialog */}
      <Dialog open={!!editingDay} onOpenChange={() => setEditingDay(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Dia {editingDay?.id}</DialogTitle>
          </DialogHeader>
          {editingDay && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Título"
                  value={editingDay.title}
                  onChange={(e) => setEditingDay({...editingDay, title: e.target.value})}
                />
                <Input
                  placeholder="Emoji"
                  value={editingDay.emoji}
                  onChange={(e) => setEditingDay({...editingDay, emoji: e.target.value})}
                />
              </div>
              <Input
                placeholder="Subtítulo"
                value={editingDay.subtitle}
                onChange={(e) => setEditingDay({...editingDay, subtitle: e.target.value})}
              />
              <Textarea
                placeholder="Mensagem Matinal"
                value={editingDay.morning_message || ''}
                onChange={(e) => setEditingDay({...editingDay, morning_message: e.target.value})}
                rows={3}
              />
              <Input
                placeholder="URL do Áudio da Mensagem Matinal"
                value={editingDay.morning_audio_url || ''}
                onChange={(e) => setEditingDay({...editingDay, morning_audio_url: e.target.value})}
              />
              <Input
                placeholder="Título do Conceito"
                value={editingDay.concept_title || ''}
                onChange={(e) => setEditingDay({...editingDay, concept_title: e.target.value})}
              />
              <Textarea
                placeholder="Conceito FIRE"
                value={editingDay.concept || ''}
                onChange={(e) => setEditingDay({...editingDay, concept: e.target.value})}
                rows={3}
              />
              <Input
                placeholder="URL do Áudio do Conceito"
                value={editingDay.concept_audio_url || ''}
                onChange={(e) => setEditingDay({...editingDay, concept_audio_url: e.target.value})}
              />
              <Input
                placeholder="Título da Tarefa"
                value={editingDay.task_title || ''}
                onChange={(e) => setEditingDay({...editingDay, task_title: e.target.value})}
              />
              <Textarea
                placeholder="Compromisso"
                value={editingDay.commitment || ''}
                onChange={(e) => setEditingDay({...editingDay, commitment: e.target.value})}
                rows={2}
              />
              <Input
                placeholder="Preview do Próximo Dia"
                value={editingDay.next_day_preview || ''}
                onChange={(e) => setEditingDay({...editingDay, next_day_preview: e.target.value})}
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingDay(null)}>Cancelar</Button>
            <Button onClick={handleSaveDay}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Setting Dialog */}
      <Dialog open={newSettingDialog} onOpenChange={setNewSettingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Configuração</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Chave (ex: n8n_webhook_url)"
              value={newSettingData.key}
              onChange={(e) => setNewSettingData({...newSettingData, key: e.target.value})}
            />
            <Input
              placeholder="Valor"
              value={newSettingData.value}
              onChange={(e) => setNewSettingData({...newSettingData, value: e.target.value})}
            />
            <Input
              placeholder="Descrição"
              value={newSettingData.description}
              onChange={(e) => setNewSettingData({...newSettingData, description: e.target.value})}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewSettingDialog(false)}>Cancelar</Button>
            <Button onClick={handleCreateSetting}>Criar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Setting Dialog */}
      <Dialog open={!!editingSetting} onOpenChange={() => setEditingSetting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Configuração</DialogTitle>
          </DialogHeader>
          {editingSetting && (
            <div className="space-y-4">
              <Input value={editingSetting.key} disabled />
              <Textarea
                placeholder="Valor"
                value={editingSetting.value}
                onChange={(e) => setEditingSetting({...editingSetting, value: e.target.value})}
                rows={4}
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingSetting(null)}>Cancelar</Button>
            <Button onClick={handleSaveSetting}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Admin;
