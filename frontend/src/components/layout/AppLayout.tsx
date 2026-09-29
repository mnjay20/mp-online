import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  GitBranch,
  BookOpen,
  Briefcase,
  Layers,
  FileText,
  Mic,
  Sparkles,
  Users,
  ShieldCheck,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { useAuthStore, UserRole } from '@/store/authStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: any;
  highlight?: boolean;
  roleRequired?: string;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const { role, switchRole, student } = useAuthStore();

  const navigation: NavGroup[] = [
    {
      group: 'Intelligence & Growth',
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Career Explorer', href: '/careers', icon: Compass },
        { name: 'Skill Gap & Roadmap', href: '/skill-gap', icon: GitBranch },
        { name: 'Courses & Catalog', href: '/courses', icon: BookOpen },
      ],
    },
    {
      group: 'Applications & Evaluation',
      items: [
        { name: 'Job Board & Matches', href: '/jobs', icon: Briefcase },
        { name: 'ATS Tracker', href: '/applications', icon: Layers },
        { name: 'Resume ATS Scanner', href: '/resume', icon: FileText },
        { name: 'AI Mock Interview', href: '/interview', icon: Mic, highlight: true },
        { name: 'Career Copilot', href: '/copilot', icon: Sparkles },
      ],
    },
    {
      group: 'Enterprise Portal',
      items: [
        { name: 'Recruiter ATS Portal', href: '/recruiter', icon: Users, roleRequired: 'RECRUITER' },
      ],
    },
  ];


  return (
    <div className="flex min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-card/95 backdrop-blur-md">
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <Link to="/dashboard" className="flex items-center gap-2.5 font-bold tracking-tight">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Zap className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold leading-none">Pathfinder</span>
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-1">Employability AI</span>
            </div>
          </Link>
          <Badge variant="cyan" className="text-[10px] px-1.5 py-0">v2.5</Badge>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {navigation.map((group) => (
            <div key={group.group} className="space-y-1">
              <h4 className="px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                {group.group}
              </h4>
              <nav className="space-y-0.5 pt-1">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        'group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all',
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={cn('size-4 shrink-0 transition-transform group-hover:scale-105', isActive ? 'text-primary-foreground' : 'text-muted-foreground')} />
                        <span>{item.name}</span>
                      </div>
                      {item.highlight && !isActive && (
                        <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* User Card & Profile Completeness */}
        <div className="border-t border-border p-4 bg-muted/30">
          <div className="flex items-center gap-3">
            <Avatar fallback={student ? `${student.first_name[0]}${student.last_name[0]}` : 'US'} />
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium truncate leading-none">
                  {student ? `${student.first_name} ${student.last_name}` : 'Student User'}
                </p>
                <Badge variant={role === 'RECRUITER' ? 'warning' : 'outline'} className="text-[10px] px-1 py-0">
                  {role}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground truncate mt-1">
                {student?.target_career_title || 'Software Engineer'}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-8 backdrop-blur-md">
          {/* Breadcrumb / Status */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/dashboard" className="hover:text-foreground">App</Link>
            <ChevronRight className="size-3 text-muted-foreground/60" />
            <span className="font-semibold text-foreground capitalize">
              {location.pathname.replace('/', '') || 'Dashboard'}
            </span>
          </div>

          {/* Role Switcher & Header Actions */}
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-lg border border-border bg-card p-1 text-xs">
              <span className="px-2 text-muted-foreground font-medium">Role:</span>
              {(['STUDENT', 'RECRUITER', 'ADMIN'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => switchRole(r)}
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-semibold transition-all',
                    role === r
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {r}
                </button>
              ))}
            </div>

            <Link to="/interview">
              <Button size="sm" variant="success" className="gap-1.5 font-medium">
                <Mic className="size-3.5" />
                <span>Start Mock Session</span>
              </Button>
            </Link>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
