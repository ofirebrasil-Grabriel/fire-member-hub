import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAdmin } from '@/hooks/useAdmin';
import { 
  Users, 
  Calendar, 
  Settings, 
  Webhook,
  BarChart3,
  Search,
  MoreVertical,
  Edit,
  Trash,
  Eye,
  Shield,
  RefreshCw,
  Copy,
  Check,
  AlertTriangle,
  Save,
  ExternalLink
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    updateUserStatus,
    updateSetting,
    deleteUser,
    refetch 
  } = useAdmin();

  const [searchUsers, setSearchUsers] = useState('');
  const [selectedTab, setSelectedTab] = useState('users');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editingSetting, setEditingSetting] = useState<any>(null);
  const [newSettingValue, setNewSettingValue] = useState('');

  // Show loading
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  // Redirect non-admins
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

  const handleUpdateUserStatus = async (userId: string, status: string) => {
    const success = await updateUserStatus(userId, status);
    if (success) {
      toast({ title: 'Status atualizado!' });
      setEditingUser(null);
    } else {
      toast({ title: 'Erro ao atualizar', variant: 'destructive' });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) {
      return;
    }
    const success = await deleteUser(userId);
    if (success) {
      toast({ title: 'Usuário excluído!' });
    } else {
      toast({ title: 'Erro ao excluir', variant: 'destructive' });
    }
  };

  const handleSaveSetting = async () => {
    if (!editingSetting) return;
    
    let value = newSettingValue;
    try {
      value = JSON.parse(newSettingValue);
    } catch {
      // Keep as string if not valid JSON
    }
    
    const success = await updateSetting(editingSetting.key, value);
    if (success) {
      toast({ title: 'Configuração salva!' });
      setEditingSetting(null);
      setNewSettingValue('');
    } else {
      toast({ title: 'Erro ao salvar', variant: 'destructive' });
    }
  };

  const hotmartWebhookUrl = `https://gvjvygukvupjxadevduj.supabase.co/functions/v1/hotmart-webhook`;

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
                          <td className="p-4">{getStatusBadge(user.subscription_status)}</td>
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
                                onClick={() => setEditingUser(user)}
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
                  <div className="p-3 rounded-lg bg-warning/10 border border-warning/30">
                    <p className="text-sm text-warning flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      Configure esta URL na Hotmart em Ferramentas → Webhooks
                    </p>
                  </div>
                  <a 
                    href="https://app.hotmart.com/tools/webhook" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-fire text-sm inline-flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Abrir Hotmart
                  </a>
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="font-semibold mb-4">n8n Workflows</h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-surface/50">
                    <p className="text-xs text-muted-foreground mb-1">Workflow URL</p>
                    <p className="text-sm text-muted-foreground">
                      Configure nas configurações abaixo
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Configure os workflows para automações de e-mail e CRM.
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
            <div className="glass-card overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold">Configurações do Sistema</h3>
              </div>
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingSetting(setting);
                        setNewSettingValue(
                          typeof setting.value === 'string' 
                            ? setting.value 
                            : JSON.stringify(setting.value)
                        );
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* How access works */}
            <div className="glass-card p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Como funciona o acesso
              </h3>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">1. Compra na Hotmart:</strong> Quando um cliente compra o produto, 
                  a Hotmart envia um webhook para nossa URL.
                </p>
                <p>
                  <strong className="text-foreground">2. Criação de conta:</strong> O sistema cria automaticamente uma 
                  conta para o cliente com o email da compra.
                </p>
                <p>
                  <strong className="text-foreground">3. Email de boas-vindas:</strong> O cliente recebe um email com 
                  link para definir sua senha (configure no n8n).
                </p>
                <p>
                  <strong className="text-foreground">4. Cancelamento/Reembolso:</strong> Se houver cancelamento ou 
                  reembolso, o acesso é automaticamente revogado.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Altere o status da assinatura do usuário
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4">
              <div>
                <p className="font-medium">{editingUser.full_name}</p>
                <p className="text-sm text-muted-foreground">{editingUser.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Status da Assinatura</label>
                <Select
                  defaultValue={editingUser.subscription_status || 'none'}
                  onValueChange={(value) => handleUpdateUserStatus(editingUser.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="canceled">Cancelado</SelectItem>
                    <SelectItem value="overdue">Vencido</SelectItem>
                    <SelectItem value="refunded">Reembolsado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Setting Dialog */}
      <Dialog open={!!editingSetting} onOpenChange={() => setEditingSetting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Configuração</DialogTitle>
            <DialogDescription>
              {editingSetting?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">{editingSetting?.key}</label>
              <Input
                value={newSettingValue}
                onChange={(e) => setNewSettingValue(e.target.value)}
                placeholder="Valor da configuração"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingSetting(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveSetting} className="btn-fire">
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Admin;
