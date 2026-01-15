import { Link, useLocation } from 'react-router-dom';
import {
  Flame,
  User,
  Trophy,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { useAdmin } from '@/hooks/useAdmin';

const menuItems = [
  { icon: Flame, label: 'Desafio', path: '/', adminOnly: false },
  { icon: Trophy, label: 'Conquistas', path: '/conquistas', adminOnly: false },
  { icon: User, label: 'Perfil', path: '/perfil', adminOnly: false },
  { icon: Settings, label: 'Admin', path: '/admin', adminOnly: true },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { progress, getProgressPercentage } = useUserProgress();
  const { isAdmin } = useAdmin();

  // Filter menu items based on admin status
  const visibleMenuItems = menuItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 z-50 flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Link to="/" className="flex w-full items-center justify-center">
          <img
            src="/logo.svg"
            alt="FIRE"
            className="h-14 w-auto"
          />
        </Link>
      </div>

      {/* Progress Mini */}
      {!collapsed && (
        <div className="px-6 py-4 border-b border-sidebar-border">
          <div className="glass-card p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Progresso</span>
              <span className="text-sm font-semibold text-fire">{getProgressPercentage()}%</span>
            </div>
            <div className="h-2 bg-background rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-fire rounded-full transition-all duration-500"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {visibleMenuItems.map((item) => {
          const isChallengeRoute = item.path === '/';
          const isActive = isChallengeRoute
            ? location.pathname === '/' ||
            location.pathname.startsWith('/app') ||
            location.pathname.startsWith('/desafio') ||
            location.pathname.startsWith('/dia/')
            : location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-surface-hover hover:text-foreground",
                collapsed && "justify-center px-3"
              )}
            >
              <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-primary")} />
              {!collapsed && (
                <span className="font-medium animate-fade-in">{item.label}</span>
              )}
              {isActive && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-sidebar-border">
        <div className={cn(
          "flex items-center gap-3",
          collapsed && "justify-center"
        )}>
          <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center">
            <User className="w-5 h-5 text-muted-foreground" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0 animate-fade-in">
              <p className="text-sm font-medium truncate">{progress.userName}</p>
              <p className="text-xs text-muted-foreground">Dia {progress.currentDay} de 15</p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-surface border border-border rounded-full flex items-center justify-center hover:bg-surface-hover transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
    </aside>
  );
};
