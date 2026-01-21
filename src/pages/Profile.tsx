import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { 
  User, 
  Mail, 
  Calendar, 
  Settings, 
  CreditCard, 
  Bell,
  Moon,
  Sun,
  Palette,
  RefreshCw,
  Save,
  LogOut,
  Contrast
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Profile = () => {
  const { progress, setUserName, resetProgress } = useUserProgress();
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  
  const [name, setName] = useState(progress.userName);
  const [email, setEmail] = useState(user?.email || '');
  const [notifications, setNotifications] = useState(() => {
    return localStorage.getItem('fire-notifications') !== 'false';
  });
  const [subscription, setSubscription] = useState<Tables<'subscriptions'> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      setSubscription(data);
      setLoading(false);
    };

    fetchSubscription();
  }, [user]);

  useEffect(() => {
    localStorage.setItem('fire-notifications', notifications.toString());
  }, [notifications]);

  const handleSave = async () => {
    setUserName(name);
    
    if (user) {
      await supabase
        .from('profiles')
        .update({ full_name: name })
        .eq('id', user.id);
    }
    
    toast({
      title: "Perfil atualizado!",
      description: "Suas informações foram salvas com sucesso.",
    });
  };

  const handleReset = async () => {
    if (confirm('Tem certeza que deseja resetar todo o progresso? Esta ação não pode ser desfeita.')) {
      const success = await resetProgress();
      if (success) {
        toast({
          title: "Progresso resetado",
          description: "Seu progresso foi reiniciado. Boa sorte na nova jornada!",
        });
      } else {
        toast({
          title: "Nao foi possivel resetar tudo",
          description: "Alguns dados nao foram apagados. Tente novamente em instantes.",
          variant: "destructive",
        });
      }
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Até logo!",
      description: "Você foi desconectado com sucesso.",
    });
  };

  const getStatusInfo = () => {
    if (!subscription) {
      return {
        label: 'Sem assinatura',
        color: 'bg-muted text-muted-foreground',
        description: 'Você não possui uma assinatura ativa.',
      };
    }

    const statusMap: Record<string, { label: string; color: string; description: string }> = {
      active: {
        label: 'Acesso Ativo',
        color: 'bg-success/10 border-success/30 text-success',
        description: subscription?.started_at
          ? `Iniciado em ${new Date(subscription.started_at).toLocaleDateString('pt-BR')}`
          : 'Assinatura ativa.',
      },
      canceled: {
        label: 'Cancelado',
        color: 'bg-destructive/10 border-destructive/30 text-destructive',
        description: 'Sua assinatura foi cancelada.',
      },
      overdue: {
        label: 'Pagamento Pendente',
        color: 'bg-warning/10 border-warning/30 text-warning',
        description: 'Existe um pagamento pendente.',
      },
      refunded: {
        label: 'Reembolsado',
        color: 'bg-muted text-muted-foreground',
        description: 'Sua compra foi reembolsada.',
      },
    };

    return statusMap[subscription.status] || statusMap.canceled;
  };

  const statusInfo = getStatusInfo();

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Perfil</h1>
          <p className="text-muted-foreground">
            Gerencie suas informações e preferências
          </p>
        </div>

        {/* Profile Card */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-fire flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{progress.userName}</h2>
              <p className="text-muted-foreground">Participante do Desafio FIRE</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs px-2 py-1 rounded-full bg-primary/15 text-primary">
                  Dia {progress.currentDay} de 15
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Nome</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 bg-surface border-border"
                  placeholder="Seu nome"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  value={email}
                  disabled
                  className="pl-10 bg-surface border-border opacity-70"
                  type="email"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                O email não pode ser alterado
              </p>
            </div>

            <Button onClick={handleSave} className="w-full btn-fire">
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        </div>

        {/* Subscription Status */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-success" />
            </div>
            <div>
              <h3 className="font-semibold">Status da Assinatura</h3>
              <p className="text-sm text-muted-foreground">Seu acesso ao desafio</p>
            </div>
          </div>

          {loading ? (
            <div className="p-4 rounded-xl bg-surface animate-pulse h-20" />
          ) : (
            <div className={cn('p-4 rounded-xl border', statusInfo.color)}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{statusInfo.label}</p>
                  <p className="text-sm opacity-80">
                    {statusInfo.description}
                  </p>
                </div>
                {subscription?.status === 'active' && (
                  <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Preferences */}
        <div className="glass-card p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-muted-foreground" />
            Preferências
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Notificações</p>
                  <p className="text-sm text-muted-foreground">Receber lembretes do desafio</p>
                </div>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Palette className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Tema</p>
                  <p className="text-sm text-muted-foreground">Escolha o visual da plataforma</p>
                </div>
              </div>
              <Select
                value={theme}
                onValueChange={(value) => setTheme(value as 'dark' | 'light' | 'high-contrast')}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4" />
                      Escuro
                    </div>
                  </SelectItem>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4" />
                      Claro
                    </div>
                  </SelectItem>
                  <SelectItem value="high-contrast">
                    <div className="flex items-center gap-2">
                      <Contrast className="w-4 h-4" />
                      Alto Contraste
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="glass-card p-6">
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="w-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair da conta
          </Button>
        </div>

        {/* Danger Zone */}
        <div className="glass-card p-6 border-destructive/30">
          <h3 className="font-semibold mb-4 text-destructive">Zona de Perigo</h3>
          
          <div className="space-y-3">
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Resetar Progresso
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              Esta ação irá apagar todo o seu progresso no desafio
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
