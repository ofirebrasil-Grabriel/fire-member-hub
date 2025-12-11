import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useUserProgress } from '@/contexts/UserProgressContext';
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
  LogOut
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Profile = () => {
  const { progress, setUserName, resetProgress } = useUserProgress();
  const [name, setName] = useState(progress.userName);
  const [email, setEmail] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const handleSave = () => {
    setUserName(name);
    toast({
      title: "Perfil atualizado!",
      description: "Suas informações foram salvas com sucesso.",
    });
  };

  const handleReset = () => {
    if (confirm('Tem certeza que deseja resetar todo o progresso? Esta ação não pode ser desfeita.')) {
      resetProgress();
      toast({
        title: "Progresso resetado",
        description: "Seu progresso foi reiniciado. Boa sorte na nova jornada!",
      });
    }
  };

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
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-surface border-border"
                  placeholder="seu@email.com"
                  type="email"
                />
              </div>
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

          <div className="p-4 rounded-xl bg-success/10 border border-success/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-success">Acesso Ativo</p>
                <p className="text-sm text-muted-foreground">
                  Iniciado em {new Date(progress.startedAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-4 text-center">
            Integração com Hotmart será configurada após conectar o backend
          </p>
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
                <Moon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Modo Escuro</p>
                  <p className="text-sm text-muted-foreground">Tema escuro ativado</p>
                </div>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
          </div>
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
