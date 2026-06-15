import React, { useState, useEffect } from 'react';
import { Bell, Search, User, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchVal, setSearchVal] = useState('');
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

  // Listen to search updates from individual pages
  useEffect(() => {
    const handleSearchEvent = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setSearchVal(customEvent.detail || '');
    };
    window.addEventListener('updateGlobalSearch', handleSearchEvent);
    return () => window.removeEventListener('updateGlobalSearch', handleSearchEvent);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchVal(value);
    
    // Dispatch custom event to notify current active page
    window.dispatchEvent(new CustomEvent('updateGlobalSearch', { detail: value }));
    
    // Redirect to Dashboard if typing search query and on a different subpage
    if (value && location.pathname !== '/' && location.pathname !== '/dashboard') {
      navigate('/');
    }
  };

  const handleClear = () => {
    setSearchVal('');
    window.dispatchEvent(new CustomEvent('updateGlobalSearch', { detail: '' }));
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            value={searchVal}
            onChange={handleChange}
            placeholder="Search lectures, pages, or announcements..." 
            className="w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
          />
          {searchVal && (
            <button 
              type="button" 
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/announcements')}
          className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="h-8 w-px bg-slate-200 mx-2"></div>
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/settings')}>
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-700 leading-tight">{profile.name}</p>
            <p className="text-xs text-slate-400 font-medium">{profile.dept}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 uppercase font-bold text-xs">
            {profile.name.split(' ').map((n: string) => n[0]).join('')}
          </div>
        </div>
      </div>
    </header>
  );
}

