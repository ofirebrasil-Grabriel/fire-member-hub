import { useEffect, useState } from 'react';
import { Users, TrendingUp, Activity, BarChart3, Clock, Webhook, CheckCircle, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardStats {
  totalMembers: number;
  newMembersLast30Days: number;
  activeUsers: number;
  avgCompletion: number;
  completedChallenge: number;
}

interface ActivityItem {
  id: string;
  user_name: string;
  day_number: number;
  task_title: string;
  completed_at: string;
}

interface DailyEngagement {
  date: string;
  count: number;
}

interface DayCompletion {
  day: number;
  count: number;
}

export const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [dailyEngagement, setDailyEngagement] = useState<DailyEngagement[]>([]);
  const [dayCompletion, setDayCompletion] = useState<DayCompletion[]>([]);
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
      .select('day_id, user_id')
      .eq('completed', true);

    const { count: completedChallenge } = await supabase
      .from('day_progress')
      .select('*', { count: 'exact', head: true })
      .eq('day_id', 15)
      .eq('completed', true);

    const avgCompletion = totalMembers && totalMembers > 0
      ? Math.round(((completionData?.length || 0) / (totalMembers * 15)) * 100)
      : 0;

    setStats({
      totalMembers: totalMembers || 0,
      newMembersLast30Days: newMembers || 0,
      activeUsers: activeUsers || 0,
      avgCompletion,
      completedChallenge: completedChallenge || 0,
    });

    // Fetch day completion distribution
    const dayCompletionMap: Record<number, number> = {};
    completionData?.forEach(d => {
      dayCompletionMap[d.day_id] = (dayCompletionMap[d.day_id] || 0) + 1;
    });
    
    const dayCompletionData: DayCompletion[] = Array.from({ length: 15 }, (_, i) => ({
      day: i + 1,
      count: dayCompletionMap[i + 1] || 0,
    }));
    setDayCompletion(dayCompletionData);

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

    const activityItems: ActivityItem[] = (progressData || []).map((item: {
      id: string;
      day_id: number;
      completed_at: string | null;
      profiles?: { full_name?: string | null } | null;
    }) => ({
      id: item.id,
      user_name: item.profiles?.full_name || 'Usuário',
      day_number: item.day_id,
      task_title: `Completou o Dia ${item.day_id}`,
      completed_at: item.completed_at,
    }));
    setActivity(activityItems);

    // Fetch daily engagement (last 14 days)
    const engagementData: DailyEngagement[] = [];
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
    setDailyEngagement(engagementData);

    setLoading(false);
  };

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const cards = [
    { label: 'Membros Totais', value: stats.totalMembers, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Novos (30d)', value: stats.newMembersLast30Days, icon: TrendingUp, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Ativos Hoje', value: stats.activeUsers, icon: Activity, color: 'text-fire', bg: 'bg-fire/10' },
    { label: 'Conclusão Média', value: `${stats.avgCompletion}%`, icon: BarChart3, color: 'text-warning', bg: 'bg-warning/10' },
    { label: 'Completaram 15 dias', value: stats.completedChallenge, icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' },
  ];

  const pieData = [
    { name: 'Completaram', value: stats.completedChallenge, color: 'hsl(var(--success))' },
    { name: 'Em progresso', value: stats.totalMembers - stats.completedChallenge, color: 'hsl(var(--muted))' },
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((stat, index) => (
          <div key={index} className="glass-card p-5 hover:scale-[1.02] transition-transform">
            <div className={cn('p-2.5 rounded-lg w-fit mb-3', stat.bg, stat.color)}>
              <stat.icon size={20} />
            </div>
            <h3 className={cn('text-2xl font-bold', stat.color)}>{stat.value}</h3>
            <p className="text-muted-foreground text-xs mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engagement Line Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Activity className="text-primary" size={20} />
            Engajamento Diário (14 dias)
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyEngagement}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} 
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} 
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--surface))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Completion Pie Chart */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <CheckCircle className="text-success" size={20} />
            Taxa de Conclusão
          </h2>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--surface))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {pieData.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-muted-foreground">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Day Completion Bar Chart */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Calendar className="text-fire" size={20} />
          Conclusões por Dia do Desafio
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dayCompletion}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="day" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} 
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickFormatter={(val) => `D${val}`}
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} 
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--surface))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelFormatter={(val) => `Dia ${val}`}
                formatter={(val: number) => [`${val} usuários`, 'Conclusões']}
              />
              <Bar 
                dataKey="count" 
                fill="url(#fireGradient)" 
                radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="fireGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--fire))" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Links & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Links */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold mb-4">Acesso Rápido</h2>
          <div className="space-y-2">
            {[
              { label: 'Gerenciar Usuários', to: '/admin/users', icon: Users },
              { label: 'Editar Desafios', to: '/admin/challenges', icon: Calendar },
              { label: 'Logs de Webhook', to: '/admin/webhooks', icon: Webhook },
              { label: 'Configurações', to: '/admin/settings', icon: BarChart3 },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => navigate(item.to)}
                className="w-full text-left p-3 rounded-lg bg-surface hover:bg-surface-hover transition-colors flex items-center justify-between group"
              >
                <span>{item.label}</span>
                <item.icon size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-lg font-bold mb-4">Atividade Recente</h2>
          {activity.length > 0 ? (
            <div className="space-y-3">
              {activity.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-surface hover:bg-surface-hover transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-fire flex items-center justify-center text-white font-bold text-sm">
                      {item.user_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.user_name}</p>
                      <p className="text-xs text-muted-foreground">{item.task_title}</p>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock size={12} />
                    {item.completed_at ? new Date(item.completed_at).toLocaleDateString('pt-BR') : 'N/A'}
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
      </div>
    </div>
  );
};
