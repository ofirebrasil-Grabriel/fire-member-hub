import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserWithProgress {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  created_at: string;
  subscription_status: string | null;
  current_day: number;
}

export interface WebhookLog {
  id: string;
  source: string;
  event: string;
  status_code: number | null;
  received_at: string;
  payload: any;
  response: any;
}

export interface Setting {
  id: string;
  key: string;
  value: any;
  description: string | null;
}

export const useAdmin = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserWithProgress[]>([]);
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([]);
  const [settings, setSettings] = useState<Setting[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeToday: 0,
    completionRate: 0,
    webhooks24h: 0,
  });

  // Check if current user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      setIsAdmin(!!data && !error);
      setLoading(false);
    };

    checkAdmin();
  }, [user]);

  // Fetch users with their progress
  const fetchUsers = async () => {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select(`
        id,
        email,
        full_name,
        avatar_url,
        created_at,
        subscriptions (status)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      return;
    }

    // Get day progress for each user
    const usersWithProgress: UserWithProgress[] = await Promise.all(
      (profiles || []).map(async (profile: any) => {
        const { data: progress } = await supabase
          .from('day_progress')
          .select('day_id')
          .eq('user_id', profile.id)
          .eq('completed', true)
          .order('day_id', { ascending: false })
          .limit(1)
          .maybeSingle();

        return {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          created_at: profile.created_at,
          subscription_status: profile.subscriptions?.[0]?.status || null,
          current_day: progress?.day_id || 0,
        };
      })
    );

    setUsers(usersWithProgress);
  };

  // Fetch webhook logs
  const fetchWebhookLogs = async () => {
    const { data, error } = await supabase
      .from('webhook_logs')
      .select('*')
      .order('received_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching webhook logs:', error);
      return;
    }

    setWebhookLogs(data || []);
  };

  // Fetch settings
  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .order('key');

    if (error) {
      console.error('Error fetching settings:', error);
      return;
    }

    setSettings(data || []);
  };

  // Calculate stats
  const fetchStats = async () => {
    // Total users
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // Active today (users with progress today)
    const today = new Date().toISOString().split('T')[0];
    const { count: activeToday } = await supabase
      .from('day_progress')
      .select('*', { count: 'exact', head: true })
      .gte('updated_at', today);

    // Completion rate (users who completed day 15)
    const { count: completed } = await supabase
      .from('day_progress')
      .select('*', { count: 'exact', head: true })
      .eq('day_id', 15)
      .eq('completed', true);

    // Webhooks in last 24h
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count: webhooks24h } = await supabase
      .from('webhook_logs')
      .select('*', { count: 'exact', head: true })
      .gte('received_at', yesterday);

    const completionRate = totalUsers && totalUsers > 0
      ? Math.round(((completed || 0) / totalUsers) * 100)
      : 0;

    setStats({
      totalUsers: totalUsers || 0,
      activeToday: activeToday || 0,
      completionRate,
      webhooks24h: webhooks24h || 0,
    });
  };

  // Update user subscription status
  const updateUserStatus = async (userId: string, status: string) => {
    const { error } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        product_id: 'fire-challenge',
        status,
        started_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,product_id',
      });

    if (error) {
      console.error('Error updating user status:', error);
      return false;
    }

    await fetchUsers();
    return true;
  };

  // Update setting
  const updateSetting = async (key: string, value: any) => {
    const { error } = await supabase
      .from('settings')
      .update({ value, updated_at: new Date().toISOString() })
      .eq('key', key);

    if (error) {
      console.error('Error updating setting:', error);
      return false;
    }

    await fetchSettings();
    return true;
  };

  // Delete user
  const deleteUser = async (userId: string) => {
    // Note: This only deletes from profiles, cascade will handle related data
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('Error deleting user:', error);
      return false;
    }

    await fetchUsers();
    return true;
  };

  // Fetch all data
  const fetchAllData = async () => {
    if (!isAdmin) return;
    
    await Promise.all([
      fetchUsers(),
      fetchWebhookLogs(),
      fetchSettings(),
      fetchStats(),
    ]);
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAllData();
    }
  }, [isAdmin]);

  return {
    isAdmin,
    loading,
    users,
    webhookLogs,
    settings,
    stats,
    fetchUsers,
    fetchWebhookLogs,
    fetchSettings,
    fetchStats,
    updateUserStatus,
    updateSetting,
    deleteUser,
    refetch: fetchAllData,
  };
};
