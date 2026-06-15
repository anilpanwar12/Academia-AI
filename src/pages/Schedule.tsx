import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  List, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  MapPin,
  MoreVertical,
  Filter,
  Check,
  X,
  Trash2,
  Edit2,
  RefreshCw,
  Search,
  CheckCircle,
  Users
} from 'lucide-react';
import { Card, Button } from '../components/UI';
import { cn } from '../lib/utils';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface Lecture {
  id: string;
  course: string;
  topic: string;
  date: Date;
  time: string;
  duration: string;
  room: string;
  status: 'ongoing' | 'upcoming' | 'past';
}

const INITIAL_LECTURES: Lecture[] = [
  { id: '1', course: 'Data Structures', topic: 'Binary Search Trees', date: new Date(), time: '10:00 AM', duration: '90 min', room: '204', status: 'ongoing' },
  { id: '2', course: 'Algorithms', topic: 'Dynamic Programming', date: new Date(), time: '01:30 PM', duration: '60 min', room: '102', status: 'upcoming' },
  { id: '3', course: 'Discrete Math', topic: 'Graph Theory', date: addDays(new Date(), 1), time: '09:00 AM', duration: '120 min', room: '305', status: 'upcoming' },
  { id: '4', course: 'Database Systems', topic: 'SQL Optimization', date: addDays(new Date(), -1), time: '11:00 AM', duration: '90 min', room: 'Lab 2', status: 'past' },
];

const INITIAL_STUDENTS = [
  { student_id: 'S101', student_name: 'Amit Sharma', roll_no: 'CS2026-01', present: true },
  { student_id: 'S102', student_name: 'Neha Roy', roll_no: 'CS2026-02', present: true },
  { student_id: 'S103', student_name: 'Chandan Kumar', roll_no: 'CS2026-03', present: false },
  { student_id: 'S104', student_name: 'Priyanka Patel', roll_no: 'CS2026-04', present: true },
  { student_id: 'S105', student_name: 'Karan Singh', roll_no: 'CS2026-05', present: true },
];

export function Schedule() {
  const navigate = useNavigate();
  const [lectureList, setLectureList] = useState<Lecture[]>(INITIAL_LECTURES);
  const [view, setView] = useState<'calendar' | 'list'>('list');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Modal / Form State
  const [showFormModal, setShowFormModal] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [editingLectureId, setEditingLectureId] = useState<string | null>(null);

  // Form Fields
  const [course, setCourse] = useState('');
  const [topic, setTopic] = useState('');
  const [lectureDate, setLectureDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [time, setTime] = useState('10:00 AM');
  const [duration, setDuration] = useState('90 min');
  const [room, setRoom] = useState('204');
  const [status, setStatus] = useState<'ongoing' | 'upcoming' | 'past'>('upcoming');

  // Filters State
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');

  // Options Popover Toggle
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Quick Attendance State
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [attendanceLecture, setAttendanceLecture] = useState<Lecture | null>(null);
  const [attendanceStudents, setAttendanceStudents] = useState(INITIAL_STUDENTS);
  const [showAttendanceSuccess, setShowAttendanceSuccess] = useState(false);

  const weekStart = startOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Compute unique courses for filter dropdown
  const uniqueCourses = Array.from(new Set(lectureList.map(l => l.course)));

  // Filter list of lectures
  const filteredLectures = lectureList.filter(lecture => {
    const matchesSearch = 
      lecture.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lecture.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lecture.room.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lecture.status === statusFilter;
    const matchesCourse = courseFilter === 'all' || lecture.course === courseFilter;
    
    return matchesSearch && matchesStatus && matchesCourse;
  });

  const handleOpenAddModal = () => {
    setFormMode('add');
    setEditingLectureId(null);
    setCourse('');
    setTopic('');
    setLectureDate(format(new Date(), 'yyyy-MM-dd'));
    setTime('10:00 AM');
    setDuration('90 min');
    setRoom('204');
    setStatus('upcoming');
    setShowFormModal(true);
  };

  const handleOpenEditModal = (lecture: Lecture) => {
    setFormMode('edit');
    setEditingLectureId(lecture.id);
    setCourse(lecture.course);
    setTopic(lecture.topic);
    setLectureDate(format(lecture.date, 'yyyy-MM-dd'));
    setTime(lecture.time);
    setDuration(lecture.duration);
    setRoom(lecture.room);
    setStatus(lecture.status);
    setShowFormModal(true);
    setActiveMenuId(null);
  };

  const handleSaveLecture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!course.trim() || !topic.trim()) {
      alert("Please fill out the Course and Topic fields.");
      return;
    }

    const parsedDate = new Date(lectureDate);

    if (formMode === 'add') {
      const newLecture: Lecture = {
        id: (Date.now()).toString(),
        course,
        topic,
        date: parsedDate,
        time,
        duration,
        room,
        status
      };
      setLectureList([newLecture, ...lectureList]);
    } else {
      setLectureList(prev => prev.map(item => 
        item.id === editingLectureId 
          ? { ...item, course, topic, date: parsedDate, time, duration, room, status }
          : item
      ));
    }

    setShowFormModal(false);
  };

  const handleDeleteLecture = (id: string) => {
    if (confirm("Are you sure you want to remove this lecture?")) {
      setLectureList(prev => prev.filter(lecture => lecture.id !== id));
      setActiveMenuId(null);
    }
  };

  const handleCycleStatus = (lecture: Lecture) => {
    const statuses: ('upcoming' | 'ongoing' | 'past')[] = ['upcoming', 'ongoing', 'past'];
    const currentIdx = statuses.indexOf(lecture.status);
    const nextStatus = statuses[(currentIdx + 1) % statuses.length];

    setLectureList(prev => prev.map(item => 
      item.id === lecture.id ? { ...item, status: nextStatus } : item
    ));
    setActiveMenuId(null);
  };

  const handleOpenAttendance = (lecture: Lecture) => {
    setAttendanceLecture(lecture);
    // Preset students default
    setAttendanceStudents(INITIAL_STUDENTS.map(s => ({ ...s, present: true })));
    setShowAttendanceSuccess(false);
    setShowAttendanceModal(true);
  };

  const handleToggleStudentPresence = (studentId: string) => {
    setAttendanceStudents(prev => prev.map(student => 
      student.student_id === studentId ? { ...student, present: !student.present } : student
    ));
  };

  const handleMarkAllStudents = (presence: boolean) => {
    setAttendanceStudents(prev => prev.map(student => ({ ...student, present: presence })));
  };

  const handleSaveAttendance = () => {
    setShowAttendanceSuccess(true);
    // Auto timeout success message banner after 4 seconds
    setTimeout(() => {
      setShowAttendanceSuccess(false);
      setShowAttendanceModal(false);
    }, 3500);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Lecture Schedule</h1>
          <p className="text-slate-500">Manage your teaching calendar and upcoming classes.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm self-end sm:self-auto relative z-10">
          <button 
            id="schedule-toggle-calendar"
            onClick={() => setView('calendar')}
            className={cn(
              "p-2.5 sm:p-1.5 rounded-md transition-all",
              view === 'calendar' ? "bg-indigo-50 text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
            title="Calendar View"
          >
            <CalendarIcon className="w-6 h-6 sm:w-5 sm:h-5" />
          </button>
          <button 
            id="schedule-toggle-list"
            onClick={() => setView('list')}
            className={cn(
              "p-2.5 sm:p-1.5 rounded-md transition-all",
              view === 'list' ? "bg-indigo-50 text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
            title="List View"
          >
            <List className="w-6 h-6 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Week Navigator and Primary Controls Header */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/50 p-3 sm:p-0 rounded-xl md:bg-transparent md:p-0">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full md:w-auto">
          <div className="flex justify-between sm:justify-start items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-1.5">
              <Button 
                id="schedule-prev-week"
                variant="outline" 
                size="sm" 
                className="p-2 sm:p-1.5 md:p-1 h-11 w-11 sm:h-9 sm:w-9 md:h-8 md:w-8"
                onClick={() => setCurrentDate(addDays(currentDate, -7))}
                title="Previous Week"
              >
                <ChevronLeft className="w-5 h-5 sm:w-4 sm:h-4" />
              </Button>
              <Button 
                id="schedule-next-week"
                variant="outline" 
                size="sm" 
                className="p-2 sm:p-1.5 md:p-1 h-11 w-11 sm:h-9 sm:w-9 md:h-8 md:w-8"
                onClick={() => setCurrentDate(addDays(currentDate, 7))}
                title="Next Week"
              >
                <ChevronRight className="w-5 h-5 sm:w-4 sm:h-4" />
              </Button>
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-slate-900 min-w-[110px] text-center sm:text-left tracking-tight">
              {format(weekStart, 'MMMM yyyy')}
            </h2>
            <Button 
              id="schedule-today-btn"
              variant="outline" 
              size="sm" 
              className="h-11 sm:h-9 md:h-8 text-sm sm:text-xs px-4 sm:px-3"
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button 
            id="schedule-filter-btn" 
            variant={showFilters ? "primary" : "outline"}
            size="sm" 
            icon={<Filter className="w-5 h-5 sm:w-4 sm:h-4" />} 
            className="flex-1 md:flex-none h-11 sm:h-9 md:h-8 text-sm sm:text-xs"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Hide Filters" : "Filter"}
          </Button>
          <Button 
            id="schedule-add-btn" 
            size="sm" 
            icon={<Plus className="w-5 h-5 sm:w-4 sm:h-4" />} 
            className="flex-1 md:flex-none h-11 sm:h-9 md:h-8 text-sm sm:text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={handleOpenAddModal}
          >
            Add Lecture
          </Button>
        </div>
      </div>

      {/* Interactive Filters Panel */}
      {showFilters && (
        <Card id="schedule-filters-card" className="border-indigo-100 bg-indigo-50/20 p-4 transition-all duration-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* Search filter */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                id="search-filter-input"
                type="text" 
                placeholder="Search by subject, chapter, topic, room..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white"
              />
            </div>

            {/* Course Filter */}
            <div>
              <select 
                id="course-filter-select"
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
              >
                <option value="all">All Subjects ({uniqueCourses.length})</option>
                {uniqueCourses.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select 
                id="status-filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="ongoing">Ongoing</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-indigo-100/40 text-xs text-slate-500">
            <span>
              Showing {filteredLectures.length} of {lectureList.length} lectures
            </span>
            {(searchQuery || statusFilter !== 'all' || courseFilter !== 'all') && (
              <button 
                id="clear-filters-btn"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setCourseFilter('all');
                }}
                className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Clear Active Filters
              </button>
            )}
          </div>
        </Card>
      )}

      {/* Main Views Layout */}
      {view === 'list' ? (
        <div className="space-y-4">
          {filteredLectures.length > 0 ? (
            filteredLectures.map((lecture) => (
              <Card key={lecture.id} id={`lecture-card-${lecture.id}`} className="p-0 hover:border-indigo-200 transition-colors group relative">
                <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                  {/* Left Column: Date Stamp */}
                  <div className="flex sm:flex-col items-center justify-between sm:justify-center min-w-[80px] py-2.5 px-4 sm:px-2 bg-slate-50 rounded-xl border border-slate-100 w-full sm:w-auto">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                      {format(lecture.date, 'EEE')}
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-slate-950">
                      {format(lecture.date, 'dd')}
                    </span>
                  </div>
                  
                  {/* Center Column: Text & Content Details */}
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex items-center justify-between sm:justify-start gap-2 mb-1">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate">{lecture.course}</h3>
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shrink-0 transition-colors",
                        lecture.status === 'ongoing' ? "bg-indigo-50 text-indigo-600" :
                        lecture.status === 'past' ? "bg-slate-100 text-slate-500" :
                        "bg-blue-50 text-blue-600"
                      )}>
                        {lecture.status}
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-slate-500 font-medium">{lecture.topic}</p>
                    
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3 sm:mt-4">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
                        <Clock className="w-5 h-5 sm:w-4 sm:h-4 text-slate-400 shrink-0" />
                        <span>{lecture.time} ({lecture.duration})</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
                        <MapPin className="w-5 h-5 sm:w-4 sm:h-4 text-slate-400 shrink-0" />
                        <span>Room {lecture.room}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Column: Interaction Action Buttons */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 sm:border-l border-slate-100 sm:pl-8 relative">
                    <Button 
                      id={`lecture-attendance-${lecture.id}`} 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleOpenAttendance(lecture)}
                      className="flex-1 sm:flex-none h-11 sm:h-9 md:h-8 text-sm sm:text-xs px-4 sm:px-3 text-indigo-600 hover:text-indigo-800 border-indigo-200 hover:bg-indigo-50"
                    >
                      Attendance
                    </Button>
                    
                    <div className="relative">
                      <Button 
                        id={`lecture-options-${lecture.id}`} 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setActiveMenuId(activeMenuId === lecture.id ? null : lecture.id)}
                        className="p-2 h-11 w-11 sm:h-9 sm:w-9 md:h-8 md:w-8 shrink-0 border border-slate-100 hover:bg-slate-100 transition-colors"
                        title="Options"
                      >
                        <MoreVertical className="w-5 h-5 sm:w-4 sm:h-4 text-slate-500 hover:text-slate-800" />
                      </Button>

                      {/* Dynamic Options Overlay Popup Menu */}
                      {activeMenuId === lecture.id && (
                        <div className="absolute right-0 bottom-full sm:bottom-auto sm:top-full mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-xl z-50 py-1 font-medium">
                          <button
                            id={`option-edit-${lecture.id}`}
                            type="button"
                            onClick={() => handleOpenEditModal(lecture)}
                            className="w-full text-left px-4 py-2 text-xs sm:text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 border-b border-slate-100"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-indigo-500" /> Edit Details
                          </button>
                          <button
                            id={`option-cycle-${lecture.id}`}
                            type="button"
                            onClick={() => handleCycleStatus(lecture)}
                            className="w-full text-left px-4 py-2 text-xs sm:text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 border-b border-slate-100"
                          >
                            <RefreshCw className="w-3.5 h-3.5 text-blue-500" /> Cycle Status ({lecture.status})
                          </button>
                          <button
                            id={`option-delete-${lecture.id}`}
                            type="button"
                            onClick={() => handleDeleteLecture(lecture.id)}
                            className="w-full text-left px-4 py-2 text-xs sm:text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-500" /> Remove Lecture
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="p-8 text-center bg-white border border-slate-200 rounded-xl">
              <p className="text-slate-500 font-medium">No schedule lectures match your current filters.</p>
              <button 
                id="reset-match-filters-btn"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setCourseFilter('all');
                }}
                className="mt-3 text-indigo-600 hover:text-indigo-800 text-sm font-semibold inline-flex items-center gap-1"
              >
                Clear all filters and search keyword
              </button>
            </div>
          )}
        </div>
      ) : (
        <Card id="schedule-calendar-card" className="p-0 overflow-hidden">
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
            {weekDays.map((day) => (
              <div key={day.toString()} className="p-2 sm:p-3 md:p-4 text-center border-r border-slate-200 last:border-r-0">
                <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider sm:tracking-widest mb-1">
                  {format(day, 'EEE')}
                </p>
                <p className={cn(
                  "text-sm sm:text-base md:text-lg font-bold w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center mx-auto rounded-full transition-all",
                  isSameDay(day, new Date()) ? "bg-indigo-600 text-white shadow-sm" : "text-slate-900"
                )}>
                  {format(day, 'd')}
                </p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 min-h-[400px] md:h-[600px]">
            {weekDays.map((day) => (
              <div key={day.toString()} className="border-r border-slate-100 last:border-r-0 p-1 sm:p-2 space-y-1.5 sm:space-y-2 bg-white/50 min-h-[400px] md:h-auto">
                {filteredLectures
                  .filter(l => isSameDay(l.date, day))
                  .map(lecture => (
                    <div 
                      key={lecture.id} 
                      onClick={() => handleOpenAttendance(lecture)}
                      className="p-1.5 sm:p-2 bg-indigo-50/80 border border-indigo-100/60 rounded-lg shadow-sm cursor-pointer hover:bg-indigo-50 transition-colors group relative"
                    >
                      <p className="text-[8px] sm:text-[10px] font-bold text-indigo-500 uppercase">{lecture.time}</p>
                      <p className="text-[10px] sm:text-xs font-bold text-indigo-900 truncate mt-0.5">{lecture.course}</p>
                      <p className="text-[8px] sm:text-[10px] text-indigo-600 truncate">{lecture.room}</p>
                      
                      {/* Interactive Edit shortcut on double tap or hover icon */}
                      <span className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit2 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditModal(lecture);
                          }}
                          className="w-2.5 h-2.5 text-indigo-600"
                        />
                      </span>
                    </div>
                  ))
                }
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* MODAL 1: ADD / EDIT LECTURE MODAL INLINE POPUP */}
      {showFormModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card 
            id="lecture-form-modal"
            className="w-full max-w-lg shadow-2xl relative"
            title={formMode === 'add' ? 'Add Lecture Entry' : 'Edit Lecture Details'}
            subtitle={formMode === 'add' ? 'Set up a new lecture block for classes.' : 'Modify date, room or metadata.'}
            headerAction={
              <button 
                id="close-form-modal-btn"
                onClick={() => setShowFormModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            }
          >
            <form onSubmit={handleSaveLecture} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Course Name */}
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Subject / Course *</label>
                  <input
                    id="form-input-course"
                    type="text"
                    required
                    placeholder="e.g. Data Structures"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Chapter Topic */}
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Chapter / Topic *</label>
                  <input
                    id="form-input-topic"
                    type="text"
                    required
                    placeholder="e.g. Graph Search Traversal (BFS & DFS)"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Date</label>
                  <input
                    id="form-input-date"
                    type="date"
                    required
                    value={lectureDate}
                    onChange={(e) => setLectureDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Time Slot</label>
                  <input
                    id="form-input-time"
                    type="text"
                    placeholder="e.g. 10:00 AM"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Duration</label>
                  <select
                    id="form-input-duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="45 min">45 min</option>
                    <option value="60 min">60 min</option>
                    <option value="90 min">90 min</option>
                    <option value="120 min">120 min</option>
                    <option value="180 min">180 min</option>
                  </select>
                </div>

                {/* Room */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Room No / Lab</label>
                  <input
                    id="form-input-room"
                    type="text"
                    placeholder="e.g. 204"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Status Selection */}
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 font-semibold">Active Status</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['upcoming', 'ongoing', 'past'].map(st => (
                      <button
                        key={st}
                        id={`form-status-toggle-${st}`}
                        type="button"
                        onClick={() => setStatus(st as any)}
                        className={cn(
                          "py-2 px-3 border rounded-lg text-xs font-semibold capitalize transition-all",
                          status === st 
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                            : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                        )}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons inside Form Modal */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <Button 
                  id="form-btn-cancel"
                  variant="outline"
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="h-10 text-sm px-4"
                >
                  Cancel
                </Button>
                <Button 
                  id="form-btn-submit"
                  variant="primary"
                  type="submit"
                  className="h-10 text-sm px-4 bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {formMode === 'add' ? 'Create Lecture Slot' : 'Save Modifications'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* MODAL 2: INTERACTIVE QUICK ATTENDANCE DIALOG */}
      {showAttendanceModal && attendanceLecture && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card 
            id="attendance-quick-modal"
            className="w-full max-w-lg shadow-2xl relative"
            title="Mark Quick Attendance"
            subtitle={`${attendanceLecture.course} • ${attendanceLecture.topic}`}
            headerAction={
              <button 
                id="close-attendance-modal-btn"
                onClick={() => setShowAttendanceModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            }
          >
            <div className="space-y-4">
              {/* Alert Feedback upon Logging attendance success */}
              {showAttendanceSuccess ? (
                <div id="attendance-success-alert" className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 animate-fade-in">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-emerald-900 text-sm">Attendance Saved successfully!</h4>
                    <p className="text-emerald-700 text-xs mt-1">
                      Data for {attendanceStudents.filter(s => s.present).length} present students synchronized to the Attendance Roster.
                    </p>
                    <button 
                      id="view-attendance-ledger-btn"
                      onClick={() => {
                        setShowAttendanceModal(false);
                        navigate('/attendance');
                      }} 
                      className="text-xs text-emerald-800 font-bold underline mt-2 block"
                    >
                      View Full Attendance Ledger →
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Quick Preset Controls</span>
                    <div className="flex gap-2">
                      <button 
                        id="mark-all-present-btn"
                        onClick={() => handleMarkAllStudents(true)}
                        className="text-xs bg-white text-indigo-600 border border-indigo-200 px-2 py-1 rounded hover:bg-indigo-50 font-semibold"
                      >
                        All Present
                      </button>
                      <button 
                        id="mark-all-absent-btn"
                        onClick={() => handleMarkAllStudents(false)}
                        className="text-xs bg-white text-red-600 border border-red-200 px-2 py-1 rounded hover:bg-red-50 font-semibold"
                      >
                        All Absent
                      </button>
                    </div>
                  </div>

                  {/* Student Attendance List */}
                  <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                    {attendanceStudents.map((st) => (
                      <div 
                        key={st.student_id}
                        className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50/50 transition-colors"
                      >
                        <div>
                          <p className="text-sm font-bold text-slate-800">{st.student_name}</p>
                          <p className="text-xs font-mono text-slate-400">{st.roll_no}</p>
                        </div>

                        <button
                          id={`toggle-presence-${st.student_id}`}
                          onClick={() => handleToggleStudentPresence(st.student_id)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border shrink-0",
                            st.present 
                              ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100" 
                              : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                          )}
                        >
                          {st.present ? 'Present' : 'Absent'}
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <Button 
                      id="go-to-ledger-btn"
                      variant="ghost" 
                      onClick={() => {
                        setShowAttendanceModal(false);
                        navigate('/attendance');
                      }}
                      className="text-indigo-600 hover:text-indigo-800 text-xs sm:text-sm font-bold flex items-center gap-1.5"
                    >
                      <Users className="w-4 h-4" /> Full Dashboard
                    </Button>
                    
                    <div className="flex gap-2">
                      <Button 
                        id="attendance-cancel-btn"
                        variant="outline" 
                        onClick={() => setShowAttendanceModal(false)}
                        className="h-10 text-xs sm:text-sm px-4"
                      >
                        Cancel
                      </Button>
                      <Button 
                        id="attendance-submit-btn"
                        onClick={handleSaveAttendance}
                        className="h-10 text-xs sm:text-sm px-4 bg-indigo-600 hover:bg-indigo-700 text-white"
                      >
                        Submit Ledger
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
