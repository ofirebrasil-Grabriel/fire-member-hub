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

export interface DayContent {
  id: number;
  title: string;
  subtitle: string;
  emoji: string;
  morning_message: string | null;
  morning_audio_url: string | null;
  concept: string | null;
  concept_title: string | null;
  concept_audio_url: string | null;
  task_title: string | null;
  task_steps: any[];
  tools: string[];
  reflection_questions: string[];
  commitment: string | null;
  next_day_preview: string | null;
}

export const useAdmin = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserWithProgress[]>([]);
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([]);
  const [settings, setSettings] = useState<Setting[]>([]);
  const [days, setDays] = useState<DayContent[]>([]);
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
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      return;
    }

    // Get subscriptions
    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select('user_id, status');

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

        const userSub = subscriptions?.find(s => s.user_id === profile.id);

        return {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          created_at: profile.created_at,
          subscription_status: userSub?.status || null,
          current_day: progress?.day_id || 0,
        };
      })
    );

    setUsers(usersWithProgress);
  };

  // Fetch days content
  const fetchDays = async () => {
    const { data, error } = await supabase
      .from('days')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching days:', error);
      return;
    }

    setDays((data || []).map((d: any) => ({
      ...d,
      task_steps: Array.isArray(d.task_steps) ? d.task_steps : [],
      tools: Array.isArray(d.tools) ? d.tools : [],
      reflection_questions: Array.isArray(d.reflection_questions) ? d.reflection_questions : [],
    })));
  };

  // Create new day
  const createDay = async (dayData: Partial<DayContent>) => {
    const { error } = await supabase
      .from('days')
      .insert(dayData as any);

    if (error) {
      console.error('Error creating day:', error);
      return false;
    }

    await fetchDays();
    return true;
  };

  // Update day
  const updateDay = async (dayId: number, dayData: Partial<DayContent>) => {
    const { error } = await supabase
      .from('days')
      .update(dayData as any)
      .eq('id', dayId);

    if (error) {
      console.error('Error updating day:', error);
      return false;
    }

    await fetchDays();
    return true;
  };

  // Delete day
  const deleteDay = async (dayId: number) => {
    const { error } = await supabase
      .from('days')
      .delete()
      .eq('id', dayId);

    if (error) {
      console.error('Error deleting day:', error);
      return false;
    }

    await fetchDays();
    return true;
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

  // Create setting
  const createSetting = async (key: string, value: any, description?: string) => {
    const { error } = await supabase
      .from('settings')
      .insert({ key, value, description });

    if (error) {
      console.error('Error creating setting:', error);
      return false;
    }

    await fetchSettings();
    return true;
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

  // Create new user
  const createUser = async (email: string, password: string, fullName: string) => {
    try {
      const response = await fetch(
        `https://gvjvygukvupjxadevduj.supabase.co/functions/v1/setup-admin`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            action: 'create_user',
            email, 
            password, 
            full_name: fullName 
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('Error creating user:', error);
        return false;
      }

      await fetchUsers();
      return true;
    } catch (error) {
      console.error('Error creating user:', error);
      return false;
    }
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
        updated_at: new Date().toISOString(),
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

  // Update user profile
  const updateUser = async (userId: string, data: { full_name?: string; email?: string }) => {
    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', userId);

    if (error) {
      console.error('Error updating user:', error);
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

  // Delete setting
  const deleteSetting = async (key: string) => {
    const { error } = await supabase
      .from('settings')
      .delete()
      .eq('key', key);

    if (error) {
      console.error('Error deleting setting:', error);
      return false;
    }

    await fetchSettings();
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
      fetchDays(),
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
    days,
    createUser,
    updateUser,
    fetchUsers,
    fetchWebhookLogs,
    fetchSettings,
    fetchStats,
    fetchDays,
    createDay,
    updateDay,
    deleteDay,
    updateUserStatus,
    updateSetting,
    createSetting,
    deleteSetting,
    deleteUser,
    refetch: fetchAllData,
  };
};
