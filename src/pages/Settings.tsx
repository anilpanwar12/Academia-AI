import React, { useState, useEffect } from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  Palette, 
  Globe, 
  Shield,
  Camera,
  Check,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  RefreshCw,
  LogOut
} from 'lucide-react';
import { Card, Button } from '../components/UI';
import { cn } from '../lib/utils';

type SettingsTab = 'profile' | 'password' | 'notifications' | 'appearance' | 'language' | 'privacy';

export function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  
  // Profile Information
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : {
      name: 'Anil Panmwar',
      email: 'an.anil@university.edu',
      dept: 'Computer Science',
      office: 'Building B, Room 402',
      bio: 'Senior lecturer with 10+ years of experience in Algorithms and Data Structures.'
    };
  });
  const [profileSaved, setProfileSaved] = useState(false);

  // Password & Security
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [securitySaved, setSecuritySaved] = useState(false);
  const [securityError, setSecurityError] = useState<string | null>(null);

  // Notifications
  const [notifSyllabus, setNotifSyllabus] = useState(true);
  const [notifAnnounce, setNotifAnnounce] = useState(true);
  const [notifAttnd, setNotifAttnd] = useState(false);
  const [notifEmailDigest, setNotifEmailDigest] = useState('daily');
  const [notifBrowserPush, setNotifBrowserPush] = useState(true);
  const [notifSaved, setNotifSaved] = useState(false);

  // Appearance
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'slate'>('light');
  const [accentColor, setAccentColor] = useState<'indigo' | 'emerald' | 'violet' | 'blue' | 'rose'>('indigo');
  const [density, setDensity] = useState<'standard' | 'compact'>('standard');
  const [appearanceSaved, setAppearanceSaved] = useState(false);

  // Language & Region
  const [language, setLanguage] = useState('English (US)');
  const [timezone, setTimezone] = useState('IST (UTC+05:30)');
  const [firstDayOfWeek, setFirstDayOfWeek] = useState('Monday');
  const [langSaved, setLangSaved] = useState(false);

  // Privacy
  const [hideProfile, setHideProfile] = useState(false);
  const [restrictRosterView, setRestrictRosterView] = useState('faculty');
  const [activeIndicator, setActiveIndicator] = useState(true);
  const [privacySaved, setPrivacySaved] = useState(false);

  // Profile Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('userProfile', JSON.stringify(profile));
    setProfileSaved(true);
    // Dispatch custom event for Navbar/Sidebar to update dynamically
    window.dispatchEvent(new Event('profileUpdate'));
    setTimeout(() => setProfileSaved(false), 2500);
  };

  // Profile reset fallback
  const handleResetProfile = () => {
    setProfile({
      name: 'Anil Panwar',
      email: 'an.anil@university.edu',
      dept: 'Computer Science',
      office: 'Building B, Room 402',
      bio: 'Senior lecturer with 10+ years of experience in Algorithms and Data Structures.'
    });
  };

  // Password Update
  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityError(null);

    if (!currentPassword) {
      setSecurityError('Please enter your current password to authorize changes.');
      return;
    }
    if (newPassword.length < 6) {
      setSecurityError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setSecurityError('Confirmation password does not match new password.');
      return;
    }

    // Success Simulation
    setSecuritySaved(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSecuritySaved(false), 2500);
  };

  // Notifications Save
  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    setNotifSaved(true);
    setTimeout(() => setNotifSaved(false), 2500);
  };

  // Appearance Save
  const handleSaveAppearance = (e: React.FormEvent) => {
    e.preventDefault();
    setAppearanceSaved(true);
    setTimeout(() => setAppearanceSaved(false), 2500);
  };

  // Language Save
  const handleSaveLanguage = (e: React.FormEvent) => {
    e.preventDefault();
    setLangSaved(true);
    setTimeout(() => setLangSaved(false), 2500);
  };

  // Privacy Save
  const handleSavePrivacy = (e: React.FormEvent) => {
    e.preventDefault();
    setPrivacySaved(true);
    setTimeout(() => setPrivacySaved(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Account Settings</h1>
        <p className="text-slate-500">Configure your password, notifications, visual theme preferences, and directory privacy.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="md:col-span-1">
          <nav className="space-y-1 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
            {[
              { id: 'profile' as const, icon: User, label: 'Profile Information' },
              { id: 'password' as const, icon: Lock, label: 'Password & Security' },
              { id: 'notifications' as const, icon: Bell, label: 'Notifications' },
              { id: 'appearance' as const, icon: Palette, label: 'Appearance Theme' },
              { id: 'language' as const, icon: Globe, label: 'Language & Region' },
              { id: 'privacy' as const, icon: Shield, label: 'Privacy & Directory' },
            ].map((tab) => (
              <button
                key={tab.id}
                id={`settings-nav-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all",
                  activeTab === tab.id 
                    ? "bg-indigo-600 text-white shadow-sm" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <tab.icon className={cn("w-4 h-4 shrink-0", activeTab === tab.id ? "text-white" : "text-slate-400")} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Form panel container */}
        <div className="md:col-span-3">
          
          {/* TAB 1: PROFILE INFORMATION */}
          {activeTab === 'profile' && (
            <Card 
              id="settings-profile-card"
              title="Profile Information"
              subtitle="Update your core directory profile credentials."
            >
              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="flex items-center gap-6 pb-2">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-xl font-bold text-indigo-700 shadow-sm">
                      {profile.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <button 
                      type="button" 
                      id="btn-upload-profile-avatar"
                      onClick={() => alert("Image upload feature ready with local client assets.")}
                      className="absolute -bottom-1 -right-1 p-1 bg-white border border-slate-200 rounded-full shadow-md hover:bg-slate-50 transition-colors"
                      title="Upload Avatar"
                    >
                      <Camera className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{profile.name}</h4>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium font-mono">Department of {profile.dept}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                    <input 
                      id="profile-input-name"
                      type="text" 
                      required
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
                    <input 
                      id="profile-input-email"
                      type="email" 
                      required
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Academic Department</label>
                    <input 
                      id="profile-input-dept"
                      type="text" 
                      required
                      value={profile.dept}
                      onChange={(e) => setProfile({...profile, dept: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Office Number</label>
                    <input 
                      id="profile-input-office"
                      type="text" 
                      required
                      value={profile.office}
                      onChange={(e) => setProfile({...profile, office: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Professional Bio Summary</label>
                  <textarea 
                    id="profile-input-bio"
                    rows={3}
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white resize-none"
                  />
                </div>

                {profileSaved && (
                  <div id="profile-success-alert" className="p-3 bg-emerald-50 border border-emerald-250 text-emerald-800 rounded-xl flex items-center gap-2 text-xs font-semibold animate-fade-in">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Your teacher profile updates have been successfully synchronized!</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                  <button 
                    type="button" 
                    id="profile-btn-reset"
                    onClick={handleResetProfile}
                    className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    Reset Defaults
                  </button>
                  <div className="flex gap-2">
                    <Button 
                      id="profile-btn-save" 
                      type="submit"
                      icon={profileSaved ? <Check className="w-4 h-4 text-emerald-300" /> : null}
                      className="bg-indigo-600 text-white hover:bg-indigo-700 h-9 shrink-0 text-xs sm:text-sm"
                    >
                      {profileSaved ? 'Profile Saved' : 'Save Profile Changes'}
                    </Button>
                  </div>
                </div>
              </form>
            </Card>
          )}

          {/* TAB 2: PASSWORD & SECURITY */}
          {activeTab === 'password' && (
            <Card 
              id="settings-password-card" 
              title="Password & Security" 
              subtitle="Keep your teacher credentials safe by changing passwords frequently."
            >
              <form onSubmit={handleSaveSecurity} className="space-y-5">
                
                {securitySaved && (
                  <div id="security-success-alert" className="p-3 bg-emerald-50 border border-emerald-250 text-emerald-800 rounded-xl flex items-center gap-2 text-xs font-semibold animate-fade-in">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Auth credentials changed successfully. Next session will enforce the updated key.</span>
                  </div>
                )}

                {securityError && (
                  <div id="security-error-alert" className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-2 text-xs font-semibold animate-fade-in">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{securityError}</span>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Current Password */}
                  <div className="relative">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Current Password *</label>
                    <div className="relative">
                      <input 
                        id="security-input-currentpass"
                        type={showCurrentPass ? 'text' : 'password'}
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white"
                      />
                      <button 
                        type="button"
                        id="btn-toggle-show-currpass"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* New Password */}
                    <div className="relative">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">New Password *</label>
                      <div className="relative">
                        <input 
                          id="security-input-newpass"
                          type={showNewPass ? 'text' : 'password'}
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="At least 6 characters"
                          className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white"
                        />
                        <button 
                          type="button"
                          id="btn-toggle-show-newpass"
                          onClick={() => setShowNewPass(!showNewPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Confirm New Password *</label>
                      <input 
                        id="security-input-confirmpass"
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Multi-Factor Authentications</h4>
                  
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-150 rounded-xl">
                    <div className="space-y-0.5 pr-4">
                      <p className="text-xs sm:text-sm font-bold text-slate-800">Enforce Two-Factor Authentication (2FA)</p>
                      <p className="text-[10px] sm:text-xs text-slate-400 font-medium">Verify your login attempt using temporary OTP codes sent to your registered email address.</p>
                    </div>

                    <button
                      type="button"
                      id="security-toggle-2fa"
                      onClick={() => setTwoFactor(!twoFactor)}
                      className={cn(
                        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ring-offset-2 focus:ring-2 focus:ring-indigo-500",
                        twoFactor ? 'bg-indigo-600' : 'bg-slate-200'
                      )}
                    >
                      <span className={cn(
                        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                        twoFactor ? 'translate-x-5' : 'translate-x-0'
                      )} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <Button 
                    id="security-btn-save"
                    type="submit"
                    className="bg-indigo-600 text-white hover:bg-indigo-700 h-9 shrink-0 text-xs sm:text-sm font-bold"
                  >
                    Update Password Key
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* TAB 3: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <Card 
              id="settings-notifications-card" 
              title="Notification Settings" 
              subtitle="Control digest alerts and system triggers."
            >
              <form onSubmit={handleSaveNotifications} className="space-y-5">
                
                {notifSaved && (
                  <div id="notif-success-alert" className="p-3 bg-emerald-50 border border-emerald-250 text-emerald-800 rounded-xl flex items-center gap-2 text-xs font-semibold animate-fade-in">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Notification triggers saved. Alerts are now routed appropriately.</span>
                  </div>
                )}

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Notifications</h4>
                  
                  <div className="space-y-3">
                    {/* Switch 1: Syllabus & Assignments */}
                    <div className="flex items-center justify-between p-3 border border-slate-100 hover:border-slate-200 rounded-xl transition-all">
                      <div className="space-y-0.5">
                        <p className="text-xs sm:text-sm font-bold text-slate-800">Syllabus & Coursework Announcements</p>
                        <p className="text-[10px] sm:text-xs text-slate-400">Receive an email catalog detail upon assignment posts or syllabus changes.</p>
                      </div>
                      <button
                        type="button"
                        id="notif-toggle-syllabus"
                        onClick={() => setNotifSyllabus(!notifSyllabus)}
                        className={cn(
                          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                          notifSyllabus ? 'bg-indigo-600' : 'bg-slate-200'
                        )}
                      >
                        <span className={cn(
                          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                          notifSyllabus ? 'translate-x-5' : 'translate-x-0'
                        )} />
                      </button>
                    </div>

                    {/* Switch 2: Global Broadcasts */}
                    <div className="flex items-center justify-between p-3 border border-slate-100 hover:border-slate-200 rounded-xl transition-all">
                      <div className="space-y-0.5">
                        <p className="text-xs sm:text-sm font-bold text-slate-800">Real-time Global Announcements</p>
                        <p className="text-[10px] sm:text-xs text-slate-400">Receive instant dispatch summaries of target classroom announcements.</p>
                      </div>
                      <button
                        type="button"
                        id="notif-toggle-announce"
                        onClick={() => setNotifAnnounce(!notifAnnounce)}
                        className={cn(
                          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                          notifAnnounce ? 'bg-indigo-600' : 'bg-slate-200'
                        )}
                      >
                        <span className={cn(
                          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                          notifAnnounce ? 'translate-x-5' : 'translate-x-0'
                        )} />
                      </button>
                    </div>

                    {/* Switch 3: Attendance Reminders */}
                    <div className="flex items-center justify-between p-3 border border-slate-100 hover:border-slate-200 rounded-xl transition-all">
                      <div className="space-y-0.5">
                        <p className="text-xs sm:text-sm font-bold text-slate-800">Attendance Register Logging Inactivity Alerts</p>
                        <p className="text-[10px] sm:text-xs text-slate-400">Get automatic reminders when a scheduled lecture ends without attendance marked.</p>
                      </div>
                      <button
                        type="button"
                        id="notif-toggle-attnd"
                        onClick={() => setNotifAttnd(!notifAttnd)}
                        className={cn(
                          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                          notifAttnd ? 'bg-indigo-600' : 'bg-slate-200'
                        )}
                      >
                        <span className={cn(
                          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                          notifAttnd ? 'translate-x-5' : 'translate-x-0'
                        )} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mailing Digests Frequency</h4>
                  <div>
                    <select
                      id="notif-select-digest"
                      value={notifEmailDigest}
                      onChange={(e) => setNotifEmailDigest(e.target.value)}
                      className="px-3 py-2 border border-slate-200 text-sm rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-72 font-semibold"
                    >
                      <option value="none">Disabled (No recurring digests)</option>
                      <option value="instant">Instant Dispatch (Failsafe)</option>
                      <option value="daily">Daily Summary Bullet List</option>
                      <option value="weekly">Weekly Friday Academic Report</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">In-App Live Stream Actions</h4>
                  <div className="flex items-center justify-between p-3 border border-slate-100 hover:border-slate-200 rounded-xl transition-all">
                    <div className="space-y-0.5">
                      <p className="text-xs sm:text-sm font-bold text-slate-800">Browser Native Banner Push Notifications</p>
                      <p className="text-[10px] sm:text-xs text-slate-400">Trigger standard floating cards during lecture slot activations.</p>
                    </div>
                    <button
                      type="button"
                      id="notif-toggle-browser"
                      onClick={() => setNotifBrowserPush(!notifBrowserPush)}
                      className={cn(
                        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                        notifBrowserPush ? 'bg-indigo-600' : 'bg-slate-200'
                      )}
                    >
                      <span className={cn(
                        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                        notifBrowserPush ? 'translate-x-5' : 'translate-x-0'
                      )} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <Button 
                    id="notif-btn-save"
                    type="submit"
                    className="bg-indigo-600 text-white hover:bg-indigo-700 h-9 text-xs sm:text-sm font-bold"
                  >
                    Save Preferences
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* TAB 4: APPEARANCE */}
          {activeTab === 'appearance' && (
            <Card 
              id="settings-appearance-card" 
              title="Appearance & Themes" 
              subtitle="Customize the graphic visual interface of your teacher panel."
            >
              <form onSubmit={handleSaveAppearance} className="space-y-6">
                
                {appearanceSaved && (
                  <div id="appearance-success-alert" className="p-3 bg-emerald-50 border border-emerald-250 text-emerald-800 rounded-xl flex items-center gap-2 text-xs font-semibold animate-fade-in">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Visual layout adjustments applied. Color keys synchronized.</span>
                  </div>
                )}

                {/* Theme Mode Choices */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dynamic Layout Palette</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'light' as const, name: '☀️ Classic Light', desc: 'Standard high-contrast grey' },
                      { id: 'dark' as const, name: '🌙 Cozy Dark', desc: 'Comfortable slate night canvas' },
                      { id: 'slate' as const, name: '🎨 Indigo Hue Blend', desc: 'Vibrant indigo accents' }
                    ].map((theme) => (
                      <button
                        key={theme.id}
                        id={`appearance-theme-btn-${theme.id}`}
                        type="button"
                        onClick={() => setThemeMode(theme.id)}
                        className={cn(
                          "flex flex-col text-left p-3.5 border rounded-xl transition-all shadow-sm justify-between min-h-[90px]",
                          themeMode === theme.id 
                            ? "bg-white border-indigo-600 ring-2 ring-indigo-100" 
                            : "bg-slate-50 hover:bg-slate-100/80 border-slate-200"
                        )}
                      >
                        <span className="text-xs font-bold text-slate-900">{theme.name}</span>
                        <span className="text-[10px] text-slate-400 mt-2 font-medium">{theme.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Accent Palette Picker */}
                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Brand Highlight Color Accent</h4>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { id: 'indigo' as const, color: 'bg-indigo-600', name: 'Indigo Signature' },
                      { id: 'emerald' as const, color: 'bg-emerald-600', name: 'Emerald Green' },
                      { id: 'violet' as const, color: 'bg-violet-600', name: 'Royal Violet' },
                      { id: 'blue' as const, color: 'bg-blue-600', name: 'Sky Cadet' },
                      { id: 'rose' as const, color: 'bg-rose-600', name: 'Sunset Rose' },
                    ].map((accent) => (
                      <button
                        key={accent.id}
                        id={`appearance-accent-btn-${accent.id}`}
                        type="button"
                        onClick={() => setAccentColor(accent.id)}
                        className={cn(
                          "px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all",
                          accentColor === accent.id 
                            ? "bg-slate-900 border-slate-900 text-white" 
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                        )}
                      >
                        <span className={cn("w-2.5 h-2.5 rounded-full shrink-0", accent.color)} />
                        {accent.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Density Settings */}
                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">UI Information Density</h4>
                  <div className="grid grid-cols-2 gap-3 max-w-md">
                    {[
                      { id: 'standard' as const, label: 'Spacious Standard', text: 'Comfortable spacing for screens.' },
                      { id: 'compact' as const, label: 'Compact Matrix', text: 'Tight margins to fits lists together.' }
                    ].map((d) => (
                      <button
                        key={d.id}
                        id={`appearance-density-btn-${d.id}`}
                        type="button"
                        onClick={() => setDensity(d.id)}
                        className={cn(
                          "p-3 text-left border rounded-xl transition-all shadow-sm flex flex-col justify-between min-h-[75px]",
                          density === d.id 
                            ? "bg-indigo-50/40 border-indigo-500 ring-1 ring-indigo-500/20" 
                            : "bg-slate-50 border-slate-200 hover:bg-slate-100/50"
                        )}
                      >
                        <span className="text-xs font-bold text-slate-900">{d.label}</span>
                        <span className="text-[10px] text-slate-400 mt-1 font-medium">{d.text}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <Button 
                    id="appearance-btn-save"
                    type="submit"
                    className="bg-indigo-600 text-white hover:bg-indigo-700 h-9 text-xs sm:text-sm font-bold"
                  >
                    Apply Theme Accent
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* TAB 5: LANGUAGE & REGION */}
          {activeTab === 'language' && (
            <Card 
              id="settings-language-card" 
              title="Language & Regional Preferences" 
              subtitle="Setup date alignments, local times, and multi-lingual interfaces."
            >
              <form onSubmit={handleSaveLanguage} className="space-y-4">
                
                {langSaved && (
                  <div id="language-success-alert" className="p-3 bg-emerald-50 border border-emerald-250 text-emerald-800 rounded-xl flex items-center gap-2 text-xs font-semibold animate-fade-in">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Regional locales and calendar indices changed successfully.</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Language Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Interface Language</label>
                    <select
                      id="language-select"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 text-sm rounded-lg bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="English (US)">English (US Standard)</option>
                      <option value="Hindi">हिन्दी (Hindi)</option>
                      <option value="Spanish">Español (Spanish)</option>
                      <option value="German">Deutsch (German)</option>
                      <option value="French">Français (French)</option>
                    </select>
                  </div>

                  {/* Time Zone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Timezone Coordinates</label>
                    <select
                      id="timezone-select"
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 text-sm rounded-lg bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="IST (UTC+05:30)">Kolkata / IST (UTC+05:30)</option>
                      <option value="UTC-08:00">Pacific Time (UTC-08:00)</option>
                      <option value="GMT+00:00">Greenwich Mean Time (GMT+00:00)</option>
                      <option value="JST (UTC+09:00)">Tokyo / JST (UTC+09:00)</option>
                    </select>
                  </div>

                  {/* Calendar First Day */}
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Week First Day</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Sunday', 'Monday'].map((day) => (
                        <button
                          key={day}
                          id={`lang-firstday-btn-${day}`}
                          type="button"
                          onClick={() => setFirstDayOfWeek(day)}
                          className={cn(
                            "py-2 px-3 border text-xs font-bold rounded-lg transition-all text-center",
                            firstDayOfWeek === day 
                              ? "bg-slate-900 border-slate-950 text-white shadow-sm"
                              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                          )}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <Button 
                    id="language-btn-save"
                    type="submit"
                    className="bg-indigo-600 text-white hover:bg-indigo-700 h-9 text-xs sm:text-sm font-bold"
                  >
                    Apply Regional Locales
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* TAB 6: PRIVACY */}
          {activeTab === 'privacy' && (
            <Card 
              id="settings-privacy-card" 
              title="Privacy Controls & Directories" 
              subtitle="Tweak visibility permissions for student indexes and system listings."
            >
              <form onSubmit={handleSavePrivacy} className="space-y-5">
                
                {privacySaved && (
                  <div id="privacy-success-alert" className="p-3 bg-emerald-50 border border-emerald-250 text-emerald-800 rounded-xl flex items-center gap-2 text-xs font-semibold animate-fade-in">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Privacy parameters updated. Directories are now restricted accordingly.</span>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Switch 1: Hide Profile */}
                  <div className="flex items-center justify-between p-3 border border-slate-100 hover:border-slate-200 rounded-xl transition-all">
                    <div className="space-y-0.5">
                      <p className="text-xs sm:text-sm font-bold text-slate-800">Conceal Teacher Profile from Public Directory</p>
                      <p className="text-[10px] sm:text-xs text-slate-400">Only authorized administration staff will find your office details and email key.</p>
                    </div>
                    <button
                      type="button"
                      id="privacy-toggle-hideprofile"
                      onClick={() => setHideProfile(!hideProfile)}
                      className={cn(
                        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                        hideProfile ? 'bg-indigo-600' : 'bg-slate-200'
                      )}
                    >
                      <span className={cn(
                        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                        hideProfile ? 'translate-x-5' : 'translate-x-0'
                      )} />
                    </button>
                  </div>

                  {/* Switch 2: Active status */}
                  <div className="flex items-center justify-between p-3 border border-slate-100 hover:border-slate-200 rounded-xl transition-all">
                    <div className="space-y-0.5">
                      <p className="text-xs sm:text-sm font-bold text-slate-800">Show Online / Active indicator</p>
                      <p className="text-[10px] sm:text-xs text-slate-400">Permit students to see when you are active on the notes generation engine.</p>
                    </div>
                    <button
                      type="button"
                      id="privacy-toggle-indicator"
                      onClick={() => setActiveIndicator(!activeIndicator)}
                      className={cn(
                        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                        activeIndicator ? 'bg-indigo-600' : 'bg-slate-200'
                      )}
                    >
                      <span className={cn(
                        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                        activeIndicator ? 'translate-x-5' : 'translate-x-0'
                      )} />
                    </button>
                  </div>

                  {/* Restrict Roster Views selection dropdown */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Roster Classbook Visibility</label>
                    <select
                      id="privacy-select-restrictview"
                      value={restrictRosterView}
                      onChange={(e) => setRestrictRosterView(e.target.value)}
                      className="px-3 py-2 border border-slate-200 text-sm rounded-lg bg-white w-full sm:w-72 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="all">Permitted to Class (Full Roster)</option>
                      <option value="faculty">Authorized Faculty Only</option>
                      <option value="admins">Admin and Dean Staff Only</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-150">
                  <h4 className="text-xs font-bold text-red-650 text-red-600 uppercase tracking-wider">Dangerous Territory</h4>
                  <p className="text-[11px] text-slate-400 mt-1">Downloading data reports or purging system credentials.</p>
                  
                  <div className="flex gap-2.5 mt-3">
                    <Button 
                      id="privacy-btn-export"
                      variant="outline" 
                      onClick={() => alert("Downloading CSV of your active worksheets...")}
                      className="text-xs py-1.5 h-8 font-semibold"
                    >
                      Export Worksheet Data
                    </Button>
                    <button 
                      type="button"
                      id="privacy-btn-delete"
                      onClick={() => {
                        if (confirm("Deactivating account removes all assignments and notes archives. This action is irreversible. Continue?")) {
                          alert("Profile disabled successfully. Re-sync via the launcher.");
                        }
                      }}
                      className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-rose-50 text-xs font-semibold rounded-lg"
                    >
                      Delete Account Profile
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-150">
                  <Button 
                    id="privacy-btn-save"
                    type="submit"
                    className="bg-indigo-600 text-white hover:bg-indigo-700 h-9 text-xs sm:text-sm font-bold"
                  >
                    Save Privacy Directives
                  </Button>
                </div>
              </form>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}

