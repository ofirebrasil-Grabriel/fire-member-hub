import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { 
  Users, 
  Calendar, 
  FileText, 
  Settings, 
  Webhook,
  BarChart3,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash,
  Eye,
  Shield
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const mockUsers = [
  { id: 1, name: 'Maria Silva', email: 'maria@email.com', status: 'active', currentDay: 7, startedAt: '2024-01-10' },
  { id: 2, name: 'João Santos', email: 'joao@email.com', status: 'active', currentDay: 5, startedAt: '2024-01-12' },
  { id: 3, name: 'Ana Costa', email: 'ana@email.com', status: 'canceled', currentDay: 3, startedAt: '2024-01-08' },
  { id: 4, name: 'Pedro Lima', email: 'pedro@email.com', status: 'active', currentDay: 12, startedAt: '2024-01-05' },
  { id: 5, name: 'Lucia Mendes', email: 'lucia@email.com', status: 'overdue', currentDay: 9, startedAt: '2024-01-09' },
];

const mockWebhookLogs = [
  { id: 1, source: 'hotmart', event: 'purchase_approved', status: 'success', timestamp: '2024-01-15 14:32:00' },
  { id: 2, source: 'n8n', event: 'day_completed', status: 'success', timestamp: '2024-01-15 12:15:00' },
  { id: 3, source: 'hotmart', event: 'subscription_canceled', status: 'success', timestamp: '2024-01-14 09:45:00' },
  { id: 4, source: 'n8n', event: 'welcome_email', status: 'failed', timestamp: '2024-01-14 08:30:00' },
];

const Admin = () => {
  const [searchUsers, setSearchUsers] = useState('');
  const [selectedTab, setSelectedTab] = useState('users');

  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchUsers.toLowerCase()) ||
    user.email.toLowerCase().includes(searchUsers.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-success/15 text-success',
      canceled: 'bg-destructive/15 text-destructive',
      overdue: 'bg-warning/15 text-warning',
    };
    const labels = {
      active: 'Ativo',
      canceled: 'Cancelado',
      overdue: 'Vencido',
    };
    return (
      <span className={cn('px-2 py-1 rounded-full text-xs font-medium', styles[status as keyof typeof styles])}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

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
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Users, label: 'Total Usuários', value: '156', color: 'text-primary' },
            { icon: Calendar, label: 'Ativos Hoje', value: '42', color: 'text-success' },
            { icon: BarChart3, label: 'Taxa Conclusão', value: '68%', color: 'text-warning' },
            { icon: Webhook, label: 'Webhooks/24h', value: '89', color: 'text-fire' },
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
              Config
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
              <Button className="btn-fire">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </div>

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
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </td>
                        <td className="p-4">{getStatusBadge(user.status)}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-20 bg-surface rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-fire rounded-full"
                                style={{ width: `${(user.currentDay / 15) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {user.currentDay}/15
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">{user.startedAt}</td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 rounded-lg hover:bg-surface transition-colors">
                              <Eye className="w-4 h-4 text-muted-foreground" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-surface transition-colors">
                              <Edit className="w-4 h-4 text-muted-foreground" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-destructive/10 transition-colors">
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
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-4">
            <div className="glass-card p-6 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Gerenciamento de Conteúdo</h3>
              <p className="text-muted-foreground mb-4">
                Edite os 15 dias do desafio, tarefas, recursos e materiais.
              </p>
              <p className="text-sm text-muted-foreground">
                Disponível após conectar o Supabase
              </p>
            </div>
          </TabsContent>

          {/* Webhooks Tab */}
          <TabsContent value="webhooks" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="glass-card p-6">
                <h3 className="font-semibold mb-4">Hotmart Webhook</h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-surface/50">
                    <p className="text-xs text-muted-foreground mb-1">URL do Webhook</p>
                    <code className="text-sm text-primary break-all">
                      https://seu-projeto.supabase.co/functions/v1/webhooks/hotmart
                    </code>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Configure esta URL na Hotmart para receber notificações de compra e cancelamento.
                  </p>
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="font-semibold mb-4">n8n Workflows</h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-surface/50">
                    <p className="text-xs text-muted-foreground mb-1">Workflow URL</p>
                    <code className="text-sm text-primary break-all">
                      https://n8n.seudominio.com/webhook/fire-challenge
                    </code>
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
                <h3 className="font-semibold">Logs Recentes</h3>
              </div>
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
                    {mockWebhookLogs.map((log) => (
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
                            log.status === 'success' ? 'bg-success/15 text-success' : 'bg-destructive/15 text-destructive'
                          )}>
                            {log.status}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">{log.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <div className="glass-card p-6 text-center">
              <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Configurações do Sistema</h3>
              <p className="text-muted-foreground mb-4">
                Configure integrações, webhooks, e preferências gerais.
              </p>
              <p className="text-sm text-muted-foreground">
                Disponível após conectar o Supabase
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;
