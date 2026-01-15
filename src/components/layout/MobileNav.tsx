import { Link, useLocation } from 'react-router-dom';
import { Flame, Trophy, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Flame, label: 'Desafio', path: '/' },
  { icon: Trophy, label: 'Conquistas', path: '/conquistas' },
  { icon: User, label: 'Perfil', path: '/perfil' },
];

export const MobileNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-sidebar/95 backdrop-blur-xl border-t border-sidebar-border z-50 md:hidden">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item) => {
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
                "flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all duration-200",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <div className={cn(
                "p-2 rounded-xl transition-all duration-200",
                isActive && "bg-primary/15"
              )}>
                <item.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
