import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  FileText, 
  HelpCircle, 
  CheckSquare, 
  Megaphone, 
  Settings,
  GraduationCap
} from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Calendar, label: 'Schedule', path: '/schedule' },
  { icon: Users, label: 'Attendance', path: '/attendance' },
  { icon: FileText, label: 'Notes Gen', path: '/notes' },
  { icon: HelpCircle, label: 'Question Paper', path: '/questions' },
  { icon: CheckSquare, label: 'Grading', path: '/grading' },
  { icon: Megaphone, label: 'Announcements', path: '/announcements' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : { name: 'G.S.Gayathri', dept: 'Computer Science' };
  });

  useEffect(() => {
    const handleUpdate = () => {
      const saved = localStorage.getItem('userProfile');
      if (saved) setProfile(JSON.parse(saved));
    };
    window.addEventListener('profileUpdate', handleUpdate);
    return () => window.removeEventListener('profileUpdate', handleUpdate);
  }, []);

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen sticky top-0 flex flex-col">
      <div className="p-6 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
        <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-100">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Academia AI</h1>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              isActive 
                ? "bg-indigo-50 text-indigo-700" 
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 p-2 cursor-pointer hover:bg-slate-50 rounded-lg transition-colors" onClick={() => navigate('/settings')}>
          <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-xs font-bold text-indigo-600 uppercase">
            {profile.name.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{profile.name}</p>
            <p className="text-xs text-slate-500 truncate">{profile.dept}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
