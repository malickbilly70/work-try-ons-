// Production Data Storage & Google Calendar API Service for MB Global

export const INITIAL_MEETING_TYPES = [
  {
    id: 'mt-1',
    title: 'Strategy & Advisory Session',
    duration: 30, // in minutes
    description: 'Discuss strategic initiatives, business growth plans, and high-level project goals with MB Global experts.',
    location: 'Google Meet',
    color: '#3878bc',
    active: true,
  },
  {
    id: 'mt-2',
    title: 'Technical Consultation',
    duration: 60,
    description: 'Deep-dive architectural review, system integration assessment, and technical problem solving.',
    location: 'Google Meet',
    color: '#2563eb',
    active: true,
  },
  {
    id: 'mt-3',
    title: 'Enterprise Product Demo',
    duration: 45,
    description: 'A customized walkthrough of MB Global platform solutions tailored to your organization needs.',
    location: 'Google Meet',
    color: '#0d9488',
    active: true,
  }
];

export const INITIAL_WORKING_HOURS = {
  timezone: 'Africa/Dar_es_Salaam',
  days: {
    monday: { enabled: true, start: '09:00', end: '17:00' },
    tuesday: { enabled: true, start: '09:00', end: '17:00' },
    wednesday: { enabled: true, start: '09:00', end: '17:00' },
    thursday: { enabled: true, start: '09:00', end: '17:00' },
    friday: { enabled: true, start: '09:00', end: '17:00' },
    saturday: { enabled: false, start: '10:00', end: '14:00' },
    sunday: { enabled: false, start: '10:00', end: '14:00' },
  },
  slotInterval: 30, // in minutes
};

export const INITIAL_BLOCKED_DATES = [
  {
    id: 'bd-1',
    date: '2026-12-25',
    reason: 'Christmas Holiday',
  },
  {
    id: 'bd-2',
    date: '2026-01-01',
    reason: 'New Year Day',
  }
];

export const INITIAL_GOOGLE_CALENDAR = {
  connected: false,
  accountEmail: '',
  primaryCalendarId: 'primary',
  autoAddMeetLink: true,
  syncStatus: 'disconnected',
  lastSyncedAt: new Date().toISOString(),
  redirectUri: 'https://work-try-ons.vercel.app/api/google/oauth/callback',
  calendarEvents: []
};

export const INITIAL_BOOKINGS = [
  {
    id: 'mb-bk-101',
    meetingTypeId: 'mt-1',
    meetingTypeTitle: 'Strategy & Advisory Session',
    duration: 30,
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    time: '10:00',
    timezone: 'Africa/Dar_es_Salaam',
    userName: 'John Doe',
    userEmail: 'john.doe@acme.corp',
    userPhone: '+1 (555) 234-5678',
    companyName: 'Acme Corp',
    notes: 'Looking forward to discussing our expansion strategy in Africa/Dar_es_Salaam.',
    status: 'Confirmed',
    meetingLink: 'https://meet.google.com/mbg-strat-101',
    googleEventId: 'gcal-mb-bk-101',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'mb-bk-102',
    meetingTypeId: 'mt-2',
    meetingTypeTitle: 'Technical Consultation',
    duration: 60,
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // Day after tomorrow
    time: '14:00',
    timezone: 'Africa/Dar_es_Salaam',
    userName: 'Sarah Jenkins',
    userEmail: 's.jenkins@innovate.io',
    userPhone: '+1 (555) 987-6543',
    companyName: 'Innovate Tech',
    notes: 'API integration security compliance review.',
    status: 'Confirmed',
    meetingLink: 'https://meet.google.com/mbg-tech-102',
    googleEventId: 'gcal-mb-bk-102',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  }
];

const STORAGE_KEYS = {
  MEETING_TYPES: 'mb_global_meeting_types',
  WORKING_HOURS: 'mb_global_working_hours',
  BLOCKED_DATES: 'mb_global_blocked_dates',
  GOOGLE_CALENDAR: 'mb_global_google_calendar',
  BOOKINGS: 'mb_global_bookings',
};

export function getStoredData(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

export function setStoredData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
}

export function initializeStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.MEETING_TYPES)) {
    setStoredData(STORAGE_KEYS.MEETING_TYPES, INITIAL_MEETING_TYPES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.WORKING_HOURS)) {
    setStoredData(STORAGE_KEYS.WORKING_HOURS, INITIAL_WORKING_HOURS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.BLOCKED_DATES)) {
    setStoredData(STORAGE_KEYS.BLOCKED_DATES, INITIAL_BLOCKED_DATES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.GOOGLE_CALENDAR)) {
    setStoredData(STORAGE_KEYS.GOOGLE_CALENDAR, INITIAL_GOOGLE_CALENDAR);
  }
  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    setStoredData(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  }
}

export function generateMeetingLink(id) {
  return `https://meet.google.com/mbg-${id.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
}

export { STORAGE_KEYS };
