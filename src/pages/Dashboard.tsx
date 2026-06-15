import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  ArrowRight,
  MoreVertical,
  Calendar as CalendarIcon,
  Search,
  X
} from 'lucide-react';
import { Card, Button } from '../components/UI';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const stats = [
  { label: 'Avg. Attendance', value: '84%', change: '+2.4%', trend: 'up', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', path: '/attendance' },
  { label: 'Notes Generated', value: '12', change: '+3', trend: 'up', icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50', path: '/notes' },
  { label: 'Pending Grades', value: '45', change: '-12', trend: 'down', icon: CheckCircle, color: 'text-amber-600', bg: 'bg-amber-50', path: '/grading' },
  { label: 'Teaching Hours', value: '18h', change: '+2h', trend: 'up', icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-50', path: '/schedule' },
];

const attendanceData = [
  { name: 'Mon', value: 85 },
  { name: 'Tue', value: 78 },
  { name: 'Wed', value: 92 },
  { name: 'Thu', value: 88 },
  { name: 'Fri', value: 76 },
];

const gradeDistribution = [
  { name: 'A', count: 12 },
  { name: 'B', count: 24 },
  { name: 'C', count: 18 },
  { name: 'D', count: 8 },
  { name: 'F', count: 3 },
];

const todayLectures = [
  { id: '1', course: 'Data Structures', topic: 'Binary Search Trees', time: '10:00 AM', room: '204', status: 'ongoing' },
  { id: '2', course: 'Algorithms', topic: 'Dynamic Programming', time: '01:30 PM', room: '102', status: 'upcoming' },
  { id: '3', course: 'Discrete Math', topic: 'Graph Theory', time: '03:45 PM', room: '305', status: 'upcoming' },
];

const announcementsData = [
  { id: 'a1', title: 'Mid-term Exam Schedule Released', details: 'The schedule for the upcoming mid-term exams is now available in the portal.', time: '2 hours ago • All Students', primary: true },
  { id: 'a2', title: 'Assignment 3 Deadline Extended', details: 'Due to the technical issues, the deadline for Assignment 3 has been extended to Friday.', time: 'Yesterday • Algorithms Class', primary: false }
];

export function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : { name: 'Anil Panwar' };
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleUpdate = () => {
      const saved = localStorage.getItem('userProfile');
      if (saved) setProfile(JSON.parse(saved));
    };
    window.addEventListener('profileUpdate', handleUpdate);
    return () => window.removeEventListener('profileUpdate', handleUpdate);
  }, []);

  // Listen to search updates emitted by the global Navbar
  useEffect(() => {
    const handleSearchEvent = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setSearchQuery(customEvent.detail || '');
    };
    window.addEventListener('updateGlobalSearch', handleSearchEvent);
    return () => window.removeEventListener('updateGlobalSearch', handleSearchEvent);
  }, []);

  const handleLocalSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    // Propagate to navbar search as well
    window.dispatchEvent(new CustomEvent('updateGlobalSearch', { detail: val }));
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    window.dispatchEvent(new CustomEvent('updateGlobalSearch', { detail: '' }));
  };

  // Perform multi-dimensional matching across available entities
  const filteredNavigation = searchQuery ? stats.filter(stat => 
    stat.label.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const filteredLectures = searchQuery ? todayLectures.filter(l => 
    l.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.room.toLowerCase().includes(searchQuery.toLowerCase())
  ) : todayLectures;

  const filteredAnnouncements = searchQuery ? announcementsData.filter(ann => 
    ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ann.details.toLowerCase().includes(searchQuery.toLowerCase())
  ) : announcementsData;

  return (
    <div className="space-y-8">
      {/* Greeting Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, {profile.name}</h1>
          <p className="text-slate-500">Here's what's happening with your classes today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" icon={<CalendarIcon />} onClick={() => navigate('/schedule')}>View Calendar</Button>
          <Button onClick={() => navigate('/notes')}>Generate Notes</Button>
        </div>
      </div>

      {/* Prominent Live Search Area on Dashboard */}
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-indigo-500 animate-pulse" />
        </div>
        <input 
          id="dashboard-main-search"
          type="text"
          value={searchQuery}
          onChange={handleLocalSearchChange}
          placeholder="Search courses, announcements, notes, or specific pages (e.g. 'Attendance', 'Binary', 'Algorithms')..."
          className="w-full pl-12 pr-10 py-3.5 bg-white border border-indigo-100 rounded-2xl text-slate-800 placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 shadow-sm transition-all font-medium"
        />
        {searchQuery && (
          <button 
            type="button" 
            onClick={handleClearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
            title="Clear Search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Comprehensive Search Results Section */}
      {searchQuery && (
        <Card 
          id="search-results-overlay-card" 
          className="border-indigo-200 bg-indigo-50/10 p-5 transition-all duration-300"
          title={`Found matches for "${searchQuery}"`}
          headerAction={
            <button 
              onClick={handleClearSearch}
              className="text-indigo-600 hover:text-indigo-800 text-xs font-bold"
            >
              Clear Search
            </button>
          }
        >
          <div className="space-y-6">
            {/* Quick Navigation Matching */}
            {filteredNavigation.length > 0 && (
              <div>
                <h4 className="text-[10px] font-bold uppercase text-indigo-500 tracking-wider mb-2">QUICK MODULE SHORTCUTS</h4>
                <div className="flex flex-wrap gap-2">
                  {filteredNavigation.map(item => (
                    <button
                      key={item.label}
                      onClick={() => navigate(item.path)}
                      className="px-3.5 py-2 bg-white border border-indigo-100 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/50 text-xs font-semibold text-indigo-600 transition-all shadow-sm flex items-center gap-2"
                    >
                      <item.icon className="w-4 h-4" /> Go to {item.label} <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Filtered Lectures */}
              <div>
                <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">LECTURES MATCHED ({filteredLectures.length})</h4>
                {filteredLectures.length > 0 ? (
                  <div className="space-y-2">
                    {filteredLectures.map(lecture => (
                      <div 
                        key={lecture.id}
                        onClick={() => navigate('/schedule')}
                        className="p-3 bg-white border border-slate-100 rounded-xl hover:border-indigo-200 cursor-pointer transition-all flex items-start gap-3"
                      >
                        <div className="w-9 h-9 rounded-lg bg-indigo-55 bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-xs shrink-0 font-mono">
                          R-{lecture.room}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">{lecture.course}</p>
                          <p className="text-[11px] text-slate-500 truncate">{lecture.topic}</p>
                          <p className="text-[10px] text-slate-400 mt-1 font-semibold">{lecture.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No lecturing courses match.</p>
                )}
              </div>

              {/* Filtered Announcements */}
              <div>
                <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">ANNOUNCEMENTS MATCHED ({filteredAnnouncements.length})</h4>
                {filteredAnnouncements.length > 0 ? (
                  <div className="space-y-2">
                    {filteredAnnouncements.map(ann => (
                      <div 
                        key={ann.id}
                        onClick={() => navigate('/announcements')}
                        className="p-3 bg-white border border-slate-100 rounded-xl hover:border-indigo-200 cursor-pointer transition-all"
                      >
                        <h5 className="font-bold text-slate-800 text-xs sm:text-sm">{ann.title}</h5>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{ann.details}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{ann.time}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No announcments match.</p>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Main Stats Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card 
            key={stat.label} 
            className="p-0 cursor-pointer hover:border-indigo-200 transition-colors group"
            onClick={() => navigate(stat.path)}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={stat.bg + " p-2 rounded-lg group-hover:scale-110 transition-transform"}>
                  <stat.icon className={"w-5 h-5 " + stat.color} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
              <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card title="Weekly Attendance" className="lg:col-span-2">
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#4f46e5', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Today's Lectures" headerAction={<Button variant="ghost" size="sm" onClick={() => navigate('/schedule')}>View All</Button>}>
          <div className="space-y-4">
            {todayLectures.map((lecture) => (
              <div 
                key={lecture.id} 
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group"
                onClick={() => navigate('/schedule')}
              >
                <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-slate-100 text-slate-600 font-bold text-xs">
                  <span className="text-slate-400 uppercase">Room</span>
                  {lecture.room}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-900 truncate">{lecture.course}</h4>
                  <p className="text-xs text-slate-500 truncate">{lecture.topic}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span className="text-xs text-slate-500">{lecture.time}</span>
                    {lecture.status === 'ongoing' && (
                      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                        <span className="w-1 h-1 bg-indigo-600 rounded-full animate-pulse"></span>
                        Live
                      </span>
                    )}
                  </div>
                </div>
                <button className="p-1 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-6" onClick={() => navigate('/schedule')}>Add New Lecture</Button>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Grade Distribution">
          <div className="h-[250px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card 
          title="Recent Announcements" 
          headerAction={<Button variant="ghost" size="sm" onClick={() => navigate('/announcements')}>New</Button>}
          className="cursor-pointer hover:border-indigo-100 transition-colors"
          onClick={() => navigate('/announcements')}
        >
          <div className="space-y-6">
            <div className="relative pl-6 border-l-2 border-indigo-100">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-600 border-4 border-white"></div>
              <h5 className="font-semibold text-sm text-slate-900">Mid-term Exam Schedule Released</h5>
              <p className="text-xs text-slate-500 mt-1">The schedule for the upcoming mid-term exams is now available in the portal.</p>
              <span className="text-[10px] text-slate-400 mt-2 block">2 hours ago • All Students</span>
            </div>
            <div className="relative pl-6 border-l-2 border-slate-100">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-300 border-4 border-white"></div>
              <h5 className="font-semibold text-sm text-slate-900">Assignment 3 Deadline Extended</h5>
              <p className="text-xs text-slate-500 mt-1">Due to the technical issues, the deadline for Assignment 3 has been extended to Friday.</p>
              <span className="text-[10px] text-slate-400 mt-2 block">Yesterday • Algorithms Class</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

