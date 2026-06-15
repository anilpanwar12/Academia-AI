import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Send,
  Users,
  Clock,
  X,
  Edit2,
  Trash2,
  BarChart2,
  CheckCircle,
  AlertTriangle,
  Info,
  Calendar,
  RotateCcw,
  Check,
  UserCheck
} from 'lucide-react';
import { Card, Button } from '../components/UI';
import { cn } from '../lib/utils';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

interface ReadReceipt {
  name: string;
  roll: string;
  status: 'Acknowledged' | 'Sent (Pending)';
  time: string;
}

interface ViewLog {
  name: string;
  views: number;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  target: string;
  priority: 'high' | 'medium' | 'low';
  isHistory?: boolean;
  stats: {
    reached: number;
    total: number;
    open: number;
    ack: number;
    readHistory: ViewLog[];
    receipts: ReadReceipt[];
  };
}

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  { 
    id: '1', 
    title: 'Mid-term Exam Schedule Released', 
    content: 'The schedule for the upcoming mid-term exams is now available in the portal. Please check your respective course sections for details regarding syllabus weightage, room assignments, and specific instructions.', 
    date: 'March 26, 2026', 
    target: 'All Students', 
    priority: 'high',
    isHistory: false,
    stats: {
      reached: 148,
      total: 150,
      open: 139,
      ack: 128,
      readHistory: [
        { name: '10:00 AM', views: 15 },
        { name: '11:00 AM', views: 42 },
        { name: '12:00 PM', views: 35 },
        { name: '01:00 PM', views: 20 },
        { name: '02:00 PM', views: 18 },
        { name: '03:00 PM', views: 10 },
      ],
      receipts: [
        { name: 'Amit Sharma', roll: 'CS2026-01', status: 'Acknowledged', time: '10:15 AM' },
        { name: 'Neha Roy', roll: 'CS2026-02', status: 'Acknowledged', time: '10:22 AM' },
        { name: 'Priyanka Patel', roll: 'CS2026-04', status: 'Acknowledged', time: '10:30 AM' },
        { name: 'Karan Singh', roll: 'CS2026-05', status: 'Acknowledged', time: '11:02 AM' },
        { name: 'Chandan Kumar', roll: 'CS2026-03', status: 'Sent (Pending)', time: '-' }
      ]
    }
  },
  { 
    id: '2', 
    title: 'Assignment 3 Deadline Extended', 
    content: 'Due to the technical issues with the database hosting servers last night, the deadline for Assignment 3 has been officially extended to Friday, 11:59 PM. Late penalties are waived.', 
    date: 'March 25, 2026', 
    target: 'Algorithms Class', 
    priority: 'medium',
    isHistory: false,
    stats: {
      reached: 45,
      total: 48,
      open: 42,
      ack: 40,
      readHistory: [
        { name: '09:00 AM', views: 5 },
        { name: '10:00 AM', views: 15 },
        { name: '11:00 AM', views: 12 },
        { name: '12:00 PM', views: 6 },
        { name: '01:00 PM', views: 4 },
      ],
      receipts: [
        { name: 'Neha Roy', roll: 'CS2026-02', status: 'Acknowledged', time: '09:32 AM' },
        { name: 'Karan Singh', roll: 'CS2026-05', status: 'Acknowledged', time: '09:40 AM' },
        { name: 'Amit Sharma', roll: 'CS2026-01', status: 'Acknowledged', time: '09:42 AM' },
        { name: 'Chandan Kumar', roll: 'CS2026-03', status: 'Sent (Pending)', time: '-' }
      ]
    }
  },
  { 
    id: '3', 
    title: 'Guest Lecture: AI in Healthcare', 
    content: 'We are hosting a guest lecture by Dr. Emily Chen on the applications of AI in modern healthcare systems this Thursday at 2 PM. Attendance is counted as extra lab credits.', 
    date: 'March 24, 2026', 
    target: 'Computer Science Dept', 
    priority: 'low',
    isHistory: false,
    stats: {
      reached: 75,
      total: 80,
      open: 68,
      ack: 55,
      readHistory: [
        { name: '02:00 PM', views: 8 },
        { name: '03:00 PM', views: 22 },
        { name: '04:00 PM', views: 15 },
        { name: '05:00 PM', views: 10 },
      ],
      receipts: [
        { name: 'Priyanka Patel', roll: 'CS2026-04', status: 'Acknowledged', time: '02:15 PM' },
        { name: 'Karan Singh', roll: 'CS2026-05', status: 'Acknowledged', time: '02:22 PM' },
        { name: 'Amit Sharma', roll: 'CS2026-01', status: 'Acknowledged', time: '02:40 PM' }
      ]
    }
  },
  { 
    id: 'h1', 
    title: 'Spring Semester Welcome Address & Student Guidelines', 
    content: 'Welcome back to campus! Here is a guide to help you find your classrooms, academic advisers, and reference material recommendations. Make sure to download the updated handbook.', 
    date: 'February 10, 2026', 
    target: 'All Students', 
    priority: 'low',
    isHistory: true,
    stats: {
      reached: 150,
      total: 150,
      open: 148,
      ack: 145,
      readHistory: [
        { name: 'Day 1', views: 85 },
        { name: 'Day 2', views: 35 },
        { name: 'Day 3', views: 18 },
        { name: 'Day 4', views: 10 },
      ],
      receipts: [
        { name: 'Amit Sharma', roll: 'CS2026-01', status: 'Acknowledged', time: 'Feb 10, 09:12 AM' },
        { name: 'Neha Roy', roll: 'CS2026-02', status: 'Acknowledged', time: 'Feb 10, 09:20 AM' },
        { name: 'Chandan Kumar', roll: 'CS2026-03', status: 'Acknowledged', time: 'Feb 11, 10:15 AM' }
      ]
    }
  },
  { 
    id: 'h2', 
    title: 'Departmental Research Grants & Work Study', 
    content: 'Submit your research proposals and departmental work study applications to the main administration cubicle. Deadline for grant submission details is final.', 
    date: 'January 28, 2026', 
    target: 'Computer Science Dept', 
    priority: 'high',
    isHistory: true,
    stats: {
      reached: 78,
      total: 80,
      open: 72,
      ack: 68,
      readHistory: [
        { name: 'Day 1', views: 40 },
        { name: 'Day 2', views: 20 },
        { name: 'Day 3', views: 8 },
      ],
      receipts: [
        { name: 'Neha Roy', roll: 'CS2026-02', status: 'Acknowledged', time: 'Jan 28, 11:30 AM' },
        { name: 'Amit Sharma', roll: 'CS2026-01', status: 'Acknowledged', time: 'Jan 28, 01:22 PM' }
      ]
    }
  }
];

export function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filtering & History state
  const [showHistory, setShowHistory] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterTarget, setFilterTarget] = useState('all');

  // Popover menus state
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Modal State (Add/Edit)
  const [showFormModal, setShowFormModal] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Field State
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formTarget, setFormTarget] = useState('All Students');
  const [formPriority, setFormPriority] = useState<'high' | 'medium' | 'low'>('medium');

  // Analytics Popup State
  const [viewAnalyticsAnn, setViewAnalyticsAnn] = useState<Announcement | null>(null);

  // Success Confirmation banner
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Synchronise with Global Navigation search
  useEffect(() => {
    const handleSearchEvent = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setSearchQuery(customEvent.detail || '');
    };
    window.addEventListener('updateGlobalSearch', handleSearchEvent);
    return () => window.removeEventListener('updateGlobalSearch', handleSearchEvent);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    window.dispatchEvent(new CustomEvent('updateGlobalSearch', { detail: value }));
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    window.dispatchEvent(new CustomEvent('updateGlobalSearch', { detail: '' }));
  };

  // Setup options
  const uniqueTargets = Array.from(new Set(announcements.map(ann => ann.target)));

  // Filter Logic: Includes history check matching showHistory toggle button
  const filteredAnnouncements = announcements.filter(ann => {
    // History filter check
    const isHist = !!ann.isHistory;
    if (showHistory !== isHist) return false;

    // Search query check
    const matchesSearch = 
      ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.target.toLowerCase().includes(searchQuery.toLowerCase());

    // Attribute filters
    const matchesPriority = filterPriority === 'all' || ann.priority === filterPriority;
    const matchesTarget = filterTarget === 'all' || ann.target === filterTarget;

    return matchesSearch && matchesPriority && matchesTarget;
  });

  // Open Form Modal (Add)
  const handleOpenAddModal = () => {
    setFormMode('add');
    setEditingId(null);
    setFormTitle('');
    setFormContent('');
    setFormTarget('All Students');
    setFormPriority('medium');
    setShowFormModal(true);
    setActiveMenuId(null);
  };

  // Open Form Modal (Edit)
  const handleOpenEditModal = (ann: Announcement) => {
    setFormMode('edit');
    setEditingId(ann.id);
    setFormTitle(ann.title);
    setFormContent(ann.content);
    setFormTarget(ann.target);
    setFormPriority(ann.priority);
    setShowFormModal(true);
    setActiveMenuId(null);
  };

  // Form Submit Action
  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) {
      alert('Please provide a Title and Announcement details.');
      return;
    }

    if (formMode === 'add') {
      const newAnn: Announcement = {
        id: Date.now().toString(),
        title: formTitle,
        content: formContent,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        target: formTarget,
        priority: formPriority,
        isHistory: false,
        stats: {
          reached: formTarget === 'All Students' ? 150 : 45,
          total: formTarget === 'All Students' ? 150 : 50,
          open: 0,
          ack: 0,
          readHistory: [
            { name: '1 Min', views: 0 },
            { name: '5 Min', views: 0 },
            { name: '15 Min', views: 0 },
            { name: '1 Hour', views: 0 },
          ],
          receipts: []
        }
      };

      setAnnouncements([newAnn, ...announcements]);
      triggerFeedbackBanner('Announcement published successfully and alert sent!');
    } else {
      setAnnouncements(prev => prev.map(item => 
        item.id === editingId 
          ? { 
              ...item, 
              title: formTitle, 
              content: formContent, 
              target: formTarget, 
              priority: formPriority 
            }
          : item
      ));
      triggerFeedbackBanner('Announcement details updated successfully.');
    }

    setShowFormModal(false);
  };

  const handleDeleteAnnouncement = (id: string) => {
    if (confirm('Are you sure you want to remove this announcement entry permanently?')) {
      setAnnouncements(prev => prev.filter(ann => ann.id !== id));
      triggerFeedbackBanner('Announcement removed successfully.');
      setActiveMenuId(null);
    }
  };

  const triggerFeedbackBanner = (msg: string) => {
    setSuccessBanner(msg);
    setTimeout(() => {
      setSuccessBanner(null);
    }, 4000);
  };

  const handleSendNotification = (ann: Announcement) => {
    triggerFeedbackBanner(`Resent real-time alert for "${ann.title}" to ${ann.target}!`);
    setActiveMenuId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Alert Banner feedback */}
      {successBanner && (
        <div id="announcement-feedback-banner" className="bg-indigo-600 text-white rounded-xl p-4 shadow-lg flex items-center justify-between border border-indigo-700 animate-slide-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-300" />
            <p className="text-sm font-semibold">{successBanner}</p>
          </div>
          <button onClick={() => setSuccessBanner(null)} className="text-white hover:text-indigo-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Page title headers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            Announcements
            <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
              {showHistory ? 'History Mode' : 'Live Mode'}
            </span>
          </h1>
          <p className="text-slate-500">Communicate important syllabus deadlines and notifications to classrooms.</p>
        </div>
        <Button 
          id="btn-new-announcement"
          onClick={handleOpenAddModal}
          icon={<Plus className="w-4 h-4" />}
          className="bg-indigo-600 text-white hover:bg-indigo-700 text-sm font-bold"
        >
          New Announcement
        </Button>
      </div>

      {/* Controls Bar: Search, Filters Panel Toggle and History Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50 border border-slate-100 p-4 rounded-xl">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            id="announcement-local-search"
            type="text" 
            placeholder="Search updates, topics, or targets..." 
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-10 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-medium"
          />
          {searchQuery && (
            <button 
              type="button" 
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Filter Panel Toggle Button */}
          <Button 
            id="btn-toggle-filters"
            variant={showFilters ? 'primary' : 'outline'} 
            size="sm" 
            icon={<Filter className="w-4 h-4" />}
            onClick={() => setShowFilters(!showFilters)}
            className="text-xs font-semibold h-9"
          >
            {showFilters ? 'Hide Filters' : 'Filter'}
          </Button>

          {/* Dynamic History Timeline Toggle Button */}
          <Button 
            id="btn-toggle-history"
            variant={showHistory ? 'secondary' : 'outline'} 
            size="sm"
            onClick={() => {
              setShowHistory(!showHistory);
              setActiveMenuId(null);
            }}
            icon={<Clock className="w-4 h-4" />}
            className="text-xs font-semibold h-9"
          >
            {showHistory ? 'Back to Active' : 'History & Archives'}
          </Button>
        </div>
      </div>

      {/* Collapsible Filters selection shelf */}
      {showFilters && (
        <Card id="announcements-filter-shelf" className="p-4 bg-indigo-50/10 border-indigo-100/60 rounded-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Priority filter */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Priority Level</label>
              <select
                id="filter-select-priority"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="all">All Priorities</option>
                <option value="high">🔴 High Status</option>
                <option value="medium">🟡 Medium Status</option>
                <option value="low">🟢 Low Status</option>
              </select>
            </div>

            {/* Target class filter */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Target Class / Group</label>
              <select
                id="filter-select-target"
                value={filterTarget}
                onChange={(e) => setFilterTarget(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="all">All Targets ({uniqueTargets.length})</option>
                {uniqueTargets.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-100">
            <span>
              Showing <strong>{filteredAnnouncements.length}</strong> matches (Group: {showHistory ? 'History' : 'Active'})
            </span>
            {(filterPriority !== 'all' || filterTarget !== 'all') && (
              <button
                id="btn-clear-filters-shelf"
                onClick={() => {
                  setFilterPriority('all');
                  setFilterTarget('all');
                }}
                className="text-indigo-600 hover:text-indigo-800 font-bold inline-flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset Preferences
              </button>
            )}
          </div>
        </Card>
      )}

      {/* Main announcements cards lists */}
      <div className="space-y-4">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((announcement) => (
            <Card 
              key={announcement.id} 
              id={`announcement-card-${announcement.id}`}
              className="p-0 border border-slate-200 hover:border-indigo-200 transition-all rounded-xl relative overflow-visible group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2.5 rounded-xl border shrink-0",
                      announcement.priority === 'high' ? "bg-red-50 text-red-600 border-red-100" :
                      announcement.priority === 'medium' ? "bg-amber-50 text-amber-600 border-amber-100" :
                      "bg-blue-50 text-blue-600 border-blue-100"
                    )}>
                      <Megaphone className="w-5 h-5 animate-bounce-short" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-indigo-950 transition-colors tracking-tight text-base sm:text-lg">
                        {announcement.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-1 text-[11px] font-bold uppercase text-slate-400">
                        <span className="flex items-center gap-1 font-mono bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-lg text-slate-500">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {announcement.date}
                        </span>
                        <span className="flex items-center gap-1 font-mono bg-indigo-50/50 border border-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-lg text-slate-500">
                          <Users className="w-3 h-3 text-indigo-400" />
                          {announcement.target}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Dropdown buttons */}
                  <div className="flex items-center gap-1.5 shrink-0 relative">
                    <Button 
                      id={`btn-ping-announcement-${announcement.id}`}
                      variant="ghost" 
                      onClick={() => handleSendNotification(announcement)}
                      className="p-2 h-8 w-8 hover:bg-slate-100 transition-colors border border-slate-100 rounded-lg"
                      title="Resend Notification Alert"
                    >
                      <Send className="w-4 h-4 text-indigo-600 hover:text-indigo-700" />
                    </Button>
                    
                    <div className="relative">
                      <Button 
                        id={`btn-options-ann-${announcement.id}`}
                        variant="ghost" 
                        onClick={() => setActiveMenuId(activeMenuId === announcement.id ? null : announcement.id)}
                        className="p-2 h-8 w-8 hover:bg-slate-100 border border-slate-100 rounded-lg"
                        title="Options"
                      >
                        <MoreVertical className="w-4 h-4 text-slate-400" />
                      </Button>

                      {activeMenuId === announcement.id && (
                        <div id={`dropdown-ann-${announcement.id}`} className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1.5 font-medium animate-fade-in text-slate-700">
                          <button
                            id={`option-edit-ann-${announcement.id}`}
                            onClick={() => handleOpenEditModal(announcement)}
                            className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs sm:text-sm flex items-center gap-2 border-b border-slate-100 text-slate-700 font-semibold"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-indigo-500 justify-start" /> Modify Text
                          </button>
                          
                          <button
                            id={`option-viewanalytics-ann-${announcement.id}`}
                            onClick={() => {
                              setViewAnalyticsAnn(announcement);
                              setActiveMenuId(null);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs sm:text-sm flex items-center gap-2 border-b border-slate-100 text-slate-700 font-semibold"
                          >
                            <BarChart2 className="w-3.5 h-3.5 text-emerald-500 justify-start" /> Open Analytics
                          </button>

                          <button
                            id={`option-delete-ann-${announcement.id}`}
                            onClick={() => handleDeleteAnnouncement(announcement.id)}
                            className="w-full text-left px-4 py-2 hover:bg-red-50 text-xs sm:text-sm flex items-center gap-2 text-red-600 font-semibold"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-500" /> Remove Post
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed font-normal whitespace-pre-wrap pl-1 hover:text-slate-800 transition-colors">
                  {announcement.content}
                </p>

                {/* BOTTOM COMPACT FOOTER ACTIONS for Edit and View Analytics button */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-6 pt-5 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Button 
                      id={`card-edit-btn-${announcement.id}`}
                      variant="outline" 
                      size="sm"
                      onClick={() => handleOpenEditModal(announcement)}
                      className="px-3 py-1.5 text-xs text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-800"
                    >
                      <Edit2 className="w-3.5 h-3.5 shrink-0" /> Edit Details
                    </Button>
                    <Button 
                      id={`card-analytics-btn-${announcement.id}`}
                      variant="ghost" 
                      size="sm"
                      onClick={() => setViewAnalyticsAnn(announcement)}
                      className="px-3 py-1.5 text-xs text-slate-600 border border-transparent hover:border-slate-200 hover:bg-slate-100 font-semibold inline-flex items-center gap-1"
                    >
                      <BarChart2 className="w-3.5 h-3.5 shrink-0 text-emerald-500" /> View Analytics
                    </Button>
                  </div>

                  <span className="text-[10px] sm:text-xs font-mono text-slate-400 block sm:text-right">
                    Ref ID: {announcement.id} • {announcement.priority.toUpperCase()} PRIORITY
                  </span>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-xl space-y-3">
            <Info className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-slate-500 font-semibold">No announcements found matching your filter criteria.</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setFilterPriority('all');
                setFilterTarget('all');
                setShowHistory(false);
              }}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold underline"
            >
              Reset filters and search query parameters
            </button>
          </div>
        )}
      </div>

      {/* MODAL 1: ADD / EDIT ANNOUNCEMENT POPUP FORM */}
      {showFormModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <Card 
            id="form-announcement-modal"
            className="w-full max-w-lg shadow-2xl relative bg-white border border-slate-200"
            title={formMode === 'add' ? 'Publish New Announcement' : 'Edit Announcement Content'}
            subtitle={formMode === 'add' ? 'Draft a digital notification to keep classes informed.' : 'Update dates, target audience or main text block.'}
            headerAction={
              <button 
                id="btn-close-form-modal"
                onClick={() => setShowFormModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            }
          >
            <form onSubmit={handleSaveAnnouncement} className="space-y-4">
              
              {/* Title Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Announcement Title *</label>
                <input
                  id="form-title-input"
                  type="text"
                  required
                  placeholder="e.g., Practical Examination Registration Open"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Target / Class */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Send to Class Group / Target *</label>
                <select
                  id="form-target-select"
                  value={formTarget}
                  onChange={(e) => setFormTarget(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="All Students">All Students (General Roster)</option>
                  <option value="Algorithms Class">Algorithms Class (Second Year)</option>
                  <option value="Computer Science Dept">Computer Science Dept</option>
                  <option value="Electrical Eng Dept">Electrical Eng Dept</option>
                  <option value="Discrete Math Class">Discrete Math Class</option>
                </select>
              </div>

              {/* Priority Select */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Priority Alert Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {['high', 'medium', 'low'].map((p) => (
                    <button
                      key={p}
                      id={`form-priority-btn-${p}`}
                      type="button"
                      onClick={() => setFormPriority(p as any)}
                      className={cn(
                        "py-2 px-3 text-xs font-bold rounded-lg capitalize border transition-all text-center",
                        formPriority === p 
                          ? p === 'high' ? "bg-red-600 text-white border-red-600 shadow" :
                            p === 'medium' ? "bg-amber-500 text-white border-amber-500 shadow" :
                            "bg-blue-600 text-white border-blue-600 shadow"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Content Body */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Notification message *</label>
                <textarea
                  id="form-content-input"
                  required
                  rows={4}
                  placeholder="Provide precise details to students regarding files, room numbers, specific exam guidelines, links and contact personnel..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Buttons controls */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <Button 
                  id="form-cancel-btn"
                  variant="outline" 
                  type="button"
                  onClick={() => setShowFormModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  id="form-submit-btn"
                  variant="primary" 
                  type="submit"
                  className="bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  {formMode === 'add' ? 'Publish Notification' : 'Apply Modifications'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* MODAL 2: INTERACTIVE ANALYTICS SLIDEOUT OVERLAY DIALOG */}
      {viewAnalyticsAnn && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <Card 
            id="analytics-overlay-modal"
            className="w-full max-w-2xl bg-white shadow-2xl border border-slate-200"
            title="Notification Engagements & Delivery"
            subtitle={`${viewAnalyticsAnn.title} (${viewAnalyticsAnn.target})`}
            headerAction={
              <button 
                id="btn-close-analytics"
                onClick={() => setViewAnalyticsAnn(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            }
          >
            <div className="space-y-6">
              
              {/* Core Indicators Metrics Blocks */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                <div className="bg-slate-50 p-4 border border-slate-100 rounded-xl text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sent Receivers</p>
                  <p className="text-xl sm:text-2xl font-bold font-mono text-slate-800">
                    {viewAnalyticsAnn.stats.reached}/{viewAnalyticsAnn.stats.total}
                  </p>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">100% Dispatched</p>
                </div>

                <div className="bg-indigo-50/40 p-4 border border-indigo-100 rounded-xl text-center">
                  <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mb-1">Open count</p>
                  <p className="text-xl sm:text-2xl font-bold font-mono text-indigo-950">
                    {viewAnalyticsAnn.stats.open}
                  </p>
                  <p className="text-[11px] text-indigo-600 font-semibold mt-0.5">
                    {Math.round((viewAnalyticsAnn.stats.open / viewAnalyticsAnn.stats.reached) * 100)}% Open Rate
                  </p>
                </div>

                <div className="bg-emerald-50/40 p-4 border border-emerald-100 rounded-xl text-center">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Acknowledgment</p>
                  <p className="text-xl sm:text-2xl font-bold font-mono text-emerald-900">
                    {viewAnalyticsAnn.stats.ack}
                  </p>
                  <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                    {Math.round((viewAnalyticsAnn.stats.ack / viewAnalyticsAnn.stats.open) * 100)}% Click Response
                  </p>
                </div>

                <div className="bg-blue-50/30 p-4 border border-blue-100 rounded-xl text-center">
                  <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-1">Average Response</p>
                  <p className="text-xl sm:text-2xl font-bold font-mono text-blue-900">12m</p>
                  <p className="text-[11px] text-blue-600 font-semibold mt-0.5">Healthy Speed</p>
                </div>

              </div>

              {/* Graphic engagement timeline plotting */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1">
                  <BarChart2 className="w-4 h-4 text-emerald-500" /> Read views progression over time
                </h4>
                
                <div className="border border-slate-100 bg-slate-50/30 p-3 rounded-xl h-56">
                  {viewAnalyticsAnn.stats.readHistory && viewAnalyticsAnn.stats.readHistory.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={viewAnalyticsAnn.stats.readHistory} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, borderColor: '#e2e8f0' }} />
                        <Area type="monotone" dataKey="views" name="Views Count" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-slate-400 font-medium">
                      Progression graphing accrues upon reading logs.
                    </div>
                  )}
                </div>
              </div>

              {/* Receipts roster breakdown database of students */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1 justify-between">
                  <span className="flex items-center gap-1">
                    <UserCheck className="w-4 h-4 text-indigo-500" /> Immediate Read Receipts Log
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono italic">Sample verification list</span>
                </h4>

                <div className="max-h-[160px] overflow-y-auto border border-slate-100 rounded-xl divide-y divide-slate-100 select-none pb-1">
                  {viewAnalyticsAnn.stats.receipts && viewAnalyticsAnn.stats.receipts.length > 0 ? (
                    viewAnalyticsAnn.stats.receipts.map((rcpt, index) => (
                      <div key={index} className="flex items-center justify-between p-3 hover:bg-slate-50/50 transition-colors">
                        <div>
                          <p className="text-sm font-bold text-slate-800">{rcpt.name}</p>
                          <p className="text-xs font-mono text-slate-400 font-semibold">{rcpt.roll}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold font-mono shrink-0",
                            rcpt.status === 'Acknowledged' 
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                              : "bg-amber-50 text-amber-600 border border-amber-100 animate-pulse"
                          )}>
                            {rcpt.status}
                          </span>
                          <span className="text-xs font-mono text-slate-500 min-w-[65px] text-right font-medium">
                            {rcpt.time}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-xs text-slate-400 font-medium font-mono">
                      No read receipts logged for this item yet. Only dynamic telemetry is active.
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end pt-2">
                <Button 
                  id="btn-close-analytics-footer"
                  variant="outline" 
                  onClick={() => setViewAnalyticsAnn(null)}
                  className="text-xs h-9"
                >
                  Dismiss Overlay
                </Button>
              </div>

            </div>
          </Card>
        </div>
      )}

    </div>
  );
}
