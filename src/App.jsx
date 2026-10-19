import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import UserBookingFlow from './components/UserBookingFlow';
import AdminDashboard from './components/AdminDashboard';
import {
  STORAGE_KEYS,
  INITIAL_MEETING_TYPES,
  INITIAL_WORKING_HOURS,
  INITIAL_BLOCKED_DATES,
  INITIAL_GOOGLE_CALENDAR,
  INITIAL_BOOKINGS,
  getStoredData,
  setStoredData,
  initializeStorage
} from './services/storage';
import {
  getLanguagePreference,
  setLanguagePreference,
  getThemePreference,
  setThemePreference,
  TRANSLATIONS
} from './utils/translations';

export default function App() {
  // Routing state based on window.location.pathname
  const [route, setRoute] = useState(() => {
    return window.location.pathname === '/admin' ? '/admin' : '/';
  });

  // Language & Theme states
  const [lang, setLang] = useState(getLanguagePreference);
  const [theme, setTheme] = useState(getThemePreference);

  // Admin Session State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => localStorage.getItem('mb_admin_authenticated') === 'true');

  // Persistent States
  const [meetingTypes, setMeetingTypes] = useState([]);
  const [workingHours, setWorkingHours] = useState(INITIAL_WORKING_HOURS);
  const [blockedDates, setBlockedDates] = useState([]);
  const [googleCalendar, setGoogleCalendar] = useState(INITIAL_GOOGLE_CALENDAR);
  const [bookings, setBookings] = useState([]);

  // Sync theme with HTML document root class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Sync route on popstate (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setRoute(window.location.pathname === '/admin' ? '/admin' : '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Initialize and Load Data
  useEffect(() => {
    initializeStorage();
    setMeetingTypes(getStoredData(STORAGE_KEYS.MEETING_TYPES, INITIAL_MEETING_TYPES));
    setWorkingHours(getStoredData(STORAGE_KEYS.WORKING_HOURS, INITIAL_WORKING_HOURS));
    setBlockedDates(getStoredData(STORAGE_KEYS.BLOCKED_DATES, INITIAL_BLOCKED_DATES));
    setGoogleCalendar(getStoredData(STORAGE_KEYS.GOOGLE_CALENDAR, INITIAL_GOOGLE_CALENDAR));
    setBookings(getStoredData(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS));

    // Check for Google OAuth callback URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('google_connected') === 'true') {
      navigate('/admin');
    }
  }, []);

  const navigate = (newPath) => {
    window.history.pushState({}, '', newPath);
    setRoute(newPath === '/admin' ? '/admin' : '/');
  };

  const handleLanguageChange = (newLang) => {
    setLang(newLang);
    setLanguagePreference(newLang);
  };

  const handleThemeToggle = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    setThemePreference(nextTheme);
  };

  const handleAdminLogin = (email) => {
    setIsAdminAuthenticated(true);
    localStorage.setItem('mb_admin_authenticated', 'true');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('mb_admin_authenticated');
  };

  // Handlers for User Flow
  const handleCreateBooking = (newBooking) => {
    const updated = [newBooking, ...bookings];
    setBookings(updated);
    setStoredData(STORAGE_KEYS.BOOKINGS, updated);
  };

  const handleUpdateBookingStatus = (bookingId, status, extraFields = {}) => {
    const updated = bookings.map((b) =>
      b.id === bookingId ? { ...b, status, ...extraFields } : b
    );
    setBookings(updated);
    setStoredData(STORAGE_KEYS.BOOKINGS, updated);
  };

  // Handlers for Admin Flow
  const handleSaveMeetingTypes = (updatedTypes) => {
    setMeetingTypes(updatedTypes);
    setStoredData(STORAGE_KEYS.MEETING_TYPES, updatedTypes);
  };

  const handleSaveWorkingHours = (updatedHours) => {
    setWorkingHours(updatedHours);
    setStoredData(STORAGE_KEYS.WORKING_HOURS, updatedHours);
  };

  const handleSaveBlockedDates = (updatedBlocked) => {
    setBlockedDates(updatedBlocked);
    setStoredData(STORAGE_KEYS.BLOCKED_DATES, updatedBlocked);
  };

  const handleSaveGoogleCalendar = (updatedGCal) => {
    setGoogleCalendar(updatedGCal);
    setStoredData(STORAGE_KEYS.GOOGLE_CALENDAR, updatedGCal);
  };

  const t = TRANSLATIONS[lang] || TRANSLATIONS.EN;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-mb-dark text-slate-900 dark:text-mb-white flex flex-col justify-between transition-colors duration-200 selection:bg-mb-blue selection:text-white">
      {/* Navigation Header */}
      <Header
        lang={lang}
        onLanguageChange={handleLanguageChange}
        theme={theme}
        onThemeToggle={handleThemeToggle}
        route={route}
        onNavigate={navigate}
      />

      {/* Main App Content Body */}
      <main className="flex-grow py-6">
        {route === '/' ? (
          <UserBookingFlow
            meetingTypes={meetingTypes}
            workingHours={workingHours}
            blockedDates={blockedDates}
            bookings={bookings}
            onCreateBooking={handleCreateBooking}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            lang={lang}
          />
        ) : (
          <AdminDashboard
            meetingTypes={meetingTypes}
            onSaveMeetingTypes={handleSaveMeetingTypes}
            workingHours={workingHours}
            onSaveWorkingHours={handleSaveWorkingHours}
            blockedDates={blockedDates}
            onSaveBlockedDates={handleSaveBlockedDates}
            bookings={bookings}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            googleCalendar={googleCalendar}
            onSaveGoogleCalendar={handleSaveGoogleCalendar}
            isAdminAuthenticated={isAdminAuthenticated}
            onAdminLogin={handleAdminLogin}
            onAdminLogout={handleAdminLogout}
            lang={lang}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-mb-border bg-white dark:bg-mb-surface/30 py-6 text-center text-xs dark:text-mb-textMuted text-slate-500 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>&copy; {new Date().getFullYear()} {t.allRightsReserved}</span>
          <p>MB Global &bull; {t.slogan}</p>
        </div>
      </footer>
    </div>
  );
}
