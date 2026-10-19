import React, { useState, useEffect } from 'react';
import {
  Plus, Trash2, Edit2, Clock, Calendar, Lock, Download, Check,
  X, RefreshCw, CheckCircle2, AlertCircle, Link2, Search, Filter, Shield, Globe, LogIn, LogOut
} from 'lucide-react';
import { formatTimeSlot } from '../utils/scheduler';
import { TRANSLATIONS } from '../utils/translations';

export default function AdminDashboard({
  meetingTypes,
  onSaveMeetingTypes,
  workingHours,
  onSaveWorkingHours,
  blockedDates,
  onSaveBlockedDates,
  bookings,
  onUpdateBookingStatus,
  googleCalendar,
  onSaveGoogleCalendar,
  isAdminAuthenticated,
  onAdminLogin,
  onAdminLogout,
  lang = 'EN'
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.EN;

  const [activeTab, setActiveTab] = useState('BOOKINGS'); // 'BOOKINGS' | 'TYPES' | 'HOURS' | 'BLOCKED' | 'GOOGLE'

  // Admin password login state
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Search & Filter state for Bookings
  const [bookingSearch, setBookingSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Meeting Type Form modal state
  const [editingType, setEditingType] = useState(null);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [typeForm, setTypeForm] = useState({ title: '', duration: 30, description: '', location: 'Google Meet', color: '#3878bc' });

  // Blocked Date Form state
  const [newBlockedDate, setNewBlockedDate] = useState('');
  const [newBlockedReason, setNewBlockedReason] = useState('');

  // Working Hours editable copy
  const [hoursState, setHoursState] = useState(workingHours);

  // Google Calendar simulator/API test status
  const [isSyncing, setIsSyncing] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [serverConnection, setServerConnection] = useState({
    loading: true,
    connected: false,
    accountEmail: null,
  });

  // Fetch real Google OAuth connection status from backend when Admin is authenticated
  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchServerConnectionStatus();
    } else {
      setServerConnection({
        loading: false,
        connected: false,
        accountEmail: null,
      });
    }
  }, [isAdminAuthenticated]);

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ password: loginPassword }),
      });

      const data = await response.json();

      if (response.ok && data.authenticated) {
        onAdminLogin(data.email);
        setLoginPassword('');
      } else {
        setLoginError(data.error || t.invalidPassword);
      }
    } catch (err) {
      setLoginError('Failed to connect to authentication endpoint.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const fetchServerConnectionStatus = async () => {
    try {
      setServerConnection(prev => ({ ...prev, loading: true }));
      const response = await fetch('/api/google/oauth/status', {
        credentials: 'same-origin',
      });

      if (response.ok) {
        const data = await response.json();
        setServerConnection({
          loading: false,
          connected: !!data.connected,
          accountEmail: data.accountEmail || (data.connected ? 'admin@mbglobal.com' : null),
        });
        if (data.connected) {
          onSaveGoogleCalendar({
            ...googleCalendar,
            connected: true,
            accountEmail: data.accountEmail || 'admin@mbglobal.com',
            syncStatus: 'synced',
            lastSyncedAt: data.lastSyncedAt || new Date().toISOString()
          });
        }
      } else {
        setServerConnection({
          loading: false,
          connected: false,
          accountEmail: null,
        });
      }
    } catch (err) {
      setServerConnection({
        loading: false,
        connected: false,
        accountEmail: null,
      });
    }
  };

  // Trigger Google OAuth 2.0 Connect Flow via authenticated server route (relies on HttpOnly session cookie)
  const handleConnectGoogleOAuth = () => {
    if (!isAdminAuthenticated) return;
    window.location.href = '/api/google/oauth/start';
  };

  // Disconnect Google OAuth via authenticated server route
  const handleDisconnectGoogleOAuth = async () => {
    if (!confirm('Are you sure you want to disconnect Google Calendar?')) return;
    try {
      await fetch('/api/google/oauth/disconnect', {
        method: 'POST',
        credentials: 'same-origin',
      });
    } catch (err) {
      console.error('Error sending disconnect request:', err);
    } finally {
      onSaveGoogleCalendar({
        ...googleCalendar,
        connected: false,
        accountEmail: '',
        syncStatus: 'disconnected'
      });
      setServerConnection({
        loading: false,
        connected: false,
        accountEmail: null
      });
    }
  };

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.userName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.userEmail.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.companyName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.id.toLowerCase().includes(bookingSearch.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Export Bookings to CSV
  const exportToCSV = () => {
    const headers = ['Booking ID', 'Meeting Type', 'Date', 'Time', 'Duration (mins)', 'User Name', 'Email', 'Phone', 'Company', 'Status', 'Notes', 'Google Meet Link', 'Google Event ID'];
    const rows = bookings.map(b => [
      b.id,
      `"${b.meetingTypeTitle.replace(/"/g, '""')}"`,
      b.date,
      b.time,
      b.duration,
      `"${b.userName.replace(/"/g, '""')}"`,
      `"${b.userEmail.replace(/"/g, '""')}"`,
      `"${b.userPhone.replace(/"/g, '""')}"`,
      `"${b.companyName.replace(/"/g, '""')}"`,
      b.status,
      `"${(b.notes || '').replace(/"/g, '""')}"`,
      b.meetingLink,
      b.googleEventId || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mb_global_bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Bookings to JSON
  const exportToJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(bookings, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `mb_global_bookings_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Save / Add Meeting Type
  const handleSaveTypeModal = (e) => {
    e.preventDefault();
    let updated = [...meetingTypes];
    if (editingType) {
      updated = updated.map(t => t.id === editingType.id ? { ...t, ...typeForm } : t);
    } else {
      const newType = {
        id: `mt-${Date.now()}`,
        ...typeForm,
        active: true
      };
      updated.push(newType);
    }
    onSaveMeetingTypes(updated);
    setIsTypeModalOpen(false);
    setEditingType(null);
  };

  const handleDeleteType = (id) => {
    if (confirm('Are you sure you want to delete this meeting type?')) {
      onSaveMeetingTypes(meetingTypes.filter(t => t.id !== id));
    }
  };

  const handleToggleTypeActive = (id) => {
    onSaveMeetingTypes(meetingTypes.map(t => t.id === id ? { ...t, active: !t.active } : t));
  };

  // Add Blocked Date
  const handleAddBlockedDate = (e) => {
    e.preventDefault();
    if (!newBlockedDate) return;
    const newEntry = {
      id: `bd-${Date.now()}`,
      date: newBlockedDate,
      reason: newBlockedReason || 'Blocked Date'
    };
    onSaveBlockedDates([...blockedDates, newEntry]);
    setNewBlockedDate('');
    setNewBlockedReason('');
  };

  const handleDeleteBlockedDate = (id) => {
    onSaveBlockedDates(blockedDates.filter(bd => bd.id !== id));
  };

  // Save Working Hours
  const handleSaveHours = () => {
    onSaveWorkingHours(hoursState);
    alert('Working hours and slot intervals updated successfully!');
  };

  // Test Live Google Calendar Connection
  const handleTestCalendarConnection = async () => {
    setIsSyncing(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/google/calendar/test', {
        credentials: 'same-origin',
      });
      const data = await response.json();

      if (response.ok && data.connected) {
        setTestResult({
          success: true,
          message: `Successfully connected to Google Calendar API (${data.accountEmail}). Timezone: ${data.timeZone || 'Africa/Dar_es_Salaam'}. Status: ${data.status}`,
        });
        onSaveGoogleCalendar({
          ...googleCalendar,
          connected: true,
          accountEmail: data.accountEmail || googleCalendar.accountEmail,
          lastSyncedAt: new Date().toISOString(),
          syncStatus: 'synced'
        });
      } else {
        setTestResult({
          success: false,
          message: data.error || 'Failed to connect to Google Calendar API via server endpoint',
        });
      }
    } catch (err) {
      setTestResult({
        success: false,
        message: 'Error verifying Google Calendar connection: ' + err.message,
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Render Login Modal if Admin is not authenticated
  if (!isAdminAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 dark:bg-mb-surface bg-white border dark:border-mb-border border-slate-200 rounded-2xl shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-mb-blue/20 text-mb-blue rounded-xl flex items-center justify-center mx-auto border border-mb-blue/30">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold font-heading dark:text-mb-white text-slate-900">{t.adminAuthTitle}</h2>
          <p className="text-xs dark:text-mb-textMuted text-slate-600">{t.adminAuthPrompt}</p>
        </div>

        {loginError && (
          <div className="p-3 bg-red-950/20 border border-red-800 text-red-500 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span>{loginError}</span>
          </div>
        )}

        <form onSubmit={handlePasswordLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase dark:text-mb-textMuted text-slate-700 mb-1">{t.adminPassword}</label>
            <input
              type="password"
              required
              placeholder={t.adminPassword}
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full dark:bg-mb-dark bg-slate-50 border dark:border-mb-border border-slate-300 rounded-lg p-3 text-sm dark:text-mb-white text-slate-900 focus:outline-none focus:border-mb-blue"
            />
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-mb-blue hover:bg-mb-accentHover disabled:opacity-50 text-white font-semibold py-3 rounded-lg text-sm transition flex items-center justify-center gap-2 shadow-md"
          >
            <LogIn className="w-4 h-4" />
            {isLoggingIn ? t.authenticating : t.signInAdmin}
          </button>
        </form>
      </div>
    );
  }

  const isConnected = serverConnection.connected;
  const currentEmail = serverConnection.accountEmail || t.disconnected;

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      {/* Admin Title & Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b dark:border-mb-border border-slate-200">
        <div>
          <h2 className="text-2xl font-bold font-heading flex items-center gap-2 dark:text-mb-white text-slate-900">
            <span className="bg-mb-blue text-white px-2.5 py-0.5 rounded text-sm font-bold">ADMIN</span>
            {t.adminPortalHeader}
          </h2>
          <p className="text-sm dark:text-mb-textMuted text-slate-600 mt-1 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-mb-blue" />
            {t.configuredTimezone} <span className="dark:text-mb-white text-slate-900 font-medium">Africa/Dar_es_Salaam</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportToCSV}
            className="dark:bg-mb-surface bg-white hover:bg-slate-50 dark:hover:bg-mb-surfaceLight dark:text-mb-textLight text-slate-700 border dark:border-mb-border border-slate-200 px-3 py-2 rounded-lg text-xs font-medium transition flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-mb-blue" /> {t.exportCSV}
          </button>
          <button
            onClick={exportToJSON}
            className="dark:bg-mb-surface bg-white hover:bg-slate-50 dark:hover:bg-mb-surfaceLight dark:text-mb-textLight text-slate-700 border dark:border-mb-border border-slate-200 px-3 py-2 rounded-lg text-xs font-medium transition flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-mb-blue" /> {t.exportJSON}
          </button>
          <button
            onClick={onAdminLogout}
            className="bg-red-950/20 hover:bg-red-900/30 text-red-500 border border-red-200 dark:border-red-900/50 px-3 py-2 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ml-2 shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" /> {t.signOut}
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex border-b dark:border-mb-border border-slate-200 mb-6 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('BOOKINGS')}
          className={`px-4 py-2.5 font-medium text-sm border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'BOOKINGS'
              ? 'border-mb-blue text-mb-blue font-semibold'
              : 'border-transparent dark:text-mb-textMuted text-slate-600 hover:text-mb-blue'
          }`}
        >
          <Calendar className="w-4 h-4" /> {t.tabBookings} ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab('TYPES')}
          className={`px-4 py-2.5 font-medium text-sm border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'TYPES'
              ? 'border-mb-blue text-mb-blue font-semibold'
              : 'border-transparent dark:text-mb-textMuted text-slate-600 hover:text-mb-blue'
          }`}
        >
          <Clock className="w-4 h-4" /> {t.tabMeetingTypes} ({meetingTypes.length})
        </button>
        <button
          onClick={() => setActiveTab('HOURS')}
          className={`px-4 py-2.5 font-medium text-sm border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'HOURS'
              ? 'border-mb-blue text-mb-blue font-semibold'
              : 'border-transparent dark:text-mb-textMuted text-slate-600 hover:text-mb-blue'
          }`}
        >
          <Clock className="w-4 h-4" /> {t.tabWorkingHours}
        </button>
        <button
          onClick={() => setActiveTab('BLOCKED')}
          className={`px-4 py-2.5 font-medium text-sm border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'BLOCKED'
              ? 'border-mb-blue text-mb-blue font-semibold'
              : 'border-transparent dark:text-mb-textMuted text-slate-600 hover:text-mb-blue'
          }`}
        >
          <Lock className="w-4 h-4" /> {t.tabBlockedDates} ({blockedDates.length})
        </button>
        <button
          onClick={() => setActiveTab('GOOGLE')}
          className={`px-4 py-2.5 font-medium text-sm border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'GOOGLE'
              ? 'border-mb-blue text-mb-blue font-semibold'
              : 'border-transparent dark:text-mb-textMuted text-slate-600 hover:text-mb-blue'
          }`}
        >
          <Link2 className="w-4 h-4" /> {t.tabGoogleCalendar}
        </button>
      </div>

      {/* TAB 1: BOOKINGS LIST */}
      {activeTab === 'BOOKINGS' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-3 dark:bg-mb-surface bg-white p-4 rounded-xl border dark:border-mb-border border-slate-200 shadow-sm">
            <div className="relative flex-grow">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                className="w-full dark:bg-mb-dark bg-slate-50 border dark:border-mb-border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm dark:text-mb-white text-slate-900 focus:outline-none focus:border-mb-blue"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="dark:bg-mb-dark bg-slate-50 border dark:border-mb-border border-slate-300 rounded-lg px-3 py-2 text-sm dark:text-mb-white text-slate-900 focus:outline-none focus:border-mb-blue"
              >
                <option value="ALL">{t.allStatuses}</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Rescheduled">Rescheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="dark:bg-mb-surface bg-white rounded-xl border dark:border-mb-border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="dark:bg-mb-dark bg-slate-100 border-b dark:border-mb-border border-slate-200 text-xs uppercase dark:text-mb-textMuted text-slate-600 font-semibold">
                  <tr>
                    <th className="px-4 py-3">{t.colRefId}</th>
                    <th className="px-4 py-3">{t.colAttendee}</th>
                    <th className="px-4 py-3">{t.colType}</th>
                    <th className="px-4 py-3">{t.colDateTime}</th>
                    <th className="px-4 py-3">{t.colStatus}</th>
                    <th className="px-4 py-3 text-right">{t.colMeet}</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-mb-border divide-slate-200">
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((b) => (
                      <tr key={b.id} className="dark:hover:bg-mb-surfaceLight/50 hover:bg-slate-50 transition">
                        <td className="px-4 py-3.5 font-mono text-xs text-mb-blue font-semibold">{b.id}</td>
                        <td className="px-4 py-3.5">
                          <div className="font-semibold dark:text-mb-white text-slate-900">{b.userName}</div>
                          <div className="text-xs dark:text-mb-textMuted text-slate-500">{b.companyName} &bull; {b.userEmail}</div>
                          <div className="text-xs dark:text-mb-textMuted text-slate-500">{b.userPhone}</div>
                        </td>
                        <td className="px-4 py-3.5 font-medium dark:text-mb-white text-slate-900">{b.meetingTypeTitle}</td>
                        <td className="px-4 py-3.5">
                          <div className="font-medium dark:text-mb-white text-slate-900">{b.date}</div>
                          <div className="text-xs dark:text-mb-textMuted text-slate-500">{formatTimeSlot(b.time)} ({b.duration} {t.mins})</div>
                        </td>
                        <td className="px-4 py-3.5">
                          <select
                            value={b.status}
                            onChange={(e) => onUpdateBookingStatus(b.id, e.target.value)}
                            className={`px-2.5 py-1 rounded text-xs font-semibold focus:outline-none border cursor-pointer ${
                              b.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30' :
                              b.status === 'Rescheduled' ? 'bg-amber-500/20 text-amber-500 border-amber-500/30' :
                              b.status === 'Completed' ? 'bg-blue-500/20 text-blue-500 border-blue-500/30' :
                              'bg-red-500/20 text-red-500 border-red-500/30'
                            }`}
                          >
                            <option value="Confirmed" className="dark:bg-mb-dark bg-white text-slate-900 dark:text-white">Confirmed</option>
                            <option value="Rescheduled" className="dark:bg-mb-dark bg-white text-slate-900 dark:text-white">Rescheduled</option>
                            <option value="Completed" className="dark:bg-mb-dark bg-white text-slate-900 dark:text-white">Completed</option>
                            <option value="Cancelled" className="dark:bg-mb-dark bg-white text-slate-900 dark:text-white">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <a
                            href={b.meetingLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-mb-blue hover:underline dark:bg-mb-dark bg-slate-100 px-2.5 py-1 rounded border dark:border-mb-border border-slate-200"
                          >
                            <Link2 className="w-3 h-3" /> Meet
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center dark:text-mb-textMuted text-slate-500 text-sm">
                        {t.noBookingsFound}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MEETING TYPES MANAGEMENT */}
      {activeTab === 'TYPES' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold font-heading dark:text-mb-white text-slate-900">{t.tabMeetingTypes}</h3>
            <button
              onClick={() => {
                setEditingType(null);
                setTypeForm({ title: '', duration: 30, description: '', location: 'Google Meet', color: '#3878bc' });
                setIsTypeModalOpen(true);
              }}
              className="bg-mb-blue hover:bg-mb-accentHover text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" /> {t.createMeetingType}
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {meetingTypes.map((type) => (
              <div key={type.id} className="dark:bg-mb-surface bg-white border dark:border-mb-border border-slate-200 p-5 rounded-xl flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: type.color }} />
                    <button
                      onClick={() => handleToggleTypeActive(type.id)}
                      className={`text-xs px-2 py-0.5 rounded font-semibold border ${
                        type.active ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30' : 'bg-gray-500/20 text-gray-500 border-gray-500/30'
                      }`}
                    >
                      {type.active ? t.active : t.disabled}
                    </button>
                  </div>
                  <h4 className="font-bold font-heading text-lg dark:text-mb-white text-slate-900 mb-1">{type.title}</h4>
                  <p className="text-xs dark:text-mb-textMuted text-slate-600 mb-4 line-clamp-2">{type.description}</p>
                </div>

                <div className="pt-4 border-t dark:border-mb-border border-slate-200 flex justify-between items-center">
                  <span className="text-xs dark:text-mb-textMuted text-slate-500 font-medium">{type.duration} {t.mins} &bull; {type.location}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingType(type);
                        setTypeForm({
                          title: type.title,
                          duration: type.duration,
                          description: type.description,
                          location: type.location,
                          color: type.color
                        });
                        setIsTypeModalOpen(true);
                      }}
                      className="p-1.5 dark:hover:bg-mb-border hover:bg-slate-100 rounded dark:text-mb-textMuted text-slate-600 transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteType(type.id)}
                      className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/50 rounded text-red-500 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: WORKING HOURS SETTINGS */}
      {activeTab === 'HOURS' && (
        <div className="dark:bg-mb-surface bg-white p-6 rounded-xl border dark:border-mb-border border-slate-200 space-y-6 shadow-sm">
          <div className="flex justify-between items-center border-b dark:border-mb-border border-slate-200 pb-4">
            <div>
              <h3 className="text-lg font-bold font-heading dark:text-mb-white text-slate-900">{t.weeklySchedule}</h3>
              <p className="text-xs dark:text-mb-textMuted text-slate-600">Set business hours in <span className="font-semibold text-mb-blue">Africa/Dar_es_Salaam</span>.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs dark:text-mb-textMuted text-slate-600">{t.slotDuration}</span>
              <select
                value={hoursState.slotInterval}
                onChange={(e) => setHoursState({ ...hoursState, slotInterval: Number(e.target.value) })}
                className="dark:bg-mb-dark bg-slate-50 border dark:border-mb-border border-slate-300 rounded-lg px-3 py-1.5 text-xs dark:text-mb-white text-slate-900 focus:outline-none focus:border-mb-blue"
              >
                <option value={15}>15 {t.mins}</option>
                <option value={30}>30 {t.mins}</option>
                <option value={45}>45 {t.mins}</option>
                <option value={60}>60 {t.mins}</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {Object.keys(hoursState.days).map((dayKey) => {
              const day = hoursState.days[dayKey];
              return (
                <div key={dayKey} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 dark:bg-mb-dark bg-slate-50 rounded-lg border dark:border-mb-border border-slate-200 gap-3">
                  <div className="flex items-center gap-3 min-w-[140px]">
                    <input
                      type="checkbox"
                      checked={day.enabled}
                      onChange={(e) => {
                        const updatedDays = { ...hoursState.days, [dayKey]: { ...day, enabled: e.target.checked } };
                        setHoursState({ ...hoursState, days: updatedDays });
                      }}
                      className="w-4 h-4 accent-mb-blue rounded cursor-pointer"
                    />
                    <span className="capitalize font-semibold text-sm dark:text-mb-white text-slate-900">{dayKey}</span>
                  </div>

                  {day.enabled ? (
                    <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-mb-textLight">
                      <span>From</span>
                      <input
                        type="time"
                        value={day.start}
                        onChange={(e) => {
                          const updatedDays = { ...hoursState.days, [dayKey]: { ...day, start: e.target.value } };
                          setHoursState({ ...hoursState, days: updatedDays });
                        }}
                        className="dark:bg-mb-surface bg-white border dark:border-mb-border border-slate-300 rounded px-2 py-1 dark:text-white text-slate-900 focus:outline-none focus:border-mb-blue"
                      />
                      <span>To</span>
                      <input
                        type="time"
                        value={day.end}
                        onChange={(e) => {
                          const updatedDays = { ...hoursState.days, [dayKey]: { ...day, end: e.target.value } };
                          setHoursState({ ...hoursState, days: updatedDays });
                        }}
                        className="dark:bg-mb-surface bg-white border dark:border-mb-border border-slate-300 rounded px-2 py-1 dark:text-white text-slate-900 focus:outline-none focus:border-mb-blue"
                      />
                    </div>
                  ) : (
                    <span className="text-xs dark:text-mb-textMuted text-slate-400 italic">Unavailable</span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4 border-t dark:border-mb-border border-slate-200">
            <button
              onClick={handleSaveHours}
              className="bg-mb-blue hover:bg-mb-accentHover text-white px-6 py-2 rounded-lg text-sm font-medium transition shadow-md"
            >
              {t.saveSchedule}
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: BLOCKED DATES */}
      {activeTab === 'BLOCKED' && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="dark:bg-mb-surface bg-white p-5 rounded-xl border dark:border-mb-border border-slate-200 md:col-span-1 h-fit shadow-sm">
            <h3 className="text-lg font-bold font-heading dark:text-mb-white text-slate-900 mb-1">{t.blockDateTitle}</h3>

            <form onSubmit={handleAddBlockedDate} className="space-y-3 mt-4">
              <div>
                <label className="block text-xs font-semibold uppercase dark:text-mb-textMuted text-slate-700 mb-1">Select Date</label>
                <input
                  type="date"
                  value={newBlockedDate}
                  onChange={(e) => setNewBlockedDate(e.target.value)}
                  className="w-full dark:bg-mb-dark bg-slate-50 border dark:border-mb-border border-slate-300 rounded-lg p-2.5 text-sm dark:text-mb-white text-slate-900 focus:outline-none focus:border-mb-blue"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase dark:text-mb-textMuted text-slate-700 mb-1">{t.reasonLabel}</label>
                <input
                  type="text"
                  placeholder="e.g. Public Holiday, Team Outing"
                  value={newBlockedReason}
                  onChange={(e) => setNewBlockedReason(e.target.value)}
                  className="w-full dark:bg-mb-dark bg-slate-50 border dark:border-mb-border border-slate-300 rounded-lg p-2.5 text-sm dark:text-mb-white text-slate-900 focus:outline-none focus:border-mb-blue"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-mb-blue hover:bg-mb-accentHover text-white py-2.5 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" /> {t.addBlockedDate}
              </button>
            </form>
          </div>

          <div className="dark:bg-mb-surface bg-white p-5 rounded-xl border dark:border-mb-border border-slate-200 md:col-span-2 shadow-sm">
            <h3 className="text-lg font-bold font-heading dark:text-mb-white text-slate-900 mb-4">{t.currentlyBlocked}</h3>
            {blockedDates.length > 0 ? (
              <div className="space-y-2">
                {blockedDates.map((bd) => (
                  <div key={bd.id} className="flex justify-between items-center p-3 dark:bg-mb-dark bg-slate-50 rounded-lg border dark:border-mb-border border-slate-200">
                    <div>
                      <span className="font-semibold text-sm dark:text-mb-white text-slate-900">{bd.date}</span>
                      <span className="text-xs dark:text-mb-textMuted text-slate-500 ml-3">&bull; {bd.reason}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteBlockedDate(bd.id)}
                      className="text-red-500 p-1 hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm dark:text-mb-textMuted text-slate-500 text-center py-8">No blocked dates currently configured.</p>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: REAL GOOGLE CALENDAR INTEGRATION */}
      {activeTab === 'GOOGLE' && (
        <div className="dark:bg-mb-surface bg-white p-6 rounded-xl border dark:border-mb-border border-slate-200 max-w-2xl mx-auto space-y-6 shadow-sm">
          <div className="flex items-center gap-4 border-b dark:border-mb-border border-slate-200 pb-4">
            <div className="w-12 h-12 bg-blue-600/20 text-mb-blue rounded-xl flex items-center justify-center border border-mb-blue/30">
              <Link2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-heading dark:text-mb-white text-slate-900">{t.gcalIntegrationTitle}</h3>
              <p className="text-xs dark:text-mb-textMuted text-slate-500">OAuth 2.0 connection, real event sync, and Google Meet link generation in Africa/Dar_es_Salaam timezone.</p>
            </div>
          </div>

          <div className="dark:bg-mb-dark bg-slate-50 p-4 rounded-xl border dark:border-mb-border border-slate-200 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm dark:text-mb-textMuted text-slate-600">{t.oauthStatus}</span>
              <span className={`px-2.5 py-0.5 rounded text-xs font-semibold flex items-center gap-1 ${
                isConnected ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30' : 'bg-red-500/20 text-red-500 border border-red-500/30'
              }`}>
                <CheckCircle2 className="w-3 h-3" /> {isConnected ? t.connected : t.disconnected}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="dark:text-mb-textMuted text-slate-600">{t.connectedAccount}</span>
              <span className="font-medium dark:text-mb-white text-slate-900">{isConnected ? currentEmail : t.disconnected}</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="dark:text-mb-textMuted text-slate-600">OAuth Redirect URI:</span>
              <span className="font-mono text-xs text-mb-blue">https://work-try-ons.vercel.app/api/google/oauth/callback</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="dark:text-mb-textMuted text-slate-600">{t.lastSynced}</span>
              <span className="text-xs dark:text-mb-textMuted text-slate-500">{new Date(googleCalendar.lastSyncedAt).toLocaleString()}</span>
            </div>
          </div>

          {testResult && (
            <div className={`p-4 rounded-xl text-xs space-y-1 ${
              testResult.success ? 'bg-emerald-950/20 border border-emerald-800 text-emerald-500' : 'bg-red-950/20 border border-red-800 text-red-500'
            }`}>
              <p className="font-semibold flex items-center gap-1">
                {testResult.success ? <Check className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
                {testResult.success ? 'Test Connection Successful' : 'Test Connection Failed'}
              </p>
              <p>{testResult.message}</p>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={googleCalendar.autoAddMeetLink}
                onChange={(e) => onSaveGoogleCalendar({ ...googleCalendar, autoAddMeetLink: e.target.checked })}
                className="w-4 h-4 accent-mb-blue rounded"
              />
              <span className="text-sm dark:text-mb-white text-slate-900">{t.autoAddMeet}</span>
            </label>
          </div>

          <div className="flex justify-between items-center pt-4 border-t dark:border-mb-border border-slate-200">
            <button
              onClick={() => {
                if (isConnected) {
                  handleDisconnectGoogleOAuth();
                } else {
                  handleConnectGoogleOAuth();
                }
              }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                isConnected ? 'bg-red-950/20 text-red-500 border border-red-200 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-900/30' : 'bg-mb-blue hover:bg-mb-accentHover text-white shadow-md'
              }`}
            >
              {isConnected ? t.disconnectGCal : t.connectGCal}
            </button>

            <button
              onClick={handleTestCalendarConnection}
              disabled={isSyncing || !isConnected}
              className="bg-mb-blue hover:bg-mb-accentHover disabled:opacity-50 text-white px-5 py-2 rounded-lg text-xs font-medium transition flex items-center gap-1.5 shadow-md"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Testing...' : t.testConnection}
            </button>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MEETING TYPE MODAL */}
      {isTypeModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="dark:bg-mb-surface bg-white border dark:border-mb-border border-slate-200 rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold font-heading dark:text-mb-white text-slate-900">{editingType ? t.edit : t.createMeetingType}</h3>
              <button onClick={() => setIsTypeModalOpen(false)} className="dark:text-mb-textMuted text-slate-400 hover:text-mb-blue">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTypeModal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase dark:text-mb-textMuted text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Discovery Call"
                  value={typeForm.title}
                  onChange={(e) => setTypeForm({ ...typeForm, title: e.target.value })}
                  className="w-full dark:bg-mb-dark bg-slate-50 border dark:border-mb-border border-slate-300 rounded-lg p-2.5 text-sm dark:text-mb-white text-slate-900 focus:outline-none focus:border-mb-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase dark:text-mb-textMuted text-slate-700 mb-1">Duration (minutes) *</label>
                <input
                  type="number"
                  required
                  min={15}
                  max={240}
                  step={15}
                  value={typeForm.duration}
                  onChange={(e) => setTypeForm({ ...typeForm, duration: Number(e.target.value) })}
                  className="w-full dark:bg-mb-dark bg-slate-50 border dark:border-mb-border border-slate-300 rounded-lg p-2.5 text-sm dark:text-mb-white text-slate-900 focus:outline-none focus:border-mb-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase dark:text-mb-textMuted text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief description..."
                  value={typeForm.description}
                  onChange={(e) => setTypeForm({ ...typeForm, description: e.target.value })}
                  className="w-full dark:bg-mb-dark bg-slate-50 border dark:border-mb-border border-slate-300 rounded-lg p-2.5 text-sm dark:text-mb-white text-slate-900 focus:outline-none focus:border-mb-blue resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase dark:text-mb-textMuted text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={typeForm.location}
                    onChange={(e) => setTypeForm({ ...typeForm, location: e.target.value })}
                    className="w-full dark:bg-mb-dark bg-slate-50 border dark:border-mb-border border-slate-300 rounded-lg p-2.5 text-sm dark:text-mb-white text-slate-900 focus:outline-none focus:border-mb-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase dark:text-mb-textMuted text-slate-700 mb-1">Accent Color</label>
                  <input
                    type="color"
                    value={typeForm.color}
                    onChange={(e) => setTypeForm({ ...typeForm, color: e.target.value })}
                    className="w-full h-10 dark:bg-mb-dark bg-slate-50 border dark:border-mb-border border-slate-300 rounded-lg p-1 cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-4 border-t dark:border-mb-border border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTypeModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium dark:bg-mb-dark bg-slate-100 hover:bg-slate-200 dark:hover:bg-mb-border dark:text-mb-textLight text-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-medium bg-mb-blue hover:bg-mb-accentHover text-white transition shadow-md"
                >
                  {t.saveType}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
