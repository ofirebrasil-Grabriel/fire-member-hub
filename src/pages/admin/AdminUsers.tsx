import { useEffect, useState } from 'react';
import { 
  Search, Shield, User, Ban, CheckCircle, Clock, Mail, 
  ChevronLeft, ChevronRight, Eye, Trash2, Plus, X, Phone, Lock, Loader2, KeyRound 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  created_at: string;
  status: 'active' | 'blocked' | 'pending';
  role: 'admin' | 'member';
  phone?: string;
}

const ADMIN_FUNCTION_URL = 'https://gvjvygukvupjxadevduj.supabase.co/functions/v1/setup-admin';

export const AdminUsers = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 10;

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'member' as 'admin' | 'member',
    password: ''
  });
  const [modalLoading, setModalLoading] = useState(false);

  // Password Reset Modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordUser, setPasswordUser] = useState<UserProfile | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadUsers();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [page, searchTerm]);

  const loadUsers = async () => {
    setLoading(true);
    
    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact' });

    if (searchTerm) {
      query = query.or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
    }

    const { data: profiles, count, error } = await query
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
      return;
    }

    // Get subscriptions and roles
    const userIds = (profiles || []).map(p => p.id);
    
    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select('user_id, status')
      .in('user_id', userIds);

    const { data: roles } = await supabase
      .from('user_roles')
      .select('user_id, role')
      .in('user_id', userIds);

    const usersWithDetails: UserProfile[] = (profiles || []).map((profile: any) => {
      const sub = subscriptions?.find(s => s.user_id === profile.id);
      const userRole = roles?.find(r => r.user_id === profile.id);
      
      let status: 'active' | 'blocked' | 'pending' = 'pending';
      if (sub?.status === 'active') status = 'active';
      else if (sub?.status === 'canceled' || sub?.status === 'refunded') status = 'blocked';

      return {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        created_at: profile.created_at,
        status,
        role: userRole?.role === 'admin' ? 'admin' : 'member',
      };
    });

    setUsers(usersWithDetails);
    setTotalCount(count || 0);
    setLoading(false);
  };

  const handleStatusChange = async (userId: string, newStatus: 'active' | 'blocked') => {
    setActionLoading(userId);
    
    const subscriptionStatus = newStatus === 'active' ? 'active' : 'canceled';
    
    const { error } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        product_id: 'fire-challenge',
        status: subscriptionStatus,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,product_id',
      });

    if (error) {
      toast({ title: 'Erro ao atualizar status', variant: 'destructive' });
    } else {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
      toast({ title: `Usuário ${newStatus === 'active' ? 'ativado' : 'bloqueado'}!` });
    }
    
    setActionLoading(null);
  };

  const handleRoleChange = async (userId: string, currentRole: 'admin' | 'member') => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    
    if (!confirm(`Alterar função para ${newRole === 'admin' ? 'Administrador' : 'Membro'}?`)) return;
    
    setActionLoading(userId);
    
    if (newRole === 'admin') {
      const { error } = await supabase
        .from('user_roles')
        .upsert({ user_id: userId, role: 'admin' }, { onConflict: 'user_id,role' });
      
      if (error) {
        toast({ title: 'Erro ao alterar função', variant: 'destructive' });
      } else {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: 'admin' } : u));
        toast({ title: 'Promovido a Admin!' });
      }
    } else {
      await supabase.from('user_roles').delete().eq('user_id', userId).eq('role', 'admin');
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: 'member' } : u));
      toast({ title: 'Rebaixado para Membro!' });
    }
    
    setActionLoading(null);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Excluir permanentemente este usuário?')) return;
    
    setActionLoading(userId);
    
    try {
      const response = await fetch(ADMIN_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_user', user_id: userId }),
      });

      if (!response.ok) throw new Error('Erro ao excluir');
      
      setUsers(prev => prev.filter(u => u.id !== userId));
      toast({ title: 'Usuário excluído!' });
    } catch (error: any) {
      toast({ title: error.message, variant: 'destructive' });
    }
    
    setActionLoading(null);
  };

  const openModal = (user?: UserProfile) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.full_name || '',
        email: user.email || '',
        phone: '',
        role: user.role,
        password: ''
      });
    } else {
      setEditingUser(null);
      setFormData({ name: '', email: '', phone: '', role: 'member', password: '' });
    }
    setShowModal(true);
  };

  const openPasswordModal = (user: UserProfile) => {
    setPasswordUser(user);
    setNewPassword('');
    setShowPasswordModal(true);
  };

  const handlePasswordReset = async () => {
    if (!passwordUser || !newPassword) {
      toast({ title: 'Preencha a nova senha', variant: 'destructive' });
      return;
    }

    if (newPassword.length < 6) {
      toast({ title: 'Senha deve ter no mínimo 6 caracteres', variant: 'destructive' });
      return;
    }

    setPasswordLoading(true);

    try {
      const response = await fetch(ADMIN_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_password',
          user_id: passwordUser.id,
          new_password: newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao atualizar senha');
      }
      
      toast({ title: 'Senha atualizada com sucesso!' });
      setShowPasswordModal(false);
      setNewPassword('');
    } catch (error: any) {
      toast({ title: error.message, variant: 'destructive' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);

    try {
      if (editingUser) {
        // Update existing user
        await supabase
          .from('profiles')
          .update({ full_name: formData.name })
          .eq('id', editingUser.id);
        
        toast({ title: 'Usuário atualizado!' });
      } else {
        // Create new user via edge function
        const response = await fetch(ADMIN_FUNCTION_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create_user',
            email: formData.email,
            password: formData.password,
            full_name: formData.name,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Falha ao criar usuário');
        }
        
        toast({ title: 'Usuário criado com sucesso!' });
      }

      setShowModal(false);
      loadUsers();
    } catch (error: any) {
      toast({ title: error.message, variant: 'destructive' });
    } finally {
      setModalLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Usuários</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Controle de acesso, status e permissões.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button onClick={() => openModal()} className="gap-2">
            <Plus size={18} /> Novo Usuário
          </Button>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Buscar por nome ou e-mail..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-xs uppercase">
                <th className="p-4 font-medium">Usuário</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Função</th>
                <th className="p-4 font-medium">Data Cadastro</th>
                <th className="p-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    <Loader2 className="animate-spin inline-block mr-2" /> Carregando...
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-surface/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-fire flex items-center justify-center text-white font-bold text-sm">
                          {user.avatar_url ? (
                            <img src={user.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{user.full_name || 'Sem Nome'}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Mail size={10} /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border',
                        user.status === 'active' ? 'bg-success/10 text-success border-success/20' :
                        user.status === 'pending' ? 'bg-warning/10 text-warning border-warning/20' :
                        'bg-destructive/10 text-destructive border-destructive/20'
                      )}>
                        {user.status === 'active' ? <CheckCircle size={12} /> :
                         user.status === 'pending' ? <Clock size={12} /> : <Ban size={12} />}
                        {user.status === 'active' ? 'Ativo' :
                         user.status === 'pending' ? 'Pendente' : 'Bloqueado'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium',
                        user.role === 'admin' ? 'text-primary bg-primary/10' : 'text-muted-foreground bg-muted/10'
                      )}>
                        {user.role === 'admin' ? <Shield size={12} /> : <User size={12} />}
                        {user.role === 'admin' ? 'Admin' : 'Membro'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openModal(user)}
                          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
                          title="Editar"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => openPasswordModal(user)}
                          className="p-2 rounded-lg text-muted-foreground hover:text-warning hover:bg-warning/10 transition-colors"
                          title="Resetar Senha"
                        >
                          <KeyRound size={18} />
                        </button>
                        <button
                          onClick={() => handleRoleChange(user.id, user.role)}
                          disabled={actionLoading === user.id}
                          className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                          title={user.role === 'admin' ? 'Rebaixar' : 'Promover'}
                        >
                          <Shield size={18} />
                        </button>
                        <button
                          onClick={() => handleStatusChange(user.id, user.status === 'active' ? 'blocked' : 'active')}
                          disabled={actionLoading === user.id}
                          className={cn(
                            'p-2 rounded-lg transition-colors',
                            user.status === 'active'
                              ? 'text-success hover:text-destructive hover:bg-destructive/10'
                              : 'text-destructive hover:text-success hover:bg-success/10'
                          )}
                          title={user.status === 'active' ? 'Bloquear' : 'Ativar'}
                        >
                          {actionLoading === user.id ? <Loader2 size={18} className="animate-spin" /> :
                           user.status === 'active' ? <Ban size={18} /> : <CheckCircle size={18} />}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={actionLoading === user.id}
                          className="p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between bg-surface/50">
          <div className="text-sm text-muted-foreground">
            {Math.min((page - 1) * limit + 1, totalCount)}-{Math.min(page * limit, totalCount)} de {totalCount}
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
            >
              <ChevronLeft size={16} />
            </Button>
            <span className="text-sm text-muted-foreground px-2">
              {page} / {totalPages || 1}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleModalSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nome Completo</label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-3 text-muted-foreground" size={18} />
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-10"
                  placeholder="Nome do usuário"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">E-mail</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 text-muted-foreground" size={18} />
                <Input
                  type="email"
                  required
                  disabled={!!editingUser}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10"
                  placeholder="email@exemplo.com"
                />
              </div>
            </div>

            {!editingUser && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Senha</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-3 text-muted-foreground" size={18} />
                  <Input
                    type="password"
                    required={!editingUser}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10"
                    placeholder="Senha inicial (mín. 6 caracteres)"
                    minLength={6}
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={modalLoading}>
                {modalLoading ? <Loader2 className="animate-spin" /> : editingUser ? 'Salvar' : 'Criar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Password Reset Modal */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="text-warning" size={20} />
              Resetar Senha
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-surface rounded-lg">
              <p className="text-sm text-muted-foreground">Usuário:</p>
              <p className="font-medium">{passwordUser?.full_name || 'Sem nome'}</p>
              <p className="text-sm text-muted-foreground">{passwordUser?.email}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Nova Senha</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 text-muted-foreground" size={18} />
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10"
                  placeholder="Nova senha (mín. 6 caracteres)"
                  minLength={6}
                />
              </div>
            </div>

            <div className="p-3 bg-warning/10 border border-warning/30 rounded-lg text-sm text-warning">
              ⚠️ A senha será alterada imediatamente. O usuário precisará usar a nova senha no próximo login.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handlePasswordReset} disabled={passwordLoading || !newPassword} className="bg-warning hover:bg-warning/90">
              {passwordLoading ? <Loader2 className="animate-spin" /> : 'Alterar Senha'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
