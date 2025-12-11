import { useEffect, useState } from 'react';
import { Users, TrendingUp, Activity, BarChart3, Clock, Webhook, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  totalMembers: number;
  newMembersLast30Days: number;
  activeUsers: number;
  avgCompletion: number;
}

interface ActivityItem {
  id: string;
  user_name: string;
  day_number: number;
  task_title: string;
  completed_at: string;
}

interface WebhookLog {
  id: string;
  source: string;
  event: string;
  payload: any;
  received_at: string;
  status_code: number | null;
}

interface EngagementStat {
  date: string;
  count: number;
}

export const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([]);
  const [engagementStats, setEngagementStats] = useState<EngagementStat[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch stats
    const { count: totalMembers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { count: newMembers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo);

    const today = new Date().toISOString().split('T')[0];
    const { count: activeUsers } = await supabase
      .from('day_progress')
      .select('user_id', { count: 'exact', head: true })
      .gte('updated_at', today);

    const { data: completionData } = await supabase
      .from('day_progress')
      .select('day_id')
      .eq('completed', true);

    const avgCompletion = totalMembers && totalMembers > 0
      ? Math.round(((completionData?.length || 0) / (totalMembers * 15)) * 100)
      : 0;

    setStats({
      totalMembers: totalMembers || 0,
      newMembersLast30Days: newMembers || 0,
      activeUsers: activeUsers || 0,
      avgCompletion,
    });

    // Fetch recent activity
    const { data: progressData } = await supabase
      .from('day_progress')
      .select(`
        id,
        day_id,
        completed_at,
        user_id,
        profiles!inner(full_name)
      `)
      .eq('completed', true)
      .order('completed_at', { ascending: false })
      .limit(10);

    const activityItems: ActivityItem[] = (progressData || []).map((p: any) => ({
      id: p.id,
      user_name: p.profiles?.full_name || 'Usuário',
      day_number: p.day_id,
      task_title: `Completou o Dia ${p.day_id}`,
      completed_at: p.completed_at,
    }));
    setActivity(activityItems);

    // Fetch webhook logs
    const { data: logs } = await supabase
      .from('webhook_logs')
      .select('*')
      .order('received_at', { ascending: false })
      .limit(20);
    setWebhookLogs(logs || []);

    // Fetch engagement stats (last 14 days)
    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    const engagementData: EngagementStat[] = [];
    
    for (let i = 13; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const { count } = await supabase
        .from('day_progress')
        .select('*', { count: 'exact', head: true })
        .gte('updated_at', dateStr)
        .lt('updated_at', nextDate);
      
      engagementData.push({
        date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        count: count || 0,
      });
    }
    setEngagementStats(engagementData);

    setLoading(false);
  };

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const maxEngagement = Math.max(...engagementStats.map(e => e.count), 5);

  const cards = [
    { label: 'Membros Totais', value: stats.totalMembers, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Novos (30d)', value: stats.newMembersLast30Days, icon: TrendingUp, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Ativos Hoje', value: stats.activeUsers, icon: Activity, color: 'text-fire', bg: 'bg-fire/10' },
    { label: 'Conclusão Média', value: `${stats.avgCompletion}%`, icon: BarChart3, color: 'text-warning', bg: 'bg-warning/10' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          <p className="text-muted-foreground mt-1">Visão geral do desempenho do Desafio FIRE.</p>
        </div>
        <div className="text-sm text-muted-foreground bg-surface px-4 py-2 rounded-lg border border-border flex items-center gap-2">
          <Clock size={14} />
          Atualizado: {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((stat, index) => (
          <div key={index} className="glass-card p-6 hover:scale-[1.02] transition-transform">
            <div className="flex justify-between items-start mb-4">
              <div className={cn('p-3 rounded-lg', stat.bg, stat.color)}>
                <stat.icon size={24} />
              </div>
            </div>
            <h3 className={cn('text-2xl font-bold mb-1', stat.color)}>{stat.value}</h3>
            <p className="text-muted-foreground text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Engagement Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <BarChart3 className="text-primary" size={20} />
            Atividade (Últimos 14 dias)
          </h2>
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {engagementStats.map((stat, i) => (
              <div key={i} className="w-full relative group flex flex-col items-center gap-2">
                <div className="absolute -top-8 bg-foreground text-background text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                  {stat.count} ações
                </div>
                <div
                  className="w-full bg-gradient-fire rounded-t-sm hover:opacity-80 transition-opacity cursor-pointer"
                  style={{ height: `${Math.max((stat.count / maxEngagement) * 100, 4)}%` }}
                />
                <span className="text-[10px] text-muted-foreground">{stat.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold mb-4">Acesso Rápido</h2>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/admin/users')}
                className="w-full text-left p-3 rounded-lg bg-surface hover:bg-surface-hover transition-colors flex items-center justify-between"
              >
                <span>Gerenciar Usuários</span>
                <Users size={18} className="text-muted-foreground" />
              </button>
              <button
                onClick={() => navigate('/admin/challenges')}
                className="w-full text-left p-3 rounded-lg bg-surface hover:bg-surface-hover transition-colors flex items-center justify-between"
              >
                <span>Editar Desafios</span>
                <BarChart3 size={18} className="text-muted-foreground" />
              </button>
              <button
                onClick={() => navigate('/admin/settings')}
                className="w-full text-left p-3 rounded-lg bg-surface hover:bg-surface-hover transition-colors flex items-center justify-between"
              >
                <span>Configurações</span>
                <Activity size={18} className="text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Activity & Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold mb-4">Atividade Recente</h2>
          {activity.length > 0 ? (
            <div className="space-y-3">
              {activity.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-surface hover:bg-surface-hover transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                      {item.user_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm">
                        <span className="font-bold">{item.user_name}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{item.task_title}</p>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(item.completed_at).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma atividade recente.
            </div>
          )}
        </div>

        {/* Webhook Logs */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Webhook size={20} className="text-primary" />
            Logs de Integração
          </h2>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {webhookLogs.length > 0 ? (
              webhookLogs.map((log) => {
                const payload = typeof log.payload === 'string' ? JSON.parse(log.payload) : log.payload;
                const event = payload.event || 'UNKNOWN';
                const email = payload.data?.buyer?.email || 'N/A';

                return (
                  <div key={log.id} className="bg-surface p-3 rounded-lg text-xs">
                    <div className="flex justify-between items-start mb-1">
                      <span className={cn(
                        'font-bold px-2 py-0.5 rounded',
                        ['PURCHASE_APPROVED', 'PURCHASE_COMPLETE'].includes(event) 
                          ? 'bg-success/20 text-success' 
                          : ['CANCELED', 'REFUNDED'].includes(event)
                          ? 'bg-destructive/20 text-destructive'
                          : 'bg-primary/20 text-primary'
                      )}>
                        {event}
                      </span>
                      <span className="text-muted-foreground">
                        {new Date(log.received_at).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="mt-2">
                      <span className="text-muted-foreground">Email: </span>
                      <span>{email}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum log encontrado.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
