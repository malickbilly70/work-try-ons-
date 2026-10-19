import React, { useState, useEffect } from 'react';
import { Calendar, Shield, Globe } from 'lucide-react';
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

export default function App() {
  const [currentView, setCurrentView] = useState('USER'); // 'USER' | 'ADMIN'

  // Admin Session State
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('mb_admin_token') || null);

  // Persistent States
  const [meetingTypes, setMeetingTypes] = useState([]);
  const [workingHours, setWorkingHours] = useState(INITIAL_WORKING_HOURS);
  const [blockedDates, setBlockedDates] = useState([]);
  const [googleCalendar, setGoogleCalendar] = useState(INITIAL_GOOGLE_CALENDAR);
  const [bookings, setBookings] = useState([]);

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
      setCurrentView('ADMIN');
    }
  }, []);

  const handleAdminLogin = (token) => {
    setAdminToken(token);
    localStorage.setItem('mb_admin_token', token);
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
    localStorage.removeItem('mb_admin_token');
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

  return (
    <div className="min-h-screen bg-mb-dark text-mb-white flex flex-col justify-between selection:bg-mb-blue selection:text-white">
      {/* Top Main Navigation Header */}
      <header className="border-b border-mb-border bg-mb-dark/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-mb-blue flex items-center justify-center font-black text-white text-lg shadow-lg shadow-mb-blue/20">
              MB
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none tracking-tight text-mb-white">MB GLOBAL</h1>
              <p className="text-xs text-mb-textMuted tracking-wider uppercase font-medium mt-0.5">Appointment Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-mb-surface p-1 rounded-xl border border-mb-border">
            <button
              onClick={() => setCurrentView('USER')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                currentView === 'USER'
                  ? 'bg-mb-blue text-white shadow-md'
                  : 'text-mb-textMuted hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" /> Client View
            </button>
            <button
              onClick={() => setCurrentView('ADMIN')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                currentView === 'ADMIN'
                  ? 'bg-mb-blue text-white shadow-md'
                  : 'text-mb-textMuted hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" /> Admin Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Main App Content Body */}
      <main className="flex-grow py-6">
        {currentView === 'USER' ? (
          <UserBookingFlow
            meetingTypes={meetingTypes}
            workingHours={workingHours}
            blockedDates={blockedDates}
            bookings={bookings}
            onCreateBooking={handleCreateBooking}
            onUpdateBookingStatus={handleUpdateBookingStatus}
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
            adminToken={adminToken}
            onAdminLogin={handleAdminLogin}
            onAdminLogout={handleAdminLogout}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-mb-border bg-mb-surface/30 py-6 text-center text-xs text-mb-textMuted">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-mb-blue" />
            <span>&copy; {new Date().getFullYear()} MB Global. All rights reserved.</span>
          </div>
          <p>Powered by MB Global Appointment System &bull; Brand Palette #12141e, #3878bc, #ffffff</p>
        </div>
      </footer>
    </div>
  );
}
