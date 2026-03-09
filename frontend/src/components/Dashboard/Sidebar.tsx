/**
 * Sidebar Navigation Component
 * Handles main navigation for the judicial intelligence platform
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  Home, 
  BookOpen, 
  Video, 
  Beaker, 
  Blocks, 
  FileText, 
  Bell, 
  User, 
  MessageSquare,
  BarChart3,
  Settings
} from 'lucide-react';

const navigation = [
  { href: '/dashboard/learning', label: 'Learning Dashboard', icon: Home },
  { href: '/dashboard/research-library', label: 'Research Library', icon: BookOpen },
  { href: '/dashboard/modules', label: 'Learning Modules', icon: BarChart3 },
  { href: '/dashboard/video-lessons', label: 'Video Lessons', icon: Video },
  { href: '/dashboard/simulation-lab', label: 'Simulation Lab', icon: Beaker },
  { href: '/dashboard/simulations', label: 'Simulations', icon: BarChart3 },
  { href: '/dashboard/concept-builder', label: 'Concept Builder', icon: Blocks },
  { href: '/dashboard/draft-workspace', label: 'Draft Workspace', icon: FileText },
  { href: '/dashboard/moot-court', label: 'Moot Court', icon: MessageSquare },
  { href: '/dashboard/ai-assistant', label: 'AI Assistant', icon: MessageSquare },
  { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<{name?: string; email?: string; avatar?: string} | null>(null);

  useEffect(() => {
    // Load user data from localStorage or API
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <Link href="/dashboard" className="flex items-center gap-3" onClick={onClose}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Judicial AI</h1>
            <p className="text-xs text-slate-400">Legal Intelligence Platform</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/dashboard' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-slate-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
